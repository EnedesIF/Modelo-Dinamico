import { count, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { nanoid } from "nanoid";
import { groupMembers, groupWorkspaces, learningActivities, studentGroups, type InsertUser, users } from "../drizzle/schema";
import { isActivityReleased } from "../shared/activity";
import { canManageActivity } from "../shared/teacherAccess";
import { projectGroupProgress } from "../shared/groupProgress";
import { calculateQuality, createEmptyWorkspace, parseWorkspaceJson, type WorkspaceDocument } from "../shared/quality";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

const DEFAULT_CONTRACT = {
  decisionMaker: "Diretoria de Crescimento",
  decision: "Definir qual iniciativa de mercado deve receber prioridade estratégica.",
  deadline: "Ao final da atividade",
  alternatives: "Comparar as alternativas propostas para a frente selecionada.",
  criteria: "Atratividade, evidências, risco, capacidade e velocidade de execução.",
  constraints: "Tempo da atividade, recursos disponíveis e informações verificáveis.",
  consequence: "Uma recomendação frágil aumenta o risco de priorizar a alternativa errada.",
};
const DEFAULT_GOALS = ["Mapear concorrentes e posicionamento de mercado", "Identificar tendências que impactam o setor", "Avaliar oportunidades de diferenciação", "Propor critérios para acompanhar resultados"];

function parseJson<T>(value: string, fallback: T): T { try { return JSON.parse(value) as T; } catch { return fallback; } }
function hydrateActivity(row: typeof learningActivities.$inferSelect) {
  return { ...row, configured: Boolean(row.ownerId), released: isActivityReleased(row), contract: parseJson(row.contractJson, DEFAULT_CONTRACT), goals: parseJson(row.goalsJson, DEFAULT_GOALS) };
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.role = values.role;
  updateSet.lastSignedIn = values.lastSignedIn;
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const [result] = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result;
}

export async function getOrCreateActivity() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  const key = "turma-principal";
  let [activity] = await db.select().from(learningActivities).where(eq(learningActivities.key, key)).limit(1);
  if (!activity) {
    await db.insert(learningActivities).values({ key, title: "Inteligência de Mercado para MBA", guidelines: "", contractJson: JSON.stringify(DEFAULT_CONTRACT), goalsJson: JSON.stringify(DEFAULT_GOALS), isActive: 0 });
    [activity] = await db.select().from(learningActivities).where(eq(learningActivities.key, key)).limit(1);
  }
  if (!activity!.ownerId && activity!.isActive) {
    await db.update(learningActivities).set({ isActive: 0 }).where(eq(learningActivities.id, activity!.id));
    [activity] = await db.select().from(learningActivities).where(eq(learningActivities.key, key)).limit(1);
  }
  return hydrateActivity(activity!);
}

export async function updateActivity(requesterId: number, requesterIsAdmin: boolean, input: { title: string; guidelines: string; contract: typeof DEFAULT_CONTRACT; goals: string[]; isActive: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  const activity = await getOrCreateActivity();
  if (!canManageActivity(activity.ownerId, requesterId, requesterIsAdmin)) throw new Error("Esta turma já possui um professor responsável.");
  await db.update(learningActivities).set({ ownerId: activity.ownerId ?? requesterId, title: input.title, guidelines: input.guidelines, contractJson: JSON.stringify(input.contract), goalsJson: JSON.stringify(input.goals), isActive: input.isActive ? 1 : 0 }).where(eq(learningActivities.id, activity.id));
  return getOrCreateActivity();
}

export type NewMember = { name: string; email: string; phone: string };
export async function registerGroup(input: { name: string; members: NewMember[] }) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  const activity = await getOrCreateActivity();
  if (!isActivityReleased(activity)) throw new Error("A atividade ainda não foi configurada e liberada pelo professor.");
  const [aggregate] = await db.select({ total: count() }).from(studentGroups).where(eq(studentGroups.activityId, activity.id));
  if ((aggregate?.total ?? 0) >= 6) throw new Error("Esta turma já possui os seis grupos cadastrados.");
  const accessCode = nanoid(12).toUpperCase();
  const result = await db.insert(studentGroups).values({ activityId: activity.id, name: input.name.trim(), accessCode });
  const groupId = Number(result[0].insertId);
  await db.insert(groupMembers).values(input.members.map((member, index) => ({ groupId, name: member.name.trim(), email: member.email.trim().toLowerCase(), phone: member.phone.trim(), isCoordinator: index === 0 ? 1 : 0 })));
  const workspace = createEmptyWorkspace();
  const quality = calculateQuality(workspace);
  await db.insert(groupWorkspaces).values({ groupId, documentJson: JSON.stringify(workspace), metricsJson: JSON.stringify(quality), progress: quality.progress, qualityScore: quality.score, qualityLevel: quality.level });
  return { groupId, accessCode, activity };
}

