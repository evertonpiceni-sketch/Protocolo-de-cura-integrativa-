export const requestWakeLock = async () => {
  try {
    if (typeof navigator !== 'undefined' && navigator && 'wakeLock' in navigator) {
      return await (navigator as any).wakeLock.request('screen');
    }
  } catch (err) {
    console.warn('Wake Lock error:', err);
  }
  return null;
};
