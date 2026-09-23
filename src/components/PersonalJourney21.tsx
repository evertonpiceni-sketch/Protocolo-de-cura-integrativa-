import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Headphones, Pause, Play, RotateCcw, ShieldCheck, X } from 'lucide-react';
import { REINTEGRATION_DAYS, getReintegrationAcceptance } from '../data/reintegrationJourneyPublic';
import { APPROVED_LOGO_DATA_URI } from './ApprovedBrand';
import { audioEngine } from '../lib/audio';
import { JourneyDayVisualPreview } from './VideoStudioLightModal';
import { PausaConscienteLight } from './PausaConscienteLight';
import { AindaHaAlgoEmMimLight } from './AindaHaAlgoEmMimLight';

type Props = { onClose: () => void };
const STORAGE_KEY = 'transformacao_jornada_pessoal_21_dias_v1';
const REINTEGRATION_MUSIC_URL = 'https://7bhxppl2irhgbptb.public.blob.vercel-storage.com/REINTEGRA%C3%87%C3%83O%20%C3%80%20VIDA.mp3';
export default function PersonalJourney21({ onClose }: Props) {
  const [day, setDay] = useState(1);
  const [accepted, setAccepted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [showPausaConsciente, setShowPausaConsciente] = useState(false);
  const [showReflexao, setShowReflexao] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const voiceUrlRef = useRef<string | null>(null);
  const cueRequestRef = useRef<AbortController | null>(null);
  const lastCueRef = useRef(-1);
  const cuePendingRef = useRef(false);
  const wakeLockRef = useRef<any>(null);
  const playingRef = useRef(false);
  const [completed, setCompleted] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  });
  const item = REINTEGRATION_DAYS[day - 1];
  const elapsedSeconds = musicRef.current?.currentTime || 0;
  const totalSeconds = musicRef.current?.duration || 1797;
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
  const reflectionText = elapsedSeconds < 240
    ? 'O que o seu corpo precisa para se sentir seguro neste momento?'
    : elapsedSeconds < 360 ? item.intention
    : elapsedSeconds < 660 ? item.reflectionPrompts[0]
    : elapsedSeconds < 900 ? item.reflectionPrompts[1]
    : elapsedSeconds < 1260 ? 'Onde você percebe essas energias e sensações atuando no seu corpo agora?'
    : elapsedSeconds < 1620 ? 'Respire naturalmente. Não procure respostas. Apenas permita a integração.'
    : 'Que pequeno movimento desta prática você deseja levar para o seu dia?';

  const clearVoice = () => {
    cueRequestRef.current?.abort(); cueRequestRef.current = null;
    if (voiceRef.current) { voiceRef.current.pause(); voiceRef.current.src = ''; voiceRef.current = null; }
    if (voiceUrlRef.current) { URL.revokeObjectURL(voiceUrlRef.current); voiceUrlRef.current = null; }
    cuePendingRef.current = false;
  };

  const stopSession = () => {
    playingRef.current = false; clearVoice(); musicRef.current?.pause();
    void wakeLockRef.current?.release?.(); wakeLockRef.current = null; setPlaying(false);
  };

  const requestWakeLock = async () => {
    try { if ('wakeLock' in navigator && !wakeLockRef.current) wakeLockRef.current = await (navigator as any).wakeLock.request('screen'); }
    catch { /* music remains the authoritative clock */ }
  };

  const playCueForTime = async (currentTime: number) => {
    if (!playingRef.current || cuePendingRef.current || (voiceRef.current && !voiceRef.current.paused)) return;
    const dueCue = item.audioCues.reduce((last, cue, index) => cue.at <= currentTime + 0.5 ? index : last, -1);
    if (dueCue < 0 || dueCue <= lastCueRef.current) return;
    const cue = item.audioCues[dueCue];
    const age = Math.max(0, currentTime - cue.at);
    if (age > 8) { lastCueRef.current = dueCue; return; }

    cuePendingRef.current = true;
    const controller = new AbortController(); cueRequestRef.current = controller;
    try {
      const response = await fetch('/api/reintegration-tts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cue.text, day }), signal: controller.signal
      });
      if (!response.ok || !response.headers.get('content-type')?.includes('audio')) throw new Error(`voice ${response.status}`);
      const blob = await response.blob();
      if (!playingRef.current) return;
      if (voiceUrlRef.current) URL.revokeObjectURL(voiceUrlRef.current);
      const url = URL.createObjectURL(blob); voiceUrlRef.current = url;
      const voice = new Audio(url); voice.preload = 'auto'; voice.volume = 1; voiceRef.current = voice;
      voice.onended = () => {
        if (voiceRef.current === voice) voiceRef.current = null;
        if (voiceUrlRef.current === url) { URL.revokeObjectURL(url); voiceUrlRef.current = null; }
        cuePendingRef.current = false; void playCueForTime(musicRef.current?.currentTime || 0);
      };
      voice.onerror = () => { cuePendingRef.current = false; };
      await voice.play(); lastCueRef.current = dueCue;
    } catch (error: any) {
      if (error?.name !== 'AbortError') console.warn('Reintegração: condução neural indisponível', error);
    } finally {
      if (cueRequestRef.current === controller) cueRequestRef.current = null;
      if (!voiceRef.current || voiceRef.current.paused) cuePendingRef.current = false;
    }
  };

  useEffect(() => {
    // This journey has its own soundtrack and voice. Silence any global audio while it is open.
    audioEngine.stopSpeech();
    audioEngine.stopBG();
    return () => stopSession();
  }, []);
  useEffect(() => {
    stopSession(); setAccepted(false); setStarted(false); setAudioProgress(0);
    lastCueRef.current = -1; cuePendingRef.current = false;
    if (musicRef.current) musicRef.current.currentTime = 0;
  }, [day]);
  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible' || !playingRef.current) return;
      const music = musicRef.current; if (!music) return;
      void requestWakeLock();
      const now = music.currentTime || 0;
      if (Number.isFinite(music.duration) && music.duration > 0) setAudioProgress((now / music.duration) * 100);
      if (music.paused && now < (music.duration || 1797) - 1) void music.play().catch(() => undefined);
      if (voiceRef.current?.paused && voiceRef.current.currentTime > 0) void voiceRef.current.play().catch(() => undefined);
      window.setTimeout(() => {
        if (voiceRef.current && !voiceRef.current.paused) return;
        cuePendingRef.current = false;
        const latestDue = item.audioCues.reduce((last, cue, index) => cue.at <= (music.currentTime || now) ? index : last, -1);
        if (latestDue > lastCueRef.current) {
          const age = (music.currentTime || now) - item.audioCues[latestDue].at;
          lastCueRef.current = age <= 8 ? latestDue - 1 : latestDue;
        }
        void playCueForTime(music.currentTime || now);
      }, 180);
    };
    document.addEventListener('visibilitychange', handleVisibility); window.addEventListener('pageshow', handleVisibility); window.addEventListener('focus', handleVisibility);
    return () => { document.removeEventListener('visibilitychange', handleVisibility); window.removeEventListener('pageshow', handleVisibility); window.removeEventListener('focus', handleVisibility); };
  }, [day]);

  const startGuidedMeditation = async () => {
    if (!accepted) return;
    // Defensive guard against global audio being reactivated by the same click/touch gesture.
    audioEngine.stopSpeech();
    audioEngine.stopBG();
    if (playing) { voiceRef.current?.pause(); musicRef.current?.pause(); playingRef.current = false; setPlaying(false); return; }
    if (started && audioProgress > 0 && audioProgress < 99) {
      playingRef.current = true; setPlaying(true);
      await musicRef.current?.play().catch(() => undefined); if (voiceRef.current?.paused) await voiceRef.current.play().catch(() => undefined);
      await requestWakeLock(); void playCueForTime(musicRef.current?.currentTime || 0); return;
    }
    setStarted(true); clearVoice(); lastCueRef.current = -1;
    playingRef.current = true; setPlaying(true);
    if (musicRef.current) { musicRef.current.volume = 0.22; musicRef.current.currentTime = 0; }
    // The first neural cue is requested immediately from the same user gesture as Play.
    void playCueForTime(0);
    await musicRef.current?.play().catch(() => undefined); await requestWakeLock();
  };

  const rewindMeditation = () => {
    const music = musicRef.current; if (!music) return;
    const target = Math.max(0, music.currentTime - 15); clearVoice(); music.currentTime = target;
    lastCueRef.current = item.audioCues.reduce((last, cue, index) => cue.at < target ? index : last, -1); void playCueForTime(target);
  };

  const complete = () => {
    stopSession(); const next = completed.includes(day) ? completed : [...completed, day].sort((a,b) => a-b);
    setCompleted(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); if (day < 21) setDay(day + 1);
  };

  return <div className="ep-reintegration-shell relative min-h-screen bg-[#F8F4EC] px-4 py-5 text-[#2A2420]">
    <div className="pointer-events-none fixed right-4 top-4 z-20 h-14 w-14 overflow-hidden rounded-full border border-[#B88736]/14 bg-[#F8F4EC]/35 opacity-30 shadow-[0_8px_24px_rgba(0,0,0,.12)] backdrop-blur-md sm:right-6 sm:top-6 sm:h-16 sm:w-16"><img src={APPROVED_LOGO_DATA_URI} alt="" aria-hidden="true" className="h-full w-full object-contain opacity-80" /></div>
    <audio ref={musicRef} src={REINTEGRATION_MUSIC_URL} preload="metadata"
      onTimeUpdate={event => { const audio=event.currentTarget; if(Number.isFinite(audio.duration)&&audio.duration>0)setAudioProgress((audio.currentTime/audio.duration)*100); void playCueForTime(audio.currentTime); }}
      onEnded={() => { clearVoice(); playingRef.current=false; setPlaying(false); setAudioProgress(100); }}/>
    <main className="mx-auto w-full max-w-[620px]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <button onClick={() => { stopSession(); onClose(); }} className="flex items-center gap-2 rounded-full border border-[#E5DAC6] bg-white/80 px-4 py-2 text-sm font-semibold text-[#524842] shadow-[0_10px_24px_rgba(0,0,0,.06)] backdrop-blur-md"><ArrowLeft size={17}/>Voltar ao início</button>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowPausaConsciente(true)} className="rounded-full border border-[#E5DAC6] bg-white/85 px-4 py-2 text-xs font-semibold text-[#5C5248]">Pausa Consciente</button>
          <button onClick={() => setShowReflexao(true)} className="rounded-full border border-[#D5DDD1] bg-[#5E7153]/8 px-4 py-2 text-xs font-semibold text-[#5E7153]">Ainda Há Algo em Mim</button>
        </div>
      </div>
      <section className="ep-reintegration-panel overflow-hidden rounded-[2rem]">
        <div className="ep-reintegration-luminous px-6 py-7 text-[#2A2420] bg-gradient-to-br from-[#FBF8F2] to-[#F3EBDD]">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#B88736]">21 Dias para Voltar para Mim</p><p className="mt-2 font-display text-xl italic">Reintegração da Vida</p><h1 className="mt-3 font-display text-3xl leading-tight">Dia {day}: {item.title}</h1><p className="mt-3 text-base leading-7 text-[#5C5248]">{item.cycle}</p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#E5DAC6]"><div className="h-full rounded-full bg-[#B88736]" style={{width:`${Math.round((completed.length/21)*100)}%`}}/></div><p className="mt-2 text-xs text-[#85786C]">{completed.length} de 21 momentos concluídos</p>
        </div>
        <div className="space-y-5 p-5 text-[#2A2420] sm:p-6">
          <div className="grid grid-cols-7 gap-2">{REINTEGRATION_DAYS.map(entry => <button key={entry.day} onClick={() => setDay(entry.day)} aria-label={`Abrir dia ${entry.day}`} className={`flex aspect-square items-center justify-center rounded-full border text-xs font-bold shadow-[0_8px_18px_rgba(0,0,0,.12)] ${day===entry.day?'border-[#D6A756] bg-gradient-to-br from-[#D6A756] to-[#9E6E24] text-[#2A2420]':completed.includes(entry.day)?'border-[#B88736]/55 bg-[#B88736]/14 text-[#D6A756]':'border-[#B88736]/18 bg-white/80 text-[#85786C]'}`}>{completed.includes(entry.day)?<Check size={14}/>:entry.day}</button>)}</div>
          <article className="ep-reintegration-card rounded-3xl border border-[#E5DAC6] bg-white/85 p-5 shadow-sm"><p className="text-xs uppercase tracking-[.16em] text-[#B88736]">Intenção do dia</p><p className="mt-2 text-base leading-7 text-[#5C5248]">{item.intention}</p></article>
          <section className="relative overflow-hidden rounded-[2rem] border border-[#E5DAC6] bg-white/80 shadow-[0_18px_44px_rgba(90,72,52,.08)]">
            <div className="relative flex h-[500px] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFFDFC] to-[#F8F2E9] px-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,185,107,.18),transparent_42%)]" />
              <div className="relative z-10 flex w-full flex-col items-center">
                <div className="relative mb-8 w-full max-w-sm">
                  <JourneyDayVisualPreview day={day} />
                </div>
                <div className="w-full max-w-sm rounded-2xl border border-[#E5DAC6] bg-white/85 p-4 text-center shadow-sm backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#B88736]">{playing?'Meditação guiada em andamento':'Sua meditação guiada'}</p>
                  <p className="mt-2 text-sm text-[#85786C]">{playing?'Respire. Permaneça aqui. A luz acompanha o seu momento.':'Voz feminina, música e uma experiência visual de presença.'}</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E5DAC6]"><div className="h-full rounded-full bg-gradient-to-r from-[#D6A756] to-[#9E6E24] transition-all" style={{width:`${audioProgress}%`}}/></div>
                </div>
              </div>
            </div></section>
          <label className="ep-reintegration-card flex cursor-pointer items-start gap-3 rounded-3xl border border-[#E5DAC6] bg-white/85 p-5 shadow-sm"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)} className="mt-1 h-5 w-5 accent-[#B88736]"/><span className="text-sm leading-6 text-[#2A2420]">{getReintegrationAcceptance(day)}</span></label>
          <button disabled={!accepted} onClick={startGuidedMeditation} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#D6A756] to-[#9E6E24] px-5 py-4 font-bold text-[#1F1B18] shadow-md shadow-[#B88736]/20 disabled:opacity-40">{playing?<Pause size={20}/>:started?<Play size={20}/>:<Headphones size={20}/>} {playing?'Pausar meditação':started?'Continuar meditação':'Iniciar meditação guiada'}</button>
          <article className="ep-reintegration-card rounded-3xl border border-[#E5DAC6] bg-white/85 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[.16em] text-[#B88736]">Energias trabalhadas nesta etapa</p>
            <p className="mt-2 text-sm leading-6 text-[#85786C]">Neste dia, as práticas energéticas foram organizadas para acompanhar a intenção “{item.title}”. A proposta é oferecer um campo de presença e integração enquanto você respira, observa o corpo e percorre a meditação. As ativações são programadas por Everton e você permanece livre para interromper a experiência a qualquer momento.</p>
            <div className="mt-4 space-y-3">{item.energyNotes.map((note,index)=><div key={note.name} className="rounded-2xl border border-[#B88736]/14 bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.02)]"><strong className="block text-sm text-[#2A2420]">{note.name}</strong><span className="mt-2 block text-sm leading-6 text-[#85786C]"><b>Foco nesta prática:</b> {note.focus}</span><span className="mt-2 block text-sm leading-6 text-[#85786C]">{index===0?`Durante a condução, esta combinação é utilizada como apoio energético ao propósito de ${item.title.toLowerCase()}, acompanhando a respiração, a presença corporal e o movimento interno proposto para o Dia ${day}.`:`As frequências associadas a estes elementos acompanham as regiões e qualidades indicadas acima, funcionando dentro da proposta espiritual desta jornada como suporte à integração do trabalho do dia.`}</span></div>)}</div>
          </article>
          <p className="flex items-start gap-2 text-xs leading-5 text-[#85786C]"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#B88736]"/>Esta jornada é uma experiência espiritual e integrativa complementar. Ela não substitui atendimento médico, psicológico ou apoio humano necessário.</p>
          <div className="flex items-center justify-between gap-3 border-t border-[#B88736]/16 pt-5"><button disabled={day===1} onClick={()=>setDay(day-1)} className="flex items-center gap-1 rounded-full border border-[#B88736]/18 bg-white/75 px-3 py-2 text-sm font-semibold text-[#2A2420] disabled:opacity-30"><ChevronLeft size={18}/>Anterior</button><button onClick={complete} className="ep-gold-button rounded-full px-5 py-3 text-sm font-bold">{day===21?'Concluir jornada':'Concluir dia'}</button><button disabled={day===21} onClick={()=>setDay(day+1)} className="flex items-center gap-1 rounded-full border border-[#B88736]/18 bg-white/75 px-3 py-2 text-sm font-semibold text-[#2A2420] disabled:opacity-30">Próximo<ChevronRight size={18}/></button></div>
        </div>
      </section>
    </main>
    {showPausaConsciente && <section className="fixed inset-0 z-[130] overflow-y-auto bg-[#F8F4EC]">
      <button onClick={() => setShowPausaConsciente(false)} className="fixed right-4 top-4 z-[140] rounded-full border border-[#E5DAC6] bg-white/90 px-4 py-2 text-sm font-semibold text-[#5C5248] shadow-sm">Fechar</button>
      <PausaConscienteLight />
    </section>}
    {showReflexao && <section className="fixed inset-0 z-[130] overflow-y-auto bg-[#F8F4EC]">
      <button onClick={() => setShowReflexao(false)} className="fixed right-4 top-4 z-[140] rounded-full border border-[#E5DAC6] bg-white/90 px-4 py-2 text-sm font-semibold text-[#5C5248] shadow-sm">Fechar</button>
      <AindaHaAlgoEmMimLight onFinishReflection={() => setShowReflexao(false)} />
    </section>}
    {started && <section className="fixed inset-0 z-[120] flex min-h-[100dvh] flex-col overflow-hidden bg-[#F8F4EC] text-[#2A2420]" aria-label="Meditação guiada em andamento">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,185,107,.16),transparent_46%)]"/>
      <button onClick={()=>{stopSession();setStarted(false);}} className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-20 rounded-full border border-[#E5DAC6] bg-white/80 p-3 text-[#524842] shadow-sm backdrop-blur-md" aria-label="Fechar meditação"><X size={22}/></button>
      <div className="relative z-10 flex flex-1 items-center justify-center">
        <div className="relative w-[82vw] max-w-[430px]">
          <JourneyDayVisualPreview day={day} />
        </div>
      </div>
      <div className="relative z-10 space-y-4 bg-gradient-to-t from-[#F8F4EC] via-[#F8F4EC]/96 to-transparent px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#B88736]">Dia {day} · {item.title}</p>
        <p className="font-display text-2xl text-[#2A2420]">{playing?(elapsedSeconds>=1260&&elapsedSeconds<1620?'Absorção e silêncio':'Permaneça neste momento'):audioProgress>=100?'Meditação concluída':'Meditação pausada'}</p>
        <p className="mx-auto max-w-md text-base leading-7 text-[#5C5248]">{reflectionText}</p>
        <p className="text-xs text-[#85786C]">{elapsedSeconds>=1260&&elapsedSeconds<1620?'Apenas a música permanece enquanto você integra a experiência.':'Permaneça com esta reflexão até a próxima condução da voz.'}</p>
        <div className="mx-auto max-w-md"><div className="h-2 overflow-hidden rounded-full bg-[#E5DAC6]"><div className="h-full rounded-full bg-gradient-to-r from-[#D6A756] to-[#9E6E24] transition-all duration-500" style={{width:`${audioProgress}%`}}/></div><div className="mt-2 flex justify-between text-xs text-[#85786C]"><span>{formatTime(elapsedSeconds)}</span><span>{formatTime(totalSeconds)}</span></div></div>
        <div className="flex items-center justify-center gap-3"><button onClick={rewindMeditation} className="flex items-center justify-center gap-2 rounded-full border border-[#E5DAC6] bg-white/80 px-4 py-4 text-sm font-semibold text-[#524842]" aria-label="Voltar 15 segundos"><RotateCcw size={20}/>15s</button><button onClick={startGuidedMeditation} className="flex min-w-48 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#D6A756] to-[#9E6E24] px-6 py-4 font-bold text-[#1F1B18] shadow-md shadow-[#B88736]/20">{playing?<Pause size={21}/>:<Play size={21}/>} {playing?'Pausar':audioProgress>=100?'Ouvir novamente':'Continuar'}</button></div>
      </div>
    </section>}
  </div>;
}
