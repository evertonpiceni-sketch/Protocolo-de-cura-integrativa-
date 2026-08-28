/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award, Trophy, Sparkles, Flame, Calendar, Sun, Shield, Heart,
  BookOpen, GitBranch, Activity, Compass, ShieldCheck, Crown, Lock, CheckCircle2, X, Star
} from 'lucide-react';
import { AchievementItem, DayProgress, UserProfile } from '../types';
import { ALL_ACHIEVEMENTS, evaluateUserAchievements } from '../lib/achievementsData';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null | undefined;
  progress: DayProgress[];
}

export default function AchievementsModal({
  isOpen,
  onClose,
  userProfile,
  progress
}: AchievementsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'constancia' | 'jornada' | 'espiritual' | 'autoconhecimento'>('todos');

  if (!isOpen) return null;

  const evaluation = evaluateUserAchievements(userProfile, progress);

  const getIconComponent = (iconName: string, size = 20, isUnlocked = true) => {
    const className = isUnlocked ? "text-amber-400" : "text-slate-600";
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
    : ALL_ACHIEVEMENTS.filter(a => a.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto" id="achievements-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-200 flex items-center justify-center transition cursor-pointer z-10"
        >
          <X size={16} />
        </button>

        {/* Header (Always Visible at Top) */}
        <div className="shrink-0 space-y-4 pb-4 border-b border-slate-800/80">
          <div className="text-center space-y-1.5 pr-8 pl-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium">
              <Trophy size={14} className="text-amber-400" />
              <span>SISTEMA DE CONQUISTAS & MERECIMENTO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-slate-100">
              Seus Emblemas de Transformação
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Cada dia concluído, oração sagrada e reflexão profunda desbloqueia marcos energéticos na sua jornada.
            </p>
          </div>

          {/* Progress Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-indigo-950/40 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                <Crown size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
                    NÍVEL VIBRACIONAL
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                    {evaluation.totalPoints} Pontos Quânticos
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-100">
                  {evaluation.unlocked.length} de {ALL_ACHIEVEMENTS.length} Emblemas Conquistados
                </h3>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full sm:w-48 space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Progresso Total</span>
                <span className="text-amber-300 font-bold">{evaluation.percentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${Math.max(evaluation.percentage, 5)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pt-1">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'constancia', label: 'Constância' },
              { id: 'jornada', label: 'Jornada' },
              { id: 'espiritual', label: 'Espiritual' },
              { id: 'autoconhecimento', label: 'Autoconhecimento' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredAchievements.map((ach) => {
              const isUnlocked = evaluation.unlockedIds.includes(ach.id);

              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-gradient-to-b from-amber-950/30 via-slate-900 to-slate-950 border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'bg-slate-950/60 border-slate-850 opacity-75'
                  }`}
                >
                  {/* Badge Status Top Marker */}
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/50 shadow-inner'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      {getIconComponent(ach.icon, 22, isUnlocked)}
                    </div>

                    <div className="flex flex-col items-end">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          isUnlocked
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        +{ach.points} pts
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 mt-1 flex items-center gap-1">
                        {isUnlocked ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={10} /> Conquistado
                          </span>
                        ) : (
                          <span className="text-slate-500 flex items-center gap-1">
                            <Lock size={10} /> Bloqueado
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h4
                      className={`text-sm font-bold leading-tight ${
                        isUnlocked ? 'text-slate-100' : 'text-slate-400'
                      }`}
                    >
                      {ach.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>

                  {/* Requirement Footer */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono text-slate-500 block leading-tight">
                      Requisito: <strong className={isUnlocked ? 'text-amber-300 font-normal' : 'text-slate-400 font-normal'}>{ach.requirementText}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="shrink-0 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Continue sua prática diária para desbloquear todos os emblemas.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
