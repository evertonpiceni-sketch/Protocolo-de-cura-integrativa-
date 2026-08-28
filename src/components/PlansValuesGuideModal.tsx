/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sparkles, Crown, Heart, QrCode, Copy, ShieldCheck, CheckCircle2, Star, ArrowRight, MessageCircle } from 'lucide-react';

interface PlansValuesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planId: string) => void;
  onOpenProModal?: (planId?: string) => void;
  onSelectSpecificTreatment?: () => void;
  onOpenSpecificTreatment?: () => void;
}

export interface DetailedPlanInfo {
  id: string;
  category: 'assinatura' | 'tratamento_individual';
  title: string;
  badge?: string;
  isPopular?: boolean;
  priceFormatted: string;
  periodText: string;
  priceNumeric: number;
  highlightBenefit: string;
  features: string[];
  description: string;
  ctaText: string;
  accentColor: string;
  buttonClass: string;
}

export const ALL_PLANS_DATA: DetailedPlanInfo[] = [
  {
    id: 'jornada_7d',
    category: 'assinatura',
    title: 'Jornada 7 Dias (Alinhamento dos Chakras)',
    badge: 'Iniciação Quântica • R$ 15,00',
    priceFormatted: 'R$ 15,00',
    periodText: 'acesso à jornada de 7 dias',
    priceNumeric: 15.00,
    highlightBenefit: 'Acesso completo à nova jornada de 7 dias para alinhamento dos 7 centros de força.',
    features: [
      'Acesso completo à Jornada de 7 Dias (Chakra Raiz ao Coronário)',
      'Todas as frequências Solfeggio específicas (396Hz a 963Hz)',
      'Sons de fundo imersivos de floresta zen, chuva e ondas',
      'Diário de bordo quântico para anotações e registro diário',
      'Certificado Oficial de Conclusão da Jornada de 7 Dias'
    ],
    description: 'Ideal para quem busca um despertar rápido, focado e transformador de 7 dias.',
    ctaText: 'Escolher 7 Dias (R$ 15,00)',
    accentColor: 'emerald',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
  },
  {
    id: 'mensal',
    category: 'assinatura',
    title: 'Plano Pro Mensal',
    badge: 'Acesso Completo ao App',
    priceFormatted: 'R$ 39,90',
    periodText: 'por mês',
    priceNumeric: 39.90,
    highlightBenefit: 'Acesso ilimitado às jornadas de 7 e 21 dias durante 30 dias com relatórios e suporte.',
    features: [
      'Acesso ilimitado às Jornadas de 7 e 21 Dias',
      'Todas as 9 frequências Solfeggio e sons imersivos de fundo',
      'Relatório quântico de evolução emocional e gráfico de humor',
      'Diário de bordo com histórico completo e sincronização de streaks',
      'Suporte humanizado no WhatsApp com Éverton Rodrigo Piceni'
    ],
    description: 'Perfeito para manter uma rotina constante de autocura e reprogramação quântica.',
    ctaText: 'Escolher Mensal (R$ 39,90)',
    accentColor: 'indigo',
    buttonClass: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
  },
  {
    id: 'trimestral',
    category: 'assinatura',
    title: 'Plano Pro Trimestral',
    badge: '🎁 Tratamento 7d Incluso!',
    isPopular: true,
    priceFormatted: 'R$ 69,90',
    periodText: 'por 3 meses (R$ 23,30/mês)',
    priceNumeric: 69.90,
    highlightBenefit: '3 meses contínuos + DIREITO A 1 TRATAMENTO ESPECÍFICO DE 7 DIAS INCLUSO.',
    features: [
      '✨ DIREITO A 1 TRATAMENTO ESPECÍFICO DE 7 DIAS INCLUSO (Com Éverton Piceni)',
      'Acesso Pro irrestrito por 90 dias a todas as jornadas (7 e 21 dias)',
      'Alinhamento dos 7 Chakras e desbloqueio vibracional contínuo',
      'Emissão de Certificados Oficiais nominais de conclusão',
      'Atendimento e acolhimento prioritário no WhatsApp'
    ],
    description: 'Garante o tempo ideal para consolidar a cura celular e inclui uma canalização individualizada de 7 dias.',
    ctaText: 'Escolher Trimestral (R$ 69,90)',
    accentColor: 'amber',
    buttonClass: 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/20'
  },
  {
    id: 'semestral',
    category: 'assinatura',
    title: 'Plano Pro Semestral',
    badge: '🎵 1 Áudio 7d Incluso!',
    priceFormatted: 'R$ 99,90',
    periodText: 'por 6 meses (R$ 16,65/mês)',
    priceNumeric: 99.90,
    highlightBenefit: '6 meses contínuos + DIREITO A 1 ÁUDIO PERSONALIZADO DE 7 DIAS INCLUSO.',
    features: [
      '✨ DIREITO A 1 ÁUDIO PERSONALIZADO DE 7 DIAS INCLUSO (Canalizado sob medida)',
      'Acesso Pro irrestrito por 180 dias a todas as ferramentas e jornadas',
      'Relatório quântico avançado e acompanhamento de longo prazo',
      'Certificados Oficiais de Conclusão Quântica',
      'Canal VIP direto com o terapeuta Éverton Piceni'
    ],
    description: 'Meio ano de ancoragem espiritual inabalável com áudio terapêutico sob medida.',
    ctaText: 'Escolher Semestral (R$ 99,90)',
    accentColor: 'purple',
    buttonClass: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/20'
  },
  {
    id: 'anual',
    category: 'assinatura',
    title: 'Acesso Anual (Master Pro)',
    badge: '🌟 2 Áudios Especiais Inclusos!',
    priceFormatted: 'R$ 197,00',
    periodText: 'acesso perpétuo para sempre',
    priceNumeric: 197.00,
    highlightBenefit: 'Acesso para toda a vida + DIREITO A 1 ÁUDIO DE 7 DIAS + 1 ÁUDIO DE LIVRE ESCOLHA.',
    features: [
      '✨ DIREITO A 1 ÁUDIO DE 7 DIAS + 1 ÁUDIO DE LIVRE ESCOLHA INCLUSOS',
      'Acesso perpétuo para toda a vida sem novas mensalidades',
      'Todas as jornadas (7 Dias, 21 Dias e expansões futuras)',
      'Todas as frequências Solfeggio, músicas 8D e canalizações futuras',
      'Emissão de Certificado Oficial de Mestre Consciencial',
      'Canal VIP prioritário permanente de suporte no WhatsApp'
    ],
    description: 'Sua ancoragem definitiva de paz e autocura sempre acessível no seu bolso para o resto da sua vida.',
    ctaText: 'Acesso Anual (R$ 197,00)',
    accentColor: 'rose',
    buttonClass: 'bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-rose-600/20'
  },
  {
    id: 'tratamento_7d',
    category: 'tratamento_individual',
    title: 'Tratamento Específico (7 Dias)',
    badge: 'Canalização Pontual',
    priceFormatted: 'R$ 59,90',
    periodText: 'ciclo único de 7 dias',
    priceNumeric: 59.90,
    highlightBenefit: 'Atendimento focado em uma queixa aguda, dor física ou crise pontual.',
    features: [
      'Canalização vibracional focada no seu relato pessoal',
      'Direcionamento de frequência Solfeggio e sons curativos específicos',
      'Decreto de reprogramação psíquica para a dor/desafio informado',
      'Acompanhamento energético durante o ciclo de 7 dias',
      'Suporte direto via WhatsApp com Éverton Rodrigo Piceni'
    ],
    description: 'Voltado para quem passa por um momento de urgência emocional, dor física repentina ou bloqueio específico.',
    ctaText: 'Solicitar 7 Dias (R$ 59,90)',
    accentColor: 'teal',
    buttonClass: 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/20'
  },
  {
    id: 'tratamento_21d',
    category: 'tratamento_individual',
    title: 'Tratamento Específico (21 Dias)',
    badge: 'Canalização Aprofundada Individual',
    isPopular: true,
    priceFormatted: 'R$ 59,90',
    periodText: 'jornada completa de 21 dias',
    priceNumeric: 59.90,
    highlightBenefit: 'Alinhamento integral dos 7 chakras para dores crônicas, traumas ou prosperidade.',
    features: [
      'Canalização diária individualizada durante os 21 dias inteiros',
      'Tratamento para dores físicas crônicas, ansiedade e depressão',
      'Desbloqueio de fluxos de prosperidade material e reconciliação afetiva',
      'Limpeza de cordões energéticos e proteção áurica com Chama Violeta',
      'Prescrição personalizada na ficha de anamnese',
      'Atendimento e acolhimento direto com Éverton no WhatsApp'
    ],
    description: 'A transformação mais profunda e recomendada para quem deseja reescrever seu padrão vibracional em 21 dias.',
    ctaText: 'Solicitar 21 Dias (R$ 59,90)',
    accentColor: 'amber',
    buttonClass: 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/20'
  }
];

