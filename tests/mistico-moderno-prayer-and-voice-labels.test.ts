import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno gives the 21-day Archangel prayer its own night palette', () => {
  const modal = read('src/components/ArchangelMichaelPrayerModal.tsx');
  const styles = read('src/mistico-moderno-arcanjo-audit.css');

  assert.match(modal, /id="archangel-prayer-modal"/);
  assert.match(modal, /className="ep-archangel-prayer/);
  assert.match(styles, /:root\[data-layout="mistico-moderno"\] #archangel-prayer-modal/);
  assert.match(styles, /#archangel-prayer-modal > \.ep-archangel-prayer/);
  assert.match(styles, /linear-gradient\(180deg, #0A2742 0%, #101827 100%\)/);
  assert.match(styles, /rgba\(108, 63, 160/);
  assert.match(styles, /rgba\(212, 175, 55/);
  assert.match(styles, /text-emerald-/);
  assert.match(styles, /button:disabled/);
});

test('Místico Moderno labels the saved neural voice instead of the legacy gender preset', () => {
  const anamnesis = read('src/components/AnamnesisModal.tsx');

  assert.match(anamnesis, /isEssenciaLuminosa \|\| isMisticoModerno \? 'Voz neural escolhida em Ajustes de áudio'/);
  assert.match(anamnesis, /isMisticoModerno \? 'Voz neural escolhida em Ajustes de áudio' : selectedVoiceGender === 'masculina'/);
  assert.match(anamnesis, /fallbackToSpeechSynthesis: false/);
});


test('Místico Moderno themes the plan guide and InfinitePay checkout surfaces', () => {
  const guide = read('src/components/PlansValuesGuideModal.tsx');
  const checkout = read('src/components/ProUpgradeModal.tsx');
  const app = read('src/App.tsx');
  const styles = read('src/mistico-moderno-modal-audit.css');

  assert.match(guide, /id="plans-values-guide-modal"/);
  assert.match(guide, /data-plan-cta="true"/);
  assert.match(checkout, /id="plans-modal"/);
  assert.match(app, /fetch\('\/api\/payment\/create-checkout'/);
  assert.match(app, /productType: 'subscription'/);
  assert.match(styles, /:root\[data-layout="mistico-moderno"\] #plans-values-guide-modal/);
  assert.match(styles, /button\[data-plan-cta="true"\]/);
  assert.match(styles, /:root\[data-layout="mistico-moderno"\] #plans-modal/);
  assert.match(styles, /button\[class~="bg-\[#073B2B\]"\]/);
  assert.match(styles, /linear-gradient\(180deg, #0A2742 0%, #101827 100%\)/);
  assert.match(styles, /rgba\(212, 175, 55/);
  assert.match(styles, /rgba\(108, 63, 160/);
});

test('Místico Moderno keeps the logout action within the approved night palette', () => {
  const app = read('src/App.tsx');
  const styles = read('src/mistico-moderno-header-audit.css');

  assert.ok(app.includes('id="header-btn-logout"'));
  assert.ok(styles.includes(':root[data-layout="mistico-moderno"] #header-btn-logout{\\n  background:rgba(20,31,48'));
  assert.ok(styles.includes(':root[data-layout="mistico-moderno"] #header-btn-logout svg{\\n  color:#E2B96B!important;'));
  assert.ok(styles.includes('#header-btn-logout:hover{\\n  background:rgba(33,43,72'));
  assert.equal(styles.includes('rgba(74,28,47'), false);
  assert.equal(styles.includes('rgba(190,92,126'), false);
  assert.equal(styles.includes('#F5DDE5'), false);
});
