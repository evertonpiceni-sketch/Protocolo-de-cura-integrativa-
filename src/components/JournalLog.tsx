/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, Calendar, Download, Search } from 'lucide-react';
import { DAILY_INSIGHTS, DayProgress } from '../types';
import { getLocalDateString } from '../utils/date';

interface JournalLogProps {
  progress: DayProgress[];
  onClose: () => void;
}

const MOOD_LABELS: Record<number, string> = {
  1: 'Pesado',
  2: 'Inquieto',
  3: 'Neutro',
  4: 'Calmo',
  5: 'Em paz'
};

function moodLabel(value?: number) {
  return typeof value === 'number' ? MOOD_LABELS[value] || `Nota ${value}` : null;
}

function moodClasses(value?: number) {
  if (typeof value !== 'number') return 'border-[#E5DAC6] bg-[#F5EFE4] text-[#85786C]';
  if (value <= 1) return 'border-rose-200 bg-rose-50 text-rose-700';
  if (value === 2) return 'border-amber-200 bg-amber-50 text-amber-700';
  if (value === 3) return 'border-[#E5DAC6] bg-white text-[#5C5248]';
  return 'border-emerald-200 bg-emerald-50 text-emerald-700';
}

export default function JournalLog({ progress, onClose }: JournalLogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const completedEntries = useMemo(() => progress.filter(item => item.completed), [progress]);
  const normalizedSearch = searchQuery.trim().toLocaleLowerCase('pt-BR');

  const filteredEntries = completedEntries.filter(entry => {
    if (!normalizedSearch) return true;
    const insight = DAILY_INSIGHTS[entry.dayNumber - 1];
    const searchable = [
      insight?.title,
      insight?.focus,
      entry.journalText,
      entry.beforeFeeling?.notes,
      entry.afterFeeling?.notes,
      entry.beforeFeeling?.stateTitle,
      entry.afterFeeling?.stateTitle
    ].filter(Boolean).join(' ').toLocaleLowerCase('pt-BR');
    return searchable.includes(normalizedSearch);
  });

  const exportToTxt = () => {
    if (!completedEntries.length) return;

    const lines: string[] = [
      '==================================================',
      'DIÁRIO DE RECONEXÃO - HISTÓRICO DE PERCEPÇÕES',
      '==================================================',
      `Exportado em: ${new Date().toLocaleString('pt-BR')}`,
      ''
    ];

    completedEntries.forEach(entry => {
      const insight = DAILY_INSIGHTS[entry.dayNumber - 1];
      const date = entry.completedAt
        ? new Date(entry.completedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'Sem data registrada';

      lines.push('--------------------------------------------------');
      lines.push(`DIA ${String(entry.dayNumber).padStart(2, '0')} - ${insight?.title || 'Jornada diária'}`);
      lines.push(`Data: ${date}`);
      if (insight?.focus) lines.push(`Intenção do dia: ${insight.focus}`);

      if (entry.beforeFeeling) {
        lines.push('', '[COMO EU ESTAVA]');
        if (entry.beforeFeeling.stateTitle) lines.push(`Estado: ${entry.beforeFeeling.stateTitle}`);
        if (typeof entry.beforeFeeling.mood === 'number') lines.push(`Nota registrada: ${entry.beforeFeeling.mood}/5`);
        if (entry.beforeFeeling.sensations?.length) lines.push(`Sensações: ${entry.beforeFeeling.sensations.join(', ')}`);
        if (entry.beforeFeeling.notes) lines.push(`Relato inicial: ${entry.beforeFeeling.notes}`);
      }

      const finalMood = entry.afterFeeling?.mood ?? entry.mood;
      const hasAfterData = Boolean(entry.afterFeeling || entry.journalText || typeof finalMood === 'number');
      if (hasAfterData) {
        lines.push('', '[COMO ESTOU AGORA]');
        if (entry.afterFeeling?.stateTitle) lines.push(`Estado: ${entry.afterFeeling.stateTitle}`);
        if (typeof finalMood === 'number') lines.push(`Nota registrada: ${finalMood}/5`);
        if (entry.afterFeeling?.sensations?.length) lines.push(`Sensações: ${entry.afterFeeling.sensations.join(', ')}`);
        const note = entry.afterFeeling?.notes || entry.journalText;
        if (note) lines.push(`Relato / reflexão: ${note}`);
      }

      lines.push('--------------------------------------------------', '');
    });

    lines.push('==================================================', 'Gerado pelo Protocolo da Transformação.', 'O arquivo contém somente informações registradas na jornada.', '==================================================');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diario-de-reconexao-${getLocalDateString()}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6" id="journal-dashboard-view">
      <header className="flex flex-col gap-4 border-b border-[#E5DAC6] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onClose} aria-label="Voltar" id="btn-back-from-journal" className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5DAC6] bg-[#FBF8F2] text-[#5C5248] transition hover:bg-[#F5EFE4] hover:text-[#2A2420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30">
            <ArrowLeft size={17} />
          </button>
          <div>
            <h1 className="flex items-center gap-2 font-display text-xl font-semibold text-[#2A2420]"><BookOpen size={20} className="text-[#B88736]" />Diário de Reconexão</h1>
            <p className="mt-1 text-xs text-[#85786C]">Reflexões e percepções registradas ao longo da sua jornada.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-[#B88736]/20 bg-[#B88736]/10 px-3 py-1.5 text-xs font-mono text-[#8F631E]">{completedEntries.length} {completedEntries.length === 1 ? 'dia concluído' : 'dias concluídos'}</span>
          {completedEntries.length > 0 && (
            <button type="button" onClick={exportToTxt} id="btn-export-journal" className="flex min-h-11 items-center gap-1.5 rounded-xl bg-[#B88736] px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#8F631E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35">
              <Download size={14} /><span>Exportar</span>
            </button>
          )}
        </div>
      </header>

      {completedEntries.length > 0 && (
        <label className="relative block" id="journal-search-container">
          <span className="sr-only">Pesquisar no Diário de Reconexão</span>
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#85786C]" />
          <input type="search" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Pesquisar por palavra, tema ou percepção..." className="w-full rounded-xl border border-[#E5DAC6] bg-[#FBF8F2] py-3 pl-11 pr-4 text-xs text-[#2A2420] outline-none transition placeholder:text-[#85786C] focus:border-[#B88736] focus:ring-2 focus:ring-[#B88736]/15" />
        </label>
      )}

      <main className="space-y-4" id="journal-timeline-list">
        {!completedEntries.length ? (
          <section className="rounded-3xl border border-[#E5DAC6] bg-[#FBF8F2] px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E5DAC6] bg-white text-[#85786C]"><BookOpen size={23} /></div>
            <h2 className="mt-4 font-display text-base font-semibold text-[#5C5248]">Seu diário começa com a jornada</h2>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-[#85786C]">Quando você concluir um dia e registrar uma percepção, ela aparecerá aqui.</p>
          </section>
        ) : !filteredEntries.length ? (
          <div className="rounded-2xl border border-[#E5DAC6] bg-[#FBF8F2] py-10 text-center text-xs text-[#85786C]">Nenhuma reflexão encontrada para “{searchQuery}”.</div>
        ) : filteredEntries.map(entry => {
          const insight = DAILY_INSIGHTS[entry.dayNumber - 1];
          const date = entry.completedAt ? new Date(entry.completedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Sem data registrada';
          const finalMood = entry.afterFeeling?.mood ?? entry.mood;
          const finalLabel = entry.afterFeeling?.stateTitle || moodLabel(finalMood);
          return (
            <article key={entry.dayNumber} id={`journal-log-entry-${entry.dayNumber}`} className="space-y-4 rounded-2xl border border-[#E5DAC6] bg-[#FBF8F2] p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E5DAC6] pb-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2"><span className="rounded-md border border-[#B88736]/20 bg-[#B88736]/10 px-2 py-0.5 text-[10px] font-mono uppercase text-[#8F631E]">Dia {String(entry.dayNumber).padStart(2, '0')}</span><h2 className="text-sm font-semibold text-[#2A2420]">{insight?.title || 'Jornada diária'}</h2></div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-[#85786C]"><Calendar size={11} />{date}</div>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-mono ${moodClasses(finalMood)}`}>{finalLabel ? `Estado: ${finalLabel}` : 'Humor não registrado'}</span>
              </div>

              {entry.beforeFeeling && (
                <section className="rounded-xl border border-[#E5DAC6] bg-white/75 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-[10px] font-mono uppercase text-[#85786C]">Como eu estava</span>{typeof entry.beforeFeeling.mood === 'number' && <span className="text-[10px] font-mono text-[#5C5248]">Nota {entry.beforeFeeling.mood}/5</span>}</div>
                  {entry.beforeFeeling.stateTitle && <p className="mt-2 text-xs font-semibold text-[#5C5248]">{entry.beforeFeeling.stateTitle}</p>}
                  {entry.beforeFeeling.sensations?.length ? <div className="mt-2 flex flex-wrap gap-1">{entry.beforeFeeling.sensations.map(item => <span key={item} className="rounded-md border border-[#E5DAC6] bg-[#FBF8F2] px-1.5 py-0.5 text-[9px] text-[#5C5248]">{item}</span>)}</div> : null}
                  {entry.beforeFeeling.notes && <p className="mt-2 whitespace-pre-wrap rounded-lg bg-[#FBF8F2] p-2 text-[11px] leading-relaxed text-[#5C5248]">{entry.beforeFeeling.notes}</p>}
                </section>
              )}

              {(entry.afterFeeling || entry.journalText || typeof finalMood === 'number') && (
                <section className="rounded-xl border border-emerald-200 bg-emerald-50/65 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-[10px] font-mono uppercase text-emerald-700">Como estou agora</span>{typeof finalMood === 'number' && <span className="text-[10px] font-mono text-emerald-700">Nota {finalMood}/5</span>}</div>
                  {entry.afterFeeling?.stateTitle && <p className="mt-2 text-xs font-semibold text-emerald-800">{entry.afterFeeling.stateTitle}</p>}
                  {entry.afterFeeling?.sensations?.length ? <div className="mt-2 flex flex-wrap gap-1">{entry.afterFeeling.sensations.map(item => <span key={item} className="rounded-md border border-emerald-200 bg-white/70 px-1.5 py-0.5 text-[9px] text-emerald-700">{item}</span>)}</div> : null}
                  {(entry.afterFeeling?.notes || entry.journalText) && <p className="mt-2 whitespace-pre-wrap rounded-lg bg-white/70 p-2 text-[11px] leading-relaxed text-[#2A2420]">{entry.afterFeeling?.notes || entry.journalText}</p>}
                </section>
              )}
            </article>
          );
        })}
      </main>
    </div>
  );
}
