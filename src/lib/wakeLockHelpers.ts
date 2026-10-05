export const requestWakeLock = async (): Promise<WakeLockSentinel | null> => {
  try {
    if (typeof navigator !== 'undefined' && navigator && 'wakeLock' in navigator) {
      return await navigator.wakeLock.request('screen');
    }
  } catch (err) {
    console.warn('Wake Lock error:', err);
  }
  return null;
};
