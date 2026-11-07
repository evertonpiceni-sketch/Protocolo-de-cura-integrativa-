export type ElevenLabsVoiceOption = {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
  preview_url?: string;
};

/**
 * ElevenLabs voice IDs are opaque 20-character identifiers.
 * Device SpeechSynthesis names/URIs and the rejected Rachel/Marcus fallback IDs
 * are not valid selections for Elegância Profunda.
 */
const REJECTED_FALLBACK_VOICE_IDS = new Set([
  '21m00Tcm4TlvDq8ikWAM',
  'nPczCjzI2devNBz1zQrb'
]);

export function isElevenLabsVoiceId(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const voiceId = value.trim();
  return /^[A-Za-z0-9]{20}$/.test(voiceId) && !REJECTED_FALLBACK_VOICE_IDS.has(voiceId);
}


/**
 * Natural Sereno uses the voice selected by the user (Maiara), never the
 * legacy Marianne default or a browser voice alias. The exact Maiara ID is
 * intentionally not guessed; a valid saved ElevenLabs ID must be preserved.
 */
const REJECTED_NATURAL_SERENO_VOICE_IDS = new Set([
  'mJqP14JQFEK0PojR5lfV' // Marianne — Meditação, not the selected Maiara voice.
]);

export function isNaturalSerenoVoiceId(value: unknown): value is string {
  return isElevenLabsVoiceId(value) && !REJECTED_NATURAL_SERENO_VOICE_IDS.has(value.trim());
}
