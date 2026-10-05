import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveProtocolScript } from '../src/lib/protocolScript';
import { ORIGINAL_PROTOCOL_SCRIPTS } from '../src/data/protocol_scripts';
import { REINTEGRATION_DAYS } from '../src/data/reintegrationJourneyPublic';

test('Portuguese audio uses the full approved script instead of obsolete short translations', () => {
  for (const [stage, script] of Object.entries(ORIGINAL_PROTOCOL_SCRIPTS)) {
    const result = resolveProtocolScript(stage, 'pt', 'Pessoa');
    assert.equal(result.audioText, (script.ttsScript || script.fullText).replace(/\{userName\}|\[NOME\]/g, 'Pessoa'));
    assert.equal(result.readingText, result.audioText.replace(/<break\s+[^>]*\/>/g, '\n\n').trim());
  }
});
test('reading and audio include the same personal decree only in the opening', () => {
  const result = resolveProtocolScript('ABERTURA', 'pt', 'Pessoa', '', 'Meu decreto');
  assert.ok(result.audioText.endsWith('Decreto Pessoal Especial: Meu decreto'));
  assert.ok(result.readingText.endsWith('Decreto Pessoal Especial: Meu decreto'));
  assert.ok(!resolveProtocolScript('ATERRAMENTO', 'pt', 'Pessoa', '', 'Meu decreto').audioText.includes('Meu decreto'));
});
test('all Reintegração days preserve distinct titles and ordered approved voice cues', () => {
  assert.equal(REINTEGRATION_DAYS.length, 21);
  for (const day of REINTEGRATION_DAYS) {
    assert.ok(day.audioCues.find(cue => cue.at === 240)?.text.includes(day.title));
    assert.ok(day.audioCues.every((cue, index) => !index || cue.at > day.audioCues[index - 1].at));
    assert.ok(!day.audioCues.some(cue => cue.at >= 1260 && cue.at < 1620));
  }
});

test('canonical pauses remain unchanged and equal-length names do not collide in audio cache', async () => {
  const { prepareTherapeuticSSML, protocolAudioCacheKey } = await import('../src/lib/ttsText');
  const original = ORIGINAL_PROTOCOL_SCRIPTS.ABERTURA.ttsScript;
  assert.equal(prepareTherapeuticSSML(original), original.trim());
  const ana = resolveProtocolScript('ABERTURA', 'pt', 'Ana').audioText;
  const eva = resolveProtocolScript('ABERTURA', 'pt', 'Eva').audioText;
  assert.equal(ana.slice(0, 80), eva.slice(0, 80));
  assert.equal(ana.length, eva.length);
  assert.notEqual(protocolAudioCacheKey('voice', .85, ana), protocolAudioCacheKey('voice', .85, eva));
  assert.notEqual(protocolAudioCacheKey('voice', .85, ana), protocolAudioCacheKey('other-voice', .85, ana));
});
