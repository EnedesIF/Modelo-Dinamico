const blankKiq = () => ({ question: "", source: "", method: "", evidenceMinimum: "", decisionSignal: "", evaluability: "" });
const blankFactor = () => ({ title: "", rationale: "", indicator: "", hypothesisLink: "", interpretationRisk: "", materiality: "", kiqs: [blankKiq(), blankKiq(), blankKiq(), blankKiq()] });
const blankHypothesis = () => ({ statement: "", supportingSignal: "", weakeningSignal: "" });
const blankEvidence = () => ({ evidence: "", source: "", date: "", relevance: "", limitation: "", inference: "" });
const blankMemo = () => ({ recommendation: "", rationale: "", rejectedAlternatives: "", residualRisk: "", monitoringPlan: "" });
const blankScenario = () => ({ price: "", cost: "", interest: "", absorption: "", narrative: "" });
const blankRealEstate = () => ({
  synthesis: { committeeDecision: "", executionSequence: "", capitalAllocation: "", sharedTradeoffs: "", successConditions: "" },
  thesis: { assetType: "", segment: "", audience: "", location: "", investmentDecision: "" },
  location: { demand: "", supply: "", mobility: "", infrastructure: "", income: "", regulatoryRisk: "" },
  feasibility: { vgv: "", totalCost: "", margin: "", salesVelocity: "", funding: "", timeline: "" },
  scenarios: { base: blankScenario(), optimistic: blankScenario(), stress: blankScenario() },
});

export const createEmptyMetaPlan = () => ({
  hypotheses: [blankHypothesis(), blankHypothesis(), blankHypothesis()],
  factors: [blankFactor(), blankFactor(), blankFactor(), blankFactor()],
  evidence: [blankEvidence(), blankEvidence(), blankEvidence()],
  kit: "",
  kitDecisionFit: "",
  memo: blankMemo(),
});

export function createEmptyWorkspace() {
  return { metaPlans: [createEmptyMetaPlan(), createEmptyMetaPlan(), createEmptyMetaPlan(), createEmptyMetaPlan()], realEstate: blankRealEstate() };
}

const recordOf = value => (value && typeof value === "object" ? value : {});
const stringOf = value => (typeof value === "string" ? value : "");
const arrayOf = value => (Array.isArray(value) ? value : []);
const isFilled = value => value.trim().length > 0;
const countFilled = values => values.filter(isFilled).length;

function normalizeMetaPlan(value) {
  const raw = recordOf(value);
  const template = createEmptyMetaPlan();
  const hypotheses = arrayOf(raw.hypotheses).slice(0, 3).map(item => {
    const row = recordOf(item);
    return { statement: stringOf(row.statement), supportingSignal: stringOf(row.supportingSignal), weakeningSignal: stringOf(row.weakeningSignal) };
  });
  while (hypotheses.length < 3) hypotheses.push(blankHypothesis());
  const factors = arrayOf(raw.factors).slice(0, 4).map(item => {
    const row = recordOf(item);
    const kiqs = arrayOf(row.kiqs).slice(0, 4).map(kiq => {
      const question = recordOf(kiq);
      return { question: stringOf(question.question), source: stringOf(question.source), method: stringOf(question.method), evidenceMinimum: stringOf(question.evidenceMinimum), decisionSignal: stringOf(question.decisionSignal), evaluability: stringOf(question.evaluability) };
    });
    while (kiqs.length < 4) kiqs.push(blankKiq());
    return { title: stringOf(row.title), rationale: stringOf(row.rationale), indicator: stringOf(row.indicator), hypothesisLink: stringOf(row.hypothesisLink), interpretationRisk: stringOf(row.interpretationRisk), materiality: stringOf(row.materiality), kiqs };
  });
  while (factors.length < 4) factors.push(blankFactor());
  const evidence = arrayOf(raw.evidence).slice(0, 3).map(item => {
    const row = recordOf(item);
    return { evidence: stringOf(row.evidence), source: stringOf(row.source), date: stringOf(row.date), relevance: stringOf(row.relevance), limitation: stringOf(row.limitation), inference: stringOf(row.inference) };
  });
  while (evidence.length < 3) evidence.push(blankEvidence());
  const memo = recordOf(raw.memo);
  return {
    kit: stringOf(raw.kit),
    kitDecisionFit: stringOf(raw.kitDecisionFit),
    hypotheses: hypotheses.length ? hypotheses : template.hypotheses,
    factors: factors.length ? factors : template.factors,
    evidence: evidence.length ? evidence : template.evidence,
    memo: { recommendation: stringOf(memo.recommendation), rationale: stringOf(memo.rationale), rejectedAlternatives: stringOf(memo.rejectedAlternatives), residualRisk: stringOf(memo.residualRisk), monitoringPlan: stringOf(memo.monitoringPlan) },
  };
}

