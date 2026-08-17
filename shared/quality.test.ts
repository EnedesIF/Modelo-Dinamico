import { describe, expect, it } from "vitest";
import { calculateQuality, createEmptyWorkspace } from "./quality";

describe("calculateQuality", () => {
  it("explica uma proposta inicial sem sugerir robustez inexistente", () => {
    const report = calculateQuality(createEmptyWorkspace());
    expect(report.score).toBe(0);
    expect(report.level).toBe("Em construção");
    expect(report.priorities).toContain("Triangulação de evidências");
  });

  it("reconhece a completude e a triangulação de uma proposta robusta", () => {
    const workspace = createEmptyWorkspace();
    workspace.selectedGoal = "Avaliar o segmento premium";
    workspace.kit = "Quais evidências diferenciam a entrada no segmento premium das alternativas disponíveis?";
    workspace.hypotheses = workspace.hypotheses.map((_, index) => ({ statement: `Hipótese ${index + 1}`, supportingSignal: "Sinal de confirmação", weakeningSignal: "Sinal de refutação" }));
    workspace.factors = workspace.factors.map((_, factor) => ({ title: `Fator ${factor + 1}`, rationale: "Altera materialmente a decisão", indicator: "Limiar verificável", hypothesisLink: "Hipótese 1", interpretationRisk: "Viés de amostra", kiqs: Array.from({ length: 4 }, (_, kiq) => ({ question: `Questão ${kiq + 1}`, source: `Fonte ${kiq + factor + 1}`, method: "Triangulação", evidenceMinimum: "Duas fontes", decisionSignal: "Muda a recomendação" })) }));
    workspace.evidence = workspace.evidence.map((_, index) => ({ evidence: `Evidência ${index + 1}`, source: `Fonte independente ${index + 1}`, date: "2026", relevance: "Avalia o critério", limitation: "Cobertura parcial", inference: "Sustenta a alternativa" }));
    workspace.memo = { recommendation: "Priorizar a entrada gradual", rationale: "Evidências convergentes", rejectedAlternatives: "Expansão regional tem menor retorno", residualRisk: "Monitorar a reação competitiva", monitoringPlan: "Revisar mensalmente os sinais" };
    const report = calculateQuality(workspace);
    expect(report.score).toBeGreaterThanOrEqual(80);
    expect(report.level).toBe("Robusta");
    expect(report.strengths).toContain("Triangulação de evidências");
  });
});
