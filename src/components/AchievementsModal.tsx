/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { motion } from 'motion/react';
import {
  Award, Trophy, Sparkles, Flame, Calendar, Sun, Shield, Heart,
  BookOpen, GitBranch, Activity, Compass, ShieldCheck, Crown, Lock, CheckCircle2, X
} from 'lucide-react';
import { DayProgress, UserProfile } from '../types';
import { ALL_ACHIEVEMENTS, evaluateUserAchievements } from '../lib/achievementsData';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null | undefined;
  progress: DayProgress[];
}

export default function AchievementsModal({ isOpen, onClose, userProfile, progress }: AchievementsModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(isOpen, dialogRef, onClose);
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'constancia' | 'jornada' | 'espiritual' | 'autoconhecimento'>('todos');

  if (!isOpen) return null;

  const evaluation = evaluateUserAchievements(userProfile, progress);

  const getIconComponent = (iconName: string, size = 20, isUnlocked = true) => {
    const className = isUnlocked ? 'text-[#B88736]' : 'text-[#85786C]';
    switch (iconName) {
      case 'Sparkles': return <Sparkles size={size} className={className} />;
      case 'Flame': return <Flame size={size} className={className} />;
      case 'Calendar': return <Calendar size={size} className={className} />;
      case 'Sun': return <Sun size={size} className={className} />;
      case 'Shield': return <Shield size={size} className={className} />;
      case 'Heart': return <Heart size={size} className={className} />;
      case 'BookOpen': return <BookOpen size={size} className={className} />;
      case 'GitBranch': return <GitBranch size={size} className={className} />;
      case 'Activity': return <Activity size={size} className={className} />;
      case 'Compass': return <Compass size={size} className={className} />;
      case 'ShieldCheck': return <ShieldCheck size={size} className={className} />;
      case 'Crown': return <Crown size={size} className={className} />;
      default: return <Award size={size} className={className} />;
    }
  };

  const filteredAchievements = selectedCategory === 'todos'
    ? ALL_ACHIEVEMENTS
    : ALL_ACHIEVEMENTS.filter(achievement => achievement.category === selectedCategory);

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-[#2A2420]/30 p-2 sm:p-4 backdrop-blur-md"
      id="achievements-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievements-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative my-1 flex max-h-[calc(100dvh-1rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#E5DAC6] bg-[#FBF8F2] p-4 shadow-2xl sm:my-4 sm:max-h-[92dvh] sm:rounded-3xl sm:p-7"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#B88736]/10 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#5E7153]/8 blur-3xl" aria-hidden="true" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar conquistas"
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5DAC6] bg-[#F5EFE4] text-[#5C5248] transition hover:bg-[#EFE4D3] hover:text-[#2A2420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
        >
          <X size={17} />
        </button>

        <header className="shrink-0 space-y-4 border-b border-[#E5DAC6] pb-4">
          <div className="space-y-1.5 px-8 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#B88736]/25 bg-[#B88736]/10 px-3 py-1 text-xs font-mono font-medium text-[#8F631E]">
              <Trophy size={14} className="text-[#B88736]" />
              <span>CONQUISTAS DA JORNADA</span>
            </div>
            <h2 id="achievements-title" className="font-display text-2xl font-medium text-[#2A2420] sm:text-3xl">Seus Emblemas de Transformação</h2>
            <p className="mx-auto max-w-xl text-xs text-[#5C5248] sm:text-sm">Cada prática concluída e reflexão registrada pode desbloquear novos marcos da sua jornada.</p>
          </div>

          <section className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#E5DAC6] bg-white/85 p-4 sm:flex-row" aria-label="Resumo das conquistas">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#B88736]/30 bg-[#B88736]/12 text-[#B88736] shadow-inner">
                <Crown size={24} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8F631E]">Progresso da jornada</span>
                  <span className="rounded-full border border-[#E5DAC6] bg-[#F5EFE4] px-2 py-0.5 text-[10px] font-mono font-bold text-[#8F631E]">{evaluation.totalPoints} pontos</span>
                </div>
                <h3 className="text-base font-bold text-[#2A2420] sm:text-lg">{evaluation.unlocked.length} de {ALL_ACHIEVEMENTS.length} emblemas conquistados</h3>
              </div>
            </div>

            <div className="w-full space-y-1.5 sm:w-48">
              <div className="flex justify-between text-[11px] font-mono text-[#5C5248]">
                <span>Progresso total</span>
                <span className="font-bold text-[#8F631E]">{evaluation.percentage}%</span>
              </div>
              <div
                className="h-2.5 w-full overflow-hidden rounded-full border border-[#E5DAC6] bg-white"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={evaluation.percentage}
                aria-label="Progresso das conquistas"
              >
                <div className="h-full rounded-full bg-gradient-to-r from-[#8F631E] to-[#D6A756] transition-all duration-700" style={{ width: `${evaluation.percentage}%` }} />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar pt-1 sm:gap-2" role="tablist" aria-label="Filtrar conquistas">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'constancia', label: 'Constância' },
              { id: 'jornada', label: 'Jornada' },
              { id: 'espiritual', label: 'Espiritual' },
              { id: 'autoconhecimento', label: 'Autoconhecimento' }
            ].map(category => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id as typeof selectedCategory)}
                className={`min-h-11 shrink-0 rounded-xl px-3 py-2.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30 ${
                  selectedCategory === category.id
                    ? 'bg-[#B88736] text-white shadow-sm'
                    : 'border border-[#E5DAC6] bg-white text-[#5C5248] hover:text-[#2A2420]'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </header>

        <div tabIndex={0} role="region" aria-label="Emblemas e requisitos da jornada" className="flex-1 space-y-3 overflow-y-auto overscroll-contain py-4 pr-1">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {filteredAchievements.map(achievement => {
              const isUnlocked = evaluation.unlockedIds.includes(achievement.id);
              return (
                <article key={achievement.id} className={`relative flex flex-col justify-between rounded-2xl border p-4 transition ${isUnlocked ? 'border-[#E5DAC6] bg-white/90 shadow-sm' : 'border-[#E5DAC6] bg-white/70 opacity-75'}`}>
                  <div className="mb-3 flex items-start justify-between">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${isUnlocked ? 'border-[#B88736]/30 bg-gradient-to-br from-[#B88736]/15 to-[#D6A756]/8 shadow-inner' : 'border-[#E5DAC6] bg-[#FBF8F2]'}`}>
                      {getIconComponent(achievement.icon, 22, isUnlocked)}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono font-bold ${isUnlocked ? 'border-[#E5DAC6] bg-[#F5EFE4] text-[#8F631E]' : 'border-[#E5DAC6] bg-[#FBF8F2] text-[#85786C]'}`}>+{achievement.points} pts</span>
                      <span className="mt-1 flex items-center gap-1 text-[10px] font-mono text-[#85786C]">
                        {isUnlocked ? <><CheckCircle2 size={10} className="text-emerald-700" /><span className="text-emerald-700">Conquistado</span></> : <><Lock size={10} /><span>Bloqueado</span></>}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className={`text-sm font-bold leading-tight ${isUnlocked ? 'text-[#2A2420]' : 'text-[#5C5248]'}`}>{achievement.title}</h3>
                    <p className="text-xs leading-relaxed text-[#5C5248]">{achievement.description}</p>
                  </div>
                  <div className="mt-3 border-t border-[#E5DAC6] pt-2.5">
                    <span className="block text-[10px] font-mono leading-tight text-[#85786C]">Requisito: <strong className={isUnlocked ? 'font-normal text-[#8F631E]' : 'font-normal text-[#5C5248]'}>{achievement.requirementText}</strong></span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[#E5DAC6] pt-3 text-xs text-[#85786C]">
          <span>Os emblemas só são liberados quando o requisito correspondente foi realmente registrado.</span>
          <button type="button" onClick={onClose} className="min-h-11 rounded-xl bg-[#B88736] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#8F631E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30">Fechar</button>
        </footer>
      </motion.div>
    </div>
  );
}
