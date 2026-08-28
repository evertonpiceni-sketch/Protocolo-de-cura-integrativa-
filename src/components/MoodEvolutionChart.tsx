/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import {
  TrendingUp,
  Smile,
  Sparkles,
  Heart,
  Calendar,
  Zap,
  CheckCircle2,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { DayProgress, DAILY_INSIGHTS, JOURNEY_7D_INSIGHTS, JourneyType } from '../types';

interface MoodEvolutionChartProps {
  progress: DayProgress[];
  journeyType?: JourneyType;
  onOpenMeditation?: (day: number) => void;
  className?: string;
}

export default function MoodEvolutionChart({
  progress,
  journeyType = '21d',
  onOpenMeditation,
  className = ''
}: MoodEvolutionChartProps) {
  const [viewMode, setViewMode] = useState<'line' | 'comparison'>('line');
  const totalDays = journeyType === '7d' ? 7 : 21;
  const insights = journeyType === '7d' ? JOURNEY_7D_INSIGHTS : DAILY_INSIGHTS;

  // Filter completed days with mood
  const completedEntries = progress.filter(
    (d) => d.completed && (d.mood !== undefined || d.afterFeeling?.mood !== undefined) && d.dayNumber <= totalDays
  );

  const completedCount = completedEntries.length;

  // Calculate Average Mood
  let avgMood = 0;
  let avgBeforeMood = 0;
  let validBeforeCount = 0;

  if (completedCount > 0) {
    const sum = completedEntries.reduce((acc, d) => acc + (d.afterFeeling?.mood || d.mood || 0), 0);
    avgMood = sum / completedCount;

    completedEntries.forEach((d) => {
      if (d.beforeFeeling?.mood) {
        avgBeforeMood += d.beforeFeeling.mood;
        validBeforeCount++;
      }
    });
    if (validBeforeCount > 0) {
      avgBeforeMood = avgBeforeMood / validBeforeCount;
    }
  }

  // Calculate Uplift / Vibrational Jump (Before -> After)
  const averageUplift =
    validBeforeCount > 0 && avgMood > avgBeforeMood ? (avgMood - avgBeforeMood).toFixed(1) : null;

  // Calculate High Vibration Rate (percentage of sessions with score >= 4)
  const highVibeSessions = completedEntries.filter(
    (d) => (d.afterFeeling?.mood || d.mood || 0) >= 4
  ).length;
  const highVibeRate = completedCount > 0 ? Math.round((highVibeSessions / completedCount) * 100) : 0;

  // Dominant Mood Label
  let dominantMoodText = 'Aguardando Registros';
  let dominantEmoji = '✨';

  if (completedCount > 0) {
    const counts: Record<number, number> = {};
    completedEntries.forEach((d) => {
      const val = d.afterFeeling?.mood || d.mood || 5;
      counts[val] = (counts[val] || 0) + 1;
    });

    let maxC = 0;
    let topMood = 5;
    Object.entries(counts).forEach(([k, c]) => {
      if (c > maxC) {
        maxC = c;
        topMood = parseInt(k, 10);
      }
    });

    switch (topMood) {
      case 5:
        dominantMoodText = 'Completamente em Paz';
        dominantEmoji = '🌸';
        break;
      case 4:
        dominantMoodText = 'Calmo & Centrado';
        dominantEmoji = '☀️';
        break;
      case 3:
        dominantMoodText = 'Neutro & Equilibrado';
        dominantEmoji = '😐';
        break;
      case 2:
        dominantMoodText = 'Inquieto / Agitado';
        dominantEmoji = '⛈️';
        break;
      case 1:
        dominantMoodText = 'Pesado / Desafiador';
        dominantEmoji = '🌧️';
        break;
    }
  }

  // Prepare 21-day timeline dataset for Recharts
  const chartData = Array.from({ length: totalDays }, (_, i) => {
    const dayNum = i + 1;
    const dayData = progress.find((p) => p.dayNumber === dayNum);
    const insight = insights[i];

    const afterMood = dayData?.completed
      ? dayData.afterFeeling?.mood || dayData.mood || null
      : null;
    const beforeMood = dayData?.beforeFeeling?.mood || null;

    return {
      day: dayNum,
      dayLabel: `D${dayNum}`,
      fullLabel: `Dia ${dayNum.toString().padStart(2, '0')}`,
      title: insight?.title || `Sessão de Alinhamento`,
      focus: insight?.focus || '',
      completed: !!dayData?.completed,
      mood: afterMood,
      beforeMood: beforeMood,
      uplift: afterMood && beforeMood ? afterMood - beforeMood : null,
      journalText: dayData?.journalText || dayData?.afterFeeling?.notes || '',
      beforeState: dayData?.beforeFeeling?.stateTitle || '',
      afterState: dayData?.afterFeeling?.stateTitle || '',
      sensations: dayData?.afterFeeling?.sensations || []
    };
  });

  return (
    <div
      className={`bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-6 ${className}`}
      id="mood-evolution-container"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Sub-actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <BarChart3 size={11} />
              <span>Bioestatística & Psicoemocional</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
              {completedCount}/{totalDays} Sessões
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-display font-medium text-slate-100 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-400 shrink-0" />
            <span>Evolução do Humor ao Longo do Protocolo</span>
          </h2>
          <p className="text-xs text-slate-400">
            Acompanhe o salto vibracional e a transmutação emocional registrada antes e após suas meditações.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-850 rounded-2xl shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('line')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'line'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="btn-mood-view-continuous"
          >
            <TrendingUp size={13} />
            <span>Trajetória (21d)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('comparison')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'comparison'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="btn-mood-view-comparison"
          >
            <Sparkles size={13} />
            <span>Antes vs Depois</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10" id="mood-metrics-grid">
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block">
            Humor Médio Pós-Sessão
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-display font-bold text-slate-100 font-mono">
              {avgMood > 0 ? avgMood.toFixed(1) : '--'}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 5.0</span>
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
            <CheckCircle2 size={10} />
            <span>{avgMood >= 4 ? 'Alto Alinhamento' : 'Em Harmonização'}</span>
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block">
            Salto Vibracional Médio
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-display font-bold text-amber-400 font-mono">
              {averageUplift ? `+${averageUplift}` : '--'}
            </span>
            <span className="text-xs text-slate-500 font-mono">pts</span>
          </div>
          <span className="text-[10px] text-amber-300/80 font-mono truncate block">
            Elevação após meditar
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block">
            Estado Predominante
          </span>
          <div className="text-sm sm:text-base font-semibold text-indigo-300 truncate">
            {dominantEmoji} {dominantMoodText}
          </div>
          <span className="text-[10px] text-indigo-400/80 font-mono block">
            Frequência mais frequente
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block">
            Índice de Paz (Notas 4-5)
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-display font-bold text-purple-300 font-mono">
              {highVibeRate}%
            </span>
          </div>
          <span className="text-[10px] text-purple-400/80 font-mono block truncate">
            {highVibeSessions} de {completedCount} sessões
          </span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-72 sm:h-80 w-full relative pt-2" id="mood-recharts-canvas">
        {completedCount === 0 && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-xs rounded-2xl border border-dashed border-slate-800 text-center p-6 space-y-3">
            <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 shadow-md">
              <Smile size={26} />
            </div>
            <div className="max-w-md space-y-1">
              <h4 className="text-sm font-semibold text-slate-200">
                Seu Gráfico de Evolução Começa Hoje
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Assim que você concluir a sua primeira meditação guiada e registrar como se sente no diário, este gráfico traçará sua evolução diária até o 21º dia.
              </p>
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="moodAfterGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="moodBeforeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickFormatter={(v) => `D${v}`}
            />

            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tickLine={false}
              axisLine={false}
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(val) => {
                switch (val) {
                  case 5:
                    return '🌸';
                  case 4:
                    return '☀️';
                  case 3:
                    return '😐';
                  case 2:
                    return '⛈️';
                  case 1:
                    return '🌧️';
                  default:
                    return '';
                }
              }}
            />

            <ReferenceLine y={4} stroke="#4338ca" strokeDasharray="3 3" opacity={0.5} />

            <Tooltip content={<MoodChartCustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1 }} />

            {/* Before Session Line (Optional comparative view) */}
            {viewMode === 'comparison' && (
              <Area
                type="monotone"
                dataKey="beforeMood"
                name="Antes do Tratamento"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#moodBeforeGradient)"
                dot={{ r: 3, fill: '#f59e0b', strokeWidth: 1, stroke: '#451a03' }}
                connectNulls={true}
              />
            )}

            {/* Main Mood / After Session Line */}
            <Area
              type="monotone"
              dataKey="mood"
              name="Após o Tratamento"
              stroke="#818cf8"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#moodAfterGradient)"
              dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#0f172a' }}
              activeDot={{ r: 7, fill: '#c7d2fe', strokeWidth: 2, stroke: '#4338ca' }}
              connectNulls={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Frequency Anchor */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 relative z-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[10px] uppercase">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
            <span>Pós-Sessão (Estado Renovado)</span>
          </span>
          {viewMode === 'comparison' && (
            <span className="flex items-center gap-1.5 text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block border border-dashed border-amber-300" />
              <span>Pré-Sessão (Chegada)</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
          <span>🌸 5 = Em Paz</span>
          <span>☀️ 4 = Calmo</span>
          <span>😐 3 = Neutro</span>
          <span>⛈️ 2 = Inquieto</span>
          <span>🌧️ 1 = Pesado</span>
        </div>
      </div>
    </div>
  );
}

const MoodChartCustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (data.mood === null && data.beforeMood === null) return null;

    const getMoodBadge = (val: number | null) => {
      if (val === null) return '--';
      switch (val) {
        case 5:
          return '🌸 Completamente em Paz (5/5)';
        case 4:
          return '☀️ Calmo e Centrado (4/5)';
        case 3:
          return '😐 Neutro / Estável (3/5)';
        case 2:
          return '⛈️ Inquieto / Agitado (2/5)';
        case 1:
          return '🌧️ Pesado / Desafiador (1/5)';
        default:
          return `${val}/5`;
      }
    };

    return (
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl shadow-2xl max-w-xs space-y-2.5 z-50 text-slate-200">
        <div className="flex items-center justify-between border-b border-slate-850 pb-2">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
            {data.fullLabel}
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              data.completed
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-900 text-slate-500'
            }`}
          >
            {data.completed ? 'Sessão Concluída' : 'Pendente'}
          </span>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-100">{data.title}</h4>
          {data.focus && <p className="text-[10px] text-slate-400 mt-0.5">{data.focus}</p>}
        </div>

        {/* Before vs After block */}
        <div className="space-y-1 bg-slate-900/80 p-2.5 rounded-xl border border-slate-850 text-xs">
          {data.beforeMood !== null && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-sans">Chegada (Antes):</span>
              <span className="text-amber-300 font-medium font-mono">
                {getMoodBadge(data.beforeMood)}
              </span>
            </div>
          )}
          {data.mood !== null && (
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
              <span className="text-emerald-400 font-sans font-medium">Após Meditação:</span>
              <span className="text-emerald-300 font-bold font-mono">
                {getMoodBadge(data.mood)}
              </span>
            </div>
          )}
          {data.uplift !== null && data.uplift > 0 && (
            <div className="text-[10px] text-amber-300 font-mono pt-1 text-right">
              ✨ Salto de +{data.uplift} ponto(s) de paz
            </div>
          )}
        </div>

        {/* Sensations */}
        {data.sensations && data.sensations.length > 0 && (
          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase text-slate-500 block">Sensações:</span>
            <div className="flex flex-wrap gap-1">
              {data.sensations.map((s: string) => (
                <span
                  key={s}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Journal snippet */}
        {data.journalText && (
          <div className="pt-1.5 border-t border-slate-900">
            <span className="text-[9px] font-mono text-slate-500 uppercase block">Reflexão:</span>
            <p className="text-[10px] text-slate-400 italic line-clamp-2 leading-relaxed">
              "{data.journalText}"
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};
