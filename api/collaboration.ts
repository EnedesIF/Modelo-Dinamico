import { createClient } from "@supabase/supabase-js";
import { calculateQuality, createEmptyWorkspace, normalizeWorkspace } from "../shared/quality";
import { projectGroupProgress } from "../shared/groupProgress";
import { assertSupabaseVariables } from "../shared/supabaseConfig";

type RequestLike = { method?: string; query?: Record<string, string | string[] | undefined>; headers: Record<string, string | string[] | undefined>; body?: unknown };
type ResponseLike = { status: (code: number) => ResponseLike; json: (payload: unknown) => void; setHeader: (name: string, value: string) => void };

const DEFAULT_CONTRACT = {
  decisionMaker: "Diretoria de Crescimento",
  decision: "Definir qual iniciativa de mercado deve receber prioridade estratégica.",
  deadline: "Ao final da atividade",
  alternatives: "Comparar as alternativas propostas para a frente selecionada.",
  criteria: "Atratividade, evidências, risco, capacidade e velocidade de execução.",
  constraints: "Tempo da atividade, recursos disponíveis e informações verificáveis.",
  consequence: "Uma recomendação frágil aumenta o risco de priorizar a alternativa errada.",
};

const DEFAULT_GOALS = [
  "Mapear concorrentes e posicionamento de mercado",
  "Identificar tendências que impactam o setor",
  "Avaliar oportunidades de diferenciação",
  "Propor critérios para acompanhar resultados",
];

function environment() {
  assertSupabaseVariables(process.env);
  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anonKey || !serviceKey) throw new Error("A conexão com o Supabase ainda não foi configurada no Vercel.");
  return { url, anonKey, serviceKey };
}

function presentActivity(activity: any) {
  return {
    id: activity.id,
    key: activity.key,
    title: activity.title,
    guidelines: activity.guidelines,
    contract: activity.contract ?? DEFAULT_CONTRACT,
    goals: Array.isArray(activity.goals) && activity.goals.length === 4 ? activity.goals : DEFAULT_GOALS,
    configured: Boolean(activity.owner_id),
    released: Boolean(activity.is_active),
    isActive: Boolean(activity.is_active),
    ownerId: activity.owner_id ?? null,
  };
}

async function getClients() {
  const values = environment();
  return {
    admin: createClient(values.url, values.serviceKey, { auth: { autoRefreshToken: false, persistSession: false } }),
    auth: createClient(values.url, values.anonKey, { auth: { autoRefreshToken: false, persistSession: false } }),
  };
}

async function ensureActivity(admin: any) {
  const key = "turma-principal";
  const existing = await admin.from("learning_activities").select("*").eq("key", key).maybeSingle();
  if (existing.error) throw new Error(existing.error.message);
  if (existing.data) return existing.data;
  const created = await admin.from("learning_activities").insert({ key, title: "Inteligência de Mercado para MBA", guidelines: "", contract: DEFAULT_CONTRACT, goals: DEFAULT_GOALS, is_active: false }).select("*").single();
  if (created.error) throw new Error(created.error.message);
  return created.data;
}

function accessCode() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
}

