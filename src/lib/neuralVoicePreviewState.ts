let neuralVoicePreviewActive = false;

/**
 * Shared ownership flag for short neural-voice previews.
 * The audio integrity patch uses it to reject Solfeggio starts while speech is active.
 */
export function setNeuralVoicePreviewActive(active: boolean): void {
  neuralVoicePreviewActive = active;
}

export function isNeuralVoicePreviewActive(): boolean {
  return neuralVoicePreviewActive;
}
