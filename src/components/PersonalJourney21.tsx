import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Headphones, Pause, Play, RotateCcw, ShieldCheck, X } from 'lucide-react';
import { audioEngine } from '../lib/audio';
import { REINTEGRATION_DAYS, REINTEGRATION_ACCEPTANCE } from '../data/reintegrationJourneyPublic';

type Props = { onClose: () => void };
const STORAGE_KEY = 'transformacao_jornada_pessoal_21_dias_v1';
const REINTEGRATION_MUSIC_URL = 'https://7bhxppl2irhgbptb.public.blob.vercel-storage.com/REINTEGRA%C3%87%C3%83O%20%C3%80%20VIDA.mp3';
const CHAKRAS = [['#a855f7','22%'],['#6366f1','31%'],['#38bdf8','40%'],['#22c55e','50%'],['#eab308','60%'],['#f97316','69%'],['#ef4444','78%']] as const;
const MOTES = [
  { left:'18%', top:'72%', size:5, drift:-46 }, { left:'28%', top:'60%', size:3, drift:-70 },
  { left:'72%', top:'68%', size:4, drift:-54 }, { left:'82%', top:'55%', size:3, drift:-82 },
  { left:'38%', top:'78%', size:4, drift:-62 }, { left:'62%', top:'76%', size:5, drift:-76 }
];

