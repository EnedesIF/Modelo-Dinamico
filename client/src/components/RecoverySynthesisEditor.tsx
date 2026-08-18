import { BarChart3, Building2, ChevronLeft, Save, ShieldAlert, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Scenario = { price: string; cost: string; interest: string; absorption: string; narrative: string };
type RecoveryAnalysis = {
  synthesis: { committeeDecision: string; executionSequence: string; capitalAllocation: string; sharedTradeoffs: string; successConditions: string };
  thesis: { assetType: string; segment: string; audience: string; location: string; investmentDecision: string };
  location: { demand: string; supply: string; mobility: string; infrastructure: string; income: string; regulatoryRisk: string };
  feasibility: { vgv: string; totalCost: string; margin: string; salesVelocity: string; funding: string; timeline: string };
  scenarios: { base: Scenario; optimistic: Scenario; stress: Scenario };
};

type MetaSynthesis = { metaIndex: number; proposal: string; rationale: string; rejectedAlternatives: string; residualRisk: string; monitoringPlan: string; proposalScore: number; evidenceScore: number; metaScore: number; progress: number };

const text = (value?: string) => value?.trim() || "Ainda não registrado nesta meta.";
const formatSavedAt = (value?: string | Date | null) => value ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value)) : "Ainda não salvo";

