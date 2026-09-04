/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Award, Sparkles, X, Download, Printer, Shield, CheckCircle2,
  Calendar, Heart, Flame, Sun, Star, FileText
} from 'lucide-react';
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
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const completedDaysCount = progress.filter(p => p.completed).length;
  const averageMood = progress
    .filter(p => p.completed && p.mood)
    .reduce((acc, curr, _, arr) => acc + (curr.mood || 5) / (arr.length || 1), 0);

  const issueDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const authString = userProfile.login || userProfile.email || userProfile.name || 'guest';
  const authCode = `CIP-${Math.abs(authString.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(16).toUpperCase()}-2026`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto" id="pro-certificate-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-3xl bg-slate-900 border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden my-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition cursor-pointer z-10 print:hidden"
        >
          <X size={16} />
        </button>

        {/* Tab switch */}
        <div className="flex items-center justify-center gap-2 mb-6 print:hidden">
          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'certificate'
                ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award size={15} />
            <span>Certificado Oficial</span>
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'report'
                ? 'bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText size={15} />
            <span>Relatório Quântico de Alinhamento</span>
          </button>
        </div>

        {activeTab === 'certificate' ? (
          /* CERTIFICATE VIEW */
          <div className="space-y-4">
            <div
              ref={certificateRef}
              className="bg-gradient-to-b from-amber-950/20 via-slate-950 to-amber-950/30 border-2 border-amber-500/40 rounded-2xl p-6 md:p-10 text-center relative overflow-hidden shadow-2xl"
            >
              {/* Sacred border ornaments */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/70" />
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/70" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/70" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/70" />

              <div className="space-y-3 relative z-10">
                <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto text-amber-400 shadow-inner">
                  <Award size={28} />
                </div>

                <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-semibold">
                  Certificado de Conclusão e Alinhamento
                </span>

                <h1 className="text-2xl md:text-3xl font-serif text-slate-100 font-bold tracking-wide">
                  Protocolo de Cura Integrada
                </h1>

                <p className="text-xs text-slate-400 max-w-lg mx-auto">
                  Certificamos para todos os devidos fins de elevação da consciência que
                </p>

                <div className="py-2 border-b border-amber-500/30 max-w-md mx-auto">
                  <h2 className="text-xl md:text-2xl font-display font-semibold text-amber-200">
                    {userProfile.fullName || userProfile.name}
                  </h2>
                </div>

                <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed pt-1">
                  concluiu com êxito os <strong>21 Dias do Protocolo Multidimensional de Cura e Blindagem Energética</strong>, integrando as etapas sagradas de Aterramento, Vitalidade Celular, Transmutação pela Chama Violeta, Bálsamo do Amor e Selamento Espiritual.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-6 max-w-md mx-auto text-left border-t border-slate-800">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Canalização e Direção</span>
                    <strong className="text-xs text-slate-200 block">Éverton Rodrigo Piceni</strong>
                    <span className="text-[10px] text-amber-400/90 font-serif italic">Terapeuta Quântico & Integrativo</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Data e Código</span>
                    <strong className="text-xs text-slate-200 block">{issueDate}</strong>
                    <span className="text-[9px] font-mono text-slate-400">{authCode}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 print:hidden">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/10"
              >
                <Printer size={15} />
                <span>Imprimir / Salvar em PDF</span>
              </button>
            </div>
          </div>
        ) : (
          /* QUANTUM REPORT VIEW */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Mapa Vibracional dos 21 Dias</h3>
                  <p className="text-xs text-slate-400">Análise de constância e estado emocional consolidado</p>
                </div>
                <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-300 text-xs font-mono">
                  {completedDaysCount} de 21 Dias Concluídos
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Frequência de Paz</span>
                  <span className="text-xl font-bold text-emerald-400 mt-1 block">
                    {averageMood > 0 ? (averageMood * 20).toFixed(0) + '%' : '100%'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Sequência Atual</span>
                  <span className="text-xl font-bold text-amber-400 mt-1 block">
                    {userProfile.currentStreak || 0} dias
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Transmutações</span>
                  <span className="text-xl font-bold text-indigo-400 mt-1 block">
                    {completedDaysCount * 3} portais
                  </span>
                </div>
              </div>

              {/* Journal highlights */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Registros do Diário Terapêutico
                </span>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {progress.filter(p => p.journalText && p.journalText.trim().length > 0).length > 0 ? (
                    progress
                      .filter(p => p.journalText && p.journalText.trim().length > 0)
                      .map(p => (
                        <div key={p.dayNumber} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
                          <div className="flex items-center justify-between text-[10px] text-amber-300/80 font-mono mb-1">
                            <span>Dia {p.dayNumber}</span>
                            <span>{p.completedAt ? new Date(p.completedAt).toLocaleDateString('pt-BR') : 'Concluído'}</span>
                          </div>
                          <p className="text-slate-300 italic">"{p.journalText}"</p>
                        </div>
                      ))
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-900/40 text-center text-xs text-slate-500">
                      Nenhuma anotação de diário registrada ainda. Escreva suas percepções ao final de cada sessão!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
