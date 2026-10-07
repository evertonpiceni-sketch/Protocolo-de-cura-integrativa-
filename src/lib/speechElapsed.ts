/** Browser speech events have historically reported either seconds or
 * milliseconds. Never allow their progress to exceed actual elapsed time. */
export function speechElapsedSeconds(reported: number, wallSeconds: number): number {
  if (!Number.isFinite(reported) || reported < 0) return 0;
  const limit = Math.max(0, wallSeconds);
  const seconds = reported > limit + 1 ? reported / 1000 : reported;
  return Math.min(seconds, limit);
}
