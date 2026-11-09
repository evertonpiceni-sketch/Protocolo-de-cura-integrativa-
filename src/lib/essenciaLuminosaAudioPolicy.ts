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
