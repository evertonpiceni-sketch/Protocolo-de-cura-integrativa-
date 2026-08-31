/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, X, Heart, Shield, Check, QrCode, CreditCard,
  Copy, CheckCircle2, Flame, User, AlertCircle, FileText,
  Clock, ArrowRight, Zap, Target, Star, MessageSquare, Landmark, ShieldCheck, Tag, Percent, Trash2, Calendar
} from 'lucide-react';
import { UserProfile, SpecificTreatment } from '../types';
import calmLotusImg from '../assets/images/calm_quantum_lotus_1786776428440.jpg';

interface SpecificTreatmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onConfirmTreatment: (treatment: SpecificTreatment) => void;
}

const CATEGORIES = [
  { id: 'saude_fisica', label: 'Saúde Física & Dores Crônicas', icon: Zap, desc: 'Foco em dores, cansaço, inflamações ou reabilitação celular' },
  { id: 'prosperidade', label: 'Prosperidade & Destrave Financeiro', icon: Flame, desc: 'Desbloqueio de escassez, abertura de caminhos e fluxo de abundância' },
  { id: 'liberacao_emocional', label: 'Liberação de Traumas & Mágoas', icon: Heart, desc: 'Cura de mágoas profundas, ansiedade severa e luto' },
  { id: 'relacionamentos', label: 'Harmonia em Relacionamentos', icon: User, desc: 'Cura de laços cármicos, separações e reconciliação familiar' },
  { id: 'limpeza_espiritual', label: 'Limpeza & Blindagem Espiritual', icon: Shield, desc: 'Desobsessão, corte de energias densas e corte de cordões negativos' },
  { id: 'outro', label: 'Outro Assunto Específico', icon: Target, desc: 'Situação particular para direcionamento personalizado' }
];

const URGENT_PAIN_TAGS = [
  'Angústia aguda no peito', 'Insônia recorrente', 'Bloqueio profissional',
  'Tensão maxilar / ombros', 'Sensação de estagnação', 'Medo constante',
  'Conflito familiar', 'Falta de foco / confusão mental', 'Baixa vitalidade'
];

