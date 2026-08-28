/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, Flame, Volume2, VolumeX, Play, Pause, RotateCcw,
  CheckCircle2, X, Sparkles, Copy, Check, Calendar, Sun, Moon
} from 'lucide-react';
import { ARCHANGEL_MICHAEL_PRAYER_FULL, ARCHANGEL_MICHAEL_FULL_TEXT } from '../data/archangel_prayer';
import { audioEngine } from '../lib/audio';

interface ArchangelMichaelPrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  voiceId?: string;
  voiceRate?: number;
  voicePitch?: number;
}

const STORAGE_KEY_MICHAEL_DAYS = 'archangel_michael_prayer_completed_days_v1';

export default function ArchangelMichaelPrayerModal({
  isOpen,
  onClose,
  userName,
  voiceId,
  voiceRate = 0.84,
  voicePitch = 1.0
}: ArchangelMichaelPrayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [prayerDate, setPrayerDate] = useState<string>(new Date().toLocaleDateString('pt-BR'));

  // Load saved completed days
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MICHAEL_DAYS);
      if (saved) {
        setCompletedDays(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Stop speech when closing
  useEffect(() => {
    if (!isOpen) {
      audioEngine.stopSpeech();
      setIsPlaying(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentSection = ARCHANGEL_MICHAEL_PRAYER_FULL[currentSectionIndex];
  const totalSections = ARCHANGEL_MICHAEL_PRAYER_FULL.length;

  const handleTogglePlay = () => {
    audioEngine.unlock();
    if (isPlaying) {
      audioEngine.stopSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const textToSpeak = currentSection.text.replace(/\[NOME\]/g, userName || 'Filho de Deus');
      
      audioEngine.speak(
        textToSpeak,
        0.85,
        () => setIsPlaying(true),
        () => {
          if (currentSectionIndex < totalSections - 1) {
            setCurrentSectionIndex(prev => prev + 1);
          } else {
            setIsPlaying(false);
          }
        },
        undefined,
        undefined,
        {
          voiceId,
          rate: voiceRate,
          pitch: voicePitch,
          lang: 'pt-BR'
        }
      );
    }
  };

  const handleCompleteToday = () => {
    const nextDay = completedDays.length < 21 ? completedDays.length + 1 : 21;
    if (!completedDays.includes(nextDay)) {
      const updated = [...completedDays, nextDay];
      setCompletedDays(updated);
      localStorage.setItem(STORAGE_KEY_MICHAEL_DAYS, JSON.stringify(updated));
    }
  };

  const handleCopyPrayer = () => {
    const full = ARCHANGEL_MICHAEL_FULL_TEXT.replace(/\[NOME\]/g, userName || 'Eu');
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto" id="archangel-prayer-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-2xl bg-slate-900 border border-blue-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Divine sapphire blue ambient aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0 border border-blue-400/40">
              <Shield size={24} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  100% Gratuito
                </span>
                <span className="text-[10px] font-mono text-amber-400">
                  {completedDays.length}/21 Dias Concluídos
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-display font-medium text-slate-100 mt-0.5">
                Oração de 21 Dias de Limpeza do Arcanjo Miguel
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPrayer}
              className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-xl transition cursor-pointer border border-slate-700/50"
              title="Copiar oração completa"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition cursor-pointer border border-slate-700/50"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 21 Days Progress Strip */}
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-slate-400 text-[11px] flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" /> Jornada de Libertação & Corte de Laços
            </span>
            <span className="font-mono text-emerald-400 font-bold text-xs">
              {Math.round((completedDays.length / 21) * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-7 sm:grid-cols-21 gap-1 pt-1">
            {Array.from({ length: 21 }, (_, i) => i + 1).map(day => {
              const isDone = completedDays.includes(day);
              return (
                <div
                  key={day}
                  className={`h-6 rounded-md flex items-center justify-center text-[10px] font-mono transition ${
                    isDone
                      ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-500'
                  }`}
                  title={`Dia ${day} ${isDone ? '(Concluído)' : '(Pendente)'}`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Prayer Section Navigation Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
          {ARCHANGEL_MICHAEL_PRAYER_FULL.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => {
                audioEngine.stopSpeech();
                setIsPlaying(false);
                setCurrentSectionIndex(idx);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition cursor-pointer border ${
                currentSectionIndex === idx
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
              }`}
            >
              Parte {idx + 1}
            </button>
          ))}
        </div>

        {/* Prayer Content Display */}
        <div className="flex-1 overflow-y-auto bg-slate-950/70 border border-blue-500/20 rounded-2xl p-4 sm:p-6 space-y-4 shadow-inner">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block font-semibold">
              {currentSection.title}
            </span>
          </div>

          <p className="text-sm sm:text-base leading-relaxed text-slate-200 font-serif italic whitespace-pre-line border-l-2 border-blue-500/40 pl-4">
            {currentSection.text.replace(/\[NOME\]/g, userName || 'Filho da Luz')}
          </p>
        </div>

        {/* Audio Player & Complete Today Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 border-t border-slate-800">
          <button
            onClick={handleTogglePlay}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl font-medium text-xs font-mono flex items-center justify-center gap-2 transition cursor-pointer border ${
              isPlaying
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-600/20'
            }`}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
            <span>{isPlaying ? 'Pausar Áudio da Oração' : 'Ouvir Oração Guiada'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCompleteToday}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition cursor-pointer border-none shadow-lg shadow-emerald-600/20"
            >
              <CheckCircle2 size={16} />
              <span>Concluir Oração de Hoje</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
