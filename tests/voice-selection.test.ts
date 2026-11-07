import assert from 'node:assert/strict';
import test from 'node:test';
import { isElevenLabsVoiceId } from '../src/lib/voiceSelection';

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
