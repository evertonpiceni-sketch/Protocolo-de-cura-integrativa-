/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crown, Sparkles, Check, ShieldCheck, X, Zap, Heart,
  Award, QrCode, CreditCard, Copy, CheckCircle2, Star, Download, Radio, MessageSquare, Clock, Landmark, Tag, Percent, Trash2
} from 'lucide-react';
import { UserProfile, SubscriptionPlanType } from '../types';
import peacefulImage from '../assets/images/peaceful_serene_sanctuary_1786776416902.jpg';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpgradeSuccess: (plan: SubscriptionPlanType, paymentMethod: 'pix' | 'card', price: number) => void;
  onOpenContact?: () => void;
}

const PAID_SUBSCRIPTION_PLANS: {
  id: SubscriptionPlanType;
  title: string;
  badge?: string;
  badgeColor?: string;
  priceFormatted: string;
  priceNumber: number;
  periodText: string;
  description: string;
  highlight?: boolean;
  compreende: string[];
}[] = [
  {
    id: 'jornada_7d',
    title: 'Jornada 7 Dias',
    badge: 'Iniciação Quântica',
    badgeColor: 'bg-emerald-500 text-slate-950 font-bold',
    priceFormatted: 'R$ 15,00',
    priceNumber: 15.00,
    periodText: 'acesso 7 dias',
    description: 'Jornada intensiva de 7 dias focada no alinhamento profundo dos 7 centros energéticos.',
    compreende: [
      'Acesso completo à Nova Jornada de 7 Dias (dos 7 Chakras)',
      'Todas as frequências Solfeggio específicas (396Hz a 963Hz)',
      'Sons de fundo imersivos de floresta zen, chuva e ondas',
      'Diário de bordo quântico para anotações diárias',
      'Certificado Oficial de Conclusão da Jornada de 7 Dias'
    ]
  },
  {
    id: 'mensal',
    title: 'Plano Pro Mensal',
    badge: 'Acesso Completo',
    badgeColor: 'bg-indigo-500 text-white font-bold',
    priceFormatted: 'R$ 39,90',
    priceNumber: 39.90,
    periodText: '/ mês',
    description: 'Acesso contínuo às jornadas de 7 e 21 dias com relatórios quânticos e suporte.',
    compreende: [
      'Acesso ilimitado às Jornadas de 7 e 21 Dias',
      'Todas as 9 frequências Solfeggio e sons imersivos de fundo',
      'Relatório quântico de evolução emocional e gráfico de humor',
      'Diário de bordo com histórico e sincronização de streaks',
      'Suporte humanizado no WhatsApp com Éverton Rodrigo Piceni'
    ]
  },
  {
    id: 'trimestral',
    title: 'Plano Pro Trimestral',
    badge: 'Tratamento 7d Incluso!',
    badgeColor: 'bg-amber-400 text-slate-950 font-bold',
    priceFormatted: 'R$ 69,90',
    priceNumber: 69.90,
    periodText: 'por 3 meses',
    description: '3 meses de purificação contínua + Direito a 1 Tratamento Específico de 7 Dias com Éverton Piceni.',
    highlight: true,
    compreende: [
      '✨ DIREITO A 1 TRATAMENTO ESPECÍFICO DE 7 DIAS INCLUSO',
      'Acesso Pro irrestrito por 90 dias a todas as jornadas (7 e 21 dias)',
      'Alinhamento dos 7 Chakras e desbloqueio vibracional contínuo',
      'Emissão de Certificados Oficiais nominais de conclusão',
      'Atendimento e acolhimento prioritário no WhatsApp'
    ]
  },
  {
    id: 'semestral',
    title: 'Plano Pro Semestral',
    badge: '1 Áudio 7d Incluso!',
    badgeColor: 'bg-purple-500 text-white font-bold',
    priceFormatted: 'R$ 99,90',
    priceNumber: 99.90,
    periodText: 'por 6 meses',
    description: '6 meses de alinhamento inabalável + Direito a 1 Áudio Canalizado exclusivo de 7 dias.',
    compreende: [
      '✨ DIREITO A 1 ÁUDIO PERSONALIZADO DE 7 DIAS INCLUSO',
      'Acesso Pro irrestrito por 180 dias a todas as ferramentas e jornadas',
      'Relatório quântico avançado e acompanhamento de longo prazo',
      'Certificados Oficiais de Conclusão Quântica',
      'Canal VIP direto com o terapeuta Éverton Piceni'
    ]
  },
  {
    id: 'anual',
    title: 'Acesso Anual Pro (Master)',
    badge: '2 Áudios Inclusos!',
    badgeColor: 'bg-cyan-400 text-slate-950 font-bold',
    priceFormatted: 'R$ 197,00',
    priceNumber: 197.00,
    periodText: 'por ano',
    description: 'Acesso anual + 1 Áudio de 7 dias + 1 Áudio de livre escolha inclusos.',
    compreende: [
      '✨ DIREITO A 1 ÁUDIO DE 7 DIAS + 1 ÁUDIO DE LIVRE ESCOLHA INCLUSOS',
      'Acesso anual',
      'Todas as jornadas (7 Dias, 21 Dias e futuras expansões)',
      'Todas as frequências Solfeggio, músicas 8D e canalizações futuras',
      'Emissão de Certificado Oficial de Mestre Consciencial',
      'Canal VIP permanente com o terapeuta Éverton Rodrigo Piceni'
    ]
  }
];

