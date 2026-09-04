/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen, Calendar, Smile, Heart, Sparkles, Download, ArrowLeft,
  X, Check, CheckCircle2, ChevronRight, ChevronLeft, Activity, GitBranch, Edit3, Target
} from 'lucide-react';
import { DayProgress, UserProfile, DAILY_INSIGHTS } from '../types';
import { SYSTEMIC_QUESTIONS_21D } from '../lib/systemicData';

interface DailyDiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: DayProgress[];
  userProfile?: UserProfile;
  currentDay?: number;
  onUpdateDayJournal?: (dayNumber: number, journalText: string, mood?: number, sensations?: string, gratitudes?: string) => void;
  onSaveEntry?: (dayNumber: number, journalText: string, mood?: number, sensations?: string, gratitudes?: string) => void;
  onUpdateTreatmentExpectations?: (expectations: string) => void;
  onSaveExpectations?: (expectations: string) => void;
}

export default function DailyDiaryModal({
  isOpen,
  onClose,
  progress,
  userProfile,
  currentDay = 1,
  onUpdateDayJournal,
  onSaveEntry,
  onUpdateTreatmentExpectations,
  onSaveExpectations
}: DailyDiaryModalProps) {
  const saveEntryHandler = onSaveEntry || onUpdateDayJournal || (() => {});
  const saveExpectationsHandler = onSaveExpectations || onUpdateTreatmentExpectations || (() => {});
  const [activeDay, setActiveDay] = useState<number>(Math.min(Math.max(currentDay || 1, 1), 21));
  const [editingDayText, setEditingDayText] = useState<string>('');
  const [editingMood, setEditingMood] = useState<number>(5);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isExpectationEditing, setIsExpectationEditing] = useState<boolean>(false);
  const [expectationsText, setExpectationsText] = useState<string>(userProfile?.treatmentExpectations || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentDayProgress = progress.find(p => p.dayNumber === activeDay);
  const currentInsight = DAILY_INSIGHTS[activeDay - 1] || DAILY_INSIGHTS[0];
  const currentSystemic = SYSTEMIC_QUESTIONS_21D[activeDay - 1];

  const completedCount = progress.filter(p => p.completed).length;

  const [isPurifying, setIsPurifying] = useState(false);
  const [purifyMessage, setPurifyMessage] = useState<{ title: string; text: string } | null>(null);

  const handleStartEdit = () => {
    setEditingDayText(currentDayProgress?.journalText || currentDayProgress?.afterFeeling?.notes || '');
    setEditingMood(currentDayProgress?.afterFeeling?.mood || currentDayProgress?.mood || 5);
    setIsEditing(true);
  };

  const handleSaveDayJournal = async () => {
    const rawText = editingDayText.trim();
    if (!rawText) {
      saveEntryHandler(activeDay, "", editingMood);
      setIsEditing(false);
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 2500);
      return;
    }

    setIsPurifying(true);
    let finalJournalText = rawText;
    
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch("/api/diary/purify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ text: rawText })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === "purificado_chama_violeta") {
            finalJournalText = data.cleansedText;
            setPurifyMessage({
              title: "Transmutação Concluída 💜",
              text: data.empoweringMessage
            });
            setTimeout(() => setPurifyMessage(null), 8000);
          }
        }
      }
    } catch (err) {
      console.warn("Erro ao purificar o diário:", err);
    } finally {
      setIsPurifying(false);
      saveEntryHandler(activeDay, finalJournalText, editingMood);
      setIsEditing(false);
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 2500);
    }
  };

  const handleSaveExpectations = () => {
    saveExpectationsHandler(expectationsText.trim());
    setIsExpectationEditing(false);
  };

  const getMoodLabel = (mood?: number) => {
    switch (mood) {
      case 1: return "Pesado / Angustiado";
      case 2: return "Inquieto / Cansado";
      case 3: return "Neutro / Em Busca";
      case 4: return "Calmo / Aliviado";
      case 5: return "Em Paz / Renovado";
      default: return "Pacífico";
    }
  };

  const exportFullDiary = () => {
    let content = `======================================================================\n`;
    content += `DIÁRIO DE BORDO QUÂNTICO & EVOLUÇÃO DIA A DIA\n`;
    content += `Protocolo de Cura Integrada de 21 Dias • Éverton Rodrigo Piceni\n`;
    content += `======================================================================\n`;
    content += `Consulente: ${userProfile?.fullName || userProfile?.name || 'Consulente'}\n`;
    content += `E-mail: ${userProfile?.email || 'N/A'}\n`;
    content += `Início da Jornada: ${userProfile?.startedAt ? new Date(userProfile.startedAt).toLocaleDateString('pt-BR') : 'Data não informada'}\n`;
    content += `Exportado em: ${new Date().toLocaleString('pt-BR')}\n\n`;

    content += `----------------------------------------------------------------------\n`;
    content += `O QUE SE ESPERA COM ESTE TRATAMENTO (METAS E INTENÇÃO):\n`;
    content += `${userProfile?.treatmentExpectations || expectationsText || 'Intenção de cura, equilíbrio emocional, paz interior e alinhamento vibracional.'}\n`;
    content += `----------------------------------------------------------------------\n\n`;

    progress.forEach((p) => {
      const insight = DAILY_INSIGHTS[p.dayNumber - 1];
      const systemic = SYSTEMIC_QUESTIONS_21D[p.dayNumber - 1];
      const dateStr = p.completedAt ? new Date(p.completedAt).toLocaleDateString('pt-BR') : 'Não concluído';

      content += `======================================================================\n`;
      content += `DIA ${p.dayNumber.toString().padStart(2, '0')} - ${insight?.title || 'Sessão de Cura'}\n`;
      content += `Data: ${dateStr} • Status: ${p.completed ? 'CONCLUÍDO ✨' : 'PENDENTE'}\n`;
      content += `Foco do Dia: ${insight?.focus || 'Alinhamento interior'}\n`;

      if (p.beforeFeeling) {
        content += `\n[ESTADO ANTES DA SESSÃO]\n`;
        content += `Humor: ${p.beforeFeeling.stateTitle || getMoodLabel(p.beforeFeeling.mood)} (${p.beforeFeeling.mood}/5)\n`;
        if (p.beforeFeeling.sensations && p.beforeFeeling.sensations.length > 0) {
          content += `Sensações: ${p.beforeFeeling.sensations.join(', ')}\n`;
        }
        if (p.beforeFeeling.notes) {
          content += `Anotação Inicial: ${p.beforeFeeling.notes}\n`;
        }
      }

      content += `\n[ESTADO APÓS A SESSÃO]\n`;
      content += `Humor: ${p.afterFeeling?.stateTitle || getMoodLabel(p.afterFeeling?.mood || p.mood)} (${p.afterFeeling?.mood || p.mood || 5}/5)\n`;
      if (p.afterFeeling?.sensations && p.afterFeeling.sensations.length > 0) {
        content += `Sensações: ${p.afterFeeling.sensations.join(', ')}\n`;
      }
      content += `Relato / Diário de Bordo:\n${p.afterFeeling?.notes || p.journalText || 'Sem relatos adicionais.'}\n`;

      if (p.systemicAnswer) {
        content += `\n[RESPOSTA SISTÊMICA DO DIA]\n`;
        content += `Pergunta: ${systemic?.question || 'Reflexão sistêmica'}\n`;
        content += `Resposta do Consulente: ${p.systemicAnswer}\n`;
      }
      content += `\n`;
    });

    content += `======================================================================\n`;
    content += `Gerado pelo aplicativo Protocolo de Cura Integrada de 21 Dias.\n`;
    content += `Canalizado e acompanhado por Éverton Rodrigo Piceni.\n`;
    content += `======================================================================\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diario-cliente-21dias-${userProfile?.name?.replace(/\s+/g, '-').toLowerCase() || 'cura'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto" id="daily-diary-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-slate-900 border border-indigo-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition cursor-pointer z-10"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="shrink-0 space-y-4 pb-4 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pr-8 pl-1">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-medium mb-1">
                <BookOpen size={14} className="text-indigo-400" />
                <span>REGISTRO DIÁRIO DO CLIENTE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-medium text-slate-100">
                Diário Quântico Dia a Dia
              </h2>
            </div>

            <button
              type="button"
              onClick={exportFullDiary}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95"
              id="btn-export-full-diary"
            >
              <Download size={14} />
              <span>Exportar Diário Completo (.TXT)</span>
            </button>
          </div>

          {/* O que se espera com este tratamento banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-950 to-indigo-950/40 border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold flex items-center gap-1.5">
                <Target size={14} className="text-amber-400" />
                <span>O que se espera com este tratamento (Sua Intenção & Metas):</span>
              </span>

              <button
                type="button"
                onClick={() => {
                  if (isExpectationEditing) {
                    handleSaveExpectations();
                  } else {
                    setIsExpectationEditing(true);
                  }
                }}
                className="text-xs font-mono text-purple-300 hover:text-purple-200 flex items-center gap-1 cursor-pointer transition underline"
              >
                {isExpectationEditing ? '💾 Salvar Intenção' : '✏️ Editar Metas'}
              </button>
            </div>

            {isExpectationEditing ? (
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={expectationsText}
                  onChange={(e) => setExpectationsText(e.target.value)}
                  placeholder="Ex: Alívio da ansiedade crônica, cura de dores na coluna, paz mental no sono, honrar meus pais e reconexão com meu propósito de vida..."
                  className="w-full bg-slate-900 border border-purple-500/50 text-slate-100 rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-purple-400"
                />
                <button
                  type="button"
                  onClick={handleSaveExpectations}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{userProfile?.treatmentExpectations || expectationsText || 'Busco alívio de sintomas físicos e emocionais, pacificação da mente e conexão profunda com minha verdadeira essência divina.'}"
              </p>
            )}
          </div>

          {/* Days selector bar */}
          <div className="flex items-center justify-between gap-2 pt-1">
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
                const p = progress.find(prog => prog.dayNumber === dNum);
                const isDone = Boolean(p?.completed);
                const hasNotes = Boolean(p?.journalText || p?.afterFeeling?.notes || p?.systemicAnswer);

                return (
                  <button
                    key={dNum}
                    onClick={() => {
                      setActiveDay(dNum);
                      setIsEditing(false);
                    }}
                    className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center relative shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-md shadow-indigo-600/30'
                        : isDone
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                        : hasNotes
                        ? 'bg-amber-950/50 border border-amber-500/40 text-amber-300'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {dNum}
                    {isDone && (
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

        {/* Day details content (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-4">
          {/* Day Status Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/30">
                  DIA {activeDay.toString().padStart(2, '0')}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-100">
                  {currentInsight.title}
                </h3>
              </div>

              {currentDayProgress?.completed ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-semibold border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Concluído
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-mono">
                  Pendente
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {currentInsight.description}
            </p>

            {/* Foco de Cura */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2 text-xs text-slate-300">
              <Sparkles size={14} className="text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Foco Sagrado:</strong> {currentInsight.focus}</span>
            </div>
          </div>

          {/* Check-ins Antes e Depois */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Antes da Meditação */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                [1] ESTADO ANTES DO TRATAMENTO:
              </span>
              {currentDayProgress?.beforeFeeling ? (
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-amber-300">
                      {currentDayProgress.beforeFeeling.stateTitle || getMoodLabel(currentDayProgress.beforeFeeling.mood)}
                    </span>
                    <span className="font-mono text-slate-500">{currentDayProgress.beforeFeeling.mood}/5</span>
                  </div>
                  {currentDayProgress.beforeFeeling.sensations && currentDayProgress.beforeFeeling.sensations.length > 0 && (
                    <p className="text-[11px] text-slate-400">
                      Sensações: {currentDayProgress.beforeFeeling.sensations.join(', ')}
                    </p>
                  )}
                  {currentDayProgress.beforeFeeling.notes && (
                    <p className="text-[11px] text-slate-300 italic">
                      "{currentDayProgress.beforeFeeling.notes}"
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Nenhum check-in inicial registrado neste dia.
                </p>
              )}
            </div>

            {/* Depois da Meditação */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                [2] ESTADO APÓS O TRATAMENTO:
              </span>
              {currentDayProgress?.afterFeeling || currentDayProgress?.mood ? (
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-300">
                      {currentDayProgress.afterFeeling?.stateTitle || getMoodLabel(currentDayProgress.afterFeeling?.mood || currentDayProgress.mood)}
                    </span>
                    <span className="font-mono text-emerald-400">
                      {currentDayProgress.afterFeeling?.mood || currentDayProgress.mood || 5}/5
                    </span>
                  </div>
                  {currentDayProgress.afterFeeling?.sensations && currentDayProgress.afterFeeling.sensations.length > 0 && (
                    <p className="text-[11px] text-slate-400">
                      Sensações: {currentDayProgress.afterFeeling.sensations.join(', ')}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-300 italic">
                    "{currentDayProgress.afterFeeling?.notes || currentDayProgress.journalText || 'Sessão concluída em paz.'}"
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Sessão ainda não concluída.
                </p>
              )}
            </div>
          </div>

          {/* Anotação Livre / Edição do Diário de Bordo */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                <Edit3 size={14} className="text-indigo-400" />
                <span>Reflexão & Diário do Dia {activeDay}:</span>
              </span>

              {!isEditing && (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="text-xs font-mono text-indigo-400 hover:text-indigo-300 cursor-pointer underline flex items-center gap-1"
                >
                  ✏️ Editar Anotação
                </button>
              )}
            </div>

            {purifyMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-fuchsia-950/40 border border-fuchsia-500/50 rounded-xl space-y-1"
              >
                <div className="text-xs font-bold text-fuchsia-300">{purifyMessage.title}</div>
                <div className="text-xs text-fuchsia-200">{purifyMessage.text}</div>
              </motion.div>
            )}

            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  rows={4}
                  value={editingDayText}
                  onChange={(e) => setEditingDayText(e.target.value)}
                  placeholder="Escreva suas percepções, sonhos, pensamentos e transformações deste dia..."
                  disabled={isPurifying}
                  className="w-full bg-slate-900 border border-indigo-500/50 text-slate-100 rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-indigo-400 leading-relaxed disabled:opacity-50"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Humor Geral:</span>
                    <select
                      value={editingMood}
                      onChange={(e) => setEditingMood(parseInt(e.target.value))}
                      disabled={isPurifying}
                      className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1 disabled:opacity-50"
                    >
                      <option value={1}>1 - Pesado</option>
                      <option value={2}>2 - Inquieto</option>
                      <option value={3}>3 - Neutro</option>
                      <option value={4}>4 - Calmo</option>
                      <option value={5}>5 - Em Paz</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      disabled={isPurifying}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveDayJournal}
                      disabled={isPurifying}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isPurifying ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Transmutando...</span>
                        </>
                      ) : (
                        <span>Salvar Diário</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-850">
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {currentDayProgress?.journalText || currentDayProgress?.afterFeeling?.notes || 'Nenhuma reflexão digitada ainda para este dia. Clique em "Editar Anotação" acima para escrever.'}
                </p>
              </div>
            )}
          </div>

          {/* Resposta Sistêmica Registrada */}
          {currentDayProgress?.systemicAnswer && (
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1.5">
                <GitBranch size={13} />
                <span>Resposta à Pergunta Sistêmica do Dia:</span>
              </span>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{currentDayProgress.systemicAnswer}"
              </p>
            </div>
          )}

          {/* Guia das 3 Fases do Tratamento */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
              🌿 O QUE ESPERAR DURANTE OS 21 DIAS:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 text-[11px] block">Fase 1 (Dias 1 a 7)</span>
                <span className="text-[10px] text-slate-400 font-semibold block">Desintoxicação & Aterramento</span>
                <p className="text-[10px] text-slate-500 leading-snug">Sonolência, liberação de toxinas emocionais e estabilização do campo.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="font-bold text-indigo-400 text-[11px] block">Fase 2 (Dias 8 a 14)</span>
                <span className="text-[10px] text-slate-400 font-semibold block">Transmutação & Alinhamento</span>
                <p className="text-[10px] text-slate-500 leading-snug">Aumento da energia vital, clareza mental e desfazimento de nós antigos.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 text-[11px] block">Fase 3 (Dias 15 a 21)</span>
                <span className="text-[10px] text-slate-400 font-semibold block">Soberania & Paz Profunda</span>
                <p className="text-[10px] text-slate-500 leading-snug">Regeneração celular, gratidão cósmica e selamento vibracional.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400 font-mono font-bold">{completedCount} de 21 Dias</span>
            <span>Completados</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition"
          >
            Fechar Diário
          </button>
        </div>
      </motion.div>
    </div>
  );
}
