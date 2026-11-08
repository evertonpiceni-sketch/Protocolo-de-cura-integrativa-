import { audioEngine } from './audio';
import { isElevenLabsVoiceId } from './voiceSelection';

/**
 * Místico Moderno — voice integrity guard.
 * Never substitutes an unconfirmed voice ID and never falls back to browser speech.
 * The user's saved ElevenLabs voice remains authoritative; an invalid or missing ID
 * produces a recoverable error in the player/settings instead of Rachel, Marcus or Marianne.
 */
const engine = audioEngine as typeof audioEngine & {
  __misticoModernoOfficialVoicePatched?: boolean;
};

const isMisticoModernoActive = () =>
  typeof document !== 'undefined' &&
  document.documentElement.dataset.layout === 'mistico-moderno';

if (!engine.__misticoModernoOfficialVoicePatched) {
  const originalPlayProtocolStageStream = engine.playProtocolStageStream.bind(engine);
  const originalPlayGuidedMeditation = engine.playGuidedMeditation.bind(engine);
  const originalSpeakWithElevenLabsOrFallback = engine.speakWithElevenLabsOrFallback.bind(engine);

  engine.playProtocolStageStream = ((options: Parameters<typeof engine.playProtocolStageStream>[0]) => {
    if (isMisticoModernoActive() && !isElevenLabsVoiceId(options?.voiceId)) {
      options?.onPlaybackChange?.(false);
      options?.onError?.(new Error('Selecione uma voz neural válida em Ajustes de áudio.'));
      return Promise.resolve(null);
    }
    return originalPlayProtocolStageStream(options);
  }) as typeof engine.playProtocolStageStream;

  engine.playGuidedMeditation = ((
    parts: Parameters<typeof engine.playGuidedMeditation>[0],
    options: Parameters<typeof engine.playGuidedMeditation>[1]
  ) => originalPlayGuidedMeditation(
    parts,
    isMisticoModernoActive() ? { ...options, requireExplicitVoiceId: true } : options
  )) as typeof engine.playGuidedMeditation;

  engine.speakWithElevenLabsOrFallback = ((
    text: Parameters<typeof engine.speakWithElevenLabsOrFallback>[0],
    voiceVolume: Parameters<typeof engine.speakWithElevenLabsOrFallback>[1],
    onStart: Parameters<typeof engine.speakWithElevenLabsOrFallback>[2],
    onEnd: Parameters<typeof engine.speakWithElevenLabsOrFallback>[3],
    onPause?: Parameters<typeof engine.speakWithElevenLabsOrFallback>[4],
    onResume?: Parameters<typeof engine.speakWithElevenLabsOrFallback>[5],
    options?: Parameters<typeof engine.speakWithElevenLabsOrFallback>[6]
  ) => originalSpeakWithElevenLabsOrFallback(
    text,
    voiceVolume,
    onStart,
    onEnd,
    onPause,
    onResume,
    isMisticoModernoActive()
      ? { ...(options || {}), preferElevenLabs: true, fallbackToSpeechSynthesis: false }
      : options
  )) as typeof engine.speakWithElevenLabsOrFallback;

  engine.__misticoModernoOfficialVoicePatched = true;
}
