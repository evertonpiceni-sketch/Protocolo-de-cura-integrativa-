import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  Maximize,
  BookOpen,
  Wind,
  MonitorPlay,
  CheckCircle2,
  Lock,
  ChevronLeft
} from 'lucide-react';
import { UserProfile } from '../types';

interface ArcanjoProtocolViewProps {
  userProfile: UserProfile;
  onLogout: () => void;
  onClose?: () => void;
}

type ProtocolConfig = {
  dia: number;
  nome: string;
  subtitulo: string;
  cor: string;
  corSecundaria: string;
  freq: number;
  keywords: string;
  roteiro: string;
  petals: number;
};

const DADOS_PROTOCOLO: Record<number, ProtocolConfig> = {
  1: {
    dia: 1,
    nome: 'Chakra Básico',
    subtitulo: 'Limpeza Profunda',
    cor: '#ef4444', // Red
    corSecundaria: '#fca5a5',
    freq: 396,
    keywords: 'Aterramento • Segurança • Estabilidade',
    petals: 4,
    roteiro: 'São Miguel: Visualize a espada de luz azul cortando todos os cordões que sugam sua energia. Diga: "São Miguel à frente, corte o mal e o medo."\n\nChama Violeta: Visualize uma fogueira violeta queimando e transmutando essas energias cortadas em pura luz.\n\nRaio de Ouro: Imagine uma chuva dourada preenchendo os espaços vazios onde os cordões foram cortados, selando sua aura.',
  },
  2: {
    dia: 2,
    nome: 'Chakra Sacro',
    subtitulo: 'Cura Física',
    cor: '#f97316', // Orange
    corSecundaria: '#fdba74',
    freq: 417,
    keywords: 'Criatividade • Fluxo • Liberação',
    petals: 6,
    roteiro: 'Raio de Ouro: Envie a luz dourada de São Rafael diretamente para as partes do seu corpo que sentem dor, cansaço ou doença. Sinta o calor regenerador.\n\nChama Violeta: Aplique o Reiki na região do estômago e plexo solar para transmutar toxinas físicas e emocionais.',
  },
  3: {
    dia: 3,
    nome: 'Chakra Plexo Solar',
    subtitulo: 'Poder Pessoal',
    cor: '#eab308', // Yellow
    corSecundaria: '#fde047',
    freq: 528,
    keywords: 'Autoconfiança • Poder Pessoal • Transformação',
    petals: 10,
    roteiro: 'Chama Violeta: Coloque as mãos no chakra cardíaco. Mentalize a Chama Violeta envolvendo seu coração, transformando a tristeza em autocompaixão.\n\nRaio de Ouro: Deixe que a luz de São Rafael cure as feridas e cicatrizes emocionais.',
  },
  4: {
    dia: 4,
    nome: 'Chakra Cardíaco',
    subtitulo: 'Cura Emocional',
    cor: '#22c55e', // Green
    corSecundaria: '#86efac',
    freq: 639,
    keywords: 'Amor • Cura • Relacionamentos',
    petals: 12,
    roteiro: 'Reiki: Faça um auto-passe rápido mentalizando a energia violeta passando do topo da sua cabeça até a sola dos pés, alinhando cada chakra.\n\nRaio de Ouro: Visualize um sol dourado brilhando no centro do seu peito.',
  },
  5: {
    dia: 5,
    nome: 'Chakra Laríngeo',
    subtitulo: 'Abertura de Caminhos',
    cor: '#0ea5e9', // Light Blue
    corSecundaria: '#7dd3fc',
    freq: 741,
    keywords: 'Comunicação • Expressão • Verdade',
    petals: 16,
    roteiro: 'São Miguel: Peça para afastar qualquer obstáculo visível ou invisível que esteja travando seus projetos profissionais.\n\nChama Violeta: Transmute crenças limitantes de não-merecimento ou medo da falta.',
  },
  6: {
    dia: 6,
    nome: 'Chakra Frontal',
    subtitulo: 'Harmonização',
    cor: '#4f46e5', // Indigo
    corSecundaria: '#a5b4fc',
    freq: 852,
    keywords: 'Intuição • Clareza • Percepção',
    petals: 16, // Visual representation
    roteiro: 'Chama Violeta: Envie a energia violeta do Reiki à distância para as pessoas com quem você tem conflitos ou dificuldades de comunicação.\n\nRaio de Ouro: Peça a São Rafael para trazer a energia da reconciliação.',
  },
  7: {
    dia: 7,
    nome: 'Chakra Coronário',
    subtitulo: 'Selamento Espiritual',
    cor: '#a855f7', // Violet
    corSecundaria: '#d8b4fe',
    freq: 963,
    keywords: 'Conexão • Expansão • Consciência',
    petals: 24,
    roteiro: 'São Miguel: Sinta-se completamente envolvido por uma bolha de luz azul-turquesa indestrutível.\n\nRaio de Ouro: Sinta a energia dourada correndo pelas suas veias.\n\nChama Violeta: Agradeça à energia Reiki pela purificação profunda.',
  },
};

