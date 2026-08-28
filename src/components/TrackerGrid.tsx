/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Flame, Award, Lock, CheckCircle2, Play, BookOpen, Clock, Heart, Bell, X, Sparkles, Smile, TrendingUp, Quote, Leaf, Volume2, Square, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DayProgress, DAILY_INSIGHTS, JOURNEY_7D_INSIGHTS, AnamnesisData, SpecificTreatment, JourneyType, AstralMapData } from '../types';
import { DailyReminderBanner } from './DailyReminderBanner';
import DailyTipCard from './DailyTipCard';
import MindfulnessAffirmationWidget from './MindfulnessAffirmationWidget';
import MoodEvolutionChart from './MoodEvolutionChart';
import { evaluateBestTreatmentFromAnamnesis } from '../lib/anamnesisTreatmentEngine';
import { audioEngine } from '../lib/audio';
import { Sun, Moon, Compass, Shield } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface TrackerGridProps {
  progress: DayProgress[];
  currentDay: number;
  streak: number;
  longestStreak: number;
  userName: string;
  userPlan?: 'free' | 'pro';
  subscriptionPlan?: string;
  anamnesis?: AnamnesisData;
  specificTreatments?: SpecificTreatment[];
  selectedJourney?: JourneyType;
  astralMap?: AstralMapData;
  onSelectJourney?: (journey: JourneyType) => void;
  onSelectDay: (dayNumber: number) => void;
  onStartSession: (dayNumber: number) => void;
  onOpenJournal: () => void;
  onOpenAnamnesis: () => void;
  onOpenAstralMap?: () => void;
  onOpenNumerology?: () => void;
  onOpenProModal?: () => void;
  onOpenSpecificTreatment?: () => void;
  onOpenChakrasGuide?: () => void;
  onOpenHerbalBaths?: () => void;
  onOpenPlansValuesGuide?: () => void;
  onOpenArchangelPrayer?: () => void;
  onOpenHooponopono?: () => void;
  onOpenCourses?: () => void;
  onOpenAudioSettings?: () => void;
  onOpenAdminPanel?: () => void;
  onOpenWelcome?: () => void;
  onOpenAchievements?: () => void;
  onOpenSystemicQuestions?: (day?: number) => void;
  onOpenDailyDiary?: (day?: number) => void;
  onOpenContact?: () => void;
  onOpenPromoVideo?: () => void;
}

