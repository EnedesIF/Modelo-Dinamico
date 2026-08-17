import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Identidades autenticadas pela plataforma. O papel admin é reservado ao professor.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/** A configuração central da turma e do contrato de decisão. */
export const learningActivities = mysqlTable("learning_activities", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 64 }).notNull().unique(),
  ownerId: int("ownerId"),
  title: varchar("title", { length: 180 }).notNull(),
  guidelines: text("guidelines").notNull(),
  contractJson: text("contractJson").notNull(),
  goalsJson: text("goalsJson").notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Um grupo de trabalho possui um código de acesso, sem exigir login individual. */
export const studentGroups = mysqlTable(
  "student_groups",
  {
    id: int("id").autoincrement().primaryKey(),
    activityId: int("activityId").notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    accessCode: varchar("accessCode", { length: 24 }).notNull(),
    status: mysqlEnum("status", ["active", "submitted"]).default("active").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("student_groups_access_code_unique").on(table.accessCode),
    index("student_groups_activity_idx").on(table.activityId),
  ],
);

/** Dados de contato: visíveis somente ao grupo correspondente e ao professor. */
export const groupMembers = mysqlTable(
  "group_members",
  {
    id: int("id").autoincrement().primaryKey(),
    groupId: int("groupId").notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 40 }).notNull(),
    isCoordinator: int("isCoordinator").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("group_members_group_idx").on(table.groupId)],
);

/** Documento vivo do grupo e métricas calculadas no servidor para o dashboard. */
export const groupWorkspaces = mysqlTable(
  "group_workspaces",
  {
    id: int("id").autoincrement().primaryKey(),
    groupId: int("groupId").notNull(),
    documentJson: text("documentJson").notNull(),
    metricsJson: text("metricsJson").notNull(),
    progress: int("progress").default(0).notNull(),
    qualityScore: int("qualityScore").default(0).notNull(),
    qualityLevel: varchar("qualityLevel", { length: 32 }).default("Em construção").notNull(),
    lastSavedAt: timestamp("lastSavedAt").defaultNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("group_workspaces_group_unique").on(table.groupId),
    index("group_workspaces_quality_idx").on(table.qualityScore),
  ],
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
