import React, { useState, useEffect } from 'react';
import { Bell, Play, X, Sparkles, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DayProgress, DAILY_INSIGHTS } from '../types';

interface DailyReminderBannerProps {
  currentDay: number;
  progress: DayProgress[];
  userName: string;
  streak: number;
  onStartSession: (day: number) => void;
}

export function DailyReminderBanner({
  currentDay,
  progress,
  userName,
  streak,
  onStartSession
}: DailyReminderBannerProps) {
  const currentDayProgress = progress.find(d => d.dayNumber === currentDay);
  const isCurrentDayCompleted = currentDayProgress?.completed ?? false;

  const [isReminderDismissed, setIsReminderDismissed] = useState<boolean>(() => {
    const savedDismissed = localStorage.getItem('cura_integrada_dismissed_reminder_day');
    return savedDismissed === String(currentDay);
  });

  useEffect(() => {
    const savedDismissed = localStorage.getItem('cura_integrada_dismissed_reminder_day');
    setIsReminderDismissed(savedDismissed === String(currentDay));
  }, [currentDay]);

  const handleDismissReminder = () => {
    localStorage.setItem('cura_integrada_dismissed_reminder_day', String(currentDay));
    setIsReminderDismissed(true);
  };

  if (isCurrentDayCompleted || isReminderDismissed) {
    return null;
  }

  // Get authentic daily quote for the current day from DAILY_INSIGHTS
  const dailyInsight = DAILY_INSIGHTS[Math.max(0, Math.min(DAILY_INSIGHTS.length - 1, currentDay - 1))];
  const motivationalQuote = dailyInsight?.quote || "O silêncio interior é a porta de entrada para a autocura.";
  const quoteAuthor = dailyInsight?.quoteAuthor || "Éverton Rodrigo Piceni";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.98 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-indigo-950/30 border border-indigo-500/30 rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5 backdrop-blur-sm"
        id="daily-reminder-banner"
      >
        {/* Ambient subtle decorative light leak */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full filter blur-xl pointer-events-none" />
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex-shrink-0 flex items-center justify-center">
            <Bell size={20} className="animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold flex items-center gap-1">
                <Sparkles size={10} /> Frase Motivacional • Dia {currentDay.toString().padStart(2, '0')}
              </span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
            </div>
            <p className="text-xs md:text-sm text-slate-200 italic font-serif leading-relaxed max-w-2xl">
              "{motivationalQuote}"
            </p>
            <p className="text-[11px] text-indigo-300/80 font-mono font-medium">
              — {quoteAuthor}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center relative z-10">
          <button
            onClick={() => onStartSession(currentDay)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-lg shadow-indigo-600/15 border-none"
            id="reminder-start-meditation-btn"
          >
            <Play size={12} fill="currentColor" />
            Iniciar Meditação
          </button>
          <button
            onClick={handleDismissReminder}
            className="p-2.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 rounded-xl transition cursor-pointer"
            title="Lembrar mais tarde"
            id="reminder-dismiss-btn"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
