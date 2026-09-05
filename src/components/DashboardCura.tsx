import React, { useMemo } from 'react';
import { DayProgress } from '../types';
import { ArrowLeft, Flame, Sparkles, Trophy, CalendarDays, HeartPulse, CheckCircle2, Leaf, Wind, Flower2, Waves, Clock3 } from 'lucide-react';

const CHAKRAS = [
  { name: 'Coronário', color: '#a855f7', glow: 'rgba(168,85,247,.72)' },
  { name: 'Frontal', color: '#6366f1', glow: 'rgba(99,102,241,.72)' },
  { name: 'Laríngeo', color: '#38bdf8', glow: 'rgba(56,189,248,.72)' },
  { name: 'Cardíaco', color: '#22c55e', glow: 'rgba(34,197,94,.72)' },
  { name: 'Plexo Solar', color: '#facc15', glow: 'rgba(250,204,21,.72)' },
  { name: 'Sacral', color: '#fb923c', glow: 'rgba(251,146,60,.72)' },
  { name: 'Básico', color: '#ef4444', glow: 'rgba(239,68,68,.72)' },
];

const PERSONALIZED_ITEMS = [
  { icon: Sparkles, label: 'Reiki indicado' },
  { icon: Waves, label: 'Frequência / Solfeggio' },
  { icon: Wind, label: 'Exercícios de respiração' },
  { icon: Flower2, label: 'Floral personalizado', pro: true },
  { icon: Leaf, label: 'Aromaterapia personalizada', pro: true },
];

