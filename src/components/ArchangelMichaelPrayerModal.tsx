/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Play, Pause, CheckCircle2, X, Sparkles, Copy, Check, Flower2 } from 'lucide-react';
import { ARCHANGEL_MICHAEL_PRAYER_FULL, ARCHANGEL_MICHAEL_FULL_TEXT } from '../data/archangel_prayer';
import { audioEngine } from '../lib/audio';
import { getLocalDateString } from '../utils/date';

interface ArchangelMichaelPrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  voiceId?: string;
  voiceRate?: number;
  voicePitch?: number;
  onProgressChange?: (days: number[]) => void;
}

const STORAGE_KEY_MICHAEL_DAYS = 'archangel_michael_prayer_completed_days_v1';
const STORAGE_KEY_MICHAEL_LAST_DATE = 'archangel_michael_prayer_last_completed_date_v1';

export default function ArchangelMichaelPrayerModal({
  isOpen,
  onClose,
  userName,
  voiceId,
  voiceRate = 0.84,
  voicePitch = 1.0,
  onProgressChange
}: ArchangelMichaelPrayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [completedToday, setCompletedToday] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MICHAEL_DAYS);
      const parsed = saved ? JSON.parse(saved) : [];
      const safeDays = Array.isArray(parsed)
        ? [...new Set(parsed.map(Number).filter(day => Number.isInteger(day) && day >= 1 && day <= 21))].sort((a, b) => a - b)
        : [];
      setCompletedDays(safeDays);
      setCompletedToday(localStorage.getItem(STORAGE_KEY_MICHAEL_LAST_DATE) === getLocalDateString());
    } catch (error) {
      console.warn('Não foi possível recuperar o progresso da oração.', error);
      setCompletedDays([]);
      setCompletedToday(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      audioEngine.stopSpeech();
      setIsPlaying(false);
    }
  }, [isOpen]);

  useEffect(() => () => audioEngine.stopSpeech(), []);

  const progressPercent = useMemo(
    () => Math.round((Math.min(completedDays.length, 21) / 21) * 100),
    [completedDays.length]
  );

  if (!isOpen) return null;

  const currentSection = ARCHANGEL_MICHAEL_PRAYER_FULL[currentSectionIndex];
  const totalSections = ARCHANGEL_MICHAEL_PRAYER_FULL.length;
  const journeyComplete = completedDays.length >= 21;

  const stopAudio = () => {
    audioEngine.stopSpeech();
    setIsPlaying(false);
  };

  const handleClose = () => {
    stopAudio();
    onClose();
  };

  const handleTogglePlay = () => {
    audioEngine.unlock();
    if (isPlaying) {
      stopAudio();
      return;
    }

    const textToSpeak = currentSection.text.replace(/\[NOME\]/g, userName || 'Filho de Deus');
    setIsPlaying(true);
    void audioEngine.speakWithElevenLabsOrFallback(
      textToSpeak,
      0.85,
      () => setIsPlaying(true),
      () => setIsPlaying(false),
      undefined,
      undefined,
      {
        voiceId,
        rate: voiceRate,
        pitch: voicePitch,
        lang: 'pt-BR',
        stability: 0.45,
        similarityBoost: 0.75,
        enableBreathingPauses: true,
        userName
      }
    );
  };

  const handleCompleteToday = () => {
    if (completedToday || journeyComplete) return;

    const nextDay = Math.min(21, completedDays.length + 1);
    const updated = [...new Set([...completedDays, nextDay])].sort((a, b) => a - b);
    const today = getLocalDateString();

    setCompletedDays(updated);
    setCompletedToday(true);
    onProgressChange?.(updated);
    try {
      localStorage.setItem(STORAGE_KEY_MICHAEL_DAYS, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEY_MICHAEL_LAST_DATE, today);
    } catch (error) {
      console.warn('Não foi possível salvar o progresso da oração.', error);
    }
  };

  const handleCopyPrayer = async () => {
    const full = ARCHANGEL_MICHAEL_FULL_TEXT.replace(/\[NOME\]/g, userName || 'Eu');
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn('Não foi possível copiar a oração.', error);
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-[#2A2420]/30 p-2 sm:p-4 backdrop-blur-md"
      id="archangel-prayer-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="archangel-prayer-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative my-1 flex max-h-[calc(100dvh-1rem)] w-full max-w-2xl flex-col gap-5 overflow-hidden rounded-2xl border border-[#B88736]/25 bg-[#FBF8F2] p-4 shadow-2xl sm:my-4 sm:max-h-[92dvh] sm:rounded-3xl sm:p-7"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#315C85]/8 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#B88736]/10 blur-3xl" aria-hidden="true" />

        <header className="relative z-10 flex items-start justify-between gap-3 border-b border-[#E5DAC6] pb-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#315C85]/25 bg-[#315C85]/10 text-[#315C85]">
              <Shield size={24} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#B88736]/25 bg-[#B88736]/8 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8F631E]">
                  Acesso livre
                </span>
                <span className="text-[10px] font-mono text-[#5C5248]">{completedDays.length}/21 dias</span>
              </div>
              <h2 id="archangel-prayer-title" className="mt-1 font-display text-base font-medium text-[#2A2420] sm:text-lg">
                Oração de 21 Dias do Arcanjo Miguel
              </h2>
              <p className="mt-1 text-[11px] leading-relaxed text-[#85786C]">
                Uma prática diária de oração, proteção simbólica e presença.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleCopyPrayer}
              aria-label="Copiar oração completa"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5DAC6] bg-[#F5EFE4] text-[#5C5248] transition hover:bg-[#EFE4D3] hover:text-[#2A2420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
            >
              {copied ? <Check size={16} className="text-emerald-700" /> : <Copy size={16} />}
            </button>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Fechar oração de São Miguel"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5DAC6] bg-[#F5EFE4] text-[#5C5248] transition hover:bg-[#EFE4D3] hover:text-[#2A2420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        <section className="relative z-10 shrink-0 space-y-2 rounded-2xl border border-[#E5DAC6] bg-white/80 p-3">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#5C5248]">
              <Sparkles size={13} className="text-[#B88736]" /> Jornada de oração
            </span>
            <span className="font-mono text-xs font-bold text-[#8F631E]">{progressPercent}%</span>
          </div>
          <div className="grid grid-cols-7 gap-1 sm:grid-cols-21" aria-label={`${completedDays.length} de 21 dias concluídos`}>
            {Array.from({ length: 21 }, (_, index) => index + 1).map(day => {
              const isDone = completedDays.includes(day);
              return (
                <div
                  key={day}
                  className={`flex h-7 items-center justify-center rounded-md border text-[10px] font-mono ${
                    isDone
                      ? 'border-[#315C85]/30 bg-[#315C85]/12 text-[#315C85]'
                      : 'border-[#E5DAC6] bg-[#FBF8F2] text-[#85786C]'
                  }`}
                  title={`Dia ${day}: ${isDone ? 'concluído' : 'pendente'}`}
                >
                  {isDone ? <CheckCircle2 size={12} /> : <Flower2 size={11} className="opacity-45" />}
                </div>
              );
            })}
          </div>
          <p className="text-[10px] leading-relaxed text-[#85786C]">
            O botão de conclusão avança no máximo uma vez por data local. Repetir a oração no mesmo dia não aumenta o contador.
          </p>
        </section>

        <nav className="relative z-10 flex shrink-0 gap-1.5 overflow-x-auto pb-1" aria-label="Partes da oração">
          {ARCHANGEL_MICHAEL_PRAYER_FULL.map((section, index) => (
            <button
              key={`${section.title}-${index}`}
              type="button"
              onClick={() => {
                stopAudio();
                setCurrentSectionIndex(index);
              }}
              aria-pressed={currentSectionIndex === index}
              className={`min-h-11 whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-mono transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30 ${
                currentSectionIndex === index
                  ? 'border-[#315C85]/35 bg-[#315C85]/10 font-semibold text-[#315C85]'
                  : 'border-[#E5DAC6] bg-white text-[#5C5248] hover:border-[#B88736]/35'
              }`}
            >
              Parte {index + 1}
            </button>
          ))}
        </nav>

        <section className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-2xl border border-[#E5DAC6] bg-white/80 p-4 shadow-inner sm:p-6">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#8F631E]">{currentSection.title}</span>
          <p className="mt-3 whitespace-pre-line border-l-2 border-[#315C85]/30 pl-4 font-serif text-sm italic leading-relaxed text-[#2A2420] sm:text-base">
            {currentSection.text.replace(/\[NOME\]/g, userName || 'Filho da Luz')}
          </p>
        </section>

        <footer className="relative z-10 flex shrink-0 flex-col items-stretch justify-between gap-3 border-t border-[#E5DAC6] pt-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`min-h-11 rounded-xl border px-5 py-3 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30 ${
              isPlaying
                ? 'border-[#B88736] bg-[#B88736]/12 text-[#8F631E]'
                : 'border-[#315C85]/30 bg-[#315C85] text-white hover:bg-[#274B6C]'
            }`}
          >
            {isPlaying ? <Pause size={16} className="mr-2 inline" /> : <Play size={16} className="mr-2 inline" />}
            {isPlaying ? 'Pausar áudio' : 'Ouvir esta parte'}
          </button>

          <button
            type="button"
            onClick={handleCompleteToday}
            disabled={completedToday || journeyComplete}
            className="min-h-11 rounded-xl bg-[#B88736] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#8F631E] disabled:cursor-not-allowed disabled:bg-[#E5DAC6] disabled:text-[#85786C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35"
          >
            <CheckCircle2 size={16} className="mr-2 inline" />
            {journeyComplete ? '21 dias concluídos' : completedToday ? 'Concluído hoje' : 'Concluir oração de hoje'}
          </button>
        </footer>
      </motion.div>
    </div>
  );
}
