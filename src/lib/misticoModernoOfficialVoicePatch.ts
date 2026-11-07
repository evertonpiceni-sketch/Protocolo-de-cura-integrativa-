import { audioEngine, OFFICIAL_PROTOCOL_VOICE_ID } from './audio';

/**
 * Místico Moderno — identidade sonora aprovada e fixa.
 * Todos os caminhos de narração usam Marianne — Meditação; aliases legados,
 * preferências de dispositivo e fallback de SpeechSynthesis não substituem essa voz.
 */
const engine = audioEngine as typeof audioEngine & {
  __misticoModernoOfficialVoicePatched?: boolean;
};

const isMisticoModernoActive = () =>
  typeof document !== 'undefined' &&
  document.documentElement.dataset.layout === 'mistico-moderno';

const normalizeVoiceId = (voiceId?: string) =>
  isMisticoModernoActive() ? OFFICIAL_PROTOCOL_VOICE_ID : voiceId;

if (!engine.__misticoModernoOfficialVoicePatched) {
  const originalPlayProtocolStageStream = engine.playProtocolStageStream.bind(engine);
  const originalPlayGuidedMeditation = engine.playGuidedMeditation.bind(engine);
  const originalSpeakWithElevenLabsOrFallback = engine.speakWithElevenLabsOrFallback.bind(engine);

  engine.playProtocolStageStream = ((options: Parameters<typeof engine.playProtocolStageStream>[0]) => {
    const voiceId = normalizeVoiceId(options?.voiceId);
    return originalPlayProtocolStageStream(voiceId !== options?.voiceId ? { ...options, voiceId } : options);
  }) as typeof engine.playProtocolStageStream;

  engine.playGuidedMeditation = ((parts: Parameters<typeof engine.playGuidedMeditation>[0], options: Parameters<typeof engine.playGuidedMeditation>[1]) => {
    if (isMisticoModernoActive()) {
      return originalPlayGuidedMeditation(parts, {
        ...options,
        voiceId: OFFICIAL_PROTOCOL_VOICE_ID,
        requireExplicitVoiceId: true
      });
    }
    const voiceId = normalizeVoiceId(options?.voiceId);
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
    if (isMisticoModernoActive()) {
      return originalSpeakWithElevenLabsOrFallback(text, voiceVolume, onStart, onEnd, onPause, onResume, {
        ...(options || {}),
        voiceId: OFFICIAL_PROTOCOL_VOICE_ID,
        preferElevenLabs: true,
        fallbackToSpeechSynthesis: false
      });
    }
    const voiceId = normalizeVoiceId(options?.voiceId);
    return originalSpeakWithElevenLabsOrFallback(text, voiceVolume, onStart, onEnd, onPause, onResume,
      voiceId !== options?.voiceId ? { ...options, voiceId, preferElevenLabs: true } : options);
  }) as typeof engine.speakWithElevenLabsOrFallback;

  engine.__misticoModernoOfficialVoicePatched = true;
}
