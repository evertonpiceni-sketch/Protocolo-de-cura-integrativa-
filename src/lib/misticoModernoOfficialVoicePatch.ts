import { audioEngine, OFFICIAL_PROTOCOL_VOICE_ID } from './audio';

/**
 * Místico Moderno — integridade da voz aprovada.
 * O ID oficial foi conferido no servidor: mJqP14JQFEK0PojR5lfV
 * (Marianne — Meditação). Nenhum alias Rachel/Marcus ou TTS do navegador
 * pode substituir essa narração quando o Estilo 4 está ativo.
 */
const engine = audioEngine as typeof audioEngine & {
  __misticoModernoOfficialVoicePatched?: boolean;
};

const isMisticoModerno = () =>
  typeof document !== 'undefined' &&
  document.documentElement.dataset.layout === 'mistico-moderno';

export const normalizeMisticoModernoVoiceId = (voiceId?: string) =>
  isMisticoModerno() ? OFFICIAL_PROTOCOL_VOICE_ID : voiceId;

if (!engine.__misticoModernoOfficialVoicePatched) {
  const originalPreviewVoice = engine.previewVoice.bind(engine);
  const originalPlayProtocolStageStream = engine.playProtocolStageStream.bind(engine);
  const originalPlayGuidedMeditation = engine.playGuidedMeditation.bind(engine);
  const originalSpeakWithElevenLabsOrFallback = engine.speakWithElevenLabsOrFallback.bind(engine);

  engine.playProtocolStageStream = ((options: Parameters<typeof engine.playProtocolStageStream>[0]) => {
    if (!isMisticoModerno()) return originalPlayProtocolStageStream(options);
    return originalPlayProtocolStageStream({ ...options, voiceId: OFFICIAL_PROTOCOL_VOICE_ID });
  }) as typeof engine.playProtocolStageStream;

  engine.playGuidedMeditation = ((parts: Parameters<typeof engine.playGuidedMeditation>[0], options: Parameters<typeof engine.playGuidedMeditation>[1]) => {
    if (!isMisticoModerno()) return originalPlayGuidedMeditation(parts, options);
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
    if (!isMisticoModerno()) {
      return originalSpeakWithElevenLabsOrFallback(text, voiceVolume, onStart, onEnd, onPause, onResume, options);
    }
    const onError = options?.onError || ((error: unknown) => {
      console.warn('Marianne — Meditação indisponível; nenhuma voz do dispositivo será usada como substituta.', error);
    });
    return originalSpeakWithElevenLabsOrFallback(text, voiceVolume, onStart, onEnd, onPause, onResume, {
      ...options,
      voiceId: OFFICIAL_PROTOCOL_VOICE_ID,
      preferElevenLabs: true,
      fallbackToSpeechSynthesis: false,
      onError
    });
  }) as typeof engine.speakWithElevenLabsOrFallback;

  engine.previewVoice = ((options?: Parameters<typeof engine.previewVoice>[0]) => {
    if (!isMisticoModerno()) return originalPreviewVoice(options);
    void engine.speakWithElevenLabsOrFallback(
      options?.text || 'Respire profundamente. Sinta a paz e a presença da cura neste momento.',
      options?.volume ?? 0.9,
      () => {},
      () => options?.onEnd?.(),
      undefined,
      undefined,
      {
        voiceId: OFFICIAL_PROTOCOL_VOICE_ID,
        rate: options?.rate,
        pitch: options?.pitch,
        lang: 'pt-BR',
        preferElevenLabs: true,
        fallbackToSpeechSynthesis: false,
        onError: (error: unknown) => {
          console.warn('Falha ao testar Marianne — Meditação; nenhuma voz do dispositivo será usada como substituta.', error);
          options?.onError?.(error);
        }
      }
    );
  }) as typeof engine.previewVoice;

  engine.__misticoModernoOfficialVoicePatched = true;
}