export function PlansValuesGuideModal({
  isOpen,
  onClose,
  onSelectPlan,
  onOpenProModal,
  onSelectSpecificTreatment,
  onOpenSpecificTreatment
}: PlansValuesGuideModalProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [copiedPixKey, setCopiedPixKey] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'todos' | 'assinatura' | 'tratamento_individual'>('todos');

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

  const handleCopyPix = () => {
    navigator.clipboard.writeText('evertonpiceni@gmail.com');
    setCopiedPixKey(true);
    setTimeout(() => setCopiedPixKey(false), 3500);
  };

  const handleTriggerPlan = (planId: string) => {
    onClose();
    if (onOpenProModal) {
      onOpenProModal(planId);
    } else if (onSelectPlan) {
      onSelectPlan(planId);
    }
  };

  const handleTriggerSpecificTreatment = () => {
    onClose();
    if (onOpenSpecificTreatment) {
      onOpenSpecificTreatment();
    } else if (onSelectSpecificTreatment) {
      onSelectSpecificTreatment();
    }
  };

  const filteredPlans = filterCategory === 'todos' 
    ? ALL_PLANS_DATA 
    : ALL_PLANS_DATA.filter((p) => p.category === filterCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto" id="plans-values-guide-modal">
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl relative overflow-hidden my-4 max-h-[92vh] overflow-y-auto"
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition cursor-pointer z-10"
        >
          <X size={16} />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium">
              <Crown size={14} className="text-amber-400" />
              <span>TRANSPARÊNCIA TOTAL & VALORES</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-medium text-slate-100">
              Todas as Opções de Valores e Planos
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto">
              Conheça exatamente o que cada plano e atendimento compreende. Escolha a opção que melhor abraça o seu momento de cura.
            </p>
          </div>

          {/* Quick PIX Card with instant auto-copy notice */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-950 to-teal-950/50 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                <QrCode size={22} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                  CHAVE PIX OFICIAL (E-MAIL)
                </span>
                <strong className="text-sm md:text-base font-mono text-slate-100 font-bold">
                  evertonpiceni@gmail.com
                </strong>
                <span className="text-[11px] text-slate-400 block">Titular: Éverton Rodrigo Piceni</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPix}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                {copiedPixKey ? <Check size={14} className="shrink-0" /> : <Copy size={14} className="shrink-0" />}
                <span>{copiedPixKey ? 'Chave Copiada! ✨' : 'Copiar Chave PIX'}</span>
              </button>
              <a
                href="https://wa.me/5551982215296?text=Ol%C3%A1%20%C3%89verton%2C%20gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20os%20planos%20do%20Protocolo%20de%20Cura%20Integrada!"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
              >
                <MessageCircle size={14} className="text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setFilterCategory('todos')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                filterCategory === 'todos' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos os Planos ({ALL_PLANS_DATA.length})
            </button>
            <button
              onClick={() => setFilterCategory('assinatura')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                filterCategory === 'assinatura' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Planos do App
            </button>
            <button
              onClick={() => setFilterCategory('tratamento_individual')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                filterCategory === 'tratamento_individual' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Tratamentos Específicos (7d / 21d)
            </button>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlans.map((plan) => {
              return (
                <div
                  key={plan.id}
                  className={`p-5 rounded-3xl border flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
                    plan.isPopular
                      ? 'bg-slate-950/80 border-amber-500/50 shadow-xl shadow-amber-950/20 ring-1 ring-amber-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Badge */}
                  {plan.badge && (
                    <div className="mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border inline-flex items-center gap-1 ${
                        plan.isPopular
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : plan.category === 'tratamento_individual'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      }`}>
                        {plan.isPopular && <Star size={10} className="fill-amber-400 text-amber-400" />}
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-100">{plan.title}</h3>
                      <div className="flex items-baseline gap-1 mt-1">
                        <strong className="text-2xl font-bold text-slate-100">{plan.priceFormatted}</strong>
                        <span className="text-xs text-slate-400 font-sans">{plan.periodText}</span>
                      </div>
                    </div>

                    <p className="text-xs text-indigo-300/90 font-medium leading-snug">
                      ✨ {plan.highlightBenefit}
                    </p>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {plan.description}
                    </p>

                    {/* Features list */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                        O que este valor compreende:
                      </span>
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                          <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight text-[11px]">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 mt-4 border-t border-slate-850">
                    <button
                      type="button"
                      onClick={() => {
                        if (plan.category === 'tratamento_individual') {
                          handleTriggerSpecificTreatment();
                        } else {
                          handleTriggerPlan(plan.id);
                        }
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${plan.buttonClass}`}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Therapist Direct Assistance & Custom Coupon Notice */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/20 via-purple-950/20 to-slate-900 border border-amber-500/30 space-y-3" id="coupons-directory">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                <span>Cupons de Desconto & Cortesias Exclusivas</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Liberados sob consulta</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <p className="text-slate-200 font-medium leading-relaxed">
                  Os cupons de desconto, bolsas terapêuticas e cortesias de degustação de 7 dias são liberados individualmente pelo terapeuta <strong>Éverton Rodrigo Piceni</strong>.
                </p>
                <p className="text-[11px] text-slate-400">
                  Se você recebeu um código de cupom pessoal, basta inseri-lo no campo de cupom na tela de inscrição ou no checkout para ativar seu benefício.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto">
                <a
                  href="https://wa.me/5551982215296?text=Ol%C3%A1%20%C3%89verton%2C%20gostaria%20de%20saber%20sobre%20as%20condi%C3%A7%C3%B5es%20especiais%20e%20cupons%20do%20Protocolo%20de%20Cura%20Integrada!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <MessageCircle size={14} />
                  <span>Fale Conosco</span>
                </a>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-purple-300 shrink-0" />
                <span className="text-purple-200 font-medium">
                  <strong>Brinde para Todos os Clientes:</strong> Cálculo automático do seu <strong>Mapa Astral & Energético Quântico</strong> (Sol, Lua, Ascendente, 4 Elementos e Chakra regente).
                </span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
            <p className="text-xs text-slate-300 font-sans">
              💖 <strong>Valores Acessíveis & Personalizados:</strong> Caso queira ajustar o valor da sua contribuição ou tirar dúvidas, fale conosco diretamente pelo WhatsApp.
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              O Protocolo de Cura Integrada de 21 dias é canalizado e conduzido por Éverton Rodrigo Piceni.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PlansValuesGuideModal;
