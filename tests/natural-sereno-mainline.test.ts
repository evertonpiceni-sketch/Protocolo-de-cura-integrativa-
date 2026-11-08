import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('seletor dos quatro estilos exige escolha explícita e usa a prancha Natural Sereno', () => {
  const app = read('src/App.tsx');
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const layouts = read('src/config/layouts.ts');
  for (const id of ['natural-sereno', 'elegancia-profunda', 'essencia-luminosa', 'mistico-moderno']) {
    assert.ok(layouts.includes(id), `estilo oficial ausente: ${id}`);
  }
  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(modal.includes('../../docs/visual-qa/natural-sereno/reference.jpg'));
  assert.ok(modal.includes("isNaturalSereno ? 'rounded-[18px]' : 'rounded-full'"));
  assert.ok(modal.includes("selectedLayout === 'natural-sereno' ? 'rounded-[18px]' : 'rounded-full'"));
  assert.ok(modal.includes('confirmButtonTone'));
  assert.ok(app.includes('(!layoutConfirmedThisSession || layoutChoiceRequested)'));
  assert.ok(app.includes('document.documentElement.dataset.layout = selected.id'));
  assert.ok(fs.existsSync('docs/visual-qa/natural-sereno/reference.jpg'));
});

test('Natural Sereno não herda chapas verde-floresta ou amarelo saturado', () => {
  const model = read('src/lib/naturalSerenoHomeApprovedModel.ts');
  const css = read('src/natural-sereno-approved-overrides.css');
  const home = read('src/natural-sereno-home-surface-audit.css');
  for (const discarded of ['background: #073b2b', 'rgba(7,59,43', '#fff9e8', '#f7e5aa', '#ead394', '#052f22']) {
    assert.ok(!model.includes(discarded), `herança visual antiga ainda presente: ${discarded}`);
  }
  assert.ok(model.includes('#FAF7F2'));
  assert.ok(model.includes('#C89D52'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"]'));
  assert.ok(css.includes('#astral-map-modal'));
  assert.ok(css.includes('#daily-diary-modal'));
  assert.ok(css.includes('#anamnesis-modal'));
  assert.ok(css.includes('#6F7B55'));
  assert.ok(home.includes('.ns-home-content'));
  assert.ok(home.includes('.ep-home-continue'));
  assert.ok(home.includes('var(--ns-valley)'));
  assert.ok(home.includes('background-position:center 52%'));
  assert.ok(home.includes('background-position:center 54%'));
  assert.ok(!/\n\s*\.ns-app\s*\{/.test(css), 'não pode haver override global da aplicação');
});

test('logo, Diário, voz e player preservam as decisões aprovadas', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const app = read('src/App.tsx');
  const session = read('src/components/MeditationSession.tsx');
  const diary = read('src/components/DailyDiaryModal.tsx');
  assert.ok(css.includes('opacity:.30!important'));
  assert.ok(css.includes('opacity:.26!important'));
  assert.ok(app.includes('onSaveEntry={handleSaveDiaryDay}'));
  assert.ok(app.includes('voiceId={userProfile.voiceId}'));
  assert.ok(diary.includes('id="daily-diary-modal"'));
  assert.ok(session.includes('const NATURAL_SERENO_CANVAS_THEME = {'));
  assert.ok(session.includes('colorTheme={isNaturalSereno ? NATURAL_SERENO_CANVAS_THEME'));
  assert.ok(session.includes('shouldPlayProtocolSessionBackground(sessionPhase, bgMusicType)'));
});

test('pagamento mantém apenas produtos atuais e checkout InfinitePay fail-closed', () => {
  const routes = read('src/lib/paymentRoutes.ts');
  const catalog = read('src/lib/paymentCatalog.ts');
  assert.ok(routes.includes("https://api.checkout.infinitepay.io"));
  assert.ok(routes.includes("options: { single_payment: true }"));
  assert.ok(routes.includes("headers['X-Api-Key'] = key"));
  assert.ok(routes.includes("if (!apiKey()) return res.status(503)"));
  assert.ok(routes.includes('acquireCheckoutCreationLock(`standard:${req.userId}:${productType}`)'));
  assert.ok(routes.includes('checkoutRecoveryAttempts'));
  assert.ok(routes.includes('order.checkoutPayload?.handle || handle()'));
  assert.ok(routes.includes('paymentQuote(planId, couponCode || '')'));
  assert.ok(routes.includes('specificTreatmentQuote(durationDays, code)'));
  assert.ok(!routes.includes('numerology_full'));
  assert.ok(!routes.includes('numerologyPurchased'));
  assert.ok(catalog.includes('jornada_7d'));
  assert.ok(catalog.includes('jornada_21d'));
  assert.ok(catalog.includes('5990'));
  assert.ok(catalog.includes('9990'));
});
