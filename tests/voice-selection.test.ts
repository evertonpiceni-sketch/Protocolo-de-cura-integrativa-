import assert from 'node:assert/strict';
import test from 'node:test';
import { isElevenLabsVoiceId, isNaturalSerenoVoiceId } from '../src/lib/voiceSelection';

test('accepts opaque ElevenLabs voice IDs', () => {
  assert.equal(isElevenLabsVoiceId('mJqP14JQFEK0PojR5lfV'), true);
  assert.equal(isElevenLabsVoiceId('AbCdEfGhIjKlMnOpQrSt'), true);
});

test('rejects device voice names, URIs and legacy aliases', () => {
  assert.equal(isElevenLabsVoiceId('Rachel'), false);
  assert.equal(isElevenLabsVoiceId('Marcus'), false);
  assert.equal(isElevenLabsVoiceId('21m00Tcm4TlvDq8ikWAM'), false);
  assert.equal(isElevenLabsVoiceId('nPczCjzI2devNBz1zQrb'), false);
  assert.equal(isElevenLabsVoiceId('Google português do Brasil'), false);
  assert.equal(isElevenLabsVoiceId('com.apple.ttsbundle.Monica-compact'), false);
  assert.equal(isElevenLabsVoiceId(''), false);
});


test('Natural Sereno does not substitute Marianne, Rachel, Marcus or a device voice for Maiara', () => {
  assert.equal(isNaturalSerenoVoiceId('mJqP14JQFEK0PojR5lfV'), false);
  assert.equal(isNaturalSerenoVoiceId('21m00Tcm4TlvDq8ikWAM'), false);
  assert.equal(isNaturalSerenoVoiceId('nPczCjzI2devNBz1zQrb'), false);
  assert.equal(isNaturalSerenoVoiceId('Rachel'), false);
  assert.equal(isNaturalSerenoVoiceId('Maiara'), false);
  assert.equal(isNaturalSerenoVoiceId('AbCdEfGhIjKlMnOpQrSt'), true);
});
