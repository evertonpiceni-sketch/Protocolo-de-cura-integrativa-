export const requestWakeLock = async (): Promise<(() => void) | null> => {
  try {
    if (typeof navigator !== 'undefined' && navigator && 'wakeLock' in navigator) {
      const lock = await navigator.wakeLock.request('screen');
      return () => { void lock.release().catch(() => undefined); };
    }
  } catch (err) {
    console.warn('Wake Lock error:', err);
  }
  return null;
};
