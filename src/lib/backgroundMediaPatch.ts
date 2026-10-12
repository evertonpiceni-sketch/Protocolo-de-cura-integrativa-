declare global {
  interface Window { __epBackgroundMediaPatch?: boolean }
}

function ensureMediaDock() {
  let dock = document.getElementById('ep-background-media-dock');
  if (!dock) {
    dock = document.createElement('div');
    dock.id = 'ep-background-media-dock';
    dock.setAttribute('aria-hidden', 'true');
    Object.assign(dock.style, {
      position: 'fixed', width: '1px', height: '1px', overflow: 'hidden',
      opacity: '0.001', pointerEvents: 'none', left: '-9999px', bottom: '0'
    });
    document.body.appendChild(dock);
  }
  return dock;
}

if (typeof window !== 'undefined' && typeof document !== 'undefined' && !window.__epBackgroundMediaPatch) {
  window.__epBackgroundMediaPatch = true;
  const originalPlay = HTMLMediaElement.prototype.play;

  HTMLMediaElement.prototype.play = function(...args: Parameters<HTMLMediaElement['play']>) {
    if (this instanceof HTMLAudioElement && !this.isConnected) {
      try {
        this.preload = 'auto';
        this.setAttribute('playsinline', 'true');
        ensureMediaDock().appendChild(this);
      } catch { /* keep native playback semantics */ }
    }
    return originalPlay.apply(this, args as any);
  } as HTMLMediaElement['play'];

  // Connected HTMLAudioElements use native background playback. Do not restart
  // paused media on visibility/pagehide: it may have been paused by the person
  // or by the lock-screen controls, and leaving the app must respect that choice.
}

export {};
