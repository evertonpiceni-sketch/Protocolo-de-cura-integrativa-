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

if (!engine.__misticoModernoOfficialVoicePatched) {
  const originalPlayProtocolStageStream = engine.playProtocolStageStream.bind(engine);

  engine.playProtocolStageStream = ((options: Parameters<typeof engine.playProtocolStageStream>[0]) => {
    const isMisticoModerno = typeof document !== 'undefined' &&
      document.documentElement.dataset.layout === 'mistico-moderno';

    const normalizedOptions = isMisticoModerno && options?.voiceId === 'Rachel'
      ? { ...options, voiceId: OFFICIAL_PROTOCOL_VOICE_ID }
      : options;

    return originalPlayProtocolStageStream(normalizedOptions);
  }) as typeof engine.playProtocolStageStream;

  engine.__misticoModernoOfficialVoicePatched = true;
}