function GlowingLotus({ config, rotating }: { config: ProtocolConfig; rotating: boolean }) {
  const { petals, cor, corSecundaria } = config;
  
  // Create beautiful layered lotus petals
  const renderPetals = (count: number, scale: number, opacity: number, offset: number, isInner: boolean) => {
    const angle = 360 / count;
    const elements = [];
    for (let i = 0; i < count; i++) {
      elements.push(
        <g key={`petal-${scale}-${i}`} transform={`rotate(${i * angle + offset}) scale(${scale})`}>
          <path
            d="M 0 -5 C 15 -30, 25 -70, 0 -100 C -25 -70, -15 -30, 0 -5 Z"
            fill={isInner ? corSecundaria : `url(#grad-${config.dia})`}
            opacity={opacity}
            style={{ mixBlendMode: 'screen' }}
          />
          {/* Petal center line for detail */}
          <path
            d="M 0 -5 L 0 -95"
            stroke={isInner ? "#ffffff" : corSecundaria}
            strokeWidth="1"
            opacity={0.5}
            style={{ mixBlendMode: 'screen' }}
          />
        </g>
      );
    }
    return elements;
  };

  return (
    <div className={`relative flex items-center justify-center w-full h-full ${rotating ? 'animate-[spin_40s_linear_infinite]' : ''}`}>
      {/* Background massive ambient glow */}
      <div 
        className="absolute inset-0 rounded-full blur-[60px] opacity-40 mix-blend-screen animate-pulse"
        style={{ background: `radial-gradient(circle, ${cor} 0%, transparent 70%)` }}
      />
      
      <svg viewBox="-110 -110 220 220" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        <defs>
          <linearGradient id={`grad-${config.dia}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={cor} stopOpacity="0.8" />
            <stop offset="50%" stopColor={corSecundaria} stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id={`center-glow-${config.dia}`}>
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="30%" stopColor={corSecundaria} stopOpacity="0.8" />
            <stop offset="100%" stopColor={cor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Layer */}
        {renderPetals(petals, 1.0, 0.4, 0, false)}
        
        {/* Middle Layer */}
        {renderPetals(petals, 0.75, 0.6, (360/petals)/2, false)}
        
        {/* Inner Layer */}
        {renderPetals(Math.max(6, petals/2), 0.45, 0.9, 0, true)}

        {/* Glowing Center */}
        <circle cx="0" cy="0" r="15" fill={`url(#center-glow-${config.dia})`} />
        <circle cx="0" cy="0" r="4" fill="#ffffff" className="animate-pulse" />
      </svg>
    </div>
  );
}

export default function ArcanjoProtocolView({ userProfile, onLogout, onClose }: ArcanjoProtocolViewProps) {
  const [diaAtual, setDiaAtual] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [showRoteiro, setShowRoteiro] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const timerRef = useRef<number | null>(null);

  const config = DADOS_PROTOCOLO[diaAtual];
  const TOTAL_SECONDS = 15 * 60; // 15 minutos
  const progressPercent = Math.min(100, (elapsed / TOTAL_SECONDS) * 100);

  useEffect(() => {
    const handleOpenDay = (e: any) => {
      if (e.detail?.day) selectDay(e.detail.day);
    };
    window.addEventListener('OPEN_PROTOCOL_DAY', handleOpenDay);
    return () => window.removeEventListener('OPEN_PROTOCOL_DAY', handleOpenDay);
  }, []);

  useEffect(() => {
    const completed: number[] = [];
    for (let i = 1; i <= 7; i += 1) {
      if (localStorage.getItem(`reiki_arcanjo_dia_${i}`) === 'true') completed.push(i);
    }
    setCompletedDays(completed);
    const firstUncompleted = [1, 2, 3, 4, 5, 6, 7].find((d) => !completed.includes(d)) || 1;
    setDiaAtual(firstUncompleted);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      try { oscillatorRef.current?.stop(); } catch { }
      audioCtxRef.current?.close().catch(() => undefined);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const markCompleted = (day: number) => {
    localStorage.setItem(`reiki_arcanjo_dia_${day}`, 'true');
    setCompletedDays((prev) => Array.from(new Set([...prev, day])));
  };

  const stopTone = () => {
    try { oscillatorRef.current?.stop(); } catch { }
    oscillatorRef.current = null;
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => undefined);
      audioCtxRef.current = null;
    }
  };

  const startTone = async (frequency: number) => {
    stopTone();
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.035;

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillatorRef.current = oscillator;

    if (ctx.state === 'suspended') await ctx.resume();
  };

  const startSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const textoParaFalar = config.roteiro.replace(/\n\n/g, '. ');
    const utterance = new SpeechSynthesisUtterance(textoParaFalar);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.85;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const stopSession = (complete = false) => {
    setIsPlaying(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    stopTone();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (complete) markCompleted(diaAtual);
  };

  const startSession = async () => {
    stopSession(false);
    setElapsed(0);
    setIsPlaying(true);
    await startTone(config.freq);
    startSpeech();

    timerRef.current = window.setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= TOTAL_SECONDS) {
          window.setTimeout(() => stopSession(true), 0);
          return TOTAL_SECONDS;
        }
        return next;
      });
    }, 1000);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSession(false); // Pause effectively stops it in this simple version
    } else {
      startSession();
    }
  };

  const skipBackward = () => {
    setElapsed(prev => Math.max(0, prev - 10));
  };

  const skipForward = () => {
    setElapsed(prev => Math.min(TOTAL_SECONDS, prev + 10));
  };

  const selectDay = (day: number) => {
    stopSession(false);
    setElapsed(0);
    setDiaAtual(day);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#05060D] text-white font-sans selection:bg-[#E4C573]/30 overflow-y-auto">
      {/* Background Ambient */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 transition-colors duration-1000"
        style={{ background: `radial-gradient(circle at center 40%, ${config.cor} 0%, #05060D 70%)` }}
      />
      
      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between px-5 py-5 w-full max-w-md mx-auto">
        <button className="text-slate-400 hover:text-white transition" aria-label="Menu" onClick={onClose}>
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 text-slate-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span className="text-[11px] uppercase tracking-widest font-semibold">Protocolo da Transformação</span>
          </div>
          <h1 className="text-[14px] font-medium mt-1">Dia {config.dia} de 7 – {config.subtitulo}</h1>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition">
          <X size={24} />
        </button>
      </header>

      {/* Main Player Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start px-5 w-full max-w-md mx-auto mt-4 pb-12">
        
        {/* Lotus Visualizer */}
        <div className="w-full aspect-square max-w-[320px] mx-auto mb-8 relative">
          <GlowingLotus config={config} rotating={isPlaying} />
        </div>

        {/* Session Info */}
        <div className="text-center w-full mb-10">
          <h2 className="text-[42px] font-serif font-bold tracking-tight" style={{ textShadow: `0 0 20px ${config.cor}` }}>
            {config.freq} Hz
          </h2>
          <h3 className="text-[18px] font-medium mt-1 mb-2" style={{ color: config.corSecundaria }}>
            {config.nome}
          </h3>
          <p className="text-[12px] text-slate-400 uppercase tracking-widest">
            {config.keywords}
          </p>
        </div>

        {/* Progress & Controls */}
        <div className="w-full mb-8">
          {/* Progress Bar */}
          <div className="relative w-full h-1 bg-white/10 rounded-full mb-4 cursor-pointer group">
            <div 
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%`, backgroundColor: config.corSecundaria, boxShadow: `0 0 10px ${config.cor}` }}
            />
            {/* Playhead dot */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progressPercent}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>
          
          {/* Timers */}
          <div className="flex justify-between text-[12px] text-slate-400 font-medium font-mono mb-6">
            <span>{formatTime(elapsed)}</span>
            <span>15:00</span>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center justify-between px-2">
            <button className="text-slate-400 hover:text-white transition p-2">
              <Volume2 size={20} />
            </button>
            
            <div className="flex items-center gap-6">
              <button onClick={skipBackward} className="text-white hover:text-slate-300 transition">
                <RotateCcw size={24} strokeWidth={1.5} />
              </button>
              
              <button 
                onClick={togglePlay}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-white text-[#05060D] hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                {isPlaying ? <Pause size={28} className="fill-current" /> : <Play size={30} className="ml-1 fill-current" />}
              </button>
              
              <button onClick={skipForward} className="text-white hover:text-slate-300 transition">
                <RotateCw size={24} strokeWidth={1.5} />
              </button>
            </div>

            <button className="text-slate-400 hover:text-white transition p-2">
              <Maximize size={20} />
            </button>
          </div>
        </div>

        {/* Current Step / Etapa Atual */}
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mb-10 text-center">
          <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-1">Etapa Atual:</p>
          <p className="text-[14px] text-slate-200 line-clamp-2">
            Visualização e expansão da consciência
          </p>
          <button 
            onClick={() => setShowRoteiro(!showRoteiro)}
            className="mt-3 text-[12px] text-slate-400 hover:text-white underline decoration-white/20 transition"
          >
            {showRoteiro ? 'Ocultar Roteiro' : 'Ler Roteiro Completo'}
          </button>
          
          {showRoteiro && (
            <div className="mt-4 text-[13px] text-slate-300 italic leading-relaxed text-left bg-black/20 p-4 rounded-xl whitespace-pre-line">
              {config.roteiro}
            </div>
          )}
        </div>

        {/* Atividades Complementares (Match mockup panel 6) */}
        <div className="w-full">
          <h4 className="text-[13px] uppercase tracking-widest text-slate-400 font-semibold mb-4 text-center">
            Atividades complementares do dia
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-b from-[#181C2C] to-[#121523] border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:bg-[#1E2336] transition cursor-pointer">
              <BookOpen size={24} className="text-slate-300" strokeWidth={1.5} />
              <div>
                <p className="text-[13px] font-semibold text-white">Registro no Diário</p>
                <p className="text-[10px] text-slate-400 mt-1">Como você se sentiu hoje?</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-b from-[#181C2C] to-[#121523] border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:bg-[#1E2336] transition cursor-pointer">
              <div className="w-6 h-6 flex items-center justify-center">
                {/* Custom Lotus Icon for Afirmações */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-300 w-full h-full">
                  <path d="M12 22C12 22 4 16 4 10C4 6 7 3 12 3C17 3 20 6 20 10C20 16 12 22 12 22Z" />
                  <path d="M12 22C12 22 8 17 8 12C8 9 10 7 12 7C14 7 16 9 16 12C16 17 12 22 12 22Z" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">Afirmação do Dia</p>
                <p className="text-[10px] text-slate-400 mt-1">Leia em voz alta</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-b from-[#181C2C] to-[#121523] border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:bg-[#1E2336] transition cursor-pointer">
              <Wind size={24} className="text-slate-300" strokeWidth={1.5} />
              <div>
                <p className="text-[13px] font-semibold text-white">Prática Extra</p>
                <p className="text-[10px] text-slate-400 mt-1">Exercício de respiração</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-b from-[#181C2C] to-[#121523] border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:bg-[#1E2336] transition cursor-pointer">
              <MonitorPlay size={24} className="text-slate-300" strokeWidth={1.5} />
              <div>
                <p className="text-[13px] font-semibold text-white">Conteúdo de Apoio</p>
                <p className="text-[10px] text-slate-400 mt-1">Artigo ou vídeo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exemplos dos demais dias (Match mockup panel 5) */}
        <div className="w-full mt-12 mb-8">
           <h4 className="text-[13px] uppercase tracking-widest text-slate-400 font-semibold mb-4 text-center">
             Exemplos dos demais dias
           </h4>
           <div className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory no-scrollbar w-[100vw] px-5 -ml-5">
             {[1,2,3,4,5,6,7].map(day => {
               const dayConfig = DADOS_PROTOCOLO[day];
               const isCompleted = completedDays.includes(day);
               return (
                 <div 
                   key={day}
                   onClick={() => selectDay(day)}
                   className={`snap-center shrink-0 w-[140px] flex flex-col items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${diaAtual === day ? 'border-white/40 bg-white/10' : 'border-white/10 bg-[#0E111A] hover:bg-white/5'}`}
                 >
                   <p className="text-[12px] font-medium text-slate-300 mb-3">Dia {day}</p>
                   
                   {/* Mini Lotus representing the day */}
                   <div className="w-16 h-16 relative mb-4">
                     <GlowingLotus config={dayConfig} rotating={false} />
                   </div>
                   
                   <p className="text-[16px] font-bold text-white mb-1">{dayConfig.freq} Hz</p>
                   <p className="text-[11px] font-medium text-center mb-2" style={{ color: dayConfig.corSecundaria }}>{dayConfig.nome}</p>
                   
                   <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-black/30 px-2 py-1 rounded-full">
                     <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                     15 min
                   </div>
                 </div>
               )
             })}
           </div>
        </div>

      </main>
    </div>
  );
}
