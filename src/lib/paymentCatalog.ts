export const NUMEROLOGY_FULL_PRICE_CENTS = 9000;

export const PAYMENT_PLANS = {
  jornada_7d: { cents: 5990, days: 7, title: 'Acesso — 7 dias' },
  jornada_21d: { cents: 9990, days: 21, title: 'Acesso — 21 dias' },
  mensal: { cents: 3990, days: 30, title: 'Plano Mensal' },
  trimestral: { cents: 6990, days: 90, title: 'Plano Trimestral' },
  semestral: { cents: 9990, days: 180, title: 'Plano Semestral' },
  anual: { cents: 15990, days: 365, title: 'Plano Anual' }
} as const;
export type Plan = keyof typeof PAYMENT_PLANS;
export function paymentQuote(planId: string, coupon: string = '') {
  if (!Object.hasOwn(PAYMENT_PLANS, planId)) throw new Error('Plano inválido.');
  const code = coupon.trim().toUpperCase();
  if (code && !['PROMO15', 'PROMO20'].includes(code)) throw new Error('Cupom inválido para pagamento.');
  const plan = PAYMENT_PLANS[planId as Plan];
  return { ...plan, cents: Math.round(plan.cents * (code === 'PROMO15' ? .85 : code === 'PROMO20' ? .8 : 1)) };
}


/** Only the currently approved promotional coupons apply to individual treatments. */
export const SPECIFIC_TREATMENT_COUPONS = Object.freeze({ PROMO15: 15, PROMO20: 20 } as const);

export function specificTreatmentCouponDiscount(coupon: string = ''): number | null {
  const code = coupon.trim().toUpperCase();
  if (!code) return 0;
  if (Object.hasOwn(SPECIFIC_TREATMENT_COUPONS, code)) {
    return SPECIFIC_TREATMENT_COUPONS[code as keyof typeof SPECIFIC_TREATMENT_COUPONS];
  }
  return null;
}


/** Fixed prices approved for individual treatments; values are stored in cents. */
export const SPECIFIC_TREATMENT_PRICES = Object.freeze({
  7: 5990,
  21: 9990
} as const);

export function specificTreatmentQuote(durationDays: number, coupon: string = '') {
  if (!Object.hasOwn(SPECIFIC_TREATMENT_PRICES, durationDays)) {
    throw new Error('Duração inválida para prática individual.');
  }
  const discount = specificTreatmentCouponDiscount(coupon);
  if (coupon.trim() && discount === null) {
    throw new Error('Cupom inválido para prática individual.');
  }
  const baseCents = SPECIFIC_TREATMENT_PRICES[durationDays as keyof typeof SPECIFIC_TREATMENT_PRICES];
  return {
    baseCents,
    cents: Math.round(baseCents * (1 - ((discount ?? 0) / 100)))
  };
}
