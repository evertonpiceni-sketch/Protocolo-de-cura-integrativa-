import { audioEngine, OFFICIAL_PROTOCOL_VOICE_ID } from './audio';

/**
 * Místico Moderno — voice integrity guard.
 *
 * Some legacy UI/API paths can still send the old `Rachel` alias. The server
 * resolves that alias to a different premade voice, which can reintroduce the
 * robotic/legacy narration. Normalize only that stale alias while Místico
 * Moderno is active; explicit male/custom voice choices remain untouched.
 */
const engine = audioEngine as typeof audioEngine & {
  __misticoModernoOfficialVoicePatched?: boolean;
};

const normalizeLegacyVoiceId = (voiceId?: string) =>
  typeof document !== 'undefined' &&
  document.documentElement.dataset.layout === 'mistico-moderno' &&
  voiceId === 'Rachel' ? OFFICIAL_PROTOCOL_VOICE_ID : voiceId;

if (!engine.__misticoModernoOfficialVoicePatched) {
  const originalPlayProtocolStageStream = engine.playProtocolStageStream.bind(engine);
  const originalPlayGuidedMeditation = engine.playGuidedMeditation.bind(engine);
  const originalSpeakWithElevenLabsOrFallback = engine.speakWithElevenLabsOrFallback.bind(engine);

  engine.playProtocolStageStream = ((options: Parameters<typeof engine.playProtocolStageStream>[0]) => {
    const voiceId = normalizeLegacyVoiceId(options?.voiceId);
    return originalPlayProtocolStageStream(voiceId !== options?.voiceId ? { ...options, voiceId } : options);
  }) as typeof engine.playProtocolStageStream;

  engine.playGuidedMeditation = ((parts: Parameters<typeof engine.playGuidedMeditation>[0], options: Parameters<typeof engine.playGuidedMeditation>[1]) => {
    const voiceId = normalizeLegacyVoiceId(options?.voiceId);
    return originalPlayGuidedMeditation(parts, voiceId !== options?.voiceId ? { ...options, voiceId } : options);
  }) as typeof engine.playGuidedMeditation;

  engine.speakWithElevenLabsOrFallback = ((
    text: Parameters<typeof engine.speakWithElevenLabsOrFallback>[0],
    voiceVolume: Parameters<typeof engine.speakWithElevenLabsOrFallback>[1],
    onStart: Parameters<typeof engine.speakWithElevenLabsOrFallback>[2],
    onEnd: Parameters<typeof engine.speakWithElevenLabsOrFallback>[3],
    onPause?: Parameters<typeof engine.speakWithElevenLabsOrFallback>[4],
    onResume?: Parameters<typeof engine.speakWithElevenLabsOrFallback>[5],
    options?: Parameters<typeof engine.speakWithElevenLabsOrFallback>[6]
  ) => {
    const voiceId = normalizeLegacyVoiceId(options?.voiceId);
    return originalSpeakWithElevenLabsOrFallback(text, voiceVolume, onStart, onEnd, onPause, onResume,
      voiceId !== options?.voiceId ? { ...options, voiceId, preferElevenLabs: true } : options);
  }) as typeof engine.speakWithElevenLabsOrFallback;

  engine.__misticoModernoOfficialVoicePatched = true;
}