export default function PersonalJourney21({ onClose }: Props) {
  const [day, setDay] = useState(1);
  const [accepted, setAccepted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const musicRef = useRef<HTMLAudioElement | null>(null);
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
  const visualLife = Math.max(0, Math.min(1, audioProgress / 100));
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
  const reflectionText = elapsedSeconds < 240
    ? 'O que o seu corpo precisa para se sentir seguro neste momento?'
    : elapsedSeconds < 360 ? item.intention
    : elapsedSeconds < 660 ? item.reflectionPrompts[0]
    : elapsedSeconds < 900 ? item.reflectionPrompts[1]
    : elapsedSeconds < 1260 ? 'Onde você percebe essas energias e sensações atuando no seu corpo agora?'
    : elapsedSeconds < 1620 ? 'Respire naturalmente. Não procure respostas. Apenas permita a integração.'
    : 'Que pequeno movimento desta prática você deseja levar para o seu dia?';

  const stopSession = () => {
    playingRef.current = false;
    audioEngine.stopSpeech();
    musicRef.current?.pause();
    void wakeLockRef.current?.release?.();
    wakeLockRef.current = null;
    setPlaying(false);
  };

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator && !wakeLockRef.current) wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
    } catch { /* music remains the background clock */ }
  };

  const playCueForTime = (currentTime: number) => {
    if (cuePendingRef.current || audioEngine.isSpeaking()) return;
    const nextCue = lastCueRef.current + 1;
    if (nextCue >= item.audioCues.length || currentTime + 0.6 < item.audioCues[nextCue].at) return;
    lastCueRef.current = nextCue;
    cuePendingRef.current = true;
    // Reintegração deliberately uses the neural-only media path. If ElevenLabs is unavailable,
    // the music continues and the cue is released; we never replace the intended female voice
    // with Android/Web Speech synthesis.
    void audioEngine.playGuidedMeditation(
      [item.audioCues[nextCue].text],
      {
        title: `Reintegração à Vida · Dia ${day}`,
        subtitle: item.title,
        voiceId: 'Rachel',
        volume: 1,
        stability: 0.46,
        similarityBoost: 0.8,
        onEnd: () => {
          cuePendingRef.current = false;
          window.setTimeout(() => playCueForTime(musicRef.current?.currentTime || 0), 0);
        },
        onError: () => {
          cuePendingRef.current = false;
          window.setTimeout(() => playCueForTime(musicRef.current?.currentTime || 0), 800);
        }
      }
    );
  };

  useEffect(() => () => stopSession(), []);
  useEffect(() => {
    stopSession(); setAccepted(false); setStarted(false); setAudioProgress(0);
    lastCueRef.current = -1; cuePendingRef.current = false;
    if (musicRef.current) musicRef.current.currentTime = 0;
  }, [day]);
  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible' || !playingRef.current) return;
      const music = musicRef.current;
      if (!music) return;
      void requestWakeLock();
      const now = music.currentTime || 0;
      if (Number.isFinite(music.duration) && music.duration > 0) setAudioProgress((now / music.duration) * 100);
      audioEngine.resumeSpeech();
      if (music.paused && now < (music.duration || 1797) - 1) void music.play().catch(() => undefined);
      window.setTimeout(() => {
        if (!audioEngine.isSpeaking()) {
          cuePendingRef.current = false;
          const latestCompletedCue = item.audioCues.reduce((last, cue, index) => cue.at < now - 2 ? index : last, -1);
          lastCueRef.current = Math.max(lastCueRef.current, latestCompletedCue);
          playCueForTime(music.currentTime || now);
        }
      }, 180);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pageshow', handleVisibility);
    window.addEventListener('focus', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pageshow', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [day]);

  const startGuidedMeditation = async () => {
    if (!accepted) return;
    if (playing) { audioEngine.pauseSpeech(); musicRef.current?.pause(); playingRef.current = false; setPlaying(false); return; }
    if (started && audioProgress > 0 && audioProgress < 99) {
      audioEngine.resumeSpeech(); await musicRef.current?.play().catch(() => undefined); await requestWakeLock(); playingRef.current = true; setPlaying(true); return;
    }
    setStarted(true); lastCueRef.current = -1; cuePendingRef.current = false;
    if (musicRef.current) { musicRef.current.volume = 0.22; musicRef.current.currentTime = 0; await musicRef.current.play().catch(() => undefined); }
    await requestWakeLock(); playingRef.current = true; setPlaying(true); playCueForTime(0);
  };

  const rewindMeditation = () => {
    const music = musicRef.current; if (!music) return;
    const target = Math.max(0, music.currentTime - 15);
    audioEngine.stopSpeech(); cuePendingRef.current = false; music.currentTime = target;
    lastCueRef.current = item.audioCues.reduce((last, cue, index) => cue.at < target ? index : last, -1);
    playCueForTime(target);
  };

  const complete = () => {
    stopSession();
    const next = completed.includes(day) ? completed : [...completed, day].sort((a,b) => a-b);
    setCompleted(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (day < 21) setDay(day + 1);
  };

  return <div className="min-h-screen bg-[#9fbaa2] px-4 py-5 text-[#173f35]">
    <audio ref={musicRef} src={REINTEGRATION_MUSIC_URL} preload="metadata"
      onTimeUpdate={event => { const audio=event.currentTarget; if(Number.isFinite(audio.duration)&&audio.duration>0)setAudioProgress((audio.currentTime/audio.duration)*100); playCueForTime(audio.currentTime); }}
      onEnded={() => { audioEngine.stopSpeech(); playingRef.current=false; setPlaying(false); setAudioProgress(100); }}/>
    <main className="mx-auto w-full max-w-[620px]">
      <button onClick={() => { stopSession(); onClose(); }} className="mb-4 flex items-center gap-2 rounded-full bg-[#fffaf0]/90 px-4 py-2 text-sm font-semibold"><ArrowLeft size={17}/>Voltar ao início</button>
      <section className="overflow-hidden rounded-[2rem] border border-[#d6ae52]/40 bg-[#fffaf0]/95 shadow-[0_24px_70px_rgba(42,77,58,.18)]">
        <div className="bg-gradient-to-br from-[#315f49] to-[#244c3a] px-6 py-7 text-[#fffaf0]">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#ead28d]">21 Dias para Voltar para Mim</p>
          <p className="mt-2 font-display text-xl italic">Reintegração da Vida</p>
          <h1 className="mt-3 font-display text-3xl leading-tight">Dia {day}: {item.title}</h1>
          <p className="mt-3 text-base leading-7 text-[#e7eee5]">{item.cycle}</p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/20"><div className="h-full rounded-full bg-[#d6ae52]" style={{width:`${Math.round((completed.length/21)*100)}%`}}/></div>
          <p className="mt-2 text-xs text-[#dce8d8]">{completed.length} de 21 momentos concluídos</p>
        </div>
        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid grid-cols-7 gap-2">{REINTEGRATION_DAYS.map(entry => <button key={entry.day} onClick={() => setDay(entry.day)} aria-label={`Abrir dia ${entry.day}`} className={`flex aspect-square items-center justify-center rounded-full border text-xs font-bold ${day===entry.day?'border-[#315f49] bg-[#315f49] text-white':completed.includes(entry.day)?'border-[#d6ae52] bg-[#ead28d] text-[#173f35]':'border-[#72927c]/35 bg-[#e7eee5]'}`}>{completed.includes(entry.day)?<Check size={14}/>:entry.day}</button>)}</div>
          <article className="rounded-3xl border border-[#72927c]/25 bg-[#e7eee5]/70 p-5"><p className="text-xs uppercase tracking-[.16em] text-[#587d67]">Intenção do dia</p><p className="mt-2 text-base leading-7">{item.intention}</p></article>
          <section className="relative overflow-hidden rounded-[2rem] border border-[#d6ae52]/40 bg-[#173f35] shadow-inner">
            <div className="relative h-[500px] overflow-hidden">
              <img src="/brand/human-chakra-model.jpg" alt="Corpo inteiro em meditação com os sete chakras" className="absolute inset-0 h-full w-full object-cover object-top transition-all duration-[2500ms]" style={{filter:`brightness(${.58+visualLife*.42}) saturate(${.72+visualLife*.35})`,transform:`scale(${1+visualLife*.025})`}}/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#173f35] via-transparent to-[#173f35]/25"/>
              <div className={`absolute left-1/2 top-[9%] h-28 w-28 -translate-x-1/2 rounded-full bg-[#ffe39a]/70 blur-2xl transition-all duration-[2500ms] ${playing?'animate-pulse':''}`} style={{opacity:.25+visualLife*.7,transform:`translateX(-50%) scale(${.75+visualLife*.75})`}}/>
              {CHAKRAS.map(([color, top],index) => { const threshold=index/7; const glow=Math.max(0,Math.min(1,(visualLife-threshold)*7)); return <span key={color} className={`absolute left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border border-white/70 transition-all duration-[1800ms] ${playing&&glow>.15?'animate-pulse':''}`} style={{top,backgroundColor:color,opacity:.25+glow*.75,transform:`translateX(-50%) scale(${.75+glow*.45})`,boxShadow:`0 0 ${8+glow*28}px ${2+glow*10}px ${color}`}}/>; })}
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/60 bg-white/72 p-4 text-center backdrop-blur-md"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9a742b]">{playing?'Meditação guiada em andamento':'Sua meditação guiada'}</p><p className="mt-2 text-sm text-[#587d67]">{playing?'Respire. Permaneça aqui. A luz acompanha o seu momento.':'Voz feminina, música e uma experiência visual de presença.'}</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-[#d8e2d6]"><div className="h-full rounded-full bg-[#d6ae52] transition-all" style={{width:`${audioProgress}%`}}/></div></div>
            </div>
          </section>
          <label className="flex cursor-pointer items-start gap-3 rounded-3xl border border-[#d6ae52]/35 bg-[#fff7df] p-5"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)} className="mt-1 h-5 w-5 accent-[#315f49]"/><span className="text-sm leading-6">{REINTEGRATION_ACCEPTANCE}</span></label>
          <button disabled={!accepted} onClick={startGuidedMeditation} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#efd78f] to-[#d4aa4e] px-5 py-4 font-bold disabled:opacity-40">{playing?<Pause size={20}/>:started?<Play size={20}/>:<Headphones size={20}/>} {playing?'Pausar meditação':started?'Continuar meditação':'Iniciar meditação guiada'}</button>
          <article className="rounded-3xl border border-[#72927c]/25 bg-[#e7eee5]/55 p-5"><p className="text-xs uppercase tracking-[.16em] text-[#587d67]">Energias trabalhadas nesta etapa</p><p className="mt-2 text-sm leading-6 text-[#587d67]">Este resumo explica a proposta energética da etapa. As ativações e a programação são realizadas exclusivamente por Everton.</p><div className="mt-4 space-y-3">{item.energyNotes.map(note=><div key={note.name} className="rounded-2xl bg-[#fffaf0] p-4"><strong className="block text-sm">{note.name}</strong><span className="mt-1 block text-sm leading-6 text-[#587d67]">{note.focus}</span></div>)}</div></article>
          <p className="flex items-start gap-2 text-xs leading-5 text-[#587d67]"><ShieldCheck size={17} className="mt-0.5 shrink-0"/>Esta jornada é uma experiência espiritual e integrativa complementar. Ela não substitui atendimento médico, psicológico ou apoio humano necessário.</p>
          <div className="flex items-center justify-between gap-3 border-t border-[#72927c]/20 pt-5"><button disabled={day===1} onClick={()=>setDay(day-1)} className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold disabled:opacity-30"><ChevronLeft size={18}/>Anterior</button><button onClick={complete} className="rounded-full bg-[#315f49] px-5 py-3 text-sm font-bold text-white">{day===21?'Concluir jornada':'Concluir dia'}</button><button disabled={day===21} onClick={()=>setDay(day+1)} className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold disabled:opacity-30">Próximo<ChevronRight size={18}/></button></div>
        </div>
      </section>
    </main>
    {started && <section className="fixed inset-0 z-[120] flex min-h-[100dvh] flex-col overflow-hidden bg-[#061b14] text-[#fffaf0]" aria-label="Meditação guiada em andamento">
      <img src="/brand/human-chakra-model.jpg" alt="Corpo em meditação com os sete chakras" className="absolute inset-0 h-full w-full object-cover object-center transition-all duration-[3000ms]" style={{filter:`brightness(${.58+visualLife*.52}) saturate(${.72+visualLife*.5})`,transform:`scale(${1.01+visualLife*.055})`}}/>
      <div className="absolute inset-0 bg-gradient-to-b from-[#03130d]/75 via-transparent to-[#03130d]/95"/>
      <div className={`pointer-events-none absolute left-1/2 top-[8%] h-40 w-40 -translate-x-1/2 rounded-full bg-[#ffe39a]/70 blur-3xl transition-all duration-[3000ms] ${playing?'animate-pulse':''}`} style={{opacity:.18+visualLife*.78,transform:`translateX(-50%) scale(${.7+visualLife*1.05})`}}/>
      {MOTES.map((m,index)=><span key={index} className={`pointer-events-none absolute rounded-full bg-[#ffe9a8] blur-[1px] transition-all duration-[3000ms] ${playing?'animate-pulse':''}`} style={{left:m.left,top:m.top,width:m.size,height:m.size,opacity:.08+visualLife*.48,transform:`translateY(${m.drift*visualLife}px) scale(${.7+visualLife*.7})`,boxShadow:'0 0 12px 4px rgba(255,225,145,.35)'}}/>)}
      <button onClick={()=>{stopSession();setStarted(false);}} className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-20 rounded-full border border-white/30 bg-black/35 p-3 backdrop-blur-md" aria-label="Fechar meditação"><X size={22}/></button>
      <div className="relative z-10 flex flex-1 items-center justify-center">
        <div className={`absolute h-[72vw] max-h-[430px] w-[72vw] max-w-[430px] rounded-full border border-[#f2cf6c]/35 transition-all duration-[2500ms] ${playing?'animate-pulse':''}`} style={{opacity:.18+visualLife*.5,transform:`scale(${.82+visualLife*.22})`,boxShadow:`0 0 ${30+visualLife*110}px rgba(242,207,108,${.1+visualLife*.3})`}}/>
        {CHAKRAS.map(([color,top],index)=>{const threshold=index/7;const glow=Math.max(0,Math.min(1,(visualLife-threshold)*7));return <span key={color} className={`absolute left-1/2 h-7 w-7 -translate-x-1/2 rounded-full border border-white/80 transition-all duration-[2200ms] ${playing&&glow>.15?'animate-pulse':''}`} style={{top,backgroundColor:color,opacity:.2+glow*.8,transform:`translateX(-50%) scale(${.72+glow*.5})`,boxShadow:`0 0 ${8+glow*36}px ${2+glow*14}px ${color}`}}/>;})}
      </div>
      <div className="relative z-10 space-y-4 bg-gradient-to-t from-[#03130d] via-[#03130d]/95 to-transparent px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#ead28d]">Dia {day} · {item.title}</p>
        <p className="font-display text-2xl">{playing?(elapsedSeconds>=1260&&elapsedSeconds<1620?'Absorção e silêncio':'Permaneça neste momento'):audioProgress>=100?'Meditação concluída':'Meditação pausada'}</p>
        <p className="mx-auto max-w-md text-base leading-7 text-[#eef4eb]">{reflectionText}</p>
        <p className="text-xs text-[#b9cdbf]">{elapsedSeconds>=1260&&elapsedSeconds<1620?'Apenas a música permanece enquanto você integra a experiência.':'Permaneça com esta reflexão até a próxima condução da voz.'}</p>
        <div className="mx-auto max-w-md"><div className="h-2 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-[#e5c568] transition-all duration-500" style={{width:`${audioProgress}%`}}/></div><div className="mt-2 flex justify-between text-xs text-white/70"><span>{formatTime(elapsedSeconds)}</span><span>{formatTime(totalSeconds)}</span></div></div>
        <div className="flex items-center justify-center gap-3"><button onClick={rewindMeditation} className="flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-4 text-sm font-semibold" aria-label="Voltar 15 segundos"><RotateCcw size={20}/>15s</button><button onClick={startGuidedMeditation} className="flex min-w-48 items-center justify-center gap-3 rounded-full bg-[#e5c568] px-6 py-4 font-bold text-[#173f35]">{playing?<Pause size={21}/>:<Play size={21}/>} {playing?'Pausar':audioProgress>=100?'Ouvir novamente':'Continuar'}</button></div>
      </div>
    </section>}
  </div>;
}