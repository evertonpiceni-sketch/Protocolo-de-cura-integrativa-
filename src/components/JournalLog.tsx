/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Smile, Calendar, ArrowLeft, Search, Heart, Download } from 'lucide-react';
import { DayProgress, DAILY_INSIGHTS } from '../types';

interface JournalLogProps {
  progress: DayProgress[];
  onClose: () => void;
}

export default function JournalLog({ progress, onClose }: JournalLogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const completedEntries = progress.filter(d => d.completed);
  
  // Filter by search query
  const filteredEntries = completedEntries.filter(entry => {
    const insight = DAILY_INSIGHTS[entry.dayNumber - 1];
    const matchTitle = insight?.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchJournal = entry.journalText?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTitle || matchJournal;
  });

  const getMoodLabel = (mood?: number) => {
    if (!mood) return "Pacífico";
    switch (mood) {
      case 1: return "Pesado";
      case 2: return "Inquieto";
      case 3: return "Neutro";
      case 4: return "Calmo";
      case 5: return "Em Paz";
      default: return "Pacífico";
    }
  };

  const getMoodColor = (mood?: number) => {
    if (!mood) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    switch (mood) {
      case 1: return "text-red-400 bg-red-500/10 border-red-500/20";
      case 2: return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case 3: return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case 4: return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
      case 5: return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      default: return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    }
  };

  const exportToTxt = () => {
    if (completedEntries.length === 0) return;

    let content = `==================================================\n`;
    content += `DIÁRIO DE CURA INTEGRADA - HISTÓRICO DE REFLEXÕES\n`;
    content += `==================================================\n`;
    content += `Exportado em: ${new Date().toLocaleString('pt-BR')}\n\n`;

    completedEntries.forEach((entry) => {
      const insight = DAILY_INSIGHTS[entry.dayNumber - 1];
      const dateStr = entry.completedAt
        ? new Date(entry.completedAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })
        : "Sem data";

      content += `--------------------------------------------------\n`;
      content += `DIA ${entry.dayNumber.toString().padStart(2, '0')} - ${insight?.title || "Sessão de Cura"}\n`;
      content += `Data: ${dateStr}\n`;
      content += `Foco de Cura: ${insight?.focus || "N/A"}\n`;
      
      if (entry.beforeFeeling) {
        content += `\n[ANTES DO TRATAMENTO]\n`;
        content += `Estado: ${entry.beforeFeeling.stateTitle || getMoodLabel(entry.beforeFeeling.mood)} (Nota: ${entry.beforeFeeling.mood}/5)\n`;
        if (entry.beforeFeeling.sensations && entry.beforeFeeling.sensations.length > 0) {
          content += `Sensações: ${entry.beforeFeeling.sensations.join(', ')}\n`;
        }
        if (entry.beforeFeeling.notes) {
          content += `Relato Inicial: ${entry.beforeFeeling.notes}\n`;
        }
      }

      content += `\n[APÓS O TRATAMENTO]\n`;
      content += `Estado Final: ${entry.afterFeeling?.stateTitle || getMoodLabel(entry.mood)} (Nota: ${entry.afterFeeling?.mood || entry.mood || 5}/5)\n`;
      if (entry.afterFeeling?.sensations && entry.afterFeeling.sensations.length > 0) {
        content += `Sensações: ${entry.afterFeeling.sensations.join(', ')}\n`;
      }
      content += `Relato / Reflexão:\n${entry.afterFeeling?.notes || entry.journalText || "Sessão concluída sem anotações adicionais."}\n`;
      content += `--------------------------------------------------\n\n`;
    });

    content += `==================================================\n`;
    content += `Gerado pelo aplicativo de Cura Integrada.\n`;
    content += `Sua cura começa de dentro para fora.\n`;
    content += `==================================================\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diario-de-cura-integrada-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6" id="journal-dashboard-view">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition cursor-pointer"
            id="btn-back-from-journal"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-display font-medium text-slate-100 flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-400" />
              Diário de Cura Integrada
            </h1>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Reflexões e insights salvos durante as sessões do protocolo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
            {completedEntries.length} {completedEntries.length === 1 ? 'Sessão' : 'Sessões'}
          </span>
          {completedEntries.length > 0 && (
            <button
              onClick={exportToTxt}
              className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 cursor-pointer transition shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 border border-indigo-500/30 font-sans"
              id="btn-export-journal"
              title="Exportar reflexões como arquivo de texto (.txt)"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Exportar Diário</span>
              <span className="sm:hidden">TXT</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and search */}
      {completedEntries.length > 0 && (
        <div className="relative" id="journal-search-container">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar nos diários de cura (Ex: clareza, insônia, paz...)"
            className="w-full bg-slate-900 border border-slate-850 focus:border-indigo-500 text-slate-200 rounded-xl py-3 pl-11 pr-4 text-xs outline-none transition"
          />
        </div>
      )}

      {/* Main timeline listing */}
      <div className="space-y-4" id="journal-timeline-list">
        {completedEntries.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16 space-y-4 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6" id="journal-empty-state">
            <div className="w-14 h-14 bg-slate-900 border border-slate-800 text-slate-600 rounded-2xl flex items-center justify-center mx-auto">
              <BookOpen size={22} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-display font-medium text-slate-300">
                O Diário está em silêncio...
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Ao completar a meditação guiada de hoje, você poderá escrever e registrar como se sente aqui.
              </p>
            </div>
            
            <div className="max-w-xs mx-auto border-t border-slate-800/60 pt-4 text-slate-500 text-[11px] italic font-sans">
              "Você é perfeito... Você é luz... Você é um reflexo da Fonte Criadora."
            </div>
          </div>
        ) : filteredEntries.length === 0 ? (
          /* Search mismatch state */
          <div className="text-center py-12 text-slate-500 text-xs font-sans">
            Nenhuma reflexão encontrada para a pesquisa: "{searchQuery}"
          </div>
        ) : (
          /* Journals log timeline */
          filteredEntries.map((entry) => {
            const insight = DAILY_INSIGHTS[entry.dayNumber - 1];
            const dateStr = entry.completedAt
              ? new Date(entry.completedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })
              : "Sem data";

            return (
              <div
                key={entry.dayNumber}
                className="bg-slate-900 border border-slate-850/60 rounded-2xl p-5 space-y-4 hover:border-slate-800 transition"
                id={`journal-log-entry-${entry.dayNumber}`}
              >
                {/* Header card metrics */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-950 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded uppercase">
                        Dia {entry.dayNumber.toString().padStart(2, '0')}
                      </span>
                      <h3 className="text-xs font-display font-medium text-slate-200">
                        {insight?.title || "Sessão de Cura"}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                      <Calendar size={10} />
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  {/* Mood Rating status label */}
                  <div className={`text-[9px] font-mono px-2.5 py-1 rounded-full border uppercase tracking-wider ${getMoodColor(entry.mood)}`}>
                    Estado: {getMoodLabel(entry.mood)}
                  </div>
                </div>

                {/* Before vs After Comparative Block */}
                {entry.beforeFeeling ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-850">
                    {/* Before Card */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">1. Antes do Tratamento</span>
                        <span className="text-[10px] font-mono text-slate-400">Nota {entry.beforeFeeling.mood}/5</span>
                      </div>
                      <div className="text-slate-300 font-medium text-xs">
                        {entry.beforeFeeling.stateTitle || getMoodLabel(entry.beforeFeeling.mood)}
                      </div>
                      {entry.beforeFeeling.sensations && entry.beforeFeeling.sensations.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {entry.beforeFeeling.sensations.map(s => (
                            <span key={s} className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[9px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      {entry.beforeFeeling.notes && (
                        <p className="text-[11px] text-slate-400 italic bg-slate-900/50 p-2 rounded-lg border border-slate-850/80">
                          "{entry.beforeFeeling.notes}"
                        </p>
                      )}
                    </div>

                    {/* After Card */}
                    <div className="space-y-1.5 text-xs border-t md:border-t-0 md:border-l border-slate-850 pt-2 md:pt-0 md:pl-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase">2. Após o Tratamento</span>
                        <span className="text-[10px] font-mono text-emerald-400">Nota {entry.afterFeeling?.mood || entry.mood || 5}/5</span>
                      </div>
                      <div className="text-emerald-300 font-medium text-xs">
                        {entry.afterFeeling?.stateTitle || getMoodLabel(entry.mood)}
                      </div>
                      {entry.afterFeeling?.sensations && entry.afterFeeling.sensations.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {entry.afterFeeling.sensations.map(s => (
                            <span key={s} className="px-1.5 py-0.2 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[9px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-[11px] text-slate-200 leading-relaxed bg-emerald-950/20 p-2 rounded-lg border border-emerald-500/20">
                        {entry.afterFeeling?.notes || entry.journalText || "Sessão concluída com sucesso e selada no DNA."}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Standard Journal Content */
                  <div className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                    {entry.journalText ? (
                      entry.journalText
                    ) : (
                      <span className="text-slate-600 italic">Sessão concluída com sucesso sem anotações extras.</span>
                    )}
                  </div>
                )}

                {/* Healing Focus Anchor footer */}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
                  <Heart size={10} className="text-indigo-500/70" />
                  <span><strong>Foco:</strong> {insight?.focus}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
