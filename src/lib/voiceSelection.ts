export type ElevenLabsVoiceOption = {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
  preview_url?: string;
};

/**
 * ElevenLabs voice IDs are opaque 20-character identifiers.
 * Device SpeechSynthesis names/URIs and legacy aliases are not valid neural IDs.
 */
export function isElevenLabsVoiceId(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9]{20}$/.test(value.trim());
}
