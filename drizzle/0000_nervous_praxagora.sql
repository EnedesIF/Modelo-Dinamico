CREATE TABLE `group_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(40) NOT NULL,
	`isCoordinator` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `group_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `group_workspaces` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupId` int NOT NULL,
	`documentJson` text NOT NULL,
	`metricsJson` text NOT NULL,
	`progress` int NOT NULL DEFAULT 0,
	`qualityScore` int NOT NULL DEFAULT 0,
	`qualityLevel` varchar(32) NOT NULL DEFAULT 'Em construção',
	`lastSavedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `group_workspaces_id` PRIMARY KEY(`id`),
	CONSTRAINT `group_workspaces_group_unique` UNIQUE(`groupId`)
);
--> statement-breakpoint
CREATE TABLE `learning_activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(64) NOT NULL,
	`ownerId` int,
	`title` varchar(180) NOT NULL,
	`guidelines` text NOT NULL,
	`contractJson` text NOT NULL,
	`goalsJson` text NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learning_activities_id` PRIMARY KEY(`id`),
	CONSTRAINT `learning_activities_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `student_groups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`activityId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`accessCode` varchar(24) NOT NULL,
	`status` enum('active','submitted') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `student_groups_id` PRIMARY KEY(`id`),
	CONSTRAINT `student_groups_access_code_unique` UNIQUE(`accessCode`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE INDEX `group_members_group_idx` ON `group_members` (`groupId`);--> statement-breakpoint
CREATE INDEX `group_workspaces_quality_idx` ON `group_workspaces` (`qualityScore`);--> statement-breakpoint
CREATE INDEX `student_groups_activity_idx` ON `student_groups` (`activityId`);