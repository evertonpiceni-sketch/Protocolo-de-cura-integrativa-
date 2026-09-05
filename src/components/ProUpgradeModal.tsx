/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { Check, ChevronDown, Crown, Sparkles, X, Tag, ShieldCheck } from 'lucide-react';
import { UserProfile, SubscriptionPlanType } from '../types';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpgradeSuccess: (plan: SubscriptionPlanType, paymentMethod: 'pix' | 'card', price: number) => void;
  onOpenContact?: () => void;
}

type PlanItem = {
  id: SubscriptionPlanType;
  title: string;
  price: number;
  period: string;
  badge?: string;
  highlight?: boolean;
  summary: string[];
  details: string[];
};

const PRO_COMMON = [
  'Anamnese energética a cada 7 dias',
  'Reiki e frequência Solfeggio personalizados após a anamnese',
  'Florais de Bach e Aromaterapia personalizados após a anamnese',
  'Diário antes e depois do tratamento + evolução do humor',
  'Acesso às Jornadas de 7 e 21 dias',
  'Protocolo de Cura Integrada de 21 Dias com suas práticas energéticas',
  'Conteúdos e recursos exclusivos PRO'
];

const PLANS: PlanItem[] = [
  {
    id: 'jornada_7d',
    title: 'Jornada 7 Dias',
    price: 15,
    period: 'acesso 7 dias',
    badge: 'Jornada avulsa',
    summary: ['7 chakras', 'Frequências Solfeggio', 'Diário da jornada'],
    details: [
      'Alinhamento dos 7 chakras, um por dia',
      'Frequências Solfeggio específicas',
      'Sons imersivos e diário de bordo',
      'Certificado de conclusão'
    ]
  },
  {
    id: 'arcanjo_7d',
    title: 'São Miguel, Rafael e Chama Violeta',
    price: 29.9,
    period: 'acesso 7 dias',
    badge: 'Protocolo avulso',
    summary: ['7 Chakras Divinos', 'Proteção', 'Transmutação'],
    details: [
      'Alinhamento de 1 chakra por dia',
      'Raio de Ouro de São Rafael',
      'Chama Violeta para transmutação',
      'Proteção de São Miguel Arcanjo'
    ]
  },
  {
    id: 'mensal',
    title: 'PRO Mensal',
    price: 39.9,
    period: '/ mês',
    summary: ['PRO completo', 'Anamnese a cada 7 dias', 'Diário de evolução'],
    details: [...PRO_COMMON]
  },
  {
    id: 'trimestral',
    title: 'PRO Trimestral',
    price: 69.9,
    period: '/ 3 meses',
    badge: 'Tratamento 7d incluso',
    summary: ['PRO completo', '1 tratamento específico de 7 dias', 'Jornadas exclusivas'],
    details: [...PRO_COMMON, '1 tratamento específico de 7 dias incluso', 'Atendimento prioritário']
  },
  {
    id: 'semestral',
    title: 'PRO Semestral',
    price: 99.9,
    period: '/ 6 meses',
    badge: 'Benefício especial',
    summary: ['PRO completo', '1 áudio personalizado de 7 dias', 'Mapa OU Numerologia completa'],
    details: [...PRO_COMMON, '1 áudio personalizado de 7 dias', 'Escolha 1: Mapa Astral Completo OU Numerologia Completa']
  },
  {
    id: 'anual',
    title: 'PRO Anual',
    price: 149.9,
    period: '/ ano',
    badge: 'Melhor economia',
    summary: ['PRO por 12 meses', 'Mapa OU Numerologia completa', 'Histórico preservado'],
    details: [...PRO_COMMON, 'Escolha 1: Mapa Astral Completo OU Numerologia Completa', 'Acesso PRO por 12 meses']
  },
  {
    id: 'anual_master' as SubscriptionPlanType,
    title: 'PRO Anual Master',
    price: 197,
    period: '/ ano',
    badge: 'Mais completo',
    highlight: true,
    summary: ['Mapa Astral Completo', 'Numerologia Completa', '1 curso elegível gratuito'],
    details: [...PRO_COMMON, 'Mapa Astral Completo', 'Numerologia Completa', '1 curso elegível gratuito', 'Acesso PRO por 12 meses']
  }
];

const COUPONS: Record<string, { discount: number; vip?: boolean }> = {
  PROMO15: { discount: 15 },
  PROMO20: { discount: 20 },
  VIP7: { discount: 100, vip: true }
};

const money = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

