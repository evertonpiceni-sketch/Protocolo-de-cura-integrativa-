/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useRef, useState } from 'react';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { Check, ChevronDown, Crown, Sparkles, X, Tag, ShieldCheck } from 'lucide-react';
import { UserProfile, SubscriptionPlanType } from '../types';

type PaymentPlanId = SubscriptionPlanType | 'jornada_21d';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpgradeSuccess: (plan: SubscriptionPlanType, paymentMethod: 'pix' | 'card', price: number) => boolean | void | Promise<boolean | void>;
  onOpenContact?: () => void;
  onRequireLogin?: () => void;
}

type PlanItem = { id: PaymentPlanId; title: string; price: number; period: string; badge?: string; highlight?: boolean; summary: string[]; details: string[]; };

const PRO_COMMON = ['Anamnese Compacta com resultado imediato e orientação do próximo passo','Indicação do protocolo mais adequado ao seu momento, sem limitar sua liberdade de escolha','Acesso às jornadas disponíveis de 7 e 21 dias','Diário privado para registrar o dia no seu próprio ritmo','Leituras de acompanhamento nos marcos da jornada','Recursos de apoio incluídos no plano'];
const PLANS: PlanItem[] = [
  { id: 'jornada_7d', title: 'Acesso avulso — 7 dias', price: 59.9, period: 'acesso 7 dias', badge: 'Opção avulsa', summary: ['Anamnese Compacta incluída','7 dias de acesso','Anamnese Completa opcional por R$ 15'], details: ['Anamnese Compacta com resultado mostrado imediatamente','Orientação para identificar o protocolo mais adequado ao momento','Escolha livre entre os protocolos disponíveis para 7 dias','O ciclo de 7 dias preserva início, desenvolvimento, integração e fechamento','Anamnese Completa disponível por R$ 15,00 após o resultado compacto'] },
  { id: 'jornada_21d', title: 'Acesso avulso — 21 dias', price: 99.9, period: 'acesso 21 dias', badge: 'Opção avulsa', summary: ['Anamnese Compacta incluída','21 dias de acesso','Anamnese Completa opcional por R$ 15'], details: ['Anamnese Compacta com resultado mostrado imediatamente','Orientação para identificar o protocolo mais adequado ao momento','Escolha livre entre os protocolos disponíveis para 21 dias','O ciclo de 21 dias preserva desenvolvimento, integração e fechamento','Anamnese Completa disponível por R$ 15,00 após o resultado compacto'] },
  { id: 'mensal', title: 'Plano Mensal', price: 39.9, period: '/ mês', badge: 'R$ 5 de desconto na análise completa', summary: ['Anamnese Compacta incluída','Anamnese Completa por R$ 10','Acesso por 30 dias'], details: [...PRO_COMMON,'Quer ter a análise completa? No mensal, a Anamnese Completa sai de R$ 15,00 por R$ 10,00','Benefício exclusivo do mensal: R$ 5,00 de desconto no aprofundamento da análise'] },
  { id: 'trimestral', title: 'Plano Trimestral', price: 69.9, period: '/ 3 meses', badge: 'Anamnese Completa incluída', highlight: true, summary: ['Anamnese Completa incluída','3 meses de acesso','Mais indicado para continuidade'], details: [...PRO_COMMON,'Anamnese Completa incluída sem cobrança adicional','Aprofundamento do resultado disponível como benefício do plano trimestral','Atendimento prioritário'] },
  { id: 'semestral', title: 'Plano Semestral', price: 99.9, period: '/ 6 meses', badge: 'Anamnese Completa incluída', summary: ['Anamnese Completa incluída','6 meses de acesso','Acompanhamento prolongado'], details: [...PRO_COMMON,'Anamnese Completa incluída sem cobrança adicional','1 áudio personalizado de 7 dias','Escolha 1: Mapa Astral Completo OU Numerologia Completa'] },
  { id: 'anual', title: 'Plano Anual', price: 159.9, period: '/ ano', badge: 'Anamnese Completa incluída', summary: ['Anamnese Completa incluída','12 meses de acesso','Histórico preservado'], details: [...PRO_COMMON,'Anamnese Completa incluída sem cobrança adicional','Escolha 1: Mapa Astral Completo OU Numerologia Completa','Acesso por 12 meses'] }
];
const COUPONS: Record<string, { discount: number; vip?: boolean }> = {
  PROMO15: { discount: 15 },
  PROMO20: { discount: 20 },
  VIP7: { discount: 100, vip: true }
};
const money = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

