/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play, Pause, SkipForward, RotateCcw, Volume2, VolumeX,
  Sparkles, Shield, Heart, Feather, Flame, ArrowRight,
  Smile, Check, CheckCircle2, ChevronRight, PenTool, FlameKindling,
  Activity, TrendingUp, Zap, HelpCircle
} from 'lucide-react';
import { DayProgress, ProtocolStage, PROTOCOL_STAGES, StageContent, DAILY_INSIGHTS, JOURNEY_7D_INSIGHTS, SessionCheckIn } from '../types';
import { ORIGINAL_PROTOCOL_SCRIPTS } from '../data/protocol_scripts';
import { audioEngine } from '../lib/audio';
import { requestWakeLock } from '../lib/wakeLockHelpers';
import { AppLanguage, SUPPORTED_LANGUAGES, STAGE_AUDIO_TRANSLATIONS, UI_TRANSLATIONS } from '../lib/i18n';
import { MessageCircle, Globe } from 'lucide-react';

const BEFORE_SENSATIONS = [
  'Ansiedade / Agitação',
  'Aperto no peito',
  'Cansaço extremo / Burnout',
  'Falta de ar',
  'Nó na garganta',
  'Mente acelerada / TDAH',
  'Apatia',
  'Angústia / Depressão',
  'Instabilidade / Oscilação'
];

const PHYSICAL_REACTIONS = [
  'Formigamento nas mãos/pés',
  'Arrepio constante',
  'Calor no peito/cabeça',
  'Enjoo ou tontura leve',
  'Peso nos ombros diminuindo',
  'Bocejos e lágrimas de limpeza',
  'Relaxamento muscular',
  'Sono profundo'
];

const EMOTIONAL_REACTIONS = [
  'Paz Profunda',
  'Vontade de chorar (alívio)',
  'Tristeza passageira',
  'Amor e gratidão',
  'Clareza mental',
  'Raiva sendo liberada',
  'Esperança',
  'Sensação de perdão e aceitação'
];

interface MeditationSessionProps {
  healingFocuses?: string[];
  pauseDuration?: number;
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
  onCompleteSession: (
    dayNumber: number,
    journalText: string,
    moodRating: number,
    beforeFeeling?: SessionCheckIn,
    afterFeeling?: SessionCheckIn
  ) => void;
  onClose: () => void;
  onChangeBgMusic?: (bgMusicType: '528hz' | '432hz' | '963hz' | '741hz' | 'waves' | 'none') => void;
  onOpenProModal?: () => void;
}

