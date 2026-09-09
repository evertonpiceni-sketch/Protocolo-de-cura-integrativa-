import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  Menu,
  Home,
  Play,
  RefreshCw,
  Settings,
  Shield,
  Square,
  Activity,
  Flower2,
  BookOpen
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
  raioNome: string;
  corSecundaria: string;
  freq: number;
  foco: string;
  roteiro: string;
  petals: number;
  glyph: string;
};

const DADOS_PROTOCOLO: Record<number, ProtocolConfig> = {
  1: {
    dia: 1,
    nome: 'Limpeza Profunda',
    subtitulo: 'Rompimento de Laços',
    cor: '#3B82F6',
    raioNome: 'Azul, Violeta e Ouro',
    corSecundaria: '#60A5FA',
    freq: 396,
    foco: 'Libertar-se de energias estagnadas e cordões negativos',
    petals: 4,
    glyph: 'OM',
    roteiro: 'São Miguel: Visualize a espada de luz azul cortando todos os cordões que sugam sua energia. Diga: "São Miguel à frente, corte o mal e o medo."\n\nChama Violeta: Visualize uma fogueira violeta queimando e transmutando essas energias cortadas em pura luz.\n\nRaio de Ouro: Imagine uma chuva dourada preenchendo os espaços vazios onde os cordões foram cortados, selando sua aura.',
  },
  2: {
    dia: 2,
    nome: 'Cura Física',
    subtitulo: 'Alívio de Dores',
    cor: '#10B981',
    raioNome: 'Verde, Ouro e Violeta',
    corSecundaria: '#34D399',
    freq: 417,
    foco: 'Regeneração das células e vitalidade do corpo físico',
    petals: 6,
    glyph: 'OM',
    roteiro: 'Raio de Ouro: Envie a luz dourada de São Rafael diretamente para as partes do seu corpo que sentem dor, cansaço ou doença. Sinta o calor regenerador.\n\nChama Violeta: Aplique o Reiki na região do estômago e plexo solar para transmutar toxinas físicas e emocionais.\n\nSão Miguel: Peça ao arcanjo para blindar sua saúde contra influências externas.',
  },
  3: {
    dia: 3,
    nome: 'Cura Emocional',
    subtitulo: 'O Poder do Perdão',
    cor: '#D946EF',
    raioNome: 'Violeta e Ouro',
    corSecundaria: '#F472B6',
    freq: 528,
    foco: 'Libertar mágoas, ressentimentos e culpas do passado',
    petals: 10,
    glyph: 'OM',
    roteiro: 'Chama Violeta: Coloque as mãos no chakra cardíaco. Mentalize a Chama Violeta envolvendo seu coração, transformando a tristeza em autocompaixão.\n\nRaio de Ouro: Deixe que a luz de São Rafael cure as feridas e cicatrizes emocionais geradas por rejeição ou abandono.\n\nSão Miguel: Peça proteção mental para afastar pensamentos de autocrítica e julgamento.',
  },
  4: {
    dia: 4,
    nome: 'Alinhamento Energético',
    subtitulo: 'Mente Clara',
    cor: '#8B5CF6',
    raioNome: 'Violeta, Azul e Ouro',
    corSecundaria: '#A78BFA',
    freq: 639,
    foco: 'Equilíbrio dos centros de energia e alívio da ansiedade',
    petals: 12,
    glyph: 'OM',
    roteiro: 'Reiki: Faça um auto-passe rápido mentalizando a energia violeta passando do topo da sua cabeça até a sola dos pés, alinhando cada chakra.\n\nSão Miguel: Peça para que ele coloque o seu escudo azul sobre a sua mente, protegendo-o de pensamentos obsessivos.\n\nRaio de Ouro: Visualize um sol dourado brilhando no centro da sua testa, trazendo clareza mental e intuição.',
  },
  5: {
    dia: 5,
    nome: 'Prosperidade',
    subtitulo: 'Abertura de Caminhos',
    cor: '#F59E0B',
    raioNome: 'Ouro, Violeta e Azul',
    corSecundaria: '#FCD34D',
    freq: 741,
    foco: 'Desbloquear a escassez e atrair abundância',
    petals: 16,
    glyph: 'OM',
    roteiro: 'São Miguel: Peça para afastar qualquer obstáculo visível ou invisível que esteja travando seus projetos profissionais.\n\nChama Violeta: Transmute crenças limitantes de não-merecimento ou medo da falta.\n\nRaio de Ouro: Banhe suas mãos e sua mente na luz dourada de São Rafael, atraindo a opulência divina, o sucesso e a saúde financeira.',
  },
  6: {
    dia: 6,
    nome: 'Harmonização',
    subtitulo: 'Paz nos Relacionamentos',
    cor: '#EC4899',
    raioNome: 'Violeta, Ouro e Azul',
    corSecundaria: '#F9A8D4',
    freq: 852,
    foco: 'Trazer paz para a família, amor e ambiente de trabalho',
    petals: 2,
    glyph: 'OM',
    roteiro: 'Chama Violeta: Envie a energia violeta do Reiki à distância para as pessoas com quem você tem conflitos ou dificuldades de comunicação.\n\nRaio de Ouro: Peça a São Rafael para trazer a energia da reconciliação, da verdade e da diplomacia.\n\nSão Miguel: Peça que a milícia celeste proteja o seu lar contra inveja, fofocas ou discórdia.',
  },
  7: {
    dia: 7,
    nome: 'Selamento Espiritual',
    subtitulo: 'Gratidão e Elevação',
    cor: '#6366F1',
    raioNome: 'Azul, Ouro e Violeta',
    corSecundaria: '#818CF8',
    freq: 963,
    foco: 'Fixar as curas da semana e elevar a vibração para o futuro',
    petals: 24,
    glyph: 'OM',
    roteiro: 'São Miguel: Sinta-se completamente envolvido por uma bolha de luz azul-turquesa indestrutível.\n\nRaio de Ouro: Sinta a energia dourada correndo pelas suas veias, trazendo rejuvenescimento e comunhão espiritual.\n\nChama Violeta: Agradeça à energia Reiki pela purificação profunda.\n\nTermine o dia fazendo uma prece espontânea de profunda gratidão.',
  },
};

