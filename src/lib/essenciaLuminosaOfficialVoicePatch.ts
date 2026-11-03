import { audioEngine, OFFICIAL_PROTOCOL_VOICE_ID } from './audio';

/**
 * Essência Luminosa — voice integrity guard.
 *
 * Legacy screens can still send the stale `Rachel` alias. The approved
 * protocol narration already has a canonical voice ID at the audio boundary;
 * normalize only that legacy alias while Essência Luminosa is active.
 * Explicit male/custom choices remain untouched.
 */
const engine = audioEngine as typeof audioEngine & {
  __essenciaLuminosaOfficialVoicePatched?: boolean;
};

if (!engine.__essenciaLuminosaOfficialVoicePatched) {
  const originalPlayProtocolStageStream = engine.playProtocolStageStream.bind(engine);

  engine.playProtocolStageStream = ((options: Parameters<typeof engine.playProtocolStageStream>[0]) => {
    const isEssenciaLuminosa = typeof document !== 'undefined' &&
      document.documentElement.dataset.layout === 'essencia-luminosa';

    const normalizedOptions = isEssenciaLuminosa && options?.voiceId === 'Rachel'
      ? { ...options, voiceId: OFFICIAL_PROTOCOL_VOICE_ID }
      : options;

    return originalPlayProtocolStageStream(normalizedOptions);
  }) as typeof engine.playProtocolStageStream;

  engine.__essenciaLuminosaOfficialVoicePatched = true;
}
