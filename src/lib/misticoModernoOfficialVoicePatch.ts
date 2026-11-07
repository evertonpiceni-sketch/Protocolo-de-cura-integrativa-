import { MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS } from '../config/voiceAliases';
import { audioEngine } from './audio';

type PatchedAudioEngine = typeof audioEngine & { __misticoModernoOfficialVoicePatched?: boolean };
const engine = audioEngine as PatchedAudioEngine;
const isMisticoModernoActive = () => typeof document !== 'undefined'
  && document.documentElement.dataset.layout === 'mistico-moderno';

if (typeof window !== 'undefined' && !engine.__misticoModernoOfficialVoicePatched) {
  engine.__misticoModernoOfficialVoicePatched = true;

  const originalSpeak = engine.speakWithElevenLabsOrFallback.bind(engine);
  engine.speakWithElevenLabsOrFallback = ((...args: Parameters<typeof engine.speakWithElevenLabsOrFallback>) => {
    if (!isMisticoModernoActive()) return originalSpeak(...args);
    const [text, volume, onStart, onEnd, onPause, onResume, options] = args;
    return originalSpeak(text, volume, onStart, onEnd, onPause, onResume, {
      ...options,
      voiceId: MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS,
      preferElevenLabs: true,
      fallbackToSpeechSynthesis: false
    });
  }) as typeof engine.speakWithElevenLabsOrFallback;

  const originalGuided = engine.playGuidedMeditation.bind(engine);
  engine.playGuidedMeditation = ((...args: Parameters<typeof engine.playGuidedMeditation>) => {
    if (!isMisticoModernoActive()) return originalGuided(...args);
    const [parts, options] = args;
    return originalGuided(parts, {
      ...options,
      voiceId: MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS,
      requireExplicitVoiceId: false
    });
  }) as typeof engine.playGuidedMeditation;

  const originalStage = engine.playProtocolStageStream.bind(engine);
  engine.playProtocolStageStream = ((...args: Parameters<typeof engine.playProtocolStageStream>) => {
    if (!isMisticoModernoActive()) return originalStage(...args);
    const [options] = args;
    return originalStage({
      ...options,
      voiceId: MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS
    });
  }) as typeof engine.playProtocolStageStream;
}
