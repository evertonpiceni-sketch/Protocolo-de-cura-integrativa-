import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, RotateCcw, RotateCw, Volume2, BookOpen, ChevronLeft, Leaf, ShieldCheck, Heart, Loader2, LogOut } from 'lucide-react';
import { UserProfile } from '../types';
import { audioEngine, OFFICIAL_PROTOCOL_VOICE_ID } from '../lib/audio';
import { startArcanjoOwnedSolfeggio } from '../lib/arcanjoAudioOwnershipPatch';
import { isElevenLabsVoiceId } from '../lib/voiceSelection';
import { isSolfeggioFrequency } from '../lib/protocolSessionAudioPolicy';
import { DISTANCE_TREATMENT_SCRIPT } from '../data/protocol_scripts';

interface ArcanjoProtocolViewProps {
  userProfile: UserProfile;
  onLogout: () => void;
  onClose?: () => void;
  initialDay?: number;
  initialCompletedDays?: number[];
  onCompletedDaysChange?: (days: number[]) => void;
}

type ProtocolConfig = {
  dia: number;
  nome: string;
  subtitulo: string;
  local: string;
  foco: string;
  cor: string;
  corSecundaria: string;
  freq: 396 | 417 | 528 | 639 | 741 | 852 | 963;
  petals: number;
  intencao: string;
};

type ApprovedSection = {
  key: 'INTRO' | 'MIGUEL' | 'VIOLETA' | 'RAFAEL' | 'ANCORAMENTO';
  title: string;
  fullText: string;
  ttsScript: string;
};

const DADOS_PROTOCOLO: Record<number, ProtocolConfig> = {
  1: { dia: 1, nome: 'Chakra Básico', subtitulo: 'Raiz • Sobrevivência e Segurança', local: 'Base da coluna', foco: 'Aterramento físico e liberação do medo da escassez', cor: '#ef4444', corSecundaria: '#fca5a5', freq: 396, petals: 4, intencao: 'trazendo estabilidade, presença e segurança interior' },
  2: { dia: 2, nome: 'Chakra Esplênico', subtitulo: 'Sacral • Vitalidade e Emoções', local: 'Abaixo do umbigo', foco: 'Liberação de bloqueios emocionais e resgate da força criativa', cor: '#f97316', corSecundaria: '#fdba74', freq: 417, petals: 6, intencao: 'liberando emoções e permitindo que a vitalidade e a criatividade voltem a fluir' },
  3: { dia: 3, nome: 'Chakra Plexo Solar', subtitulo: 'Poder Pessoal e Autoconfiança', local: 'Boca do estômago', foco: 'Liberação de laços de ansiedade, insegurança e controle', cor: '#eab308', corSecundaria: '#fde047', freq: 528, petals: 10, intencao: 'resgatando autoconfiança, coragem e poder pessoal' },
  4: { dia: 4, nome: 'Chakra Cardíaco', subtitulo: 'Coração • Amor e Aceitação', local: 'Centro do peito', foco: 'Transmutação simbólica de mágoas, rejeição e culpas', cor: '#22c55e', corSecundaria: '#86efac', freq: 639, petals: 12, intencao: 'abrindo espaço para amor próprio, acolhimento e perdão' },
  5: { dia: 5, nome: 'Chakra Laríngeo', subtitulo: 'Garganta • Expressão e Verdade', local: 'Garganta', foco: 'Liberação simbólica de travas de comunicação e expressão', cor: '#0ea5e9', corSecundaria: '#7dd3fc', freq: 741, petals: 16, intencao: 'liberando sua expressão e permitindo que sua verdade seja comunicada com clareza' },
  6: { dia: 6, nome: 'Chakra Frontal', subtitulo: 'Terceiro Olho • Mente e Intuição', local: 'Centro da testa', foco: 'Acalmar o excesso de estímulos e favorecer foco e clareza mental', cor: '#4f46e5', corSecundaria: '#a5b4fc', freq: 852, petals: 2, intencao: 'favorecendo silêncio interior, foco, discernimento e intuição' },
  7: { dia: 7, nome: 'Chakra Coronário', subtitulo: 'Coroa • Conexão Espiritual', local: 'Topo da cabeça', foco: 'Integração, presença e conexão espiritual', cor: '#a855f7', corSecundaria: '#d8b4fe', freq: 963, petals: 24, intencao: 'aprofundando presença, integração e conexão espiritual' },
};