export function RecoverySynthesisEditor({ analysis, metrics, update, onBack, saving, lastSavedAt }: { analysis: RecoveryAnalysis; metrics?: any; update: (updater: (value: RecoveryAnalysis) => RecoveryAnalysis) => void; onBack: () => void; saving: boolean; lastSavedAt: string | Date | null }) {
  const synthesis = analysis.synthesis ?? { committeeDecision: "", executionSequence: "", capitalAllocation: "", sharedTradeoffs: "", successConditions: "" };
  const metaSynthesis: MetaSynthesis[] = metrics?.metaSynthesis ?? [];
  const editSynthesis = (field: keyof typeof synthesis, value: string) => update(current => ({ ...current, synthesis: { ...(current.synthesis ?? synthesis), [field]: value } }));
  const editSection = (section: "location" | "feasibility", field: string, value: string) => update(current => ({ ...current, [section]: { ...current[section], [field]: value } }));
  const editScenario = (scenario: keyof RecoveryAnalysis["scenarios"], field: keyof Scenario, value: string) => update(current => ({ ...current, scenarios: { ...current.scenarios, [scenario]: { ...current.scenarios[scenario], [field]: value } } }));
  const overall = metrics?.score ?? 0;
  const decision = metrics?.recommendation ?? "Em formulação";

  return <div className="space-y-6">
    <section className="overflow-hidden rounded-[1.7rem] bg-[#163F47] p-6 text-white sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.15em] text-[#F6D58A]"><Building2 className="size-3" />síntese da recuperação</div>
          <h2 className="mt-4 font-display text-3xl font-semibold">Uma decisão construída pelas quatro metas</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#D5E5E1]">Esta tela não cria uma proposta paralela. Ela reúne as recomendações, riscos e monitoramentos que o grupo escreveu em cada meta e pede uma única decisão de comitê.</p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-center"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#F6D58A]">maturidade integrada</p><p className="mt-1 font-display text-3xl font-semibold">{overall}/100</p></div>
          <div className="rounded-2xl bg-[#FFF6DA] px-4 py-3 text-center text-[#8B6416]"><p className="text-[10px] font-bold uppercase tracking-[.12em]">comitê</p><p className="mt-1 text-sm font-bold">{decision}</p></div>
        </div>
      </div>
    </section>

    <section className="research-card p-5 sm:p-7">
      <p className="eyebrow">Leitura automática do dossiê</p>
      <h3 className="mt-1 font-display text-2xl font-semibold text-[#163C43]">O que cada meta propõe para a recuperação</h3>
      <p className="mt-2 text-sm leading-6 text-[#668083]">Estes cards são alimentados pelos memos das metas. Para mudar a proposta, volte à meta correspondente; não reescreva a mesma decisão aqui.</p>
      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {[0, 1, 2, 3].map(index => {
          const item = metaSynthesis.find(entry => entry.metaIndex === index);
          return <article key={index} className="rounded-2xl border border-[#183135]/10 bg-[#F9F6EF] p-5">
            <div className="flex items-center justify-between gap-3"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#0C4A5A]">Meta {String(index + 1).padStart(2, "0")}</p><span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#31595C]">{item?.progress ?? 0}% concluída</span></div>
            <p className="mt-3 text-sm font-bold leading-6 text-[#163C43]">{text(item?.proposal)}</p>
            <div className="mt-4 grid gap-3 text-xs leading-5 text-[#5E7475] sm:grid-cols-2"><div><p className="font-bold text-[#31595C]">Risco residual</p><p>{text(item?.residualRisk)}</p></div><div><p className="font-bold text-[#31595C]">Monitoramento</p><p>{text(item?.monitoringPlan)}</p></div></div>
            <div className="mt-4 flex gap-2 text-[11px] font-bold"><span className="rounded-full bg-[#E7F1EE] px-2 py-1 text-[#176149]">Proposta {item?.proposalScore ?? 0}%</span><span className="rounded-full bg-[#EAF0F4] px-2 py-1 text-[#31595C]">Evidências {item?.evidenceScore ?? 0}/25</span></div>
          </article>;
        })}
      </div>
    </section>

    <section className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
      <div className="research-card p-5 sm:p-7"><div className="flex items-start gap-3"><BarChart3 className="mt-1 size-5 text-[#0C4A5A]" /><div><p className="eyebrow">Decisão integrada</p><h3 className="mt-1 font-display text-2xl font-semibold text-[#163C43]">Costure as quatro propostas em um plano único</h3></div></div><div className="mt-5 grid gap-4"><LongField label="Decisão do comitê" value={synthesis.committeeDecision} onChange={value => editSynthesis("committeeDecision", value)} help="A resposta final deve dizer se o plano é aprovado, ajustado ou rejeitado — e sob quais condicionantes." /><LongField label="Sequência de execução" value={synthesis.executionSequence} onChange={value => editSynthesis("executionSequence", value)} help="Mostre qual meta vem primeiro, quais dependem de caixa/obra e quais só ocorrem após marcos de confiança." /><LongField label="Alocação de capital e recursos" value={synthesis.capitalAllocation} onChange={value => editSynthesis("capitalAllocation", value)} help="Explique como a proposta das metas concorre por caixa, ativos, funding e capacidade de execução." /><LongField label="Trade-offs compartilhados" value={synthesis.sharedTradeoffs} onChange={value => editSynthesis("sharedTradeoffs", value)} help="Mostre o que o grupo aceita não fazer agora para priorizar clientes, obras e viabilidade." /><LongField label="Condições de sucesso" value={synthesis.successConditions} onChange={value => editSynthesis("successConditions", value)} help="Defina os sinais mensuráveis que comprovam que a recuperação está funcionando." /></div></div>
      <aside className="rounded-[1.6rem] border border-[#A44545]/20 bg-[#FCE9E7] p-6"><ShieldAlert className="size-6 text-[#A44545]" /><p className="mt-4 eyebrow text-[#A44545]">Teste de coerência</p><h3 className="mt-1 font-display text-2xl font-semibold text-[#632C2A]">Não aceite uma tese que contradiga as metas.</h3><p className="mt-4 text-sm leading-6 text-[#7A4945]">Se a Meta 01 prioriza concluir obras, a alocação de capital não pode destinar todo o caixa a novo lançamento. Se a Meta 02 identifica caixa restrito, o funding deve respeitar SPEs, garantias e patrimônio de afetação. Use este quadro para expor contradições antes do memo final.</p></aside>
    </section>

    <section className="research-card p-5 sm:p-7"><div className="flex items-start gap-3"><TrendingUp className="mt-1 size-5 text-[#1D9A70]" /><div><p className="eyebrow">Validação da proposta consolidada</p><h3 className="mt-1 font-display text-2xl font-semibold text-[#163C43]">Localização, viabilidade e cenário só existem para testar o plano das metas</h3><p className="mt-2 text-sm leading-6 text-[#668083]">Preencha estes campos como premissas de validação da proposta consolidada — não como um novo exercício independente.</p></div></div><div className="mt-5 grid gap-4 lg:grid-cols-3"><CompactField label="VGV estimado" value={analysis.feasibility.vgv} onChange={value => editSection("feasibility", "vgv", value)} /><CompactField label="Custo total" value={analysis.feasibility.totalCost} onChange={value => editSection("feasibility", "totalCost", value)} /><CompactField label="Margem esperada" value={analysis.feasibility.margin} onChange={value => editSection("feasibility", "margin", value)} /><CompactField label="Velocidade de vendas" value={analysis.feasibility.salesVelocity} onChange={value => editSection("feasibility", "salesVelocity", value)} /><CompactField label="Funding" value={analysis.feasibility.funding} onChange={value => editSection("feasibility", "funding", value)} /><CompactField label="Prazo" value={analysis.feasibility.timeline} onChange={value => editSection("feasibility", "timeline", value)} /></div></section>

    <section className="research-card p-5 sm:p-7"><p className="eyebrow">Cenários da proposta consolidada</p><h3 className="mt-1 font-display text-2xl font-semibold text-[#163C43]">O plano ainda funciona se preço, custo, juros ou absorção mudarem?</h3><div className="mt-5 grid gap-4 xl:grid-cols-3">{(["base", "optimistic", "stress"] as const).map(key => <ScenarioCard key={key} label={key === "base" ? "Base" : key === "optimistic" ? "Otimista" : "Estressado"} tone={key === "stress" ? "border-[#A44545]/25 bg-[#FCE9E7]" : key === "optimistic" ? "border-[#1D9A70]/25 bg-[#E6F2EC]" : "border-[#0C4A5A]/25 bg-[#E7F1EE]"} scenario={analysis.scenarios[key]} update={(field, value) => editScenario(key, field, value)} />)}</div><div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#183135]/10 pt-4"><Button variant="outline" onClick={onBack}><ChevronLeft className="mr-1 size-4" />Voltar às metas</Button><p className="text-right text-xs text-[#668083]">{saving ? "Salvando síntese" : "Síntese ligada ao dossiê"}<br />{formatSavedAt(lastSavedAt)}</p><Button onClick={() => window.dispatchEvent(new Event("mde-save-workspace"))} className="bg-[#0C4A5A] text-white"><Save className="mr-2 size-4" />Salvar síntese</Button></div></section>
  </div>;
}

