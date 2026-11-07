const SOLFEGGIO_FREQUENCY_PATTERN = /^(396|417|432|528|639|741|852|963)hz$/i;

export type ProtocolSessionPhase =
  | 'portal'
  | 'checkin_before'
  | 'playing'
  | 'checkin_after'
  | 'completed';

/**
 * During spoken protocol playback, Solfeggio belongs to the global listening
 * state and must stay stopped. Non-tonal ambience such as waves may continue.
 */
export function shouldPlayProtocolSessionBackground(
  sessionPhase: ProtocolSessionPhase,
  bgMusicType: string
): boolean {
  const type = bgMusicType.trim().toLowerCase();
  const isSolfeggioFrequency = SOLFEGGIO_FREQUENCY_PATTERN.test(type);
  return sessionPhase === 'playing' && type !== 'none' && !isSolfeggioFrequency;
}