export default function DashboardCura({ onClose, progress }: { onClose: () => void; progress: DayProgress[] }) {
  const journey = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const day = index + 1;
    return progress?.find(item => item.dayNumber === day) || ({ dayNumber: day, completed: false } as DayProgress);
  }), [progress]);

  const completed = journey.filter(day => day.completed).length;
  const percentage = Math.round((completed / 7) * 100);
  const nextDay = Math.min(completed + 1, 7);
  const streak = journey.reduce((count, day) => day.completed && count === day.dayNumber - 1 ? count + 1 : count, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050816] text-slate-100">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_10%,rgba(216,180,90,.10),transparent_30%),radial-gradient(circle_at_50%_50%,rgba(79,70,229,.10),transparent_38%),linear-gradient(180deg,#0a1024_0%,#050816_48%,#03050d_100%)]" />
      <main className="relative mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div><p className="mb-1 text-[11px] font-semibold uppercase tracking-[.28em] text-amber-300/80">Sua jornada de cura</p><h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Progresso Energético</h1></div>
          <button onClick={onClose} className="flex items-center gap-2 rounded-xl border border-amber-300/15 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:border-amber-300/30 hover:bg-white/10 hover:text-white"><ArrowLeft size={16} /> Voltar</button>
        </header>

        <section className="mb-5 overflow-hidden rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-300/[.07] via-white/[.035] to-indigo-500/[.05] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[.25em] text-amber-300/80">Bem-vindo</p>
            <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">Bem-vindo ao seu espaço de Cura Integrada.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-[15px]">Haverá dias em que você não terá vontade de fazer seu tratamento. Nesses momentos, lembre-se do propósito que trouxe você até aqui. Seja firme, respeite seu ritmo e não desista da sua jornada.</p>
            <p className="mt-3 font-medium text-amber-200">Estamos juntos nessa. ✨</p>
          </div>
        </section>

        <section className="mb-5 overflow-hidden rounded-3xl border border-amber-300/15 bg-white/[.045] p-5 shadow-2xl shadow-blue-950/30 backdrop-blur-xl sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div><p className="text-lg font-medium text-white">Seu campo energético está se expandindo.</p><p className="mt-1 text-sm text-slate-400">Continue sua cura, um dia de cada vez.</p></div>
            <div className="flex items-center gap-3 rounded-2xl border border-orange-400/15 bg-orange-400/[.06] px-4 py-3"><Flame className="text-orange-400" size={22} /><div><div className="text-xl font-bold text-white">{streak} dias</div><div className="text-[11px] uppercase tracking-wider text-slate-500">ofensiva atual</div></div></div>
          </div>
          <div className="mt-6 flex items-end justify-between text-xs"><span className="font-medium text-amber-200">{percentage}% concluído</span><span className="text-slate-500">{completed} de 7 dias</span></div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-200 shadow-[0_0_14px_rgba(251,191,36,.55)] transition-all duration-700" style={{ width: `${percentage}%` }} /></div>
        </section>

        <section className="mb-5 rounded-3xl border border-amber-300/15 bg-white/[.035] p-5 sm:p-7">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div><p className="text-[11px] font-semibold uppercase tracking-[.24em] text-amber-300/80">Definido pela Anamnese Energética</p><h2 className="mt-1 text-xl font-semibold text-white">Seu Tratamento Personalizado</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Escolha o ciclo recomendado para o seu momento. As práticas são organizadas a partir da sua anamnese e podem acompanhar sua evolução ao longo da jornada.</p></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[{ days: 7, title: 'Tratamento Personalizado — 7 Dias', text: 'Um ciclo objetivo para iniciar, reorganizar sua rotina de práticas e observar as respostas ao longo da semana.' }, { days: 21, title: 'Tratamento Personalizado — 21 Dias', text: 'Um ciclo mais longo para aprofundar constância, integração e acompanhamento das mudanças percebidas.' }].map(cycle => (
              <article key={cycle.days} className="rounded-2xl border border-amber-300/15 bg-gradient-to-br from-[#10182d]/95 to-[#050816]/95 p-5 transition hover:border-amber-300/30">
                <div className="flex items-start justify-between gap-3"><div className="rounded-xl border border-amber-300/15 bg-amber-300/[.07] p-2.5"><Clock3 className="text-amber-300" size={20} /></div><span className="rounded-full border border-amber-300/20 bg-amber-300/[.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-200">{cycle.days} dias</span></div>
                <h3 className="mt-4 font-semibold text-white">{cycle.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{cycle.text}</p>
                <div className="mt-4 grid gap-2">{PERSONALIZED_ITEMS.map(({ icon: Icon, label, pro }) => <div key={label} className="flex items-center gap-2 text-xs text-slate-300"><Icon size={14} className="text-amber-300/80" /><span>{label}</span>{pro && <span className="ml-auto rounded-full bg-amber-300/10 px-2 py-0.5 text-[9px] font-semibold text-amber-200">PRO</span>}</div>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <div className="relative min-h-[520px] overflow-hidden rounded-3xl border border-white/10 bg-white/[.035] p-6 sm:p-8">
            <div className="absolute left-1/2 top-20 h-[370px] w-[150px] -translate-x-1/2 rounded-[50%] bg-blue-400/[.035] blur-xl" />
            <div className="relative text-center"><Sparkles className="mx-auto mb-2 text-amber-300/80" size={18} /><h2 className="text-sm font-semibold uppercase tracking-[.22em] text-slate-300">Alinhamento dos 7 Chakras</h2><p className="mt-2 text-xs text-slate-500">Cada etapa concluída desperta um novo centro energético.</p></div>
            <div className="relative mx-auto mt-8 flex max-w-sm flex-col items-center gap-3.5">
              <div className="absolute bottom-4 top-4 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-violet-500/15 via-emerald-400/20 to-red-500/15" />
              {CHAKRAS.map((chakra, index) => {
                const active = index < completed;
                return <div key={chakra.name} className="relative z-10 grid w-full grid-cols-[1fr_58px_1fr] items-center gap-3"><span className="text-right text-xs text-slate-500">{chakra.name}</span><div className="flex justify-center"><div className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-700 ${active ? 'scale-105' : 'border-white/10 bg-slate-900'}`} style={active ? { background: chakra.color, borderColor: chakra.color, boxShadow: `0 0 12px ${chakra.glow}, 0 0 30px ${chakra.glow}` } : undefined}><div className={`h-3 w-3 rounded-full ${active ? 'bg-white/80 animate-pulse' : 'bg-slate-700'}`} /></div></div><span className={`text-xs ${active ? 'text-slate-300' : 'text-slate-600'}`}>{active ? 'Ativado' : 'Em jornada'}</span></div>;
              })}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-white/[.035] p-5 sm:p-6"><div className="mb-4 flex items-center gap-2"><CalendarDays size={18} className="text-amber-300" /><h2 className="font-semibold text-white">Ciclo de 7 dias</h2></div><div className="grid grid-cols-7 gap-2">{journey.map(day => <div key={day.dayNumber} className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 transition ${day.completed ? 'border-amber-300/40 bg-amber-300/10 text-amber-200' : day.dayNumber === nextDay ? 'border-blue-400/40 bg-blue-400/10 text-blue-200' : 'border-white/10 bg-white/[.025] text-slate-600'}`}>{day.completed ? <CheckCircle2 size={15} /> : <span className="text-sm font-semibold">{day.dayNumber}</span>}<span className="hidden text-[8px] uppercase sm:block">dia</span></div>)}</div></div>
            <div className="rounded-3xl border border-blue-400/15 bg-gradient-to-br from-blue-500/[.08] to-violet-500/[.05] p-6"><HeartPulse className="mb-4 text-blue-300" size={24} /><p className="text-xs font-semibold uppercase tracking-[.2em] text-blue-300/80">Agora</p><h3 className="mt-2 text-xl font-semibold text-white">{completed === 7 ? 'Ciclo concluído' : `Prepare-se para o Dia ${nextDay}`}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{completed === 7 ? 'Você completou os sete passos desta etapa. Observe suas percepções e registre o que mudou ao longo do caminho.' : 'Mantenha a constância. A próxima prática continua o processo de presença, autocuidado e integração.'}</p></div>
            <div className="rounded-3xl border border-amber-300/15 bg-amber-300/[.045] p-6"><div className="flex items-start gap-4"><div className="rounded-2xl bg-amber-300/10 p-3"><Trophy className="text-amber-300" size={22} /></div><div><p className="text-sm font-semibold text-white">Marco da jornada</p><p className="mt-1 text-sm text-slate-400">{completed === 0 ? 'Sua primeira conquista começa com a primeira prática.' : `${completed} ${completed === 1 ? 'etapa concluída' : 'etapas concluídas'}. Continue construindo sua sequência.`}</p></div></div></div>
          </div>
        </section>
        <p className="mt-6 text-center text-[11px] leading-5 text-slate-600">Este painel acompanha práticas de bem-estar e autoconhecimento. As referências energéticas são apresentadas como parte da experiência integrativa e não substituem cuidados de saúde.</p>
      </main>
    </div>
  );
}