function LongField({ label, value, onChange, help }: { label: string; value: string; onChange: (value: string) => void; help: string }) { return <div><div className="flex items-center justify-between gap-3"><Label className="text-[10px] font-bold uppercase tracking-[.14em] text-[#31595C]">{label}</Label><span className="text-[10px] text-[#78908F]">{help}</span></div><Textarea value={value} onChange={event => onChange(event.target.value)} className="mt-2 min-h-20 bg-[#FFFCF5]" /></div>; }
function CompactField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <div><Label className="text-[10px] font-bold uppercase tracking-[.14em] text-[#31595C]">{label}</Label><Input value={value} onChange={event => onChange(event.target.value)} className="mt-2 bg-[#FFFCF5]" /></div>; }
function ScenarioCard({ label, tone, scenario, update }: { label: string; tone: string; scenario: Scenario; update: (field: keyof Scenario, value: string) => void }) { return <div className={`rounded-2xl border p-4 ${tone}`}><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#31595C]">Cenário {label}</p><div className="mt-3 grid gap-3"><CompactField label="Preço" value={scenario.price} onChange={value => update("price", value)} /><CompactField label="Custo" value={scenario.cost} onChange={value => update("cost", value)} /><CompactField label="Juros" value={scenario.interest} onChange={value => update("interest", value)} /><CompactField label="Absorção" value={scenario.absorption} onChange={value => update("absorption", value)} /><LongField label="O que muda na decisão" value={scenario.narrative} onChange={value => update("narrative", value)} help="Relacione ao plano das metas." /></div></div>; }
