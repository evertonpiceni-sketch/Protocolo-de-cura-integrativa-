import { audioEngine, OFFICIAL_PROTOCOL_VOICE_ID } from './audio';
import { isElevenLabsVoiceId } from './voiceSelection';

/**
 * Essência Luminosa — integridade da voz neural.
 *
 * Preserva qualquer ID ElevenLabs válido já escolhido pelo usuário. Somente
 * valores legados/aliases de dispositivo são normalizados para a voz oficial
 * Marianne. Enquanto este estilo estiver confirmado, nenhum fluxo de áudio
 * pode cair silenciosamente em SpeechSynthesis.
 */
const engine = audioEngine as typeof audioEngine & {
  __essenciaLuminosaOfficialVoicePatched?: boolean;
};

const isEssenciaLuminosa = () => typeof document !== 'undefined' &&
  document.documentElement.dataset.layout === 'essencia-luminosa';

const normalizeVoiceId = (voiceId?: string) =>
  isEssenciaLuminosa() && !isElevenLabsVoiceId(voiceId)
    ? OFFICIAL_PROTOCOL_VOICE_ID
    : voiceId;

if (!engine.__essenciaLuminosaOfficialVoicePatched) {
  const originalPlayProtocolStageStream = engine.playProtocolStageStream.bind(engine);
  const originalPlayGuidedMeditation = engine.playGuidedMeditation.bind(engine);
  const originalSpeakWithElevenLabsOrFallback = engine.speakWithElevenLabsOrFallback.bind(engine);

  engine.playProtocolStageStream = ((options: Parameters<typeof engine.playProtocolStageStream>[0]) => {
    const voiceId = normalizeVoiceId(options?.voiceId);
    const normalizedOptions = isEssenciaLuminosa()
      ? { ...options, voiceId }
      : voiceId !== options?.voiceId
        ? { ...options, voiceId }
        : options;

    return originalPlayProtocolStageStream(normalizedOptions);
  }) as typeof engine.playProtocolStageStream;

  engine.playGuidedMeditation = ((
    parts: Parameters<typeof engine.playGuidedMeditation>[0],
    options: Parameters<typeof engine.playGuidedMeditation>[1]
  ) => {
    const active = isEssenciaLuminosa();
    const voiceId = normalizeVoiceId(options?.voiceId);
    const normalizedOptions = active
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
    const active = isEssenciaLuminosa();
    const voiceId = normalizeVoiceId(options?.voiceId);
    const normalizedOptions = active
      ? {
          ...(options || {}),
          voiceId,
          preferElevenLabs: true,
          fallbackToSpeechSynthesis: false
        }
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

  engine.__essenciaLuminosaOfficialVoicePatched = true;
}
