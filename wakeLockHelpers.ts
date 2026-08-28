export const requestWakeLock = async () => {
  try {
    if ('wakeLock' in navigator) {
      return await navigator.wakeLock.request('screen');
    }
  } catch (err) {
    console.warn('Wake Lock error:', err);
  }
  return null;
};
