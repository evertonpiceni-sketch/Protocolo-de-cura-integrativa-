/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, RefreshCw, Copy, Check, Heart, Wind,
  Sun, Shield, Compass, Quote, Volume2, Play
} from 'lucide-react';
import { MindfulnessItem, getRandomMindfulnessItem, MINDFULNESS_AND_AFFIRMATIONS } from '../lib/mindfulnessData';

interface MindfulnessAffirmationWidgetProps {
  userName?: string;
  onOpenMeditation?: () => void;
}

export default function MindfulnessAffirmationWidget({
  userName,
  onOpenMeditation
}: MindfulnessAffirmationWidgetProps) {
  // Initialize with a random item on every mount (when user opens the app)
  const [currentItem, setCurrentItem] = useState<MindfulnessItem>(() => getRandomMindfulnessItem());
  const [copied, setCopied] = useState<boolean>(false);
  const [isBreathingMode, setIsBreathingMode] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'inspire' | 'retenha' | 'expire'>('inspire');
  const [filterType, setFilterType] = useState<'all' | 'affirmation' | 'mindfulness_tip'>('all');

  // Next random item
  const handleNextRandom = () => {
    let pool = MINDFULNESS_AND_AFFIRMATIONS;
    if (filterType !== 'all') {
      pool = MINDFULNESS_AND_AFFIRMATIONS.filter(i => i.type === filterType);
    }
    const filteredPool = pool.filter(i => i.id !== currentItem.id);
    const selected = filteredPool[Math.floor(Math.random() * filteredPool.length)] || pool[0];
    setCurrentItem(selected);
  };

  const handleCopy = () => {
    const shareText = `✨ *${currentItem.title}*\n"${currentItem.text}"\n\n🕊️ _Prática:_ ${currentItem.practicalAction || ''}\n🌿 _Protocolo de Cura Integrada_`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Breathing loop timer when breathing mode is active
  useEffect(() => {
    if (!isBreathingMode) return;
    const interval = setInterval(() => {
      setBreathPhase(prev => {
        if (prev === 'inspire') return 'retenha';
        if (prev === 'retenha') return 'expire';
        return 'inspire';
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isBreathingMode]);

  return (
    <div
      className="p-5 md:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-[#F3EBDD] border border-[#B88736]/30 shadow-2xl relative overflow-hidden space-y-4"
      id="mindfulness-affirmation-widget"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-10 w-48 h-48 bg-[#B88736]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 text-amber-400 border border-amber-500/30 shadow-inner">
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                {currentItem.type === 'affirmation' ? '✨ Afirmação Quântica Diária' : '🌿 Dica de Atenção Plena'}
              </span>
              {currentItem.frequencyHz && (
                <span className="text-[10px] font-mono text-[#B88736] bg-[#B88736]/10 border border-[#B88736]/30 px-2 py-0.5 rounded-full">
                  {currentItem.frequencyHz}
                </span>
              )}
            </div>
            <h3 className="text-xs text-[#5C5248] font-medium mt-0.5">
              Inspiração & Frequência para o seu Dia
            </h3>
          </div>
        </div>

        {/* Quick controls: Randomize, Copy, Breath */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsBreathingMode(!isBreathingMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
              isBreathingMode
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-[#FBF8F2] hover:bg-[#F5EFE4] border-[#E5DAC6] text-[#5C5248]'
            }`}
            title="Ativar Respiração Guiada com esta Afirmação"
          >
            <Wind size={13} className="text-emerald-400" />
            <span className="hidden sm:inline">{isBreathingMode ? 'Fechar Respiração' : 'Respirar 30s'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-xl bg-[#FBF8F2] hover:bg-[#F5EFE4] border border-[#E5DAC6] text-[#5C5248] hover:text-white transition cursor-pointer"
            title="Copiar Afirmação / Dica"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>

          <button
            type="button"
            onClick={handleNextRandom}
            className="px-3 py-1.5 rounded-xl bg-[#B88736]/30 hover:bg-[#B88736]/50 border border-[#B88736]/40 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            title="Sortear Outra Afirmação ou Dica"
          >
            <RefreshCw size={13} className="text-[#B88736]" />
            <span>Nova Mensagem</span>
          </button>
        </div>
      </div>

      {/* Main Quote / Tip Card with smooth transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 p-4 md:p-5 rounded-2xl bg-white/75 border border-[#E5DAC6] space-y-3"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#2A2420] flex items-center gap-1.5">
              <Quote size={14} className="text-amber-400 shrink-0" />
              <span>{currentItem.title}</span>
            </span>
            <span className="text-[11px] font-mono text-[#5C5248] capitalize px-2 py-0.5 rounded bg-[#FBF8F2] border border-[#E5DAC6]">
              {currentItem.categoryLabel}
            </span>
          </div>

          <p className="text-sm md:text-base text-[#2A2420] font-serif italic leading-relaxed">
            "{currentItem.text}"
          </p>

          {currentItem.practicalAction && (
            <div className="pt-2 border-t border-[#E5DAC6] flex items-start gap-2 text-xs text-emerald-300 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20">
              <Heart size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-emerald-200">Prática Express: </span>
                <span className="text-[#5C5248]">{currentItem.practicalAction}</span>
              </div>
            </div>
          )}

          {/* Interactive Guided Breath Micro-Mode */}
          {isBreathingMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-[#FBF8F2] to-teal-950/30 border border-emerald-500/30 flex flex-col items-center justify-center text-center space-y-2 mt-2"
            >
              <div className="relative flex items-center justify-center w-20 h-20">
                <motion.div
                  animate={{
                    scale: breathPhase === 'inspire' ? 1.35 : breathPhase === 'retenha' ? 1.35 : 0.85,
                    opacity: breathPhase === 'expire' ? 0.4 : 0.9
                  }}
                  transition={{ duration: 3.8, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 blur-[1px]"
                />
                <Wind size={24} className="text-emerald-300 relative z-10" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-300">
                  {breathPhase === 'inspire' && '✨ Inspire Profundamente...'}
                  {breathPhase === 'retenha' && '🌿 Segure e Sinta a Luz no Peito...'}
                  {breathPhase === 'expire' && '💨 Solte Todo o Ar Devagar...'}
                </span>
                <p className="text-[11px] text-[#5C5248] mt-0.5">
                  Ancore esta afirmação na sua respiração consciente
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