async function teacherUser(req: RequestLike, auth: any, admin: any) {
  const header = Array.isArray(req.headers.authorization) ? req.headers.authorization[0] : req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw new Error("Entre como professor para acessar esta área.");
  const current = await auth.auth.getUser(token);
  if (current.error || !current.data.user) throw new Error("Sua sessão de professor expirou. Entre novamente.");
  const user = current.data.user;
  const profile = { id: user.id, email: user.email ?? null, display_name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Professor", role: "teacher" };
  const upsert = await admin.from("profiles").upsert(profile, { onConflict: "id" });
  if (upsert.error) throw new Error(upsert.error.message);
  return user;
}

function input(req: RequestLike) {
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  return (req.body ?? {}) as Record<string, any>;
}

async function workspaceForGroup(admin: any, group: any) {
  const result = await admin.from("group_workspaces").select("*").eq("group_id", group.id).single();
  if (result.error) throw new Error(result.error.message);
  const workspace = result.data;
  return {
    ...workspace,
    document: normalizeWorkspace(workspace.document),
    metrics: workspace.metrics ?? calculateQuality(workspace.document),
    lastSavedAt: workspace.last_saved_at,
    qualityScore: workspace.quality_score,
    qualityLevel: workspace.quality_level,
  };
}

async function findGroup(admin: any, code: string) {
  const result = await admin.from("student_groups").select("*").eq("access_code", code.trim().toUpperCase()).maybeSingle();
  if (result.error) throw new Error(result.error.message);
  if (!result.data) throw new Error("Código do grupo não encontrado.");
  return result.data;
}

async function activity(admin: any) {
  return presentActivity(await ensureActivity(admin));
}

async function registerGroup(admin: any, payload: Record<string, any>) {
  const current = await ensureActivity(admin);
  if (!current.owner_id || !current.is_active) throw new Error("A atividade ainda não foi configurada e liberada pelo professor.");
  const members = Array.isArray(payload.members) ? payload.members : [];
  if (!payload.name?.trim() || members.length < 1) throw new Error("Informe o nome do grupo e ao menos um integrante.");
  const count = await admin.from("student_groups").select("id", { count: "exact", head: true }).eq("activity_id", current.id);
  if (count.error) throw new Error(count.error.message);
  if ((count.count ?? 0) >= 6) throw new Error("Esta turma já possui os seis grupos cadastrados.");
  const groupInsert = await admin.from("student_groups").insert({ activity_id: current.id, name: String(payload.name).trim(), access_code: accessCode() }).select("*").single();
  if (groupInsert.error) throw new Error(groupInsert.error.message);
  const group = groupInsert.data;
  const membersInsert = await admin.from("group_members").insert(members.map((member: any, index: number) => ({ group_id: group.id, name: String(member.name ?? "").trim(), email: String(member.email ?? "").trim().toLowerCase(), phone: String(member.phone ?? "").trim(), is_coordinator: index === 0 })));
  if (membersInsert.error) throw new Error(membersInsert.error.message);
  const document = createEmptyWorkspace();
  const quality = calculateQuality(document);
  const workspaceInsert = await admin.from("group_workspaces").insert({ group_id: group.id, document, metrics: quality, progress: quality.progress, quality_score: quality.score, quality_level: quality.level });
  if (workspaceInsert.error) throw new Error(workspaceInsert.error.message);
  return { groupId: group.id, accessCode: group.access_code, activity: presentActivity(current) };
}

async function groupWorkspace(admin: any, code: string) {
  const group = await findGroup(admin, code);
  const members = await admin.from("group_members").select("id, name, email, phone, is_coordinator").eq("group_id", group.id);
  if (members.error) throw new Error(members.error.message);
  return { group: { id: group.id, name: group.name, status: group.status }, members: members.data ?? [], workspace: await workspaceForGroup(admin, group) };
}

async function saveWorkspace(admin: any, code: string, documentInput: unknown) {
  const group = await findGroup(admin, code);
  const document = normalizeWorkspace(documentInput);
  const quality = calculateQuality(document);
  const now = new Date().toISOString();
  const updated = await admin.from("group_workspaces").update({ document, metrics: quality, progress: quality.progress, quality_score: quality.score, quality_level: quality.level, last_saved_at: now, updated_at: now }).eq("group_id", group.id);
  if (updated.error) throw new Error(updated.error.message);
  await admin.from("student_groups").update({ updated_at: now }).eq("id", group.id);
  return { quality, savedAt: now };
}

async function publicProgress(admin: any, code: string) {
  const current = await findGroup(admin, code);
  const active = await ensureActivity(admin);
  if (!active.is_active) throw new Error("A atividade ainda não está liberada.");
  const groupsResult = await admin.from("student_groups").select("*").eq("activity_id", current.activity_id);
  if (groupsResult.error) throw new Error(groupsResult.error.message);
  const groups = groupsResult.data ?? [];
  const ids = groups.map((group: any) => group.id);
  const workspacesResult = ids.length ? await admin.from("group_workspaces").select("*").in("group_id", ids) : { data: [], error: null };
  if (workspacesResult.error) throw new Error(workspacesResult.error.message);
  const workspaceById = new Map((workspacesResult.data ?? []).map((workspace: any) => [workspace.group_id, workspace]));
  return {
    released: true,
    groups: projectGroupProgress(groups.map((group: any) => {
      const workspace = workspaceById.get(group.id);
      const metrics = workspace?.metrics ?? calculateQuality(createEmptyWorkspace());
      return { id: group.id, name: group.name, progress: workspace?.progress ?? 0, qualityScore: workspace?.quality_score ?? 0, qualityLevel: workspace?.quality_level ?? "Em construção", lastSavedAt: workspace?.last_saved_at ? new Date(workspace.last_saved_at) : null, metaReports: metrics.metaReports ?? [] };
    }), current.id),
  };
}

async function teacherDashboard(req: RequestLike, admin: any, auth: any) {
  const user = await teacherUser(req, auth, admin);
  const current = await ensureActivity(admin);
  if (current.owner_id && current.owner_id !== user.id) throw new Error("Esta turma já possui um professor responsável.");
  const groupsResult = await admin.from("student_groups").select("*").eq("activity_id", current.id).order("created_at", { ascending: true });
  if (groupsResult.error) throw new Error(groupsResult.error.message);
  const groups = groupsResult.data ?? [];
  const ids = groups.map((group: any) => group.id);
  const workspacesResult = ids.length ? await admin.from("group_workspaces").select("*").in("group_id", ids) : { data: [], error: null };
  if (workspacesResult.error) throw new Error(workspacesResult.error.message);
  const workspaceById = new Map((workspacesResult.data ?? []).map((workspace: any) => [workspace.group_id, workspace]));
  return { activity: presentActivity(current), maxGroups: 6, groups: groups.map((group: any) => {
    const workspace = workspaceById.get(group.id);
    return { id: group.id, name: group.name, status: group.status, workspace: workspace ? { ...workspace, document: normalizeWorkspace(workspace.document), metrics: workspace.metrics ?? calculateQuality(workspace.document), qualityScore: workspace.quality_score, qualityLevel: workspace.quality_level } : null };
  }) };
}

async function updateTeacherActivity(req: RequestLike, admin: any, auth: any, payload: Record<string, any>) {
  const user = await teacherUser(req, auth, admin);
  const current = await ensureActivity(admin);
  if (current.owner_id && current.owner_id !== user.id) throw new Error("Esta turma já possui um professor responsável.");
  if (!Array.isArray(payload.goals) || payload.goals.length !== 4) throw new Error("Informe exatamente quatro metas.");
  const updated = await admin.from("learning_activities").update({ owner_id: user.id, title: String(payload.title ?? "").trim(), guidelines: String(payload.guidelines ?? "").trim(), contract: payload.contract ?? DEFAULT_CONTRACT, goals: payload.goals.map((goal: unknown) => String(goal).trim()), is_active: Boolean(payload.isActive), updated_at: new Date().toISOString() }).eq("id", current.id).select("*").single();
  if (updated.error) throw new Error(updated.error.message);
  return presentActivity(updated.data);
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "OPTIONS") { res.status(200).json({ ok: true }); return; }
  try {
    const { admin, auth } = await getClients();
    const action = Array.isArray(req.query?.action) ? req.query?.action[0] : req.query?.action;
    const payload = input(req);
    const result = action === "activity" ? await activity(admin)
      : action === "registerGroup" ? await registerGroup(admin, payload)
      : action === "workspace" ? await groupWorkspace(admin, String(payload.accessCode ?? ""))
      : action === "saveWorkspace" ? await saveWorkspace(admin, String(payload.accessCode ?? ""), payload.document)
      : action === "groupProgress" ? await publicProgress(admin, String(payload.accessCode ?? ""))
      : action === "teacherDashboard" ? await teacherDashboard(req, admin, auth)
      : action === "updateActivity" ? await updateTeacherActivity(req, admin, auth, payload)
      : null;
    if (result === null) throw new Error("Operação não reconhecida.");
    res.status(200).json({ data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível concluir esta operação.";
    const status = /sessão|professor responsável|Entre como professor/i.test(message) ? 401 : 400;
    res.status(status).json({ error: message });
  }
}
