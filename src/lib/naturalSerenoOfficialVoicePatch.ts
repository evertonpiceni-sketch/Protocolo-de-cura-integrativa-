import { audioEngine, OFFICIAL_PROTOCOL_VOICE_ID } from './audio';

/**
 * Natural Sereno — voice integrity guard.
 *
 * A legacy UI path can still send the old `Rachel` alias. The server resolves
 * that alias to a different premade voice, which violates the approved
 * protocol narration. Normalize only that stale Natural Sereno alias at the
 * audio boundary; explicit male/custom voice choices remain untouched.
 */
const engine = audioEngine as typeof audioEngine & {
  __naturalSerenoOfficialVoicePatched?: boolean;
};

if (!engine.__naturalSerenoOfficialVoicePatched) {
  const originalPlayProtocolStageStream = engine.playProtocolStageStream.bind(engine);

  engine.playProtocolStageStream = ((options: Parameters<typeof engine.playProtocolStageStream>[0]) => {
    const isNaturalSereno = typeof document !== 'undefined' &&
      document.documentElement.dataset.layout === 'natural-sereno';

    const normalizedOptions = isNaturalSereno && options?.voiceId === 'Rachel'
      ? { ...options, voiceId: OFFICIAL_PROTOCOL_VOICE_ID }
      : options;

    return originalPlayProtocolStageStream(normalizedOptions);
  }) as typeof engine.playProtocolStageStream;

  engine.__naturalSerenoOfficialVoicePatched = true;
}
