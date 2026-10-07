/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Award, X, Printer, FileText, BookOpenCheck } from 'lucide-react';
import { UserProfile, DayProgress } from '../types';

interface ProReportCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  progress: DayProgress[];
}

export default function ProReportCertificateModal({
  isOpen,
  onClose,
  userProfile,
  progress
}: ProReportCertificateModalProps) {
  const [activeTab, setActiveTab] = useState<'certificate' | 'report'>('certificate');

  if (!isOpen) return null;

  const completedDays = progress.filter(item => item.completed);
  const completedDaysCount = completedDays.length;
  const journeyCompleted = completedDaysCount >= 21;
  const moodEntries = completedDays.filter(item => typeof item.mood === 'number');
  const averageMood = moodEntries.length
    ? moodEntries.reduce((sum, item) => sum + Number(item.mood), 0) / moodEntries.length
    : null;
  const journalEntries = progress.filter(item => item.journalText?.trim());

  const issueDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-[#2A2420]/30 backdrop-blur-md overflow-y-auto overscroll-contain"
      id="pro-certificate-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Relatório da jornada"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-3xl bg-[#FBF8F2] border border-[#B88736]/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden my-1 sm:my-6 max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar relatório"
          className="absolute top-4 right-4 w-11 h-11 rounded-xl bg-[#F5EFE4] border border-[#E5DAC6] text-[#5C5248] hover:text-[#2A2420] hover:bg-[#EFE4D3] flex items-center justify-center transition cursor-pointer z-10 print:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
        >
          <X size={18} />
        </button>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 pr-12 print:hidden" role="tablist" aria-label="Visualização do relatório">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'certificate'}
            onClick={() => setActiveTab('certificate')}
            className={`min-h-11 px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30 ${
              activeTab === 'certificate'
                ? 'bg-[#B88736]/12 border-[#B88736]/40 text-[#8F631E] shadow-sm'
                : 'bg-white/70 border-[#E5DAC6] text-[#5C5248] hover:text-[#2A2420]'
            }`}
          >
            <Award size={15} />
            <span>{journeyCompleted ? 'Registro de Conclusão' : 'Registro da Jornada'}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'report'}
            onClick={() => setActiveTab('report')}
            className={`min-h-11 px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30 ${
              activeTab === 'report'
                ? 'bg-[#B88736]/12 border-[#B88736]/40 text-[#8F631E] shadow-sm'
                : 'bg-white/70 border-[#E5DAC6] text-[#5C5248] hover:text-[#2A2420]'
            }`}
          >
            <FileText size={15} />
            <span>Relatório da Jornada</span>
          </button>
        </div>

        {activeTab === 'certificate' ? (
          <div className="space-y-4">
            <section className="relative overflow-hidden rounded-[1.75rem] border-2 border-[#B88736]/35 bg-gradient-to-br from-white via-[#FBF8F2] to-[#F3EBDD] p-6 text-center shadow-[0_18px_55px_rgba(89,70,43,.12)] md:p-10">
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#B88736]/55" aria-hidden="true" />
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#B88736]/55" aria-hidden="true" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#B88736]/55" aria-hidden="true" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#B88736]/55" aria-hidden="true" />

              <div className="relative z-10 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#B88736]/35 bg-[#B88736]/10 text-[#8F631E]">
                  {journeyCompleted ? <Award size={28} /> : <BookOpenCheck size={27} />}
                </div>
                <p className="text-[11px] font-mono font-semibold uppercase tracking-[.18em] text-[#8F631E]">
                  {journeyCompleted ? 'Registro de conclusão' : 'Registro de acompanhamento'}
                </p>
                <h1 className="font-display text-2xl font-semibold text-[#2A2420] md:text-3xl">
                  Protocolo da Transformação
                </h1>
                <p className="mx-auto max-w-xl text-xs leading-relaxed text-[#5C5248]">
                  {journeyCompleted
                    ? 'Este registro confirma que a pessoa abaixo marcou como concluídos os 21 dias da jornada no aplicativo.'
                    : `Este registro mostra o andamento atual da jornada: ${completedDaysCount} de 21 dias marcados como concluídos.`}
                </p>

                <div className="mx-auto max-w-md border-y border-[#B88736]/25 py-3">
                  <h2 className="font-display text-xl font-semibold text-[#2A2420] md:text-2xl">
                    {userProfile.fullName || userProfile.name}
                  </h2>
                </div>

                <p className="mx-auto max-w-xl text-xs leading-relaxed text-[#5C5248]">
                  A jornada reúne práticas de presença, aterramento, vitalidade, transmutação simbólica, acolhimento e integração espiritual. Este documento registra apenas o progresso salvo no aplicativo e não representa certificação profissional, avaliação clínica ou comprovação externa.
                </p>

                <div className="mx-auto grid max-w-md grid-cols-1 gap-3 border-t border-[#E5DAC6] pt-5 text-left sm:grid-cols-2">
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-[#85786C]">Condução da jornada</span>
                    <strong className="block text-xs text-[#2A2420]">Éverton Rodrigo Piceni</strong>
                  </div>
                  <div className="sm:text-right">
                    <span className="block text-[10px] font-mono uppercase text-[#85786C]">Data do registro</span>
                    <strong className="block text-xs text-[#2A2420]">{issueDate}</strong>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-end pt-2 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-11 px-4 py-2.5 bg-[#B88736] hover:bg-[#8F631E] text-white font-medium rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35"
              >
                <Printer size={15} />
                <span>Imprimir / Salvar em PDF</span>
              </button>
            </div>
          </div>
        ) : (
          <section className="space-y-4 rounded-2xl border border-[#E5DAC6] bg-white/85 p-4 sm:p-5">
            <div className="flex flex-col gap-3 border-b border-[#E5DAC6] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#2A2420]">Resumo dos 21 dias</h3>
                <p className="text-xs text-[#5C5248]">Dados calculados somente a partir do que foi registrado no aplicativo.</p>
              </div>
              <div className="rounded-lg border border-[#B88736]/30 bg-[#B88736]/10 px-3 py-1 text-xs font-mono text-[#8F631E]">
                {completedDaysCount} de 21 dias concluídos
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#E5DAC6] bg-[#FBF8F2] p-3 text-center">
                <span className="block text-[10px] font-mono uppercase text-[#5C5248]">Humor médio registrado</span>
                <span className="mt-1 block text-xl font-bold text-[#2D4A3E]">
                  {averageMood === null ? '—' : `${averageMood.toFixed(1)} / 5`}
                </span>
              </div>
              <div className="rounded-xl border border-[#E5DAC6] bg-[#FBF8F2] p-3 text-center">
                <span className="block text-[10px] font-mono uppercase text-[#5C5248]">Sequência atual</span>
                <span className="mt-1 block text-xl font-bold text-[#8F631E]">{userProfile.currentStreak || 0} dias</span>
              </div>
              <div className="rounded-xl border border-[#E5DAC6] bg-[#FBF8F2] p-3 text-center">
                <span className="block text-[10px] font-mono uppercase text-[#5C5248]">Registros no diário</span>
                <span className="mt-1 block text-xl font-bold text-[#B88736]">{journalEntries.length}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-[#5C5248]">Diário de Reconexão</span>
              <div className="max-h-56 space-y-2 overflow-y-auto overscroll-contain pr-1">
                {journalEntries.length ? journalEntries.map(item => (
                  <article key={item.dayNumber} className="rounded-xl border border-[#E5DAC6] bg-[#FBF8F2]/90 p-3 text-xs">
                    <div className="mb-1 flex items-center justify-between gap-3 text-[10px] font-mono text-[#8F631E]">
                      <span>Dia {item.dayNumber}</span>
                      <span>{item.completedAt ? new Date(item.completedAt).toLocaleDateString('pt-BR') : 'Sem data de conclusão'}</span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed text-[#5C5248]">{item.journalText}</p>
                  </article>
                )) : (
                  <div className="rounded-xl bg-[#FBF8F2] p-4 text-center text-xs text-[#85786C]">
                    Nenhuma anotação foi registrada no Diário de Reconexão até agora.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </motion.div>
    </div>
  );
}