const APPROVED_SECTIONS: ApprovedSection[] = [
  { key: 'INTRO', ...DISTANCE_TREATMENT_SCRIPT.INTRO },
  { key: 'MIGUEL', ...DISTANCE_TREATMENT_SCRIPT.MIGUEL },
  { key: 'VIOLETA', ...DISTANCE_TREATMENT_SCRIPT.VIOLETA },
  { key: 'RAFAEL', ...DISTANCE_TREATMENT_SCRIPT.RAFAEL },
  { key: 'ANCORAMENTO', ...DISTANCE_TREATMENT_SCRIPT.ANCORAMENTO },
];

function dayIntroduction(config: ProtocolConfig) {
  return `Dia ${config.dia}. ${config.nome}. ${config.subtitulo}. A frequência sonora escolhida para este dia é ${config.freq} hertz. Leve sua atenção para ${config.local}. A intenção de hoje é ${config.intencao}.`;
}

function approvedDisplayScript(config: ProtocolConfig) {
  const sections = APPROVED_SECTIONS.map(section => `${section.title.toUpperCase()}\n\n${section.fullText}`).join('\n\n');
  return `INTENÇÃO DO DIA\n\n${dayIntroduction(config)}\n\n${sections}`;
}

const CHAKRA_POSITIONS: Record<number, string> = {
  1: '50% 78%',
  2: '50% 68%',
  3: '50% 58%',
  4: '50% 47%',
  5: '50% 36%',
  6: '50% 25%',
  7: '50% 15%',
};

function ChakraBody({ config, progress, active, isMisticoModerno }: { config: ProtocolConfig; progress: number | null; active: boolean; isMisticoModerno: boolean }) {
  const illumination = progress === null ? (active ? 0.22 : 0.08) : Math.max(0.08, Math.min(1, progress / 100));
  const position = CHAKRA_POSITIONS[config.dia];
  const bodyImage = isMisticoModerno ? '/brand/chakra-body.svg' : '/brand/human-chakra-model.jpg';
  const glowSize = 34 + illumination * 38;
  // Style 4 keeps the seven-day progression within its approved gold/amber night palette.
  const glowPrimary = isMisticoModerno ? '#D4AF37' : config.cor;
  const glowSecondary = isMisticoModerno ? '#E2B96B' : config.corSecundaria;
  return <div id="arcanjo-chakra-stage" className={`relative mx-auto aspect-[4/5] w-full max-w-[430px] overflow-hidden rounded-[2rem] border shadow-[0_24px_70px_rgba(0,0,0,.38)] ${isMisticoModerno ? 'border-[#D4AF37]/30 bg-[#0A2742]' : 'border-[#B88736]/30 bg-[#021b13]'}`}>
    <img src={bodyImage} alt={isMisticoModerno ? 'Silhueta neutra em meditação com sete centros luminosos' : 'Pessoa em meditação com os sete chakras'} className="absolute inset-0 h-full w-full object-cover" style={{filter:'brightness(.34) saturate(.48)',transition:'filter 1.2s ease'}} />
    <img src={bodyImage} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000" style={{opacity:.2 + illumination * .8,WebkitMaskImage:`radial-gradient(circle ${glowSize}px at ${position}, black 0%, rgba(0,0,0,.95) 42%, transparent 100%)`,maskImage:`radial-gradient(circle ${glowSize}px at ${position}, black 0%, rgba(0,0,0,.95) 42%, transparent 100%)`}} />
    <div className={`absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000 ${active ? 'animate-pulse' : ''}`} style={{left:position.split(' ')[0],top:position.split(' ')[1],opacity:.12 + illumination * .88,transform:`translate(-50%,-50%) scale(${.72 + illumination * .42})`,background:`radial-gradient(circle,${glowSecondary}cc 0%,${glowPrimary}66 35%,transparent 72%)`,boxShadow:`0 0 ${12 + illumination * 34}px ${4 + illumination * 13}px ${glowPrimary}`}} aria-hidden="true" />
    <div id="arcanjo-chakra-caption" className={`absolute inset-x-0 bottom-0 bg-gradient-to-t ${isMisticoModerno ? 'from-[#080D16] via-[#141F30]/82' : 'from-[#021b13] via-[#021b13]/82'} to-transparent px-5 pb-5 pt-20 text-center`}>
      <p className="font-display text-3xl text-[#f5e8bd]">{config.freq} Hz</p>
      <p className={`mt-1 text-xs uppercase tracking-[.2em] ${isMisticoModerno ? 'text-[#D4AF37]' : 'text-[#B88736]'}`}>{config.nome}</p>
      <p className={`mt-2 text-xs ${isMisticoModerno ? 'text-[#BAC3D1]' : 'text-[#c8d9cd]'}`}>{progress === null ? (active ? 'Prática em andamento' : 'Pronto para começar') : `${Math.round(progress)}% concluído`}</p>
    </div>
  </div>;
}

