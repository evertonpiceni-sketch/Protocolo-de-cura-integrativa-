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

test('Natural Sereno exige voz neural oficial no Arcanjo e nunca cai na voz do dispositivo', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  assert.ok(arcanjo.includes("const isNaturalSereno = typeof document !== 'undefined' && document.documentElement.dataset.layout === 'natural-sereno';"));
  assert.ok(arcanjo.includes('const naturalSerenoVoiceId = isElevenLabsVoiceId(userProfile.voiceId)'));
  assert.ok(arcanjo.includes(': OFFICIAL_PROTOCOL_VOICE_ID;'));
  assert.ok(arcanjo.includes('voiceId: isNaturalSereno\n        ? naturalSerenoVoiceId'));
  assert.ok(arcanjo.includes('requireExplicitVoiceId: isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa'));
  const fallbackStart = arcanjo.indexOf('const startNativeFallback');
  const fallbackCall = arcanjo.indexOf('audioEngine.speakWithElevenLabsOrFallback', fallbackStart);
  const fallbackGuard = arcanjo.indexOf('if (isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa)', fallbackStart);
  assert.ok(fallbackGuard > fallbackStart && fallbackGuard < fallbackCall, 'Natural Sereno deve interromper antes de qualquer fallback nativo.');
  const guardedErrorPath = arcanjo.indexOf('if (isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa)', fallbackCall);
  assert.ok(guardedErrorPath > fallbackCall, 'A falha da narração neural deve ser tratada sem voz do dispositivo.');
  assert.ok(arcanjo.includes('O Natural Sereno não usará a voz do dispositivo.'));
});