export default function ProUpgradeModal({ isOpen, onClose, onUpgradeSuccess, onRequireLogin }: ProUpgradeModalProps) {
  const [selectedId, setSelectedId] = useState<PaymentPlanId>(() => { try { const pending = JSON.parse(sessionStorage.getItem('cura_pending_checkout_v1') || '{}'); return PLANS.some(p => p.id === pending.planId) ? pending.planId : 'trimestral'; } catch { return 'trimestral'; } });
  const [expandedId, setExpandedId] = useState<PaymentPlanId | null>(null);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => { try { const code = JSON.parse(sessionStorage.getItem('cura_pending_checkout_v1') || '{}').couponCode; return Object.hasOwn(COUPONS, code) ? code : null; } catch { return null; } });
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const selectedPlan = PLANS.find(plan => plan.id === selectedId) || PLANS.find(plan => plan.id === 'trimestral') || PLANS[0];
  const couponRule = appliedCoupon ? COUPONS[appliedCoupon] : undefined;
  const finalPrice = useMemo(() => {
    if (!couponRule) return selectedPlan.price;
    if (couponRule.vip) return 0;
    return Math.round(selectedPlan.price * (1 - couponRule.discount / 100) * 100) / 100;
  }, [selectedPlan, couponRule]);
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(isOpen, dialogRef, onClose);
  if (!isOpen) return null;

  const applyCoupon = () => { const code = coupon.trim().toUpperCase(); const rule = COUPONS[code]; if (!rule) { setAppliedCoupon(null); setCouponMessage('Cupom inválido, expirado ou não disponível.'); return; } setAppliedCoupon(code); setCouponMessage(rule.vip ? 'Cupom de acesso temporário aplicado.' : `Cupom de ${rule.discount}% aplicado.`); };
  const choosePlan = (plan: PlanItem) => { setSelectedId(plan.id); setCheckoutError(null); setNeedsLogin(false); document.getElementById('checkout-planos')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
  const openLogin = () => {
    sessionStorage.setItem('cura_pending_checkout_v1', JSON.stringify({ planId: selectedPlan.id, price: finalPrice, couponCode: appliedCoupon || undefined }));
    localStorage.removeItem('cura_integrada_logged_in_user_v1');
    onClose();
    onRequireLogin?.();
  };
  const finish = async () => {
    if (isProcessing) return;
    setCheckoutError(null); setNeedsLogin(false); setIsProcessing(true);
    try {
      const session = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' });
      if (!session.ok) {
        setNeedsLogin(true);
        setCheckoutError('Entre na sua conta para vincular a compra com segurança. Depois do login, você volta ao pagamento.');
        return;
      }
      if (couponRule?.vip) {
        await onUpgradeSuccess('teste_vip_7d', 'pix', 0);
      } else {
        const res = await fetch('/api/payment/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            productType: 'subscription',
            planId: selectedPlan.id,
            couponCode: appliedCoupon || undefined
          })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Não foi possível iniciar o pagamento.');
        if (!data.checkoutUrl) throw new Error('A InfinitePay não retornou o link de pagamento.');
        sessionStorage.removeItem('cura_pending_checkout_v1');
        window.location.assign(data.checkoutUrl);
      }
    } catch (e) {
      console.error(e);
      const message = e instanceof Error ? e.message : 'Não foi possível iniciar o pagamento.';
      const authRequired = /entre na sua conta|login|sess[aã]o|não autorizado/i.test(message);
      setNeedsLogin(authRequired);
      setCheckoutError(authRequired ? 'Sua sessão expirou. Entre novamente para continuar o pagamento.' : message);
    } finally { setIsProcessing(false); }
  };
  const standaloneIds = new Set<PaymentPlanId>(['jornada_7d', 'jornada_21d']);
  const plans = PLANS.filter(plan => !standaloneIds.has(plan.id));
  const standalone = PLANS.filter(plan => standaloneIds.has(plan.id));

  return <div ref={dialogRef} id="plans-modal" role="dialog" aria-modal="true" aria-labelledby="plans-title" className="fixed inset-0 z-[100] bg-[#1F2E27]/35 backdrop-blur-xl overflow-y-auto"><div className="min-h-screen bg-[linear-gradient(180deg,#FFF9E8_0%,#F8F0DF_100%)] text-[#26372A]">
    <header className="sticky top-0 z-20 border-b border-[#D8B867]/20 bg-[#FFF9E8]/90 backdrop-blur-xl"><div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between"><div><p className="text-[#9C7429] tracking-[0.24em] text-[10px] font-bold uppercase">Sua jornada</p><h2 id="plans-title" className="font-serif text-xl text-[#26372A]">Planos & Acessos</h2></div><button onClick={onClose} className="p-2 rounded-full border border-[#D8B867]/25 bg-white/60" aria-label="Fechar"><X size={20} /></button></div></header>
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center max-w-2xl mx-auto"><Sparkles className="mx-auto text-[#B88736] mb-3" size={24} /><h1 className="font-serif text-3xl md:text-5xl text-[#26372A]">Escolha o formato que combina com o seu momento</h1><p className="mt-3 text-sm md:text-base text-[#5F6857]">Aqui você escolhe sua forma de acesso. A Anamnese Compacta orienta o próximo passo e, depois do resultado, a escolha do protocolo continua sendo sua.</p></section>
      <section><div className="mb-4"><h3 className="font-serif text-2xl text-[#26372A]">Acesso avulso</h3><p className="text-sm text-[#5F6857]">Acesso por período definido, com Anamnese Compacta incluída. O protocolo é escolhido depois da orientação.</p></div><div className="grid md:grid-cols-2 gap-4 items-stretch">{standalone.map(plan => <PlanCard key={plan.id} plan={plan} expanded={expandedId === plan.id} onToggle={() => setExpandedId(expandedId === plan.id ? null : plan.id)} onChoose={() => choosePlan(plan)} />)}</div></section>
      <section><div className="mb-4 flex items-end justify-between gap-4"><div><div className="flex items-center gap-2"><Crown className="text-[#B88736]" size={22} /><h3 className="font-serif text-2xl text-[#26372A]">Planos</h3></div><p className="text-sm text-[#5F6857] mt-1">No mensal, a Anamnese Completa tem R$ 5 de desconto. A partir do trimestral, ela já está incluída.</p></div></div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">{plans.map(plan => <PlanCard key={plan.id} plan={plan} expanded={expandedId === plan.id} onToggle={() => setExpandedId(expandedId === plan.id ? null : plan.id)} onChoose={() => choosePlan(plan)} />)}</div></section>
      <section id="checkout-planos" className="w-full max-w-3xl mx-auto rounded-3xl border border-[#D8B867]/30 bg-white/80 p-5 sm:p-6 md:p-7 shadow-xl shadow-[#6A5425]/10"><div className="flex items-center justify-between gap-4 mb-5"><div><p className="text-xs text-[#6A725F]">Selecionado</p><h3 className="font-serif text-2xl text-[#26372A]">{selectedPlan.title}</h3></div><div className="text-right"><strong className="text-2xl text-[#073B2B]">{money(finalPrice)}</strong><p className="text-xs text-[#6A725F]">{couponRule?.vip ? '7 dias' : selectedPlan.period}</p></div></div>
        <div className="rounded-2xl border border-[#D8B867]/20 bg-[#FFF9E8] p-4 mb-4"><label className="text-xs font-bold text-[#5F6857] flex items-center gap-2 mb-2"><Tag size={14} /> Tem um cupom?</label><div className="flex gap-2"><input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Digite o código" className="min-w-0 flex-1 rounded-xl bg-white border border-[#D8B867]/25 px-3 py-3 outline-none focus:border-[#B88736]" /><button onClick={applyCoupon} className="rounded-xl bg-[#073B2B] text-[#FFF9E8] font-bold px-4">Aplicar</button></div>{couponMessage && <p className={`text-xs mt-2 ${appliedCoupon ? 'text-[#2F6B50]' : 'text-rose-700'}`}>{couponMessage}</p>}</div>
        <p className="mb-4 text-center text-[11px] text-[#6A725F]">Pagamento processado pela InfinitePay. PIX, cartão e parcelamento são escolhidos com segurança no checkout da InfinitePay.</p>
        {checkoutError && <div role="alert" className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-xs text-rose-700"><p>{checkoutError}</p>{needsLogin && <button type="button" onClick={openLogin} className="mt-3 w-full rounded-xl bg-[#073B2B] px-4 py-3 font-bold text-[#FFF9E8]">ENTRAR PARA CONTINUAR</button>}</div>}
        {!needsLogin && <button disabled={isProcessing} onClick={finish} className={`w-full rounded-2xl bg-[#073B2B] text-[#FFF9E8] font-black py-4 shadow-lg shadow-[#073B2B]/10 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}>{isProcessing ? 'VERIFICANDO...' : (couponRule?.vip ? 'ATIVAR ACESSO' : 'CONTINUAR PARA PAGAMENTO')}</button>}
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[#6A725F]"><ShieldCheck size={13} /> Seu acesso é liberado somente após a confirmação do pagamento.</div>
      </section>
    </main></div></div>;
}

function PlanCard({ plan, expanded, onToggle, onChoose }: { key?: string | number; plan: PlanItem; expanded: boolean; onToggle: () => void; onChoose: () => void }) {
  return <article className={`relative rounded-3xl border p-5 flex h-full flex-col ${plan.highlight ? 'border-[#B88736]/55 bg-gradient-to-b from-[#FFF6D9] to-[#FFF9E8] shadow-xl shadow-[#6A5425]/10' : 'border-[#D8B867]/22 bg-white/78 shadow-sm'}`}>{plan.badge && <span className={`self-start rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide mb-3 ${plan.highlight ? 'bg-[#073B2B] text-[#FFF9E8]' : 'bg-[#F7E5AA]/45 text-[#7C5A1D] border border-[#D8B867]/25'}`}>{plan.badge}</span>}<h4 className="font-serif text-xl text-[#26372A] min-h-[3rem]">{plan.title}</h4><div className="mt-2"><strong className="text-2xl text-[#073B2B]">{money(plan.price)}</strong><span className="text-xs text-[#6A725F] ml-1">{plan.period}</span></div><ul className="mt-4 space-y-2 flex-1">{plan.summary.map(item => <li key={item} className="flex gap-2 text-xs text-[#5F6857]"><Check size={14} className="text-[#2F6B50] shrink-0 mt-0.5" />{item}</li>)}</ul>{expanded && <div className="mt-4 pt-4 border-t border-[#D8B867]/18 space-y-2">{plan.details.map(item => <div key={item} className="flex gap-2 text-[11px] text-[#5F6857]"><Check size={12} className="text-[#B88736] shrink-0 mt-0.5" />{item}</div>)}</div>}<button onClick={onToggle} className="mt-4 text-xs text-[#6A725F] underline underline-offset-4 flex items-center gap-1">{expanded ? 'Ocultar detalhes' : 'Ver tudo que está incluso'} <ChevronDown size={13} className={expanded ? 'rotate-180' : ''} /></button><button onClick={onChoose} className={`mt-4 rounded-xl py-3 text-sm font-black ${plan.highlight ? 'bg-[#073B2B] text-[#FFF9E8]' : 'border border-[#073B2B]/30 text-[#073B2B] hover:bg-[#073B2B]/5'}`}>Escolher</button></article>;
}