function normalizeScenario(value) {
  const row = recordOf(value);
  return { price: stringOf(row.price), cost: stringOf(row.cost), interest: stringOf(row.interest), absorption: stringOf(row.absorption), narrative: stringOf(row.narrative) };
}

function normalizeRealEstate(value) {
  const raw = recordOf(value);
  const synthesis = recordOf(raw.synthesis);
  const thesis = recordOf(raw.thesis);
  const location = recordOf(raw.location);
  const feasibility = recordOf(raw.feasibility);
  const scenarios = recordOf(raw.scenarios);
  return {
    synthesis: { committeeDecision: stringOf(synthesis.committeeDecision), executionSequence: stringOf(synthesis.executionSequence), capitalAllocation: stringOf(synthesis.capitalAllocation), sharedTradeoffs: stringOf(synthesis.sharedTradeoffs), successConditions: stringOf(synthesis.successConditions) },
    thesis: { assetType: stringOf(thesis.assetType), segment: stringOf(thesis.segment), audience: stringOf(thesis.audience), location: stringOf(thesis.location), investmentDecision: stringOf(thesis.investmentDecision) },
    location: { demand: stringOf(location.demand), supply: stringOf(location.supply), mobility: stringOf(location.mobility), infrastructure: stringOf(location.infrastructure), income: stringOf(location.income), regulatoryRisk: stringOf(location.regulatoryRisk) },
    feasibility: { vgv: stringOf(feasibility.vgv), totalCost: stringOf(feasibility.totalCost), margin: stringOf(feasibility.margin), salesVelocity: stringOf(feasibility.salesVelocity), funding: stringOf(feasibility.funding), timeline: stringOf(feasibility.timeline) },
    scenarios: { base: normalizeScenario(scenarios.base), optimistic: normalizeScenario(scenarios.optimistic), stress: normalizeScenario(scenarios.stress) },
  };
}

export function normalizeWorkspace(value) {
  const raw = recordOf(value);
  const plans = arrayOf(raw.metaPlans);
  const feedback = recordOf(raw.aiFeedback);
  const preserveFeedback = Object.keys(feedback).length ? { aiFeedback: feedback } : {};
  if (plans.length) {
    const normalized = plans.slice(0, 4).map(normalizeMetaPlan);
    while (normalized.length < 4) normalized.push(createEmptyMetaPlan());
    return { metaPlans: normalized, realEstate: normalizeRealEstate(raw.realEstate), ...preserveFeedback };
  }
  return { metaPlans: [normalizeMetaPlan(raw), createEmptyMetaPlan(), createEmptyMetaPlan(), createEmptyMetaPlan()], realEstate: normalizeRealEstate(raw.realEstate), ...preserveFeedback };
}

export function parseWorkspaceJson(value) {
  if (typeof value !== "string") return normalizeWorkspace(value);
  try { return normalizeWorkspace(JSON.parse(value)); } catch { return createEmptyWorkspace(); }
}

function assessmentValue(value) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed >= 1 && parsed <= 5 ? parsed : 0;
}

function calculateAssessment(plan) {
  const kit = assessmentValue(plan.kitDecisionFit);
  const factors = plan.factors.map(factor => assessmentValue(factor.materiality));
  const kiqs = plan.factors.flatMap(factor => factor.kiqs.map(kiq => assessmentValue(kiq.evaluability)));
  const values = [kit, ...factors, ...kiqs];
  const evaluated = values.filter(Boolean);
  const average = evaluated.length ? Math.round((evaluated.reduce((sum, item) => sum + item, 0) / evaluated.length) * 20) : 0;
  const coverage = Math.round((evaluated.length / values.length) * 100);
  return {
    kit,
    factors,
    kiqs,
    average,
    coverage,
    evaluatedItems: evaluated.length,
    totalItems: values.length,
    kitScore: kit * 20,
    fcsScore: factors.length ? Math.round((factors.reduce((sum, item) => sum + item, 0) / (factors.length * 5)) * 100) : 0,
    kiqScore: kiqs.length ? Math.round((kiqs.reduce((sum, item) => sum + item, 0) / (kiqs.length * 5)) * 100) : 0,
  };
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
  const assessment = calculateAssessment(plan);
  const indicators = { kitCompleted: kitScore === 20 ? 1 : 0, hypothesesComplete: completeHypotheses, hypothesesTotal: 3, fcsComplete: completeFactors, fcsTotal: 4, kiqsComplete: completeKiqs, kiqsTotal: 16, evidenceComplete: completeEvidence, evidenceTotal: 3, distinctSources, memoFieldsComplete: completeMemo, memoFieldsTotal: 5, evaluationAverage: assessment.average, evaluationCoverage: assessment.coverage, evaluatedItems: assessment.evaluatedItems, evaluationItemsTotal: assessment.totalItems };
  return { metaIndex, score, level, progress, dimensions, strengths: dimensions.filter(item => item.score / item.max >= 0.75).map(item => item.label), priorities: dimensions.filter(item => item.score / item.max < 0.75).map(item => item.label), indicators, assessment };
}

