const blankKiq = () => ({ question: "", source: "", method: "", evidenceMinimum: "", decisionSignal: "" });
const blankFactor = () => ({ title: "", rationale: "", indicator: "", hypothesisLink: "", interpretationRisk: "", kiqs: [blankKiq(), blankKiq(), blankKiq(), blankKiq()] });
const blankHypothesis = () => ({ statement: "", supportingSignal: "", weakeningSignal: "" });
const blankEvidence = () => ({ evidence: "", source: "", date: "", relevance: "", limitation: "", inference: "" });
const blankMemo = () => ({ recommendation: "", rationale: "", rejectedAlternatives: "", residualRisk: "", monitoringPlan: "" });

export const createEmptyMetaPlan = () => ({
  hypotheses: [blankHypothesis(), blankHypothesis(), blankHypothesis()],
  factors: [blankFactor(), blankFactor(), blankFactor(), blankFactor()],
  evidence: [blankEvidence(), blankEvidence(), blankEvidence()],
  kit: "",
  memo: blankMemo(),
});

export function createEmptyWorkspace() {
  return { metaPlans: [createEmptyMetaPlan(), createEmptyMetaPlan(), createEmptyMetaPlan(), createEmptyMetaPlan()] };
}

const recordOf = value => (value && typeof value === "object" ? value : {});
const stringOf = value => (typeof value === "string" ? value : "");
const arrayOf = value => (Array.isArray(value) ? value : []);
const isFilled = value => value.trim().length > 0;
const countFilled = values => values.filter(isFilled).length;

function normalizeMetaPlan(value) {
  const raw = recordOf(value);
  const template = createEmptyMetaPlan();
  const hypotheses = arrayOf(raw.hypotheses).map(item => {
    const row = recordOf(item);
    return { statement: stringOf(row.statement), supportingSignal: stringOf(row.supportingSignal), weakeningSignal: stringOf(row.weakeningSignal) };
  });
  const factors = arrayOf(raw.factors).map(item => {
    const row = recordOf(item);
    const kiqs = arrayOf(row.kiqs).map(kiq => {
      const question = recordOf(kiq);
      return { question: stringOf(question.question), source: stringOf(question.source), method: stringOf(question.method), evidenceMinimum: stringOf(question.evidenceMinimum), decisionSignal: stringOf(question.decisionSignal) };
    });
    return { title: stringOf(row.title), rationale: stringOf(row.rationale), indicator: stringOf(row.indicator), hypothesisLink: stringOf(row.hypothesisLink), interpretationRisk: stringOf(row.interpretationRisk), kiqs: kiqs.length ? kiqs.slice(0, 4) : [blankKiq(), blankKiq(), blankKiq(), blankKiq()] };
  });
  const evidence = arrayOf(raw.evidence).map(item => {
    const row = recordOf(item);
    return { evidence: stringOf(row.evidence), source: stringOf(row.source), date: stringOf(row.date), relevance: stringOf(row.relevance), limitation: stringOf(row.limitation), inference: stringOf(row.inference) };
  });
  const memo = recordOf(raw.memo);
  return {
    kit: stringOf(raw.kit),
    hypotheses: hypotheses.length ? hypotheses.slice(0, 3) : template.hypotheses,
    factors: factors.length ? factors.slice(0, 4) : template.factors,
    evidence: evidence.length ? evidence.slice(0, 3) : template.evidence,
    memo: { recommendation: stringOf(memo.recommendation), rationale: stringOf(memo.rationale), rejectedAlternatives: stringOf(memo.rejectedAlternatives), residualRisk: stringOf(memo.residualRisk), monitoringPlan: stringOf(memo.monitoringPlan) },
  };
}

export function normalizeWorkspace(value) {
  const raw = recordOf(value);
  const plans = arrayOf(raw.metaPlans);
  if (plans.length) {
    const normalized = plans.slice(0, 4).map(normalizeMetaPlan);
    while (normalized.length < 4) normalized.push(createEmptyMetaPlan());
    return { metaPlans: normalized };
  }
  return { metaPlans: [normalizeMetaPlan(raw), createEmptyMetaPlan(), createEmptyMetaPlan(), createEmptyMetaPlan()] };
}

export function parseWorkspaceJson(value) {
  if (typeof value !== "string") return normalizeWorkspace(value);
  try { return normalizeWorkspace(JSON.parse(value)); } catch { return createEmptyWorkspace(); }
}

