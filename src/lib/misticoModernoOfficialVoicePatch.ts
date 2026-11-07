import { audioEngine } from './audio';
import { isElevenLabsVoiceId } from './voiceSelection';

/**
 * Místico Moderno — integridade da voz escolhida.
 * Usa exclusivamente o ID ElevenLabs salvo no perfil. Não substitui a escolha
 * por Rachel, Marcus, Marianne ou pela voz nativa do navegador.
 */
const engine = audioEngine as typeof audioEngine & {
  __misticoModernoVoiceSelectionGuarded?: boolean;
};

const isMisticoModerno = () =>
  typeof document !== 'undefined' &&
  document.documentElement.dataset.layout === 'mistico-moderno';

const voiceSelectionError = () =>
  new Error('Escolha uma voz neural do catálogo ElevenLabs em Ajustes de áudio para iniciar a narração do Místico Moderno.');

if (!engine.__misticoModernoVoiceSelectionGuarded) {
  const originalPlayProtocolStageStream = engine.playProtocolStageStream.bind(engine);
  const originalPlayGuidedMeditation = engine.playGuidedMeditation.bind(engine);
  const originalSpeakWithElevenLabsOrFallback = engine.speakWithElevenLabsOrFallback.bind(engine);

  engine.playProtocolStageStream = ((options: Parameters<typeof engine.playProtocolStageStream>[0]) => {
    if (isMisticoModerno() && !isElevenLabsVoiceId(options?.voiceId)) {
      options?.onError?.(voiceSelectionError());
      return Promise.resolve(null);
    }
    return originalPlayProtocolStageStream(options);
  }) as typeof engine.playProtocolStageStream;

  engine.playGuidedMeditation = ((
    parts: Parameters<typeof engine.playGuidedMeditation>[0],
    options: Parameters<typeof engine.playGuidedMeditation>[1]
  ) => {
    if (isMisticoModerno() && !isElevenLabsVoiceId(options?.voiceId)) {
      options?.onError?.();
      return Promise.resolve();
    }
    return originalPlayGuidedMeditation(
      parts,
      isMisticoModerno() ? { ...options, requireExplicitVoiceId: true } : options
    );
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
    if (isMisticoModerno()) {
      if (!isElevenLabsVoiceId(options?.voiceId)) {
        options?.onError?.(voiceSelectionError());
        return Promise.resolve();
      }
      return originalSpeakWithElevenLabsOrFallback(
        text, voiceVolume, onStart, onEnd, onPause, onResume,
        { ...(options ?? {}), preferElevenLabs: true, fallbackToSpeechSynthesis: false }
      );
    }
    return originalSpeakWithElevenLabsOrFallback(text, voiceVolume, onStart, onEnd, onPause, onResume, options);
  }) as typeof engine.speakWithElevenLabsOrFallback;

  engine.__misticoModernoVoiceSelectionGuarded = true;
}
