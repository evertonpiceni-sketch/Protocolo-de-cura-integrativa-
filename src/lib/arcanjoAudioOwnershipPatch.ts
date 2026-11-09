import { audioEngine } from './audio';

/**
 * Arcanjo/Solfeggio owns the audio surface while its full-screen protocol is mounted.
 * This guard blocks app-level/global background starts while the full-screen protocol
 * owns the audio surface. The protocol's own Solfeggio must use the explicit bypass
 * exported below; ordinary startBG calls remain blocked while the view is mounted.
 */
const ARCANJO_VIEW_MARKER = 'img[alt="Pessoa em meditação com os sete chakras"]';
const DASHBOARD_MARKER = '#progress-dashboard';
const ARCANJO_OPENING_GUARD_MS = 5000;
let arcanjoOpening = false;
let arcanjoWasMounted = false;
let openingGuardTimer: number | null = null;

const isArcanjoViewMounted = () => {
  if (typeof document === 'undefined') return false;
  return Array.from(document.querySelectorAll(ARCANJO_VIEW_MARKER)).some(
    marker => !marker.closest(DASHBOARD_MARKER)
  );
};

const arcanjoOwnsAudio = () => arcanjoOpening || isArcanjoViewMounted();

const originalStartBG = audioEngine.startBG.bind(audioEngine);

/** Explicitly starts the protocol-owned Solfeggio while the Arcanjo view is mounted. */
export const startArcanjoOwnedSolfeggio = (type: Parameters<typeof audioEngine.startBG>[0]) => {
  if (!isArcanjoViewMounted()) return;
  originalStartBG(type);
};

audioEngine.startBG = ((type: Parameters<typeof audioEngine.startBG>[0]) => {
  if (arcanjoOwnsAudio()) return;
  return originalStartBG(type);
}) as typeof audioEngine.startBG;

const releaseOpeningGuard = () => {
  arcanjoOpening = false;
  if (openingGuardTimer !== null) {
    window.clearTimeout(openingGuardTimer);
    openingGuardTimer = null;
  }
};

if (typeof window !== 'undefined') {
  // OPEN_PROTOCOL_DAY fires before React has mounted the full-screen protocol.
  // Claim ownership immediately so a gesture/autoplay effect cannot restart the
  // global background while slower devices are still mounting the protocol view.
  window.addEventListener('OPEN_PROTOCOL_DAY', () => {
    arcanjoOpening = true;
    audioEngine.stopBG();

    if (openingGuardTimer !== null) window.clearTimeout(openingGuardTimer);
    openingGuardTimer = window.setTimeout(() => {
      releaseOpeningGuard();
    }, ARCANJO_OPENING_GUARD_MS);
  });
}

if (typeof document !== 'undefined' && typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(() => {
    const mounted = isArcanjoViewMounted();
    if (mounted && !arcanjoWasMounted) {
      arcanjoWasMounted = true;
      releaseOpeningGuard();
      audioEngine.stopBG();
    } else if (!mounted && arcanjoWasMounted) {
      arcanjoWasMounted = false;
    }
  });

  const startObserving = () => {
    if (!document.body) return;
    observer.observe(document.body, { childList: true, subtree: true });
    arcanjoWasMounted = isArcanjoViewMounted();
    if (arcanjoWasMounted) audioEngine.stopBG();
  };

  if (document.body) startObserving();
  else document.addEventListener('DOMContentLoaded', startObserving, { once: true });
}