export default function ArcanjoProtocolView({ userProfile, onClose, onLogout, initialDay, initialCompletedDays, onCompletedDaysChange }: ArcanjoProtocolViewProps) {
  const [diaAtual, setDiaAtual] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPreparingAudio, setIsPreparingAudio] = useState(false);
  const [voiceError, setVoiceError] = useState(false);
  const [isProtocolFrequencyActive, setIsProtocolFrequencyActive] = useState(false);
  const isEleganciaProfunda = typeof document !== 'undefined' && document.documentElement.dataset.layout === 'elegancia-profunda';
  const isEssenciaLuminosa = typeof document !== 'undefined' && document.documentElement.dataset.layout === 'essencia-luminosa';
  const isMisticoModerno = typeof document !== 'undefined' && document.documentElement.dataset.layout === 'mistico-moderno';
  const [hasStarted, setHasStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [showRoteiro, setShowRoteiro] = useState(false);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const fallbackTimerRef = useRef<number | null>(null);
  const narrationRunRef = useRef(0);
  const config = DADOS_PROTOCOLO[diaAtual];
  const protocolAccent = isMisticoModerno ? '#D4AF37' : '#B88736';
  const progressAccent = isMisticoModerno ? '#D4AF37' : '#c69b3d';
  const progressAccentLight = isMisticoModerno ? '#E2B96B' : config.corSecundaria;
  const progressGlow = isMisticoModerno ? '#D4AF37' : config.cor;
  // Estilos 2 e 3 suspendem o Solfeggio durante a narração neural.
  // O Estilo 4 usa voz neural com Solfeggio simultâneo; mantenha essa política separada.
  const suspendsSolfeggioDuringNeuralNarration = isEleganciaProfunda || isEssenciaLuminosa;
  const stopProtocolFrequency = () => {
    if (isSolfeggioFrequency(audioEngine.getCurrentSynthType())) {
      audioEngine.stopBG();
    }
    setIsProtocolFrequencyActive(false);
  };
  const playProtocolFrequency = () => {
    if (userProfile.audioEnabled === false) {
      stopProtocolFrequency();
      return;
    }
    // The Arcanjo view owns the audio surface; use its explicit bypass for every style.
    startArcanjoOwnedSolfeggio(`${config.freq}hz`);
    setIsProtocolFrequencyActive(true);
  };
  const prepareFrequencyForNarration = () => {
    if (suspendsSolfeggioDuringNeuralNarration) stopProtocolFrequency();
    else playProtocolFrequency();
  };
  const hasKnownDuration = Number.isFinite(duration) && duration > 0;
  const progressPercent = hasKnownDuration ? Math.min(100, Math.max(0, elapsed / duration * 100)) : null;
  const activeSection = APPROVED_SECTIONS[Math.min(activeSectionIndex, APPROVED_SECTIONS.length - 1)];

  useEffect(() => {
    let done: number[] = [];
    if (Array.isArray(initialCompletedDays)) {
      done = [...new Set(initialCompletedDays)].filter(day => day >= 1 && day <= 7).sort((a,b) => a-b);
    } else {
      for (let i = 1; i <= 7; i++) if (localStorage.getItem(`reiki_arcanjo_dia_${i}`) === 'true') done.push(i);
    }
    setCompletedDays(done);
    setDiaAtual([1,2,3,4,5,6,7].find(d => !done.includes(d)) || 1);
    return () => {
      narrationRunRef.current += 1;
      if (fallbackTimerRef.current) window.clearInterval(fallbackTimerRef.current);
      audioEngine.stopSpeech();
      audioEngine.stopSynth();
    };
  }, [initialCompletedDays]);

  // A day explicitly selected from the progress dashboard takes precedence on entry.
  // Keep this separate from progress hydration so later completion updates can advance
  // to the next unfinished day without reapplying the original dashboard selection.
  useEffect(() => {
    if (!Number.isInteger(initialDay) || initialDay! < 1 || initialDay! > 7) return;
    narrationRunRef.current += 1;
    audioEngine.stopSpeech();
    stopProtocolFrequency();
    audioEngine.stopSynth();
    if (fallbackTimerRef.current) window.clearInterval(fallbackTimerRef.current);
    fallbackTimerRef.current = null;
    setDiaAtual(initialDay!);
    setHasStarted(false);
    setIsPlaying(false);
    setIsPreparingAudio(false);
    setVoiceError(false);
    setIsProtocolFrequencyActive(false);
    setElapsed(0);
    setDuration(0);
    setActiveSectionIndex(0);
    setShowRoteiro(false);
  }, [initialDay]);

  useEffect(() => {
    if (!isPlaying || hasKnownDuration || !hasStarted) {
      if (fallbackTimerRef.current) window.clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
      return;
    }
    fallbackTimerRef.current = window.setInterval(() => setElapsed(previous => previous + 1), 1000);
    return () => {
      if (fallbackTimerRef.current) window.clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    };
  }, [isPlaying, hasKnownDuration, hasStarted]);

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2,'0')}:${Math.floor(seconds % 60).toString().padStart(2,'0')}`;

  const resetPlayback = (restoreFrequency = false) => {
    narrationRunRef.current += 1;
    if (fallbackTimerRef.current) window.clearInterval(fallbackTimerRef.current);
    fallbackTimerRef.current = null;
    audioEngine.stopSpeech();
    if (suspendsSolfeggioDuringNeuralNarration) {
      if (restoreFrequency) playProtocolFrequency();
      else stopProtocolFrequency();
    } else {
      audioEngine.stopSynth();
      setIsProtocolFrequencyActive(false);
    }
    setIsPlaying(false);
    setIsPreparingAudio(false);
    setHasStarted(false);
    setElapsed(0);
    setDuration(0);
    setActiveSectionIndex(0);
    setVoiceError(false);
  };

  const complete = () => {
    localStorage.setItem(`reiki_arcanjo_dia_${diaAtual}`, 'true');
    const next = [...new Set([...completedDays, diaAtual])].sort((a,b) => a-b);
    setCompletedDays(next);
    onCompletedDaysChange?.(next);
    resetPlayback(suspendsSolfeggioDuringNeuralNarration);
  };

  const startNativeFallback = (runId: number) => {
    if (isEleganciaProfunda || isEssenciaLuminosa || isMisticoModerno) {
      if (suspendsSolfeggioDuringNeuralNarration) playProtocolFrequency();
      else {
        audioEngine.stopSynth();
        setIsProtocolFrequencyActive(false);
      }
      setIsPreparingAudio(false);
      setIsPlaying(false);
      setHasStarted(false);
      setVoiceError(true);
      return;
    }
    setDuration(0);
    setElapsed(0);
    setActiveSectionIndex(0);
    setIsPreparingAudio(false);
    setIsPlaying(true);
    setHasStarted(true);

    const chunks = [dayIntroduction(config), ...APPROVED_SECTIONS.map(section => section.ttsScript)];
    const playChunk = (index: number) => {
      if (runId !== narrationRunRef.current) return;
      if (index >= chunks.length) {
        complete();
        return;
      }
      setActiveSectionIndex(Math.max(0, index - 1));
      void audioEngine.speakWithElevenLabsOrFallback(
        chunks[index],
        userProfile.voiceVolume ?? 0.9,
        () => { if (runId === narrationRunRef.current) setIsPlaying(true); },
        () => playChunk(index + 1),
        undefined,
        undefined,
        {
          voiceId: userProfile.voiceId || (userProfile.preferredVoiceGender === 'feminina' ? 'Rachel' : 'Marcus'),
          rate: userProfile.voiceRate ?? 0.84,
          pitch: userProfile.voicePitch ?? 1,
          lang: 'pt-BR',
          preferElevenLabs: false,
          userName: userProfile.name
        }
      );
    };
    playChunk(0);
  };

  const start = () => {
    resetPlayback(false);
    if ((isEleganciaProfunda || isMisticoModerno) && !isElevenLabsVoiceId(userProfile.voiceId)) {
      setVoiceError(true);
      if (suspendsSolfeggioDuringNeuralNarration) playProtocolFrequency();
      return;
    }
    setVoiceError(false);
    audioEngine.unlock();
    // Style 4 starts Solfeggio only when the neural audio actually begins.
    if (isMisticoModerno) stopProtocolFrequency();
    else prepareFrequencyForNarration();
    setIsPreparingAudio(true);
    setHasStarted(true);
    const runId = narrationRunRef.current;
    const parts = [dayIntroduction(config), ...APPROVED_SECTIONS.map(section => section.ttsScript)];

    void audioEngine.playGuidedMeditation(parts, {
      title: `Dia ${config.dia} — São Miguel, Chama Violeta e São Rafael`,
      subtitle: `${config.nome} • ${config.freq} Hz`,
      voiceId: (isEleganciaProfunda || isMisticoModerno)
        ? userProfile.voiceId
        : isEssenciaLuminosa
          ? (isElevenLabsVoiceId(userProfile.voiceId) ? userProfile.voiceId : OFFICIAL_PROTOCOL_VOICE_ID)
          : userProfile.voiceId || (userProfile.preferredVoiceGender === 'feminina' ? 'Rachel' : 'Marcus'),
      volume: userProfile.voiceVolume ?? 0.9,
      userName: userProfile.name,
      requireExplicitVoiceId: isEleganciaProfunda || isEssenciaLuminosa || isMisticoModerno,
      onStart: () => {
        if (runId !== narrationRunRef.current) return;
        prepareFrequencyForNarration();
        setIsPreparingAudio(false);
        setIsPlaying(true);
      },
      onPause: () => {
        if (runId !== narrationRunRef.current) return;
        setIsPlaying(false);
        if (suspendsSolfeggioDuringNeuralNarration) playProtocolFrequency();
        else {
          audioEngine.stopSynth();
          setIsProtocolFrequencyActive(false);
        }
      },
      onTimeUpdate: (seconds, realDuration) => {
        if (runId !== narrationRunRef.current) return;
        setElapsed(Number.isFinite(seconds) ? seconds : 0);
        setDuration(Number.isFinite(realDuration) && realDuration > 0 ? realDuration : 0);
      },
      onEnd: () => {
        if (runId === narrationRunRef.current) complete();
      },
      onError: () => {
        if (runId !== narrationRunRef.current) return;
        // playGuidedMeditation may invoke onEnd after onError on fail-closed paths.
        // Invalidate this run so a voice failure never marks the day as completed.
        if (isMisticoModerno) narrationRunRef.current += 1;
        audioEngine.stopSpeech();
        if (isEleganciaProfunda || isEssenciaLuminosa || isMisticoModerno) {
          if (suspendsSolfeggioDuringNeuralNarration) playProtocolFrequency();
          else {
            audioEngine.stopSynth();
            setIsProtocolFrequencyActive(false);
          }
          setIsPreparingAudio(false);
          setIsPlaying(false);
          setHasStarted(false);
          setVoiceError(true);
          return;
        }
        startNativeFallback(runId);
      }
    });
  };

  const togglePlayback = () => {
    if (isPreparingAudio) return;
    if ((isEleganciaProfunda || isMisticoModerno) && !isElevenLabsVoiceId(userProfile.voiceId)) {
      setVoiceError(true);
      return;
    }
    if (!hasStarted) {
      start();
      return;
    }
    if (isPlaying) {
      audioEngine.pauseSpeech();
      if (!suspendsSolfeggioDuringNeuralNarration && !isMisticoModerno) {
        // Native fallback has no HTMLAudio onpause callback.
        audioEngine.stopSynth();
        setIsProtocolFrequencyActive(false);
        setIsPlaying(false);
      }
      return;
    }
    if (suspendsSolfeggioDuringNeuralNarration) stopProtocolFrequency();
    audioEngine.resumeSpeech();
    if (!suspendsSolfeggioDuringNeuralNarration && !isMisticoModerno) {
      // Native fallback has no HTMLAudio onplay callback.
      playProtocolFrequency();
      setIsPlaying(true);
    }
  };

  const selectDay = (day: number) => {
    resetPlayback();
    setDiaAtual(day);
    setShowRoteiro(false);
  };

  const seek = (offset: number) => {
    if (!hasKnownDuration) return;
    audioEngine.seekSpeech(offset);
  };

  return <div id="arcanjo-protocol-view" className={`fixed inset-0 z-[100] overflow-y-auto ${isMisticoModerno ? 'bg-[#0A2742] text-[#F4F1EB]' : 'bg-[#F8F4EC] text-[#2A2420]'}`}>
    <div id="arcanjo-protocol-backdrop" className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0,rgba(214,167,86,.12),transparent_30rem),linear-gradient(180deg,#FBF8F2,#F8F4EC)]" />
    <header className={`sticky top-0 z-20 border-b px-4 py-4 backdrop-blur-xl ${isMisticoModerno ? 'border-[#D4AF37]/20 bg-[#0A0F18]/95' : 'border-[#B88736]/20 bg-[#F8F4EC]/92'}`}>
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2">
        <button onClick={onClose} className={`flex h-11 w-11 shrink-0 items-center justify-center ${isMisticoModerno ? 'text-[#D4AF37]' : 'text-[#B88736]'}`} aria-label="Voltar"><ChevronLeft size={25}/></button>
        <div className="text-center min-w-0">
          <div className={`text-[10px] sm:text-xs uppercase tracking-[.22em] truncate ${isMisticoModerno ? 'text-[#D4AF37]' : 'text-[#B88736]'}`}>Protocolo da Transformação</div>
          <h1 className="mt-0.5 font-display text-base sm:text-lg truncate">São Miguel • Chama Violeta • São Rafael</h1>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {onLogout && (
            <button
              onClick={onLogout}
              className="min-h-11 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-sm"
              title="Encerrar sessão e sair da conta"
            >
              <LogOut size={13} className="text-rose-600" />
              <span>Sair</span>
            </button>
          )}
          <button onClick={onClose} className={`flex h-11 w-11 items-center justify-center ${isMisticoModerno ? 'text-[#D4AF37]' : 'text-[#B88736]'}`} aria-label="Fechar"><X size={23}/></button>
        </div>
      </div>
    </header>

    <main className="relative z-10 mx-auto w-full max-w-[500px] space-y-5 px-4 py-6 pb-16">
      <section>
        <div className={`mb-4 flex flex-wrap items-center justify-center gap-2 text-sm ${isMisticoModerno ? 'text-[#BAC3D1]' : 'text-[#5C6A60]'}`}><ShieldCheck size={18} style={{color:protocolAccent}}/><span>Dia {config.dia} de 7</span><span className="text-[#B88736]/60">•</span><span>Solfeggio {config.freq} Hz</span></div>
        <ChakraBody config={config} progress={progressPercent} active={isPlaying} isMisticoModerno={isMisticoModerno}/>
      </section>

      <section className="space-y-5">
        <div className="ep-forest-panel rounded-[1.75rem] p-5 sm:p-7">
          <div className="mb-3 flex items-center justify-between gap-3 text-sm">
            <span style={{color:protocolAccent}}>{hasKnownDuration ? 'Narração aprovada em reprodução' : activeSection?.title || 'Roteiro aprovado'}</span>
            <span className={`font-mono ${isMisticoModerno ? 'text-[#BAC3D1]' : 'text-[#d9e6dc]'}`}>{formatTime(elapsed)} / {hasKnownDuration ? formatTime(duration) : '--:--'}</span>
          </div>
          {hasKnownDuration ? (
            <div className="h-2 overflow-hidden rounded-full bg-black/30" role="progressbar" aria-label="Progresso da narração" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progressPercent || 0)}>
              <div className="h-full rounded-full transition-all duration-300" style={{width:`${progressPercent || 0}%`,background:`linear-gradient(90deg,${progressAccent},${progressAccentLight})`,boxShadow:`0 0 12px ${progressGlow}`}}/>
            </div>
          ) : (
            <div className="h-2 overflow-hidden rounded-full bg-black/30" role="progressbar" aria-label="Duração da narração ainda não disponível">
              {hasStarted && <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />}
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-5">
            <button disabled={!hasKnownDuration} className="flex h-11 w-11 items-center justify-center rounded-xl text-[#d7e2d8] disabled:opacity-30" aria-label="Voltar dez segundos" onClick={()=>seek(-10)}><RotateCcw/></button>
            <button onClick={togglePlayback} disabled={isPreparingAudio} className="ep-gold-button flex h-20 w-20 items-center justify-center rounded-full disabled:opacity-70" aria-label={isPreparingAudio?'Preparando voz humana':isPlaying?'Pausar':'Iniciar ou continuar'}>{isPreparingAudio?<Loader2 size={32} className="animate-spin"/>:isPlaying?<Pause size={34}/>:<Play size={35} className="ml-1"/>}</button>
            <button disabled={!hasKnownDuration} className="flex h-11 w-11 items-center justify-center rounded-xl text-[#d7e2d8] disabled:opacity-30" aria-label="Avançar dez segundos" onClick={()=>seek(10)}><RotateCw/></button>
          </div>

          {voiceError && <p role="alert" className="ep-voice-error mt-4 rounded-xl px-4 py-3 text-xs">{isMisticoModerno ? 'A voz neural escolhida está indisponível. O Místico Moderno não usará a voz do dispositivo.' : isEssenciaLuminosa ? 'A narração neural está indisponível. A voz do dispositivo não será usada.' : 'Selecione uma voz neural válida em Ajustes de áudio. O Estilo 2 não usará a voz do dispositivo.'}</p>}
          <div role="status" aria-live="polite" className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-[#bad0c4]">
            <Volume2 size={17}/>
            <span>
              {userProfile.audioEnabled === false
                ? 'Áudio desativado — nenhuma frequência será reproduzida.'
                : isMisticoModerno
                  ? voiceError
                    ? `Voz neural indisponível — Solfeggio ${config.freq} Hz não foi iniciado.`
                    : isPreparingAudio
                      ? `Preparando narração neural — Solfeggio ${config.freq} Hz aguardando o início da voz.`
                      : isPlaying
                        ? `Narração neural + Solfeggio ${config.freq} Hz ativos`
                        : hasStarted
                          ? `Narração pausada — Solfeggio ${config.freq} Hz interrompido.`
                          : `Pronto — Solfeggio ${config.freq} Hz será ativado somente quando a narração neural começar.`
                  : suspendsSolfeggioDuringNeuralNarration
                    ? isPreparingAudio
                      ? `Preparando narração neural — Solfeggio ${config.freq} Hz suspenso.`
                      : isPlaying
                        ? `Narração neural ativa — Solfeggio ${config.freq} Hz suspenso.`
                        : isProtocolFrequencyActive
                          ? `Solfeggio ${config.freq} Hz ativo durante a pausa ou após a narração.`
                          : hasStarted
                            ? `Narração pausada — Solfeggio ${config.freq} Hz suspenso.`
                            : `Pronto — Solfeggio ${config.freq} Hz será ativado somente durante pausas ou após a narração.`
                    : isPreparingAudio
                      ? 'Preparando narração aprovada…'
                      : isPlaying
                        ? `Voz humana + Solfeggio ${config.freq} Hz ativos`
                        : hasStarted
                          ? `Pausado — Solfeggio ${config.freq} Hz interrompido`
                          : `Pronto — Solfeggio ${config.freq} Hz será reproduzido junto com a narração`}
            </span>
          </div>
        </div>

        <div className="ep-forest-panel rounded-[1.75rem] p-5 sm:p-7">
          <div className={`flex items-center gap-2 ${isMisticoModerno ? 'text-[#D4AF37]' : 'text-[#B88736]'}`}><Leaf size={18}/><span className="text-xs uppercase tracking-[.2em]">Intenção do dia</span></div>
          <h2 className="mt-3 font-display text-3xl font-semibold" style={{color:isMisticoModerno ? '#E2B96B' : config.corSecundaria}}>{config.nome}</h2>
          <p className={`mt-2 text-base ${isMisticoModerno ? 'text-[#BAC3D1]' : 'text-[#e9f1e9]'}`}>{config.subtitulo}</p>
          <p className="mt-4 border-t border-[#B88736]/20 pt-4 text-center font-display text-xl italic leading-8 text-[#f5e8bd]">{config.intencao}.</p>
        </div>

        <div className="ep-forest-panel rounded-[1.75rem] p-5 sm:p-7">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[.2em] text-[#B88736]">Roteiro aprovado reconectado</p>
            <p className={`mt-2 text-sm ${isMisticoModerno ? 'text-[#BAC3D1]' : 'text-[#e9f1e9]'}`}>Reiki São Miguel • Chama Violeta • Raio de Ouro e Verde de São Rafael</p>
          </div>
          <button onClick={()=>setShowRoteiro(!showRoteiro)} className={`mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm ${isMisticoModerno ? 'border-[#D4AF37]/35 text-[#E2B96B]' : 'border-[#B88736]/35 text-[#f0d989]'}`}><BookOpen size={17}/>{showRoteiro?'Ocultar roteiro':'Ler roteiro completo'}</button>
          {showRoteiro&&<div className={`mt-4 whitespace-pre-line rounded-2xl bg-black/20 p-5 text-base leading-7 ${isMisticoModerno ? 'text-[#BAC3D1]' : 'text-[#e6eee8]'}`}>{approvedDisplayScript(config)}</div>}
        </div>

        <div className="ep-forest-panel rounded-[1.75rem] p-5 sm:p-7">
          <div className="mb-5 text-center"><h3 className="font-display text-2xl text-[#f5e8bd]">Seu progresso</h3><p className="mt-1 text-sm text-[#bad0c4]">Equilíbrio hoje, presença amanhã.</p></div>
          <div className="grid grid-cols-7 gap-2">{[1,2,3,4,5,6,7].map(day=>{const dayConfig=DADOS_PROTOCOLO[day];const done=completedDays.includes(day);return <button key={day} onClick={()=>selectDay(day)} aria-label={`Abrir dia ${day}, ${dayConfig.nome}`} data-current={diaAtual===day ? 'true' : 'false'} data-completed={done ? 'true' : 'false'} className={`flex min-w-0 flex-col items-center gap-2 rounded-xl border px-1 py-3 ${isMisticoModerno ? (diaAtual===day ? 'border-[#D4AF37] bg-[#D4AF37]/12' : done ? 'border-[#6C3FA0]/45 bg-[#0A0F18]/30' : 'border-[#2E3B73]/60 bg-[#0A0F18]/25') : (diaAtual===day ? 'border-[#B88736] bg-[#e5c66f]/12' : 'border-[#B88736]/15 bg-black/10')}`}><span data-arcanjo-day-marker className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold" style={{background:isMisticoModerno ? (done ? '#6C3FA0' : diaAtual===day ? '#D4AF37' : '#2E3B73') : (done||diaAtual===day?dayConfig.cor:'#214536'),color:isMisticoModerno && diaAtual===day ? '#0A0F18' : '#fff'}}>{done?'✓':day}</span><span className={`hidden text-[11px] sm:block ${isMisticoModerno ? 'text-[#BAC3D1]' : 'text-[#c8d8cc]'}`}>{dayConfig.nome.replace('Chakra ','')}</span></button>})}</div>
        </div>

        <button className="ep-gold-button flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-semibold" onClick={complete}><Heart size={18}/>Concluir o momento de hoje</button>
        <p className={`px-4 text-center text-xs leading-5 ${isMisticoModerno ? 'text-[#BAC3D1]' : 'text-[#5C6A60]'}`}>Prática espiritual e integrativa. Não substitui cuidados médicos, psicológicos ou outros tratamentos de saúde.</p>
      </section>
    </main>
  </div>;
}
