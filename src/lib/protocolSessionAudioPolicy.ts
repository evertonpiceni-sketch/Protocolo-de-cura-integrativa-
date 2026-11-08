const SOLFEGGIO_FREQUENCY_PATTERN = /^(396|417|432|528|639|741|852|963)hz$/i;

export type ProtocolSessionPhase =
  | 'portal'
  | 'checkin_before'
  | 'playing'
  | 'checkin_after'
  | 'completed';

/**
 * During spoken protocol playback and neural voice previews, Solfeggio belongs
 * to the global listening state and must stay stopped. Non-tonal ambience may continue.
 */
export function isSolfeggioFrequency(bgMusicType: string): boolean {
  return SOLFEGGIO_FREQUENCY_PATTERN.test(bgMusicType.trim());
}

export function shouldPlayProtocolSessionBackground(
  sessionPhase: ProtocolSessionPhase,
  bgMusicType: string
): boolean {
  const type = bgMusicType.trim().toLowerCase();
  return sessionPhase === 'playing' && type !== 'none' && !isSolfeggioFrequency(type);
}
