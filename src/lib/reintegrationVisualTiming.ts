/** Blend the approved Day 1 states using only the audio clock. */
export function reintegrationPresenceWeights(elapsedSeconds: number): number[] {
  const seconds = Number.isFinite(elapsedSeconds) ? Math.max(0, elapsedSeconds) : 0;
  const starts = [0, 240, 360, 900, 1260];
  const weights = [0, 0, 0, 0, 0];
  let phase = 0;
  for (let index = 1; index < starts.length; index++) if (seconds >= starts[index]) phase = index;
  if (phase === 0) { weights[0] = 1; return weights; }
  const progress = Math.min(1, (seconds - starts[phase]) / 45);
  // Smooth endpoints prevent visible steps when the audio clock advances.
  const blend = progress * progress * (3 - 2 * progress);
  weights[phase - 1] = 1 - blend;
  weights[phase] = blend;
  return weights;
}
