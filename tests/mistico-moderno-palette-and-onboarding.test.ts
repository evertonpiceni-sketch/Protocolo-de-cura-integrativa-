import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno uses the approved gold and amber tokens instead of legacy Natural Sereno bronze', () => {
  const styleSheets = [
    'src/mistico-moderno-session-audit.css',
    'src/mistico-moderno-welcome-audit.css',
    'src/mistico-moderno-arcanjo-audit.css',
    'src/mistico-moderno-daily-diary-audit.css'
  ];

  for (const path of styleSheets) {
    const css = read(path);
    const declarations = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
      .filter(match => !match[1].trim().startsWith('@'))
      .map(match => match[2])
      .join('\n');
    assert.doesNotMatch(
      declarations,
      /#B88736|#b88a3c|#d2a85b|#d8b56a|rgba\(\s*(184\s*,\s*135\s*,\s*54|190\s*,\s*145\s*,\s*62)/i,
      'Legacy gold declaration remains in ' + path + '.'
    );
  }

  const theme = read('src/approved-theme.css');
  const style4 = theme.match(/:root\[data-layout="mistico-moderno"\]\s*\{([\s\S]*?)\n\}/)?.[1] || '';
  assert.match(style4, /--layout-gold-light:#E2B96B;/);
  assert.match(style4, /--layout-gold-dark:#A87E37;/);
  assert.match(style4, /--layout-gold-gradient:linear-gradient\(135deg,#D4AF37 0%,#E2B96B 55%,#A87E37 100%\);/);
  assert.match(style4, /--layout-gold-shadow:rgba\(212,175,55,.18\);/);
});

test('the active first-login onboarding has a dedicated night treatment and respects reduced motion', () => {
  const app = read('src/App.tsx');
  const flow = read('src/components/OnboardingFlow.tsx');
  const css = read('src/mistico-moderno-welcome-audit.css');
  const main = read('src/main.tsx');

  assert.match(app, /showWelcomeModal && userProfile && layoutConfirmedThisSession/);
  assert.match(main, /import '\.\/mistico-moderno-welcome-audit\.css';/);
  assert.match(flow, /useReducedMotion/);
  assert.match(flow, /initial=\{shouldReduceMotion \? false : \{opacity:0,y:18\}\}/);
  assert.match(flow, /exit=\{shouldReduceMotion \? undefined : \{opacity:0,y:-14\}\}/);
  assert.match(css, /:root\[data-layout="mistico-moderno"\] \.ep-care-onboarding \{/);
  assert.match(css, /:root\[data-layout="mistico-moderno"\] \.ep-care-onboarding-card \{/);
  assert.match(css, /linear-gradient\(135deg, #D4AF37 0%, #E2B96B 55%, #A87E37 100%\)/);
  assert.match(css, /opacity: \.30 !important;/);
});

test('preselection loading remains neutral and the official logo stays a subtle signature', () => {
  const app = read('src/App.tsx');
  const neutral = read('src/prestyle-neutral.css');

  assert.match(app, /themeColor = selected\?\.swatches\[0\] \?\? '#F8F7F3'/);
  assert.match(app, /id="auth-loading-view" className="min-h-screen bg-\[#F8F7F3\] text-\[#302E2A\]/);
  assert.match(neutral, /:root:not\(\[data-layout\]\) #auth-loading-view/);
  assert.match(neutral, /:root:not\(\[data-layout\]\) #auth-loading-view \.ep-brand-signature/);
  assert.match(neutral, /opacity: \.30 !important;/);
});
