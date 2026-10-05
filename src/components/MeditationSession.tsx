/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Sparkles, BookOpen, Volume2, VolumeX
} from 'lucide-react';
import { ProtocolStage, PROTOCOL_STAGES, DAILY_INSIGHTS, JOURNEY_7D_INSIGHTS, SessionCheckIn } from '../types';
import { ORIGINAL_PROTOCOL_SCRIPTS } from '../data/protocol_scripts';
import { audioEngine, OFFICIAL_PROTOCOL_VOICE_ID } from '../lib/audio';
import { requestWakeLock } from '../lib/wakeLockHelpers';
import { AppLanguage, STAGE_AUDIO_TRANSLATIONS } from '../lib/i18n';
import { resolveProtocolScript } from '../lib/protocolScript';

import { SacredEnergyCanvas } from './session/SacredEnergyCanvas';
import { ProtocolAcceptancePortal } from './session/ProtocolAcceptancePortal';
import { SessionCheckInModal } from './session/SessionCheckInModal';
import { SecondaryScriptDrawer } from './session/SecondaryScriptDrawer';
import { MinimalPlayerControls } from './session/MinimalPlayerControls';

interface MeditationSessionProps {
  dayNumber: number;
  userName: string;
  bgMusicType: '528hz' | '432hz' | '963hz' | '741hz' | 'waves' | 'none';
  voiceId?: string;
  voiceGender?: 'masculina' | 'feminina';
  voiceRate?: number;
  voicePitch?: number;
  userPlan?: 'free' | 'pro';
  customDecree?: string;
  prescribedFocus?: string;
  initialLanguage?: AppLanguage;
  journeyType?: '7d' | '21d';
  healingFocuses?: string[];
  pauseDuration?: number;
  onOpenProModal?: () => void;
  onCompleteSession: (
    dayNumber: number,
    journalText: string,
    moodRating: number,
    beforeFeeling?: SessionCheckIn,
    afterFeeling?: SessionCheckIn
  ) => void;
  onClose: () => void;
  onChangeBgMusic?: (bgMusicType: '528hz' | '432hz' | '963hz' | '741hz' | 'waves' | 'none') => void;
}

const MALE_NATIVE_VOICE_HINTS = ['antonio', 'antônio', 'daniel', 'jorge', 'felipe', 'ricardo', 'carlos', 'paulo', 'marcos', 'male', 'masculino'];
const FEMALE_NATIVE_VOICE_HINTS = ['francisca', 'luciana', 'maria', 'leticia', 'camila', 'vitoria', 'vitória', 'helena', 'female', 'feminina'];

