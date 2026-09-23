/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Sparkles, BookOpen, Volume2, VolumeX
} from 'lucide-react';
import { ProtocolStage, PROTOCOL_STAGES, DAILY_INSIGHTS, JOURNEY_7D_INSIGHTS, SessionCheckIn } from '../types';
import { ORIGINAL_PROTOCOL_SCRIPTS } from '../data/protocol_scripts';
import { audioEngine, OFFICIAL_PROTOCOL_VOICE_ID } from '../lib/audio';
import { requestWakeLock } from '../lib/wakeLockHelpers';
import { AppLanguage, STAGE_AUDIO_TRANSLATIONS } from '../lib/i18n';

// Modular Session Components - Harmonized with official warm ivory and soft gold palette
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

export default function MeditationSession({
  dayNumber,
  userName,
  bgMusicType,
  voiceRate = 0.82,
  userPlan = 'free',
  customDecree,
  initialLanguage = 'pt',
  journeyType = '21d',
  onCompleteSession,
  onClose,
}: MeditationSessionProps) {
  // Session flow phases:
  // 'portal' -> 'checkin_before' -> 'playing' -> 'checkin_after' -> 'completed'
  const [sessionPhase, setSessionPhase] = useState<'portal' | 'checkin_before' | 'playing' | 'checkin_after' | 'completed'>('portal');

  // Stages & Audio State
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [breathePhase, setBreathePhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  // Secondary Text Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Check-In Sensations & Mood
  const [beforeMood, setBeforeMood] = useState(4);
  const [beforeSensations, setBeforeSensations] = useState<string[]>([]);
  const [beforeNotes, setBeforeNotes] = useState('');

  const [afterMood, setAfterMood] = useState(5);
  const [afterSensations, setAfterSensations] = useState<string[]>([]);
  const [afterNotes, setAfterNotes] = useState('');

  const stages = PROTOCOL_STAGES;
  const currentStage = stages[currentStageIndex];
  const activeScript = ORIGINAL_PROTOCOL_SCRIPTS[currentStage.id];

  // Dynamic insights
  const currentInsight = journeyType === '7d'
    ? JOURNEY_7D_INSIGHTS[dayNumber] || JOURNEY_7D_INSIGHTS[1]
    : DAILY_INSIGHTS[dayNumber] || DAILY_INSIGHTS[1];

  // Breathing cadence cycle
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBreathePhase(prev => {
        if (prev === 'inhale') return 'hold';
        if (prev === 'hold') return 'exhale';
        return 'inhale';
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Screen Wake Lock & Background Audio Keep-Alive
  useEffect(() => {
    let releaseWakeLock: (() => void) | null = null;
    requestWakeLock().then(release => {
      releaseWakeLock = release;
    });

    return () => {
      if (releaseWakeLock) releaseWakeLock();
      audioEngine.stopSpeech();
      audioEngine.stopSynth();
    };
  }, []);

  // Background Synth Ambient Music
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

  // Execute stage stream when stage changes or playback begins
  const playCurrentStageAudio = async () => {
    const rawStageText = (STAGE_AUDIO_TRANSLATIONS[initialLanguage] &&
      STAGE_AUDIO_TRANSLATIONS[initialLanguage][currentStage.id]) ||
      activeScript.audioScript ||
      activeScript.text;

    let personalizedText = rawStageText.replace(/\{userName\}/g, userName || 'Filho da Luz');
    if (currentStage.id === ProtocolStage.ABERTURA && customDecree) {
      personalizedText = `${personalizedText}\n\nDecreto Pessoal Especial: ${customDecree}`;
    }

    setIsPlaying(true);
    await audioEngine.playProtocolStageStream({
      text: personalizedText,
      voiceId: OFFICIAL_PROTOCOL_VOICE_ID,
      speed: voiceRate,
      stageTitle: `${currentStage.title} - ${currentStage.subtitle || ''}`,
      dayNumber,
      onProgress: (curr, dur) => {
        setCurrentTime(curr);
        setDuration(dur);
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
      // All 6 stages completed, transition to After Check-In
      setIsPlaying(false);
      audioEngine.stopSpeech();
      audioEngine.stopSynth();
      setSessionPhase('checkin_after');
    }
  };

  // Trigger audio playback upon entering 'playing' or advancing stage
  useEffect(() => {
    if (sessionPhase === 'playing') {
      playCurrentStageAudio();
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
    audioEngine.seekToSeconds(newTime);
    setCurrentTime(newTime);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(currentTime + 15, duration || 0);
    handleSeek(newTime);
  };

  const handleSkipBackward = () => {
    const newTime = Math.max(currentTime - 15, 0);
    handleSeek(newTime);
  };

  const handleNextStage = () => {
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

  // Paywall check for free tier beyond day 7
  if (userPlan === 'free' && dayNumber > 7) {
    return (
      <div className="fixed inset-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md text-[#2A2420] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-[#E5DAC6] rounded-3xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#FAF4E8] border border-[#B88736]/30 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#8F631E]" />
          </div>
          <h2 className="text-2xl font-serif text-[#2A2420] mb-3">Jornada 21 Dias — Plano PRO</h2>
          <p className="text-sm text-[#5C5248] leading-relaxed mb-6">
            Você concluiu o ciclo inicial gratuito de 7 dias com harmonia. Os dias 8 a 21 abrem os portais do Karuna Ki, Acupuntura Quântica Etérica e a Consolidação de Ganesha.
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

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F2] text-[#2A2420] flex flex-col justify-between overflow-hidden select-none">
      {/* Background Sacred Canvas */}
      <div className="absolute inset-0 pointer-events-none">
        <SacredEnergyCanvas
          stageId={currentStage.id}
          isPlaying={isPlaying}
          breathePhase={breathePhase}
        />
        <div className="absolute inset-0 bg-radial from-transparent via-[#FAF7F2]/40 to-[#F4EFE6] pointer-events-none" />
      </div>

      {/* Top Header Bar - Warm Ivory & Soft Gold */}
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E5DAC6] bg-white/80 text-xs font-serif text-[#8F631E] hover:border-[#8F631E] transition shadow-xs"
            title="Ver Roteiro Sagrado da Etapa"
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
            className="p-2 rounded-full border border-[#E5DAC6] text-[#5C5248] hover:text-[#2A2420] hover:bg-white/80 transition"
            title={isMuted ? 'Ativar Som' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full border border-[#E5DAC6] text-[#5C5248] hover:text-[#2A2420] hover:bg-white/80 transition"
            title="Sair do Protocolo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Sanctuary Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 max-w-xl mx-auto w-full text-center">
        {sessionPhase === 'playing' && (
          <motion.div
            key={currentStage.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6 }}
            className="w-full flex flex-col items-center"
          >
            {/* Stage Badge & Step Indicator */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#B88736]/30 bg-[#FAF4E8] text-xs font-serif text-[#8F631E] mb-6 shadow-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8F631E] animate-pulse" />
              <span>Etapa {currentStageIndex + 1} de {stages.length}: {currentStage.title}</span>
            </div>

            {/* Sacred Title */}
            <h2 className="text-2xl sm:text-3xl font-serif text-[#2A2420] font-normal tracking-wide mb-3">
              {currentStage.title}
            </h2>

            {/* Focus Description */}
            <p className="text-sm text-[#5C5248] leading-relaxed max-w-md mx-auto mb-6">
              {currentStage.subtitle}
            </p>

            {/* Subtle Respiration Guidance Ring */}
            <div className="relative w-44 h-44 my-4 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isPlaying
                    ? breathePhase === 'inhale' ? 1.25 : breathePhase === 'hold' ? 1.25 : 0.9
                    : 1,
                  opacity: isPlaying ? 0.7 : 0.4
                }}
                transition={{ duration: 4, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full border border-[#B88736]/30 bg-radial from-[#D4AF37]/15 to-transparent shadow-lg"
              />
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-[10px] tracking-widest uppercase font-mono text-[#5C5248] mb-1 font-semibold">
                  {isPlaying ? (
                    breathePhase === 'inhale' ? 'Inspire a Luz' :
                    breathePhase === 'hold' ? 'Sustente em Paz' : 'Expire e Solte'
                  ) : 'Pausado'}
                </span>
                <span className="text-xs font-serif text-[#8F631E] font-bold">
                  {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Quick Mantra or Canonical decree line */}
            <div className="mt-4 px-4 py-2 rounded-xl bg-white/90 border border-[#E5DAC6] max-w-sm text-xs italic text-[#5C5248] shadow-xs">
              "{activeScript.symbols?.[0] ? `${activeScript.symbols[0]} — ` : ''}{activeScript.mantra || 'Eu aceito, recebo e ancoro a cura em todo o meu ser.'}"
            </div>
          </motion.div>
        )}
      </main>

      {/* Stage Progression Dots */}
      {sessionPhase === 'playing' && (
        <div className="relative z-20 flex justify-center items-center gap-2 py-2">
          {stages.map((stage, idx) => (
            <button
              key={stage.id}
              onClick={() => {
                audioEngine.stopSpeech();
                setCurrentStageIndex(idx);
                setCurrentTime(0);
                setDuration(0);
              }}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                idx === currentStageIndex
                  ? 'w-8 bg-[#8F631E]'
                  : idx < currentStageIndex
                  ? 'w-3 bg-[#8F631E]/50'
                  : 'w-2 bg-[#E5DAC6]'
              }`}
              title={stage.title}
            />
          ))}
        </div>
      )}

      {/* Audio Player Controls */}
      {sessionPhase === 'playing' && (
        <footer className="relative z-20 px-6 py-4 border-t border-[#E5DAC6] bg-[#FAF7F2]/95 backdrop-blur-md max-w-2xl mx-auto w-full">
          <MinimalPlayerControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            onTogglePlay={handleTogglePlay}
            onSeek={handleSeek}
            onSkipForward={handleSkipForward}
            onSkipBackward={handleSkipBackward}
            onNextStage={handleNextStage}
            onPrevStage={handlePrevStage}
            canPrev={currentStageIndex > 0}
            canNext={true}
          />
        </footer>
      )}

      {/* Portal of Acceptance Ceremony (First Phase) */}
      <AnimatePresence>
        {sessionPhase === 'portal' && (
          <ProtocolAcceptancePortal
            userName={userName}
            onAccept={() => setSessionPhase('checkin_before')}
            onBack={onClose}
          />
        )}
      </AnimatePresence>

      {/* Check-In Before Session */}
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

      {/* Check-In After Session (Transmutation & Diary) */}
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

      {/* Completed Celebration Screen */}
      <AnimatePresence>
        {sessionPhase === 'completed' && (
          <div className="fixed inset-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md text-[#2A2420] flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full bg-white border border-[#E5DAC6] rounded-3xl p-8 text-center shadow-2xl"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#FAF4E8] border border-[#B88736]/35 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#8F631E]" />
              </div>
              <h2 className="text-2xl font-serif text-[#2A2420] mb-2">Dia {dayNumber} Concluído com Paz</h2>
              <p className="text-sm text-[#5C5248] leading-relaxed mb-6">
                Sua energia foi realinhada e selada. O Decreto Final está ancorado no seu campo sutil. Que a paz acompanhe seus passos.
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

      {/* Canonical Script Drawer (Always Accessible on Demand) */}
      <SecondaryScriptDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        stages={stages}
        currentStageId={currentStage.id}
        userName={userName}
      />
    </div>
  );
}
