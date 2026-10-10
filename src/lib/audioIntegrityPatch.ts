import { audioEngine } from './audio';
import { solfeggioTone } from './solfeggioTone';
import { normalizeSpeechElapsedTime } from '../utils/protocolPlayback';

/**
 * Compatibility layer for the current protocol player.
 *
 * MeditationSession historically distinguishes HTMLAudio (duration > 0,
 * seconds) from native Web Speech fallback (duration = 0, legacy milliseconds).
 * Modern SpeechSynthesisEvent.elapsedTime is seconds, while older engines used
 * milliseconds. Normalize both here, then preserve the existing callback
 * contract until MeditationSession can be migrated without touching its visual
 * composition.
 *
 * Frequency presets are also intercepted here so labels such as 528 Hz play a
 * real 528 Hz sine tone instead of a subharmonic approximation.
 */
const engine = audioEngine as any;

if (!engine.__naturalSerenoAudioIntegrityPatch) {
  engine.__naturalSerenoAudioIntegrityPatch = true;

  const originalPlayProtocolStageStream = engine.playProtocolStageStream.bind(engine);
  engine.playProtocolStageStream = (options: any) => {
    const originalProgress = options?.onProgress;
    return originalPlayProtocolStageStream({
      ...options,
      onProgress: (current: number, duration: number) => {
        if (!originalProgress) return;
        if (Number.isFinite(duration) && duration > 0) {
          originalProgress(current, duration);
          return;
        }
        const seconds = normalizeSpeechElapsedTime(current);
        // MeditationSession's native-fallback branch currently expects legacy
        // milliseconds when duration is unknown; retain that contract safely.
        originalProgress(seconds * 1000, 0);
      }
    });
  };

  const originalStartSynth = engine.startSynth.bind(engine);
  const originalStopSynth = engine.stopSynth.bind(engine);

  engine.startSynth = (type: any) => {
    const match = typeof type === 'string' ? type.match(/^(396|417|432|528|639|741|852|963)hz$/i) : null;
    if (match) {
      solfeggioTone.start(Number(match[1]));
      return;
    }
    solfeggioTone.stop();
    return originalStartSynth(type);
  };

  engine.stopSynth = () => {
    solfeggioTone.stop();
    return originalStopSynth();
  };
}
