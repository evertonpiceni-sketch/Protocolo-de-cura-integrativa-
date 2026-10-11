/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, Crown, QrCode, Copy, Star, ArrowRight, MessageCircle } from 'lucide-react';

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
}

export const ALL_PLANS_DATA: DetailedPlanInfo[] = [
  {
    id: 'mensal',
    category: 'assinatura',
    title: 'Plano Mensal',
    badge: 'R$ 5 de desconto na Anamnese Completa',
    priceFormatted: 'R$ 39,90',
    periodText: 'por mês',
    priceNumeric: 39.9,
    highlightBenefit: 'No mensal, a Anamnese Completa cai de R$ 15,00 para R$ 10,00.',
    features: [
      'Anamnese Compacta incluída com resultado imediato',
      'Acesso aos protocolos disponíveis durante 30 dias',
      'Diário privado e acompanhamento nos marcos da jornada',
      'Anamnese Completa por R$ 10,00 — desconto de R$ 5,00',
      'Você pode seguir normalmente apenas com o resultado compacto'
    ],
    description: 'Para quem quer um mês de acesso e a opção de aprofundar a análise com valor reduzido.',
    ctaText: 'Escolher Mensal'
  },
  {
    id: 'trimestral',
    category: 'assinatura',
    title: 'Plano Trimestral',
    badge: 'Anamnese Completa incluída',
    isPopular: true,
    priceFormatted: 'R$ 69,90',
    periodText: 'por 3 meses',
    priceNumeric: 69.9,
    highlightBenefit: 'A partir do trimestral, a Anamnese Completa já faz parte do plano.',
    features: [
      'Anamnese Compacta com resultado imediato',
      'Anamnese Completa incluída sem cobrança adicional',
      'Acesso aos protocolos disponíveis por 90 dias',
      'Diário privado e leituras de acompanhamento',
      'Mais tempo para continuidade e integração'
    ],
    description: 'O plano de continuidade com o aprofundamento completo já incluído.',
    ctaText: 'Escolher Trimestral'
  },
  {
    id: 'semestral',
    category: 'assinatura',
    title: 'Plano Semestral',
    badge: 'Anamnese Completa incluída',
    priceFormatted: 'R$ 99,90',
    periodText: 'por 6 meses',
    priceNumeric: 99.9,
    highlightBenefit: 'Seis meses de acesso com Anamnese Completa já incluída.',
    features: [
      'Anamnese Compacta e Anamnese Completa incluídas',
      'Acesso aos protocolos disponíveis durante 180 dias',
      'Diário privado e acompanhamento de longo prazo',
      '1 áudio personalizado de 7 dias',
      'Mapa Astral Completo OU Numerologia Completa'
    ],
    description: 'Para quem deseja sustentar a jornada por mais tempo, com benefícios adicionais.',
    ctaText: 'Escolher Semestral'
  },
  {
    id: 'anual',
    category: 'assinatura',
    title: 'Plano Anual',
    badge: 'Anamnese Completa incluída',
    priceFormatted: 'R$ 159,90',
    periodText: 'por 12 meses',
    priceNumeric: 159.9,
    highlightBenefit: 'Acesso contínuo por um ano com Anamnese Completa incluída.',
    features: [
      'Anamnese Compacta e Anamnese Completa incluídas',
      'Acesso aos protocolos e recursos disponíveis por 12 meses',
      'Histórico e acompanhamento preservados',
      'Benefícios adicionais do plano anual'
    ],
    description: 'Para quem prefere manter um espaço contínuo de acompanhamento ao longo do ano.',
    ctaText: 'Escolher Anual'
  },
  {
    id: 'tratamento_7d',
    category: 'tratamento_individual',
    title: 'Acompanhamento Específico — 7 Dias',
    badge: 'Ciclo individual',
    priceFormatted: 'R$ 59,90',
    periodText: 'ciclo único de 7 dias',
    priceNumeric: 59.9,
    highlightBenefit: 'Um ciclo individual de sete dias voltado ao tema trazido pela pessoa.',
    features: [
      'Escuta do relato e definição do foco do ciclo',
      'Práticas de apoio organizadas para sete dias',
      'Anamnese Compacta incluída',
      'Anamnese Completa opcional por R$ 15,00',
      'Acompanhamento direto durante o período contratado'
    ],
    description: 'Acompanhamento individualizado; não é a adaptação automática de uma jornada de 21 dias.',
    ctaText: 'Solicitar 7 Dias'
  },
  {
    id: 'tratamento_21d',
    category: 'tratamento_individual',
    title: 'Acompanhamento Específico — 21 Dias',
    badge: 'Ciclo individual aprofundado',
    priceFormatted: 'R$ 99,90',
    periodText: 'ciclo único de 21 dias',
    priceNumeric: 99.9,
    highlightBenefit: 'Um ciclo individual mais longo, com espaço para aprofundamento e integração.',
    features: [
      'Escuta do relato e definição do foco do ciclo',
      'Práticas de apoio organizadas para 21 dias',
      'Anamnese Compacta incluída',
      'Anamnese Completa opcional por R$ 15,00',
      'Acompanhamento direto durante o período contratado'
    ],
    description: 'Para quem deseja mais tempo de continuidade em um ciclo individualizado.',
    ctaText: 'Solicitar 21 Dias'
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
    if (isOpen) window.setTimeout(() => { if (containerRef.current) containerRef.current.scrollTop = 0; }, 50);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyPix = () => {
    navigator.clipboard.writeText('evertonpiceni@gmail.com');
    setCopiedPixKey(true);
    window.setTimeout(() => setCopiedPixKey(false), 3500);
  };

  const handleTriggerPlan = (planId: string) => {
    onClose();
    if (onOpenProModal) onOpenProModal(planId);
    else onSelectPlan?.(planId);
  };

  const handleSpecificTreatment = () => {
    onClose();
    if (onOpenSpecificTreatment) onOpenSpecificTreatment();
    else onSelectSpecificTreatment?.();
  };

  const filteredPlans = filterCategory === 'todos' ? ALL_PLANS_DATA : ALL_PLANS_DATA.filter(plan => plan.category === filterCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1F2E27]/35 backdrop-blur-md overflow-y-auto" id="plans-values-guide-modal">
      <motion.div ref={containerRef} initial={{ opacity: 0, scale: 0.97, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-5xl bg-[#FFF9E8] border border-[#D8B867]/30 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl relative my-4 max-h-[92vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/70 border border-[#D8B867]/25 text-[#5F6857] flex items-center justify-center z-10" aria-label="Fechar"><X size={16} /></button>

        <div className="space-y-6">
          <header className="text-center space-y-2 px-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7E5AA]/40 border border-[#D8B867]/30 text-[#7C5A1D] text-xs font-medium"><Crown size={14} /><span>PLANOS E VALORES</span></div>
            <h2 className="text-2xl md:text-3xl font-display font-medium text-[#26372A]">Escolha a forma de acesso que combina com o seu momento</h2>
            <p className="text-xs md:text-sm text-[#5F6857] max-w-2xl mx-auto">Seu primeiro dia é de experiência. A Anamnese Compacta mostra o resultado imediatamente. Depois, você escolhe um protocolo realmente disponível; a adaptação pública de 7 dias só será oferecida quando estiver finalizada e auditada.</p>
          </header>

          <div className="p-4 rounded-2xl bg-[#073B2B] border border-[#D8B867]/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3 text-center sm:text-left"><div className="p-2.5 rounded-xl bg-white/10 text-[#F7E5AA] border border-white/10 shrink-0"><QrCode size={22} /></div><div><span className="text-[10px] uppercase tracking-wider text-[#D9BD72] font-bold block">CHAVE PIX OFICIAL</span><strong className="text-sm md:text-base text-[#FFF9E8] font-bold">evertonpiceni@gmail.com</strong><span className="text-[11px] text-[#E9DFC9] block">Titular: Éverton Rodrigo Piceni</span></div></div>
            <button type="button" onClick={handleCopyPix} className="px-4 py-2 bg-[#F7E5AA] text-[#073B2B] rounded-xl text-xs font-semibold flex items-center gap-1.5">{copiedPixKey ? <Check size={14} /> : <Copy size={14} />}<span>{copiedPixKey ? 'Chave copiada' : 'Copiar chave PIX'}</span></button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {([['todos', `Todos (${ALL_PLANS_DATA.length})`], ['assinatura', 'Planos'], ['tratamento_individual', 'Acompanhamentos individuais']] as const).map(([value, label]) => <button key={value} onClick={() => setFilterCategory(value)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${filterCategory === value ? 'bg-[#073B2B] text-[#FFF9E8]' : 'bg-white/70 text-[#5F6857] border border-[#D8B867]/20'}`}>{label}</button>)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {filteredPlans.map(plan => <article key={plan.id} className={`p-5 rounded-3xl border flex h-full flex-col ${plan.isPopular ? 'bg-[#FFF6D9] border-[#B88736]/50 shadow-xl shadow-[#6A5425]/10' : 'bg-white/75 border-[#D8B867]/22'}`}>
              {plan.badge && <div className="mb-3"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${plan.isPopular ? 'bg-[#073B2B] text-[#FFF9E8] border-[#073B2B]' : 'bg-[#F7E5AA]/45 text-[#7C5A1D] border-[#D8B867]/25'}`}>{plan.isPopular && <Star size={10} />}{plan.badge}</span></div>}
              <div className="space-y-3 flex-1"><div><h3 className="text-base font-bold text-[#26372A] min-h-[2.5rem]">{plan.title}</h3><div className="flex items-baseline gap-1 mt-1"><strong className="text-2xl font-bold text-[#073B2B]">{plan.priceFormatted}</strong><span className="text-xs text-[#6A725F]">{plan.periodText}</span></div></div><p className="text-xs text-[#8A6727] font-medium leading-snug">{plan.highlightBenefit}</p><p className="text-[11px] text-[#5F6857] leading-relaxed">{plan.description}</p><div className="pt-2 border-t border-[#D8B867]/18 space-y-1.5"><span className="text-[10px] text-[#6A725F] uppercase tracking-wider block font-bold">O que está incluído</span>{plan.features.map(feature => <div key={feature} className="flex items-start gap-1.5 text-xs text-[#5F6857]"><Check size={13} className="text-[#2F6B50] shrink-0 mt-0.5" /><span className="leading-tight text-[11px]">{feature}</span></div>)}</div></div>
              <div className="pt-4 mt-4 border-t border-[#D8B867]/18"><button type="button" onClick={() => plan.category === 'tratamento_individual' ? handleSpecificTreatment() : handleTriggerPlan(plan.id)} className="w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md bg-[#073B2B] text-[#FFF9E8]"><span>{plan.ctaText}</span><ArrowRight size={13} /></button></div>
            </article>)}
          </div>

          <div className="p-4 rounded-2xl bg-white/70 border border-[#D8B867]/20 text-center space-y-2"><p className="text-xs text-[#5F6857]">No acesso avulso/individual, a Anamnese Completa custa R$ 15,00. No mensal, custa R$ 10,00 com R$ 5,00 de desconto. A partir do trimestral, já vem incluída.</p><a href="https://wa.me/5551982215296?text=Ol%C3%A1%20%C3%89verton%2C%20gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20os%20planos." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#073B2B]"><MessageCircle size={14} /> Fale conosco</a></div>
        </div>
      </motion.div>
    </div>
  );
}

export default PlansValuesGuideModal;