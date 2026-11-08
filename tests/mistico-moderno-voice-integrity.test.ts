import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno uses the saved neural voice in every narration entry point', () => {
  const app = read('src/App.tsx');
  const settings = read('src/components/AudioSettingsModal.tsx');
  const home = read('src/components/TransformationHome.tsx');
  const player = read('src/components/MeditationSession.tsx');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const anamnesis = read('src/components/AnamnesisModal.tsx');
  const systemic = read('src/components/SystemicQuestionsModal.tsx');
  const hooponopono = read('src/components/HooponoponoModal.tsx');
  const archangelPrayer = read('src/components/ArchangelMichaelPrayerModal.tsx');

  assert.match(app, /const isMisticoModerno = layoutConfirmedThisSession && userProfile\?\.visualLayout === 'mistico-moderno'/);
  assert.match(app, /usesNeuralVoiceCatalog = isNaturalSereno \|\| isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno/);
  assert.match(app, /Essência Luminosa e Místico Moderno não usam a voz do dispositivo/);
  assert.match(app, /effectiveNeuralVoiceId = \(isNaturalSereno \|\| isEssenciaLuminosa\)/);

  assert.match(settings, /requiresNeuralVoice = isNaturalSereno \|\| isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno/);
  assert.match(settings, /fallbackToSpeechSynthesis: !requiresNeuralVoice/);
  assert.match(settings, /if \(requiresNeuralVoice && !isElevenLabsVoiceId\(voiceId\)\)/);
  assert.match(settings, /isStyle4SolfeggioBlocked = isMisticoModerno && isTestingVoice && isSolfeggioFrequency\(track\.id\)/);

  assert.match(home, /requiresNeuralVoice = isNaturalSereno \|\| isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno/);
  assert.match(home, /approvedVoiceId = isEleganciaProfunda[\s\S]*?: isMisticoModerno/);
  assert.match(home, /fallbackToSpeechSynthesis: !requiresNeuralVoice/);

  assert.match(player, /const style4VoiceId = isElevenLabsVoiceId\(selectedVoiceId\) \? selectedVoiceId : ''/);
  assert.match(player, /isMisticoModerno && !style4VoiceId/);
  assert.match(player, /isMisticoModerno\s*\?\s*style4VoiceId/);

  assert.match(arcanjo, /const isMisticoModerno = typeof document !== 'undefined' && document\.documentElement\.dataset\.layout === 'mistico-moderno'/);
  assert.match(arcanjo, /voiceId: \(isEleganciaProfunda \|\| isMisticoModerno\)\s*\? userProfile\.voiceId/);
  assert.match(arcanjo, /requireExplicitVoiceId: isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno/);
  assert.match(arcanjo, /if \(\(isEleganciaProfunda \|\| isMisticoModerno\) && !isElevenLabsVoiceId\(userProfile\.voiceId\)\)/);

  for (const source of [anamnesis, systemic, hooponopono, archangelPrayer]) {
    assert.ok(source.includes('isMisticoModerno'), 'Every legacy narration entry point must recognize Style 4.');
    assert.ok(source.includes('fallbackToSpeechSynthesis: false') || source.includes('fallbackToSpeechSynthesis: !(isEleganciaProfunda || isEssenciaLuminosa || isMisticoModerno)'));
  }
});

