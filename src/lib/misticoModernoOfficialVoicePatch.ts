import { audioEngine, OFFICIAL_PROTOCOL_VOICE_ID } from './audio';
import { isElevenLabsVoiceId } from './voiceSelection';

/**
 * Místico Moderno — voice integrity guard.
 * Preserve a valid saved ElevenLabs choice; resolve missing or legacy device
 * aliases to the approved Marianne — Meditação voice. Never fall back to the
 * browser's synthetic voice while this layout is active.
 */
const engine = audioEngine as typeof audioEngine & {
  __misticoModernoOfficialVoicePatched?: boolean;
};

const isMisticoModernoActive = () =>
  typeof document !== 'undefined' &&
  document.documentElement.dataset.layout === 'mistico-moderno';

const normalizeLegacyVoiceId = (voiceId?: string) => {
  if (!isMisticoModernoActive()) return voiceId;
  return isElevenLabsVoiceId(voiceId) ? voiceId : OFFICIAL_PROTOCOL_VOICE_ID;
};

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
    return originalPlayGuidedMeditation(parts, isMisticoModernoActive()
      ? { ...options, voiceId, requireExplicitVoiceId: true }
      : voiceId !== options?.voiceId ? { ...options, voiceId } : options);
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
      isMisticoModernoActive()
        ? { ...options, voiceId, preferElevenLabs: true, fallbackToSpeechSynthesis: false }
        : voiceId !== options?.voiceId ? { ...options, voiceId } : options);
  }) as typeof engine.speakWithElevenLabsOrFallback;

  engine.__misticoModernoOfficialVoicePatched = true;
}
