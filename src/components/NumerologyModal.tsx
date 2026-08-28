/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, X, Hash, Heart, Shield, Crown, CheckCircle2,
  Copy, QrCode, CreditCard, Award, Printer, Lock, ChevronRight,
  Sun, Moon, Compass, Star, Eye, Zap, MessageSquare
} from 'lucide-react';
import { UserProfile, NumerologyData } from '../types';
import { calculateNumerology } from '../utils/numerology';

interface NumerologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile?: (updatedProfile: UserProfile) => void;
  onOpenProModal?: () => void;
  onOpenContact?: () => void;
}

export default function NumerologyModal({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onOpenProModal,
  onOpenContact
}: NumerologyModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'compact' | 'complete' | 'payment'>('compact');
  const [pixCopied, setPixCopied] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [simulatedPurchaseSuccess, setSimulatedPurchaseSuccess] = useState(false);

  if (!isOpen) return null;

  const numerology: NumerologyData = calculateNumerology(
    userProfile.fullName || userProfile.name,
    userProfile.birthDate
  );

  const isPro = userProfile.plan === 'pro';
  const isFullUnlocked = isPro || userProfile.numerologyPurchased || simulatedPurchaseSuccess;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText('evertonpiceni@gmail.com');
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  const handleConfirmPurchase = () => {
    setSimulatedPurchaseSuccess(true);
    if (onSaveProfile) {
      const updated: UserProfile = {
        ...userProfile,
        numerologyPurchased: true,
        numerology: {
          ...numerology,
          isFullUnlocked: true
        }
      };
      onSaveProfile(updated);
    }
    setActiveTab('complete');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto" id="numerology-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        className="w-full max-w-3xl bg-slate-900 border border-indigo-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Ambient Cosmic Background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0 border border-indigo-400/40">
              <Hash size={24} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  Numerologia Pitagórica & Cabalística
                </span>
                {isFullUnlocked && (
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-500/15 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Crown size={11} /> VERSÃO COMPLETA
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-display font-medium text-slate-100 mt-0.5">
                Mapa Numerológico de {userProfile.fullName || userProfile.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isFullUnlocked && (
              <button
                onClick={handlePrint}
                className="p-2 rounded-xl text-xs font-mono bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700 transition cursor-pointer"
                title="Imprimir / Salvar em PDF"
              >
                <Printer size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition cursor-pointer border border-slate-700/50"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 shrink-0 border-b border-slate-800 my-3 pb-2">
          <button
            onClick={() => setActiveTab('compact')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition cursor-pointer border flex items-center gap-1.5 ${
              activeTab === 'compact'
                ? 'bg-indigo-600/25 border-indigo-500 text-indigo-200 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            <Sparkles size={13} className="text-indigo-400" />
            <span>Versão Compacta (Básica)</span>
          </button>

          <button
            onClick={() => {
              if (isFullUnlocked) {
                setActiveTab('complete');
              } else {
                setActiveTab('payment');
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition cursor-pointer border flex items-center gap-1.5 ${
              activeTab === 'complete' || activeTab === 'payment'
                ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            {isFullUnlocked ? (
              <Crown size={13} className="text-amber-400" />
            ) : (
              <Lock size={13} className="text-amber-400" />
            )}
            <span>Versão Completa (R$ 90,00)</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div ref={printRef} className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* TAB 1: COMPACT VERSION */}
          {activeTab === 'compact' && (
            <div className="space-y-4">
              {/* Highlight Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Life Path Number */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-950 border border-indigo-500/30 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">
                      Caminho de Vida
                    </span>
                    <span className="text-2xl font-mono font-black text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-lg border border-indigo-500/30">
                      {numerology.lifePathNumber}
                    </span>
                  </div>
                  <h3 className="text-sm font-display font-bold text-slate-100">
                    {numerology.lifePathTitle}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {numerology.lifePathMeaning}
                  </p>
                </div>

                {/* 2. Soul Number */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-950 border border-purple-500/30 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">
                      Número da Alma
                    </span>
                    <span className="text-2xl font-mono font-black text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-lg border border-purple-500/30">
                      {numerology.soulNumber}
                    </span>
                  </div>
                  <h3 className="text-sm font-display font-bold text-slate-100">
                    Motivação Interior
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {numerology.soulMeaning}
                  </p>
                </div>

                {/* 3. Personal Year */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-950 border border-amber-500/30 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                      Ano Pessoal {new Date().getFullYear()}
                    </span>
                    <span className="text-2xl font-mono font-black text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                      {numerology.personalYear}
                    </span>
                  </div>
                  <h3 className="text-sm font-display font-bold text-slate-100">
                    Ciclo Vigente
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {numerology.personalYearMeaning}
                  </p>
                </div>
              </div>

              {/* Keywords & Affirmation */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                    Palavras-Chave de Poder da sua Essência
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Frequência {numerology.suggestedFrequency}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {numerology.lifePathKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium"
                    >
                      ✦ {kw}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                    Decreto Numerológico Diário:
                  </span>
                  <p className="text-xs text-slate-200 italic font-serif bg-indigo-950/30 p-3 rounded-xl border border-indigo-500/20">
                    "{numerology.affirmation}"
                  </p>
                </div>
              </div>

              {/* Unlock Banner CTA if not full */}
              {!isFullUnlocked && (
                <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-indigo-950/40 border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Crown size={16} className="text-amber-400" />
                      <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                        Aprofunde seu Autoconhecimento Sagrado
                      </span>
                    </div>
                    <h4 className="text-base font-display font-medium text-slate-100">
                      Mapa Numerológico Cabalístico Completo
                    </h4>
                    <p className="text-xs text-slate-300 max-w-lg">
                      Desbloqueie a análise do Número de Expressão, Personalidade, Lições Cármicas, Previsão Mês a Mês do Ano Pessoal, Cristais de Cura e Cores de Poder por apenas <strong>R$ 90,00</strong> ou incluso no Plano PRO!
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('payment')}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20 shrink-0"
                  >
                    <Crown size={14} />
                    <span>Liberar Completo (R$ 90,00)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMPLETE FULL VERSION (Unlocked) */}
          {activeTab === 'complete' && isFullUnlocked && (
            <div className="space-y-4 animate-fade-in">
              {/* Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* 1. Destino */}
                <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block">1. Caminho de Vida</span>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-mono font-black text-indigo-200">Nº {numerology.lifePathNumber}</span>
                    <Star size={14} className="text-indigo-400" />
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">{numerology.lifePathTitle}</p>
                </div>

                {/* 2. Alma */}
                <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block">2. Número da Alma</span>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-mono font-black text-purple-200">Nº {numerology.soulNumber}</span>
                    <Heart size={14} className="text-purple-400" />
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">Desejo Íntimo Inconsciente</p>
                </div>

                {/* 3. Personalidade */}
                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">3. Personalidade</span>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-mono font-black text-amber-200">Nº {numerology.personalityNumber}</span>
                    <Eye size={14} className="text-amber-400" />
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">Impressão & Aura Externa</p>
                </div>

                {/* 4. Expressão */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">4. Expressão Geral</span>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-mono font-black text-emerald-200">Nº {numerology.expressionNumber}</span>
                    <Zap size={14} className="text-emerald-400" />
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">Talentos & Vocação</p>
                </div>
              </div>

              {/* In-depth Sections */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <h4 className="text-sm font-display font-medium text-indigo-300 uppercase tracking-wide flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Sparkles size={16} /> Análise Aprofundada dos Ciclos, Alma & Maturidade
                </h4>

                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <strong className="text-indigo-300 block mb-1">✦ Vocação e Caminho de Realização (Destino):</strong>
                    <p>{numerology.lifePathMeaning}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <strong className="text-purple-300 block mb-1">✦ Motivação Secreta da Alma (Vogais Sagradas):</strong>
                    <p>{numerology.soulMeaning}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <strong className="text-amber-300 block mb-1">✦ Como o Mundo Percebe Sua Energia (Consoantes):</strong>
                    <p>{numerology.personalityMeaning}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <strong className="text-emerald-300 block mb-1">✦ Potencial de Expressão & Ferramentas Inatas (Nome Completo):</strong>
                    <p>{numerology.expressionMeaning}</p>
                  </div>

                  {numerology.maturityMeaning && (
                    <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-indigo-950/30 border border-amber-500/30">
                      <strong className="text-amber-300 block mb-1">✦ Número de Maturidade (A Colheita após os 35-40 anos):</strong>
                      <p>{numerology.maturityMeaning}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* SEÇÃO EXCLUSIVA: OTIMIZAÇÃO DO NOME & ASSINATURA PARA MAIOR PROSPERIDADE */}
              {numerology.nameProsperityAnalysis && (
                <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-emerald-950/30 border border-amber-500/40 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Crown size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                          Numerologia Cabalística Financeira
                        </span>
                        <h4 className="text-base font-display font-medium text-slate-100">
                          Harmonização do Nome & Assinatura para Prosperidade
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                      <span className="text-[10px] font-mono text-amber-300 uppercase">Índice Vibracional:</span>
                      <span className="text-xs font-bold font-mono text-emerald-400">{numerology.nameProsperityAnalysis.prosperityScore}%</span>
                    </div>
                  </div>

                  {/* Vibração Atual e Dicas de Nome */}
                  <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                    <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-amber-500/25 space-y-2">
                      <h5 className="font-mono font-bold text-amber-300 uppercase text-[11px] flex items-center gap-1.5">
                        <Zap size={13} className="text-amber-400" />
                        Diagnóstico da Vibração do seu Nome ({numerology.nameProsperityAnalysis.currentNameVibration})
                      </h5>
                      <p className="text-slate-200">
                        {numerology.nameProsperityAnalysis.currentVibrationMeaning}
                      </p>
                    </div>

                    {/* Dicas de Alteração / Harmonização de Nome */}
                    <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5">
                      <h5 className="font-mono font-bold text-emerald-300 uppercase text-[11px] flex items-center gap-1.5">
                        <Sparkles size={13} className="text-emerald-400" />
                        Orientações Práticas de Alteração & Ajuste no Nome
                      </h5>
                      <div className="space-y-2">
                        {numerology.nameProsperityAnalysis.recommendedNameHarmonizations.map((rec, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                            <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Regras da Assinatura Cabalística */}
                    <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5">
                      <h5 className="font-mono font-bold text-indigo-300 uppercase text-[11px] flex items-center gap-1.5">
                        <Award size={13} className="text-indigo-400" />
                        Manual da Assinatura Próspera (Blindagem e Atração)
                      </h5>
                      <div className="space-y-2">
                        {numerology.nameProsperityAnalysis.signatureAdvice.map((sig, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                            <span>{sig}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 5 Atitudes Práticas Diárias de Prosperidade */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 space-y-2.5">
                      <h5 className="font-mono font-bold text-emerald-300 uppercase text-[11px] flex items-center gap-1.5">
                        <Crown size={13} className="text-emerald-400" />
                        5 Atitudes Práticas Diárias para Desbloquear a Prosperidade
                      </h5>
                      <div className="space-y-2">
                        {numerology.nameProsperityAnalysis.dailyProsperityAttitudes.map((att, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/20 text-xs text-slate-200">
                            {att}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ATITUDES PRÁTICAS RECOMENDADAS PELO CAMINHO DE VIDA */}
              {numerology.practicalAttitudes && numerology.practicalAttitudes.length > 0 && (
                <div className="p-5 rounded-3xl bg-slate-950 border border-indigo-500/30 space-y-3">
                  <h4 className="text-sm font-display font-medium text-indigo-200 uppercase tracking-wide flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Compass size={16} className="text-indigo-400" /> Atitudes Diárias do Seu Caminho de Vida
                  </h4>
                  <div className="space-y-2">
                    {numerology.practicalAttitudes.map((action, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal Year & Guidance */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/30 to-slate-950 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun size={16} className="text-amber-400" />
                    <h4 className="text-sm font-display font-medium text-amber-200">
                      Previsão & Alinhamento para o Ano Pessoal {numerology.personalYear} ({new Date().getFullYear()})
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {numerology.personalYearMeaning}
                </p>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/20 text-xs text-amber-200/90">
                  <strong>Orientação Terapêutica de Éverton Piceni:</strong> {numerology.personalYearGuidance}
                </div>
              </div>

              {/* Karmic Lessons & Therapeutic Prescription */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-xs font-mono uppercase text-rose-400 font-bold block flex items-center gap-1.5">
                    <Shield size={13} /> Lições & Desafios Cármicos
                  </span>
                  <div className="space-y-1.5">
                    {numerology.karmicLessons.map((lesson, idx) => (
                      <p key={idx} className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        {lesson}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-xs font-mono uppercase text-teal-400 font-bold block flex items-center gap-1.5">
                    <Sparkles size={13} /> Prescrição Vibracional de Cura
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400">Frequência Sonora:</span>
                      <strong className="text-teal-300">{numerology.suggestedFrequency}</strong>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400">Cristal de Harmonização:</span>
                      <strong className="text-teal-300">{numerology.harmonicCrystal}</strong>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400">Cor de Poder:</span>
                      <strong className="text-teal-300">{numerology.harmonicColor}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENT / UPGRADE FORM FOR FULL VERSION (R$ 90,00) */}
          {activeTab === 'payment' && !isFullUnlocked && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-5 rounded-3xl bg-slate-950 border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                      Desbloqueio Individual
                    </span>
                    <h3 className="text-base font-display font-medium text-slate-100">
                      Mapa Numerológico Completo de {userProfile.fullName || userProfile.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block line-through">R$ 180,00</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">R$ 90,00</span>
                  </div>
                </div>

                {/* Payment Selector */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('pix')}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-mono font-bold transition cursor-pointer ${
                      selectedPaymentMethod === 'pix'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <QrCode size={16} />
                    <span>PIX Imediato (R$ 90,00)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('card')}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-mono font-bold transition cursor-pointer ${
                      selectedPaymentMethod === 'card'
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CreditCard size={16} />
                    <span>Cartão de Crédito</span>
                  </button>
                </div>

                {/* PIX Box */}
                {selectedPaymentMethod === 'pix' && (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-center">
                    <p className="text-xs text-slate-300">
                      Transfira <strong>R$ 90,00</strong> via chave PIX para liberação instantânea:
                    </p>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-2 max-w-md mx-auto">
                      <span className="font-mono text-xs text-emerald-300 font-bold truncate">
                        evertonpiceni@gmail.com
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition"
                      >
                        {pixCopied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                        <span>{pixCopied ? 'Copiado!' : 'Copiar Chave'}</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Favorecido: <strong>Éverton Rodrigo Piceni</strong> • Banco: Nubank / Inter
                    </p>
                  </div>
                )}

                {/* Card Box */}
                {selectedPaymentMethod === 'card' && (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs text-slate-300">
                    <p>
                      Pagamento seguro processado em até 12x no cartão. Para receber o link de pagamento exclusivo da sua fatura com parcelamento sem juros:
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpenContact ? onOpenContact() : undefined}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
                    >
                      <MessageSquare size={14} />
                      <span>Solicitar Link de Cartão com Suporte</span>
                    </button>
                  </div>
                )}

                {/* Simulation Button for Instant Activation */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleConfirmPurchase}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 size={16} />
                    <span>Confirmar Pagamento & Liberar Mapa Completo</span>
                  </button>
                </div>
              </div>

              {/* Or Upgrade to PRO CTA */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between gap-3 text-xs text-slate-300">
                <span>
                  💡 <em>Assinantes PRO têm acesso irrestrito ao Mapa Numerológico Completo sem custo extra.</em>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenProModal) onOpenProModal();
                  }}
                  className="text-amber-400 hover:text-amber-300 underline font-mono text-xs whitespace-nowrap cursor-pointer"
                >
                  Ver Planos PRO
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between shrink-0 text-xs text-slate-400">
          <span>Terapia Quântica Integrada • Éverton Rodrigo Piceni</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition cursor-pointer font-mono"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
