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

/** Inline Solfeggio is allowed only while the modal is open, audio is enabled,
 * and no voice is loading or playing. */
export function shouldPlayInlineSolfeggio(input: {
  isOpen: boolean;
  enabled: boolean;
  audioEnabled?: boolean;
  voiceLoading: boolean;
  voicePlaying: boolean;
}): boolean {
  return input.isOpen && input.enabled && input.audioEnabled !== false &&
    !input.voiceLoading && !input.voicePlaying;
}


/**
 * During a neural voice preview, block only Solfeggio choices. Non-tonal
 * ambience (forest, rain, waves) and silence remain available to the listener.
 */
export function shouldBlockTrackDuringNeuralVoicePreview(
  requiresNeuralVoice: boolean,
  isPreviewActive: boolean,
  trackId: string
): boolean {
  return requiresNeuralVoice && isPreviewActive && isSolfeggioFrequency(trackId);
}

export function shouldPlayProtocolSessionBackground(
  sessionPhase: ProtocolSessionPhase,
  bgMusicType: string
): boolean {
  const type = bgMusicType.trim().toLowerCase();
  return sessionPhase === 'playing' && type !== 'none' && !isSolfeggioFrequency(type);
}
