import React, { useMemo, useState } from 'react';
import { Award, BookOpen, ChevronRight, Flower2, GraduationCap, Headphones, Heart, Leaf, MessageCircle, Pause, Play, Sliders, Sparkles, Sun, Users, Waves } from 'lucide-react';
import { AnamnesisData, DAILY_INSIGHTS, DayProgress } from '../types';
import { APPROVED_LOGO_DATA_URI } from './ApprovedBrand';
import { evaluateBestTreatmentFromAnamnesis } from '../lib/anamnesisTreatmentEngine';
import { audioEngine } from '../lib/audio';

type Props = {
  userName: string;
  currentDay: number;
  progress: DayProgress[];
  anamnesis?: AnamnesisData;
  onStartSession: (day: number) => void;
  onOpenJournal: () => void;
  onOpenAnamnesis: () => void;
  onOpenArcanjo: () => void;
  onOpenChakras: () => void;
  onOpenBaths: () => void;
  onOpenAstral: () => void;
  onOpenNumerology: () => void;
  onOpenSettings: () => void;
  onOpenSystemic: () => void;
  onOpenHooponopono: () => void;
  onOpenAchievements: () => void;
  onOpenCourses: () => void;
  onOpenContact: () => void;
  onOpenPersonalJourney: () => void;
};

const careCards = [
  { key: 'chakras', title: 'Guia dos 7 Chakras', copy: 'Conheça seus centros de energia', icon: Sparkles },
  { key: 'bath', title: 'Banhos e Aromas', copy: 'Natureza como parte do cuidado', icon: Leaf },
  { key: 'astral', title: 'Mapa Astral', copy: 'Um olhar simbólico para sua jornada', icon: Sun },
  { key: 'numerology', title: 'Numerologia', copy: 'Ciclos, essência e caminhos', icon: Flower2 },
];

