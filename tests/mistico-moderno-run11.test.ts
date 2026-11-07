import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('the four-style chooser still requires explicit confirmation in every new session', () => {
  const app = read('src/App.tsx');
  const chooser = read('src/components/LayoutChoiceModal.tsx');
  assert.match(app, /const \[layoutConfirmedThisSession, setLayoutConfirmedThisSession\] = useState\(false\)/);
  assert.match(app, /\(!layoutConfirmedThisSession \|\| layoutChoiceRequested\)/);
  assert.match(chooser, /useState<LayoutId \| null>\(null\)/);
  assert.match(chooser, /if \(!selectedLayout \|\| isSaving\) return/);
  assert.match(chooser, /layout\.id === 'mistico-moderno'\s*\? \[canvas, '#2E3B73', '#1E6B5A', accent\]/);
});

test('Místico Moderno keeps Marianne — Meditação and never falls back to browser speech', () => {
  const voicePatch = read('src/lib/misticoModernoOfficialVoicePatch.ts');
  const settings = read('src/components/AudioSettingsModal.tsx');
  const app = read('src/App.tsx');
  const home = read('src/components/TransformationHome.tsx');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  assert.match(voicePatch, /OFFICIAL_PROTOCOL_VOICE_ID/);
  assert.match(voicePatch, /fallbackToSpeechSynthesis: false/);
  assert.match(voicePatch, /requireExplicitVoiceId: true/);
  assert.match(voicePatch, /engine\.previewVoice/);
  assert.match(settings, /Marianne — Meditação/);
  assert.match(settings, /fallbackToSpeechSynthesis: !requiresNeuralVoice/);
  assert.match(app, /isMisticoModerno \?\s*OFFICIAL_PROTOCOL_VOICE_ID/);
  assert.match(home, /isMisticoModerno/);
  assert.match(home, /requiresNeuralVoice = [^;]*isMisticoModerno/);
  assert.match(home, /usesSavedVoiceSettings = requiresNeuralVoice/);
  assert.match(arcanjo, /if \(isEleganciaProfunda \|\| isMisticoModerno\)/);
  assert.match(arcanjo, /voiceId: isMisticoModerno\s*\?\s*OFFICIAL_PROTOCOL_VOICE_ID/);
  assert.match(arcanjo, /requireExplicitVoiceId: isEleganciaProfunda \|\| isMisticoModerno/);
});

test('the Místico Moderno session and Arcanjo surfaces use isolated night styling', () => {
  const session = read('src/components/MeditationSession.tsx');
  const appEntry = read('src/main.tsx');
  const theme = read('src/approved-theme.css');
  assert.match(session, /MISTICO_MODERNO_CANVAS_THEME/);
  assert.match(session, /sageSoft: 'rgba\(30,107,90/);
  assert.match(appEntry, /mistico-moderno-arcanjo-audit\.css/);
  for (const token of ['--layout-indigo:#2E3B73', '--layout-emerald:#1E6B5A', '--layout-violet:#6C3FA0', '--layout-amber:#E2B96B']) {
    assert.ok(theme.includes(token), `missing palette token: ${token}`);
  }
});

test('all Style 4 CSS modules remain scoped to data-layout=mistico-moderno', () => {
  const paths = [
    'src/mistico-moderno-approved-overrides.css',
    'src/mistico-moderno-modal-audit.css',
    'src/mistico-moderno-dashboard-audit.css',
    'src/mistico-moderno-header-audit.css',
    'src/mistico-moderno-guides-audit.css',
    'src/mistico-moderno-session-audit.css',
    'src/mistico-moderno-courses-audit.css',
    'src/mistico-moderno-maps-audit.css',
    'src/mistico-moderno-achievements-audit.css',
    'src/mistico-moderno-daily-diary-audit.css',
    'src/mistico-moderno-hooponopono-audit.css',
    'src/mistico-moderno-journal-audit.css',
    'src/mistico-moderno-milestone-audit.css',
    'src/mistico-moderno-report-certificate-audit.css',
    'src/mistico-moderno-herbal-baths-audit.css',
    'src/mistico-moderno-specific-treatment-audit.css',
    'src/mistico-moderno-promo-audit.css',
    'src/mistico-moderno-contact-audit.css',
    'src/mistico-moderno-video-studio-audit.css',
    'src/mistico-moderno-bottom-nav-audit.css',
    'src/mistico-moderno-mobile-install-audit.css',
    'src/mistico-moderno-audio-settings-audit.css',
    'src/mistico-moderno-arcanjo-audit.css'
  ];
  for (const path of paths) {
    const css = read(path).replace(/\/\*[\s\S]*?\*\//g, '');
    const selectors = [...css.matchAll(/([^{}]+)\{/g)]
      .map(match => match[1].trim())
      .filter(selector => selector && !selector.startsWith('@') && !/^(from|to|\d+%)/.test(selector));
    assert.ok(selectors.length > 0, `${path} has no selectors`);
    for (const selector of selectors) {
      assert.ok(selector.includes('data-layout="mistico-moderno"'), `${path} leaks selector: ${selector}`);
    }
  }
});

test('the approved logo remains a subtle signature on desktop and mobile', () => {
  const css = read('src/mistico-moderno-approved-overrides.css');
  assert.match(css, /\.ep-brand-signature\{opacity:\.30!important/);
  assert.match(css, /\.ep-brand-signature\{opacity:\.26!important/);
});

test('Numerologia e Prática Específica stay on fixed-price InfinitePay checkout', () => {
  const routes = read('src/lib/paymentRoutes.ts');
  const numerology = read('src/components/NumerologyModal.tsx');
  const specific = read('src/components/SpecificTreatmentModal.tsx');
  assert.match(routes, /numerology_full/);
  assert.match(routes, /NUMEROLOGY_FULL_PRICE_CENTS/);
  assert.match(routes, /provider\('\/payment_check'/);
  assert.match(numerology, /productType: 'numerology_full'/);
  assert.ok(!numerology.includes('handleCopyPix'));
  assert.ok(!numerology.includes('evertonpiceni@gmail.com'));
  assert.ok(!specific.includes('handleCopyPix'));
  assert.ok(!specific.includes('evertonpiceni@gmail.com'));
});


test('the Diary starts closed and the energy canvas respects reduced-motion preferences', () => {
  const app = read('src/App.tsx');
  const canvas = read('src/components/session/SacredEnergyCanvas.tsx');
  assert.match(app, /const \[isJournalOpen, setIsJournalOpen\] = useState<boolean>\(false\)/);
  assert.match(app, /const \[showDailyDiaryModal, setShowDailyDiaryModal\] = useState<boolean>\(false\)/);
  assert.match(canvas, /prefers-reduced-motion/);
});
