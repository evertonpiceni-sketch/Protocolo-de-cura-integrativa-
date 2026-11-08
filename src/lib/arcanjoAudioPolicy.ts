/**
 * While Arcanjo owns audio, every startBG call is app-level background audio
 * and must be blocked. Its own Solfeggio oscillator uses startSynth separately.
 */
export function shouldBlockArcanjoBackground(
  _type: string,
  protocolOwnsAudio: boolean
): boolean {
  return protocolOwnsAudio;
}
