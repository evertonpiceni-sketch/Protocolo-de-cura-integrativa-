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
      `Reflexão terapêutica: ${currentQuestionItem.guidedReflection} ` +
      `Frase de cura: ${currentQuestionItem.healingSentence}`;

    audioEngine.previewVoice({
      text: speechText,
      voiceId: userProfile?.voiceId,
      rate: userProfile?.voiceRate ?? 0.82,
      pitch: userProfile?.voicePitch ?? 1.0,
      onEnd: () => setIsReadingVoice(false)
    });

    setTimeout(() => setIsReadingVoice(false), 12000);
  };

  const handleCopySentence = () => {
    navigator.clipboard.writeText(currentQuestionItem.healingSentence);
    setCopiedSentence(true);
    setTimeout(() => setCopiedSentence(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto" id="systemic-questions-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-slate-900 border border-indigo-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Glow backdrop effects */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition cursor-pointer z-10"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="shrink-0 space-y-3 pb-4 border-b border-slate-800">
          <div className="text-center space-y-1 pr-8 pl-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-medium">
              <GitBranch size={14} className="text-indigo-400" />
              <span>CONSTELAÇÃO SISTÊMICA FAMILIAR & ANCESTRALIDADE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-slate-100">
              Perguntas Sistêmicas do Dia
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Perguntas terapêuticas diárias canalizadas para destravar nós inconscientes, honrar sua linhagem e liberar seu destino.
            </p>
          </div>

          {/* 639 Hz Frequency Banner: Melhora a compreensão, tolerância e relações interpessoais */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
                <Heart size={16} className={is639HzActive ? 'scale-110 text-emerald-400 animate-pulse' : 'opacity-60'} />
                {is639HzActive && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-300">Frequência Solfeggio 639 Hz Ativa</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono">Chakra Cardíaco</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  639 Hz: Melhora a compreensão, tolerância e relações interpessoais enquanto você reflete e responde.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggle639}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border shrink-0 self-end sm:self-center ${
                is639HzActive
                  ? 'bg-emerald-600/30 border-emerald-500/50 text-emerald-200 hover:bg-emerald-600/50'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {is639HzActive ? <Volume2 size={13} className="text-emerald-400 animate-pulse" /> : <VolumeX size={13} />}
              <span>{is639HzActive ? '639 Hz Ativo' : 'Ativar 639 Hz'}</span>
            </button>
          </div>

          {/* Days selector bar */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              onClick={() => setActiveDay(prev => Math.max(prev - 1, 1))}
              disabled={activeDay === 1}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer shrink-0"
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
                    className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center relative shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-md shadow-indigo-600/30'
                        : hasAnswer
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                        : isCurrent
                        ? 'bg-amber-950/50 border border-amber-500/40 text-amber-300'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                    title={`Dia ${dNum} ${hasAnswer ? '(Respondido ✨)' : ''}`}
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
              onClick={() => setActiveDay(prev => Math.min(prev + 1, 21))}
              disabled={activeDay === 21}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer shrink-0"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Question & Guided Reflection Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-4">
          {/* Active Day Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/40 border border-indigo-500/30 space-y-3 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/30">
                  DIA {activeDay.toString().padStart(2, '0')} DE 21
                </span>
                <span className="text-xs font-mono text-purple-300">
                  {currentQuestionItem.systemicLaw}
                </span>
              </div>

              <button
                type="button"
                onClick={handleReadVoice}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Volume2 size={13} className={isReadingVoice ? 'animate-pulse text-amber-400' : ''} />
                <span>{isReadingVoice ? 'Ouvindo Reflexão...' : 'Ouvir com Voz'}</span>
              </button>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-100 leading-snug">
              {currentQuestionItem.theme}
            </h3>

            {/* Main Question Quote Card */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/20 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">
                PERGUNTA SISTÊMICA CHAVE:
              </span>
              <p className="text-sm sm:text-base font-medium text-slate-100 italic leading-relaxed">
                "{currentQuestionItem.question}"
              </p>
            </div>

            {/* Guided Therapeutic Reflection */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold block">
                DIRECIONAMENTO TERAPÊUTICO (ÉVERTON PICENI):
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentQuestionItem.guidedReflection}
              </p>
            </div>

            {/* Healing Systemic Sentence */}
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block">
                  FRASE DE CURA & SOLUÇÃO SISTÊMICA:
                </span>
                <p className="text-xs sm:text-sm text-purple-200 font-semibold italic">
                  "{currentQuestionItem.healingSentence}"
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopySentence}
                className="px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                {copiedSentence ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedSentence ? 'Copiada!' : 'Copiar Frase'}</span>
              </button>
            </div>

            {/* Practical Action */}
            <div className="text-xs text-slate-400 flex items-start gap-2 pt-1">
              <Sparkles size={14} className="text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Exercício Prático do Dia:</strong> {currentQuestionItem.practicalAction}</span>
            </div>
          </div>

          {/* User Answer Space */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <label htmlFor="systemic-answer-text" className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                <BookOpen size={14} className="text-indigo-400" />
                <span>Sua Resposta & Insights Pessoais do Dia {activeDay}:</span>
              </label>

              {dayProgress?.systemicAnsweredAt && (
                <span className="text-[10px] font-mono text-emerald-400">
                  Salvo em {new Date(dayProgress.systemicAnsweredAt).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>

            <textarea
              id="systemic-answer-text"
              rows={4}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Escreva aqui o que sentiu ao ler a pergunta, quais memórias de família ou pessoas vieram à sua mente, e como você se sente após pronunciar a frase de cura..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 rounded-xl p-3.5 text-xs sm:text-sm transition duration-150 outline-none placeholder-slate-600 resize-y leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-[10px] text-slate-500 font-mono">
                {currentAnswer.length} caracteres • Fica registrado com segurança no seu diário.
              </span>

              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95"
              >
                {isSavedRecently ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-300" />
                    <span>Resposta Salva! ✨</span>
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
        <div className="shrink-0 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400 font-mono font-bold">
              {totalAnsweredCount} de 21
            </span>
            <span>Perguntas Respondidas</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer transition"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