function calculateMetaQuality(plan, metaIndex) {
  const kitScore = isFilled(plan.kit) ? 20 : 0;
  const completeHypotheses = plan.hypotheses.filter(item => countFilled([item.statement, item.supportingSignal, item.weakeningSignal]) === 3).length;
  const hypothesesScore = Math.min(15, completeHypotheses * 5);
  const completeFactors = plan.factors.filter(item => countFilled([item.title, item.rationale, item.indicator, item.hypothesisLink, item.interpretationRisk]) === 5).length;
  const completeKiqs = plan.factors.flatMap(item => item.kiqs).filter(item => countFilled([item.question, item.source, item.method, item.evidenceMinimum, item.decisionSignal]) === 5).length;
  const planScore = Math.min(25, Math.round((Math.min(completeFactors, 4) / 4) * 10 + (Math.min(completeKiqs, 16) / 16) * 15));
  const completeEvidence = plan.evidence.filter(item => countFilled([item.evidence, item.source, item.relevance, item.limitation, item.inference]) === 5).length;
  const distinctSources = new Set(plan.evidence.map(item => item.source.trim().toLowerCase()).filter(Boolean)).size;
  const evidenceScore = Math.min(25, Math.min(20, completeEvidence * 7) + (distinctSources >= 3 ? 5 : distinctSources >= 2 ? 3 : distinctSources === 1 ? 1 : 0));
  const completeMemo = countFilled(Object.values(plan.memo));
  const memoScore = Math.round((completeMemo / 5) * 15);
  const score = Math.min(100, kitScore + hypothesesScore + planScore + evidenceScore + memoScore);
  const progressSteps = [kitScore === 20, hypothesesScore === 15, planScore === 25, evidenceScore >= 21, memoScore === 15];
  const progress = Math.round((progressSteps.filter(Boolean).length / progressSteps.length) * 100);
  const level = score >= 80 ? "Robusta" : score >= 60 ? "Consistente" : score >= 35 ? "Em amadurecimento" : "Em construção";
  const dimensions = [
    { key: "kit", label: "KIT decisório", score: kitScore, max: 20, explanation: "Questão-chave clara e orientada à decisão desta meta." },
    { key: "hypotheses", label: "Hipóteses", score: hypothesesScore, max: 15, explanation: "Hipóteses concorrentes com sinais de confirmação e refutação." },
    { key: "plan", label: "FCS e KIQs", score: planScore, max: 25, explanation: "Quatro FCS e quatro KIQs por fator, com plano de coleta." },
    { key: "evidence", label: "Evidências", score: evidenceScore, max: 25, explanation: "Fontes rastreáveis, limitações explícitas e triangulação." },
    { key: "memo", label: "Recomendação", score: memoScore, max: 15, explanation: "Síntese, trade-offs, risco residual e monitoramento." },
  ];
  const indicators = { kitCompleted: kitScore === 20 ? 1 : 0, hypothesesComplete: completeHypotheses, hypothesesTotal: 3, fcsComplete: completeFactors, fcsTotal: 4, kiqsComplete: completeKiqs, kiqsTotal: 16, evidenceComplete: completeEvidence, evidenceTotal: 3, distinctSources, memoFieldsComplete: completeMemo, memoFieldsTotal: 5 };
  return { metaIndex, score, level, progress, dimensions, strengths: dimensions.filter(item => item.score / item.max >= 0.75).map(item => item.label), priorities: dimensions.filter(item => item.score / item.max < 0.75).map(item => item.label), indicators };
}

export function calculateQuality(input) {
  const workspace = normalizeWorkspace(input);
  const metaReports = workspace.metaPlans.map(calculateMetaQuality);
  const dimensions = ["kit", "hypotheses", "plan", "evidence", "memo"].map(key => {
    const items = metaReports.map(report => report.dimensions.find(item => item.key === key));
    return { ...items[0], score: Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length), max: items[0].max, explanation: "Média das quatro metas da atividade." };
  });
  const score = Math.round(metaReports.reduce((sum, report) => sum + report.score, 0) / metaReports.length);
  const progress = Math.round(metaReports.reduce((sum, report) => sum + report.progress, 0) / metaReports.length);
  const level = score >= 80 ? "Robusta" : score >= 60 ? "Consistente" : score >= 35 ? "Em amadurecimento" : "Em construção";
  const analysis = metaReports.reduce((total, report) => ({
    kitCompleted: total.kitCompleted + report.indicators.kitCompleted,
    hypothesesComplete: total.hypothesesComplete + report.indicators.hypothesesComplete,
    hypothesesTotal: total.hypothesesTotal + report.indicators.hypothesesTotal,
    fcsComplete: total.fcsComplete + report.indicators.fcsComplete,
    fcsTotal: total.fcsTotal + report.indicators.fcsTotal,
    kiqsComplete: total.kiqsComplete + report.indicators.kiqsComplete,
    kiqsTotal: total.kiqsTotal + report.indicators.kiqsTotal,
    evidenceComplete: total.evidenceComplete + report.indicators.evidenceComplete,
    evidenceTotal: total.evidenceTotal + report.indicators.evidenceTotal,
    distinctSources: total.distinctSources + report.indicators.distinctSources,
    memoFieldsComplete: total.memoFieldsComplete + report.indicators.memoFieldsComplete,
    memoFieldsTotal: total.memoFieldsTotal + report.indicators.memoFieldsTotal,
  }), { kitCompleted: 0, hypothesesComplete: 0, hypothesesTotal: 0, fcsComplete: 0, fcsTotal: 0, kiqsComplete: 0, kiqsTotal: 0, evidenceComplete: 0, evidenceTotal: 0, distinctSources: 0, memoFieldsComplete: 0, memoFieldsTotal: 0 });
  return { score, level, progress, dimensions, strengths: dimensions.filter(item => item.score / item.max >= 0.75).map(item => item.label), priorities: dimensions.filter(item => item.score / item.max < 0.75).map(item => item.label), metaReports, analysis };
}