function ChakraYantra({ config, rotating }: { config: ProtocolConfig; rotating: boolean }) {
  const renderGeometry = () => {
    switch (config.dia) {
      case 1: // Muladhara base
        return (
          <>
            {[0, 90, 180, 270].map((angle) => (
              <path
                key={angle}
                transform={`rotate(${angle})`}
                d="M 0 -22 C 35 -22 45 -65 0 -80 C -45 -65 -35 -22 0 -22 Z"
                fill="none"
                stroke={config.corSecundaria}
                strokeWidth="2.5"
                className="opacity-90"
              />
            ))}
            <polygon points="-38,-38 38,-38 38,38 -38,38" fill="none" stroke={config.cor} strokeWidth="3" />
            <polygon points="-28,-18 28,-18 0,32" fill="none" stroke={config.cor} strokeWidth="3" />
          </>
        );
      case 4: // Anahata base
        return (
          <>
            {Array.from({ length: 12 }).map((_, i) => (
              <path
                key={i}
                transform={`rotate(${i * 30})`}
                d="M 0 -35 C 20 -40 25 -75 0 -90 C -25 -75 -20 -40 0 -35 Z"
                fill="none"
                stroke={config.corSecundaria}
                strokeWidth="2"
                className="opacity-80"
              />
            ))}
            <polygon points="0,-45 40,25 -40,25" fill="none" stroke={config.cor} strokeWidth="2.5" />
            <polygon points="0,45 40,-25 -40,-25" fill="none" stroke={config.cor} strokeWidth="2.5" />
          </>
        );
      case 6: // Ajna base
        return (
          <>
            <path d="M 0 0 C 40 -60 100 0 100 0 C 100 0 40 60 0 0" fill="none" stroke={config.corSecundaria} strokeWidth="3" />
            <path d="M 0 0 C -40 -60 -100 0 -100 0 C -100 0 -40 60 0 0" fill="none" stroke={config.corSecundaria} strokeWidth="3" />
            <circle cx="0" cy="0" r="35" fill="none" stroke={config.cor} strokeWidth="2" />
            <polygon points="-20,-10 20,-10 0,25" fill="none" stroke={config.cor} strokeWidth="2.5" />
          </>
        );
      default: // Generic beautiful lotus for others
        return (
          <>
            {Array.from({ length: config.petals }).map((_, i) => (
              <path
                key={i}
                transform={`rotate(${(360 / config.petals) * i})`}
                d="M 0 -25 C 25 -40 35 -75 0 -95 C -35 -75 -25 -40 0 -25 Z"
                fill="none"
                stroke={config.corSecundaria}
                strokeWidth="2"
                className="opacity-80"
              />
            ))}
            {Array.from({ length: config.petals }).map((_, i) => (
              <path
                key={`inner-${i}`}
                transform={`rotate(${(360 / config.petals) * i + (180 / config.petals)})`}
                d="M 0 -15 L 18 -45 L 0 -75 L -18 -45 Z"
                fill="none"
                stroke={config.cor}
                strokeWidth="1.5"
                className="opacity-60"
              />
            ))}
            <circle cx="0" cy="0" r="28" fill="none" stroke={config.cor} strokeWidth="2" />
          </>
        );
    }
  };

  return (
    <div
      className={`relative h-full w-full ${rotating ? 'animate-spin-[15s_linear_infinite]' : ''}`}
      aria-label={`Mandala do ${config.nome}`}
    >
      <svg viewBox="0 0 240 240" className="h-full w-full overflow-visible">
        <defs>
          <filter id={`glow-${config.dia}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g transform="translate(120, 120)" filter={`url(#glow-${config.dia})`}>
          <circle cx="0" cy="0" r="105" fill="none" stroke={config.cor} strokeWidth="1" opacity="0.15" />
          {renderGeometry()}
          <circle cx="0" cy="0" r="16" fill="none" stroke={config.corSecundaria} strokeWidth="2" opacity="0.8" />
          <text
            x="0"
            y="5"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="16"
            fontFamily="serif"
            fontWeight="bold"
            className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          >
            {config.glyph}
          </text>
        </g>
      </svg>
    </div>
  );
}

export default function ArcanjoProtocolView({ userProfile, onLogout, onClose }: ArcanjoProtocolViewProps) {
  const [diaAtual, setDiaAtual] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [showOracao, setShowOracao] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const timerRef = useRef<number | null>(null);

  const config = DADOS_PROTOCOLO[diaAtual];
  const TOTAL_SECONDS = 15 * 60; // 15 minutos, conforme orientado
  const progress = Math.min(100, (elapsed / TOTAL_SECONDS) * 100);

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
      try {
        oscillatorRef.current?.stop();
      } catch { }
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
    try {
      oscillatorRef.current?.stop();
    } catch { }
    oscillatorRef.current = null;
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => undefined);
      audioCtxRef.current = null;
    }
  };

  const startTone = async (frequency: number) => {
    stopTone();
    const AudioContextClass =
      window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
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
    
    // Concatena as instruções para a fala, removendo as quebras de linha para uma leitura fluida
    const textoParaFalar = config.roteiro.replace(/\n\n/g, '. ');
    
    const utterance = new SpeechSynthesisUtterance(textoParaFalar);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.84;
    utterance.pitch = 0.95;
    utterance.volume = 0.9;
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

  const resetProgress = () => {
    if (!window.confirm('Deseja reiniciar o progresso dos 7 dias?')) return;
    stopSession(false);
    for (let i = 1; i <= 7; i += 1) localStorage.removeItem(`reiki_arcanjo_dia_${i}`);
    setCompletedDays([]);
    setDiaAtual(1);
    setElapsed(0);
  };

  useEffect(() => {
    const handleOpenDay = (e: any) => {
      if (e.detail?.day) {
        selectDay(e.detail.day);
      }
    };
    window.addEventListener('OPEN_PROTOCOL_DAY', handleOpenDay);
    return () => window.removeEventListener('OPEN_PROTOCOL_DAY', handleOpenDay);
  }, []);

  const selectDay = (day: number) => {
    stopSession(false);
    setElapsed(0);
    setDiaAtual(day);
  };

  const dayButtons = useMemo(
    () =>
      [1, 2, 3, 4, 5, 6, 7].map((day) => ({
        day,
        completed: completedDays.includes(day),
        active: diaAtual === day,
      })),
    [completedDays, diaAtual]
  );

  return (
    <div className="min-h-screen bg-[#09090E] text-slate-100 flex flex-col font-sans selection:bg-[#7233E6]/30">
      <style>{`
        .animate-spin-\\[15s_linear_infinite\\] {
          animation: spin 15s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#09090E] border-b border-[#1F2233]">
        <div className="mx-auto flex max-w-[480px] items-center justify-between px-4 py-4">
          <button
            onClick={onClose || onLogout}
            className="text-slate-400 hover:text-white transition"
            aria-label="Voltar"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>

          <div className="flex items-center gap-3">
            <Shield size={28} strokeWidth={1} className="text-[#E4C573] fill-[#E4C573]/10" />
            <div className="text-center">
              <h1 className="font-serif text-[17px] font-semibold text-[#E4C573] tracking-wide">
                Protocolo de Cura São Miguel
              </h1>
              <p className="font-serif text-[12px] text-[#E4C573]/80">Raio de Ouro e Chama Violeta</p>
            </div>
          </div>

          <button className="text-slate-400 hover:text-white transition" aria-label="Menu">
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Days Navigation */}
      <section className="bg-[#09090E] border-b border-[#14151C] shadow-md">
        <div className="mx-auto max-w-[480px] flex items-center justify-between px-4 py-5 overflow-x-auto gap-[18px] no-scrollbar">
          {dayButtons.map(({ day, active, completed }) => (
            <button key={day} onClick={() => selectDay(day)} className="group flex flex-col items-center gap-[6px] flex-shrink-0">
              <span
                className={[
                  'grid h-[48px] w-[48px] place-items-center rounded-full text-[17px] transition duration-300',
                  active
                    ? 'border-[1.5px] border-[#7233E6] bg-transparent text-white shadow-[0_0_15px_rgba(114,51,230,0.4),inset_0_0_15px_rgba(114,51,230,0.2)]'
                    : completed
                    ? 'border border-[#1F2233] bg-[#12131C] text-[#7233E6]'
                    : 'border border-[#1F2233] bg-[#12131C] text-slate-500',
                ].join(' ')}
              >
                {day}
              </span>
              <span className={active ? 'text-[11px] font-bold text-white' : 'text-[11px] font-medium text-slate-500'}>
                Dia {day}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-28 pt-5 px-4 sm:px-6">
        <div className="mx-auto max-w-[480px]">
          {/* Main Card */}
          <section className="relative rounded-[28px] border border-[#1C2030] bg-[#0E1017] shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            <div className="px-5 pb-8 pt-8">
              {/* Titles */}
              <div className="text-center mb-6">
                <p className="font-serif text-[15px] font-bold text-[#E4C573] tracking-widest mb-1">Dia {config.dia}</p>
                <h2 className="font-serif text-[32px] sm:text-[36px] font-bold text-[#E4C573] leading-tight">
                  {config.nome}
                </h2>
                <p className="font-serif text-[20px] font-semibold text-[#E4C573] mb-4">{config.subtitulo}</p>

                <p className="text-[14px] text-white/80 font-sans tracking-wide">
                  Frequência: {config.freq} Hz <span className="mx-2 text-white/30">|</span> Raios: {config.raioNome}
                </p>
                <p className="mt-[6px] text-[14px] text-white/80 font-sans tracking-wide">
                  Foco: {config.foco}
                </p>
              </div>

              {/* Mandala Area - Designed with dynamic glow and mountain silhouettes */}
              <div className="relative mx-auto mt-7 mb-6 flex h-[260px] sm:h-[300px] w-full items-center justify-center overflow-hidden rounded-[20px] bg-[#050508]">
                {/* Intense Central Glow matching the Chakra/Day color */}
                <div
                  className="absolute inset-0 opacity-80"
                  style={{
                    background: `radial-gradient(circle at center, ${config.cor} 0%, transparent 65%)`,
                    mixBlendMode: 'screen'
                  }}
                />

                {/* Simulated Mountains via CSS SVG Masks */}
                <div className="absolute bottom-0 w-full h-[100px] z-0 opacity-70">
                  <svg preserveAspectRatio="none" viewBox="0 0 100 100" className="w-full h-full text-[#0E1017]">
                    <path d="M0,100 L0,50 L12,40 L28,65 L48,35 L68,60 L85,40 L100,65 L100,100 Z" fill="currentColor"/>
                    <path d="M0,100 L0,70 L20,50 L40,80 L60,45 L80,75 L100,55 L100,100 Z" fill="currentColor" opacity="0.6"/>
                  </svg>
                </div>
                
                {/* Foreground roots / lower gradient fade to blend the mountains seamlessly */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1017] via-[#0E1017]/40 to-transparent z-0" />

                {/* SVG Mandala */}
                <div className="relative z-10 w-[190px] h-[190px] sm:w-[230px] sm:h-[230px]">
                  <ChakraYantra config={config} rotating={isPlaying} />
                </div>
              </div>

              {/* Preparação e Oração Button */}
              <div className="mb-6 flex justify-center">
                <button
                  onClick={() => setShowOracao(true)}
                  className="flex items-center gap-2 rounded-full border border-[#E4C573]/40 bg-[#E4C573]/5 px-4 py-2 text-[13px] font-medium text-[#E4C573] transition hover:bg-[#E4C573]/10"
                >
                  <BookOpen size={16} />
                  Ler Oração de Ativação
                </button>
              </div>

              {/* Quote Container (Roteiro do Dia) */}
              <div className="mx-auto rounded-[20px] border border-[#23263B] bg-[#161824] px-6 py-6 shadow-inner mb-9">
                <div className="font-serif text-[15px] italic leading-relaxed text-[#D1D5DB] text-center tracking-wide whitespace-pre-line">
                  "{config.roteiro}"
                </div>
              </div>

              {/* Audio Player Controls */}
              <div className="flex items-center gap-4 px-1 mb-9">
                <button
                  onClick={isPlaying ? () => stopSession(false) : startSession}
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-[1.5px] border-[#E4C573]/80 bg-[#E4C573]/10 shadow-[0_0_20px_rgba(228,197,115,0.25)] transition duration-300 hover:scale-105 hover:bg-[#E4C573]/20"
                  aria-label={isPlaying ? 'Parar áudio' : 'Reproduzir áudio'}
                >
                  {isPlaying ? (
                    <Square size={20} className="text-[#E4C573] fill-[#E4C573]" />
                  ) : (
                    <Play size={22} className="text-[#E4C573] fill-[#E4C573] ml-1" />
                  )}
                </button>

                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1 relative h-1.5 rounded-full bg-[#2A2C3E]">
                    <div
                      className="absolute left-0 top-0 bottom-0 rounded-full bg-[#7233E6] transition-all duration-1000 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-[14px] w-[14px] rounded-full bg-[#7233E6] shadow-[0_0_10px_rgba(114,51,230,0.6)] transition-all duration-1000 ease-linear"
                      style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
                    />
                  </div>
                  <div className="w-[88px] text-right font-sans text-[13px] text-slate-400">
                    {formatTime(elapsed)} / 15:00
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={startSession}
                  disabled={isPlaying}
                  className="w-full rounded-full bg-gradient-to-r from-[#7233E6] to-[#5B21B6] py-[16px] text-[16px] font-semibold text-white shadow-[0_8px_25px_rgba(114,51,230,0.4)] transition duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPlaying ? 'Transmissão em andamento' : 'Iniciar Transmissão'}
                </button>

                <button
                  onClick={() => window.alert(`Conecte aqui a URL do áudio final do Dia ${diaAtual}.`)}
                  className="w-full rounded-full border border-[#E4C573]/60 bg-transparent py-[16px] text-[16px] font-medium text-[#E4C573] transition duration-300 hover:bg-[#E4C573]/10"
                >
                  Baixar Áudio
                </button>
              </div>
            </div>
          </section>

          <button
            onClick={resetProgress}
            className="mt-8 flex w-full items-center justify-center gap-[10px] rounded-full border border-[#1F2233] bg-[#09090E] py-[16px] text-[14px] font-medium text-[#9CA3AF] transition hover:border-white/20 hover:text-white"
          >
            <RefreshCw size={18} />
            Reiniciar Progresso dos 7 Dias
          </button>
        </div>
      </main>

      {/* Modal Preparação e Oração */}
      {showOracao && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050508]/90 px-4 backdrop-blur-md">
          <div className="relative w-full max-w-[420px] rounded-[24px] border border-[#E4C573]/30 bg-[#0E1017] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <h3 className="mb-5 text-center font-serif text-[22px] font-bold text-[#E4C573]">
              Preparação & Oração
            </h3>
            <div className="max-h-[60vh] overflow-y-auto pr-3 text-slate-300 text-[14.5px] leading-relaxed space-y-6 custom-scrollbar">
              <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #161824; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E4C57340; border-radius: 4px; }
              `}</style>
              
              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="text-[#E4C573]">📋</span> Preparação Diária
                </h4>
                <ul className="list-inside list-disc space-y-1.5 text-slate-400 marker:text-[#E4C573]">
                  <li>Encontre um local calmo onde não será interrompido.</li>
                  <li>Sente-se confortavelmente com a coluna reta.</li>
                  <li>Respire fundo três vezes, acalmando a mente.</li>
                  <li>Foque na intenção do amor incondicional e na cura.</li>
                </ul>
              </div>
              
              <div className="border-t border-[#1F2233] pt-5">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-[#E4C573]">🧘</span> Oração de Ativação
                </h4>
                <p className="italic text-[#D1D5DB] bg-[#161824] p-4 rounded-xl border border-[#23263B]">
                  "Em nome da minha Divina Presença Eu Sou, eu invoco agora a proteção invencível de São Miguel Arcanjo e sua espada de luz azul. Invoco as bênçãos de cura e a luz do Raio de Ouro de São Rafael. Ativo neste momento a energia do Reiki e a Chama Violeta de Saint Germain para transmutar tudo o que não serve ao meu bem maior. Que a cura, a proteção e a transmutação se façam presentes aqui e agora. Amém."
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowOracao(false)}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-[#E4C573] to-[#B89845] py-[14px] text-[15px] font-bold text-[#09090E] shadow-[0_5px_15px_rgba(228,197,115,0.2)] hover:brightness-110 transition"
            >
              Estou Pronto(a)
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#14151C] bg-[#09090E]">
        <div className="mx-auto grid max-w-[480px] grid-cols-4 px-2">
          <button className="flex flex-col items-center gap-1.5 py-[14px] text-slate-500 hover:text-slate-300 transition">
            <Home size={22} strokeWidth={1.5} />
            <span className="text-[10px] font-medium">Início</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 py-[14px] text-[#A78BFA]">
            <Flower2 size={22} strokeWidth={2} className="drop-shadow-[0_0_8px_rgba(167,139,250,0.4)]" />
            <span className="text-[10px] font-bold tracking-wide">Protocolos</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 py-[14px] text-slate-500 hover:text-slate-300 transition">
            <Activity size={22} strokeWidth={1.5} />
            <span className="text-[10px] font-medium">Meu Progresso</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 py-[14px] text-slate-500 hover:text-slate-300 transition">
            <Settings size={22} strokeWidth={1.5} />
            <span className="text-[10px] font-medium">Configurações</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
