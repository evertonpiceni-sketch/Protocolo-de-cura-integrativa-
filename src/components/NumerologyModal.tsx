/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles, X, Hash, Heart, Shield, Crown, CheckCircle2,
  Copy, QrCode, CreditCard, Award, Printer, Lock,
  Sun, Compass, Star, Eye, Zap, MessageSquare
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

type NumerologyTab = 'compact' | 'complete' | 'payment';

export default function NumerologyModal({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onOpenProModal,
  onOpenContact
}: NumerologyModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<NumerologyTab>('compact');
  const [pixCopied, setPixCopied] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isCheckoutProcessing, setIsCheckoutProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (!isOpen) return null;

  const numerology: NumerologyData = calculateNumerology(
    userProfile.fullName || userProfile.name,
    userProfile.birthDate
  );

  const isPro = userProfile.plan === 'pro';
  const isFullUnlocked = isPro || Boolean(userProfile.numerologyPurchased);

  const handlePrint = () => {
    if (!isFullUnlocked) return;
    window.print();
  };

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText('evertonpiceni@gmail.com');
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 3000);
    } catch {
      setCheckoutError('Não foi possível copiar a chave automaticamente. Selecione e copie a chave manualmente.');
    }
  };

  const handleConfirmPurchase = async () => {
    if (isCheckoutProcessing) return;
    setCheckoutError(null);
    setIsCheckoutProcessing(true);
    try {
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          productType: 'numerology_full',
          paymentMethod: selectedPaymentMethod,
          price: 90
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Pagamento ainda não está disponível.');
      if (data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
        return;
      }
      if (data.status === 'paid' && data.user?.profile?.numerologyPurchased) {
        onSaveProfile?.(data.user.profile);
        setActiveTab('complete');
        return;
      }
      throw new Error('Aguardando confirmação segura do pagamento.');
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Não foi possível iniciar o pagamento.');
    } finally {
      setIsCheckoutProcessing(false);
    }
  };

  const selectComplete = () => setActiveTab(isFullUnlocked ? 'complete' : 'payment');
  const tabClass = (selected: boolean) => `min-h-11 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition cursor-pointer border flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35 ${selected ? 'bg-[#F5EFE4] border-[#B88736] text-[#2A2420] shadow-sm' : 'bg-white border-[#E5DAC6] text-[#5C5248] hover:border-[#B88736]/45'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-[#2A2420]/30 backdrop-blur-md overflow-y-auto overscroll-contain" id="numerology-modal" role="dialog" aria-modal="true" aria-label="Mapa numerológico">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        className="w-full max-w-3xl bg-[#FBF8F2] border border-[#B88736]/30 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl relative overflow-hidden my-1 sm:my-4 max-h-[calc(100dvh-1rem)] sm:max-h-[92dvh] flex flex-col"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#B88736]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-700/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-[#E5DAC6] pb-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[#073b2b] flex items-center justify-center text-[#f2dda4] shadow-sm shrink-0 border border-[#B88736]/35"><Hash size={24} /></div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8F631E] bg-[#B88736]/10 border border-[#B88736]/30 px-2.5 py-0.5 rounded-full font-bold">Numerologia Pitagórica & Cabalística</span>
                {isFullUnlocked && <span className="text-[10px] font-mono text-[#8F631E] bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Crown size={11} /> Versão completa</span>}
              </div>
              <h2 className="text-base sm:text-lg font-display font-medium text-[#2A2420] mt-0.5 truncate">Mapa Numerológico de {userProfile.fullName || userProfile.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isFullUnlocked && (
              <button onClick={handlePrint} aria-label="Imprimir ou salvar mapa numerológico em PDF" className="w-11 h-11 rounded-xl bg-[#F5EFE4] hover:bg-[#EFE4D3] text-[#5C5248] border border-[#E5DAC6] transition cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30" title="Imprimir / Salvar em PDF"><Printer size={16} /></button>
            )}
            <button onClick={onClose} aria-label="Fechar mapa numerológico" className="w-11 h-11 text-[#5C5248] hover:text-[#2A2420] bg-[#F5EFE4] hover:bg-[#EFE4D3] rounded-xl transition cursor-pointer border border-[#E5DAC6] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"><X size={18} /></button>
          </div>
        </div>

        <div className="flex gap-2 shrink-0 border-b border-[#E5DAC6] my-3 pb-2 overflow-x-auto" role="tablist" aria-label="Versões do mapa numerológico">
          <button role="tab" aria-selected={activeTab === 'compact'} onClick={() => setActiveTab('compact')} className={tabClass(activeTab === 'compact')}><Sparkles size={13} className="text-[#B88736]" /><span>Versão Compacta</span></button>
          <button role="tab" aria-selected={activeTab === 'complete' || activeTab === 'payment'} onClick={selectComplete} className={tabClass(activeTab === 'complete' || activeTab === 'payment')}>
            {isFullUnlocked ? <Crown size={13} className="text-[#B88736]" /> : <Lock size={13} className="text-[#B88736]" />}
            <span>Versão Completa (R$ 90,00)</span>
          </button>
        </div>

        <div ref={printRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-4 pr-1">
          {activeTab === 'compact' && (
            <div className="space-y-4" role="tabpanel">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-[#F5EFE4] border border-[#B88736]/30 space-y-2"><div className="flex items-center justify-between"><span className="text-[10px] font-mono uppercase text-[#8F631E] font-bold">Caminho de Vida</span><span className="text-2xl font-mono font-black text-[#8F631E] bg-[#B88736]/10 px-2.5 py-0.5 rounded-lg border border-[#B88736]/30">{numerology.lifePathNumber}</span></div><h3 className="text-sm font-display font-bold text-[#2A2420]">{numerology.lifePathTitle}</h3><p className="text-xs text-[#5C5248] line-clamp-3 leading-relaxed">{numerology.lifePathMeaning}</p></div>
                <div className="p-4 rounded-2xl bg-[#F5EFE4] border border-[#E5DAC6] space-y-2"><div className="flex items-center justify-between"><span className="text-[10px] font-mono uppercase text-[#8F631E] font-bold">Número da Alma</span><span className="text-2xl font-mono font-black text-[#8F631E] bg-white px-2.5 py-0.5 rounded-lg border border-[#E5DAC6]">{numerology.soulNumber}</span></div><h3 className="text-sm font-display font-bold text-[#2A2420]">Motivação Interior</h3><p className="text-xs text-[#5C5248] line-clamp-3 leading-relaxed">{numerology.soulMeaning}</p></div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2"><div className="flex items-center justify-between"><span className="text-[10px] font-mono uppercase text-amber-800 font-bold">Ano Pessoal {new Date().getFullYear()}</span><span className="text-2xl font-mono font-black text-amber-800 bg-white px-2.5 py-0.5 rounded-lg border border-amber-200">{numerology.personalYear}</span></div><h3 className="text-sm font-display font-bold text-[#2A2420]">Ciclo Vigente</h3><p className="text-xs text-[#5C5248] line-clamp-3 leading-relaxed">{numerology.personalYearMeaning}</p></div>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 border border-[#E5DAC6] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-mono uppercase tracking-wider text-[#8F631E] font-bold">Palavras-chave da sua essência</span><span className="text-xs text-[#5C5248] font-mono">Frequência sugerida: {numerology.suggestedFrequency}</span></div>
                <div className="flex flex-wrap gap-2">{numerology.lifePathKeywords.map((keyword, index) => <span key={index} className="px-2.5 py-1 rounded-lg bg-[#B88736]/10 border border-[#B88736]/20 text-[#8F631E] text-xs font-medium">{keyword}</span>)}</div>
                <div className="pt-2 border-t border-[#E5DAC6]"><span className="text-[10px] font-mono text-[#5C5248] uppercase block mb-1">Decreto Numerológico Diário:</span><p className="text-xs text-[#2A2420] italic font-serif bg-[#F5EFE4] p-3 rounded-xl border border-[#B88736]/20">“{numerology.affirmation}”</p></div>
              </div>

              {!isFullUnlocked && (
                <div className="p-5 rounded-3xl bg-[#F5EFE4] border border-[#B88736]/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left"><div className="flex items-center justify-center sm:justify-start gap-2"><Crown size={16} className="text-[#B88736]" /><span className="text-xs font-mono uppercase tracking-widest text-[#8F631E] font-bold">Versão completa</span></div><h4 className="text-base font-display font-medium text-[#2A2420]">Mapa Numerológico Cabalístico Completo</h4><p className="text-xs text-[#5C5248] max-w-lg">Inclui Expressão, Personalidade, Lições Cármicas, Ano Pessoal, cristais, cores e demais leituras previstas no mapa completo. O acesso individual é de <strong>R$ 90,00</strong> ou conforme seu entitlement PRO confirmado pelo servidor.</p></div>
                  <button type="button" onClick={() => setActiveTab('payment')} className="min-h-11 px-5 py-3 rounded-xl bg-[#B88736] hover:bg-[#8F631E] text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35"><Crown size={14} /><span>Ver opções de acesso</span></button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'complete' && isFullUnlocked && (
            <div className="space-y-4" role="tabpanel">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ['1. Caminho de Vida', numerology.lifePathNumber, numerology.lifePathTitle, <Star size={14} key="star" />],
                  ['2. Número da Alma', numerology.soulNumber, 'Desejo Íntimo', <Heart size={14} key="heart" />],
                  ['3. Personalidade', numerology.personalityNumber, 'Impressão & Aura Externa', <Eye size={14} key="eye" />],
                  ['4. Expressão Geral', numerology.expressionNumber, 'Talentos & Vocação', <Zap size={14} key="zap" />]
                ].map(([label, number, caption, icon]) => (
                  <div key={String(label)} className="p-3.5 rounded-2xl bg-[#F5EFE4] border border-[#E5DAC6] space-y-1"><span className="text-[10px] font-mono uppercase text-[#8F631E] font-bold block">{label}</span><div className="flex items-center justify-between"><span className="text-xl font-mono font-black text-[#2A2420]">Nº {String(number)}</span><span className="text-[#B88736]">{icon}</span></div><p className="text-[11px] text-[#5C5248] font-medium">{caption}</p></div>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-white/80 border border-[#E5DAC6] space-y-4">
                <h4 className="text-sm font-display font-medium text-[#8F631E] uppercase tracking-wide flex items-center gap-2 border-b border-[#E5DAC6] pb-2"><Sparkles size={16} /> Análise Aprofundada dos Ciclos, Alma & Maturidade</h4>
                <div className="space-y-3 text-xs leading-relaxed text-[#5C5248]">
                  <div className="p-3 rounded-xl bg-[#FBF8F2] border border-[#E5DAC6]"><strong className="text-[#8F631E] block mb-1">Vocação e Caminho de Realização:</strong><p>{numerology.lifePathMeaning}</p></div>
                  <div className="p-3 rounded-xl bg-[#FBF8F2] border border-[#E5DAC6]"><strong className="text-[#8F631E] block mb-1">Motivação da Alma:</strong><p>{numerology.soulMeaning}</p></div>
                  <div className="p-3 rounded-xl bg-[#FBF8F2] border border-[#E5DAC6]"><strong className="text-[#8F631E] block mb-1">Como o Mundo Percebe Sua Energia:</strong><p>{numerology.personalityMeaning}</p></div>
                  <div className="p-3 rounded-xl bg-[#FBF8F2] border border-[#E5DAC6]"><strong className="text-[#8F631E] block mb-1">Potencial de Expressão & Ferramentas Inatas:</strong><p>{numerology.expressionMeaning}</p></div>
                  {numerology.maturityMeaning && <div className="p-3 rounded-xl bg-amber-50 border border-amber-200"><strong className="text-amber-800 block mb-1">Número de Maturidade:</strong><p>{numerology.maturityMeaning}</p></div>}
                </div>
              </div>

              {numerology.nameProsperityAnalysis && (
                <div className="p-5 rounded-3xl bg-[#F5EFE4] border border-[#B88736]/40 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#B88736]/20 pb-3">
                    <div className="flex items-center gap-2.5"><div className="p-2 rounded-xl bg-[#B88736]/10 text-[#8F631E] border border-[#B88736]/30"><Crown size={18} /></div><div><span className="text-[10px] font-mono uppercase tracking-widest text-[#8F631E] font-bold">Numerologia Cabalística Financeira</span><h4 className="text-base font-display font-medium text-[#2A2420]">Harmonização do Nome & Assinatura para Prosperidade</h4></div></div>
                    <div className="flex items-center gap-2 bg-white border border-[#B88736]/30 px-3 py-1.5 rounded-xl self-start sm:self-auto"><span className="text-[10px] font-mono text-[#5C5248] uppercase">Índice apresentado:</span><span className="text-xs font-bold font-mono text-emerald-700">{numerology.nameProsperityAnalysis.prosperityScore}%</span></div>
                  </div>
                  <div className="space-y-3 text-xs leading-relaxed text-[#5C5248]">
                    <div className="p-3.5 rounded-2xl bg-white border border-[#E5DAC6] space-y-2"><h5 className="font-mono font-bold text-[#8F631E] uppercase text-[11px] flex items-center gap-1.5"><Zap size={13} /> Leitura da Vibração do Nome ({numerology.nameProsperityAnalysis.currentNameVibration})</h5><p className="text-[#2A2420]">{numerology.nameProsperityAnalysis.currentVibrationMeaning}</p></div>
                    <div className="p-4 rounded-2xl bg-white border border-[#E5DAC6] space-y-2.5"><h5 className="font-mono font-bold text-emerald-800 uppercase text-[11px] flex items-center gap-1.5"><Sparkles size={13} /> Orientações de Nome</h5><div className="space-y-2">{numerology.nameProsperityAnalysis.recommendedNameHarmonizations.map((recommendation, index) => <div key={index} className="p-2.5 rounded-xl bg-[#FBF8F2] border border-[#E5DAC6] text-xs text-[#5C5248]">{recommendation}</div>)}</div></div>
                    <div className="p-4 rounded-2xl bg-white border border-[#E5DAC6] space-y-2.5"><h5 className="font-mono font-bold text-[#8F631E] uppercase text-[11px] flex items-center gap-1.5"><Award size={13} /> Orientações para Assinatura</h5><div className="space-y-2">{numerology.nameProsperityAnalysis.signatureAdvice.map((advice, index) => <div key={index} className="p-2.5 rounded-xl bg-[#FBF8F2] border border-[#E5DAC6] text-xs text-[#5C5248] flex items-start gap-2"><CheckCircle2 size={14} className="text-[#B88736] shrink-0 mt-0.5" /><span>{advice}</span></div>)}</div></div>
                    <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-2.5"><h5 className="font-mono font-bold text-emerald-800 uppercase text-[11px] flex items-center gap-1.5"><Crown size={13} /> Atitudes Diárias de Prosperidade</h5><div className="space-y-2">{numerology.nameProsperityAnalysis.dailyProsperityAttitudes.map((attitude, index) => <div key={index} className="p-2.5 rounded-xl bg-[#FBF8F2] border border-emerald-200 text-xs text-[#2A2420]">{attitude}</div>)}</div></div>
                  </div>
                </div>
              )}

              {numerology.practicalAttitudes && numerology.practicalAttitudes.length > 0 && (
                <div className="p-5 rounded-3xl bg-white border border-[#B88736]/30 space-y-3"><h4 className="text-sm font-display font-medium text-[#2A2420] uppercase tracking-wide flex items-center gap-2 border-b border-[#E5DAC6] pb-2"><Compass size={16} className="text-[#B88736]" /> Atitudes Diárias do Seu Caminho de Vida</h4><div className="space-y-2">{numerology.practicalAttitudes.map((action, index) => <div key={index} className="p-2.5 rounded-xl bg-[#FBF8F2] border border-[#E5DAC6] text-xs text-[#5C5248]">{action}</div>)}</div></div>
              )}

              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3"><div className="flex items-center gap-2"><Sun size={16} className="text-amber-700" /><h4 className="text-sm font-display font-medium text-amber-900">Leitura para o Ano Pessoal {numerology.personalYear} ({new Date().getFullYear()})</h4></div><p className="text-xs text-[#2A2420] leading-relaxed font-medium">{numerology.personalYearMeaning}</p><div className="p-3 rounded-xl bg-white border border-amber-200 text-xs text-[#5C5248]"><strong>Orientação de Éverton Piceni:</strong> {numerology.personalYearGuidance}</div></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-[#E5DAC6] space-y-2"><span className="text-xs font-mono uppercase text-rose-700 font-bold block flex items-center gap-1.5"><Shield size={13} /> Lições & Desafios Cármicos</span><div className="space-y-1.5">{numerology.karmicLessons.map((lesson, index) => <p key={index} className="text-xs text-[#5C5248] bg-[#FBF8F2] p-2 rounded-lg border border-[#E5DAC6]">{lesson}</p>)}</div></div>
                <div className="p-4 rounded-2xl bg-white border border-[#E5DAC6] space-y-2"><span className="text-xs font-mono uppercase text-emerald-800 font-bold block flex items-center gap-1.5"><Sparkles size={13} /> Sugestões Vibracionais</span><div className="space-y-1.5 text-xs text-[#5C5248]"><div className="flex justify-between gap-3 p-2 rounded bg-[#FBF8F2] border border-[#E5DAC6]"><span>Frequência:</span><strong className="text-emerald-800">{numerology.suggestedFrequency}</strong></div><div className="flex justify-between gap-3 p-2 rounded bg-[#FBF8F2] border border-[#E5DAC6]"><span>Cristal:</span><strong className="text-emerald-800">{numerology.harmonicCrystal}</strong></div><div className="flex justify-between gap-3 p-2 rounded bg-[#FBF8F2] border border-[#E5DAC6]"><span>Cor:</span><strong className="text-emerald-800">{numerology.harmonicColor}</strong></div></div></div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && !isFullUnlocked && (
            <div className="space-y-5" role="tabpanel">
              <div className="p-5 rounded-3xl bg-white border border-amber-300 space-y-4">
                <div className="flex items-center justify-between gap-3 border-b border-[#E5DAC6] pb-3"><div><span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 font-bold">Acesso individual</span><h3 className="text-base font-display font-medium text-[#2A2420]">Mapa Numerológico Completo de {userProfile.fullName || userProfile.name}</h3></div><div className="text-right"><span className="text-xl font-bold font-mono text-emerald-700">R$ 90,00</span></div></div>

                <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Forma de pagamento">
                  <button type="button" role="radio" aria-checked={selectedPaymentMethod === 'pix'} onClick={() => setSelectedPaymentMethod('pix')} className={`min-h-11 p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-mono font-bold transition cursor-pointer ${selectedPaymentMethod === 'pix' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-[#FBF8F2] border-[#E5DAC6] text-[#5C5248]'}`}><QrCode size={16} /><span>PIX</span></button>
                  <button type="button" role="radio" aria-checked={selectedPaymentMethod === 'card'} onClick={() => setSelectedPaymentMethod('card')} className={`min-h-11 p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-mono font-bold transition cursor-pointer ${selectedPaymentMethod === 'card' ? 'bg-[#F5EFE4] border-[#B88736] text-[#8F631E]' : 'bg-[#FBF8F2] border-[#E5DAC6] text-[#5C5248]'}`}><CreditCard size={16} /><span>Cartão</span></button>
                </div>

                {selectedPaymentMethod === 'pix' && (
                  <div className="p-4 rounded-2xl bg-[#FBF8F2] border border-[#E5DAC6] space-y-3 text-center"><p className="text-xs text-[#5C5248]">A chave PIX pode ser usada quando o provedor/fluxo de pagamento estiver disponível. <strong>O acesso não é liberado pelo simples envio do PIX:</strong> a confirmação precisa chegar ao servidor.</p><div className="p-3 bg-white border border-[#E5DAC6] rounded-xl flex items-center justify-between gap-2 max-w-md mx-auto"><span className="font-mono text-xs text-emerald-800 font-bold truncate">evertonpiceni@gmail.com</span><button type="button" onClick={handleCopyPix} className="min-h-11 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition"><Copy size={13} /><span>{pixCopied ? 'Copiado' : 'Copiar chave'}</span></button></div>{pixCopied && <p role="status" aria-live="polite" className="text-[11px] text-emerald-700">Chave copiada.</p>}</div>
                )}

                {selectedPaymentMethod === 'card' && (
                  <div className="p-4 rounded-2xl bg-[#FBF8F2] border border-[#E5DAC6] space-y-3 text-xs text-[#5C5248]"><p>Os dados de cartão não são coletados pelo aplicativo. Quando o checkout seguro estiver disponível, ele será iniciado pelo provedor de pagamento.</p>{onOpenContact && <button type="button" onClick={onOpenContact} className="w-full min-h-11 py-2.5 rounded-xl bg-[#B88736] hover:bg-[#8F631E] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition"><MessageSquare size={14} /><span>Falar com o suporte</span></button>}</div>
                )}

                <div className="pt-2 space-y-2">
                  {checkoutError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{checkoutError}</p>}
                  <button type="button" onClick={handleConfirmPurchase} disabled={isCheckoutProcessing} className="w-full min-h-11 py-3.5 rounded-2xl bg-[#B88736] hover:bg-[#8F631E] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"><CheckCircle2 size={16} /><span>{isCheckoutProcessing ? 'Iniciando pagamento...' : 'Iniciar pagamento seguro'}</span></button>
                  <p className="text-[11px] text-[#85786C] text-center">O mapa completo só é liberado depois da confirmação do pagamento pelo servidor.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5EFE4] border border-[#B88736]/20 flex items-center justify-between gap-3 text-xs text-[#5C5248]"><span>O Plano PRO também pode incluir acesso ao mapa completo quando esse entitlement estiver confirmado na sua conta.</span><button type="button" onClick={() => { onClose(); onOpenProModal?.(); }} className="min-h-11 px-2 text-[#8F631E] hover:text-[#5C5248] underline font-mono text-xs whitespace-nowrap cursor-pointer">Ver Planos PRO</button></div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-[#E5DAC6] flex items-center justify-between shrink-0 text-xs text-[#5C5248]"><span>Numerologia Integrativa • Éverton Rodrigo Piceni</span><button type="button" onClick={onClose} className="min-h-11 px-4 py-2 bg-[#F5EFE4] hover:bg-[#EFE4D3] text-[#2A2420] rounded-xl transition cursor-pointer font-mono">Fechar</button></div>
      </motion.div>
    </div>
  );
}