export default function MeditationSession({
  dayNumber,
  userName,
  bgMusicType,
  voiceId,
  voiceGender,
  voiceRate = 0.82,
  userPlan = 'free',
  customDecree,
  initialLanguage = 'pt',
  journeyType = '21d',
  onCompleteSession,
  onClose,
}: MeditationSessionProps) {
  const [sessionPhase, setSessionPhase] = useState<'portal' | 'checkin_before' | 'playing' | 'checkin_after' | 'completed'>('portal');

  useLayoutEffect(() => {
    if (document.documentElement.dataset.layout === 'natural-sereno') {
      const session = document.getElementById('meditation-session');
      if (session) session.scrollTop = 0;
    }
  }, [sessionPhase]);

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [breathePhase, setBreathePhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [beforeMood, setBeforeMood] = useState(4);
  const [beforeSensations, setBeforeSensations] = useState<string[]>([]);
  const [beforeNotes, setBeforeNotes] = useState('');
  const [afterMood, setAfterMood] = useState(5);
  const [afterSensations, setAfterSensations] = useState<string[]>([]);
  const [afterNotes, setAfterNotes] = useState('');

  const stages = PROTOCOL_STAGES;
  const currentStage = stages[currentStageIndex];
  const activeScript = ORIGINAL_PROTOCOL_SCRIPTS[currentStage.id];
  const currentInsight = journeyType === '7d'
    ? JOURNEY_7D_INSIGHTS[dayNumber - 1] || JOURNEY_7D_INSIGHTS[0]
    : DAILY_INSIGHTS[dayNumber - 1] || DAILY_INSIGHTS[0];

  useEffect(() => {
    if (!isPlaying) return;
    const position = currentTime % 12;
    // The canonical opening says to hold for three seconds. Keep a 12-second
    // visual cycle without contradicting the spoken instruction: 4 / 3 / 5.
    setBreathePhase(position < 4 ? 'inhale' : position < 7 ? 'hold' : 'exhale');
  }, [isPlaying, currentTime]);

  useEffect(() => {
    let disposed = false;
    let wakeLock: Awaited<ReturnType<typeof requestWakeLock>> = null;
    requestWakeLock().then(lock => {
      // The browser can resolve acquisition after the player has closed.
      if (disposed) void lock?.release().catch(() => undefined);
      else wakeLock = lock;
    });

    return () => {
      disposed = true;
      void wakeLock?.release().catch(() => undefined);
      audioEngine.stopSpeech();
      audioEngine.stopSynth();
    };
  }, []);

  // Web Speech does not expose a gender field. When a gender preference was
  // explicitly chosen, resolve the best matching native voice by name before
  // the engine's fallback runs. This prevents a silent switch to the opposite
  // preference on devices that expose a recognizable voice name.
  useEffect(() => {
    if (document.documentElement.dataset.layout !== 'natural-sereno' || !voiceGender || !('speechSynthesis' in window)) return;
    const engine = audioEngine as any;
    const originalSpeak = engine.speak.bind(engine);
    const resolveNativeVoice = (requested: string | undefined) => {
      const aliasMatchesGender = requested === voiceGender ||
        (voiceGender === 'masculina' && ['masculina', 'male', 'Marcus', 'everton'].includes(requested || '')) ||
        (voiceGender === 'feminina' && ['feminina', 'female', 'Rachel', 'sofia'].includes(requested || ''));
      if (!aliasMatchesGender) return requested;
      const voices: SpeechSynthesisVoice[] = window.speechSynthesis.getVoices();
      const portuguese = voices.filter(v => v.lang.toLowerCase().startsWith('pt'));
      const hints = voiceGender === 'masculina' ? MALE_NATIVE_VOICE_HINTS : FEMALE_NATIVE_VOICE_HINTS;
      const match = portuguese.find(v => hints.some(hint => v.name.toLowerCase().includes(hint))) ||
        voices.find(v => hints.some(hint => v.name.toLowerCase().includes(hint)));
      return match?.name || requested;
    };
    engine.speak = (...args: any[]) => {
      const options = args[6] ? { ...args[6] } : {};
      options.voiceId = resolveNativeVoice(options.voiceId);
      return originalSpeak(...args.slice(0, 6), options);
    };
    return () => {
      engine.speak = originalSpeak;
    };
  }, [voiceGender]);

  useEffect(() => {
    if (sessionPhase === 'playing' && bgMusicType !== 'none') {
      audioEngine.startSynth(bgMusicType);
    } else {
      audioEngine.stopSynth();
    }
    return () => {
      audioEngine.stopSynth();
    };
  }, [sessionPhase, bgMusicType]);

  const dailyStageContext = () => {
    if (journeyType !== '21d') return '';
    const title = currentInsight?.title || `Dia ${dayNumber}`;
    const description = currentInsight?.description || '';
    const focus = currentInsight?.focus || '';
    const quote = currentInsight?.quote || '';

    switch (currentStage.id) {
      case ProtocolStage.ABERTURA:
        return `Dia ${dayNumber}. ${title}. ${description} Hoje, leve esta intenção para a prática: ${focus}`;
      case ProtocolStage.ATERRAMENTO:
        return `Ao se aterrar, mantenha presente o foco deste dia: ${focus}`;
      case ProtocolStage.VITALIDADE:
        return `Permita que a vitalidade deste momento dialogue com a proposta de hoje: ${title}.`;
      case ProtocolStage.TRANSMUTACAO:
        return `Nesta etapa, acolha o que o tema de hoje desperta em você, sem forçar nenhuma lembrança: ${description}`;
      case ProtocolStage.BALSAMO:
        return `Receba o bálsamo desta etapa lembrando a intenção do dia: ${focus}`;
      case ProtocolStage.SELAMENTO:
        return quote ? `Para integrar o dia de hoje, leve consigo esta reflexão: ${quote}` : `Integre o tema de hoje: ${title}.`;
      default:
        return '';
    }
  };

  const playCurrentStageAudio = async () => {
    const rawStageText = STAGE_AUDIO_TRANSLATIONS[initialLanguage]?.[currentStage.id]?.text ||
      activeScript.ttsScript ||
      activeScript.fullText ||
      currentStage.text;

    let personalizedText = rawStageText.replace(/\{userName\}|\[NOME\]/g, userName || 'Filho da Luz');
    if (currentStage.id === ProtocolStage.ABERTURA && customDecree) {
      personalizedText = `${personalizedText}\n\nDecreto Pessoal Especial: ${customDecree}`;
    }
    if (document.documentElement.dataset.layout === 'natural-sereno') {
      personalizedText = resolveProtocolScript(currentStage.id, initialLanguage, userName, currentStage.text, customDecree).audioText;
    }

    const dayContext = dailyStageContext();
    if (dayContext) personalizedText = `${dayContext}\n\n${personalizedText}`;

    setIsPlaying(true);
    await audioEngine.playProtocolStageStream({
      text: personalizedText,
      voiceId: document.documentElement.dataset.layout === 'natural-sereno'
        ? (voiceId || (voiceGender === 'masculina' ? 'masculina' : voiceGender === 'feminina' ? 'Rachel' : OFFICIAL_PROTOCOL_VOICE_ID))
        : OFFICIAL_PROTOCOL_VOICE_ID,
      speed: voiceRate,
      stageTitle: `Dia ${dayNumber} — ${currentInsight.title} — ${currentStage.title}`,
      dayNumber,
      onProgress: (curr, dur) => {
        // HTMLAudio reports seconds. Web Speech's SpeechSynthesisEvent.elapsedTime
        // is milliseconds; the fallback deliberately reports duration=0.
        const normalizedCurrent = dur > 0 ? curr : curr / 1000;
        setCurrentTime(Number.isFinite(normalizedCurrent) ? normalizedCurrent : 0);
        setDuration(Number.isFinite(dur) && dur > 0 ? dur : 0);
      },
      onEnd: () => {
        handleStageComplete();
      },
      onError: () => {
        setIsPlaying(false);
      }
    });
  };

  const handleStageComplete = () => {
    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
      setCurrentTime(0);
      setDuration(0);
    } else {
      setIsPlaying(false);
      audioEngine.stopSpeech();
      audioEngine.stopSynth();
      setSessionPhase('checkin_after');
    }
  };

  useEffect(() => {
    if (sessionPhase === 'playing') {
      void playCurrentStageAudio();
    }
    return () => {
      audioEngine.stopSpeech();
    };
  }, [sessionPhase, currentStageIndex]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioEngine.pauseSpeech();
      setIsPlaying(false);
    } else {
      audioEngine.resumeSpeech();
      setIsPlaying(true);
    }
  };

  const handleSeek = (newTime: number) => {
    if (!(duration > 0)) return;
    audioEngine.seekToSeconds(newTime);
    setCurrentTime(newTime);
  };

  const handleSkipForward = () => {
    if (!(duration > 0)) return;
    const newTime = Math.min(currentTime + 15, duration);
    handleSeek(newTime);
  };

  const handleSkipBackward = () => {
    if (!(duration > 0)) return;
    const newTime = Math.max(currentTime - 15, 0);
    handleSeek(newTime);
  };

  const handleNextStage = () => {
    if (currentStageIndex >= stages.length - 1) return;
    audioEngine.stopSpeech();
    handleStageComplete();
  };

  const handlePrevStage = () => {
    if (currentStageIndex > 0) {
      audioEngine.stopSpeech();
      setCurrentStageIndex(prev => prev - 1);
      setCurrentTime(0);
      setDuration(0);
    }
  };

  const handleFinishProtocol = () => {
    const beforeCheckIn: SessionCheckIn = {
      mood: beforeMood,
      notes: beforeNotes,
      sensations: beforeSensations,
      loggedAt: new Date().toISOString()
    };
    const afterCheckIn: SessionCheckIn = {
      mood: afterMood,
      notes: afterNotes,
      sensations: afterSensations,
      loggedAt: new Date().toISOString()
    };
    onCompleteSession(
      dayNumber,
      afterNotes,
      afterMood,
      beforeCheckIn,
      afterCheckIn
    );
    setSessionPhase('completed');
  };

  if (userPlan === 'free' && dayNumber > 7) {
    return (
      <div className="fixed inset-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md text-[#2A2420] flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain" role="dialog" aria-modal="true" aria-label="Acesso à jornada completa">
        <div className="max-w-md w-full bg-white border border-[#E5DAC6] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center shadow-xl">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#FAF4E8] border border-[#B88736]/30 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#8F631E]" />
          </div>
          <h2 className="text-2xl font-serif text-[#2A2420] mb-3">Jornada 21 Dias — Plano PRO</h2>
          <p className="text-sm text-[#5C5248] leading-relaxed mb-6">
            Os dias 8 a 21 fazem parte da jornada PRO. Seu progresso dos dias já realizados permanece preservado.
          </p>
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#8F631E] text-white font-medium tracking-wide hover:bg-[#7A5318] transition shadow-md"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  const breathTransitionSeconds = breathePhase === 'inhale' ? 4 : breathePhase === 'hold' ? 3 : 5;

  return (
    <div id="meditation-session" data-session-phase={sessionPhase} className="ep-session fixed inset-0 z-50 bg-[#FAF7F2] text-[#2A2420] flex flex-col justify-between overflow-hidden select-none min-h-dvh">
      <div className="ep-session-backdrop absolute inset-0 pointer-events-none">
        <SacredEnergyCanvas
          stageId={currentStage.id}
          isPlaying={isPlaying}
          breathePhase={breathePhase}
          elapsedSeconds={currentTime}
        />
        <div className="absolute inset-0 bg-radial from-transparent via-[#FAF7F2]/40 to-[#F4EFE6] pointer-events-none" />
      </div>

      <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-[#E5DAC6] bg-[#FAF7F2]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#B88736]/30 flex items-center justify-center bg-[#FAF4E8]">
            <span className="text-xs font-serif text-[#8F631E] font-bold">{dayNumber}</span>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#8F631E] font-mono font-semibold">
              {journeyType === '7d' ? 'Jornada 7 Dias' : 'Protocolo 21 Dias'} • Dia {dayNumber}
            </div>
            <h1 className="text-sm font-serif text-[#2A2420] font-medium tracking-wide">
              {currentInsight.title || 'Alinhamento Energético'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex min-h-11 items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E5DAC6] bg-white/80 text-xs font-serif text-[#8F631E] hover:border-[#8F631E] transition shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35"
            title="Ver Roteiro Sagrado da Etapa"
            aria-label="Ver roteiro sagrado da etapa"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Roteiro</span>
          </button>

          <button
            onClick={() => {
              if (isMuted) {
                audioEngine.setMasterVolume(1.0);
                setIsMuted(false);
              } else {
                audioEngine.setMasterVolume(0);
                setIsMuted(true);
              }
            }}
            className="w-11 h-11 rounded-full border border-[#E5DAC6] text-[#5C5248] hover:text-[#2A2420] hover:bg-white/80 transition flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
            aria-label={isMuted ? 'Ativar som' : 'Silenciar som'}
            title={isMuted ? 'Ativar Som' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full border border-[#E5DAC6] text-[#5C5248] hover:text-[#2A2420] hover:bg-white/80 transition flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
            aria-label="Sair da sessão"
            title="Sair do Protocolo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 max-w-xl mx-auto w-full text-center">
        {sessionPhase === 'playing' && (
          <motion.div
            key={currentStage.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6 }}
            className="ep-session-stage w-full flex flex-col items-center"
          >
            <div className="ns-session-title hidden">
              <p>Dia {dayNumber}</p>
              <h2>{currentInsight.title || 'Alinhamento Energético'}</h2>
            </div>

            <div className="ep-stage-badge inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#B88736]/30 bg-[#FAF4E8] text-xs font-serif text-[#8F631E] mb-6 shadow-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8F631E] animate-pulse" />
              <span>Etapa {currentStageIndex + 1} de {stages.length}: {currentStage.title}</span>
            </div>

            <h2 className="ep-stage-title text-2xl sm:text-3xl font-serif text-[#2A2420] font-normal tracking-wide mb-3">
              {currentStage.title}
            </h2>

            <p className="ep-stage-subtitle text-sm text-[#5C5248] leading-relaxed max-w-md mx-auto mb-6">
              {currentStage.subtitle}
            </p>

            <div className="ep-breathing-guide relative w-44 h-44 my-4 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isPlaying
                    ? breathePhase === 'inhale' ? 1.25 : breathePhase === 'hold' ? 1.25 : 0.9
                    : 1,
                  opacity: isPlaying ? 0.7 : 0.4
                }}
                transition={{ duration: breathTransitionSeconds, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full border border-[#B88736]/30 bg-radial from-[#D4AF37]/15 to-transparent shadow-lg"
              />
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-[10px] tracking-widest uppercase font-mono text-[#5C5248] mb-1 font-semibold">
                  {isPlaying ? (
                    breathePhase === 'inhale' ? 'Inspire a Luz' :
                    breathePhase === 'hold' ? 'Sustente por 3 segundos' : 'Expire e Solte'
                  ) : 'Pausado'}
                </span>
                <span className="text-xs font-serif text-[#8F631E] font-bold">
                  {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="ep-session-mantra mt-4 px-4 py-2 rounded-xl bg-white/90 border border-[#E5DAC6] max-w-sm text-xs italic text-[#5C5248] shadow-xs">
              “{currentInsight.focus || (activeScript.symbols?.[0] ? `${activeScript.symbols[0]} — ${activeScript.mantra || ''}` : activeScript.mantra || 'Eu acolho o meu momento com presença.')}”
            </div>
          </motion.div>
        )}
      </main>

      {sessionPhase === 'playing' && (
        <div className="relative z-20 flex justify-center items-center gap-1 py-1" aria-label="Etapas do protocolo">
          {stages.map((stage, idx) => (
            <button
              key={stage.id}
              onClick={() => {
                audioEngine.stopSpeech();
                setCurrentStageIndex(idx);
                setCurrentTime(0);
                setDuration(0);
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35"
              title={stage.title}
              aria-label={`Etapa ${idx + 1}: ${stage.title}`}
              aria-current={idx === currentStageIndex ? 'step' : undefined}
            >
              <span className={`block h-1.5 transition-all duration-300 rounded-full ${
                idx === currentStageIndex
                  ? 'w-8 bg-[#8F631E]'
                  : idx < currentStageIndex
                  ? 'w-3 bg-[#8F631E]/50'
                  : 'w-2 bg-[#E5DAC6]'
              }`} />
            </button>
          ))}
        </div>
      )}

      {sessionPhase === 'playing' && (
        <footer className="relative z-20 px-6 py-4 border-t border-[#E5DAC6] bg-[#FAF7F2]/95 backdrop-blur-md max-w-2xl mx-auto w-full">
          <MinimalPlayerControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            onTogglePlay={handleTogglePlay}
            onSeekTo={handleSeek}
            onSeekForward={handleSkipForward}
            onSeekBackward={handleSkipBackward}
            onNextStage={handleNextStage}
            onPrevStage={handlePrevStage}
            hasPrevStage={currentStageIndex > 0}
            hasNextStage={currentStageIndex < stages.length - 1}
            isMuted={isMuted}
            onToggleMute={() => {
              audioEngine.setMasterVolume(isMuted ? 1.0 : 0);
              setIsMuted(!isMuted);
            }}
            onOpenScriptDrawer={() => setIsDrawerOpen(true)}
          />
        </footer>
      )}

      <AnimatePresence>
        {sessionPhase === 'portal' && (
          <ProtocolAcceptancePortal
            userName={userName}
            onAccept={() => setSessionPhase('checkin_before')}
            onBack={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sessionPhase === 'checkin_before' && (
          <SessionCheckInModal
            type="before"
            mood={beforeMood}
            onMoodChange={setBeforeMood}
            selectedSensations={beforeSensations}
            onToggleSensation={(sens) => {
              setBeforeSensations(prev =>
                prev.includes(sens) ? prev.filter(s => s !== sens) : [...prev, sens]
              );
            }}
            notes={beforeNotes}
            onNotesChange={setBeforeNotes}
            dayNumber={dayNumber}
            journeyType={journeyType}
            onConfirm={() => setSessionPhase('playing')}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sessionPhase === 'checkin_after' && (
          <SessionCheckInModal
            type="after"
            mood={afterMood}
            onMoodChange={setAfterMood}
            selectedSensations={afterSensations}
            onToggleSensation={(sens) => {
              setAfterSensations(prev =>
                prev.includes(sens) ? prev.filter(s => s !== sens) : [...prev, sens]
              );
            }}
            notes={afterNotes}
            onNotesChange={setAfterNotes}
            dayNumber={dayNumber}
            journeyType={journeyType}
            onConfirm={handleFinishProtocol}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sessionPhase === 'completed' && (
          <div className="fixed inset-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md text-[#2A2420] flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain" role="dialog" aria-modal="true" aria-label="Sessão concluída">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full bg-white border border-[#E5DAC6] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center shadow-2xl"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#FAF4E8] border border-[#B88736]/35 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#8F631E]" />
              </div>
              <h2 className="text-2xl font-serif text-[#2A2420] mb-2">Dia {dayNumber} Concluído com Paz</h2>
              <p className="text-sm text-[#5C5248] leading-relaxed mb-6">
                Seu momento foi concluído com presença. Leve com você a intenção cultivada nesta prática e permita que ela acompanhe seus próximos passos.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#8F631E] text-white font-serif font-medium tracking-wide hover:bg-[#7A5318] transition shadow-md"
              >
                Voltar ao Painel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SecondaryScriptDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        stages={stages}
        currentStageId={currentStage.id}
        userName={userName}
        language={initialLanguage}
        customDecree={customDecree}
      />
    </div>
  );
}
