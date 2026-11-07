import { audioEngine } from './audio';
import { isElevenLabsVoiceId } from './voiceSelection';

/**
 * Místico Moderno — preserva a voz neural escolhida no perfil.
 * Nenhum caminho pode substituir o ID salvo por Marianne, Rachel, Marcus
 * ou pela síntese nativa do navegador. Se o ID não for válido/estiver
 * indisponível, a reprodução para e o erro é apresentado ao usuário.
 */
const engine = audioEngine as typeof audioEngine & {
  __misticoModernoOfficialVoicePatched?: boolean;
};

const isMisticoModernoActive = () =>
  typeof document !== 'undefined' &&
  document.documentElement.dataset.layout === 'mistico-moderno';

const voiceSelectionError = () =>
  new Error('Selecione uma voz neural válida em Ajustes de áudio para o Místico Moderno.');

if (!engine.__misticoModernoOfficialVoicePatched) {
  const originalPlayProtocolStageStream = engine.playProtocolStageStream.bind(engine);
  const originalPlayGuidedMeditation = engine.playGuidedMeditation.bind(engine);
  const originalSpeakWithElevenLabsOrFallback = engine.speakWithElevenLabsOrFallback.bind(engine);

  engine.playProtocolStageStream = ((options: Parameters<typeof engine.playProtocolStageStream>[0]) => {
    if (!isMisticoModernoActive()) return originalPlayProtocolStageStream(options);
    if (!isElevenLabsVoiceId(options?.voiceId)) {
      engine.stopSpeech();
      engine.stopSynth();
      options?.onError?.(voiceSelectionError());
      return Promise.resolve(null);
    }
    return originalPlayProtocolStageStream(options);
  }) as typeof engine.playProtocolStageStream;

  engine.playGuidedMeditation = ((
    parts: Parameters<typeof engine.playGuidedMeditation>[0],
    options: Parameters<typeof engine.playGuidedMeditation>[1]
  ) => {
    if (!isMisticoModernoActive()) return originalPlayGuidedMeditation(parts, options);
    if (!isElevenLabsVoiceId(options?.voiceId)) {
      engine.stopSpeech();
      engine.stopSynth();
      options?.onError?.();
      return Promise.resolve();
    }
    return originalPlayGuidedMeditation(parts, {
      ...options,
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
    if (!isElevenLabsVoiceId(options?.voiceId)) {
      engine.stopSpeech();
      engine.stopSynth();
      options?.onError?.(voiceSelectionError());
      return Promise.resolve();
    }
    return originalSpeakWithElevenLabsOrFallback(text, voiceVolume, onStart, onEnd, onPause, onResume, {
      ...options,
      preferElevenLabs: true,
      fallbackToSpeechSynthesis: false
    });
  }) as typeof engine.speakWithElevenLabsOrFallback;

  engine.__misticoModernoOfficialVoicePatched = true;
}
