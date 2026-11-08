import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { shouldBlockArcanjoBackground } from '../src/lib/arcanjoAudioPolicy';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('Arcanjo blocks global background audio without blocking its own seven Solfeggio tones', () => {
  for (const type of ['waves', 'florestazen', 'chuvaserena', '396hz', '417hz', '432hz', '528hz', '639hz', '741hz', '852hz', '963hz', 'none']) {
    assert.equal(shouldBlockArcanjoBackground(type, true), true, type);
  }
  assert.equal(shouldBlockArcanjoBackground('waves', false), false);
  const ownership = read('src/lib/arcanjoAudioOwnershipPatch.ts');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  assert.ok(ownership.includes('audioEngine.startBG ='));
  assert.ok(ownership.includes('if (!arcanjoWasMounted)'));
  assert.ok(!ownership.includes('audioEngine.stopBG();\n    return;'));
  assert.ok(!ownership.includes('if (isArcanjoViewMounted()) audioEngine.stopBG();'));
  assert.ok(!ownership.includes('audioEngine.startSynth ='));
  assert.ok(arcanjo.includes('audioEngine.startSynth(`${config.freq}hz`)'));
  assert.ok(arcanjo.includes('freq: 396 | 417 | 528 | 639 | 741 | 852 | 963'));
});

test('assinatura Arcanjo permite abertura manual, sem abrir o protocolo automaticamente no login', () => {
  const app = read('src/App.tsx');
  assert.ok(app.includes("const hasArcanjoAccess = userProfile?.plan === 'pro' || userProfile?.subscriptionPlan === 'arcanjo_7d';"));
  assert.ok(app.includes('if (hasArcanjoAccess) setShowArcanjoView(true);'));
  assert.ok(app.includes('onOpenArcanjo={() => hasArcanjoAccess ? setShowArcanjoView(true) : setShowProModal(true)}'));
  assert.ok(app.includes(') : showArcanjoView ? ('));
  assert.ok(!app.includes("showArcanjoView || userProfile.subscriptionPlan === 'arcanjo_7d'"));
  assert.ok(app.includes("if (plan === 'arcanjo_7d') setShowArcanjoView(true);"));
});