async function findGroupByCode(accessCode: string) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  const [group] = await db.select().from(studentGroups).where(eq(studentGroups.accessCode, accessCode.trim().toUpperCase())).limit(1);
  if (!group) throw new Error("Código do grupo não encontrado.");
  return { db, group };
}

export async function getGroupWorkspace(accessCode: string) {
  const { db, group } = await findGroupByCode(accessCode);
  const [workspace] = await db.select().from(groupWorkspaces).where(eq(groupWorkspaces.groupId, group.id)).limit(1);
  const members = await db.select().from(groupMembers).where(eq(groupMembers.groupId, group.id));
  if (!workspace) throw new Error("Espaço de trabalho não encontrado.");
  return { group, members, workspace: { ...workspace, document: parseWorkspaceJson(workspace.documentJson), metrics: parseJson(workspace.metricsJson, calculateQuality(createEmptyWorkspace())) } };
}

export async function saveGroupWorkspace(accessCode: string, document: WorkspaceDocument) {
  const { db, group } = await findGroupByCode(accessCode);
  const normalized = parseWorkspaceJson(document);
  const quality = calculateQuality(normalized);
  const now = new Date();
  await db.update(groupWorkspaces).set({ documentJson: JSON.stringify(normalized), metricsJson: JSON.stringify(quality), progress: quality.progress, qualityScore: quality.score, qualityLevel: quality.level, lastSavedAt: now }).where(eq(groupWorkspaces.groupId, group.id));
  await db.update(studentGroups).set({ updatedAt: now }).where(eq(studentGroups.id, group.id));
  return { quality, savedAt: now };
}

/** Retorna apenas indicadores agregados para o benchmarking entre grupos. */
export async function getPublicGroupProgress(accessCode: string) {
  const { db, group: currentGroup } = await findGroupByCode(accessCode);
  const [activity] = await db.select().from(learningActivities).where(eq(learningActivities.id, currentGroup.activityId)).limit(1);
  if (!activity || !isActivityReleased(hydrateActivity(activity))) throw new Error("A atividade ainda não está liberada.");
  const groups = await db.select().from(studentGroups).where(eq(studentGroups.activityId, currentGroup.activityId));
  const workspaces = await db.select().from(groupWorkspaces);
  const workspaceByGroup = new Map(workspaces.map(item => [item.groupId, item]));
  return {
    released: isActivityReleased(hydrateActivity(activity)),
    groups: projectGroupProgress(groups.map(group => {
      const workspace = workspaceByGroup.get(group.id);
      return {
        id: group.id,
        name: group.name,
        progress: workspace?.progress ?? 0,
        qualityScore: workspace?.qualityScore ?? 0,
        qualityLevel: workspace?.qualityLevel ?? "Em construção",
        lastSavedAt: workspace?.lastSavedAt ?? null,
        metaReports: parseJson(workspace?.metricsJson ?? "", calculateQuality(createEmptyWorkspace())).metaReports.map(report => ({ metaIndex: report.metaIndex, progress: report.progress, score: report.score })),
      };
    }), currentGroup.id),
  };
}

export async function getTeacherDashboard(requesterId: number, requesterIsAdmin: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  const activity = await getOrCreateActivity();
  if (!canManageActivity(activity.ownerId, requesterId, requesterIsAdmin)) throw new Error("Esta turma já possui um professor responsável.");
  const groups = await db.select().from(studentGroups).where(eq(studentGroups.activityId, activity.id));
  const workspaces = await db.select().from(groupWorkspaces);
  const members = await db.select().from(groupMembers);
  const workspaceByGroup = new Map(workspaces.map(item => [item.groupId, item]));
  const membersByGroup = new Map<number, typeof members>();
  members.forEach(member => membersByGroup.set(member.groupId, [...(membersByGroup.get(member.groupId) ?? []), member]));
  return {
    activity,
    maxGroups: 6,
    groups: groups.map(group => {
      const workspace = workspaceByGroup.get(group.id);
      return {
        ...group,
        members: membersByGroup.get(group.id) ?? [],
        workspace: workspace ? { ...workspace, document: parseWorkspaceJson(workspace.documentJson), metrics: parseJson(workspace.metricsJson, calculateQuality(createEmptyWorkspace())) } : null,
      };
    }),
  };
}
