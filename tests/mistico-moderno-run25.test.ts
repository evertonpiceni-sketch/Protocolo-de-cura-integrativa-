import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { shouldPlayProtocolSessionBackground } from '../src/lib/protocolSessionAudioPolicy';
import { PAYMENT_PLANS, paymentQuote } from '../src/lib/paymentCatalog';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Místico Moderno usa a prancha oficial no cartão e exige confirmação explícita', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const app = read('src/App.tsx');
  assert.match(modal, /useState<LayoutId \| null>\(null\)/);
  assert.match(modal, /\/brand\/mistico-moderno\/prancha-oficial\.webp/);
  assert.match(modal, /isMystic \? 'bg-\[#0A0F18\]'/);
  assert.match(modal, /disabled=\{!selectedLayout \|\| isSaving\}/);
  assert.match(modal, /O estilo só será aplicado depois da sua confirmação\./);
  assert.match(app, /const selected = layoutConfirmedThisSession \? OFFICIAL_LAYOUTS\.find/);
  assert.match(app, /if \(!selected\) \{\s*delete document\.documentElement\.dataset\.layout;/);
  assert.match(app, /setLayoutConfirmedThisSession\(false\);\s*setLayoutChoiceRequested\(false\);/);
});

test('Místico Moderno usa a voz neural salva, sem trocar por voz fixa ou voz do navegador', () => {
  const app = read('src/App.tsx');
  const settings = read('src/components/AudioSettingsModal.tsx');
  const home = read('src/components/TransformationHome.tsx');
  const session = read('src/components/MeditationSession.tsx');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const guard = read('src/lib/misticoModernoOfficialVoicePatch.ts');

  assert.match(app, /const isMisticoModerno = layoutConfirmedThisSession && userProfile\?\.visualLayout === 'mistico-moderno'/);
  assert.match(app, /usesNeuralVoiceCatalog = isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno/);
  assert.match(settings, /requiresNeuralVoice = isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno/);
  assert.match(home, /const isMisticoModerno = props\.visualLayout === 'mistico-moderno'/);
  assert.match(home, /isEleganciaProfunda \|\| isMisticoModerno/);
  assert.match(session, /activeLayout === 'mistico-moderno' && !style4VoiceId/);
  assert.match(session, /activeLayout === 'mistico-moderno'\s*\? style4VoiceId/);
  assert.match(arcanjo, /requireExplicitVoiceId: isEleganciaProfunda \|\| isMisticoModerno/);
  assert.match(guard, /fallbackToSpeechSynthesis: false/);
  assert.doesNotMatch(guard, /OFFICIAL_PROTOCOL_VOICE_ID|normalizeLegacyVoiceId/);
});

test('o tratamento noturno do Arcanjo/Solfeggio está ligado aos elementos reais da tela', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const main = read('src/main.tsx');
  const css = read('src/mistico-moderno-arcanjo-audit.css');
  assert.match(arcanjo, /id="arcanjo-protocol-view"/);
  assert.match(arcanjo, /id="arcanjo-protocol-backdrop"/);
  assert.match(arcanjo, /id="arcanjo-chakra-stage"/);
  assert.match(arcanjo, /id="arcanjo-chakra-caption"/);
  assert.match(main, /import '\.\/mistico-moderno-arcanjo-audit\.css';/);
  assert.match(css, /data-layout="mistico-moderno"/);
  assert.match(css, /#arcanjo-protocol-view/);
});

test('as camadas CSS do Estilo 4 permanecem isoladas do restante do produto', () => {
  const main = read('src/main.tsx');
  const imports = [...main.matchAll(/import '\.\/(mistico-moderno[^']+\.css)'/g)].map(match => match[1]);
  assert.ok(imports.length >= 23, `Esperava ao menos 23 camadas CSS específicas; encontrei ${imports.length}.`);

  for (const file of imports) {
    const css = read(`src/${file}`).replace(/\/\*[\s\S]*?\*\//g, '');
    const headers = [...css.matchAll(/([^{}]+)\{/g)].map(match => match[1].trim()).filter(header => !header.startsWith('@'));
    for (const header of headers) {
      for (const selector of header.split(',')) {
        assert.match(
          selector,
          /(?:html|:root)\[data-layout="mistico-moderno"\]/,
          `${file} contém seletor fora do escopo do Estilo 4: ${selector.trim()}`
        );
      }
    }
  }
});

test('a assinatura oficial permanece transparente e discreta', () => {
  const css = read('src/mistico-moderno-approved-overrides.css');
  assert.match(css, /\.ep-brand-signature-wrap\{\s*background:transparent!important;/);
  assert.match(css, /\.ep-brand-signature\{opacity:\.30!important;/);
  assert.match(css, /#main-header div:has\(> img\.ep-brand-signature\)\{background:transparent!important;/);
});

test('o Solfeggio não reinicia como trilha global durante a narração', () => {
  assert.equal(shouldPlayProtocolSessionBackground('playing', '528hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', '396hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', 'waves'), true);
  assert.equal(shouldPlayProtocolSessionBackground('portal', 'waves'), false);
});

test('os valores e cupons InfinitePay aprovados permanecem intactos', () => {
  assert.equal(PAYMENT_PLANS.jornada_7d.cents, 5990);
  assert.equal(PAYMENT_PLANS.jornada_21d.cents, 9990);
  assert.equal(paymentQuote('jornada_7d', 'PROMO15').cents, 5092);
  assert.equal(paymentQuote('jornada_21d', 'PROMO20').cents, 7992);
  const routes = read('src/lib/paymentRoutes.ts');
  assert.match(routes, /api\.infinitepay\.io\/invoices\/public\/checkout/);
  assert.match(routes, /couponCode !== 'VIP7'/);
});