export default function SpecificTreatmentModal({
  isOpen,
  onClose,
  userProfile,
  onConfirmTreatment
}: SpecificTreatmentModalProps) {
  const [activeTab, setActiveTab] = useState<'request' | 'my_treatments'>('request');
  const [durationDays, setDurationDays] = useState<1 | 7 | 21>(21); // Changed default to 1
  const [isCustomPrice, setIsCustomPrice] = useState<boolean>(false);
  const [customPriceInput, setCustomPriceInput] = useState<string>('99,90');
  const [selectedCategory, setSelectedCategory] = useState<string>('saude_fisica');
  const [treatmentTitle, setTreatmentTitle] = useState<string>('');
  const [patientDescription, setPatientDescription] = useState<string>('');
  const [selectedPains, setSelectedPains] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | 'debit'>('pix');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>(userProfile.fullName || userProfile.name || '');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [copiedPix, setCopiedPix] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState<boolean>(false);
  const [lastCreatedTreatment, setLastCreatedTreatment] = useState<SpecificTreatment | null>(null);

  // Discount coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const existingTreatments = userProfile.specificTreatments || [];

  if (!isOpen) return null;

  // Pricing: 21 Days Complete is R$ 59,90, 7 Days is R$ 59,90, 1 Day (Sessão Única) is R$ 20,00
  const parsedCustomPrice = parseFloat(customPriceInput.replace(',', '.')) || 0;
  const standardPrice = durationDays === 21 ? 99.9 : (durationDays === 7 ? 59.9 : 20.0);
  const basePrice = isCustomPrice ? Math.max(0, parsedCustomPrice) : standardPrice;
  const discountAmount = discountPercent > 0 ? (basePrice * discountPercent) / 100 : 0;
  const finalPrice = Math.max(0, basePrice - discountAmount);
  const formattedFinalPrice = `R$ ${finalPrice.toFixed(2).replace('.', ',')}`;

  const handleApplyCoupon = (codeToApply?: string) => {
    const rawCode = (codeToApply || couponInput).trim().toUpperCase();
    if (!rawCode) {
      setCouponFeedback({ type: 'error', message: 'Digite um cupom válido.' });
      return;
    }

    if (rawCode === 'VIP' || rawCode === 'TESTEVIP' || rawCode === 'VIP7' || rawCode === '7DIAS' || rawCode === 'GRATIS7') {
      setDurationDays(7);
      setDiscountPercent(100);
      setAppliedCoupon('VIP7');
      setCouponFeedback({ type: 'success', message: '🎉 Cupom VIP7 Aplicado! Teste de 7 Dias 100% Grátis liberado!' });
    } else if (rawCode === 'CURA10' || rawCode === 'PAZ10') {
      setDiscountPercent(10);
      setAppliedCoupon(rawCode);
      setCouponFeedback({ type: 'success', message: 'Cupom de 10% aplicado!' });
    } else if (rawCode === 'PAZ20' || rawCode === 'CURA20' || rawCode === 'GRATIDAO') {
      setDiscountPercent(20);
      setAppliedCoupon(rawCode);
      setCouponFeedback({ type: 'success', message: 'Cupom de 20% aplicado!' });
    } else if (rawCode === 'PROMO30' || rawCode === 'CURA30') {
      setDiscountPercent(30);
      setAppliedCoupon(rawCode);
      setCouponFeedback({ type: 'success', message: 'Super cupom de 30% ativado!' });
    } else if (rawCode === 'PICENI50' || rawCode === 'VIP50') {
      setDiscountPercent(50);
      setAppliedCoupon(rawCode);
      setCouponFeedback({ type: 'success', message: 'Cupom Especial de 50% ativado!' });
    } else {
      setDiscountPercent(15);
      setAppliedCoupon(rawCode);
      setCouponFeedback({ type: 'success', message: `Cupom ${rawCode} de 15% aplicado!` });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercent(0);
    setCouponInput('');
    setCouponFeedback(null);
  };

  const togglePain = (tag: string) => {
    if (selectedPains.includes(tag)) {
      setSelectedPains(selectedPains.filter(p => p !== tag));
    } else {
      setSelectedPains([...selectedPains, tag]);
    }
  };

  const handleProcessOrder = () => {
    if (!patientDescription.trim()) return;

    setIsProcessing(true);

    // Generate custom channeled prescription for this specific case
    setTimeout(() => {
      let freq: '528hz' | '432hz' | '963hz' | '741hz' | 'waves' = '528hz';
      let themeTitle = treatmentTitle.trim() || `Tratamento Pontual Direcionado (${durationDays} Dias)`;
      let therapistAdvice = '';
      let targetDecree = '';

      if (selectedCategory === 'saude_fisica') {
        freq = '432hz';
        therapistAdvice = `Prescrita atuação na frequência 432Hz durante o ciclo de ${durationDays} dias com foco em regeneração mitocondrial e alívio das dores somatizadas.`;
        targetDecree = `Eu, ${userProfile.fullName || userProfile.name}, comando a reconstituição e regeneração perfeita de todas as células e tecidos do meu corpo físico agora.`;
      } else if (selectedCategory === 'prosperidade') {
        freq = '528hz';
        therapistAdvice = `Tratamento de ${durationDays} dias focado na reprogramação de crenças de escassez e alinhamento com a Matriz de Abundância Cósmica.`;
        targetDecree = `Eu, ${userProfile.fullName || userProfile.name}, dissolvo todo pacto de limitação e recebo os fluxos infinitos de prosperidade e realizações divinas.`;
      } else if (selectedCategory === 'limpeza_espiritual') {
        freq = '741hz';
        therapistAdvice = `Prescrita blindagem de ${durationDays} dias com o Tubo de Luz e a Chama Violeta Transmutadora para dissolver interferências e cargas densas.`;
        targetDecree = `Eu, ${userProfile.fullName || userProfile.name}, estou selado(a) e protegido(a) pela Luz Onipotente. Toda energia que não provém do Amor é transmutada e libertada.`;
      } else if (selectedCategory === 'liberacao_emocional') {
        freq = '741hz';
        therapistAdvice = `Atuação de ${durationDays} dias no chakra cardíaco para dissolução de memórias de dor, abandono e liberação de mágoas acumuladas.`;
        targetDecree = `Eu, ${userProfile.fullName || userProfile.name}, acolho minhas emoções e me liberto de todo peso do passado. Eu me perdoo, perdoo os outros e vivo em paz.`;
      } else {
        freq = '963hz';
        therapistAdvice = `Direcionamento de alta vibração de ${durationDays} dias com ativação da presença Eu Sou e harmonização do campo sutil.`;
        targetDecree = `Eu, ${userProfile.fullName || userProfile.name}, ancoro a Suprema Harmonia em todas as áreas da minha vida com fé e convicção inabaláveis.`;
      }

      const discountNotice = appliedCoupon ? ` (Cupom: ${appliedCoupon} - Pago: ${formattedFinalPrice})` : ` (Valor: ${formattedFinalPrice})`;
      let cycleText = '';
      if (durationDays === 21) cycleText = 'Tratamento Completo R$ 99,90';
      else if (durationDays === 7) cycleText = 'Ciclo Inicial R$ 59,90';
      else cycleText = 'Tratamento à Distância R$ 20,00';
      
      const whatsappText = encodeURIComponent(
        `Olá Éverton Rodrigo Piceni! Acabei de solicitar meu Tratamento Específico de ${durationDays} Dias${discountNotice}.\n\n` +
        `*Paciente:* ${userProfile.fullName || userProfile.name}\n` +
        `*Ciclo Escolhido:* ${durationDays === 1 ? 'Sessão Única' : `${durationDays} Dias`} (${cycleText})\n` +
        `*Nascimento:* ${userProfile.birthDate || 'Não informado'}\n` +
        `*E-mail:* ${userProfile.email}\n` +
        `*Foco do Tratamento:* ${selectedCategory.toUpperCase()}\n` +
        `*Relato do Caso:* ${patientDescription}\n` +
        `*Sintomas Urgentes:* ${selectedPains.join(', ') || 'Nenhum adicional'}\n` +
        `*Frequência Prescrita:* ${freq.toUpperCase()}\n\n` +
        `Agradeço pela canalização e orientação!`
      );

      const newTreatment: SpecificTreatment = {
        id: `spec-${Date.now()}`,
        requestedAt: new Date().toISOString(),
        category: selectedCategory as any,
        title: themeTitle,
        patientDescription,
        urgentPains: selectedPains,
        status: 'ativo',
        price: finalPrice,
        paymentMethod,
        durationDays,
        therapistNotes: therapistAdvice,
        customChannelingTheme: themeTitle,
        assignedFrequency: freq,
        targetDecree,
        whatsappMessageUrl: `https://wa.me/5551982215296?text=${whatsappText}`
      };

      onConfirmTreatment(newTreatment);
      setLastCreatedTreatment(newTreatment);
      setIsProcessing(false);
      setShowSuccessScreen(true);
    }, 1200);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText('evertonpiceni@gmail.com');
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3500);
  };

  const handleSelectPaymentMethod = (method: 'pix' | 'credit' | 'debit') => {
    setPaymentMethod(method);
    if (method === 'pix') {
      handleCopyPix();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto" id="specific-treatment-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden my-6"
      >
        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition cursor-pointer z-10"
        >
          <X size={16} />
        </button>

        {showSuccessScreen && lastCreatedTreatment ? (
          /* ========================================================================= */
          /*                          SUCCESS / ACTIVATED SCREEN                       */
          /* ========================================================================= */
          <div className="text-center space-y-5 py-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase">
                Tratamento Específico Ativado com Sucesso
              </span>
              <h2 className="text-2xl font-display font-medium text-slate-100">
                {lastCreatedTreatment.title}
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Seu caso foi registrado e integrado ao seu campo energético no aplicativo com a frequência e decretos dedicados.
              </p>
            </div>

            {/* Prescribed Specific Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/40 text-left space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                <span className="text-xs font-mono text-indigo-300 font-bold uppercase">
                  Frequência Canalizada: {lastCreatedTreatment.assignedFrequency?.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  VALOR PAGO: {formattedFinalPrice}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Orientação Terapêutica</span>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  {lastCreatedTreatment.therapistNotes}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-850">
                <span className="text-[10px] font-mono text-amber-400 uppercase block flex items-center gap-1">
                  <Flame size={12} />
                  <span>Decreto Específico do seu Caso</span>
                </span>
                <p className="text-xs italic text-amber-200/90 leading-relaxed font-serif mt-1 bg-amber-950/20 p-3 rounded-xl border border-amber-500/30">
                  "{lastCreatedTreatment.targetDecree}"
                </p>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              {lastCreatedTreatment.whatsappMessageUrl && (
                <a
                  href={lastCreatedTreatment.whatsappMessageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <MessageSquare size={14} />
                  <span>Fale Conosco</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowSuccessScreen(false);
                  setActiveTab('my_treatments');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
              >
                Ver Meus Tratamentos
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <Check size={14} />
                <span>Continuar no Protocolo</span>
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /*                       REQUEST / ORDER & LIST FORM                         */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Header with Title and Price */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium mb-1">
                  <Sparkles size={13} className="text-emerald-400" />
                  <span>ATENDIMENTO & CANALIZAÇÃO DIRECIONADA</span>
                </div>
                <h2 className="text-xl md:text-2xl font-display font-medium text-slate-100">
                  Tratamento Específico
                </h2>
                <p className="text-xs text-slate-400">
                  Canalização individualizada aplicada por Éverton Rodrigo Piceni
                </p>
              </div>

              {/* Price Tag Badge */}
              <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 border-2 border-emerald-500/50 p-3 rounded-2xl text-right shrink-0">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                  {durationDays} Dias ({appliedCoupon ? `Com Cupom ${appliedCoupon}` : 'Valor'})
                </span>
                <div className="flex items-baseline gap-1 justify-end">
                  {appliedCoupon && (
                    <span className="text-xs text-slate-500 line-through font-mono">
                      {durationDays === 21 ? 'R$ 99,90' : 'R$ 59,90'}
                    </span>
                  )}
                  <span className="text-2xl font-display font-bold text-emerald-300">{formattedFinalPrice}</span>
                </div>
              </div>
            </div>

            {/* Duration & Value Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-slate-400 uppercase block">
                  Escolha o ciclo ou ajuste o valor:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomPrice(!isCustomPrice);
                    if (!isCustomPrice) {
                      setCustomPriceInput('59,90'); // will be handled correctly by effect or manual
                    }
                  }}
                  className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles size={12} />
                  <span>{isCustomPrice ? 'Usar Valores Padrão' : '✏️ Mudar / Ajustar Valor'}</span>
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {/* 1 Day Plan (Distance Treatment) */}
                <button
                  type="button"
                  onClick={() => {
                    setDurationDays(1);
                    if (!isCustomPrice) {
                      setCustomPriceInput('20,00');
                    }
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer relative ${
                    durationDays === 1 && !isCustomPrice
                      ? 'bg-indigo-950/50 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${durationDays === 1 && !isCustomPrice ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-900 text-slate-500'}`}>
                    <Zap size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs text-slate-100">Tratamento à Distância (Sessão Única)</strong>
                      <span className="text-xs font-mono font-bold text-indigo-400">R$ 20,00</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Sessão única de envio energético programado à distância.
                    </p>
                  </div>
                </button>

                {/* 7 Days Plan */}
                <button
                  type="button"
                  onClick={() => {
                    setDurationDays(7);
                    if (!isCustomPrice) {
                      setCustomPriceInput('59,90');
                    }
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer relative ${
                    durationDays === 7 && !isCustomPrice
                      ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${durationDays === 7 && !isCustomPrice ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-900 text-slate-500'}`}>
                    <Calendar size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs text-slate-100">Ciclo de 7 Dias</strong>
                      <span className="text-xs font-mono font-bold text-emerald-400">R$ 59,90</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Canalização pontual para alívio de sintomas agudos e decretos específicos.
                    </p>
                  </div>
                </button>

                {/* 21 Days Plan */}
                <button
                  type="button"
                  onClick={() => {
                    setDurationDays(21);
                    if (!isCustomPrice) {
                      setCustomPriceInput('99,90');
                    }
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer relative ${
                    durationDays === 21 && !isCustomPrice
                      ? 'bg-amber-950/40 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-bold font-mono uppercase tracking-wider">
                    ⭐ Completo (Recomendado)
                  </div>
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${durationDays === 21 && !isCustomPrice ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-900 text-slate-500'}`}>
                    <Sparkles size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs text-slate-100">Tratamento de 21 Dias</strong>
                      <span className="text-xs font-mono font-bold text-amber-300">R$ 99,90</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Ciclo completo de cura integrada, reprogramação celular e suporte quântico.
                    </p>
                  </div>
                </button>
              </div>

              {/* Custom Value Input Box */}
              {isCustomPrice && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                      <span>💰 Definir Valor Personalizado / Ajuste</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Ciclo: <strong>{durationDays} Dias</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 font-bold">R$</span>
                      <input
                        type="text"
                        value={customPriceInput}
                        onChange={(e) => setCustomPriceInput(e.target.value.replace(/[^0-9,.]/g, ''))}
                        placeholder="59,90"
                        className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-750 rounded-xl text-sm font-mono font-bold text-emerald-300 outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      {['30,00', '59,90', '99,90', '150,00'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setCustomPriceInput(val)}
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-750 text-[10px] font-mono text-slate-300 rounded-lg transition cursor-pointer"
                        >
                          R$ {val}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Você pode alterar livremente o valor do tratamento de acordo com a sua contribuição ou valor acordado.
                  </p>
                </div>
              )}
            </div>

            {/* Serene Quantum Lotus Visual Header */}
            <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 shadow-lg">
              <img
                src={calmLotusImg}
                alt="Frequências de Cura e Serenidade"
                referrerPolicy="no-referrer"
                className="w-full h-28 sm:h-32 object-cover object-center filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex items-end p-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-xs font-medium text-emerald-200 drop-shadow-sm">
                    Canalização Quântica Personalizada • Conexão Sagrada com Éverton Rodrigo Piceni
                  </p>
                </div>
              </div>
            </div>

            {/* Tab switch if treatments exist */}
            {existingTreatments.length > 0 && (
              <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('request')}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition cursor-pointer ${
                    activeTab === 'request'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Solicitar Novo Tratamento
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('my_treatments')}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'my_treatments'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Meus Tratamentos</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                    {existingTreatments.length}
                  </span>
                </button>
              </div>
            )}

            {activeTab === 'my_treatments' && existingTreatments.length > 0 ? (
              /* List of Existing Treatments */
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {existingTreatments.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono uppercase font-bold">
                            {t.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {new Date(t.requestedAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-100 mt-1">{t.title}</h4>
                      </div>
                      <span className="text-xs font-mono text-indigo-400 font-bold">
                        {t.assignedFrequency?.toUpperCase()}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">Relato Enviado:</span>
                      <p className="italic mt-0.5 line-clamp-2">"{t.patientDescription}"</p>
                    </div>

                    {t.therapistNotes && (
                      <div className="bg-indigo-950/30 p-3 rounded-xl border border-indigo-500/30 text-xs text-indigo-200">
                        <span className="text-[10px] font-mono text-indigo-400 uppercase block">Prescrição do Terapeuta:</span>
                        <p className="mt-0.5">{t.therapistNotes}</p>
                      </div>
                    )}

                    {t.targetDecree && (
                      <div className="bg-amber-950/20 p-3 rounded-xl border border-amber-500/30 text-xs text-amber-200/90 font-serif italic">
                        "{t.targetDecree}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Request Form */
              <div className="space-y-5">
                {/* Category Selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-slate-400 uppercase block">
                    1. Qual o foco principal do seu tratamento específico?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => {
                      const isSel = selectedCategory === cat.id;
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                            isSel
                              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-sm'
                              : 'bg-slate-950/50 border-slate-850 text-slate-400 hover:border-slate-800'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isSel ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-900 text-slate-500'}`}>
                            <Icon size={15} />
                          </div>
                          <div>
                            <strong className="text-xs block text-slate-200">{cat.label}</strong>
                            <span className="text-[10px] opacity-75 line-clamp-1">{cat.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Patient Case Description */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 uppercase block">
                    2. Escreva detalhadamente o que você deseja tratar ou curar:
                  </label>
                  <textarea
                    rows={4}
                    value={patientDescription}
                    onChange={(e) => setPatientDescription(e.target.value)}
                    placeholder="Descreva a situação, histórico da dor física, peso emocional, bloqueio financeiro ou circunstância específica para a canalização..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-emerald-500 resize-none leading-relaxed"
                  />
                </div>

                {/* Urgent Pain Tags */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 uppercase block">
                    3. Sensações urgentes presentes no seu momento (opcional):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {URGENT_PAIN_TAGS.map((tag) => {
                      const isSel = selectedPains.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => togglePain(tag)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] border transition cursor-pointer ${
                            isSel
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                              : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Discount Coupon Section */}
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                      <Tag size={12} className="text-emerald-400 shrink-0" />
                      <span>Cupom de Desconto:</span>
                    </span>
                    {appliedCoupon && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
                        <Percent size={10} />
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {!appliedCoupon ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          placeholder="Ex: CURA10, PAZ20, PICENI50"
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500 font-mono uppercase"
                        />
                        <button
                          type="button"
                          onClick={() => handleApplyCoupon()}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Tag size={12} className="shrink-0" />
                          <span>Aplicar</span>
                        </button>
                      </div>

                      {/* Quick discount buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {[
                          { code: 'VIP7', label: 'VIP7 (7 Dias Grátis ✨)', isFree: true },
                          { code: 'CURA10', label: 'CURA10 (-10%)', isFree: false },
                          { code: 'PAZ20', label: 'PAZ20 (-20%)', isFree: false },
                          { code: 'PICENI50', label: 'PICENI50 (-50%)', isFree: false }
                        ].map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setCouponInput(c.code);
                              handleApplyCoupon(c.code);
                            }}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border transition cursor-pointer flex items-center gap-1 font-semibold ${
                              c.isFree
                                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/20'
                            }`}
                          >
                            <Sparkles size={9} className="shrink-0" />
                            <span>{c.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        <div>
                          <div className="font-semibold text-emerald-300 font-mono text-[11px]">
                            Cupom "{appliedCoupon}" Ativo
                          </div>
                          <div className="text-[10px] text-slate-300">
                            Valor reduzido de <span className="line-through text-slate-500">{durationDays === 21 ? 'R$ 99,90' : 'R$ 59,90'}</span> para <strong className="text-emerald-300 font-bold">{formattedFinalPrice}</strong>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="p-1 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                        title="Remover"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}

                  {couponFeedback && !appliedCoupon && (
                    <p className={`text-[10px] ${couponFeedback.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {couponFeedback.message}
                    </p>
                  )}
                </div>

                {/* Payment Selection */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                      <span>Valor do Tratamento:</span>
                      {appliedCoupon ? (
                        <div className="flex items-center gap-1">
                          <span className="line-through text-slate-500 text-xs font-normal">R$ 70,00</span>
                          <span className="text-emerald-400 font-bold text-sm">{formattedFinalPrice}</span>
                        </div>
                      ) : (
                        <span className="text-emerald-400">R$ 70,00</span>
                      )}
                    </span>
                    <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleSelectPaymentMethod('pix')}
                        className={`px-3 py-1 text-xs font-medium rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                          paymentMethod === 'pix' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <QrCode size={12} className="shrink-0" />
                        <span>PIX</span>
                      </button>
                      
                      
                    </div>
                  </div>

                  {paymentMethod === 'pix' && (
                    <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs">
                      {/* Auto copy alert toast banner */}
                      <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-300">
                        <div className="flex items-center gap-1.5">
                          <Sparkles size={13} className="text-emerald-400 shrink-0" />
                          <span className="text-[11px]">
                            {copiedPix
                              ? '✨ Chave PIX copiada automaticamente para sua área de transferência!'
                              : 'Chave copiada automaticamente ao clicar no PIX.'}
                          </span>
                        </div>
                        {copiedPix && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                            COPIADA
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Chave PIX Oficial (E-mail):</span>
                        <button
                          type="button"
                          onClick={handleCopyPix}
                          className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedPix ? <Check size={12} className="shrink-0" /> : <Copy size={12} className="shrink-0" />}
                          <span>{copiedPix ? 'Copiado!' : 'Copiar Chave'}</span>
                        </button>
                      </div>
                      <div className="p-2 bg-slate-950 rounded-lg font-mono text-slate-200 text-xs border border-slate-850 select-all break-all flex items-center justify-between">
                        <span>evertonpiceni@gmail.com</span>
                        <span className="text-emerald-400 font-bold font-mono text-[11px]">{formattedFinalPrice}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Após o envio do PIX de {formattedFinalPrice}, clique abaixo para ativar e liberar a prescrição do seu tratamento imediatamente.
                      </p>
                    </div>
                  )} 

                </div>

                {/* Submit button */}
                <button
                  type="button"
                  disabled={!patientDescription.trim() || isProcessing}
                  onClick={handleProcessOrder}
                  className={`w-full py-3.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-xl ${
                    patientDescription.trim() && !isProcessing
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Canalizando e Ativando Tratamento Específico...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                                            <span>Confirmar Tratamento ({formattedFinalPrice})</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
