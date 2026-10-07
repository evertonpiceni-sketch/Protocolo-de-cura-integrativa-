/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GitBranch, Sparkles, Check, Heart, X, ChevronLeft, ChevronRight,
  BookOpen, Volume2, VolumeX, Share2, Copy, CheckCircle2, Shield, Calendar, Award, Download
} from 'lucide-react';
import { DayProgress, UserProfile, SystemicQuestionItem } from '../types';
import { SYSTEMIC_QUESTIONS_21D } from '../lib/systemicData';
import { audioEngine } from '../lib/audio';

interface SystemicQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: number;
  progress: DayProgress[];
  userProfile?: UserProfile;
  userName?: string;
  onSaveAnswer: (dayNumber: number, answerText: string) => void;
}

export default function SystemicQuestionsModal({
  isOpen,
  onClose,
  currentDay,
  progress,
  userProfile,
  onSaveAnswer
}: SystemicQuestionsModalProps) {
  const [activeDay, setActiveDay] = useState<number>(Math.min(Math.max(currentDay || 1, 1), 21));
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [isSavedRecently, setIsSavedRecently] = useState<boolean>(false);
  const [isReadingVoice, setIsReadingVoice] = useState<boolean>(false);
  const [copiedSentence, setCopiedSentence] = useState<boolean>(false);
  const [is639HzActive, setIs639HzActive] = useState<boolean>(true);

  // 639 Hz Solfeggio frequency: melhora a compreensão, tolerância e relações interpessoais enquanto o usuário responde
  useEffect(() => {
    if (!isOpen) return;

    if (is639HzActive) {
      audioEngine.unlock();
      audioEngine.setBGVolume(0.38);
      audioEngine.startBG('639hz');
    } else {
      if (audioEngine.getCurrentSynthType() === '639hz') {
        audioEngine.stopBG();
      }
    }

    return () => {
      if (audioEngine.getCurrentSynthType() === '639hz') {
        audioEngine.stopBG();
        if (userProfile?.audioEnabled && userProfile?.bgMusicType && userProfile?.bgMusicType !== 'none' && userProfile?.bgMusicType !== '639hz') {
          audioEngine.startBG(userProfile.bgMusicType);
        }
      }
    };
  }, [isOpen, is639HzActive, userProfile?.audioEnabled, userProfile?.bgMusicType]);

  const handleToggle639 = () => {
    if (is639HzActive) {
      audioEngine.stopBG();
      setIs639HzActive(false);
    } else {
      audioEngine.unlock();
      audioEngine.setBGVolume(0.38);
      audioEngine.startBG('639hz');
      setIs639HzActive(true);
    }
  };

  const handleCloseModal = () => {
    if (audioEngine.getCurrentSynthType() === '639hz') {
      audioEngine.stopBG();
      if (userProfile?.audioEnabled && userProfile?.bgMusicType && userProfile?.bgMusicType !== 'none' && userProfile?.bgMusicType !== '639hz') {
        audioEngine.startBG(userProfile.bgMusicType);
      }
    }
    onClose();
  };

  // Sync answer when activeDay changes
  useEffect(() => {
    const dayProgress = progress.find(p => p.dayNumber === activeDay);
    setCurrentAnswer(dayProgress?.systemicAnswer || '');
    setIsSavedRecently(false);
  }, [activeDay, progress]);

  if (!isOpen) return null;

  const currentQuestionItem: SystemicQuestionItem = SYSTEMIC_QUESTIONS_21D[activeDay - 1] || SYSTEMIC_QUESTIONS_21D[0];
  const dayProgress = progress.find(p => p.dayNumber === activeDay);
  const totalAnsweredCount = progress.filter(p => p.systemicAnswer && p.systemicAnswer.trim().length > 0).length;

  const handleSave = () => {
    onSaveAnswer(activeDay, currentAnswer.trim());
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 3000);
  };

  const handleReadVoice = () => {
    setIsReadingVoice(true);
    const speechText = `Pergunta Sistêmica do Dia ${activeDay}: ${currentQuestionItem.theme}. ` +
      `${currentQuestionItem.question} ` +
      `Reflexão guiada: ${currentQuestionItem.guidedReflection} ` +
      `Frase de integração: ${currentQuestionItem.healingSentence}`;

    audioEngine.previewVoice({
      text: speechText,
      voiceId: userProfile?.voiceId,
      rate: userProfile?.voiceRate ?? 0.82,
      pitch: userProfile?.voicePitch ?? 1.0,
      onEnd: () => setIsReadingVoice(false)
    });

    setTimeout(() => setIsReadingVoice(false), 12000);
  };

  const handleCopySentence = async () => {
    try {
      await navigator.clipboard.writeText(currentQuestionItem.healingSentence);
      setCopiedSentence(true);
      setTimeout(() => setCopiedSentence(false), 3000);
    } catch (error) {
      console.warn('Não foi possível copiar a frase automaticamente.', error);
      setCopiedSentence(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#2A2420]/30 backdrop-blur-md overflow-y-auto overscroll-contain" id="systemic-questions-modal" role="dialog" aria-modal="true" aria-label="Reflexões sistêmicas">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-[#FBF8F2] border border-[#B88736]/30 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl relative overflow-hidden my-1 sm:my-4 max-h-[calc(100dvh-1rem)] sm:max-h-[92dvh] flex flex-col"
      >
        {/* Glow backdrop effects */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#B88736]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#B88736]/6 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={handleCloseModal}
          aria-label="Fechar reflexões sistêmicas"
          className="absolute top-4 right-4 w-11 h-11 rounded-full bg-[#F5EFE4]/90 border border-[#E5DAC6] text-[#5C5248] hover:text-[#2A2420] flex items-center justify-center transition cursor-pointer z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="shrink-0 space-y-3 pb-4 border-b border-[#E5DAC6]">
          <div className="text-center space-y-1 pr-8 pl-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B88736]/10 border border-[#B88736]/30 text-[#B88736] text-xs font-mono font-medium">
              <GitBranch size={14} className="text-[#B88736]" />
              <span>REFLEXÕES SISTÊMICAS & ANCESTRALIDADE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-[#2A2420]">
              Perguntas Sistêmicas do Dia
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5248] max-w-xl mx-auto">
              Perguntas de reflexão para observar vínculos, histórias familiares e padrões percebidos com mais consciência e gentileza.
            </p>
          </div>

          {/* 639 Hz Frequency Banner: Melhora a compreensão, tolerância e relações interpessoais */}
          <div className="p-3 rounded-2xl bg-[#F5EFE4] border border-[#E5DAC6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl bg-[#B88736]/10 border border-[#B88736]/25 flex items-center justify-center text-[#B88736] shrink-0">
                <Heart size={16} className={is639HzActive ? 'scale-105 text-[#B88736]' : 'opacity-60'} />
                {is639HzActive && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#5C5248]">Frequência Solfeggio 639 Hz</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white border border-[#E5DAC6] text-[#8F631E] font-mono">Chakra Cardíaco</span>
                </div>
                <p className="text-[11px] text-[#5C5248] leading-snug">
                  A frequência pode acompanhar este momento como trilha de apoio enquanto você reflete e responde.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggle639}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border shrink-0 self-end sm:self-center ${
                is639HzActive
                  ? 'bg-[#B88736] border-[#B88736] text-white hover:bg-[#8F631E]'
                  : 'bg-[#F5EFE4] border-[#E5DAC6] text-[#5C5248] hover:text-[#2A2420]'
              }`}
            >
              {is639HzActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
              <span>{is639HzActive ? '639 Hz ligado' : 'Ativar 639 Hz'}</span>
            </button>
          </div>

          {/* Days selector bar */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              aria-label="Reflexão do dia anterior"
              onClick={() => setActiveDay(prev => Math.max(prev - 1, 1))}
              disabled={activeDay === 1}
              className="w-11 h-11 rounded-xl bg-white border border-[#E5DAC6] text-[#5C5248] hover:text-[#2A2420] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer shrink-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1">
              {Array.from({ length: 21 }, (_, i) => i + 1).map((dNum) => {
                const isSelected = activeDay === dNum;
                const hasAnswer = Boolean(progress.find(p => p.dayNumber === dNum)?.systemicAnswer);
                const isCurrent = currentDay === dNum;

                return (
                  <button
                    key={dNum}
                    onClick={() => setActiveDay(dNum)}
                    aria-label={`Abrir dia ${dNum}${hasAnswer ? ', respondido' : ''}`}
                    className={`w-10 h-10 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center relative shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35 ${
                      isSelected
                        ? 'bg-[#B88736] text-white ring-2 ring-[#B88736]/20 shadow-sm'
                        : hasAnswer
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                        : isCurrent
                        ? 'bg-amber-50 border border-amber-200 text-amber-700'
                        : 'bg-white border border-[#E5DAC6] text-[#5C5248] hover:border-[#E5DAC6] hover:text-[#2A2420]'
                    }`}
                    title={`Dia ${dNum} ${hasAnswer ? '(Respondido)' : ''}`}
                  >
                    {dNum}
                    {hasAnswer && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              aria-label="Reflexão do próximo dia"
              onClick={() => setActiveDay(prev => Math.min(prev + 1, 21))}
              disabled={activeDay === 21}
              className="w-11 h-11 rounded-xl bg-white border border-[#E5DAC6] text-[#5C5248] hover:text-[#2A2420] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer shrink-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Question & Guided Reflection Content (Scrollable) */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1 py-4 space-y-4">
          {/* Active Day Banner */}
          <div className="p-4 rounded-2xl bg-white/80 border border-[#E5DAC6] space-y-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#B88736]/20 text-[#B88736] text-xs font-mono font-bold border border-[#B88736]/30">
                  DIA {activeDay.toString().padStart(2, '0')} DE 21
                </span>
                <span className="text-xs font-mono text-[#B88736]">
                  {currentQuestionItem.systemicLaw}
                </span>
              </div>

              <button
                type="button"
                onClick={handleReadVoice}
                className="px-3 py-2 min-h-11 rounded-xl bg-[#B88736]/12 hover:bg-[#B88736]/20 border border-[#B88736]/30 text-[#8F631E] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
              >
                <Volume2 size={13} className={isReadingVoice ? 'animate-pulse text-amber-400' : ''} />
                <span>{isReadingVoice ? 'Ouvindo Reflexão...' : 'Ouvir com Voz'}</span>
              </button>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#2A2420] leading-snug">
              {currentQuestionItem.theme}
            </h3>

            {/* Main Question Quote Card */}
            <div className="p-4 rounded-xl bg-white/80 border border-[#B88736]/20 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#B88736] font-bold block">
                PERGUNTA SISTÊMICA CHAVE:
              </span>
              <p className="text-sm sm:text-base font-medium text-[#2A2420] italic leading-relaxed">
                "{currentQuestionItem.question}"
              </p>
            </div>

            {/* Guided Therapeutic Reflection */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#B88736] font-bold block">
                REFLEXÃO GUIADA:
              </span>
              <p className="text-xs sm:text-sm text-[#5C5248] leading-relaxed">
                {currentQuestionItem.guidedReflection}
              </p>
            </div>

            {/* Healing Systemic Sentence */}
            <div className="p-3.5 rounded-xl bg-[#F5EFE4] border border-[#E5DAC6] space-y-1.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F631E] font-bold block">
                  FRASE DE INTEGRAÇÃO:
                </span>
                <p className="text-xs sm:text-sm text-[#5C5248] font-semibold italic">
                  "{currentQuestionItem.healingSentence}"
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopySentence}
                className="px-3 py-2 min-h-11 bg-white hover:bg-[#EFE4D3] border border-[#E5DAC6] text-[#5C5248] rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
              >
                {copiedSentence ? <Check size={13} /> : <Copy size={13} />}
                <span aria-live="polite">{copiedSentence ? 'Frase copiada' : 'Copiar frase'}</span>
              </button>
            </div>

            {/* Practical Action */}
            <div className="text-xs text-[#5C5248] flex items-start gap-2 pt-1">
              <Sparkles size={14} className="text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Exercício Prático do Dia:</strong> {currentQuestionItem.practicalAction}</span>
            </div>
          </div>

          {/* User Answer Space */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-white/80 border border-[#E5DAC6]">
            <div className="flex items-center justify-between">
              <label htmlFor="systemic-answer-text" className="text-xs font-mono uppercase tracking-wider text-[#5C5248] font-bold flex items-center gap-1.5">
                <BookOpen size={14} className="text-[#B88736]" />
                <span>Sua Resposta & Insights Pessoais do Dia {activeDay}:</span>
              </label>

              {dayProgress?.systemicAnsweredAt && (
                <span className="text-[10px] font-mono text-emerald-700" role="status" aria-live="polite">
                  Salvo em {new Date(dayProgress.systemicAnsweredAt).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>

            <textarea
              id="systemic-answer-text"
              rows={4}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Escreva aqui o que sentiu ao ler a pergunta, quais memórias de família ou pessoas vieram à sua mente, e como você se sente após pronunciar a frase de integração..."
              className="w-full bg-[#FBF8F2] border border-[#E5DAC6] focus:border-[#B88736] focus:ring-1 focus:ring-[#B88736]/30 text-[#2A2420] rounded-xl p-3.5 text-xs sm:text-sm transition duration-150 outline-none placeholder-slate-600 resize-y leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-[10px] text-[#85786C] font-mono">
                {currentAnswer.length} caracteres • Fica registrado com segurança no seu diário.
              </span>

              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2.5 min-h-11 bg-[#B88736] hover:bg-[#8F631E] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35"
              >
                {isSavedRecently ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-300" />
                    <span>Resposta salva</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Salvar Resposta do Dia</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 pt-3 border-t border-[#E5DAC6] flex items-center justify-between text-xs text-[#85786C]">
          <div className="flex items-center gap-2">
            <span className="text-[#B88736] font-mono font-bold">
              {totalAnsweredCount} de 21
            </span>
            <span>Perguntas Respondidas</span>
          </div>

          <button
            onClick={handleCloseModal}
            className="px-4 py-2.5 min-h-11 bg-[#F5EFE4] hover:bg-[#EFE4D3] text-[#2A2420] border border-[#E5DAC6] rounded-xl text-xs font-semibold cursor-pointer transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
