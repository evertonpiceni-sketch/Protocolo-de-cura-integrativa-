export interface EssenciaLuminosaInlineSolfeggioState {
  isOpen: boolean;
  enabled: boolean;
  audioEnabled?: boolean;
  voiceLoading: boolean;
  voicePlaying: boolean;
}

/** The inline 639 Hz track must respect the global audio switch and yield to neural narration. */
export function shouldPlayEssenciaLuminosaInlineSolfeggio(
  state: EssenciaLuminosaInlineSolfeggioState
): boolean {
  return state.isOpen &&
    state.enabled &&
    state.audioEnabled !== false &&
    !state.voiceLoading &&
    !state.voicePlaying;
}

/** Saving anamnesis must not override an explicit global mute in Essência Luminosa.
 * Other styles retain their existing post-anamnesis activation behavior.
 */
export function resolveAudioEnabledAfterAnamnesisSave(
  isEssenciaLuminosa: boolean,
  currentAudioEnabled?: boolean
): boolean {
  return isEssenciaLuminosa ? currentAudioEnabled !== false : true;
}
