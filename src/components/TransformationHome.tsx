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
  const [accepted, setAccepted] = useState(false);
  const [journeyEntered, setJourneyEntered] = useState(() => sessionStorage.getItem('transformation_journey_entered') === 'true');
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
    const enterJourney = () => { sessionStorage.setItem('transformation_journey_entered', 'true'); setJourneyEntered(true); toggleWelcome(); };
    return <div className="mx-auto w-full max-w-[520px] px-4 py-4 sm:py-6">
      <section className="ep-home-hero relative w-full overflow-hidden rounded-[2rem] border border-[#B88736]/35 px-6 py-8 text-center shadow-[0_24px_70px_rgba(0,0,0,.34)]">
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_50%_0,rgba(214,167,86,.16),transparent_75%)]" />
        <div className="ep-brand-signature-wrap relative mx-auto mb-7 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-[#B88736]/28 bg-white/70"><img src={APPROVED_LOGO_DATA_URI} alt="Everton Piceni — Terapias Holísticas e Bem-Estar" className="ep-brand-signature h-full w-full object-contain" /></div>
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[.24em] text-[#B88736]">Protocolo da Transformação</p>
          <h1 className="mt-5 font-display text-4xl leading-tight text-[#2A2420]">Bem-vindo ao seu momento de transformação</h1>
          <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-[#5C5248]">Aqui você encontra um espaço seguro para se reconectar, equilibrar sua energia e voltar para si.</p>
          <button onClick={enterJourney} className="ep-gold-button mt-7 flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-base font-bold"><span>Começar minha jornada</span><ChevronRight size={20}/></button>
          <div className="mt-7 grid grid-cols-4 gap-2 text-[#B88736]">{[[Waves,'Escuta'],[Leaf,'Presença'],[Heart,'Equilíbrio'],[Sparkles,'Transformação']].map(([Icon,label]) => { const PillarIcon=Icon as typeof Waves; return <div key={label as string} className="flex flex-col items-center gap-2"><PillarIcon size={21}/><span className="text-[10px] uppercase tracking-[.08em] text-[#5C5248]">{label as string}</span></div>; })}</div>
        </div>
      </section>
    </div>;
  }

  return <div className="ep-home mx-auto w-full max-w-[520px] px-4 pb-28 sm:px-5">
    <section className="ep-home-hero overflow-hidden rounded-[2rem] border border-[#B88736]/35 px-6 py-8 text-center shadow-[0_24px_70px_rgba(0,0,0,.34)]">
      <div className="ep-brand-signature-wrap mx-auto mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[#B88736]/24 bg-white/70"><img src={APPROVED_LOGO_DATA_URI} alt="Everton Piceni — Terapias Holísticas e Bem-Estar" className="ep-brand-signature h-full w-full object-contain" /></div>
      <p className="text-xs font-semibold uppercase tracking-[.24em] text-[#B88736]">Protocolo da Transformação</p><h2 className="mt-4 font-display text-[2.15rem] font-semibold leading-tight text-[#2A2420]">Olá, {firstName}.</h2><p className="mx-auto mt-3 max-w-sm font-display text-xl italic leading-7 text-[#5C5248]">Que bom que você voltou para si.</p><div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-[#B88736] to-transparent" /><p className="mx-auto mt-5 max-w-sm text-base leading-7 text-[#5C5248]">Respire. Você não precisa fazer tudo hoje. Escolha apenas o cuidado que combina com o seu momento.</p>
      <button onClick={toggleWelcome} className="mx-auto mt-6 flex items-center justify-center gap-2 rounded-full border border-[#B88736]/40 bg-[#FBF8F2]/80 px-5 py-3 text-sm font-semibold text-[#B88736]">{isSpeaking ? <Pause size={18} /> : <Headphones size={18} />}{isSpeaking ? 'Pausar acolhimento' : 'Ouvir acolhimento'}</button>
    </section>

    {!props.anamnesis ? <section className="mt-5 rounded-[1.75rem] border border-[#B88736]/30 bg-[#FBF8F2]/95 p-5 shadow-[0_18px_48px_rgba(0,0,0,.28)]"><p className="text-xs uppercase tracking-[.2em] text-[#B88736]">Primeiro, vamos ouvir você</p><h3 className="mt-2 font-display text-3xl text-[#2A2420]">Como você está de verdade?</h3><p className="mt-3 text-base leading-7 text-[#5C5248]">Responda à anamnese para receber seu resultado, frequência, chakra em foco, floral, aroma e protocolo recomendado.</p><button onClick={props.onOpenAnamnesis} className="ep-gold-button mt-5 w-full rounded-2xl px-5 py-4 text-base font-bold">Começar minha anamnese</button></section> : recommendation && <section className="mt-5 overflow-hidden rounded-[1.75rem] border border-[#B88736]/30 bg-[#FFFFFF]/96 shadow-[0_18px_48px_rgba(0,0,0,.28)]"><div className="relative h-56 overflow-hidden border-b border-[#B88736]/20"><img src="/brand/chakra-body.svg" alt="Corpo em meditação com os sete chakras" className="h-full w-full object-contain object-center bg-[#F8F4EC]/45" /><div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] via-transparent to-transparent" /><p className="absolute bottom-4 left-5 text-xs uppercase tracking-[.2em] text-[#B88736]">Seu resultado personalizado</p></div><div className="p-5"><h3 className="font-display text-3xl leading-tight text-[#2A2420]">{recommendation.categoryLabel}</h3><p className="mt-3 text-base leading-7 text-[#5C5248]">{recommendation.summaryDiagnosis}</p><button onClick={speakResult} className="mt-4 flex items-center gap-2 rounded-full border border-[#B88736]/35 bg-[#F5EFE4] px-4 py-2.5 text-sm font-semibold text-[#B88736]"><Headphones size={17} />Ouvir meu resultado</button><div className="mt-5 space-y-3">{[['Frequência Solfeggio', recommendation.frequencyLabel],['Chakra em foco', recommendation.primaryChakraFocus],['Floral recomendado', recommendation.recommendedFloral || props.anamnesis.recommendedFloral || 'Definido conforme sua anamnese'],['Aromaterapia recomendada', recommendation.recommendedAromatherapy || props.anamnesis.recommendedAromatherapy || 'Definida conforme sua anamnese'],['Protocolo indicado', recommendation.treatmentTitle],['Duração sugerida', `${recommendation.recommendedDurationDays} dias`]].map(([label,value]) => <div key={label} className="rounded-2xl border border-[#B88736]/18 bg-[#F5EFE4] p-4"><span className="block text-xs uppercase tracking-[.15em] text-[#B88736]">{label}</span><strong className="mt-1 block text-base leading-6 text-[#2A2420]">{value}</strong></div>)}</div><button onClick={props.onOpenAnamnesis} className="mt-4 w-full rounded-2xl border border-[#B88736]/35 px-5 py-3 text-sm font-semibold text-[#B88736]">Ver ou refazer minha anamnese</button></div></section>}

    <section className="ep-luxury-card mt-5 rounded-[1.75rem] p-5"><div className="flex items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-[.2em] text-[#B88736]">Seu momento de hoje</p><h3 className="mt-2 font-display text-3xl text-[#2A2420]">Dia {props.currentDay}</h3></div><div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#B88736]/30 bg-[#B88736]/10 text-[#B88736]"><Headphones size={24}/></div></div><p className="mt-4 text-base leading-7 text-[#5C5248]">Uma prática guiada com voz humana, frequência e espaço para respirar no seu tempo.</p><div className="mt-5 rounded-2xl border border-[#B88736]/20 bg-[#F5EFE4] p-4"><p className="text-xs uppercase tracking-[.18em] text-[#B88736]">Preparação da experiência</p><ul className="mt-3 space-y-3 text-sm leading-6 text-[#5C5248]"><li className="flex gap-3"><span className="text-[#B88736]">01</span><span>Escolha um local tranquilo e reserve este tempo para você.</span></li><li className="flex gap-3"><span className="text-[#B88736]">02</span><span>Use fones de ouvido, se possível, e mantenha-se em uma posição confortável.</span></li><li className="flex gap-3"><span className="text-[#B88736]">03</span><span>Permita-se viver a experiência sem pressa e no seu próprio ritmo.</span></li></ul></div><div className="mt-5 rounded-2xl border border-[#B88736]/20 bg-[#F5EFE4] p-4"><p className="text-xs uppercase tracking-[.18em] text-[#B88736]">Frase de acolhimento</p><blockquote className="mt-2 font-display text-xl italic leading-7 text-[#2A2420]">“{insight?.quote}”</blockquote><p className="mt-2 text-sm text-[#5C5248]">{insight?.quoteAuthor}</p></div><label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#B88736]/20 bg-[#F5EFE4] p-4 text-left"><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} className="mt-1 h-5 w-5 accent-[#d8b455]" /><span className="text-sm leading-6 text-[#5C5248]">Eu aceito realizar este protocolo conscientemente e me comprometo com a minha jornada de transformação.</span></label><button disabled={!accepted} onClick={() => props.onStartSession(props.currentDay)} className="ep-gold-button mt-5 flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-base font-bold disabled:cursor-not-allowed disabled:opacity-35"><Play size={20} fill="currentColor"/>Iniciar meditação</button></section>

    <section className="ep-luxury-card ep-progress-card mt-5 rounded-[1.75rem] p-5"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-[#B88736]">Seu progresso</p><h3 className="mt-2 font-display text-2xl text-[#2A2420]">Um passo de cada vez</h3></div><span className="font-display text-2xl text-[#B88736]">{percentage}%</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-black/25"><div className="h-full rounded-full bg-gradient-to-r from-[#b78d32] to-[#f0d98d]" style={{width:`${percentage}%`}}/></div><div className="mt-5 grid grid-cols-2 gap-3"><button onClick={props.onOpenJournal} className="ep-subcard flex items-center gap-3 rounded-2xl p-4 text-left"><BookOpen size={21} className="text-[#B88736]"/><span><strong className="block text-sm text-[#2A2420]">Meu Diário</strong><small className="mt-1 block text-xs text-[#5C5248]">Registrar percepções</small></span></button><button onClick={props.onOpenAnamnesis} className="ep-subcard flex items-center gap-3 rounded-2xl p-4 text-left"><Waves size={21} className="text-[#B88736]"/><span><strong className="block text-sm text-[#2A2420]">Como estou?</strong><small className="mt-1 block text-xs text-[#5C5248]">Olhar meu momento</small></span></button></div></section>

    <section className="ep-luxury-card mt-5 rounded-[1.75rem] p-5"><p className="text-xs uppercase tracking-[.2em] text-[#B88736]">Afirmação do dia</p><h3 className="mt-2 font-display text-2xl text-[#2A2420]">{insight?.title}</h3><p className="mt-3 text-base leading-7 text-[#5C5248]">{insight?.description}</p><div className="mt-4 rounded-2xl border border-[#B88736]/18 bg-[#F5EFE4] p-4 text-base italic leading-7 text-[#f2e7c6]">{insight?.focus}</div></section>
    <section className="ep-luxury-card mt-5 rounded-[1.75rem] p-6 text-center"><p className="font-display text-2xl leading-8 text-[#2A2420]">Você já fez muito por você.</p><p className="mt-2 font-display text-2xl italic leading-8 text-[#B88736]">Agora, é a sua vez.</p><div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-[#B88736] to-transparent" /><p className="mt-5 text-sm uppercase tracking-[.18em] text-[#5C5248]">Um lugar para voltar para si. Sempre.</p></section>
    <section className="mt-5"><div className="mb-4 px-1"><p className="text-xs uppercase tracking-[.2em] text-[#B88736]">Caminhos de cuidado</p><h3 className="mt-2 font-display text-3xl text-[#2A2420]">Escolha o que faz sentido</h3></div><button onClick={props.onOpenPersonalJourney} className="group mb-3 flex w-full items-center justify-between rounded-[1.6rem] border border-[#B88736]/35 bg-gradient-to-br from-[#FBF8F2] to-[#F3EBDD] p-5 text-left shadow-[0_16px_42px_rgba(0,0,0,.24)]"><span className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B88736]/12 text-[#B88736]"><Heart size={24}/></span><span><strong className="block font-display text-xl text-[#2A2420]">21 Dias para Voltar para Mim</strong><small className="mt-1 block text-sm text-[#5C5248]">Reintegração da Vida</small></span></span><ChevronRight className="text-[#B88736]"/></button><button onClick={props.onOpenArcanjo} className="group flex w-full items-center justify-between rounded-[1.6rem] border border-[#B88736]/35 bg-gradient-to-br from-[#FBF8F2]/95 to-[#FFFFFF]/95 p-5 text-left shadow-[0_16px_42px_rgba(0,0,0,.24)]"><span className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B88736]/12 text-[#B88736]"><Sparkles size={24}/></span><span><strong className="block font-display text-xl text-[#2A2420]">Proteção e Presença</strong><small className="mt-1 block text-sm text-[#5C5248]">Jornada de São Miguel</small></span></span><ChevronRight className="text-[#B88736]"/></button><div className="mt-3 grid grid-cols-2 gap-3">{careCards.map(card => { const Icon=card.icon; return <button key={card.key} onClick={actions[card.key]} className="min-h-40 rounded-[1.5rem] border border-[#B88736]/22 bg-[#FBF8F2]/90 p-4 text-left backdrop-blur-xl"><Icon size={24} className="text-[#B88736]"/><strong className="mt-5 block font-display text-xl leading-5 text-[#2A2420]">{card.title}</strong><small className="mt-2 block text-sm leading-5 text-[#5C5248]">{card.copy}</small></button>})}</div></section>
    <section className="mt-5 rounded-[1.75rem] border border-[#B88736]/25 bg-[#FFFFFF]/95 p-5"><p className="text-xs uppercase tracking-[.2em] text-[#B88736]">Biblioteca de apoio</p><h3 className="mt-2 font-display text-2xl text-[#2A2420]">Outros caminhos da sua jornada</h3><div className="mt-4 space-y-2">{[['Perguntas sistêmicas', Users, props.onOpenSystemic],['Ho’oponopono', Heart, props.onOpenHooponopono],['Conquistas e marcos', Award, props.onOpenAchievements],['Cursos e conteúdos', GraduationCap, props.onOpenCourses],['Fale conosco', MessageCircle, props.onOpenContact]].map(([label,Icon,action]) => { const ItemIcon=Icon as typeof Users; return <button key={label as string} onClick={action as () => void} className="flex w-full items-center justify-between rounded-2xl border border-[#B88736]/16 bg-[#F5EFE4] p-4 text-left text-sm font-semibold text-[#f6eed8]"><span className="flex items-center gap-3"><ItemIcon size={19} className="text-[#B88736]" />{label as string}</span><ChevronRight size={18} className="text-[#B88736]" /></button> })}</div></section>
    <nav className="mt-5 flex w-full items-center justify-around rounded-[1.4rem] border border-[#B88736]/25 bg-[#042a1d]/95 px-2 py-2"><button onClick={() => props.onStartSession(props.currentDay)} className="flex min-w-16 flex-col items-center gap-1 p-2 text-xs text-[#efd786]"><Play size={21}/><span>Prática</span></button><button onClick={props.onOpenJournal} className="flex min-w-16 flex-col items-center gap-1 p-2 text-xs text-[#d6e3d9]"><BookOpen size={21}/><span>Diário</span></button><button onClick={props.onOpenAnamnesis} className="flex min-w-16 flex-col items-center gap-1 p-2 text-xs text-[#d6e3d9]"><Leaf size={21}/><span>Momento</span></button><button onClick={props.onOpenSettings} className="flex min-w-16 flex-col items-center gap-1 p-2 text-xs text-[#d6e3d9]"><Sliders size={21}/><span>Ajustes</span></button></nav>
  </div>;
}
