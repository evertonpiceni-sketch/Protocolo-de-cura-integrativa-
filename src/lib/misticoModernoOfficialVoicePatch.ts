import { audioEngine } from './audio';
import { MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS } from '../config/voiceAliases';

/**
 * Místico Moderno — integridade da voz oficial.
 * O servidor resolve o alias para ELEVENLABS_VOICE_ID. Se a voz aprovada
 * não estiver configurada, a narração falha de forma explícita; nunca troca
 * silenciosamente para Rachel, Marcus, Marianne ou Web Speech do navegador.
 */
const engine = audioEngine as typeof audioEngine & {
  __misticoModernoOfficialVoicePatched?: boolean;
};

const isMisticoModerno = () =>
  typeof document !== 'undefined' &&
  document.documentElement.dataset.layout === 'mistico-moderno';

if (!engine.__misticoModernoOfficialVoicePatched) {
  const originalPlayProtocolStageStream = engine.playProtocolStageStream.bind(engine);
  const originalPlayGuidedMeditation = engine.playGuidedMeditation.bind(engine);
  const originalSpeakWithElevenLabsOrFallback = engine.speakWithElevenLabsOrFallback.bind(engine);

  engine.playProtocolStageStream = ((options: Parameters<typeof engine.playProtocolStageStream>[0]) =>
    isMisticoModerno()
      ? originalPlayProtocolStageStream({ ...options, voiceId: MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS })
      : originalPlayProtocolStageStream(options)
  ) as typeof engine.playProtocolStageStream;

  engine.playGuidedMeditation = ((parts: Parameters<typeof engine.playGuidedMeditation>[0], options: Parameters<typeof engine.playGuidedMeditation>[1]) =>
    isMisticoModerno()
      ? originalPlayGuidedMeditation(parts, {
          ...options,
          voiceId: MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS,
          requireExplicitVoiceId: false
        })
      : originalPlayGuidedMeditation(parts, options)
  ) as typeof engine.playGuidedMeditation;

  engine.speakWithElevenLabsOrFallback = ((
    text: Parameters<typeof engine.speakWithElevenLabsOrFallback>[0],
    voiceVolume: Parameters<typeof engine.speakWithElevenLabsOrFallback>[1],
    onStart: Parameters<typeof engine.speakWithElevenLabsOrFallback>[2],
    onEnd: Parameters<typeof engine.speakWithElevenLabsOrFallback>[3],
    onPause?: Parameters<typeof engine.speakWithElevenLabsOrFallback>[4],
    onResume?: Parameters<typeof engine.speakWithElevenLabsOrFallback>[5],
    options?: Parameters<typeof engine.speakWithElevenLabsOrFallback>[6]
  ) => isMisticoModerno()
    ? originalSpeakWithElevenLabsOrFallback(text, voiceVolume, onStart, onEnd, onPause, onResume, {
        ...(options ?? {}),
        voiceId: MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS,
        preferElevenLabs: true,
        fallbackToSpeechSynthesis: false
      })
    : originalSpeakWithElevenLabsOrFallback(text, voiceVolume, onStart, onEnd, onPause, onResume, options)
  ) as typeof engine.speakWithElevenLabsOrFallback;

  engine.__misticoModernoOfficialVoicePatched = true;
}
