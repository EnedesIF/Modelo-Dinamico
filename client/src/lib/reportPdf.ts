function clean(value: unknown) { return String(value ?? "").trim() || "Não informado"; }
function section(pdf: any, title: string, body: string, y: number) {
  if (y > 258) { pdf.addPage(); y = 22; }
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(12); pdf.setTextColor(12, 74, 90); pdf.text(title, 16, y); y += 6;
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(9.5); pdf.setTextColor(49, 89, 92);
  const lines = pdf.splitTextToSize(body, 178); pdf.text(lines, 16, y); return y + lines.length * 4.6 + 7;
}

export async function downloadGroupReport({ activity, group, document, metrics, feedback }: any) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  let y = 20;
  pdf.setFillColor(12, 74, 90); pdf.rect(0, 0, 210, 44, "F");
  pdf.setTextColor(255, 255, 255); pdf.setFont("helvetica", "bold"); pdf.setFontSize(20); pdf.text("Modelo Dinâmico · ENEDES", 16, 19);
  pdf.setFontSize(11); pdf.text("Relatório de inteligência e decisão imobiliária", 16, 28);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); pdf.text(`Grupo: ${clean(group?.name)} · Gerado em ${new Date().toLocaleString("pt-BR")}`, 16, 36);
  y = 54;
  y = section(pdf, "Diretriz da atividade", clean(activity?.guidelines), y);
  y = section(pdf, "Painel executivo", `Robustez: ${metrics?.score ?? 0}/100 · Progresso: ${metrics?.progress ?? 0}% · Decisão de comitê: ${clean(metrics?.realEstate?.recommendation)} · Score da síntese: ${metrics?.realEstate?.score ?? 0}/100.`, y);
  document.metaPlans.forEach((meta: any, index: number) => {
    y = section(pdf, `Meta ${index + 1} — KIT`, clean(meta.kit), y);
    y = section(pdf, `Meta ${index + 1} — Recomendação`, clean(meta.memo?.recommendation), y);
    y = section(pdf, `Meta ${index + 1} — Risco residual e monitoramento`, `Risco: ${clean(meta.memo?.residualRisk)}\nMonitoramento: ${clean(meta.memo?.monitoringPlan)}`, y);
  });
  const synthesis = document.realEstate?.synthesis ?? {};
  y = section(pdf, "Síntese das quatro metas", `Decisão do comitê: ${clean(synthesis.committeeDecision)}\nSequência de execução: ${clean(synthesis.executionSequence)}\nAlocação de capital: ${clean(synthesis.capitalAllocation)}\nTrade-offs: ${clean(synthesis.sharedTradeoffs)}\nCondições de sucesso: ${clean(synthesis.successConditions)}`, y);
  if (feedback) y = section(pdf, "Diagnóstico formativo por IA", `${clean(feedback.executiveRead)}\n\nPróximos movimentos:\n${(feedback.nextMoves ?? []).map((item: string, index: number) => `${index + 1}. ${item}`).join("\n")}`, y);
  pdf.save(`modelo-dinamico-${String(group?.name ?? "grupo").toLowerCase().replace(/[^a-z0-9]+/gi, "-")}.pdf`);
}
