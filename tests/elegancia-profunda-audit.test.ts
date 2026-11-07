import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('o seletor usa a prancha oficial do Estilo 2 e exige confirmação explícita', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const app = read('src/App.tsx');
  assert.ok(modal.includes('/brand/elegancia-profunda/prancha-oficial.svg'));
  assert.ok(modal.includes('A prévia do Estilo 2 usa a prancha oficial'));
  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(app.includes('const [layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false)'));
  assert.ok(app.includes('{(!layoutConfirmedThisSession || layoutChoiceRequested) && ('));
});

test('a entrada ativa usa OnboardingFlow e recebe tratamento visual isolado do Estilo 2', () => {
  const app = read('src/App.tsx');
  const onboarding = read('src/components/OnboardingFlow.tsx');
  const css = read('src/elegancia-profunda-approved-overrides.css');
  assert.ok(app.includes("import('./components/OnboardingFlow')"));
  assert.ok(app.includes('<OnboardingFlow'));
  assert.ok(onboarding.includes('ep-care-onboarding'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] .ep-care-onboarding'));
  assert.ok(css.includes('--ep-scene:none'));
  assert.ok(!css.includes('var(--ep-scene)'));
});

test('o logo permanece assinatura transparente sem opacidade dupla', () => {
  const css = read('src/elegancia-profunda-approved-overrides.css');
  assert.match(css, /\.ep-brand-signature-wrap \{\s*opacity:1!important;\s*background:transparent!important;/);
  assert.match(css, /\.ep-brand-signature\s*,[\s\S]*?opacity:\.30\s*!important/);
  assert.match(css, /#main-header div:has\(> \.ep-brand-signature\)[^\n]*background:transparent!important/);
});

test('os presets Solfeggio continuam usando o oscilador exato e não dependem de mapas MP3 legados', () => {
  const app = read('src/App.tsx');
  const integrity = read('src/lib/audioIntegrityPatch.ts');
  const tone = read('src/lib/solfeggioTone.ts');
  assert.ok(!app.includes('BG_TRACKS'));
  assert.ok(integrity.includes('solfeggioTone.start(Number(match[1])'));
  assert.ok(tone.includes('oscillator.frequency.setValueAtTime(frequency'));
});

test('o pagamento continua no checkout InfinitePay sem cópia manual de PIX', () => {
  const routes = read('src/lib/paymentRoutes.ts');
  const specific = read('src/components/SpecificTreatmentModal.tsx');
  const numerology = read('src/components/NumerologyModal.tsx');
  assert.ok(routes.includes('https://api.infinitepay.io/invoices/public/checkout'));
  assert.ok(routes.includes("router.post('/payment/create-checkout'"));
  assert.ok(routes.includes("provider('/payment_check'"));
  assert.ok(!specific.includes('handleCopyPix'));
  assert.ok(!specific.includes('navigator.clipboard.writeText'));
  assert.ok(!numerology.includes('handleCopyPix'));
  assert.ok(!numerology.includes('navigator.clipboard.writeText'));
});

test('o player respeita o contexto de dia do Estilo 2 sem herdar a cena da Reintegração', () => {
  const session = read('src/components/MeditationSession.tsx');
  const css = read('src/elegancia-profunda-approved-overrides.css');
  assert.ok(session.includes("['natural-sereno', 'elegancia-profunda'].includes(document.documentElement.dataset.layout || '') ? dayNumber : undefined"));
  assert.ok(css.includes('--ep-scene:none'));
  assert.ok(!css.includes('var(--ep-scene)'));
  assert.ok(css.includes('#meditation-session .ep-session-backdrop > div:last-child'));
});

test('nenhum tema é aplicado e a home fica oculta antes da confirmação explícita', () => {
  const theme = read('src/approved-theme.css');
  const app = read('src/App.tsx');
  assert.ok(theme.includes('Base neutra de entrada'));
  assert.ok(theme.includes(':root:not([data-layout]) #cura-main-layout'));
  assert.ok(theme.includes(':root[data-layout="natural-sereno"]'));
  assert.ok(app.includes('delete document.documentElement.dataset.layout;'));
  assert.ok(app.includes('const [layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false)'));
});

test('a home do Estilo 2 usa superfícies profundas e não reaproveita a ilustração corporal legada', () => {
  const css = read('src/elegancia-profunda-approved-overrides.css');
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] .ep-home'));
  assert.ok(css.includes('linear-gradient(135deg,#E7CFA0 0%,#D4AF77 48%,#A77B43 100%)'));
  assert.ok(css.includes('img[src="/brand/chakra-body.svg"]'));
  assert.ok(css.includes('ep-arcanjo-view'));
});

test('a voz do Estilo 2 permanece Marianne/ElevenLabs e não cai silenciosamente no Web Speech', () => {
  const patch = read('src/lib/eleganciaProfundaOfficialVoicePatch.ts');
  const audio = read('src/lib/audio.ts');
  const session = read('src/components/MeditationSession.tsx');
  const home = read('src/components/TransformationHome.tsx');
  const settings = read('src/components/AudioSettingsModal.tsx');
  const anamnesis = read('src/components/AnamnesisModal.tsx');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  assert.ok(patch.includes('OFFICIAL_PROTOCOL_VOICE_ID'));
  assert.ok(patch.includes('preferElevenLabs: true'));
  assert.ok(patch.includes('allowNativeFallback: false'));
  assert.ok(audio.includes('allowNativeFallback?: boolean'));
  assert.ok(audio.includes('if (options?.allowNativeFallback === false)'));
  assert.ok(session.includes("activeLayout === 'elegancia-profunda'"));
  assert.ok(home.includes("props.visualLayout === 'elegancia-profunda'"));
  assert.ok(settings.includes('Marianne — Meditação'));
  assert.ok(settings.includes('voiceId: isEleganciaProfunda ? OFFICIAL_PROTOCOL_VOICE_ID : voiceId'));
  assert.ok(anamnesis.includes('isEleganciaProfunda ? OFFICIAL_PROTOCOL_VOICE_ID'));
  assert.ok(anamnesis.includes('A voz oficial Marianne'));
  assert.ok(arcanjo.includes('voiceId: narrationVoiceId'));
  assert.ok(arcanjo.includes('A voz oficial Marianne'));
});
