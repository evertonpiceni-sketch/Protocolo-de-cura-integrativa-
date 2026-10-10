export type ProtocolBreathPhase = 'inhale' | 'hold' | 'exhale';

/**
 * Modern SpeechSynthesisEvent.elapsedTime is expressed in seconds.
 * Very old implementations used milliseconds. Because our protocol chunks are
 * short, values above 10 minutes are treated as legacy milliseconds.
 */
export function normalizeSpeechElapsedTime(value: number): number {
  const raw = Number.isFinite(value) && value >= 0 ? value : 0;
  return raw > 600 ? raw / 1000 : raw;
}

/**
 * HTMLMediaElement reports currentTime/duration in seconds. Native Web Speech
 * reports duration=0, so only its elapsed value needs legacy-unit protection.
 */
export function normalizeProtocolProgress(current: number, duration: number): { current: number; duration: number } {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const rawCurrent = Number.isFinite(current) && current >= 0 ? current : 0;
  const safeCurrent = safeDuration > 0 ? rawCurrent : normalizeSpeechElapsedTime(rawCurrent);
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
