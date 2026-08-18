import { createClient } from "@supabase/supabase-js";
import { calculateQuality, normalizeWorkspace } from "./quality.js";
import { assertSupabaseVariables } from "./supabaseConfig.js";

type RequestLike = { method?: string; headers: Record<string, string | string[] | undefined>; body?: unknown };
type ResponseLike = { status: (code: number) => ResponseLike; json: (payload: unknown) => void; setHeader: (name: string, value: string) => void };

function payload(req: RequestLike) {
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  return (req.body ?? {}) as Record<string, unknown>;
}

function environment() {
  assertSupabaseVariables(process.env);
  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  if (!url || !serviceKey) throw new Error("A conexão Supabase ainda não foi configurada no servidor.");
  if (!openAiKey) throw new Error("A análise por IA ainda não foi configurada pelo professor.");
  return { url, serviceKey, openAiKey };
}

function clip(value: unknown, max = 1200) {
  return String(value ?? "").trim().slice(0, max);
}

function compactDocument(document: any, metrics: any) {
  return {
    score: metrics.score,
    progress: metrics.progress,
    metaPlans: document.metaPlans.map((meta: any, index: number) => ({
      meta: index + 1,
      kit: clip(meta.kit, 500),
      fcs: meta.factors.map((factor: any) => ({
        title: clip(factor.title, 180),
        rationale: clip(factor.rationale, 280),
        indicator: clip(factor.indicator, 180),
        materiality: clip(factor.materiality, 10),
        kiqs: factor.kiqs.map((kiq: any) => ({ question: clip(kiq.question, 260), source: clip(kiq.source, 120), method: clip(kiq.method, 120), decisionSignal: clip(kiq.decisionSignal, 200), evaluability: clip(kiq.evaluability, 10) })),
      })),
      evidence: meta.evidence.map((item: any) => ({ fact: clip(item.evidence, 300), source: clip(item.source, 140), relevance: clip(item.relevance, 220), limitation: clip(item.limitation, 180), inference: clip(item.inference, 220) })),
      memo: {
        recommendation: clip(meta.memo.recommendation, 450),
        rationale: clip(meta.memo.rationale, 450),
        rejectedAlternatives: clip(meta.memo.rejectedAlternatives, 300),
        residualRisk: clip(meta.memo.residualRisk, 300),
        monitoringPlan: clip(meta.memo.monitoringPlan, 300),
      },
      metrics: metrics.metaReports[index],
    })),
    synthesis: document.realEstate?.synthesis ?? {},
    realEstateMetrics: metrics.realEstate ?? {},
  };
}

async function analyze(openAiKey: string, brief: unknown) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${openAiKey}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "diagnostico_formativo_mba",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              headline: { type: "string" },
              executiveRead: { type: "string" },
              strengths: { type: "array", items: { type: "string" } },
              gaps: { type: "array", items: { type: "string" } },
              contradictions: { type: "array", items: { type: "string" } },
              nextMoves: { type: "array", items: { type: "string" } },
              metaSignals: { type: "array", items: { type: "object", additionalProperties: false, properties: { meta: { type: "integer" }, signal: { type: "string" }, priority: { type: "string", enum: ["alta", "média", "baixa"] } }, required: ["meta", "signal", "priority"] } },
              caution: { type: "string" },
            },
            required: ["headline", "executiveRead", "strengths", "gaps", "contradictions", "nextMoves", "metaSignals", "caution"],
          },
        },
      },
      messages: [
        { role: "system", content: "Você é um analista formativo de MBA em Negócio Imobiliário. Avalie apenas a qualidade argumentativa, a consistência entre evidências e propostas e os riscos de decisão. Não dê nota, não invente dados, não faça recomendação financeira individual e não trate hipóteses como fatos. Escreva em português brasileiro, com linguagem executiva, respeitosa e acionável." },
        { role: "user", content: `Analise o seguinte dossiê de grupo. Produza uma devolutiva formativa que ajude o grupo a revisar a proposta antes do comitê. Dados: ${JSON.stringify(brief)}` },
      ],
    }),
  });
  if (!response.ok) throw new Error("A IA não respondeu agora. Tente novamente em alguns instantes.");
  const result = await response.json() as any;
  const content = result.choices?.[0]?.message?.content;
  if (!content) throw new Error("A IA não retornou uma análise utilizável.");
  return JSON.parse(content);
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "OPTIONS") { res.status(200).json({ ok: true }); return; }
  try {
    const { url, serviceKey, openAiKey } = environment();
    const input = payload(req);
    const accessCode = String(input.accessCode ?? "").trim().toUpperCase();
    if (!accessCode) throw new Error("Informe o código do grupo antes de solicitar a análise.");
    const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
    const groupResult = await admin.from("student_groups").select("id, name").eq("access_code", accessCode).maybeSingle();
    if (groupResult.error || !groupResult.data) throw new Error("Código do grupo não encontrado.");
    const workspaceResult = await admin.from("group_workspaces").select("*").eq("group_id", groupResult.data.id).single();
    if (workspaceResult.error) throw new Error(workspaceResult.error.message);
    const document = normalizeWorkspace(workspaceResult.data.document);
    const metrics = calculateQuality(document);
    const feedback = await analyze(openAiKey, compactDocument(document, metrics));
    const savedAt = new Date().toISOString();
    const documentWithFeedback = { ...document, aiFeedback: { ...feedback, generatedAt: savedAt, model: "gpt-4o-mini" } };
    const update = await admin.from("group_workspaces").update({ document: documentWithFeedback, updated_at: savedAt }).eq("group_id", groupResult.data.id);
    if (update.error) throw new Error(update.error.message);
    res.status(200).json({ data: { feedback: documentWithFeedback.aiFeedback, generatedAt: savedAt } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível gerar a análise agora.";
    res.status(400).json({ error: message });
  }
}