export default function TransformationHome(props: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [journeyEntered, setJourneyEntered] = useState(() => sessionStorage.getItem('transformation_journey_entered_v2') === 'true');
  const firstName = props.userName?.trim().split(' ')[0] || 'bem-vindo';
  const completed = props.progress.filter(item => item.completed).length;
  const total = Math.max(props.progress.length, 21);
  const percentage = Math.min(100, Math.round((completed / total) * 100));
  const insight = DAILY_INSIGHTS[Math.max(0, Math.min(DAILY_INSIGHTS.length - 1, props.currentDay - 1))];
  const recommendation = useMemo(() => props.anamnesis ? evaluateBestTreatmentFromAnamnesis(props.anamnesis) : null, [props.anamnesis]);
  const actions: Record<string, () => void> = { chakras: props.onOpenChakras, bath: props.onOpenBaths, astral: props.onOpenAstral, numerology: props.onOpenNumerology };
  const welcomeText = `Olá, ${firstName}. Que bom que você voltou para si. Respire com calma. Você não precisa fazer tudo hoje. Estamos juntos neste processo. ${insight?.quote || ''}`;
  const toggleWelcome = () => {
    if (isSpeaking) { audioEngine.stopSpeech(); setIsSpeaking(false); return; }
    void audioEngine.speakWithElevenLabsOrFallback(welcomeText, 1, () => setIsSpeaking(true), () => setIsSpeaking(false), undefined, undefined, { voiceId: 'Marcus', stability: .5, similarityBoost: .78, userName: props.userName, enableBreathingPauses: true, preferElevenLabs: true, lang: 'pt-BR', rate: .82, pitch: .92 });
  };
  const speakResult = () => {
    if (!recommendation) return;
    const text = `Olá, ${firstName}. Seu resultado personalizado indica ${recommendation.categoryLabel}. ${recommendation.summaryDiagnosis}. A frequência recomendada é ${recommendation.frequencyLabel}. O chakra em foco é ${recommendation.primaryChakraFocus}. O floral recomendado é ${recommendation.recommendedFloral}. A aromaterapia recomendada é ${recommendation.recommendedAromatherapy}. Estamos juntos neste processo.`;
    audioEngine.stopSpeech();
    void audioEngine.speakWithElevenLabsOrFallback(text, 1, () => setIsSpeaking(true), () => setIsSpeaking(false), undefined, undefined, { voiceId: 'Marcus', stability: .5, similarityBoost: .78, userName: props.userName, enableBreathingPauses: true, preferElevenLabs: true, lang: 'pt-BR', rate: .82, pitch: .92 });
  };

  if (!journeyEntered) {
    const enterJourney = () => { audioEngine.stopSpeech(); setIsSpeaking(false); sessionStorage.setItem('transformation_journey_entered_v2', 'true'); setJourneyEntered(true); };
    return <div className="mx-auto w-full max-w-[520px] px-4 py-4 sm:py-6">
      <section className="ep-welcome-audio ep-home-hero relative w-full overflow-hidden rounded-[2rem] border border-[#B88736]/28 px-6 py-8 text-center">
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_50%_0,rgba(214,167,86,.13),transparent_75%)]" />
        <div className="ep-brand-signature-wrap relative mx-auto mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[#B88736]/20 bg-white/65"><img src={APPROVED_LOGO_DATA_URI} alt="Everton Piceni — Terapias Holísticas e Bem-Estar" className="ep-brand-signature h-full w-full object-contain" /></div>
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#B88736]">Antes de começar</p>
          <h1 className="mx-auto mt-4 max-w-sm font-display text-[2.25rem] leading-[1.08] text-[#2A2420]">Um acolhimento para você</h1>
          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-7 text-[#5C5248]">Ouça este momento de chegada antes de entrar no seu espaço de cuidado.</p>
          <button onClick={toggleWelcome} className="mx-auto mt-6 flex min-h-14 w-full max-w-sm items-center justify-center gap-3 rounded-2xl border border-[#B88736]/30 bg-white/78 px-5 py-4 text-base font-semibold text-[#8F631E] shadow-[0_10px_28px_rgba(89,70,43,.08)]">
            {isSpeaking ? <Pause size={20} /> : <Headphones size={20} />}
            <span>{isSpeaking ? 'Pausar acolhimento' : 'Ouvir acolhimento'}</span>
          </button>
          <button onClick={enterJourney} className="ep-gold-button mt-3 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-base font-bold"><span>Entrar na minha jornada</span><ChevronRight size={20}/></button>
          <div className="mt-7 grid grid-cols-4 gap-2 text-[#B88736]">{[[Waves,'Escuta'],[Leaf,'Presença'],[Heart,'Equilíbrio'],[Sparkles,'Transformação']].map(([Icon,label]) => { const PillarIcon=Icon as typeof Waves; return <div key={label as string} className="flex min-w-0 flex-col items-center gap-2"><PillarIcon size={20}/><span className="w-full break-words text-center text-[9px] uppercase leading-4 tracking-[.06em] text-[#5C5248]">{label as string}</span></div>; })}</div>
        </div>
      </section>
    </div>;
  }

  return <div className="ep-home mx-auto w-full max-w-[520px] px-4 pb-6 sm:px-5">
    <section className="ep-home-hero overflow-hidden rounded-[2rem] border border-[#B88736]/35 px-6 py-8 text-center shadow-[0_24px_70px_rgba(0,0,0,.34)]">
      <div className="ep-brand-signature-wrap mx-auto mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[#B88736]/24 bg-white/70"><img src={APPROVED_LOGO_DATA_URI} alt="Everton Piceni — Terapias Holísticas e Bem-Estar" className="ep-brand-signature h-full w-full object-contain" /></div>
      <p className="text-xs font-semibold uppercase tracking-[.24em] text-[#B88736]">Protocolo da Transformação</p><h2 className="mt-4 font-display text-[2.15rem] font-semibold leading-tight text-[#2A2420]">Olá, {firstName}.</h2><p className="mx-auto mt-3 max-w-sm font-display text-xl italic leading-7 text-[#5C5248]">Que bom que você voltou para si.</p><div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-[#B88736] to-transparent" /><p className="mx-auto mt-5 max-w-sm text-base leading-7 text-[#5C5248]">Respire. Você não precisa fazer tudo hoje. Escolha apenas o cuidado que combina com o seu momento.</p>
    </section>

    {!props.anamnesis ? <section className="mt-5 rounded-[1.75rem] border border-[#B88736]/30 bg-[#FBF8F2]/95 p-5 shadow-[0_18px_48px_rgba(0,0,0,.28)]"><p className="text-xs uppercase tracking-[.2em] text-[#B88736]">Primeiro, vamos ouvir você</p><h3 className="mt-2 font-display text-3xl text-[#2A2420]">Como você está de verdade?</h3><p className="mt-3 text-base leading-7 text-[#5C5248]">Responda à anamnese para receber seu resultado, frequência, chakra em foco, floral, aroma e protocolo recomendado.</p><button onClick={props.onOpenAnamnesis} className="ep-gold-button mt-5 w-full rounded-2xl px-5 py-4 text-base font-bold">Começar minha anamnese</button></section> : recommendation && <section className="mt-5 overflow-hidden rounded-[1.75rem] border border-[#B88736]/30 bg-[#FFFFFF]/96 shadow-[0_18px_48px_rgba(0,0,0,.28)]"><div className="relative h-56 overflow-hidden border-b border-[#B88736]/20"><img src="/brand/chakra-body.svg" alt="Corpo em meditação com os sete chakras" className="h-full w-full object-contain object-center bg-[#F8F4EC]/45" /><div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] via-transparent to-transparent" /><p className="absolute bottom-4 left-5 text-xs uppercase tracking-[.2em] text-[#B88736]">Seu resultado personalizado</p></div><div className="p-5"><h3 className="font-display text-3xl leading-tight text-[#2A2420]">{recommendation.categoryLabel}</h3><p className="mt-3 text-base leading-7 text-[#5C5248]">{recommendation.summaryDiagnosis}</p><button onClick={speakResult} className="mt-4 flex items-center gap-2 rounded-full border border-[#B88736]/35 bg-[#F5EFE4] px-4 py-2.5 text-sm font-semibold text-[#B88736]"><Headphones size={17} />Ouvir meu resultado</button><div className="mt-5 space-y-3">{[['Frequência Solfeggio', recommendation.frequencyLabel],['Chakra em foco', recommendation.primaryChakraFocus],['Floral recomendado', recommendation.recommendedFloral || props.anamnesis.recommendedFloral || 'Definido conforme sua anamnese'],['Aromaterapia recomendada', recommendation.recommendedAromatherapy || props.anamnesis.recommendedAromatherapy || 'Definida conforme sua anamnese'],['Protocolo indicado', recommendation.treatmentTitle],['Duração sugerida', `${recommendation.recommendedDurationDays} dias`]].map(([label,value]) => <div key={label} className="rounded-2xl border border-[#B88736]/18 bg-[#F5EFE4] p-4"><span className="block text-xs uppercase tracking-[.15em] text-[#B88736]">{label}</span><strong className="mt-1 block text-base leading-6 text-[#2A2420]">{value}</strong></div>)}</div><button onClick={props.onOpenAnamnesis} className="mt-4 w-full rounded-2xl border border-[#B88736]/35 px-5 py-3 text-sm font-semibold text-[#B88736]">Ver ou refazer minha anamnese</button></div></section>}

    <section className="ep-luxury-card ep-progress-card mt-5 rounded-[1.75rem] p-5"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-[#B88736]">Seu progresso</p><h3 className="mt-2 font-display text-2xl text-[#2A2420]">Um passo de cada vez</h3></div><span className="font-display text-2xl text-[#B88736]">{percentage}%</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-black/25"><div className="h-full rounded-full bg-gradient-to-r from-[#b78d32] to-[#f0d98d]" style={{width:`${percentage}%`}}/></div><div className="mt-5 grid grid-cols-2 gap-3"><button onClick={props.onOpenJournal} className="ep-subcard flex items-center gap-3 rounded-2xl p-4 text-left"><BookOpen size={21} className="text-[#B88736]"/><span><strong className="block text-sm text-[#2A2420]">Meu Diário</strong><small className="mt-1 block text-xs text-[#5C5248]">Registrar percepções</small></span></button><button onClick={props.onOpenAnamnesis} className="ep-subcard flex items-center gap-3 rounded-2xl p-4 text-left"><Waves size={21} className="text-[#B88736]"/><span><strong className="block text-sm text-[#2A2420]">Como estou?</strong><small className="mt-1 block text-xs text-[#5C5248]">Olhar meu momento</small></span></button></div></section>

    <section className="ep-luxury-card mt-5 rounded-[1.75rem] p-5"><p className="text-xs uppercase tracking-[.2em] text-[#B88736]">Afirmação do dia</p><h3 className="mt-2 font-display text-2xl text-[#2A2420]">{insight?.title}</h3><p className="mt-3 text-base leading-7 text-[#5C5248]">{insight?.description}</p><div className="mt-4 rounded-2xl border border-[#B88736]/18 bg-[#F5EFE4] p-4 text-base italic leading-7 text-[#f2e7c6]">{insight?.focus}</div></section>
    <section className="ep-luxury-card mt-5 rounded-[1.75rem] p-6 text-center"><p className="font-display text-2xl leading-8 text-[#2A2420]">Você já fez muito por você.</p><p className="mt-2 font-display text-2xl italic leading-8 text-[#B88736]">Agora, é a sua vez.</p><div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-[#B88736] to-transparent" /><p className="mt-5 text-sm uppercase tracking-[.18em] text-[#5C5248]">Um lugar para voltar para si. Sempre.</p></section>
    <section id="journey-choices" className="mt-5"><div className="mb-4 px-1"><p className="text-xs uppercase tracking-[.2em] text-[#B88736]">Escolha sua jornada</p><h3 className="mt-2 font-display text-3xl text-[#2A2420]">Qual caminho você deseja seguir hoje?</h3><p className="mt-2 text-sm leading-6 text-[#5C5248]">Primeiro escolha a experiência. O aceite aparece dentro da jornada escolhida, antes do início da prática.</p></div><button onClick={() => props.onStartSession(props.currentDay)} className="group mb-3 flex w-full items-center justify-between gap-3 rounded-[1.6rem] border border-[#B88736]/30 bg-white/90 p-5 text-left shadow-[0_12px_32px_rgba(89,70,43,.08)]"><span className="flex min-w-0 flex-1 items-center gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#B88736]/10 text-[#B88736]"><Headphones size={24}/></span><span className="min-w-0"><strong className="block break-words font-display text-[1.18rem] leading-6 text-[#2A2420]">Protocolo da Transformação</strong><small className="mt-1 block text-sm leading-5 text-[#5C5248]">Prática guiada do seu ciclo atual</small></span></span><ChevronRight className="shrink-0 text-[#B88736]"/></button><button onClick={props.onOpenPersonalJourney} className="group mb-3 flex w-full items-center justify-between gap-3 rounded-[1.6rem] border border-[#B88736]/30 bg-gradient-to-br from-[#FBF8F2] to-[#F3EBDD] p-5 text-left shadow-[0_12px_32px_rgba(89,70,43,.08)]"><span className="flex min-w-0 flex-1 items-center gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#B88736]/10 text-[#B88736]"><Heart size={24}/></span><span className="min-w-0"><strong className="block break-words font-display text-[1.18rem] leading-6 text-[#2A2420]">21 Dias para Voltar para Mim</strong><small className="mt-1 block text-sm text-[#5C5248]">Reintegração da Vida</small></span></span><ChevronRight className="text-[#B88736]"/></button><button onClick={props.onOpenArcanjo} className="group flex w-full items-center justify-between gap-3 rounded-[1.6rem] border border-[#B88736]/30 bg-gradient-to-br from-[#FBF8F2]/95 to-[#FFFFFF]/95 p-5 text-left shadow-[0_12px_32px_rgba(89,70,43,.08)]"><span className="flex min-w-0 flex-1 items-center gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#B88736]/10 text-[#B88736]"><Sparkles size={24}/></span><span className="min-w-0"><strong className="block break-words font-display text-[1.18rem] leading-6 text-[#2A2420]">Proteção e Presença</strong><small className="mt-1 block text-sm text-[#5C5248]">Jornada de São Miguel</small></span></span><ChevronRight className="text-[#B88736]"/></button><div className="mt-3 grid grid-cols-2 gap-3">{careCards.map(card => { const Icon=card.icon; return <button key={card.key} onClick={actions[card.key]} className="min-h-[10.5rem] min-w-0 rounded-[1.5rem] border border-[#B88736]/22 bg-[#FBF8F2]/90 p-4 text-left backdrop-blur-xl"><Icon size={24} className="text-[#B88736]"/><strong className="mt-5 block break-words font-display text-[1.15rem] leading-6 text-[#2A2420]">{card.title}</strong><small className="mt-2 block break-words text-sm leading-5 text-[#5C5248]">{card.copy}</small></button>})}</div></section>
    <section className="mt-5 rounded-[1.75rem] border border-[#B88736]/25 bg-[#FFFFFF]/95 p-5"><p className="text-xs uppercase tracking-[.2em] text-[#B88736]">Biblioteca de apoio</p><h3 className="mt-2 font-display text-2xl text-[#2A2420]">Outros caminhos da sua jornada</h3><div className="mt-4 space-y-2">{[['Perguntas sistêmicas', Users, props.onOpenSystemic],['Ho’oponopono', Heart, props.onOpenHooponopono],['Conquistas e marcos', Award, props.onOpenAchievements],['Cursos e conteúdos', GraduationCap, props.onOpenCourses],['Fale conosco', MessageCircle, props.onOpenContact]].map(([label,Icon,action]) => { const ItemIcon=Icon as typeof Users; return <button key={label as string} onClick={action as () => void} className="flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border border-[#B88736]/16 bg-[#F5EFE4] px-4 py-3.5 text-left text-sm font-semibold text-[#2A2420]"><span className="flex min-w-0 flex-1 items-center gap-3 break-words"><ItemIcon size={19} className="shrink-0 text-[#B88736]" /><span className="min-w-0 break-words">{label as string}</span></span><ChevronRight size={18} className="text-[#B88736]" /></button> })}</div></section>
    <nav className="ep-home-dock mt-5 grid w-full grid-cols-4 overflow-hidden rounded-[1.4rem] border border-[#E5DAC6] bg-white/88 p-1.5 shadow-[0_12px_32px_rgba(89,70,43,.08)]"><button onClick={() => document.getElementById('journey-choices')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl p-2.5 text-[11px] font-medium leading-none text-[#8F631E]"><Play size={21}/><span className="whitespace-nowrap">Prática</span></button><button onClick={props.onOpenJournal} className="flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl p-2.5 text-[11px] font-medium leading-none text-[#5C5248]"><BookOpen size={21}/><span className="whitespace-nowrap">Diário</span></button><button onClick={props.onOpenAnamnesis} className="flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl p-2.5 text-[11px] font-medium leading-none text-[#5C5248]"><Leaf size={21}/><span className="whitespace-nowrap">Momento</span></button><button onClick={props.onOpenSettings} className="flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl p-2.5 text-[11px] font-medium leading-none text-[#5C5248]"><Sliders size={21}/><span className="whitespace-nowrap">Ajustes</span></button></nav>
  </div>;
}
