import { describe, expect, it } from "vitest";
import { calculateQuality, createEmptyWorkspace } from "../shared/quality";

describe("indicador de robustez analítica", () => {
  it("mantém uma proposta vazia no nível de construção", () => {
    const report = calculateQuality(createEmptyWorkspace());
    expect(report.score).toBe(0);
    expect(report.progress).toBe(0);
    expect(report.level).toBe("Em construção");
  });

  it("calcula o progresso de cada meta de forma independente", () => {
    const document = createEmptyWorkspace();
    document.metaPlans[0].kit = "Que informação orienta a decisão da primeira meta?";
    document.metaPlans[1].kit = "Que informação orienta a decisão da segunda meta?";

    const report = calculateQuality(document);

    expect(report.metaReports).toHaveLength(4);
    expect(report.metaReports[0].score).toBe(20);
    expect(report.metaReports[1].score).toBe(20);
    expect(report.metaReports[2].score).toBe(0);
    expect(report.metaReports[3].score).toBe(0);
    expect(report.analysis.kitCompleted).toBe(2);
    expect(report.analysis.fcsComplete).toBe(0);
  });

  it("reconhece uma proposta com triangulação, plano completo e síntese executiva", () => {
    const document = createEmptyWorkspace();
    const meta = document.metaPlans[0];
    meta.kit = "Que evidências diferenciam a entrada no segmento premium das alternativas disponíveis?";
    meta.hypotheses = meta.hypotheses.map((_, index) => ({
      statement: `Hipótese concorrente ${index + 1}`,
      supportingSignal: "Sinal observável de confirmação",
      weakeningSignal: "Sinal observável de refutação",
    }));
    meta.factors = meta.factors.map((_, factorIndex) => ({
      title: `Driver crítico ${factorIndex + 1}`,
      rationale: "Altera materialmente a escolha estratégica",
      indicator: "Limiar verificável",
      hypothesisLink: "Hipótese concorrente 1",
      interpretationRisk: "Viés de cobertura da fonte",
      kiqs: Array.from({ length: 4 }, (_, kiqIndex) => ({
        question: `Questão chave ${kiqIndex + 1}`,
        source: `Fonte independente ${factorIndex + kiqIndex + 1}`,
        method: "Triangulação de evidências",
        evidenceMinimum: "Duas fontes convergentes",
        decisionSignal: "Muda a recomendação",
      })),
    }));
    meta.evidence = meta.evidence.map((_, index) => ({
      evidence: `Evidência verificável ${index + 1}`,
      source: `Fonte externa ${index + 1}`,
      date: "2026",
      relevance: "Afeta diretamente o critério de decisão",
      limitation: "Cobertura parcial da amostra",
      inference: "Sustenta a alternativa priorizada",
    }));
    meta.memo = {
      recommendation: "Priorizar a entrada gradual no segmento premium.",
      rationale: "As evidências convergem para atratividade e viabilidade.",
      rejectedAlternatives: "A expansão regional possui retorno inferior no prazo.",
      residualRisk: "A reação competitiva requer monitoramento.",
      monitoringPlan: "Revisar os sinais de margem e concorrência mensalmente.",
    };

    const report = calculateQuality(document);
    expect(report.metaReports[0].score).toBeGreaterThanOrEqual(80);
    expect(report.metaReports[0].level).toBe("Robusta");
    expect(report.metaReports[0].strengths).toContain("Evidências");
    expect(report.metaReports[0].indicators.fcsComplete).toBe(4);
    expect(report.metaReports[0].indicators.kiqsComplete).toBe(16);
    expect(report.metaReports[0].indicators.distinctSources).toBe(3);
  });
});
