import { audioEngine, OFFICIAL_PROTOCOL_VOICE_ID } from './audio';
import { isElevenLabsVoiceId } from './voiceSelection';

/**
 * Natural Sereno — voice integrity guard.
 *
 * Legacy UI paths can still send browser SpeechSynthesis names such as
 * `Rachel` or `Marcus`. Natural Sereno uses ElevenLabs as its approved base:
 * preserve valid saved ElevenLabs IDs and normalize device names/empty values
 * to the official meditation voice so the protocol never silently becomes robotic.
 *
 * Keep the normalization consistent across protocol-stage streaming, guided
 * meditation and the ElevenLabs-or-fallback path used by Arcanjo/Solfeggio.
 */
const engine = audioEngine as typeof audioEngine & {
  __naturalSerenoOfficialVoicePatched?: boolean;
};

const isNaturalSereno = () => typeof document !== 'undefined' &&
  document.documentElement.dataset.layout === 'natural-sereno';

const normalizeLegacyVoiceId = (voiceId?: string) =>
  isNaturalSereno() && !isElevenLabsVoiceId(voiceId) ? OFFICIAL_PROTOCOL_VOICE_ID : voiceId;

if (!engine.__naturalSerenoOfficialVoicePatched) {
  const originalPlayProtocolStageStream = engine.playProtocolStageStream.bind(engine);
  const originalPlayGuidedMeditation = engine.playGuidedMeditation.bind(engine);
  const originalSpeakWithElevenLabsOrFallback = engine.speakWithElevenLabsOrFallback.bind(engine);

  engine.playProtocolStageStream = ((options: Parameters<typeof engine.playProtocolStageStream>[0]) => {
    const voiceId = normalizeLegacyVoiceId(options?.voiceId);
    const normalizedOptions = voiceId !== options?.voiceId
      ? { ...options, voiceId }
      : options;

    return originalPlayProtocolStageStream(normalizedOptions);
  }) as typeof engine.playProtocolStageStream;

  engine.playGuidedMeditation = ((
    parts: Parameters<typeof engine.playGuidedMeditation>[0],
    options: Parameters<typeof engine.playGuidedMeditation>[1]
  ) => {
    const voiceId = normalizeLegacyVoiceId(options?.voiceId);
    const normalizedOptions = voiceId !== options?.voiceId
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
