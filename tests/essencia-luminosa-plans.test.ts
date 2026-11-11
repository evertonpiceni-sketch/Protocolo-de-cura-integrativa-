import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { PAYMENT_PLANS, paymentQuote } from '../src/lib/paymentCatalog';

test('os acessos avulsos seguem os valores aprovados sem alterar os acompanhamentos individuais', () => {
  assert.equal(PAYMENT_PLANS.jornada_7d.cents, 5990);
  assert.equal(PAYMENT_PLANS.jornada_21d.cents, 9990);
  assert.equal(paymentQuote('jornada_7d').cents, 5990);
  assert.equal(paymentQuote('jornada_21d').cents, 9990);
  const catalog = fs.readFileSync('src/lib/paymentCatalog.ts', 'utf8');
  assert.ok(catalog.includes('7: 5990'));
  assert.ok(catalog.includes('21: 9990'));
});

test('os dois acessos avulsos aparecem no guia e no checkout', () => {
  const guide = fs.readFileSync('src/components/PlansValuesGuideModal.tsx', 'utf8');
  const checkout = fs.readFileSync('src/components/ProUpgradeModal.tsx', 'utf8');
  assert.ok(guide.includes("priceFormatted: 'R$ 59,90'"));
  assert.ok(guide.includes("priceFormatted: 'R$ 99,90'"));
  assert.ok(guide.includes("id: 'jornada_21d'"));
  assert.ok(checkout.includes("id: 'jornada_21d'"));
  assert.ok(checkout.includes('PAYMENT_PLANS.jornada_21d.cents / 100'));
  assert.ok(checkout.includes("plan.id === 'jornada_7d' || plan.id === 'jornada_21d'"));
});

test('a seleção feita no guia chega ao checkout sem ser substituída pelo plano trimestral', () => {
  const guide = fs.readFileSync('src/components/PlansValuesGuideModal.tsx', 'utf8');
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  const checkout = fs.readFileSync('src/components/ProUpgradeModal.tsx', 'utf8');
  assert.ok(guide.includes('onOpenProModal(planId)'));
  assert.ok(guide.includes('handleTriggerPlan(plan.id)'));
  assert.ok(app.includes('setProModalInitialPlanId(planId as SubscriptionPlanType | undefined)'));
  assert.ok(app.includes('initialPlanId={proModalInitialPlanId}'));
  assert.ok(checkout.includes('initialPlanId?: SubscriptionPlanType'));
  assert.ok(checkout.includes('if (isOpen && initialPlanId) setSelectedId(initialPlanId)'));
});

test('o Estilo 3 aplica tokens próprios ao guia de planos sem alterar os demais estilos', () => {
  const guide = fs.readFileSync('src/components/PlansValuesGuideModal.tsx', 'utf8');
  const css = fs.readFileSync('src/essencia-luminosa-final-audit.css', 'utf8');
  assert.ok(guide.includes('data-plan-card={plan.id}'));
  assert.ok(guide.includes('data-plan-cta="true"'));
  assert.ok(guide.includes('aria-pressed={filterCategory === value}'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #plans-values-guide-modal'));
  assert.ok(css.includes('[data-plan-cta]'));
  assert.ok(css.includes('var(--layout-gold-gradient)'));
});

test('jornada de 21 dias é reconhecida no tipo, no admin e no resumo do perfil', () => {
  const types = fs.readFileSync('src/types.ts', 'utf8');
  const server = fs.readFileSync('server.ts', 'utf8');
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  assert.ok(types.includes("'jornada_21d'"));
  assert.ok(server.includes('"jornada_21d"'));
  assert.ok(app.includes("jornada_21d: '21 DIAS'"));
  assert.ok(app.includes("jornada_21d: 'por 21 dias'"));
});


test('Semestral e Anual exigem escolha explícita e o servidor registra somente o benefício selecionado', () => {
  const checkout = fs.readFileSync('src/components/ProUpgradeModal.tsx', 'utf8');
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  const routes = fs.readFileSync('src/lib/paymentRoutes.ts', 'utf8');
  const server = fs.readFileSync('server.ts', 'utf8');
  const css = fs.readFileSync('src/essencia-luminosa-final-audit.css', 'utf8');
  assert.ok(checkout.includes('requiresBenefitChoice && !benefitChoice'));
  assert.ok(checkout.includes('if (isOpen) {\n      setBenefitChoice(null);'));
  assert.ok(checkout.includes('data-benefit-choice="astral_map"'));
  assert.ok(checkout.includes('data-benefit-choice="numerology"'));
  assert.ok(app.includes('benefitChoice'));
  assert.ok(routes.includes("planId === 'semestral' || planId === 'anual'"));
  assert.ok(routes.includes('astralMapPurchased: true'));
  assert.ok(routes.includes('numerologyPurchased: true'));
  assert.ok(server.includes('subscriptionBenefitChoice: currentProfile.subscriptionBenefitChoice'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #plans-modal [data-benefit-choice]'));
  assert.ok(css.includes('[data-benefit-choice][aria-pressed="true"]'));
});

test('todos os preços de assinatura exibidos no checkout derivam do catálogo server-side', () => {
  const checkout = fs.readFileSync('src/components/ProUpgradeModal.tsx', 'utf8');
  for (const id of ['mensal', 'trimestral', 'semestral', 'anual']) {
    assert.ok(checkout.includes(`PAYMENT_PLANS.${id}.cents / 100`));
  }
  assert.equal(paymentQuote('mensal').cents, 3990);
  assert.equal(paymentQuote('trimestral').cents, 6990);
  assert.equal(paymentQuote('semestral').cents, 9990);
  assert.equal(paymentQuote('anual').cents, 15990);
});
