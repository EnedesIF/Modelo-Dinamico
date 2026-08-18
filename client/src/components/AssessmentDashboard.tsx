import { Bar, BarChart, CartesianGrid, Cell, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Award, ClipboardCheck, Gauge, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const tone = (value: number) => value >= 75 ? { bg: "bg-[#E6F2EC]", text: "text-[#176149]", fill: "#1D9A70" } : value >= 45 ? { bg: "bg-[#FFF6DA]", text: "text-[#8B6416]", fill: "#E8B04A" } : { bg: "bg-[#FCE9E7]", text: "text-[#9A4F4B]", fill: "#A44545" };

export function AssessmentDashboard({ report, metrics }: { report: any; metrics: any }) {
  const assessment = report?.assessment ?? {};
  const radar = [
    { name: "KIT", value: assessment.kitScore ?? 0 },
    { name: "FCS", value: assessment.fcsScore ?? 0 },
    { name: "KIQs", value: assessment.kiqScore ?? 0 },
    { name: "Evidências", value: report?.dimensions?.find((item: any) => item.key === "evidence")?.score ? Math.round((report.dimensions.find((item: any) => item.key === "evidence").score / 25) * 100) : 0 },
    { name: "Memo", value: report?.dimensions?.find((item: any) => item.key === "memo")?.score ? Math.round((report.dimensions.find((item: any) => item.key === "memo").score / 15) * 100) : 0 },
  ];
  const bars = [
    { name: "Estrutura", value: report?.score ?? 0, color: "#0C4A5A" },
    { name: "Avaliação", value: assessment.average ?? 0, color: "#E8B04A" },
    { name: "Cobertura", value: assessment.coverage ?? 0, color: "#1D9A70" },
  ];
  const currentTone = tone(assessment.average ?? 0);
  return <section className="grid gap-5 xl:grid-cols-[.85fr_1.15fr]"><div className="research-card overflow-hidden p-5"><div className="flex items-start justify-between gap-3"><div><p className="eyebrow">Painel avaliativo</p><h3 className="mt-1 font-display text-2xl font-semibold text-[#163C43]">Qualidade que o grupo pode defender</h3></div><Gauge className="size-6 text-[#0C4A5A]" /></div><div className="mt-3 h-56"><ResponsiveContainer width="100%" height="100%"><RadarChart data={radar}><PolarGrid stroke="#D8D3C7" /><PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: "#31595C" }} /><Radar dataKey="value" stroke="#0C4A5A" fill="#1D9A70" fillOpacity={.28} /></RadarChart></ResponsiveContainer></div></div><div className="research-card p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow">Leitura de maturidade</p><h3 className="mt-1 font-display text-2xl font-semibold text-[#163C43]">Semáforo da meta</h3></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${currentTone.bg} ${currentTone.text}`}>{assessment.average ?? 0}/100 · critério avaliável</span></div><div className="mt-4 grid gap-3 sm:grid-cols-3"><Tile icon={<ClipboardCheck />} label="itens avaliados" value={`${assessment.evaluatedItems ?? 0}/${assessment.totalItems ?? 21}`} /><Tile icon={<Award />} label="consistência" value={`${assessment.average ?? 0}/100`} /><Tile icon={<Sparkles />} label="cobertura" value={`${assessment.coverage ?? 0}%`} /></div><div className="mt-5 h-36"><ResponsiveContainer width="100%" height="100%"><BarChart data={bars} margin={{ left: -25, right: 4 }}><CartesianGrid vertical={false} stroke="#E2DDD2" /><XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#668083" }} /><YAxis domain={[0, 100]} hide /><Tooltip /><Bar dataKey="value" radius={[6, 6, 0, 0]}>{bars.map(item => <Cell key={item.name} fill={item.color} />)}</Bar></BarChart></ResponsiveContainer></div><p className="mt-3 text-xs leading-5 text-[#668083]">A escala ajuda o grupo a justificar por que cada pergunta importa; ela não substitui a leitura crítica da professora.</p></div></section>;
}

function Tile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) { return <div className="rounded-xl border border-[#183135]/10 bg-[#F9F6EF] p-3"><span className="text-[#0C4A5A] [&>svg]:size-4">{icon}</span><p className="mt-2 text-lg font-bold text-[#163C43]">{value}</p><p className="text-[10px] font-bold uppercase tracking-[.11em] text-[#668083]">{label}</p></div>; }
