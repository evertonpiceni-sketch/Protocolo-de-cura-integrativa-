import { audioEngine, OFFICIAL_PROTOCOL_VOICE_ID } from './audio';

/**
 * Elegância Profunda — integrity guard for the approved narration.
 * This layout always uses Marianne — Meditação (ElevenLabs) and never
 * silently substitutes a browser-installed Web Speech voice.
 */
const engine = audioEngine as typeof audioEngine & {
  __eleganciaProfundaOfficialVoicePatched?: boolean;
};

const isEleganciaProfunda = () =>
  typeof document !== 'undefined' &&
  document.documentElement.dataset.layout === 'elegancia-profunda';

if (!engine.__eleganciaProfundaOfficialVoicePatched) {
  const originalPlayProtocolStageStream = engine.playProtocolStageStream.bind(engine);
  const originalPlayGuidedMeditation = engine.playGuidedMeditation.bind(engine);
  const originalSpeakWithElevenLabsOrFallback = engine.speakWithElevenLabsOrFallback.bind(engine);

  engine.playProtocolStageStream = ((options: Parameters<typeof engine.playProtocolStageStream>[0]) => {
    if (!isEleganciaProfunda()) return originalPlayProtocolStageStream(options);
    return originalPlayProtocolStageStream({
      ...options,
      voiceId: OFFICIAL_PROTOCOL_VOICE_ID
    });
  }) as typeof engine.playProtocolStageStream;

  engine.playGuidedMeditation = ((
    parts: Parameters<typeof engine.playGuidedMeditation>[0],
    options: Parameters<typeof engine.playGuidedMeditation>[1]
  ) => {
    if (!isEleganciaProfunda()) return originalPlayGuidedMeditation(parts, options);
    return originalPlayGuidedMeditation(parts, {
      ...options,
      voiceId: OFFICIAL_PROTOCOL_VOICE_ID
    });
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
    if (!isEleganciaProfunda()) {
      return originalSpeakWithElevenLabsOrFallback(
        text, voiceVolume, onStart, onEnd, onPause, onResume, options
      );
    }

    return originalSpeakWithElevenLabsOrFallback(
      text,
      voiceVolume,
      onStart,
      onEnd,
      onPause,
      onResume,
      {
        ...(options || {}),
        voiceId: OFFICIAL_PROTOCOL_VOICE_ID,
        preferElevenLabs: true,
        allowNativeFallback: false
      }
    );
  }) as typeof engine.speakWithElevenLabsOrFallback;

  engine.__eleganciaProfundaOfficialVoicePatched = true;
}