export default function MeditationSession({
  dayNumber,
  userName,
  bgMusicType,
  voiceId,
  voiceRate = 0.82,
  voicePitch = 1.0,
  userPlan = 'free',
  customDecree,
  prescribedFocus,
  initialLanguage = 'pt',
  journeyType = '21d',
  healingFocuses,
  pauseDuration = 5,
  onCompleteSession,
  onClose,
  onChangeBgMusic,
  onOpenProModal
}: MeditationSessionProps) {
  // Session Phases: 'intro' | 'decree' | 'guided' | 'complete'
  const [sessionPhase, setSessionPhase] = useState<'intro' | 'decree' | 'guided' | 'complete'>('intro');
  const [activeStageIndex, setActiveStageIndex] = useState(1); // Start guided stages at index 1 (Aterramento)
  const [language, setLanguage] = useState<AppLanguage>(initialLanguage);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  
  const totalJourneyDays = journeyType === '7d' ? 7 : 21;
  const currentInsightsList = journeyType === '7d' ? JOURNEY_7D_INSIGHTS : DAILY_INSIGHTS;
  const currentDayInsight = currentInsightsList[dayNumber - 1] || currentInsightsList[0];
  
  // Custom stage interactive states
  const [breathePhase, setBreathePhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breatheSeconds, setBreatheSeconds] = useState(4);
  const [transmuteText, setTransmuteText] = useState('');
  const [transmutedItems, setTransmutedItems] = useState<string[]>([]);
  const [isTransmuting, setIsTransmuting] = useState(false);
  
  const [tappedMantras, setTappedMantras] = useState<Record<string, boolean>>({});
  
  // Customization States
  const [isReflecting, setIsReflecting] = useState(false);
  const [reflectionTimeLeft, setReflectionTimeLeft] = useState(0);
  const reflectionTimerRef = useRef<NodeJS.Timeout | null>(null);

  
  // BEFORE TREATMENT CHECK-IN STATE
  const [beforeMood, setBeforeMood] = useState<number>(2); // 1-5 scale
  const [beforeNotes, setBeforeNotes] = useState<string>('');
  const [beforeSensations, setBeforeSensations] = useState<string[]>(['Ansiedade / Agitação']);

  // AFTER TREATMENT CHECK-IN STATE
  const [afterMood, setAfterMood] = useState<number>(5); // 1-5 scale
  const [afterNotes, setAfterNotes] = useState<string>('');
  const [afterSensations, setAfterSensations] = useState<string[]>(['Paz Profunda', 'Leveza no Peito']);

  // Refs for speech timings
  const activeStage = PROTOCOL_STAGES[activeStageIndex];
  const totalGuidedStages = PROTOCOL_STAGES.length;

  const toggleBeforeSensation = (tag: string) => {
    if (beforeSensations.includes(tag)) {
      setBeforeSensations(beforeSensations.filter(t => t !== tag));
    } else {
      setBeforeSensations([...beforeSensations, tag]);
    }
  };

  const toggleAfterSensation = (tag: string) => {
    if (afterSensations.includes(tag)) {
      setAfterSensations(afterSensations.filter(t => t !== tag));
    } else {
      setAfterSensations([...afterSensations, tag]);
    }
  };

  // Current language config & stage translation
  const currentLangConfig = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const translatedStageData = STAGE_AUDIO_TRANSLATIONS[language]?.[activeStage.id];
  const originalScript = ORIGINAL_PROTOCOL_SCRIPTS[activeStage.id];
  
  const displayTitle = translatedStageData?.title || originalScript?.title || activeStage.title;
  const displaySubtitle = translatedStageData?.subtitle || originalScript?.subtitle || activeStage.subtitle;
  const displayText = language === 'pt' && originalScript
    ? originalScript.fullText
    : (translatedStageData?.text || originalScript?.fullText || activeStage.text);

  // Initialize and run breathing circle cycle
  useEffect(() => {
    if (sessionPhase !== 'guided' || activeStageIndex !== 1 || !isPlaying) return;

    const breatheInterval = setInterval(() => {
      setBreatheSeconds(prev => {
        if (prev <= 1) {
          if (breathePhase === 'inhale') {
            setBreathePhase('hold');
            return 4; // Hold for 4 seconds
          } else if (breathePhase === 'hold') {
            setBreathePhase('exhale');
            return 4; // Exhale for 4 seconds
          } else {
            setBreathePhase('inhale');
            return 4; // Inhale for 4 seconds
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(breatheInterval);
  }, [breathePhase, sessionPhase, activeStageIndex, isPlaying]);

  // Handle ambient background music and voice speech trigger when active stage or language changes
  useEffect(() => {
    if (sessionPhase === 'guided' && isPlaying) {
      // Start background drone
      audioEngine.startBG(isMuted ? 'none' : bgMusicType);
      
      // Personalize text with the name using current language and authentic TTS script
      const stageText = language === 'pt' && originalScript
        ? originalScript.ttsScript
        : (STAGE_AUDIO_TRANSLATIONS[language]?.[activeStage.id]?.text || originalScript?.ttsScript || activeStage.text);
      let textToSpeak = stageText.replace(/\[NOME\]/g, userName);
      
      if (healingFocuses && healingFocuses.length > 0 && activeStage.id === ProtocolStage.TRANSMUTACAO && language === 'pt') {
        textToSpeak += ` Direcionando agora essa poderosa energia de cura especificamente para: ${healingFocuses.join(', ')}. Sinta a transmutação ocorrer.`;
      }
      
      // Speak current section with selected language voice
      audioEngine.speakWithElevenLabsOrFallback(
        textToSpeak,
        isMuted ? 0 : voiceVolume,
        () => {}, // onStart
        () => {
          // onEnd -> Automatically proceed to next stage if available
          handleAutoNextStage();
        },
        undefined,
        undefined,
        {
          voiceId,
          rate: voiceRate,
          pitch: voicePitch,
          lang: currentLangConfig.speechLang,
          stability: 0.45,
          similarityBoost: 0.75,
          enableBreathingPauses: true,
          userName
        }
      );
    } else {
      audioEngine.stopSpeech();
      if (sessionPhase !== 'guided' && sessionPhase !== 'decree') {
        audioEngine.stopBG();
      }
    }

    return () => {
      audioEngine.stopSpeech();
    };
  }, [activeStageIndex, isPlaying, sessionPhase, isMuted, language]);

  // Stop all audio on unmount to prevent leaks
  useEffect(() => {
    return () => {
      audioEngine.stopBG();
      audioEngine.stopSpeech();
      if (reflectionTimerRef.current) clearInterval(reflectionTimerRef.current);
    };
  }, []);

  // Sync mute values
  useEffect(() => {
    if (isMuted) {
      audioEngine.setMainVolume(0);
      audioEngine.stopSpeech();
    } else {
      audioEngine.setMainVolume(1);
      audioEngine.setBGVolume(0.5);
    }
  }, [isMuted]);

  // Synchronize active session background music in real-time when bgMusicType or isMuted changes
  useEffect(() => {
    if (isMuted) {
      audioEngine.startBG('none');
    } else if (sessionPhase === 'decree') {
      audioEngine.startBG(bgMusicType);
    } else if (sessionPhase === 'guided' && isPlaying) {
      audioEngine.startBG(bgMusicType);
    }
  }, [bgMusicType, isMuted, sessionPhase, isPlaying]);

  const [isDecreeVoicePlaying, setIsDecreeVoicePlaying] = useState(false);

  const toggleDecreeVoice = () => {
    audioEngine.unlock();
    if (isDecreeVoicePlaying) {
      audioEngine.stopSpeech();
      setIsDecreeVoicePlaying(false);
    } else {
      setIsDecreeVoicePlaying(true);
      const decreeStageText = language === 'pt'
        ? ORIGINAL_PROTOCOL_SCRIPTS.ABERTURA.ttsScript
        : (STAGE_AUDIO_TRANSLATIONS[language]?.ABERTURA?.text || ORIGINAL_PROTOCOL_SCRIPTS.ABERTURA.ttsScript || PROTOCOL_STAGES[0].text);
      const textToSpeak = decreeStageText.replace(/\[NOME\]/g, userName);
      
      audioEngine.speakWithElevenLabsOrFallback(
        textToSpeak,
        isMuted ? 0 : voiceVolume,
        () => setIsDecreeVoicePlaying(true),
        () => setIsDecreeVoicePlaying(false),
        undefined,
        undefined,
        {
          voiceId,
          rate: voiceRate,
          pitch: voicePitch,
          lang: currentLangConfig.speechLang,
          stability: 0.45,
          similarityBoost: 0.75,
          enableBreathingPauses: true,
          userName
        }
      );
    }
  };

  const handleStartPractice = () => {
    audioEngine.unlock();
    setSessionPhase('decree');
    // Start subtle background music during the decree of acceptance
    audioEngine.startBG(bgMusicType);
  };

  const handleAcceptDecree = () => {
    audioEngine.unlock();
    audioEngine.stopSpeech();
    setIsDecreeVoicePlaying(false);
    setSessionPhase('guided');
    setActiveStageIndex(1); // Set to "Aterramento" (index 1)
    setIsPlaying(true);
  };



  const skipStage = () => {
    if (isReflecting) {
      // User skips reflection
      if (reflectionTimerRef.current) clearInterval(reflectionTimerRef.current);
      setIsReflecting(false);
      setReflectionTimeLeft(0);
      if (activeStageIndex < totalGuidedStages - 1) {
        setActiveStageIndex(prev => prev + 1);
      } else {
        handleCompleteGuidedJourney();
      }
      return;
    }

    if (activeStageIndex < totalGuidedStages - 1) {
      setActiveStageIndex(prev => prev + 1);
    } else {
      handleCompleteGuidedJourney();
    }
  };

  const handleAutoNextStage = () => {
    if (pauseDuration && pauseDuration > 0 && activeStageIndex < totalGuidedStages - 1) {
      setIsReflecting(true);
      setReflectionTimeLeft(pauseDuration);
      
      let timeLeft = pauseDuration;
      reflectionTimerRef.current = setInterval(() => {
        timeLeft--;
        setReflectionTimeLeft(timeLeft);
        if (timeLeft <= 0) {
          if (reflectionTimerRef.current) clearInterval(reflectionTimerRef.current);
          setIsReflecting(false);
          setActiveStageIndex(prev => prev + 1);
        }
      }, 1000);
      return;
    }

    if (activeStageIndex < totalGuidedStages - 1) {
      setActiveStageIndex(prev => prev + 1);
    } else {
      handleCompleteGuidedJourney();
    }
  };


  const restartSession = () => {
    setActiveStageIndex(1);
    setIsPlaying(true);
  };

  // Chama Violeta Transmutation Click Handler
  const handleTransmuteClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transmuteText.trim()) return;
    
    setIsTransmuting(true);
    const item = transmuteText.trim();
    
    setTimeout(() => {
      setTransmutedItems(prev => [item, ...prev]);
      setTransmuteText('');
      setIsTransmuting(false);
    }, 1500);
  };

  // Ho'oponopono Tap Handler
  const handleTapMantra = (mantra: string) => {
    setTappedMantras(prev => ({
      ...prev,
      [mantra]: true
    }));
    // Remove state after anim completes to allow retapping
    setTimeout(() => {
      setTappedMantras(prev => ({
        ...prev,
        [mantra]: false
      }));
    }, 1000);
  };

  const handleSaveProgress = () => {
    const beforeCheckIn: SessionCheckIn = {
      mood: beforeMood,
      stateTitle: beforeMood === 1 ? 'Pesado / Angustiado' : beforeMood === 2 ? 'Inquieto / Tenso' : beforeMood === 3 ? 'Neutro' : beforeMood === 4 ? 'Calmo' : 'Em Paz / Conectado',
      notes: beforeNotes,
      sensations: beforeSensations,
      loggedAt: new Date().toISOString()
    };

    const afterCheckIn: SessionCheckIn = {
      mood: afterMood,
      stateTitle: afterMood === 1 ? 'Pesado' : afterMood === 2 ? 'Inquieto' : afterMood === 3 ? 'Neutro' : afterMood === 4 ? 'Calmo' : 'Em Paz / Pleno',
      notes: afterNotes,
      sensations: afterSensations,
      loggedAt: new Date().toISOString()
    };

    onCompleteSession(dayNumber, afterNotes, afterMood, beforeCheckIn, afterCheckIn);
  };

  // Render the current stage's specific active simulation/widgets
  const renderStageVisuals = () => {
    switch (activeStage.id) {
      case ProtocolStage.ATERRAMENTO:
        // Aterramento visual: breathing circle and deep rooted lines pulsing
        return (
          <div className="flex flex-col items-center justify-center py-6 space-y-6" id="visual-grounding">
            {/* Breathing circles */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: breathePhase === 'inhale' ? 1.4 : breathePhase === 'hold' ? 1.4 : 0.9,
                  opacity: breathePhase === 'hold' ? 0.35 : 0.15
                }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="absolute inset-0 bg-emerald-500 rounded-full blur-xl"
              />
              
              <motion.div
                animate={{
                  scale: breathePhase === 'inhale' ? 1.25 : breathePhase === 'hold' ? 1.25 : 0.95,
                }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="w-40 h-40 rounded-full border-2 border-emerald-400/50 flex flex-col items-center justify-center bg-stone-950/80 shadow-2xl z-10"
              >
                <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase">
                  {breathePhase === 'inhale' && "Inale"}
                  {breathePhase === 'hold' && "Segure"}
                  {breathePhase === 'exhale' && "Exale"}
                </span>
                <span className="text-3xl font-display font-light text-slate-100 mt-1">
                  {breatheSeconds}s
                </span>
              </motion.div>

              {/* Glowing anchor lines */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-0.5 h-32 bg-gradient-to-b from-emerald-500/50 to-transparent pointer-events-none -z-10 mt-20" />
            </div>

            <p className="text-xs font-mono text-emerald-500/80 uppercase tracking-widest text-center max-w-xs leading-relaxed animate-pulse-slow">
              Raízes de luz descem agora conectando você com o coração da Terra.
            </p>
          </div>
        );

      case ProtocolStage.VITALIDADE:
        // Vitalidade: warm golden particles pulsing upwards
        return (
          <div className="flex flex-col items-center justify-center py-6 space-y-8" id="visual-vitality">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-2xl animate-pulse-slow" />
              
              {/* Spine representation */}
              <div className="flex flex-col items-center space-y-2 relative z-10">
                {[1, 2, 3, 4, 5].map((node) => (
                  <motion.div
                    key={node}
                    initial={{ scale: 0.8, opacity: 0.4 }}
                    animate={{
                      scale: isPlaying ? [0.8, 1.2, 0.8] : 1,
                      opacity: isPlaying ? [0.4, 1, 0.4] : 0.6,
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: node * 0.3,
                      ease: "easeInOut"
                    }}
                    className={`w-4 h-4 rounded-full shadow-lg shadow-amber-500/20 ${
                      node === 1 ? 'bg-indigo-400 w-6 h-6' : 'bg-amber-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
                Alinhamento Cerebral Ativo
              </span>
              <p className="text-xs text-slate-400 italic max-w-xs mx-auto">
                Cristais sutis de luz organizando as conexões de foco e tranquilidade mental.
              </p>
            </div>
          </div>
        );

      case ProtocolStage.TRANSMUTACAO:
        // Transmutação: interactive violet flame transmuter
        return (
          <div className="flex flex-col items-center justify-center py-4 space-y-6" id="visual-transmutation">
            {/* Violet Flame representation */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Outer purple protection cúpula */}
              <div className="absolute inset-0 rounded-full border border-blue-500/20 bg-blue-500/5 animate-pulse-slow" />
              
              <div className="absolute inset-4 rounded-full bg-violet-600/15 filter blur-xl animate-pulse" />
              
              {/* Interactive Flame Core */}
              <motion.div
                animate={{
                  scale: isTransmuting ? [1, 1.2, 0.95, 1.1, 1] : [1, 1.05, 0.98, 1.03, 1],
                  y: [0, -4, 2, -2, 0]
                }}
                transition={{
                  duration: isTransmuting ? 1.5 : 4,
                  repeat: isTransmuting ? 0 : Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-20 bg-gradient-to-t from-violet-600 via-purple-500 to-indigo-400 rounded-b-full rounded-t-full shadow-2xl relative z-10 filter brightness-110 flex items-center justify-center"
              >
                <FlameKindling size={24} className="text-white/80 animate-pulse" />
              </motion.div>
            </div>

            {/* Transmute Input */}
            <form onSubmit={handleTransmuteClick} className="w-full max-w-sm space-y-3 relative z-20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={transmuteText}
                  onChange={(e) => setTransmuteText(e.target.value)}
                  disabled={isTransmuting}
                  placeholder="Mágoa, culpa, ansiedade, medo..."
                  className="flex-1 bg-slate-950 border border-violet-800/40 text-violet-200 placeholder-violet-700/60 focus:border-violet-500 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-violet-500"
                />
                <button
                  type="submit"
                  disabled={isTransmuting || !transmuteText.trim()}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-medium px-4 py-2.5 rounded-xl transition text-xs flex items-center gap-1 cursor-pointer border-none disabled:opacity-50"
                >
                  <Flame size={14} />
                  Queimar
                </button>
              </div>

              {/* Transmuted Log */}
              <div className="h-10 overflow-hidden flex flex-wrap gap-1.5 justify-center items-center">
                <AnimatePresence>
                  {transmutedItems.slice(0, 3).map((item, idx) => (
                    <motion.span
                      key={item + idx}
                      initial={{ opacity: 0, scale: 0.5, y: 15 }}
                      animate={{ opacity: 0.5, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className="text-[10px] font-mono text-violet-300 bg-violet-950/40 border border-violet-800/30 px-2 py-0.5 rounded"
                    >
                      🔥 {item} Transmutado
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </form>
          </div>
        );

      case ProtocolStage.BALSAMO:
        // Bálsamo do amor: heart expandable and rosa-quartzo wave pulse
        return (
          <div className="flex flex-col items-center justify-center py-6 space-y-6" id="visual-balm">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Pulsing glow boundary */}
              <motion.div
                animate={{
                  scale: isPlaying ? [1, 1.15, 1] : 1,
                  opacity: isPlaying ? [0.15, 0.3, 0.15] : 0.2
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-rose-500 rounded-full blur-2xl"
              />

              {/* Heart container */}
              <motion.div
                animate={{
                  scale: isPlaying ? [0.95, 1.05, 0.95] : 1,
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 bg-gradient-to-br from-rose-500/80 to-pink-500/80 rounded-full flex items-center justify-center text-white shadow-lg relative z-10"
              >
                <Heart size={36} fill="white" className="text-rose-100" />
              </motion.div>
            </div>

            <p className="text-xs text-center text-rose-300 max-w-xs font-sans italic leading-relaxed animate-pulse-slow">
              "Luz rosa-quartzo expandindo e curando a dor do abandono..."
            </p>
          </div>
        );

      case ProtocolStage.SELAMENTO:
        // Selamento: throne/crown energy, with interactive clickable mantras
        const mantras = ["Sinto muito.", "Me perdoe.", "Eu te amo.", "Sou grato."];
        return (
          <div className="flex flex-col items-center justify-center py-4 space-y-6" id="visual-sealing">
            {/* Sky Throne visual */}
            <div className="relative w-40 h-28 flex items-center justify-center">
              <div className="absolute bottom-0 w-36 h-12 bg-white/5 rounded-full blur-lg" />
              <div className="flex flex-col items-center relative z-10">
                {/* Visual throne anchor */}
                <span className="text-3xl font-display font-light animate-bounce">👑</span>
                <span className="text-[10px] font-mono text-amber-400 mt-2 tracking-widest uppercase">
                  Trono de Estabilidade
                </span>
              </div>
            </div>

            {/* Clickable Mantras */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-xs" id="hooponopono-grid">
              {mantras.map((mantra) => {
                const isTapped = tappedMantras[mantra];
                return (
                  <button
                    key={mantra}
                    type="button"
                    onClick={() => handleTapMantra(mantra)}
                    className={`p-3 rounded-xl border font-display text-xs text-center transition-all duration-300 cursor-pointer relative overflow-hidden ${
                      isTapped
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 scale-95 shadow-inner'
                        : 'bg-slate-950/80 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {isTapped && (
                      <motion.span
                        layoutId={`ripple-${mantra}`}
                        className="absolute inset-0 bg-amber-500/5 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 3 }}
                        transition={{ duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 font-medium">{mantra}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between" id="meditation-session-view">
      {/* 1. INTRO PHASE */}
      {sessionPhase === 'intro' && (
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-y-auto" id="intro-screen">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0,transparent_70%)]" />
          
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-5 text-center relative overflow-hidden my-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full uppercase">
                {journeyType === '7d' ? `Jornada dos 7 Chakras • Dia ${dayNumber} de 7` : `Protocolo de Cura Integrada • Dia ${dayNumber} de 21`}
              </span>
            </div>
            
            <h2 className="text-xl md:text-2xl font-display font-medium text-slate-100">
              {currentDayInsight.title || "Sessão de Cura Integrada"}
            </h2>
            
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              {currentDayInsight.description || "Abra seu coração para receber o alinhamento de hoje."}
            </p>

            <div className="text-left text-xs text-slate-400 font-sans leading-relaxed space-y-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <p>
                <strong className="text-amber-200/90 font-medium">E não se esqueça:</strong> esse é um complemento do seu tratamento, vai ajudar a elucidar o que de alguma forma, você ainda não se permitiu deixar ir.
              </p>
              <p>
                A cada dia que fizer, anote as sensações e os sentimentos que vieram durante o tratamento; isso é muito importante para que eu saiba como você passou durante o processo.
              </p>
            </div>

            {/* CHECK-IN ANTES DO TRATAMENTO */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-left space-y-3.5 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-1.5">
                  <Activity size={13} />
                  <span>Check-in: Como você está se sentindo ANTES de iniciar?</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">Etapa Pré-Sessão</span>
              </div>

              {/* 1-5 Mood selector Before */}
              <div className="flex justify-between gap-1.5">
                {[
                  { r: 1, label: 'Pesado', emoji: '😣' },
                  { r: 2, label: 'Tenso', emoji: '😟' },
                  { r: 3, label: 'Neutro', emoji: '😐' },
                  { r: 4, label: 'Calmo', emoji: '🙂' },
                  { r: 5, label: 'Conectado', emoji: '✨' }
                ].map((item) => (
                  <button
                    key={item.r}
                    type="button"
                    onClick={() => setBeforeMood(item.r)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl border text-[10px] font-mono transition cursor-pointer ${
                      beforeMood === item.r
                        ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/30'
                        : 'bg-slate-900 border-slate-850 text-slate-500 hover:border-slate-800'
                    }`}
                  >
                    <span className="text-sm">{item.emoji}</span>
                    <span className="text-[9px] truncate">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Sensations tags Before */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase block">
                  Sensações presentes no seu corpo / mente agora:
                </label>
                <div className="flex flex-wrap gap-1">
                  {BEFORE_SENSATIONS.map((tag) => {
                    const isSel = beforeSensations.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleBeforeSensation(tag)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] border transition cursor-pointer ${
                          isSel
                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-semibold'
                            : 'bg-slate-900/60 border-slate-850 text-slate-400 hover:border-slate-800'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text note Before */}
              <div className="space-y-1">
                <textarea
                  rows={2}
                  value={beforeNotes}
                  onChange={(e) => setBeforeNotes(e.target.value)}
                  placeholder="Escreva brevemente o que você está sentindo ou pensando neste momento antes de iniciar..."
                  className="w-full bg-slate-900 border border-slate-850 focus:border-indigo-500/60 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-600 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 rounded-xl transition duration-200 text-xs cursor-pointer border-none"
              >
                Voltar
              </button>
              <button
                onClick={handleStartPractice}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/10 text-xs flex items-center justify-center gap-1 cursor-pointer border-none"
              >
                Iniciar Tratamento
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DECREE OF ACCEPTANCE PHASE */}
      {sessionPhase === 'decree' && (
        <div className="flex-1 flex items-center justify-center p-4 md:p-8" id="decree-screen">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06)_0,transparent_100%)] pointer-events-none" />
          
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mx-auto">
                <Shield size={20} className="animate-pulse" />
              </div>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block">ETAPA 01</span>
              <h3 className="text-lg font-display font-medium text-slate-100">
                Abertura e Decreto de Aceitação
              </h3>
            </div>

            {/* Scrolling decree text */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-sm leading-relaxed text-slate-300 font-sans shadow-inner max-h-72 overflow-y-auto italic text-center space-y-4">
              <p className="text-base text-slate-200 leading-relaxed font-serif">
                {journeyType === '7d' ? (
                  <>
                    "Eu, <span className="text-emerald-400 font-semibold underline underline-offset-4 decoration-emerald-500/40">{userName}</span>, aceito receber nesse momento com todo o meu coração, o Protocolo de Alinhamento e Cura Integrada de 7 Dias (Jornada dos 7 Chakras), conforme canalizado e aplicado por Éverton Rodrigo Piceni."
                  </>
                ) : (
                  <>
                    "Eu, <span className="text-indigo-400 font-semibold underline underline-offset-4 decoration-indigo-500/40">{userName}</span>, aceito receber nesse momento com todo o meu coração, o Protocolo de Cura Integrada de 21 dias, conforme canalizado e aplicado por Éverton Rodrigo Piceni."
                  </>
                )}
              </p>

              {customDecree && (
                <div className="pt-2 border-t border-slate-850 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block not-italic">
                    ✨ Decreto Personalizado da sua Anamnese
                  </span>
                  <p className="text-xs text-amber-200/90 leading-relaxed font-serif">
                    "{customDecree}"
                  </p>
                </div>
              )}

              <p className="text-xs text-slate-500 font-mono not-italic uppercase tracking-widest mt-3">
                (Silêncio absoluto para integração no éter)
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={toggleDecreeVoice}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-mono transition cursor-pointer ${
                    isDecreeVoicePlaying
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-indigo-500/50'
                  }`}
                  title="Ouvir a voz sagrada narrando o decreto de abertura"
                >
                  {isDecreeVoicePlaying ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  <span>{isDecreeVoicePlaying ? 'Pausar Áudio do Decreto' : 'Ouvir Decreto Guiado'}</span>
                </button>
              </div>

              <button
                onClick={handleAcceptDecree}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/15 text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer border-none"
                id="btn-decree-accept"
              >
                <CheckCircle2 size={16} />
                Eu Aceito e Decreto de Coração
              </button>
              <button
                onClick={() => {
                  audioEngine.stopSpeech();
                  setIsDecreeVoicePlaying(false);
                  setSessionPhase('intro');
                }}
                className="w-full bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-300 font-medium py-2.5 rounded-xl transition text-xs cursor-pointer border-none"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. GUIDED MEDITATION SLIDESHOW PHASE */}
      {sessionPhase === 'guided' && (
        <div className={`flex-1 flex flex-col md:flex-row bg-gradient-to-b ${activeStage.colorTheme.bg} transition-all duration-1000 ease-in-out`} id="guided-session-container">
          {/* Main Visual Arena (Left Column / Top row on Mobile) */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[40vh] md:min-h-0 relative">
            {/* Visual Glowing Backdrop */}
            <div
              className="absolute w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ease-in-out"
              style={{ backgroundColor: activeStage.colorTheme.glow }}
            />

            <div className="relative z-10 w-full max-w-md">
              {renderStageVisuals()}
            </div>
          </div>

          {/* Text & Narrative Arena (Right Column / Bottom row on Mobile) */}
          <div className="w-full md:w-[480px] bg-slate-950/85 backdrop-blur-md border-t md:border-t-0 md:border-l border-slate-800/80 p-6 md:p-8 flex flex-col justify-between" id="guided-narrative-panel">
            
            {/* Navigation Header */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
                  {UI_TRANSLATIONS[language]?.day || 'Etapa'} {activeStageIndex} {UI_TRANSLATIONS[language]?.dayOf || 'de'} {totalGuidedStages - 1}
                </span>
                <h4 className="text-base font-display font-medium text-slate-200 mt-1">
                  {displayTitle}
                </h4>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Language switch button in meditation header */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 gap-1">
                  <Globe size={13} className="text-indigo-400" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as AppLanguage)}
                    className="bg-transparent text-[11px] font-mono text-indigo-300 font-semibold cursor-pointer outline-none border-none pr-1 py-0.5"
                    title="Mudar idioma da meditação e da voz"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-slate-950 text-slate-200">
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={onClose}
                  className="text-xs text-slate-500 hover:text-slate-300 border border-slate-800 bg-slate-900/40 px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* Scrollable Subtitle and Main text segment */}
            <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1">
              <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full border tracking-wide inline-block ${activeStage.colorTheme.accent}`}>
                {displaySubtitle}
              </span>
              
              {/* Actual script text displayed in display serif/sans font for immersive reading */}
              <div className="text-slate-300 font-sans text-sm md:text-base leading-relaxed whitespace-pre-line select-none pr-1">
                {displayText.replace(/\[NOME\]/g, userName)}
              </div>
            </div>

            {/* Audio & Stage Control Dock */}
            <div className="pt-4 border-t border-slate-900 space-y-4" id="guided-controls-dock">
              {/* Progress visual bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>MEDITAÇÃO DO DIA</span>
                  <span>{Math.round((activeStageIndex / (totalGuidedStages - 1)) * 100)}% CONCLUÍDO</span>
                </div>
                <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${(activeStageIndex / (totalGuidedStages - 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Action controller buttons */}
              <div className="flex items-center justify-between gap-4">
                {/* Mute voice controller */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-xl border transition duration-150 cursor-pointer ${
                    isMuted
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                  title={isMuted ? "Ativar Áudio" : "Mutar Áudio"}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                {/* Main Play/Pause */}
                <button
                  onClick={togglePlayback}
                  className={`p-4 rounded-full flex items-center justify-center transition duration-200 shadow-xl cursor-pointer border-none ${
                    isPlaying
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/10'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10'
                  }`}
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>

                {/* Skip / Next Slide */}
                <button
                  onClick={skipStage}
                  className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-xl transition cursor-pointer"
                  title="Avançar Próxima Etapa"
                >
                  <SkipForward size={16} />
                </button>
              </div>

              {/* Ambient frequency & WhatsApp Support bar */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1 pt-1.5 border-t border-slate-900/40">
                <span className="flex items-center gap-1">
                  <span>Frequência</span>
                  {userPlan === 'pro' && <span className="text-amber-400 font-bold">👑 PRO</span>}
                </span>
                
                <div className="flex items-center gap-2">
                  <select
                    value={bgMusicType}
                    onChange={(e) => {
                      const selectedType = e.target.value as any;
                      if ((selectedType === '963hz' || selectedType === '741hz') && userPlan !== 'pro') {
                        if (onOpenProModal) onOpenProModal();
                        return;
                      }
                      if (onChangeBgMusic) {
                        onChangeBgMusic(selectedType);
                      }
                    }}
                    className="bg-slate-950 text-indigo-400 font-semibold uppercase cursor-pointer border border-slate-800 rounded-lg px-2 py-1 outline-none focus:border-indigo-500 text-[10px] font-mono"
                    title="Alterar frequência de fundo durante meditação"
                  >
                    <option value="396hz" className="bg-slate-950 text-slate-300">396Hz - Medo & Culpa</option>
                    <option value="528hz" className="bg-slate-950 text-slate-300">528Hz - Amor & Paz</option>
                    <option value="432hz" className="bg-slate-950 text-slate-300">432Hz - Cura Cósmica</option>
                    <option value="639hz" className="bg-slate-950 text-slate-300">639Hz - Relacionamentos</option>
                    <option value="963hz" className="bg-slate-950 text-amber-300">963Hz - Pineal Divina {userPlan !== 'pro' ? '🔒 (PRO)' : '👑'}</option>
                    <option value="741hz" className="bg-slate-950 text-amber-300">741Hz - Limpeza Celular {userPlan !== 'pro' ? '🔒 (PRO)' : '👑'}</option>
                    <option value="waves" className="bg-slate-950 text-slate-300">Brisa Oceânica Zen</option>
                    <option value="none" className="bg-slate-950 text-slate-300">Apenas Voz</option>
                  </select>

                  <a
                    href="https://wa.me/5551982215296?text=Ol%C3%A1%20%C3%89verton%2C%20estou%20na%20medita%C3%A7%C3%A3o%20guiada%20do%20Protocolo%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 px-2 py-1 rounded-lg text-[10px] font-sans font-medium transition cursor-pointer"
                    title="Fale Conosco"
                  >
                    <MessageCircle size={11} className="text-emerald-400" />
                    <span>Fale Conosco</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. MEDITATION COMPLETION AND JOURNALING PHASE */}
      {sessionPhase === 'complete' && (
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-y-auto" id="complete-screen">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0,transparent_75%)] pointer-events-none" />

          <div className="w-full max-w-xl bg-slate-900 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-5 relative overflow-hidden my-4">
            {/* Success Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={28} className="animate-bounce" />
              </div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">Tratamento Concluído</span>
              <h3 className="text-xl md:text-2xl font-display font-medium text-slate-100">
                Dia {dayNumber} Selado no seu DNA
              </h3>
            </div>

            {/* COMPARATIVE BEFORE VS AFTER SUMMARY CARD */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <TrendingUp size={13} />
                  <span>Transmutação Energética (Antes ➔ Depois)</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {afterMood >= beforeMood
                    ? `+${Math.round(((afterMood - beforeMood) / 4) * 100)}% Elevação`
                    : 'Processo de Catarse'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-slate-500 block">Antes do Tratamento:</span>
                  <div className="font-semibold text-slate-300 flex items-center gap-1">
                    <span>{beforeMood === 1 ? '😣 Pesado' : beforeMood === 2 ? '😟 Tenso' : beforeMood === 3 ? '😐 Neutro' : beforeMood === 4 ? '🙂 Calmo' : '✨ Conectado'}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({beforeMood}/5)</span>
                  </div>
                  {beforeNotes && (
                    <p className="text-[10px] text-slate-400 italic line-clamp-1">"{beforeNotes}"</p>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-emerald-400 block">Após o Tratamento:</span>
                  <div className="font-semibold text-emerald-300 flex items-center gap-1">
                    <span>{afterMood === 1 ? '😣 Pesado' : afterMood === 2 ? '😟 Inquieto' : afterMood === 3 ? '😐 Neutro' : afterMood === 4 ? '🙂 Calmo' : '✨ Em Paz / Pleno'}</span>
                    <span className="text-[10px] text-emerald-400/80 font-mono">({afterMood}/5)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400/70 font-mono block">Transmutado no Éter</span>
                </div>
              </div>
            </div>

            {/* Post-Treatment Mood Rating (1-5 scale) */}
            <div className="space-y-2 pt-1" id="mood-evaluation">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Como você se sente AGORA após o tratamento?
              </label>
              
              <div className="flex justify-between gap-1.5">
                {[
                  { r: 1, label: 'Pesado', emoji: '😣' },
                  { r: 2, label: 'Inquieto', emoji: '😟' },
                  { r: 3, label: 'Neutro', emoji: '😐' },
                  { r: 4, label: 'Calmo', emoji: '🙂' },
                  { r: 5, label: 'Em Paz', emoji: '✨' }
                ].map((item) => (
                  <button
                    key={item.r}
                    onClick={() => setAfterMood(item.r)}
                    type="button"
                    className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl border text-[10px] font-mono transition cursor-pointer ${
                      afterMood === item.r
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/30'
                        : 'bg-slate-950 border-slate-850 text-slate-500 hover:border-slate-800'
                    }`}
                  >
                    <span className="text-sm">{item.emoji}</span>
                    <span className="text-[9px] truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Post Sensations tags */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-emerald-400 uppercase block">
                  Reações do Corpo Físico (Múltipla Escolha):
                </label>
                <div className="flex flex-col gap-1.5">
                  {PHYSICAL_REACTIONS.map((tag) => {
                    const isSel = afterSensations.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleAfterSensation(tag)}
                        className={`px-3 py-2 rounded-lg text-xs text-left border transition cursor-pointer flex items-center justify-between ${
                          isSel
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                            : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800'
                        }`}
                      >
                        <span>{tag}</span>
                        {isSel && <CheckCircle2 size={14} className="text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-purple-400 uppercase block">
                  Reações do Campo Emocional (Múltipla Escolha):
                </label>
                <div className="flex flex-col gap-1.5">
                  {EMOTIONAL_REACTIONS.map((tag) => {
                    const isSel = afterSensations.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleAfterSensation(tag)}
                        className={`px-3 py-2 rounded-lg text-xs text-left border transition cursor-pointer flex items-center justify-between ${
                          isSel
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-semibold'
                            : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800'
                        }`}
                      >
                        <span>{tag}</span>
                        {isSel && <CheckCircle2 size={14} className="text-purple-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Daily Journal Form (After reflection) */}
            <div className="space-y-1.5 pt-2" id="daily-journal-form">
              <label htmlFor="journal-textarea" className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <PenTool size={12} className="text-indigo-400" />
                <span>Notas do Inconsciente: Que memórias, insights ou imagens vieram à sua mente durante a aplicação?</span>
              </label>
              <textarea
                id="journal-textarea"
                rows={3}
                value={afterNotes}
                onChange={(e) => setAfterNotes(e.target.value)}
                placeholder="Ex: Vi uma luz violeta, me senti flutuando, lembrei de algo..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200 placeholder-slate-700 leading-relaxed resize-none"
              />
            </div>

            {/* Final Save */}
            <div className="pt-2">
              <button
                onClick={handleSaveProgress}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium py-3.5 rounded-xl transition duration-200 shadow-lg shadow-emerald-600/20 text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer border-none"
                id="btn-save-session"
              >
                <Check size={16} />
                <span>Salvar Prática, Relato & Atualizar DNA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