function numericValue(value) {
  const parsed = Number.parseFloat(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? Math.max(0, Math.min(5, parsed)) : 0;
}

function calculateRealEstate(realEstate, metaPlans, metaReports) {
  const metaSynthesis = metaPlans.map((plan, index) => {
    const memo = plan.memo;
    const proposalFields = [memo.recommendation, memo.rationale, memo.rejectedAlternatives, memo.residualRisk, memo.monitoringPlan];
    return {
      metaIndex: index,
      proposal: memo.recommendation,
      rationale: memo.rationale,
      rejectedAlternatives: memo.rejectedAlternatives,
      residualRisk: memo.residualRisk,
      monitoringPlan: memo.monitoringPlan,
      proposalScore: Math.round((countFilled(proposalFields) / proposalFields.length) * 100),
      evidenceScore: metaReports[index]?.dimensions?.find(item => item.key === "evidence")?.score ?? 0,
      metaScore: metaReports[index]?.score ?? 0,
      progress: metaReports[index]?.progress ?? 0,
    };
  });
  const proposalScore = Math.round(metaSynthesis.reduce((sum, item) => sum + item.proposalScore, 0) / metaSynthesis.length);
  const synthesisFields = Object.values(realEstate.synthesis);
  const synthesisScore = Math.round((countFilled(synthesisFields) / synthesisFields.length) * 100);
  const thesisFields = Object.values(realEstate.thesis);
  const feasibilityFields = Object.values(realEstate.feasibility);
  const locationValues = Object.values(realEstate.location).map(numericValue);
  const scenarioFields = Object.values(realEstate.scenarios).flatMap(scenario => Object.values(scenario));
  const thesisScore = Math.round((proposalScore * .55) + (synthesisScore * .3) + ((countFilled(thesisFields) / thesisFields.length) * 100 * .15));
  const locationScore = Math.round((locationValues.reduce((sum, value) => sum + value, 0) / (locationValues.length * 5)) * 100);
  const feasibilityScore = Math.round((countFilled(feasibilityFields) / feasibilityFields.length) * 100);
  const scenarioScore = Math.round((countFilled(scenarioFields) / scenarioFields.length) * 100);
  const regulatoryRisk = numericValue(realEstate.location.regulatoryRisk);
  const score = Math.round(thesisScore * .35 + locationScore * .2 + feasibilityScore * .25 + scenarioScore * .2);
  const recommendation = score >= 75 && regulatoryRisk <= 3 ? "Investir" : score >= 50 ? "Ajustar tese" : "Não investir";
  const level = score >= 80 ? "Tese robusta" : score >= 60 ? "Tese promissora" : score >= 35 ? "Tese em revisão" : "Tese inicial";
  return { score, level, recommendation, locationScore, feasibilityScore, scenarioScore, thesisScore, regulatoryRisk, proposalScore, synthesisScore, metaSynthesis };
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
    evaluationAverage: total.evaluationAverage + report.indicators.evaluationAverage,
    evaluationCoverage: total.evaluationCoverage + report.indicators.evaluationCoverage,
    evaluatedItems: total.evaluatedItems + report.indicators.evaluatedItems,
    evaluationItemsTotal: total.evaluationItemsTotal + report.indicators.evaluationItemsTotal,
  }), { kitCompleted: 0, hypothesesComplete: 0, hypothesesTotal: 0, fcsComplete: 0, fcsTotal: 0, kiqsComplete: 0, kiqsTotal: 0, evidenceComplete: 0, evidenceTotal: 0, distinctSources: 0, memoFieldsComplete: 0, memoFieldsTotal: 0, evaluationAverage: 0, evaluationCoverage: 0, evaluatedItems: 0, evaluationItemsTotal: 0 });
  analysis.evaluationAverage = metaReports.length ? Math.round(analysis.evaluationAverage / metaReports.length) : 0;
  analysis.evaluationCoverage = metaReports.length ? Math.round(analysis.evaluationCoverage / metaReports.length) : 0;
  const realEstate = calculateRealEstate(workspace.realEstate, workspace.metaPlans, metaReports);
  return { score, level, progress, dimensions, strengths: dimensions.filter(item => item.score / item.max >= 0.75).map(item => item.label), priorities: dimensions.filter(item => item.score / item.max < 0.75).map(item => item.label), metaReports, analysis, realEstate };
}