export default function ProUpgradeModal({ isOpen, onClose, onUpgradeSuccess }: ProUpgradeModalProps) {
  const [selectedId, setSelectedId] = useState<SubscriptionPlanType>('trimestral');
  const [expandedId, setExpandedId] = useState<SubscriptionPlanType | null>(null);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');

  const selectedPlan = PLANS.find(plan => plan.id === selectedId) || PLANS[2];
  const couponRule = appliedCoupon ? COUPONS[appliedCoupon] : undefined;
  const finalPrice = useMemo(() => {
    if (!couponRule || couponRule.vip) return couponRule?.vip ? 0 : selectedPlan.price;
    return Math.max(0, selectedPlan.price * (1 - couponRule.discount / 100));
  }, [selectedPlan, couponRule]);

  if (!isOpen) return null;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    const rule = COUPONS[code];
    if (!rule) {
      setAppliedCoupon(null);
      setCouponMessage('Cupom inválido, expirado ou não disponível.');
      return;
    }
    setAppliedCoupon(code);
    if (rule.vip) {
      setCouponMessage('VIP7: 7 dias PRO. Cupom de teste sujeito ao limite global de 20 resgates e uso único por conta.');
    } else {
      setCouponMessage(`${rule.discount}% de desconto aplicado.`);
    }
  };

  const choosePlan = (plan: PlanItem) => {
    setSelectedId(plan.id);
    document.getElementById('checkout-planos')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const finish = () => {
    if (couponRule?.vip) {
      onUpgradeSuccess('teste_vip_7d', paymentMethod, 0);
      return;
    }
    onUpgradeSuccess(selectedPlan.id, paymentMethod, finalPrice);
  };

  const proPlans = PLANS.filter(plan => !['jornada_7d', 'arcanjo_7d'].includes(plan.id));
  const standalone = PLANS.filter(plan => ['jornada_7d', 'arcanjo_7d'].includes(plan.id));

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl overflow-y-auto">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(88,28,135,0.20),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(202,138,4,0.10),transparent_28%)] text-slate-100">
        <header className="sticky top-0 z-20 border-b border-amber-400/10 bg-slate-950/85 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <p className="text-amber-300 tracking-[0.28em] text-[10px] font-bold uppercase">Everton Piceni</p>
              <h2 className="font-serif text-xl text-amber-100">Planos & Jornadas</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full border border-white/10 hover:bg-white/5" aria-label="Fechar"><X size={20} /></button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
          <section className="text-center max-w-2xl mx-auto">
            <Sparkles className="mx-auto text-amber-300 mb-3" size={26} />
            <h1 className="font-serif text-3xl md:text-5xl text-amber-100">Escolha o seu plano</h1>
            <p className="mt-3 text-sm md:text-base text-slate-400">Pouca informação na primeira leitura. Toque em “Ver tudo” somente quando quiser comparar os detalhes.</p>
          </section>

          <section>
            <div className="mb-4">
              <h3 className="font-serif text-2xl text-amber-100">Jornadas e protocolos avulsos</h3>
              <p className="text-sm text-slate-400">Experiências focadas, sem poluir a comparação dos planos PRO.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {standalone.map(plan => (
                <PlanCard key={plan.id} plan={plan} expanded={expandedId === plan.id} onToggle={() => setExpandedId(expandedId === plan.id ? null : plan.id)} onChoose={() => choosePlan(plan)} />
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-violet-400/20 bg-violet-500/[0.06] p-5 md:p-7">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-violet-500/10 border border-violet-400/20 p-3"><Sparkles className="text-violet-300" /></div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-violet-300 font-bold">Preservado no PRO</p>
                <h3 className="font-serif text-2xl text-white">Protocolo de Cura Integrada de 21 Dias</h3>
                <p className="mt-2 text-sm text-slate-300 max-w-3xl">O protocolo de 21 dias continua na plataforma com sua estrutura energética já existente. Ele faz parte das jornadas PRO e não foi substituído pelos novos módulos.</p>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2"><Crown className="text-amber-300" size={22} /><h3 className="font-serif text-2xl text-amber-100">Planos PRO</h3></div>
                <p className="text-sm text-slate-400 mt-1">Florais e Aromaterapia são exclusivos PRO e personalizados após a anamnese.</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {proPlans.map(plan => (
                <PlanCard key={plan.id} plan={plan} expanded={expandedId === plan.id} onToggle={() => setExpandedId(expandedId === plan.id ? null : plan.id)} onChoose={() => choosePlan(plan)} />
              ))}
            </div>
          </section>

          <section id="checkout-planos" className="max-w-2xl mx-auto rounded-3xl border border-amber-400/25 bg-slate-900/80 p-5 md:p-7 shadow-2xl shadow-amber-950/20">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div><p className="text-xs text-slate-400">Selecionado</p><h3 className="font-serif text-2xl text-amber-100">{selectedPlan.title}</h3></div>
              <div className="text-right"><strong className="text-2xl text-white">{money(finalPrice)}</strong><p className="text-xs text-slate-400">{couponRule?.vip ? '7 dias PRO' : selectedPlan.period}</p></div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 mb-4">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2 mb-2"><Tag size={14} /> Tem um cupom?</label>
              <div className="flex gap-2"><input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Digite o código" className="min-w-0 flex-1 rounded-xl bg-slate-950 border border-white/10 px-3 py-3 outline-none focus:border-amber-400/50" /><button onClick={applyCoupon} className="rounded-xl bg-amber-400 text-slate-950 font-bold px-4">Aplicar</button></div>
              {couponMessage && <p className={`text-xs mt-2 ${appliedCoupon ? 'text-emerald-300' : 'text-rose-300'}`}>{couponMessage}</p>}
              <p className="text-[11px] text-slate-500 mt-2">VIP7: campanha de teste com 20 resgates no total. PROMO15: 15%. PROMO20: 20%. Cupons não são cumulativos.</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={() => setPaymentMethod('pix')} className={`rounded-xl border p-3 text-sm font-bold ${paymentMethod === 'pix' ? 'border-amber-400 bg-amber-400/10 text-amber-200' : 'border-white/10 text-slate-400'}`}>PIX</button>
              <button onClick={() => setPaymentMethod('card')} className={`rounded-xl border p-3 text-sm font-bold ${paymentMethod === 'card' ? 'border-amber-400 bg-amber-400/10 text-amber-200' : 'border-white/10 text-slate-400'}`}>Cartão</button>
            </div>

            <button onClick={finish} className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 font-black py-4 shadow-lg shadow-amber-500/10">{couponRule?.vip ? 'ATIVAR 7 DIAS PRO' : 'CONTINUAR'}</button>
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500"><ShieldCheck size={13} /> A confirmação definitiva do pagamento e dos cupons deve ser validada pelo servidor.</div>
          </section>
        </main>
      </div>
    </div>
  );
}

function PlanCard({ plan, expanded, onToggle, onChoose }: { plan: PlanItem; expanded: boolean; onToggle: () => void; onChoose: () => void }) {
  return (
    <article className={`relative rounded-3xl border p-5 flex flex-col ${plan.highlight ? 'border-amber-300/70 bg-gradient-to-b from-amber-400/[0.12] to-slate-950 shadow-xl shadow-amber-900/20' : 'border-white/10 bg-slate-900/65'}`}>
      {plan.badge && <span className={`self-start rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide mb-3 ${plan.highlight ? 'bg-amber-300 text-slate-950' : 'bg-white/5 text-slate-300 border border-white/10'}`}>{plan.badge}</span>}
      <h4 className="font-serif text-xl text-white">{plan.title}</h4>
      <div className="mt-2"><strong className="text-2xl text-amber-100">{money(plan.price)}</strong><span className="text-xs text-slate-500 ml-1">{plan.period}</span></div>
      <ul className="mt-4 space-y-2 flex-1">{plan.summary.map(item => <li key={item} className="flex gap-2 text-xs text-slate-300"><Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />{item}</li>)}</ul>
      {expanded && <div className="mt-4 pt-4 border-t border-white/10 space-y-2">{plan.details.map(item => <div key={item} className="flex gap-2 text-[11px] text-slate-400"><Check size={12} className="text-amber-300 shrink-0 mt-0.5" />{item}</div>)}</div>}
      <button onClick={onToggle} className="mt-4 text-xs text-slate-400 underline underline-offset-4 flex items-center gap-1">{expanded ? 'Ocultar detalhes' : 'Ver tudo que está incluso'} <ChevronDown size={13} className={expanded ? 'rotate-180' : ''} /></button>
      <button onClick={onChoose} className={`mt-4 rounded-xl py-3 text-sm font-black ${plan.highlight ? 'bg-amber-300 text-slate-950' : 'border border-amber-300/50 text-amber-200 hover:bg-amber-300/10'}`}>Escolher plano</button>
    </article>
  );
}