test('Style 4 Solfeggio starts and resumes only around neural narration', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const start = arcanjo.slice(arcanjo.indexOf('const start ='), arcanjo.indexOf('const togglePlayback'));
  const resume = arcanjo.slice(arcanjo.indexOf('const togglePlayback'), arcanjo.indexOf('const selectDay'));
  assert.match(start, /if \(!isMisticoModerno\) audioEngine\.startSynth/);
  assert.match(start, /onStart: \(\) => \{[\s\S]*?audioEngine\.startSynth/);
  assert.match(start, /onPause: \(\) => \{[\s\S]*?audioEngine\.stopSynth/);
  assert.match(start, /onError: \(\) => \{[\s\S]*?audioEngine\.stopSynth/);
  assert.match(resume, /audioEngine\.resumeSpeech\(\);\s*if \(!isMisticoModerno\)/);

  const anamnesis = read('src/components/AnamnesisModal.tsx');
  const systemic = read('src/components/SystemicQuestionsModal.tsx');
  assert.match(anamnesis, /resumeStyle4AnamnesisSolfeggio/);
  assert.match(anamnesis, /isMisticoModerno && audioEngine\.getCurrentSynthType\(\) === '639hz'/);
  assert.match(anamnesis, /stopTherapeuticVoice\(false\)/);
  assert.match(systemic, /resumeStyle4SystemicSolfeggio/);
  assert.match(systemic, /isMisticoModerno && audioEngine\.getCurrentSynthType\(\) === '639hz'/);
  assert.match(systemic, /audioEngine\.stopSpeech\(\)/);
});

test('Style 4 player uses its night palette and retains reduced-motion support', () => {
  const session = read('src/components/MeditationSession.tsx');
  const canvas = read('src/components/session/SacredEnergyCanvas.tsx');
  const css = read('src/mistico-moderno-session-audit.css');
  assert.match(session, /const MISTICO_MODERNO_CANVAS_THEME = \{/);
  assert.match(session, /'mistico-moderno'\].includes\(activeLayout/);
  assert.match(session, /isMisticoModerno \? MISTICO_MODERNO_CANVAS_THEME/);
  assert.match(css, /#meditation-session \.ep-session-light-overlay/);
  assert.match(css, /button\.ep-gold-button/);
  assert.match(canvas, /prefers-reduced-motion/);
});

test('the four-style selector remains neutral until explicit confirmation and isolates the Style 4 card', () => {
  const app = read('src/App.tsx');
  const modal = read('src/components/LayoutChoiceModal.tsx');
  assert.match(app, /layoutConfirmedThisSession, setLayoutConfirmedThisSession\] = useState\(false\)/);
  assert.match(app, /const selected = layoutConfirmedThisSession \? OFFICIAL_LAYOUTS\.find/);
  assert.match(app, /\(!layoutConfirmedThisSession \|\| layoutChoiceRequested\)/);
  assert.match(app, /delete document\.documentElement\.dataset\.layout/);
  assert.match(modal, /useState<LayoutId \| null>\(null\)/);
  assert.match(modal, /disabled=\{!selectedLayout \|\| isSaving\}/);
  assert.match(modal, /cardBackgroundClass = isMysticCard \? 'bg-\[#0A0F18\]'/);
  assert.match(modal, /confirmButtonRadius = selectedLayout === 'mistico-moderno' \? 'rounded-\[18px\]'/);
  for (const color of ['#0A2742', '#2E3B73', '#1E6B5A', '#6C3FA0', '#D4AF37', '#E2B96B', '#F4F1EB', '#6F8F55']) {
    assert.ok(modal.includes(color), 'Missing Místico Moderno reference color ' + color);
  }
});

test('Style 4 page layers are loaded and all selectors remain scoped to Style 4', () => {
  const main = read('src/main.tsx');
  assert.match(main, /import '\.\/mistico-moderno-welcome-audit\.css';/);
  assert.match(main, /import '\.\/mistico-moderno-arcanjo-audit\.css';/);

  const imports = [...main.matchAll(/import '\.\/(mistico-moderno-[^']+\.css)';/g)].map(match => match[1]);
  assert.ok(imports.length >= 26, `Expected the full Style 4 page audit; found ${imports.length} layers.`);
  for (const filename of imports) {
    const css = read(`src/${filename}`).replace(/\/\*[\s\S]*?\*\//g, '');
    const selectors = [...css.matchAll(/([^{}]+)\{/g)]
      .map(match => match[1].trim().replace(/\s+/g, ' '))
      .filter(selector => selector && !selector.startsWith('@') && !/^(from|to|\d+%)/.test(selector));
    const unscoped = selectors.filter(selector => !selector.includes('data-layout="mistico-moderno"'));
    assert.deepEqual(unscoped, [], `${filename} contains a selector outside the Místico Moderno scope.`);
  }
});

test('Diary stays closed by default, the official logo remains subtle, and legacy onboarding is not mounted', () => {
  const app = read('src/App.tsx');
  const css = read('src/mistico-moderno-approved-overrides.css');
  const main = read('src/main.tsx');
  assert.match(app, /const \[isJournalOpen, setIsJournalOpen\] = useState<boolean>\(false\)/);
  assert.match(app, /const \[showDailyDiaryModal, setShowDailyDiaryModal\] = useState<boolean>\(false\)/);
  assert.match(app, /import\('\.\/components\/OnboardingFlow'\)/);
  assert.match(app, /<OnboardingFlow/);
  assert.doesNotMatch(main, /legacy DOM chooser/);
  assert.match(css, /\.ep-brand-signature\{opacity:\.30!important/);
  assert.match(css, /\.ep-brand-signature\{opacity:\.26!important/);
});

test('InfinitePay remains the active checkout and manual PIX copy stays absent', () => {
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