const DEGUSTACAO_PLAN_ITEM = {
  id: 'teste_vip_7d' as SubscriptionPlanType,
  title: 'Degustação VIP 7 Dias (Cupom)',
  badge: '100% Grátis com Cupom',
  badgeColor: 'bg-emerald-500 text-slate-950 font-bold',
  priceFormatted: 'R$ 0,00',
  priceNumber: 0.00,
  periodText: '/ 7 dias grátis',
  description: 'Degustação liberada através de cupom exclusivo fornecido pelo terapeuta Éverton Piceni.',
  highlight: true,
  compreende: [
    'Acesso Pro de degustação por 7 dias ao Protocolo de Cura',
    'Frequências Solfeggio e sons imersivos liberados',
    'Diário de bordo quântico e Perguntas Sistêmicas',
    'Ativação imediata gratuita concedida com sucesso'
  ]
};

export default function ProUpgradeModal({
  isOpen,
  onClose,
  userProfile,
  onUpgradeSuccess,
  onOpenContact
}: ProUpgradeModalProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanType>('trimestral');
  const [isCustomPrice, setIsCustomPrice] = useState(false);
  const [customPriceInput, setCustomPriceInput] = useState('69,90');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | 'debit'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  // Discount coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState(userProfile.fullName || userProfile.name || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Scroll to top whenever modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = 0;
        }
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isDegustacaoCouponActive = Boolean(
    appliedCoupon && ['VIP7', 'GRATIS7', 'VIP', 'TESTEVIP', 'CURA7', '7DIAS', 'SETE7', 'PICENI7', 'DEGUSTACAO', 'DEGUSTA7'].includes(appliedCoupon)
  );

  const availablePlans = isDegustacaoCouponActive
    ? [DEGUSTACAO_PLAN_ITEM, ...PAID_SUBSCRIPTION_PLANS]
    : PAID_SUBSCRIPTION_PLANS;

  const currentPlan = availablePlans.find(p => p.id === selectedPlanId) || availablePlans[0];
  
  // Price calculations with discount
  const parsedCustomPrice = parseFloat(customPriceInput.replace(',', '.')) || 0;
  const basePrice = isCustomPrice ? Math.max(0, parsedCustomPrice) : currentPlan.priceNumber;
  const discountAmount = discountPercent > 0 ? (basePrice * discountPercent) / 100 : 0;
  const finalPrice = Math.max(0, basePrice - discountAmount);
  const formattedFinalPrice = `R$ ${finalPrice.toFixed(2).replace('.', ',')}`;

  const pixCode = `00020126580014br.gov.bcb.pix0136evertonpiceni@gmail.com520400005303986540${finalPrice.toFixed(2)}5802BR5920EVERTON PICENI6009SAO PAULO62070503***6304E8A2`;

  const copyPixToClipboard = (customText?: string) => {
    const textToCopy = customText || pixCode;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3500);
    }
  };

  const handleSelectPaymentMethod = (method: 'pix' | 'credit' | 'debit') => {
    setPaymentMethod(method);
    if (method === 'pix') {
      copyPixToClipboard();
    }
  };

  const handleApplyCoupon = (codeToApply?: string) => {
    const rawCode = (codeToApply || couponInput).trim().toUpperCase();
    if (!rawCode) {
      setCouponFeedback({ type: 'error', message: 'Digite um código de cupom válido.' });
      return;
    }

    const free7dCoupons = ['VIP7', 'GRATIS7', 'VIP', 'TESTEVIP', 'CURA7', '7DIAS', 'SETE7', 'PICENI7', 'DEGUSTACAO', 'DEGUSTA7'];

    if (free7dCoupons.includes(rawCode)) {
      setSelectedPlanId('teste_vip_7d');
      setDiscountPercent(100);
      setAppliedCoupon(rawCode);
      setCouponFeedback({ type: 'success', message: `✨ Cupom ${rawCode} Ativado! Degustação de 7 Dias 100% Gratuita liberada!` });
    } else if (rawCode === 'DESCONTO10' || rawCode === 'CURA10' || rawCode === 'PAZ10' || rawCode === 'LUZ10') {
      setDiscountPercent(10);
      setAppliedCoupon(rawCode);
      setCouponFeedback({ type: 'success', message: 'Cupom de 10% de desconto aplicado em harmonia! ✨' });
    } else if (rawCode === 'DESCONTO20' || rawCode === 'PAZ20' || rawCode === 'CURA20' || rawCode === 'LUZ20' || rawCode === 'GRATIDAO') {
      setDiscountPercent(20);
      setAppliedCoupon(rawCode);
      setCouponFeedback({ type: 'success', message: 'Cupom de 20% de desconto aplicado com sucesso! 🌸' });
    } else if (rawCode === 'DESCONTO30' || rawCode === 'PROMO30' || rawCode === 'CURA30' || rawCode === 'TERAPEUTA30') {
      setDiscountPercent(30);
      setAppliedCoupon(rawCode);
      setCouponFeedback({ type: 'success', message: 'Cupom de 30% de desconto ativado com sucesso! 🌟' });
    } else if (rawCode === 'DESCONTO50' || rawCode === 'PICENI50' || rawCode === 'VIP50' || rawCode === 'MESTRE50' || rawCode === 'METADE50') {
      setDiscountPercent(50);
      setAppliedCoupon(rawCode);
      setCouponFeedback({ type: 'success', message: 'Cupom Especial de 50% de desconto concedido! 👑' });
    } else if (rawCode.includes('10')) {
      setDiscountPercent(10);
      setAppliedCoupon(rawCode);
      setCouponFeedback({ type: 'success', message: `Cupom ${rawCode} de 10% de desconto aplicado!` });
    } else if (rawCode.includes('20')) {
      setDiscountPercent(20);
      setAppliedCoupon(rawCode);
      setCouponFeedback({ type: 'success', message: `Cupom ${rawCode} de 20% de desconto aplicado!` });
    } else if (rawCode.includes('30')) {
      setDiscountPercent(30);
      setAppliedCoupon(rawCode);
      setCouponFeedback({ type: 'success', message: `Cupom ${rawCode} de 30% de desconto aplicado!` });
    } else if (rawCode.includes('50')) {
      setDiscountPercent(50);
      setAppliedCoupon(rawCode);
      setCouponFeedback({ type: 'success', message: `Cupom ${rawCode} de 50% de desconto aplicado!` });
    } else {
      // Default bonus coupon
      setDiscountPercent(15);
      setAppliedCoupon(rawCode);
      setCouponFeedback({ type: 'success', message: `Cupom especial ${rawCode} de 15% de desconto ativado!` });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercent(0);
    setCouponInput('');
    setCouponFeedback(null);
    if (selectedPlanId === 'teste_vip_7d') {
      setSelectedPlanId('trimestral');
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onUpgradeSuccess(selectedPlanId, paymentMethod === 'pix' ? 'pix' : 'card', finalPrice);
      }, 1800);
    }, 1200);
  };

  const handleInstantTestUpgrade = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onUpgradeSuccess(selectedPlanId, paymentMethod === 'pix' ? 'pix' : 'card', finalPrice);
      }, 1200);
    }, 600);
  };

  // Direct WhatsApp confirmation message link
  const getWhatsAppMessageUrl = () => {
    const methodLabel = paymentMethod === 'pix' ? 'PIX' : paymentMethod === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito';
    const discountInfo = appliedCoupon ? ` (Cupom ${appliedCoupon}: ${discountPercent}% OFF -> ${formattedFinalPrice})` : ` (${currentPlan.priceFormatted})`;
    const text = encodeURIComponent(
      `Olá Éverton Rodrigo Piceni! Acabei de realizar o pagamento do ${currentPlan.title}${discountInfo} no Protocolo de Cura Integrada de 21 Dias.\n\n` +
      `*Meus Dados:*\n` +
      `• Nome: ${userProfile.fullName || userProfile.name}\n` +
      `• E-mail: ${userProfile.email}\n` +
      `• Plano Escolhido: ${currentPlan.title}\n` +
      `• Valor Pago: ${formattedFinalPrice}\n` +
      `• Forma de Pagamento: ${methodLabel}\n\n` +
      `Estou pronto(a) para seguir a jornada com o App Pro liberado!`
    );
    return `https://wa.me/5551982215296?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto" id="pro-upgrade-modal">
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden my-4 max-h-[92vh] overflow-y-auto"
      >
        {/* Glow backdrop effects */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-200 flex items-center justify-center transition cursor-pointer z-10"
        >
          <X size={16} />
        </button>

        {!isSuccess ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium mb-1">
                <Crown size={14} className="text-amber-400" />
                <span>LIBERAÇÃO IMEDIATA DO APLICATIVO</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-medium text-slate-100">
                Escolha o seu Plano de Acesso Pro
              </h2>
              <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto">
                Assim que o pagamento for concluído (PIX ou Cartão), o aplicativo é liberado instantaneamente na sua conta.
              </p>
            </div>

            {/* Peaceful Serene Sanctuary Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 shadow-md">
              <img
                src={peacefulImage}
                alt="Santuário Sereno de Paz e Cura"
                referrerPolicy="no-referrer"
                className="w-full h-24 sm:h-28 object-cover object-center filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex items-end p-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <p className="text-xs font-medium text-slate-100 drop-shadow-sm">
                    Espaço de Cura Quântica & Conexão Sagrada • Frequências Restauradoras
                  </p>
                </div>
              </div>
            </div>

            {/* Exclusive VIP Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  icon: <Radio size={15} className="text-amber-400" />,
                  title: "Frequências 963Hz e 741Hz",
                  desc: "Ativação da pineal e desintoxicação celular."
                },
                {
                  icon: <Sparkles size={15} className="text-amber-400" />,
                  title: "Vozes Neurais Humanizadas",
                  desc: "Cadência terapêutica personalizada."
                },
                {
                  icon: <Award size={15} className="text-amber-400" />,
                  title: "Certificado Nominal Oficial",
                  desc: "Emissão em alta definição ao fim dos 21 dias."
                }
              ].map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80"
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/10 shrink-0">
                    {feat.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{feat.title}</h4>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Subscription Plans grid */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  Selecione o seu Plano ({availablePlans.length} Opções Disponíveis):
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomPrice(!isCustomPrice);
                    if (!isCustomPrice) {
                      setCustomPriceInput(currentPlan.priceNumber.toFixed(2).replace('.', ','));
                    }
                  }}
                  className="text-[11px] font-mono text-amber-400 hover:text-amber-300 transition flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles size={12} />
                  <span>{isCustomPrice ? 'Usar Valor do Plano' : '✏️ Ajustar Valor'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {availablePlans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => {
                        setSelectedPlanId(plan.id);
                        if (!isCustomPrice) {
                          setCustomPriceInput(plan.priceNumber.toFixed(2).replace('.', ','));
                        }
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer relative transition duration-150 flex flex-col justify-between h-full ${
                        isSelected
                          ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {plan.badge && (
                        <div className={`absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase shadow-sm ${plan.badgeColor || 'bg-amber-500 text-slate-950'}`}>
                          {plan.badge}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-mono font-bold ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                            {plan.title}
                          </span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-amber-400 bg-amber-500/20' : 'border-slate-700'}`}>
                            {isSelected && <Check size={10} className="text-amber-300" />}
                          </div>
                        </div>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-lg md:text-xl font-bold text-slate-100">{plan.priceFormatted}</span>
                          <span className="text-[10px] text-slate-400">{plan.periodText}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                          {plan.description}
                        </p>

                        {/* O que compreende */}
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1">
                          <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Compreende:</span>
                          {plan.compreende.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-1 text-[10px] text-slate-300 leading-tight">
                              <CheckCircle2 size={10} className="text-emerald-400 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Value input field */}
              {isCustomPrice && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3 shadow-inner mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <span>💰 Definir Valor Personalizado para o Upgrade</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Plano selecionado: <strong>{currentPlan.title}</strong>
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
                        className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-750 rounded-xl text-sm font-mono font-bold text-amber-300 outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      {['15,00', '39,90', '69,90', '99,90', '197,00'].map((val) => (
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
                    Insira qualquer valor desejado para sua inscrição ou contribuição sagrada.
                  </p>
                </div>
              )}
            </div>

            {/* Coupon / Discount Option Section */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5" id="pro-discount-section">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                  <Tag size={13} className="text-amber-400 shrink-0" />
                  <span>Possui Cupom do Terapeuta?</span>
                </span>
                {appliedCoupon && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
                    <Percent size={10} />
                    {discountPercent}% OFF ATIVO
                  </span>
                )}
              </div>

              {!appliedCoupon ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Digite seu código de cupom..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500 font-mono uppercase"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer shadow-md shadow-amber-500/10"
                    >
                      <Tag size={12} className="shrink-0" />
                      <span>Aplicar Cupom</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Insira o código de desconto ou cortesia exclusivo concedido pelo terapeuta Éverton Rodrigo Piceni.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <div className="font-semibold text-emerald-300 font-mono">
                        Cupom "{appliedCoupon}" Aplicado
                      </div>
                      <div className="text-[10px] text-slate-300">
                        Economia de {discountPercent}% ({`R$ ${discountAmount.toFixed(2).replace('.', ',')}`})
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition cursor-pointer rounded-lg hover:bg-slate-800"
                    title="Remover Cupom"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}

              {couponFeedback && !appliedCoupon && (
                <p className={`text-[10px] font-medium ${couponFeedback.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {couponFeedback.message}
                </p>
              )}
            </div>

            {/* Payment Method Selector or Free Trial Activator */}
            {finalPrice === 0 || selectedPlanId === 'teste_vip_7d' ? (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 space-y-3.5 shadow-lg shadow-emerald-950/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <Sparkles size={22} className="animate-pulse" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                      <span>🎉 Teste VIP de 7 Dias 100% Grátis!</span>
                      <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">SEM CARTÃO</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Você ativou a degustação VIP de 7 dias com acesso irrestrito a todas as frequências e recursos sagrados de cura.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleInstantTestUpgrade}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-emerald-500/20"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Crown size={16} className="shrink-0" />
                      <span>Ativar Meu Teste VIP de 7 Dias Grátis Agora</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <span>Forma de Pagamento:</span>
                    {appliedCoupon && (
                      <span className="text-emerald-400 font-bold font-mono">
                        (Total com Desconto: {formattedFinalPrice})
                      </span>
                    )}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleSelectPaymentMethod('pix')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                        paymentMethod === 'pix' ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <QrCode size={13} className="shrink-0" />
                      <span>PIX Instantâneo</span>
                    </button>
                    
                    
                  </div>
                </div>

              {paymentMethod === 'pix' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  {/* Auto copy alert toast banner */}
                  <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-300">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-emerald-400 shrink-0" />
                      <span className="font-sans text-[11px]">
                        {copiedPix
                          ? '✨ Código Copia e Cola copiado com sucesso para sua área de transferência!'
                          : 'Clique no PIX para copiar o código Copia e Cola automaticamente.'}
                      </span>
                    </div>
                    {copiedPix && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                        COPIADO
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Simulated visual QR Code */}
                    <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shadow shrink-0">
                      <div className="w-full h-full border-2 border-slate-900 border-dashed rounded flex flex-col items-center justify-center text-slate-900 text-[10px] font-mono text-center p-1">
                        <QrCode size={40} className="text-slate-900 mb-0.5" />
                        <span className="font-bold text-[9px]">{formattedFinalPrice}</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                      <div className="text-xs text-slate-300">
                        Chave PIX Oficial (E-mail): <strong className="text-amber-300 font-mono">evertonpiceni@gmail.com</strong>
                      </div>
                      <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-1.5 justify-center sm:justify-start">
                        <span>Valor a pagar:</span>
                        {appliedCoupon ? (
                          <>
                            <span className="text-slate-500 line-through text-xs">{currentPlan.priceFormatted}</span>
                            <strong className="text-emerald-400 font-mono text-sm font-bold">{formattedFinalPrice}</strong>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">(-{discountPercent}%)</span>
                          </>
                        ) : (
                          <strong className="text-emerald-400 font-mono text-sm">{currentPlan.priceFormatted}</strong>
                        )}
                        <span className="text-slate-400 font-mono">({currentPlan.title})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={pixCode}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-400 font-mono select-all outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => copyPixToClipboard()}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0 transition cursor-pointer"
                        >
                          {copiedPix ? <Check size={13} className="text-emerald-400 shrink-0" /> : <Copy size={13} className="shrink-0" />}
                          <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleConfirmPayment}
                      disabled={isProcessing}
                      className="w-full flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
                    >
                      {isProcessing ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 size={16} className="shrink-0" />
                          <span>Pagar {formattedFinalPrice} e Liberar {currentPlan.title}</span>
                        </>
                      )}
                    </button>

                    {onOpenContact ? (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenContact();
                        }}
                        className="px-3.5 py-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition whitespace-nowrap cursor-pointer"
                        title="Enviar comprovante pelo canal Fale Conosco"
                      >
                        <MessageSquare size={14} className="shrink-0" />
                        <span className="hidden sm:inline">Fale Conosco / Comprovante</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => copyPixToClipboard()}
                        className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition whitespace-nowrap cursor-pointer"
                      >
                        <Copy size={14} className="shrink-0" />
                        <span className="hidden sm:inline">Copiar Chave PIX</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Instant Test Activation for demo */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={handleInstantTestUpgrade}
                className="text-[11px] text-amber-400/80 hover:text-amber-300 flex items-center justify-center gap-1 mx-auto transition cursor-pointer underline underline-offset-4"
              >
                <Sparkles size={13} />
                <span>Simulação: Ativar {currentPlan.title} Imediatamente</span>
              </button>
            </div>
          </div>
        ) : (
          /* Celebratory Success State */
          <div className="py-8 text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/30"
            >
              <Crown size={38} />
            </motion.div>

            <div className="space-y-1">
              <h3 className="text-xl md:text-2xl font-display font-medium text-amber-300">
                Acesso {currentPlan.title} Liberado em Harmonia
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Sua conexão foi ativada com sucesso. Aproveite todas as frequências quânticas sagradas, relatórios energéticos, seu Mapa Astral e o certificado de alinhamento.
              </p>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 flex items-center justify-center gap-2 max-w-sm mx-auto">
              <Star size={15} className="text-amber-400 fill-amber-400" />
              <span>Selo VIP ({currentPlan.title}) ativo no seu perfil!</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
