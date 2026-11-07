import { audioEngine } from './audio';
import { isNaturalSerenoVoiceId } from './voiceSelection';

/**
 * Natural Sereno — voice integrity guard.
 *
 * Legacy UI paths can still send browser SpeechSynthesis names such as
 * `Rachel` or `Marcus`. Natural Sereno must use the user's selected Maiara
 * voice only. The known Marianne default is not an approved substitute.
 * When the exact saved ElevenLabs ID is absent/invalid, fail visibly instead
 * of switching to another voice or the browser's robotic synthesis.
 *
 * Apply this guard to protocol streaming, guided meditation and Arcanjo speech.
 */
const engine = audioEngine as typeof audioEngine & {
  __naturalSerenoOfficialVoicePatched?: boolean;
};

const isNaturalSereno = () => typeof document !== 'undefined' &&
  document.documentElement.dataset.layout === 'natural-sereno';

const normalizeLegacyVoiceId = (voiceId?: string) =>
  isNaturalSereno() && !isNaturalSerenoVoiceId(voiceId) ? '' : voiceId;

if (!engine.__naturalSerenoOfficialVoicePatched) {
  const originalPlayProtocolStageStream = engine.playProtocolStageStream.bind(engine);
  const originalPlayGuidedMeditation = engine.playGuidedMeditation.bind(engine);
  const originalSpeakWithElevenLabsOrFallback = engine.speakWithElevenLabsOrFallback.bind(engine);

  engine.playProtocolStageStream = ((options: Parameters<typeof engine.playProtocolStageStream>[0]) => {
    if (isNaturalSereno() && !isNaturalSerenoVoiceId(options?.voiceId)) {
      options?.onPlaybackChange?.(false);
      options?.onError?.(new Error('A voz Maiara aprovada não está configurada. Selecione-a em Ajustes de áudio.'));
      return Promise.resolve(null);
    }
    return originalPlayProtocolStageStream(options);
  }) as typeof engine.playProtocolStageStream;

  engine.playGuidedMeditation = ((
    parts: Parameters<typeof engine.playGuidedMeditation>[0],
    options: Parameters<typeof engine.playGuidedMeditation>[1]
  ) => {
    const naturalSereno = isNaturalSereno();
    const voiceId = normalizeLegacyVoiceId(options?.voiceId);
    const normalizedOptions = naturalSereno
      ? { ...options, voiceId, requireExplicitVoiceId: true }
      : voiceId !== options?.voiceId
        ? { ...options, voiceId }
        : options;

    return originalPlayGuidedMeditation(parts, normalizedOptions);
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
    const naturalSereno = isNaturalSereno();
    const voiceId = normalizeLegacyVoiceId(options?.voiceId);
    const normalizedOptions = naturalSereno
      ? { ...(options || {}), voiceId, preferElevenLabs: true, fallbackToSpeechSynthesis: false }
      : voiceId !== options?.voiceId
        ? { ...options, voiceId, preferElevenLabs: true }
        : options;

    return originalSpeakWithElevenLabsOrFallback(
      text,
      voiceVolume,
      onStart,
      onEnd,
      onPause,
      onResume,
      normalizedOptions
    );
  }) as typeof engine.speakWithElevenLabsOrFallback;

  engine.__naturalSerenoOfficialVoicePatched = true;
}