export default function TrackerGrid({
  progress,
  currentDay,
  streak,
  longestStreak,
  userName,
  userPlan = 'free',
  subscriptionPlan,
  anamnesis,
  specificTreatments = [],
  selectedJourney = '21d',
  astralMap,
  onSelectJourney,
  onSelectDay,
  onStartSession,
  onOpenJournal,
  onOpenAnamnesis,
  onOpenAstralMap,
  onOpenNumerology,
  onOpenProModal,
  onOpenSpecificTreatment,
  onOpenChakrasGuide,
  onOpenHerbalBaths,
  onOpenPlansValuesGuide,
  onOpenArchangelPrayer,
  onOpenHooponopono,
  onOpenCourses,
  onOpenAudioSettings,
  onOpenAdminPanel,
  onOpenWelcome,
  onOpenAchievements,
  onOpenSystemicQuestions,
  onOpenDailyDiary,
  onOpenContact,
  onOpenPromoVideo
}: TrackerGridProps) {
  const activeJourney = selectedJourney || '21d';
  const totalDays = activeJourney === '7d' ? 7 : 21;
  const currentInsights = activeJourney === '7d' ? JOURNEY_7D_INSIGHTS : DAILY_INSIGHTS;

  const completedDaysCount = progress.filter(d => d.completed && d.dayNumber <= totalDays).length;
  const completionPercent = Math.round((completedDaysCount / totalDays) * 100);

  // Audio Player State for Anamnesis
  const [isPlayingTherapeuticVoice, setIsPlayingTherapeuticVoice] = useState(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const [selectedVoiceGender, setSelectedVoiceGender] = useState<'masculina' | 'feminina'>('masculina');

  useEffect(() => {
    return () => {
      audioEngine.stopSpeech();
    };
  }, []);

  const playTherapeuticVoice = async (text: string) => {
    if (isPlayingTherapeuticVoice) {
      stopTherapeuticVoice();
      return;
    }
    setIsLoadingVoice(true);
    try {
      if (selectedVoiceGender === 'masculina') {
        const isElevenLabsReady = await audioEngine.checkElevenLabsStatus();
        if (isElevenLabsReady.configured) {
          await audioEngine.speakWithElevenLabsOrFallback(
            text,
            1.0,
            () => { setIsLoadingVoice(false); setIsPlayingTherapeuticVoice(true); },
            () => setIsPlayingTherapeuticVoice(false),
            undefined,
            undefined,
            { voiceId: 'Marcus', userName }
          );
        } else {
          audioEngine.speak(text, 1.0, () => { setIsLoadingVoice(false); setIsPlayingTherapeuticVoice(true); }, () => setIsPlayingTherapeuticVoice(false), undefined, undefined, { lang: 'pt-BR', rate: 0.85, pitch: 0.9 });
        }
      } else {
        const voices = audioEngine.getAvailableVoices();
        const ptVoices = voices.filter(v => v.lang.includes('pt') || v.lang.includes('BR'));
        const femaleVoice = ptVoices.find(v => v.name.toLowerCase().includes('francisca') || v.name.toLowerCase().includes('luciana') || v.name.toLowerCase().includes('maria') || v.name.toLowerCase().includes('leticia') || v.name.toLowerCase().includes('vitoria') || v.name.toLowerCase().includes('helena')) || ptVoices[0];
        audioEngine.speak(
          text,
          1.0,
          () => { setIsLoadingVoice(false); setIsPlayingTherapeuticVoice(true); },
          () => setIsPlayingTherapeuticVoice(false),
          undefined,
          undefined,
          { lang: 'pt-BR', voiceId: femaleVoice?.id, rate: 0.9, pitch: 1.1 }
        );
      }
    } catch (err) {
      console.warn("Failed to play voice:", err);
      setIsLoadingVoice(false);
      setIsPlayingTherapeuticVoice(false);
    }
  };

  const stopTherapeuticVoice = () => {
    audioEngine.stopSpeech();
    setIsPlayingTherapeuticVoice(false);
    setIsLoadingVoice(false);
  };

  // Emotional progress calculations
  const completedDays = progress.filter(d => d.completed && d.mood !== undefined && d.dayNumber <= totalDays);
  const completedSessionsCount = completedDays.length;

  let averageMood = 0;
  if (completedSessionsCount > 0) {
    const sum = completedDays.reduce((acc, d) => acc + (d.mood || 0), 0);
    averageMood = sum / completedSessionsCount;
  }

  // Find dominant mood
  let dominantMoodLabel = 'Sem Registro';
  if (completedSessionsCount > 0) {
    const counts: Record<number, number> = {};
    completedDays.forEach(d => {
      if (d.mood !== undefined) {
        counts[d.mood] = (counts[d.mood] || 0) + 1;
      }
    });
    
    let maxCount = 0;
    let dominantMoodVal = 5;
    Object.entries(counts).forEach(([val, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantMoodVal = parseInt(val, 10);
      }
    });

    switch (dominantMoodVal) {
      case 5: dominantMoodLabel = "Em Paz 🌸"; break;
      case 4: dominantMoodLabel = "Calmo ☀️"; break;
      case 3: dominantMoodLabel = "Neutro 😐"; break;
      case 2: dominantMoodLabel = "Inquieto ⛈️"; break;
      case 1: dominantMoodLabel = "Pesado 🌧️"; break;
    }
  }

  // Map active days for the chart
  const chartData = Array.from({ length: totalDays }, (_, index) => {
    const dayNum = index + 1;
    const day = progress.find(d => d.dayNumber === dayNum) || { dayNumber: dayNum, completed: false };
    return {
      dayNumber: dayNum,
      mood: day.completed && day.mood ? day.mood : null,
      journalText: day.journalText || "",
      completed: day.completed,
      focusTitle: currentInsights[dayNum - 1]?.title || "Sessão de Alinhamento"
    };
  });

  // Helper to determine status of a day card
  const getDayStatus = (dayNum: number) => {
    const dayProgress = progress.find(d => d.dayNumber === dayNum);
    if (dayProgress?.completed) return 'completed';

    // Regra de Degustação / Cadastro:
    // 1 dia liberado para novos cadastros gratuitos (plan !== 'pro')
    // 7 dias liberados para quem tem cupom de degustação (subscriptionPlan === 'teste_vip_7d')
    // Após o limite, tranca até assinar o Plano PRO.
    const isPro = userPlan === 'pro' && subscriptionPlan !== 'teste_vip_7d';
    const isDegustacao = subscriptionPlan === 'teste_vip_7d';
    const maxAccessibleDay = isPro ? 21 : (isDegustacao ? 7 : 1);

    if (dayNum > maxAccessibleDay) {
      return 'trial_locked';
    }

    if (dayNum === currentDay) return 'ready';
    if (dayNum < currentDay) return 'missed'; // day is past but not completed
    return 'locked';
  };

  const handleDayCardClick = (dayNum: number, status: string) => {
    if (status === 'trial_locked') {
      if (onOpenProModal) {
        onOpenProModal();
      }
      return;
    }
    if (status !== 'locked') {
      onSelectDay(dayNum);
    }
  };

  const anamnesisRecommendation = anamnesis
    ? evaluateBestTreatmentFromAnamnesis(anamnesis)
    : null;

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col items-center justify-center space-y-6 sm:space-y-8" id="tracker-dashboard">

      {/* Welcome Hero Panel with Warmth, Persistence & Support */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 rounded-3xl p-5 sm:p-6 md:p-8 border border-indigo-500/30 shadow-2xl relative overflow-hidden space-y-6" id="tracker-hero">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.6)_0,transparent_100%)] pointer-events-none" />
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
          {/* Left Column: Greeting, Sacred Message & Persistence Callout */}
          <div className="lg:col-span-7 space-y-4 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-mono tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full uppercase font-semibold">
                {activeJourney === '7d' ? 'Jornada dos 7 Chakras • 7 Dias' : 'Protocolo de Cura Integrada • 21 Dias'}
              </span>
              <span className="text-xs font-mono tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center justify-center gap-1">
                <Sparkles size={11} className="text-emerald-400 shrink-0" />
                <span>Espaço Sagrado de Autocura</span>
              </span>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-display font-semibold text-slate-100 leading-tight">
                Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-amber-200">{userName}</span>!
              </h1>
              <p className="text-base md:text-lg text-emerald-300 font-medium font-serif italic mt-1 leading-snug">
                "Que bom que você se ouviu e veio se curar conosco."
              </p>
              {anamnesis && (
                <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
                  Seu diagnóstico energético foi acolhido na egrégora. Ouça abaixo o áudio com as orientações do seu campo vibracional e a justificativa terapêutica personalizada.
                </p>
              )}
            </div>

            {/* Persistence & Support Welcoming Callout OR Anamnesis Result Audio Player */}
            {anamnesis ? (
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-purple-950/40 border-2 border-indigo-500/60 shadow-2xl space-y-4 text-left">
                {/* Header + Voice Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-500/20 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shadow-inner shrink-0">
                      <Volume2 size={20} className={isPlayingTherapeuticVoice ? "animate-pulse text-indigo-400" : ""} />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-slate-100 flex items-center gap-2">
                        <span>Acolhimento Terapêutico</span>
                        <span className="text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full hidden sm:inline-block">
                          Voz IA
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Revelações do seu campo vibracional
                      </p>
                    </div>
                  </div>

                  {/* Voice Gender Switcher */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 self-start sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (isPlayingTherapeuticVoice) stopTherapeuticVoice();
                        setSelectedVoiceGender('masculina');
                      }}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition cursor-pointer flex items-center gap-1 ${
                        selectedVoiceGender === 'masculina'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>👨</span>
                      <span className="hidden sm:inline">Éverton</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (isPlayingTherapeuticVoice) stopTherapeuticVoice();
                        setSelectedVoiceGender('feminina');
                      }}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition cursor-pointer flex items-center gap-1 ${
                        selectedVoiceGender === 'feminina'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>👩</span>
                      <span className="hidden sm:inline">Suave</span>
                    </button>
                  </div>
                </div>

                {/* Player Controls */}
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  <div className="flex items-center gap-3 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        const textToSpeak = anamnesis.aiAnalysis?.justificativa_terapeutica || anamnesis.prescribedFocus || "Identificamos uma sobrecarga com necessidade de acolhimento e paz profunda.";
                        const fullGreetingSpeech = `Olá ${userName}. Seja muito bem-vindo ao seu diagnóstico personalizado. ${textToSpeak} ${anamnesis.customDecree ? `Seu decreto sagrado é: ${anamnesis.customDecree}` : ''}`;
                        playTherapeuticVoice(fullGreetingSpeech);
                      }}
                      disabled={isLoadingVoice}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-lg cursor-pointer shrink-0 ${
                        isPlayingTherapeuticVoice
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                      }`}
                      id="btn-play-diagnosis-audio-dashboard"
                    >
                      {isLoadingVoice ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : isPlayingTherapeuticVoice ? (
                        <Square size={18} className="fill-current" />
                      ) : (
                        <Play size={20} className="fill-current ml-0.5" />
                      )}
                    </button>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200 truncate">
                          {isLoadingVoice
                            ? "Sintetizando áudio..."
                            : isPlayingTherapeuticVoice
                            ? "Reproduzindo Acolhimento..."
                            : "Ouvir Diagnóstico Personalizado"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 sm:line-clamp-2 mt-0.5">
                        "{anamnesis.aiAnalysis?.justificativa_terapeutica || anamnesis.prescribedFocus}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/20 space-y-2.5 text-center sm:text-left">
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
                  Nesta jornada de {totalDays} dias <strong className="text-amber-300 font-semibold">dará vontade de desistir</strong>, mas seja persistente e vá até o fim conosco! Cada dia transmuta memórias celulares profundas e reconecta você à sua essência divina.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 pt-2 border-t border-slate-900">
                  <span className="text-xs text-slate-400 font-sans">
                    Caso precise desabafar, conversar ou pedir amparo:
                  </span>
                  {onOpenContact ? (
                    <button
                      type="button"
                      onClick={onOpenContact}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition cursor-pointer min-h-[38px] w-full sm:w-auto"
                    >
                      <Sparkles size={12} className="text-emerald-400 shrink-0" />
                      <span>Fale Conosco</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition cursor-pointer min-h-[38px] w-full sm:w-auto"
                    >
                      <Sparkles size={12} className="text-emerald-400 shrink-0" />
                      <span>Fale Conosco</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Aligned Quick Action Center */}
          <div className="lg:col-span-5 flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-2.5 w-full">
            <button
              type="button"
              onClick={() => onStartSession(currentDay)}
              className="w-full flex items-center justify-between gap-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold px-4 py-3 rounded-2xl transition duration-200 shadow-xl shadow-indigo-600/25 text-xs sm:text-sm cursor-pointer border border-indigo-400/30 sm:col-span-2 lg:col-span-1 min-h-[46px]"
              id="btn-start-today"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Play size={15} fill="currentColor" />
                </div>
                <span className="truncate">Iniciar Sessão do Dia {currentDay}</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-black/20 px-2 py-0.5 rounded-full shrink-0">Hoje</span>
            </button>

            <button
              type="button"
              onClick={onOpenJournal}
              className="w-full flex items-center justify-start gap-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 px-3.5 py-2.5 rounded-xl transition duration-200 text-xs cursor-pointer min-h-[42px]"
              id="btn-view-journals"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 text-indigo-400">
                <BookOpen size={14} />
              </div>
              <span className="truncate font-medium">Meu Diário de Bordo</span>
            </button>

            {onOpenAstralMap && (
              <button
                type="button"
                onClick={onOpenAstralMap}
                className="w-full flex items-center justify-start gap-2.5 bg-gradient-to-r from-purple-950/60 to-indigo-950/60 hover:from-purple-900/70 hover:to-indigo-900/70 text-purple-200 border border-purple-500/40 px-3.5 py-2.5 rounded-xl transition duration-200 text-xs font-semibold cursor-pointer shadow-md shadow-purple-950/30 min-h-[42px]"
                id="btn-open-astral-map"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-900/50 flex items-center justify-center shrink-0 text-amber-400">
                  <Compass size={14} />
                </div>
                <span className="truncate">Meu Mapa Astral & Energético ☀️</span>
              </button>
            )}

            {onOpenChakrasGuide && (
              <button
                type="button"
                onClick={onOpenChakrasGuide}
                className="w-full flex items-center justify-start gap-2.5 bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 px-3.5 py-2.5 rounded-xl transition duration-200 text-xs font-semibold cursor-pointer min-h-[42px]"
                id="btn-open-chakras-guide"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-900/50 flex items-center justify-center shrink-0 text-purple-400">
                  <Sparkles size={14} />
                </div>
                <span className="truncate">Guia dos 7 Chakras ✨</span>
              </button>
            )}

            {onOpenHerbalBaths && (
              <button
                type="button"
                onClick={onOpenHerbalBaths}
                className="w-full flex items-center justify-start gap-2.5 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 px-3.5 py-2.5 rounded-xl transition duration-200 text-xs font-semibold cursor-pointer min-h-[42px]"
                id="btn-open-herbal-baths"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-900/50 flex items-center justify-center shrink-0 text-emerald-400">
                  <Leaf size={14} />
                </div>
                <span className="truncate">Guia Sagrado de Banhos 🌿</span>
              </button>
            )}

            {onOpenPlansValuesGuide && (
              <button
                type="button"
                onClick={onOpenPlansValuesGuide}
                className="w-full flex items-center justify-start gap-2.5 bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-500/30 px-3.5 py-2.5 rounded-xl transition duration-200 text-xs font-semibold cursor-pointer min-h-[42px]"
                id="btn-open-plans-values"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-900/50 flex items-center justify-center shrink-0 text-amber-400">
                  <Award size={14} />
                </div>
                <span className="truncate">Ver Todos os Valores & Planos 👑</span>
              </button>
            )}

            {onOpenPromoVideo && (
              <button
                type="button"
                onClick={onOpenPromoVideo}
                className="w-full flex items-center justify-start gap-2.5 bg-gradient-to-r from-amber-500/20 via-indigo-950/40 to-purple-950/40 hover:from-amber-500/30 text-amber-200 border border-amber-500/40 px-3.5 py-2.5 rounded-xl transition duration-200 text-xs font-semibold cursor-pointer sm:col-span-2 lg:col-span-1 min-h-[42px] shadow-sm"
                id="btn-open-promo-video"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
                  <Play size={14} fill="currentColor" />
                </div>
                <span className="truncate">Vídeo Apresentação do App 🎬</span>
              </button>
            )}
          </div>
        </div>

        {/* Mini Stats Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-700/40" id="stats-panel">
          <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center shrink-0">
              <Flame size={18} fill="currentColor" />
            </div>
            <div className="truncate min-w-0">
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider truncate">Streak Atual</p>
              <p className="text-sm sm:text-base md:text-lg font-display font-bold text-slate-200 truncate">{streak} {streak === 1 ? 'Dia' : 'Dias'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center shrink-0">
              <Award size={18} />
            </div>
            <div className="truncate min-w-0">
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider truncate">Recorde</p>
              <p className="text-sm sm:text-base md:text-lg font-display font-bold text-slate-200 truncate">{longestStreak} {longestStreak === 1 ? 'Dia' : 'Dias'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div className="truncate min-w-0">
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider truncate">Concluído</p>
              <p className="text-sm sm:text-base md:text-lg font-display font-bold text-slate-200 truncate">{completedDaysCount} / {totalDays}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
              <Heart size={18} />
            </div>
            <div className="truncate min-w-0">
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider truncate">Progresso</p>
              <p className="text-sm sm:text-base md:text-lg font-display font-bold text-slate-200 truncate">{completionPercent}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Tip Complementar / Hábito Saudável Pós-Sessão */}
      <DailyTipCard
        currentDay={currentDay}
        userName={userName}
        isSessionCompleted={progress.some(p => p.dayNumber === currentDay && p.completed)}
        onOpenHerbalBaths={onOpenHerbalBaths}
      />

      {/* Anamnese Terapêutica / Diagnóstico Energético Card */}
      <div className={`p-5 rounded-3xl border transition shadow-lg ${
        anamnesis
          ? 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-500/30'
          : 'bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/40 border-indigo-500/40'
      }`} id="tracker-anamnesis-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`p-3 rounded-2xl shrink-0 ${
              anamnesis ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
            }`}>
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                  {anamnesis ? 'Diagnóstico & Prescrição Ativa' : 'Avaliação Inicial Recomendada'}
                </span>
                {anamnesis && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                    Ficha Ativa
                  </span>
                )}
                {anamnesisRecommendation && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30 font-bold hidden sm:inline">
                    ★ Tratamento Sugerido
                  </span>
                )}
              </div>
              <h3 className="text-sm md:text-base font-semibold text-slate-100">
                {anamnesisRecommendation
                  ? `${anamnesisRecommendation.treatmentTitle}`
                  : anamnesis
                  ? `Frequência Prescrita: ${anamnesis.recommendedFrequency.toUpperCase()} • ${anamnesis.primaryGoal}`
                  : 'Preencha sua Ficha de Anamnese Holística'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                {anamnesisRecommendation
                  ? `${anamnesisRecommendation.summaryDiagnosis} (Frequência: ${anamnesisRecommendation.recommendedFrequency.toUpperCase()} • ${anamnesisRecommendation.primaryChakraFocus})`
                  : anamnesis
                  ? anamnesis.prescribedFocus
                  : 'Mapeie suas queixas, nível de estresse e bloqueios para receber a prescrição de frequência e a indicação do melhor tratamento para você.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={onOpenAnamnesis}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                anamnesis
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
              }`}
            >
              <span>{anamnesis ? 'Ver Ficha & Tratamento Sugerido' : 'Preencher Anamnese'}</span>
              <Sparkles size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Card Especial de Mapa Astral & Energético Quântico (Presente de Boas-Vindas) */}
      <div className="p-5 rounded-3xl border bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border-purple-500/35 shadow-lg relative overflow-hidden" id="tracker-astral-map-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl shrink-0 bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-md shadow-purple-500/10 flex items-center justify-center">
              <Compass size={22} className="text-amber-400 shrink-0" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 font-bold flex items-center gap-1">
                  <Sparkles size={11} className="text-amber-400" />
                  <span>Mapa Astral & Energético (Presente para Você)</span>
                </span>
                {astralMap && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-400/40">
                    Sol em {astralMap.sunSign} {astralMap.sunSignSymbol}
                  </span>
                )}
                {astralMap && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
                    Ascendente em {astralMap.ascendantSign}
                  </span>
                )}
              </div>
              <h3 className="text-sm md:text-base font-semibold text-slate-100 mt-1">
                {astralMap
                  ? `Seu Alinhamento Cósmico: Sol em ${astralMap.sunSign} • Elemento ${astralMap.dominantElement}`
                  : 'Seu Mapa Astral & Equilíbrio dos 4 Elementos'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xl leading-relaxed">
                {astralMap
                  ? `Frequência Sagrada sugerida: ${astralMap.suggestedFrequency} • Chakra: ${astralMap.sunSignChakra}. Veja o direcionamento espiritual e seu mantra de poder.`
                  : 'Calculado automaticamente com base na sua data de nascimento. Descubra seu signo solar, ascendente, signo lunar, equilíbrio dos 4 elementos e frequências de ressonância.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAstralMap}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/20"
            id="btn-card-open-astral-map"
          >
            <span>Ver Meu Mapa Astral</span>
            <Compass size={14} className="shrink-0" />
          </button>
        </div>
      </div>

      {/* Card de Tratamento Específico (7 Dias / 21 Dias por R$ 59,90) */}
      <div className="p-5 rounded-3xl border bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/30 border-emerald-500/40 shadow-lg relative overflow-hidden" id="tracker-specific-treatment-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl shrink-0 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-500/10 flex items-center justify-center">
              <Heart size={20} className="text-emerald-400 shrink-0" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Atendimento & Canalização Individualizada
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-400/40">
                  21 Dias (R$ 59,90)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                  7 Dias (R$ 59,90)
                </span>
                {specificTreatments.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
                    {specificTreatments.length} Ativo(s)
                  </span>
                )}
              </div>
              <h3 className="text-sm md:text-base font-semibold text-slate-100 mt-1">
                Deseja um Tratamento Específico para o seu caso?
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                Relate sua dor física crônica, queixa emocional, bloqueio de prosperidade ou situação pontual para receber direcionamento vibracional de 7 ou 21 dias com Éverton Rodrigo Piceni.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSpecificTreatment}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20"
          >
            <span>{specificTreatments.length > 0 ? 'Ver / Solicitar Tratamento' : 'Solicitar Tratamento (7d ou 21d)'}</span>
            <Sparkles size={13} className="shrink-0" />
          </button>
        </div>
      </div>

      {/* Cards de Numerologia & Banhos de Ervas Sagrados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="tracker-numerology-baths-grid">
        {/* Card Numerologia */}
        <div className="p-5 rounded-3xl border bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/30 border-indigo-500/40 shadow-lg flex flex-col justify-between space-y-4" id="card-numerology-promo">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles size={11} className="text-amber-400" />
                <span>Básica Gratuita • Completa R$ 90,00</span>
              </span>
              <span className="text-xs font-mono text-indigo-300 font-bold">1 a 9 • 11 • 22</span>
            </div>

            <h3 className="text-sm md:text-base font-display font-medium text-slate-100 flex items-center gap-2">
              <span>Numerologia da Alma, Destino & Ano Pessoal</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Mapeie seus números sagrados através do método Pitagórico e Cabalístico. Descubra sua <strong>Alma (Desejo Íntimo)</strong>, <strong>Destino (Missão Maior)</strong>, <strong>Expressão</strong> e as vibrações do seu ciclo anual.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenNumerology}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer border-none shadow-md shadow-indigo-600/20"
            id="btn-open-numerology-card"
          >
            <span>Ver Minha Numerologia (Básica / Completa)</span>
            <Sparkles size={13} />
          </button>
        </div>

        {/* Card Banhos de Ervas */}
        <div className="p-5 rounded-3xl border bg-gradient-to-br from-emerald-950/40 via-slate-900 to-teal-950/30 border-emerald-500/40 shadow-lg flex flex-col justify-between space-y-4" id="card-herbal-baths-promo">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Leaf size={11} className="text-emerald-400" />
                <span>Biblioteca Sagrada Expandida</span>
              </span>
              <span className="text-[10px] font-mono text-amber-300 font-bold">🌿 Boldo • 7 Ervas • Rosas</span>
            </div>

            <h3 className="text-sm md:text-base font-display font-medium text-slate-100">
              Banhos de Ervas & Purificação Áurica
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Guia completo de ervas sagradas com receitas, modo de preparo e orações. <em>Lembre-se da regra sagrada: nenhum banho deve ser tomado da cabeça aos pés, a não ser o de boldo.</em>
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenHerbalBaths}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer border-none shadow-md shadow-emerald-600/20"
            id="btn-open-herbal-baths-card"
          >
            <span>Acessar Biblioteca de Banhos</span>
            <Leaf size={13} />
          </button>
        </div>
      </div>


      <DailyReminderBanner
        currentDay={currentDay}
        progress={progress}
        userName={userName}
        streak={streak}
        onStartSession={onStartSession}
      />

      {/* Dica de Mindfulness ou Afirmação Positiva Aleatória do Dia */}
      <MindfulnessAffirmationWidget
        userName={userName}
        onOpenMeditation={() => onStartSession(currentDay)}
      />

      {/* Journey Switcher (7 Dias Chakras vs 21 Dias Transmutação) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 p-3.5 sm:p-4 bg-slate-900/80 border border-slate-800 rounded-3xl shadow-lg" id="journey-switcher-container">
        <div className="flex items-center gap-3 px-1 text-center sm:text-left">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-amber-400" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider block">
              Selecione sua Jornada:
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Escolha entre o alinhamento dos centros de energia ou o ciclo de transmutação
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center justify-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onSelectJourney?.('7d')}
            className={`px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer min-h-[44px] ${
              activeJourney === '7d'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 border border-emerald-400/40'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
            id="btn-switch-journey-7d"
          >
            <span className="truncate">✨ 7 Dias (Chakras)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30 text-emerald-200 shrink-0">R$ 15</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectJourney?.('21d')}
            className={`px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer min-h-[44px] ${
              activeJourney === '21d'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25 border border-indigo-400/40'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
            id="btn-switch-journey-21d"
          >
            <span className="truncate">⚡ 21 Dias</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30 text-indigo-200 shrink-0">Completa</span>
          </button>
        </div>
      </div>

      {/* Grid com Oração de São Miguel (Gratuito), Ho'oponopono (Gratuito) & Cursos Energéticos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="tracker-spiritual-offerings-grid">
        {/* Card Oração do Arcanjo Miguel */}
        <div className="p-5 rounded-3xl border bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/30 border-blue-500/40 shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
                100% Gratuito
              </span>
              <Sparkles size={14} className="text-amber-400" />
            </div>

            <h3 className="text-sm md:text-base font-display font-medium text-slate-100">
              Oração do Arcanjo Miguel
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Poderoso decreto de 21 dias para corte de laços, quebra de contratos espirituais e proteção cósmica na Chama Azul.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenArchangelPrayer}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer border-none shadow-md shadow-blue-600/20"
          >
            <span>Fazer Oração do Arcanjo</span>
            <Sparkles size={13} />
          </button>
        </div>

        {/* Card Oração do Ho'oponopono */}
        <div className="p-5 rounded-3xl border bg-gradient-to-br from-teal-950/40 via-slate-900 to-emerald-950/30 border-teal-500/40 shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold bg-teal-500/10 border border-teal-500/30 px-2.5 py-0.5 rounded-full">
                100% Gratuito
              </span>
              <Heart size={14} className="text-teal-400" />
            </div>

            <h3 className="text-sm md:text-base font-display font-medium text-slate-100">
              Oração Sagrada Ho'oponopono
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Limpeza de memórias ancestrais, auto-perdão e paz profunda. Inclui Japamala interativo de 108 repetições e áudio narrado.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenHooponopono}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer border-none shadow-md shadow-teal-600/20"
          >
            <span>Fazer Ho'oponopono (108x)</span>
            <Heart size={13} />
          </button>
        </div>

        {/* Card Cursos & Formações Energéticas */}
        <div className="p-5 rounded-3xl border bg-gradient-to-br from-purple-950/40 via-slate-900 to-amber-950/30 border-purple-500/40 shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                🔒 Inscrições Fechadas
              </span>
              <Award size={14} className="text-purple-400" />
            </div>

            <h3 className="text-sm md:text-base font-display font-medium text-slate-100">
              Cursos & Sabedorias Energéticas
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Formações em Mesa Radiônica, Apometria Quântica e Radiestesia Terapêutica por Éverton Piceni. Turmas em preparação.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCourses}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-slate-700 shadow-md"
          >
            <span>Ver Cursos (Lista de Espera)</span>
            <Award size={13} />
          </button>
        </div>
      </div>

      {/* Trio Terapêutico Essencial: Conquistas / Perguntas Sistêmicas / Diário & Expectativas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="therapeutic-trio-grid">
        {/* 1. Emblemas & Conquistas */}
        <div className="p-5 rounded-3xl border bg-gradient-to-br from-amber-950/30 via-slate-900 to-amber-950/10 border-amber-500/35 shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Award size={11} className="text-amber-400" />
                <span>Emblemas de Evolução</span>
              </span>
              <Sparkles size={14} className="text-amber-400" />
            </div>

            <h3 className="text-sm md:text-base font-display font-medium text-slate-100">
              Conquistas & Emblemas
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Desbloqueie títulos sagrados como <strong>"Meditador Constante"</strong> (7 dias seguidos), <strong>"Mestre da Frequência"</strong> (21 dias) e honre sua jornada.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAchievements}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-amber-500/15"
          >
            <span>Ver Meus Emblemas</span>
            <Award size={13} />
          </button>
        </div>

        {/* 2. Perguntas Sistêmicas do Dia */}
        <div className="p-5 rounded-3xl border bg-gradient-to-br from-emerald-950/30 via-slate-900 to-teal-950/20 border-emerald-500/35 shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Heart size={11} className="text-emerald-400" />
                <span>Ordens do Amor</span>
              </span>
              <BookOpen size={14} className="text-emerald-400" />
            </div>

            <h3 className="text-sm md:text-base font-display font-medium text-slate-100">
              Perguntas Sistêmicas
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Reflexão sistêmica diária com frases de cura de Bert Hellinger e espaço exclusivo para você registrar suas respostas e percepções.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenSystemicQuestions ? onOpenSystemicQuestions(currentDay) : undefined}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <span>Responder Pergunta do Dia {currentDay}</span>
            <Heart size={13} />
          </button>
        </div>

        {/* 3. Diário Dia a Dia & O que se Espera do Tratamento */}
        <div className="p-5 rounded-3xl border bg-gradient-to-br from-indigo-950/30 via-slate-900 to-purple-950/20 border-indigo-500/35 shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Clock size={11} className="text-indigo-400" />
                <span>Diário Quântico</span>
              </span>
              <Sparkles size={14} className="text-indigo-400" />
            </div>

            <h3 className="text-sm md:text-base font-display font-medium text-slate-100">
              Diário & Expectativas de Cura
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Defina o que você espera alcançar com o tratamento de 21 dias e registre seus insights, sensações corporais e transformações diárias.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenDailyDiary ? onOpenDailyDiary(currentDay) : undefined}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-indigo-600/20"
          >
            <span>Abrir Diário Dia a Dia</span>
            <BookOpen size={13} />
          </button>
        </div>
      </div>

      {/* Seção de Progresso Emocional com Recharts */}
      <MoodEvolutionChart
        progress={progress}
        journeyType={activeJourney}
        onOpenMeditation={onStartSession}
      />

      {/* Card da Frase Motivacional do Dia */}
      {(() => {
        const todayInsight = currentInsights[Math.max(0, Math.min(currentInsights.length - 1, currentDay - 1))];
        return (
          <div className="p-5 rounded-3xl border bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border-indigo-500/30 shadow-lg relative overflow-hidden" id="tracker-daily-quote-card">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 rounded-2xl shrink-0 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-md shadow-indigo-500/10">
                <Quote size={20} className="text-indigo-400 shrink-0" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold flex items-center gap-1">
                    <Sparkles size={11} className="shrink-0" />
                    Frase Motivacional • {activeJourney === '7d' ? 'Chakra' : 'Dia'} {currentDay.toString().padStart(2, '0')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-mono border border-indigo-500/20">
                    {todayInsight?.title || 'Harmonia & Paz'}
                  </span>
                </div>
                <p className="text-sm md:text-base text-slate-100 italic font-serif leading-relaxed">
                  "{todayInsight?.quote || 'O silêncio interior é a porta de entrada para a autocura.'}"
                </p>
                <p className="text-xs text-indigo-300/80 font-mono font-medium pt-0.5">
                  — {todayInsight?.quoteAuthor || 'Éverton Rodrigo Piceni'}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

            {/* Grid Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3" id="grid-header-section">
        <h2 className="text-lg font-display font-medium text-slate-300 flex items-center gap-2">
          <Calendar size={18} className="text-indigo-400 shrink-0" />
          <span>{activeJourney === '7d' ? 'Alinhamento dos 7 Chakras' : 'Calendário de Alinhamento (21 Dias)'}</span>
        </h2>
        <span className="text-xs text-slate-500 font-mono hidden sm:inline">
          SELECIONE UM DIA PARA VER DETALHES
        </span>
      </div>

      {/* Days Grid (7 or 21 days) */}
      <div className="space-y-8" id="calendar-days-grid">
        {(() => {
                    const renderCycle = (startDay: number, endDay: number, title: string, description: string, energeticGoal: string, icon: React.ReactNode, bgClass: string, borderClass: string) => (
            <div className="space-y-4 mb-6">
              {/* Transition / Cycle Intro Card */}
              <div className={`p-4 rounded-2xl border ${bgClass.replace('20', '10')} ${borderClass} relative overflow-hidden group`}>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl ${bgClass}`}>
                      {icon}
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-slate-200">{title}</h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 mb-3 leading-relaxed max-w-2xl">
                    {description}
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/50 border border-slate-700/50 text-[10px] sm:text-[11px] font-medium text-slate-300">
                    <Compass size={12} className="text-slate-400" />
                    <span>Objetivo: {energeticGoal}</span>
                  </div>
                </div>
              </div>

              {/* Days Grid */}
              <div className={`grid gap-3 grid-cols-2 sm:grid-cols-4 md:grid-cols-7`}>
                {Array.from({ length: endDay - startDay + 1 }, (_, index) => {
                  const dayNum = startDay + index;
                  const status = getDayStatus(dayNum);
                  const insight = currentInsights[dayNum - 1];

                  let cardClass = "";
                  let iconElement = null;

                  if (status === 'completed') {
                    cardClass = "bg-emerald-950/15 border-emerald-500/30 hover:border-emerald-500/50 text-slate-300";
                    iconElement = <CheckCircle2 size={16} className="text-emerald-400" />;
                  } else if (status === 'ready') {
                    cardClass = "bg-indigo-950/40 border-indigo-500/50 hover:border-indigo-500 text-slate-100 ring-1 ring-indigo-500/30 animate-pulse-slow";
                    iconElement = <Play size={12} fill="currentColor" className="text-indigo-400" />;
                  } else if (status === 'missed') {
                    cardClass = "bg-slate-900/40 border-slate-700 hover:border-indigo-500/40 text-slate-400";
                    iconElement = <Clock size={16} className="text-amber-500/60" />;
                  } else if (status === 'trial_locked') {
                    cardClass = "bg-slate-950/80 border-amber-500/20 text-slate-500 hover:border-amber-500/40 hover:text-slate-300";
                    iconElement = <Lock size={14} className="text-amber-400/80" />;
                  } else {
                    cardClass = "bg-slate-950/40 border-slate-800/80 text-slate-600 cursor-not-allowed opacity-60";
                    iconElement = <Lock size={14} className="text-slate-700" />;
                  }

                  return (
                    <div
                      key={dayNum}
                      id={`day-card-${dayNum}`}
                      onClick={() => handleDayCardClick(dayNum, status)}
                      className={`p-3 rounded-2xl border flex flex-col justify-between min-h-[110px] transition-all duration-300 relative overflow-hidden group ${
                        status !== 'locked' ? 'cursor-pointer hover:-translate-y-0.5' : ''
                      } ${cardClass}`}
                    >
                      {/* Day Number badge */}
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-[11px] font-semibold">
                          {activeJourney === '7d' ? `CHAKRA ${dayNum}` : `DIA ${dayNum.toString().padStart(2, '0')}`}
                        </span>
                        {iconElement}
                      </div>

                      {/* Day focus insight title */}
                      <div className="mt-2">
                        <p className="text-[10px] sm:text-[11px] font-sans font-medium line-clamp-2 leading-snug group-hover:text-slate-200">
                          {insight?.title || `Sessão de Alinhamento`}
                        </p>
                      </div>

                      {/* Status micro label */}
                      <div className="mt-2 flex items-center justify-between text-[9px] font-mono tracking-wider opacity-60 uppercase">
                        <span className="truncate">
                          {status === 'completed' && "Concluído"}
                          {status === 'ready' && "Disponível"}
                          {status === 'missed' && "Pendente"}
                          {status === 'trial_locked' && "Bloqueio PRO"}
                          {status === 'locked' && "Bloqueado"}
                        </span>
                        {status === 'ready' && (
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping shrink-0" />
                        )}
                        {status === 'trial_locked' && (
                          <span className="text-amber-400 text-[9px] font-bold shrink-0 ml-1">Abrir</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );

                    if (activeJourney === '21d') {
            return (
              <>
                {renderCycle(1, 7, "Ciclo 1: Proteção & Limpeza (São Miguel)", "Nesta fase inicial, o foco é a remoção de amarras, proteção espiritual e limpeza de energias densas, preparando seu campo para a cura profunda.", "Limpeza Profunda e Aterramento", <Shield size={16} className="text-indigo-400" />, "bg-indigo-500/20", "border-indigo-500/20")}
                {renderCycle(8, 14, "Ciclo 2: Transmutação de Padrões (Chama Violeta)", "Aprofundamento na queima kármica, liberando traumas do passado, perdoando feridas profundas e ressignificando crenças limitantes.", "Liberação Emocional e Perdão", <Flame size={16} className="text-violet-400" />, "bg-violet-500/20", "border-violet-500/20")}
                {renderCycle(15, 21, "Ciclo 3: Regeneração & Cura (São Rafael)", "O último ciclo atua na regeneração do seu DNA cósmico, selando o tratamento com frequências de saúde perfeita, paz e harmonia.", "Integração Celular e Saúde", <Sparkles size={16} className="text-emerald-400" />, "bg-emerald-500/20", "border-emerald-500/20")}
              </>
            );
          } else {
            return renderCycle(1, 7, "Alinhamento dos 7 Chakras", "Uma jornada intensiva de 7 dias focada na ativação, purificação e alinhamento sequencial dos seus centros magnéticos de energia.", "Equilíbrio Energético", <Sun size={16} className="text-amber-400" />, "bg-amber-500/20", "border-amber-500/20");
          }
        })()}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (data.mood === null || data.mood === undefined) return null;
    
    const getMoodName = (val: number) => {
      switch (val) {
        case 5: return "Completamente em Paz 🌸";
        case 4: return "Calmo e Centrado ☀️";
        case 3: return "Neutro / Equilibrado 😐";
        case 2: return "Inquieto / Agitado ⛈️";
        case 1: return "Pesado / Desafiador 🌧️";
        default: return "";
      }
    };

    return (
      <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl shadow-2xl max-w-xs space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="text-xs font-mono text-indigo-400 font-semibold uppercase">Dia {data.dayNumber}</span>
          <span className="text-xs font-mono text-slate-500">{data.completed ? 'Concluído' : 'Pendente'}</span>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-display font-medium text-slate-200">{data.focusTitle}</p>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-400 font-sans">Estado:</span>
            <span className="text-slate-200 font-medium font-sans">{getMoodName(data.mood)}</span>
          </div>
        </div>
        {data.journalText && (
          <div className="pt-1.5 border-t border-slate-900">
            <span className="text-[9px] font-mono text-slate-500 uppercase block">Nota do Diário:</span>
            <p className="text-[10px] text-slate-400 italic line-clamp-2 leading-relaxed font-sans">
              "{data.journalText}"
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

