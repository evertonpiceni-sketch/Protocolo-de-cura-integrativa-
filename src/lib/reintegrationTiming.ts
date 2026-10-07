import type { GuidedCue } from '../data/reintegrationJourneyPublic';

export function isReintegrationAbsorption(seconds: number): boolean {
  return seconds >= 1260 && seconds < 1620;
}

/** Select the current passage after seeking or returning to the page, rather
 * than replaying a backlog of passages from an earlier part of the music. */
export function currentReintegrationCue(cues: GuidedCue[], seconds: number, lastPlayed: number): number {
  if (!Number.isFinite(seconds) || seconds < 0 || seconds >= 1797 || isReintegrationAbsorption(seconds)) return -1;
  const index = cues.reduce((latest, cue, current) => cue.at <= seconds + .5 ? current : latest, -1);
  return index > lastPlayed ? index : -1;
}
