const ARCANJO_SOLFEGGIO_TYPES = new Set<string>([
  '396hz',
  '417hz',
  '528hz',
  '639hz',
  '741hz',
  '852hz',
  '963hz'
]);

/**
 * While the Arcanjo protocol owns audio, allow only its seven protocol tones.
 * Global ambience and unrelated background frequencies must remain stopped.
 */
export function shouldBlockArcanjoBackground(
  type: string,
  protocolOwnsAudio: boolean
): boolean {
  return protocolOwnsAudio && !ARCANJO_SOLFEGGIO_TYPES.has(type);
}
