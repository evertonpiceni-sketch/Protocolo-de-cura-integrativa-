import React, { useMemo, useState } from 'react';
import { Award, BookOpen, ChevronRight, Flower2, GraduationCap, Headphones, Heart, Leaf, MessageCircle, Pause, Play, Sliders, Sparkles, Sun, Users, Waves } from 'lucide-react';
import { AnamnesisData, DAILY_INSIGHTS, DayProgress } from '../types';
import brandLogo from '../assets/images/app_icon_lotus_1787334709504.jpg';
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
  const recommendation = useMemo(
    () => props.anamnesis ? evaluateBestTreatmentFromAnamnesis(props.anamnesis) : null,
    [props.anamnesis]
  );
  const actions: Record<string, () => void> = {
    chakras: props.onOpenChakras,
    bath: props.onOpenBaths,
    astral: props.onOpenAstral,
    numerology: props.onOpenNumerology,
  };
  const welcomeText = `Olá, ${firstName}. Que bom que você voltou para si. Respire com calma. Você não precisa fazer tudo hoje. Estamos juntos neste processo. ${insight?.quote || ''}`;
  const toggleWelcome = () => {
    if (isSpeaking) {
      audioEngine.stopSpeech();
      setIsSpeaking(false);
      return;
    }
    void audioEngine.speakWithElevenLabsOrFallback(
      welcomeText, 1, () => setIsSpeaking(true), () => setIsSpeaking(false), undefined, undefined,
      { voiceId: 'Marcus', stability: .5, similarityBoost: .78, userName: props.userName, enableBreathingPauses: true, preferElevenLabs: true, lang: 'pt-BR', rate: .82, pitch: .92 }
    );
  };
  const speakResult = () => {
    if (!recommendation) return;
    const text = `Olá, ${firstName}. Seu resultado personalizado indica ${recommendation.categoryLabel}. ${recommendation.summaryDiagnosis}. A frequência recomendada é ${recommendation.frequencyLabel}. O chakra em foco é ${recommendation.primaryChakraFocus}. O floral recomendado é ${recommendation.recommendedFloral}. A aromaterapia recomendada é ${recommendation.recommendedAromatherapy}. Estamos juntos neste processo.`;
    audioEngine.stopSpeech();
    void audioEngine.speakWithElevenLabsOrFallback(
      text, 1, () => setIsSpeaking(true), () => setIsSpeaking(false), undefined, undefined,
      { voiceId: 'Marcus', stability: .5, similarityBoost: .78, userName: props.userName, enableBreathingPauses: true, preferElevenLabs: true, lang: 'pt-BR', rate: .82, pitch: .92 }
    );
  };

  if (!journeyEntered) {
    const enterJourney = () => {
      sessionStorage.setItem('transformation_journey_entered', 'true');
      setJourneyEntered(true);
      toggleWelcome();
    };
    return <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-[520px] items-center px-4 py-5">
      <section className="ep-home-hero relative w-full overflow-hidden rounded-[2rem] border border-[#e7ca76]/35 px-6 py-8 text-center shadow-[0_24px_70px_rgba(0,0,0,.34)]">
        <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(to_bottom,rgba(3,35,25,.08),rgba(3,35,25,.9)),url('/brand/forest-app-background.png')] bg-cover bg-center" />
        <div className="relative mx-auto mb-6 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-2 border-[#e7ca76]/60 bg-[#062d20] shadow-[0_0_34px_rgba(231,202,118,.28)]">
          <img src={brandLogo} alt="Everton Piceni — Terapias Holísticas e Bem-Estar" className="h-full w-full object-cover" />
        </div>
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[.24em] text-[#e7ca76]">Protocolo da Transformação</p>
          <h1 className="mt-5 font-display text-4xl leading-tight text-[#fff8e7]">Bem-vindo ao seu momento de transformação</h1>
          <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-[#d7e4db]">Aqui você encontra um espaço seguro para se reconectar, equilibrar sua energia e voltar para si.</p>
          <div className="mx-auto mt-6 flex max-w-sm items-center gap-4 rounded-2xl border border-[#e7ca76]/30 bg-[#04291d]/90 p-4 text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#e7ca76]/45 text-[#e7ca76]"><Headphones size={23}/></div>
            <div><strong className="block font-display text-xl text-[#fff8e7]">528 Hz</strong><span className="text-sm text-[#c9d9ce]">Sons que acolhem você</span></div>
          </div>
          <button onClick={enterJourney} className="ep-gold-button mt-6 flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-base font-bold"><span>Começar minha jornada</span><ChevronRight size={20}/></button>
          <div className="mt-7 grid grid-cols-4 gap-2 text-[#e7ca76]">
            {[[Waves,'Escuta'],[Leaf,'Presença'],[Heart,'Equilíbrio'],[Sparkles,'Transformação']].map(([Icon,label]) => { const PillarIcon=Icon as typeof Waves; return <div key={label as string} className="flex flex-col items-center gap-2"><PillarIcon size={21}/><span className="text-[10px] uppercase tracking-[.08em] text-[#d7e4db]">{label as string}</span></div>; })}
          </div>
        </div>
      </section>
    </div>;
  }

  return (
    <div className="ep-home mx-auto w-full max-w-[520px] px-4 pb-28 sm:px-5">
      <section className="ep-home-hero overflow-hidden rounded-[2rem] border border-[#e7ca76]/35 px-6 py-8 text-center shadow-[0_24px_70px_rgba(0,0,0,.34)]">
        <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-[#e7ca76]/55 bg-[#062d20] shadow-[0_0_28px_rgba(231,202,118,.2)]">
          <img src={brandLogo} alt="Everton Piceni — Terapias Holísticas e Bem-Estar" className="h-full w-full object-cover" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[.24em] text-[#e7ca76]">Protocolo da Transformação</p>
        <h2 className="mt-4 font-display text-[2.15rem] font-semibold leading-tight text-[#fff8e7]">Olá, {firstName}.</h2>
        <p className="mx-auto mt-3 max-w-sm font-display text-xl italic leading-7 text-[#dce9df]">Que bom que você voltou para si.</p>
        <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-[#e7ca76] to-transparent" />
        <p className="mx-auto mt-5 max-w-sm text-base leading-7 text-[#d7e4db]">Respire. Você não precisa fazer tudo hoje. Escolha apenas o cuidado que combina com o seu momento.</p>
        <button onClick={toggleWelcome} className="mx-auto mt-6 flex items-center justify-center gap-2 rounded-full border border-[#e7ca76]/40 bg-[#062f21]/80 px-5 py-3 text-sm font-semibold text-[#f1db94]">
          {isSpeaking ? <Pause size={18} /> : <Headphones size={18} />}{isSpeaking ? 'Pausar acolhimento' : 'Ouvir acolhimento'}
        </button>
      </section>

      {!props.anamnesis ? (
        <section className="mt-5 rounded-[1.75rem] border border-[#e7ca76]/30 bg-[#062f21]/95 p-5 shadow-[0_18px_48px_rgba(0,0,0,.28)]">
          <p className="text-xs uppercase tracking-[.2em] text-[#e7ca76]">Primeiro, vamos ouvir você</p>
          <h3 className="mt-2 font-display text-3xl text-[#fff8e7]">Como você está de verdade?</h3>
          <p className="mt-3 text-base leading-7 text-[#c9d9ce]">Responda à anamnese para receber seu resultado, frequência, chakra em foco, floral, aroma e protocolo recomendado.</p>
          <button onClick={props.onOpenAnamnesis} className="ep-gold-button mt-5 w-full rounded-2xl px-5 py-4 text-base font-bold">Começar minha anamnese</button>
        </section>
      ) : recommendation && (
        <section className="mt-5 overflow-hidden rounded-[1.75rem] border border-[#e7ca76]/30 bg-[#052a1e]/96 shadow-[0_18px_48px_rgba(0,0,0,.28)]">
          <div className="relative h-56 overflow-hidden border-b border-[#e7ca76]/20">
            <img src="/brand/human-chakra-model.jpg" alt="Corpo em meditação com os sete chakras" className="h-full w-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#052a1e] via-transparent to-transparent" />
            <p className="absolute bottom-4 left-5 text-xs uppercase tracking-[.2em] text-[#e7ca76]">Seu resultado personalizado</p>
          </div>
          <div className="p-5">
            <h3 className="font-display text-3xl leading-tight text-[#fff8e7]">{recommendation.categoryLabel}</h3>
            <p className="mt-3 text-base leading-7 text-[#c9d9ce]">{recommendation.summaryDiagnosis}</p>
            <button onClick={speakResult} className="mt-4 flex items-center gap-2 rounded-full border border-[#e7ca76]/35 bg-[#073426] px-4 py-2.5 text-sm font-semibold text-[#ead382]"><Headphones size={17} />Ouvir meu resultado</button>
            <div className="mt-5 space-y-3">
              {[
                ['Frequência Solfeggio', recommendation.frequencyLabel],
                ['Chakra em foco', recommendation.primaryChakraFocus],
                ['Floral recomendado', recommendation.recommendedFloral || props.anamnesis.recommendedFloral || 'Definido conforme sua anamnese'],
                ['Aromaterapia recomendada', recommendation.recommendedAromatherapy || props.anamnesis.recommendedAromatherapy || 'Definida conforme sua anamnese'],
                ['Protocolo indicado', recommendation.treatmentTitle],
                ['Duração sugerida', `${recommendation.recommendedDurationDays} dias`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-[#e7ca76]/18 bg-[#073426] p-4">
                  <span className="block text-xs uppercase tracking-[.15em] text-[#d9bd69]">{label}</span>
                  <strong className="mt-1 block text-base leading-6 text-[#fff8e7]">{value}</strong>
                </div>
              ))}
            </div>
            <button onClick={props.onOpenAnamnesis} className="mt-4 w-full rounded-2xl border border-[#e7ca76]/35 px-5 py-3 text-sm font-semibold text-[#ead382]">Ver ou refazer minha anamnese</button>
          </div>
        </section>
      )}

      <section className="mt-5 rounded-[1.75rem] border border-[#e7ca76]/30 bg-[#062f21]/95 p-5 shadow-[0_18px_48px_rgba(0,0,0,.28)]">
        <div className="flex items-center justify-between gap-4">
          <div><p className="text-xs uppercase tracking-[.2em] text-[#e7ca76]">Seu momento de hoje</p><h3 className="mt-2 font-display text-3xl text-[#fff8e7]">Dia {props.currentDay}</h3></div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e7ca76]/30 bg-[#e7ca76]/10 text-[#e7ca76]"><Headphones size={24}/></div>
        </div>
        <p className="mt-4 text-base leading-7 text-[#c9d9ce]">Uma prática guiada com voz humana, frequência e espaço para respirar no seu tempo.</p>
        <div className="mt-5 rounded-2xl border border-[#e7ca76]/20 bg-[#04291d] p-4">
          <p className="text-xs uppercase tracking-[.18em] text-[#e7ca76]">Preparação da experiência</p>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-[#d7e4db]">
            <li className="flex gap-3"><span className="text-[#e7ca76]">01</span><span>Escolha um local tranquilo e reserve este tempo para você.</span></li>
            <li className="flex gap-3"><span className="text-[#e7ca76]">02</span><span>Use fones de ouvido, se possível, e mantenha-se em uma posição confortável.</span></li>
            <li className="flex gap-3"><span className="text-[#e7ca76]">03</span><span>Permita-se viver a experiência sem pressa e no seu próprio ritmo.</span></li>
          </ul>
        </div>
        <div className="mt-5 rounded-2xl border border-[#e7ca76]/20 bg-[#04291d] p-4">
          <p className="text-xs uppercase tracking-[.18em] text-[#e7ca76]">Frase de acolhimento</p>
          <blockquote className="mt-2 font-display text-xl italic leading-7 text-[#fff8e7]">“{insight?.quote}”</blockquote>
          <p className="mt-2 text-sm text-[#b9cdbf]">{insight?.quoteAuthor}</p>
        </div>
        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#e7ca76]/20 bg-[#073426] p-4 text-left">
          <input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} className="mt-1 h-5 w-5 accent-[#d8b455]" />
          <span className="text-sm leading-6 text-[#d7e4db]">Eu aceito realizar este protocolo conscientemente e me comprometo com a minha jornada de transformação.</span>
        </label>
        <button disabled={!accepted} onClick={() => props.onStartSession(props.currentDay)} className="ep-gold-button mt-5 flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-base font-bold disabled:cursor-not-allowed disabled:opacity-35"><Play size={20} fill="currentColor"/>Iniciar meditação</button>
      </section>

      <section className="mt-5 rounded-[1.75rem] border border-[#e7ca76]/25 bg-[#052a1e]/92 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-[#e7ca76]">Seu progresso</p><h3 className="mt-2 font-display text-2xl text-[#fff8e7]">Um passo de cada vez</h3></div><span className="font-display text-2xl text-[#e7ca76]">{percentage}%</span></div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/25"><div className="h-full rounded-full bg-gradient-to-r from-[#b78d32] to-[#f0d98d]" style={{width:`${percentage}%`}}/></div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={props.onOpenJournal} className="flex items-center gap-3 rounded-2xl border border-[#e7ca76]/20 bg-[#0a3a29]/75 p-4 text-left"><BookOpen size={21} className="text-[#e7ca76]"/><span><strong className="block text-sm text-[#fff8e7]">Meu Diário</strong><small className="mt-1 block text-xs text-[#b9cdbf]">Registrar percepções</small></span></button>
          <button onClick={props.onOpenAnamnesis} className="flex items-center gap-3 rounded-2xl border border-[#e7ca76]/20 bg-[#0a3a29]/75 p-4 text-left"><Waves size={21} className="text-[#e7ca76]"/><span><strong className="block text-sm text-[#fff8e7]">Como estou?</strong><small className="mt-1 block text-xs text-[#b9cdbf]">Olhar meu momento</small></span></button>
        </div>
      </section>

      <section className="mt-5 rounded-[1.75rem] border border-[#e7ca76]/25 bg-[#052a1e]/95 p-5">
        <p className="text-xs uppercase tracking-[.2em] text-[#e7ca76]">Afirmação do dia</p>
        <h3 className="mt-2 font-display text-2xl text-[#fff8e7]">{insight?.title}</h3>
        <p className="mt-3 text-base leading-7 text-[#c9d9ce]">{insight?.description}</p>
        <div className="mt-4 rounded-2xl border border-[#e7ca76]/18 bg-[#073426] p-4 text-base italic leading-7 text-[#f2e7c6]">{insight?.focus}</div>
      </section>

      <section className="mt-5 rounded-[1.75rem] border border-[#e7ca76]/25 bg-[#052a1e]/95 p-6 text-center">
        <p className="font-display text-2xl leading-8 text-[#fff8e7]">Você já fez muito por você.</p>
        <p className="mt-2 font-display text-2xl italic leading-8 text-[#e9d58f]">Agora, é a sua vez.</p>
        <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-[#e7ca76] to-transparent" />
        <p className="mt-5 text-sm uppercase tracking-[.18em] text-[#c9d9ce]">Um lugar para voltar para si. Sempre.</p>
      </section>

      <section className="mt-5">
        <div className="mb-4 px-1"><p className="text-xs uppercase tracking-[.2em] text-[#e7ca76]">Caminhos de cuidado</p><h3 className="mt-2 font-display text-3xl text-[#fff8e7]">Escolha o que faz sentido</h3></div>
        <button onClick={props.onOpenArcanjo} className="group flex w-full items-center justify-between rounded-[1.6rem] border border-[#e7ca76]/35 bg-gradient-to-br from-[#0a412d]/95 to-[#052a1e]/95 p-5 text-left shadow-[0_16px_42px_rgba(0,0,0,.24)]"><span className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e7ca76]/12 text-[#e7ca76]"><Sparkles size={24}/></span><span><strong className="block font-display text-xl text-[#fff8e7]">Proteção e Presença</strong><small className="mt-1 block text-sm text-[#c3d4c8]">Jornada de São Miguel</small></span></span><ChevronRight className="text-[#e7ca76]"/></button>
        <div className="mt-3 grid grid-cols-2 gap-3">{careCards.map(card => { const Icon=card.icon; return <button key={card.key} onClick={actions[card.key]} className="min-h-40 rounded-[1.5rem] border border-[#e7ca76]/22 bg-[#062f21]/90 p-4 text-left backdrop-blur-xl"><Icon size={24} className="text-[#e7ca76]"/><strong className="mt-5 block font-display text-xl leading-5 text-[#fff8e7]">{card.title}</strong><small className="mt-2 block text-sm leading-5 text-[#b9cdbf]">{card.copy}</small></button>})}</div>
      </section>

      <section className="mt-5 rounded-[1.75rem] border border-[#e7ca76]/25 bg-[#052a1e]/95 p-5">
        <p className="text-xs uppercase tracking-[.2em] text-[#e7ca76]">Biblioteca de apoio</p>
        <h3 className="mt-2 font-display text-2xl text-[#fff8e7]">Outros caminhos da sua jornada</h3>
        <div className="mt-4 space-y-2">
          {[
            ['Perguntas sistêmicas', Users, props.onOpenSystemic],
            ['Ho’oponopono', Heart, props.onOpenHooponopono],
            ['Conquistas e marcos', Award, props.onOpenAchievements],
            ['Cursos e conteúdos', GraduationCap, props.onOpenCourses],
            ['Fale conosco', MessageCircle, props.onOpenContact],
          ].map(([label, Icon, action]) => {
            const ItemIcon = Icon as typeof Users;
            return <button key={label as string} onClick={action as () => void} className="flex w-full items-center justify-between rounded-2xl border border-[#e7ca76]/16 bg-[#073426] p-4 text-left text-sm font-semibold text-[#f6eed8]"><span className="flex items-center gap-3"><ItemIcon size={19} className="text-[#e7ca76]" />{label as string}</span><ChevronRight size={18} className="text-[#d9bd69]" /></button>;
          })}
        </div>
      </section>

      <nav className="mt-5 flex w-full items-center justify-around rounded-[1.4rem] border border-[#e7ca76]/25 bg-[#042a1d]/95 px-2 py-2">
        <button onClick={() => props.onStartSession(props.currentDay)} className="flex min-w-16 flex-col items-center gap-1 p-2 text-xs text-[#efd786]"><Play size={21}/><span>Prática</span></button>
        <button onClick={props.onOpenJournal} className="flex min-w-16 flex-col items-center gap-1 p-2 text-xs text-[#d6e3d9]"><BookOpen size={21}/><span>Diário</span></button>
        <button onClick={props.onOpenAnamnesis} className="flex min-w-16 flex-col items-center gap-1 p-2 text-xs text-[#d6e3d9]"><Leaf size={21}/><span>Momento</span></button>
        <button onClick={props.onOpenSettings} className="flex min-w-16 flex-col items-center gap-1 p-2 text-xs text-[#d6e3d9]"><Sliders size={21}/><span>Ajustes</span></button>
      </nav>
    </div>
  );
}
