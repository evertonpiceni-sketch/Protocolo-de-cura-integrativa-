export const PAYMENT_PLANS = {
  jornada_7d: { cents: 5990, days: 7, title: 'Acesso — 7 dias' },
  jornada_21d: { cents: 9990, days: 21, title: 'Acesso — 21 dias' },
  mensal: { cents: 3990, days: 30, title: 'Plano Mensal' },
  trimestral: { cents: 6990, days: 90, title: 'Plano Trimestral' },
  semestral: { cents: 9990, days: 180, title: 'Plano Semestral' },
  anual: { cents: 15990, days: 365, title: 'Plano Anual' }
} as const;
export type Plan = keyof typeof PAYMENT_PLANS;

// Valor definido no servidor para a compra avulsa do mapa numerológico completo.
export const NUMEROLOGY_FULL_CENTS = 9000;
export const NUMEROLOGY_FULL_TITLE = 'Mapa Numerológico Completo';
export function paymentQuote(planId: string, coupon: string = '') {
  if (!Object.hasOwn(PAYMENT_PLANS, planId)) throw new Error('Plano inválido.');
  const code = coupon.trim().toUpperCase();
  if (code && !['PROMO15', 'PROMO20'].includes(code)) throw new Error('Cupom inválido para pagamento.');
  const plan = PAYMENT_PLANS[planId as Plan];
  return { ...plan, cents: Math.round(plan.cents * (code === 'PROMO15' ? .85 : code === 'PROMO20' ? .8 : 1)) };
}
