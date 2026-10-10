import { audioEngine } from './audio';
import { solfeggioTone } from './solfeggioTone';
import { normalizeSpeechElapsedTime } from '../utils/protocolPlayback';

/**
 * Compatibility layer for the current protocol player.
 *
 * - Normalizes native Web Speech elapsed time across modern seconds and legacy
 *   millisecond implementations.
 * - Ensures every UI preset explicitly labeled as xxx Hz reproduces that exact
 *   carrier frequency, regardless of whether the caller uses startBG or
 *   startSynth.
 */
const engine = audioEngine as any;
const SOLFEGGIO_PATTERN = /^(396|417|432|528|639|741|852|963)hz$/i;

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
        // MeditationSession still expects legacy ms only in its unknown-duration
        // branch. Preserve that internal contract after normalizing the browser.
        originalProgress(seconds * 1000, 0);
      }
    });
  };

  const originalStartBG = engine.startBG.bind(engine);
  const originalStopBG = engine.stopBG.bind(engine);
  const originalSetBGVolume = engine.setBGVolume.bind(engine);
  const originalGetCurrentSynthType = engine.getCurrentSynthType.bind(engine);
  const originalIsBackgroundActive = engine.isBackgroundActive.bind(engine);
  const originalStartSynth = engine.startSynth.bind(engine);
  const originalStopSynth = engine.stopSynth.bind(engine);

  let exactBackgroundType: string | null = null;
  let backgroundVolume = 0.5;

  const exactVolume = () => Math.max(0, Math.min(0.08, backgroundVolume * 0.07));

  engine.setBGVolume = (volume: number) => {
    backgroundVolume = Math.max(0, Math.min(1, Number.isFinite(volume) ? volume : 0.5));
    originalSetBGVolume(backgroundVolume);
    if (exactBackgroundType) solfeggioTone.setVolume(exactVolume());
  };

  engine.startBG = (type: any) => {
    const match = typeof type === 'string' ? type.match(SOLFEGGIO_PATTERN) : null;
    if (match) {
      if (exactBackgroundType === type && solfeggioTone.getFrequency() === Number(match[1])) return;
      originalStopBG();
      exactBackgroundType = type.toLowerCase();
      solfeggioTone.start(Number(match[1]), exactVolume());
      return;
    }

    exactBackgroundType = null;
    solfeggioTone.stop();
    return originalStartBG(type);
  };

  engine.stopBG = () => {
    exactBackgroundType = null;
    solfeggioTone.stop();
    return originalStopBG();
  };

  engine.getCurrentSynthType = () => exactBackgroundType || originalGetCurrentSynthType();
  engine.isBackgroundActive = () => Boolean(exactBackgroundType) || originalIsBackgroundActive();

  engine.startSynth = (type: any) => {
    const match = typeof type === 'string' ? type.match(SOLFEGGIO_PATTERN) : null;
    if (match) return engine.startBG(type);
    exactBackgroundType = null;
    solfeggioTone.stop();
    return originalStartSynth(type);
  };

  engine.stopSynth = () => {
    if (exactBackgroundType) return engine.stopBG();
    solfeggioTone.stop();
    return originalStopSynth();
  };
}
