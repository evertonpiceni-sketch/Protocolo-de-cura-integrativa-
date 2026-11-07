import { audioEngine, OFFICIAL_PROTOCOL_VOICE_ID } from './audio';

/**
 * Místico Moderno — voice integrity guard.
 * The approved narration is Marianne — Meditação (ElevenLabs).
 * Every audio entry point is pinned to that voice while this layout is active;
 * browser speech synthesis and legacy Rachel/Marcus aliases are never substitutes.
 */
const engine = audioEngine as typeof audioEngine & {
  __misticoModernoOfficialVoicePatched?: boolean;
};

const isMisticoModerno = () =>
  typeof document !== 'undefined' &&
  document.documentElement.dataset.layout === 'mistico-moderno';

export const normalizeMisticoModernoVoiceId = (voiceId?: string) =>
  isMisticoModerno() ? OFFICIAL_PROTOCOL_VOICE_ID : voiceId;

if (!engine.__misticoModernoOfficialVoicePatched) {
  const originalPreviewVoice = engine.previewVoice.bind(engine);
  const originalPlayProtocolStageStream = engine.playProtocolStageStream.bind(engine);
  const originalPlayGuidedMeditation = engine.playGuidedMeditation.bind(engine);
  const originalSpeakWithElevenLabsOrFallback = engine.speakWithElevenLabsOrFallback.bind(engine);

  engine.playProtocolStageStream = ((options: Parameters<typeof engine.playProtocolStageStream>[0]) => {
    const voiceId = normalizeMisticoModernoVoiceId(options?.voiceId);
    return originalPlayProtocolStageStream(voiceId !== options?.voiceId ? { ...options, voiceId } : options);
  }) as typeof engine.playProtocolStageStream;

  engine.playGuidedMeditation = ((parts: Parameters<typeof engine.playGuidedMeditation>[0], options: Parameters<typeof engine.playGuidedMeditation>[1]) => {
    const voiceId = normalizeMisticoModernoVoiceId(options?.voiceId);
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
    const voiceId = normalizeMisticoModernoVoiceId(options?.voiceId);
    if (!isMisticoModerno()) {
      return originalSpeakWithElevenLabsOrFallback(text, voiceVolume, onStart, onEnd, onPause, onResume, options);
    }
    const onError = options?.onError || ((error: unknown) => {
      console.warn('Marianne — Meditação is unavailable; no browser voice will be substituted.', error);
      if (onPause) onPause();
      else onEnd();
    });
    return originalSpeakWithElevenLabsOrFallback(text, voiceVolume, onStart, onEnd, onPause, onResume, {
      ...options,
      voiceId,
      preferElevenLabs: true,
      allowNativeFallback: false,
      onError
    });
  }) as typeof engine.speakWithElevenLabsOrFallback;

  engine.previewVoice = ((options?: Parameters<typeof engine.previewVoice>[0]) => {
    if (!isMisticoModerno()) return originalPreviewVoice(options);
    void engine.speakWithElevenLabsOrFallback(
      options?.text || 'Respire profundamente. Sinta a paz e a presença da cura neste momento.',
      options?.volume ?? 0.9,
      () => {},
      () => options?.onEnd?.(),
      undefined,
      undefined,
      {
        voiceId: OFFICIAL_PROTOCOL_VOICE_ID,
        rate: options?.rate,
        pitch: options?.pitch,
        lang: 'pt-BR',
        preferElevenLabs: true,
        allowNativeFallback: false,
        onError: (error: unknown) => {
          console.warn('Marianne — Meditação preview failed; no browser voice will be substituted.', error);
          if (options?.onError) options.onError(error);
          else options?.onEnd?.();
        }
      }
    );
  }) as typeof engine.previewVoice;

  engine.__misticoModernoOfficialVoicePatched = true;
}
