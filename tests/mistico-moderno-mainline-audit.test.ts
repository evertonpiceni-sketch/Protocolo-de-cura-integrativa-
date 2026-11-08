import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

test('o seletor usa a prancha oficial do Místico e exige confirmação explícita', () => {
  const selector = read('src/components/LayoutChoiceModal.tsx');
  assert.match(selector, /misticoBoardBase64/);
  assert.match(selector, /MISTICO_MODERNO_OFFICIAL_BOARD/);
  assert.match(selector, /object-contain/);
  assert.match(selector, /useState<LayoutId \| null>\(null\)/);
  assert.match(selector, /if \(!selectedLayout \|\| isSaving\) return/);
  assert.match(selector, /disabled=\{!selectedLayout \|\| isSaving\}/);
});

test('a paleta Místico mantém noite, índigo, esmeralda, violeta, dourado e âmbar', () => {
  const layouts = read('src/config/layouts.ts');
  for (const color of ['#0A0F18', '#243B63', '#0D5F4F', '#6C3FA0', '#D4AF37', '#E2B96B']) {
    assert.ok(layouts.includes(color), `Cor ausente na paleta: ${color}`);
  }
});

test('o Místico usa a voz neural salva no perfil, sem fallback de navegador', () => {
  const patch = read('src/lib/misticoModernoOfficialVoicePatch.ts');
  const app = read('src/App.tsx');
  const settings = read('src/components/AudioSettingsModal.tsx');
  const home = read('src/components/TransformationHome.tsx');
  const player = read('src/components/MeditationSession.tsx');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const anamnesis = read('src/components/AnamnesisModal.tsx');
  const systemic = read('src/components/SystemicQuestionsModal.tsx');
  const hooponopono = read('src/components/HooponoponoModal.tsx');
  const prayer = read('src/components/ArchangelMichaelPrayerModal.tsx');

  assert.match(app, /usesNeuralVoiceCatalog = .*isMisticoModerno/);
  assert.match(settings, /requiresNeuralVoice = .*isMisticoModerno/);
  assert.match(home, /isEleganciaProfunda \|\| isMisticoModerno/);
  assert.match(player, /misticoVoiceId = isElevenLabsVoiceId\(selectedVoiceId\)/);
  assert.match(arcanjo, /requiresSavedProfileVoice = isEleganciaProfunda \|\| isMisticoModerno/);
  assert.match(anamnesis, /if \(requiresNeuralVoice\)/);
  assert.match(systemic, /isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno/);
  assert.match(hooponopono, /requiresSavedProfileVoice = isEleganciaProfunda \|\| isMisticoModerno/);
  assert.match(prayer, /requiresSavedProfileVoice = isEleganciaProfunda \|\| isMisticoModerno/);
  assert.match(patch, /isElevenLabsVoiceId/);
  assert.match(patch, /fallbackToSpeechSynthesis: false/);
  assert.match(patch, /requireExplicitVoiceId: true/);
});

test('o Solfeggio 639 Hz pausa durante a narração neural do Místico', () => {
  const anamnesis = read('src/components/AnamnesisModal.tsx');
  const systemic = read('src/components/SystemicQuestionsModal.tsx');
  assert.match(anamnesis, /isMisticoModerno && \(isPlayingTherapeuticVoice \|\| isLoadingVoice\)/);
  assert.match(systemic, /isMisticoModerno && isReadingVoice/);
  assert.match(systemic, /audioEngine\.stopSpeech\(\)/);
});

test('player e Arcanjo usam tratamento Místico e respeitam pausa/erro', () => {
  const player = read('src/components/MeditationSession.tsx');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const main = read('src/main.tsx');
  const arcanjoCss = read('src/mistico-moderno-arcanjo-audit.css');

  assert.match(player, /MISTICO_MODERNO_CANVAS_THEME/);
  assert.match(player, /useReducedMotion/);
  assert.match(player, /shouldReduceMotion/);
  assert.match(arcanjo, /requireExplicitVoiceId: requiresNeuralVoice/);
  assert.match(arcanjo, /if \(requiresNeuralVoice\)/);
  assert.match(main, /mistico-moderno-arcanjo-audit\.css/);
  assert.match(arcanjoCss, /:root\[data-layout="mistico-moderno"\]/);
});

test('os módulos visuais Místico estão carregados, isolados e incluem Diário e assinatura discreta', () => {
  const main = read('src/main.tsx');
  const files = [...main.matchAll(/import ['"]\.\/(mistico-moderno-[^'"]+\.css)['"];/g)].map(match => match[1]);
  assert.ok(files.length >= 23, `Esperados ao menos 23 módulos Místico, encontrados ${files.length}`);
  assert.ok(files.includes('mistico-moderno-daily-diary-audit.css'));
  assert.ok(files.includes('mistico-moderno-arcanjo-audit.css'));

  for (const file of files) {
    const css = read(`src/${file}`);
    assert.match(css, /(?::root|html)\[data-layout=["']?mistico-moderno["']?\]/, `${file} sem escopo Místico`);
    const globals = css.match(/^\s*(?:html|body|:root|button|input|select|textarea|\*)\s*\{/gm) || [];
    assert.equal(globals.length, 0, `${file} contém seletor global não isolado`);
  }

  const brand = read('src/mistico-moderno-approved-overrides.css');
  assert.match(brand, /\.ep-brand-signature\{opacity:\.30!important/);
  assert.match(brand, /\.ep-brand-signature\{opacity:\.26!important/);
});

test('checkout InfinitePay é server-side, de uso único e valida o valor exato', () => {
  const routes = read('src/lib/paymentRoutes.ts');
  const numerology = read('src/components/NumerologyModal.tsx');
  assert.match(routes, /https:\/\/api\.checkout\.infinitepay\.io/);
  assert.match(routes, /INFINITEPAY_API_KEY/);
  assert.match(routes, /single_payment: true/);
  assert.match(routes, /numerology_full/);
  assert.match(routes, /verified\.amount !== order\.cents/);
  assert.match(numerology, /productType: 'numerology_full'/);
});
