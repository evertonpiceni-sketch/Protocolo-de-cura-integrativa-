export type ProtocolBreathPhase = 'inhale' | 'hold' | 'exhale';

/**
 * HTMLMediaElement reports currentTime/duration in seconds.
 * The audio engine normalizes native speech events to seconds before emitting progress.
 * The native fallback reports duration=0, which lets us distinguish the source
 * without inventing a total duration.
 */
export function normalizeProtocolProgress(current: number, duration: number): { current: number; duration: number } {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const rawCurrent = Number.isFinite(current) && current >= 0 ? current : 0;
  const safeCurrent = rawCurrent;
  return {
    current: Number.isFinite(safeCurrent) && safeCurrent >= 0 ? safeCurrent : 0,
    duration: safeDuration
  };
}

/** Canonical visual breathing cadence: inhale 4s, hold 3s, exhale 5s. */
export function protocolBreathPhaseAt(seconds: number): ProtocolBreathPhase {
  const safeSeconds = Number.isFinite(seconds) && seconds >= 0 ? seconds : 0;
  const position = safeSeconds % 12;
  if (position < 4) return 'inhale';
  if (position < 7) return 'hold';
  return 'exhale';
}

export function protocolBreathTransitionSeconds(phase: ProtocolBreathPhase): number {
  if (phase === 'inhale') return 4;
  if (phase === 'hold') return 3;
  return 5;
}
