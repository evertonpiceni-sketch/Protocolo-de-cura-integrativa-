import React, { useState } from 'react';
import { Brain, ChevronDown, ChevronUp, Heart, Sparkles, UserRound, X } from 'lucide-react';
import { ENERGY_JOURNEY_INTRO, ENERGY_PRACTICE_GUIDES, EnergyPracticeGuide } from '../data/energy_journey_guide';

interface EnergyJourneyIntroProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  practiceIds?: string[];
}

const Dimension = ({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) => (
  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
    <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">{icon}{label}</div>
    <p className="text-xs leading-relaxed text-slate-300">{text}</p>
  </div>
);

function EnergyCard({ item }: { item: EnergyPracticeGuide }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="overflow-hidden rounded-3xl border border-amber-400/15 bg-slate-900/70">
      <button type="button" onClick={() => setExpanded(v => !v)} className="flex w-full items-center justify-between gap-4 p-4 text-left">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">Prática da jornada</p>
          <h3 className="font-serif text-lg text-amber-100">{item.name}</h3>
          <p className="mt-1 text-xs text-slate-400">{item.subtitle}</p>
        </div>
        {expanded ? <ChevronUp className="shrink-0 text-amber-300" /> : <ChevronDown className="shrink-0 text-amber-300" />}
      </button>
      {expanded && <div className="space-y-3 border-t border-white/10 p-4">
        <p className="text-xs leading-relaxed text-slate-300"><strong className="text-slate-100">Tradição:</strong> {item.tradition}</p>
        <p className="text-xs leading-relaxed text-slate-300"><strong className="text-slate-100">Intenção:</strong> {item.intention}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Dimension icon={<UserRound size={13}/>} label="Corpo" text={item.body}/>
          <Dimension icon={<Brain size={13}/>} label="Mente" text={item.mind}/>
          <Dimension icon={<Heart size={13}/>} label="Emoções" text={item.emotions}/>
          <Dimension icon={<Sparkles size={13}/>} label="Espírito" text={item.spirit}/>
        </div>
        <div className="rounded-2xl border border-violet-400/15 bg-violet-500/[0.06] p-3 text-xs leading-relaxed text-violet-100"><strong>Durante a prática:</strong> {item.during}</div>
      </div>}
    </article>
  );
}

export default function EnergyJourneyIntro({ isOpen, onClose, onContinue, practiceIds }: EnergyJourneyIntroProps) {
  if (!isOpen) return null;
  const practices = practiceIds?.length
    ? ENERGY_PRACTICE_GUIDES.filter(item => practiceIds.includes(item.id))
    : ENERGY_PRACTICE_GUIDES;

  return <div className="fixed inset-0 z-[120] overflow-y-auto bg-slate-950/95 p-4 backdrop-blur-xl">
    <div className="mx-auto my-4 max-w-3xl overflow-hidden rounded-[2rem] border border-amber-400/20 bg-[radial-gradient(circle_at_top,rgba(216,180,90,0.10),transparent_32%),linear-gradient(180deg,#0a1024,#050816)] shadow-2xl">
      <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-slate-950/90 p-5 backdrop-blur-xl">
        <div><p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">{ENERGY_JOURNEY_INTRO.eyebrow}</p><h2 className="mt-1 font-serif text-2xl text-amber-100">{ENERGY_JOURNEY_INTRO.title}</h2></div>
        <button onClick={onClose} className="rounded-full border border-white/10 p-2 text-slate-400" aria-label="Fechar"><X size={18}/></button>
      </header>
      <main className="space-y-4 p-5">
        <p className="text-sm leading-relaxed text-slate-300">{ENERGY_JOURNEY_INTRO.description}</p>
        <div className="space-y-3">{practices.map(item => <EnergyCard key={item.id} item={item}/>)}</div>
        <p className="rounded-2xl border border-sky-400/15 bg-sky-500/[0.05] p-3 text-[11px] leading-relaxed text-slate-400">{ENERGY_JOURNEY_INTRO.disclaimer}</p>
        <button onClick={onContinue} className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-300 px-4 py-4 font-black text-slate-950">{ENERGY_JOURNEY_INTRO.acknowledgement}</button>
      </main>
    </div>
  </div>;
}
