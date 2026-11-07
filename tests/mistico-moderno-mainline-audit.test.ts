import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8');

test('Místico Moderno uses the official board and a night-only selector card', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const layouts = read('src/config/layouts.ts');
  const board = read('public/brand/mistico-moderno/prancha-oficial.svg');
  assert.ok(modal.includes("'/brand/mistico-moderno/prancha-oficial.svg'"));
  assert.ok(modal.includes('isMysticCard'));
  assert.ok(modal.includes('bg-[#07111F]'));
  assert.ok(layouts.includes("swatches: ['#07111F', '#26355F', '#C89D52', '#6C3FA0']"));
  assert.ok(board.includes('data:image/webp;base64,'));
  assert.ok(board.includes('width="240"') && board.includes('height="180"'));
});

test('style application remains gated by an explicit selection and confirmation', () => {
  const app = read('src/App.tsx');
  const modal = read('src/components/LayoutChoiceModal.tsx');
  assert.ok(app.includes('useState(false);') && app.includes('layoutConfirmedThisSession'));
  assert.ok(app.includes('(!layoutConfirmedThisSession || layoutChoiceRequested)'));
  assert.ok(app.includes('setLayoutConfirmedThisSession(true)'));
  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(modal.includes('await onSelect(selectedLayout)'));
});

test('Místico Moderno routes every narration surface through neural audio without browser fallback', () => {
  const app = read('src/App.tsx');
  const settings = read('src/components/AudioSettingsModal.tsx');
  const home = read('src/components/TransformationHome.tsx');
  const meditation = read('src/components/MeditationSession.tsx');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const patch = read('src/lib/misticoModernoOfficialVoicePatch.ts');
  assert.ok(app.includes('|| isMisticoModerno'));
  assert.ok(settings.includes("dataset.layout === 'mistico-moderno'"));
  assert.ok(settings.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(home.includes('|| isMisticoModerno'));
  assert.ok(home.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(meditation.includes('MISTICO_MODERNO_CANVAS_THEME'));
  assert.ok(meditation.includes('style4VoiceId'));
  assert.ok(arcanjo.includes('requireExplicitVoiceId: isEleganciaProfunda || isEssenciaLuminosa || isMisticoModerno'));
  assert.ok(arcanjo.includes('isEleganciaProfunda || isEssenciaLuminosa || isMisticoModerno'));
  assert.ok(patch.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(patch.includes('OFFICIAL_PROTOCOL_VOICE_ID'));
});

test('Solfeggio ownership, Diary defaults and the player animation remain protected', () => {
  const app = read('src/App.tsx');
  const meditation = read('src/components/MeditationSession.tsx');
  const canvas = read('src/components/session/SacredEnergyCanvas.tsx');
  const policy = read('src/lib/protocolSessionAudioPolicy.ts');
  assert.ok(app.includes('!showArcanjoView'));
  assert.ok(app.includes('const [showDailyDiaryModal, setShowDailyDiaryModal] = useState<boolean>(false)'));
  assert.ok(app.includes('const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false)'));
  assert.ok(meditation.includes('shouldPlayProtocolSessionBackground'));
  assert.ok(canvas.includes("prefers-reduced-motion: reduce"));
  assert.ok(canvas.includes('particleGold') && canvas.includes('particleAccent'));
  assert.ok(policy.includes('shouldPlayProtocolSessionBackground'));
});

test('all Místico Moderno CSS modules are layout-scoped and the logo remains a quiet signature', () => {
  const cssFiles = fs.readdirSync('src').filter(file => file.startsWith('mistico-moderno-') && file.endsWith('.css'));
  assert.ok(cssFiles.length >= 23);
  for (const file of cssFiles) {
    const css = read(path.join('src', file)).replace(/\/\*[\s\S]*?\*\//g, '');
    const selectors = [...css.matchAll(/([^{}]+)\{/g)]
      .map(match => match[1].trim().replace(/\s+/g, ' '))
      .filter(selector => selector && !selector.startsWith('@') && !/^(from|to|\d+%)/.test(selector));
    const unscoped = selectors.filter(selector => !selector.includes(':root[data-layout="mistico-moderno"]'));
    assert.deepEqual(unscoped, [], `${file} contains selectors outside the Místico Moderno scope`);
  }
  assert.ok(read('src/mistico-moderno-approved-overrides.css').includes('opacity:.30!important'));
  assert.ok(read('src/mistico-moderno-approved-overrides.css').includes('opacity:.26!important'));
  assert.ok(read('src/mistico-moderno-header-audit.css').includes('opacity:.30!important'));
  assert.ok(read('src/mistico-moderno-dashboard-audit.css').includes('opacity: .30 !important;'));
});

test('Numerology and specific treatments use the secure InfinitePay checkout only', () => {
  const numerology = read('src/components/NumerologyModal.tsx');
  const specific = read('src/components/SpecificTreatmentModal.tsx');
  const routes = read('src/lib/paymentRoutes.ts');
  assert.ok(numerology.includes("productType: 'numerology_full'"));
  assert.ok(numerology.includes('NUMEROLOGY_FULL_PRICE_CENTS'));
  assert.ok(!numerology.includes('handleCopyPix'));
  assert.ok(!numerology.includes('evertonpiceni@gmail.com'));
  assert.ok(specific.includes("productType: 'specific_treatment'"));
  assert.ok(!specific.includes('handleCopyPix'));
  assert.ok(!specific.includes('evertonpiceni@gmail.com'));
  assert.ok(routes.includes("'numerology_full'"));
  assert.ok(routes.includes('NUMEROLOGY_FULL_PRICE_CENTS'));
  assert.ok(routes.includes('numerologyPurchased: true'));
});
