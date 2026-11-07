import { audioEngine, OFFICIAL_PROTOCOL_VOICE_ID } from './audio';

/**
 * Místico Moderno — proteção da voz aprovada.
 * A narração oficial é Marianne — Meditação (ElevenLabs). O Estilo 4 nunca
 * troca para Rachel, Marcus ou SpeechSynthesis quando a voz neural falha.
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
  const originalPreviewVoice = engine.previewVoice.bind(engine);

  engine.playProtocolStageStream = ((options: Parameters<typeof engine.playProtocolStageStream>[0]) => {
    if (!isMisticoModernoActive()) return originalPlayProtocolStageStream(options);
    return originalPlayProtocolStageStream({ ...options, voiceId: OFFICIAL_PROTOCOL_VOICE_ID });
  }) as typeof engine.playProtocolStageStream;

  engine.playGuidedMeditation = ((
    parts: Parameters<typeof engine.playGuidedMeditation>[0],
    options: Parameters<typeof engine.playGuidedMeditation>[1]
  ) => {
    if (!isMisticoModernoActive()) return originalPlayGuidedMeditation(parts, options);
    return originalPlayGuidedMeditation(parts, {
      ...options,
      voiceId: OFFICIAL_PROTOCOL_VOICE_ID,
      requireExplicitVoiceId: true
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
    if (!isMisticoModernoActive()) {
      return originalSpeakWithElevenLabsOrFallback(text, voiceVolume, onStart, onEnd, onPause, onResume, options);
    }
    return originalSpeakWithElevenLabsOrFallback(text, voiceVolume, onStart, onEnd, onPause, onResume, {
      ...options,
      voiceId: OFFICIAL_PROTOCOL_VOICE_ID,
      preferElevenLabs: true,
      fallbackToSpeechSynthesis: false
    });
  }) as typeof engine.speakWithElevenLabsOrFallback;

  engine.previewVoice = ((options?: Parameters<typeof engine.previewVoice>[0]) => {
    if (!isMisticoModernoActive()) return originalPreviewVoice(options);
    void originalSpeakWithElevenLabsOrFallback(
      options?.text || 'Respire profundamente. Sinta a paz e a presença deste momento.',
      options?.volume ?? 0.9,
      () => {},
      () => options?.onEnd?.(),
      undefined,
      undefined,
      {
        voiceId: OFFICIAL_PROTOCOL_VOICE_ID,
        preferElevenLabs: true,
        fallbackToSpeechSynthesis: false,
        rate: options?.rate,
        pitch: options?.pitch,
        lang: 'pt-BR'
      }
    );
  }) as typeof engine.previewVoice;

  engine.__misticoModernoOfficialVoicePatched = true;
}
