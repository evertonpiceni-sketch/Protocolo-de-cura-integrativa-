import { audioEngine } from './audio';

/**
 * Arcanjo/Solfeggio owns the audio surface while its full-screen protocol is mounted.
 * This guard prevents the app-level background player (including gesture unlock)
 * from restarting underneath the protocol. Only global ambience is blocked;
 * the protocol's seven approved Solfeggio tones remain available through startSynth.
 */
const ARCANJO_VIEW_MARKER = 'img[alt="Pessoa em meditação com os sete chakras"]';
const DASHBOARD_MARKER = '#progress-dashboard';
const ARCANJO_OPENING_GUARD_MS = 5000;
const ARCANJO_SOLFEGGIO_TYPES = new Set(['396hz', '417hz', '528hz', '639hz', '741hz', '852hz', '963hz']);
let arcanjoWasMounted = false;
let arcanjoOpening = false;
let openingGuardTimer: number | null = null;

const isArcanjoViewMounted = () => {
  if (typeof document === 'undefined') return false;
  return Array.from(document.querySelectorAll(ARCANJO_VIEW_MARKER)).some(
    marker => !marker.closest(DASHBOARD_MARKER)
  );
};

const arcanjoOwnsAudio = () => arcanjoOpening || isArcanjoViewMounted();

const originalStartBG = audioEngine.startBG.bind(audioEngine);
audioEngine.startBG = ((type: Parameters<typeof audioEngine.startBG>[0]) => {
  if (arcanjoOwnsAudio() && !ARCANJO_SOLFEGGIO_TYPES.has(type)) return;
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
      if (isArcanjoViewMounted()) audioEngine.stopBG();
    }, ARCANJO_OPENING_GUARD_MS);
  });
}

if (typeof document !== 'undefined' && typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(() => {
    const mounted = isArcanjoViewMounted();
    if (!mounted) {
      arcanjoWasMounted = false;
      return;
    }
    // Stop global ambience once on entry. Repeated React mutations must not
    // stop the protocol-owned Solfeggio oscillator while the player is running.
    if (!arcanjoWasMounted) {
      arcanjoWasMounted = true;
      releaseOpeningGuard();
      audioEngine.stopBG();
    }
  });

  const startObserving = () => {
    if (!document.body) return;
    observer.observe(document.body, { childList: true, subtree: true });
    if (isArcanjoViewMounted()) audioEngine.stopBG();
  };

  if (document.body) startObserving();
  else document.addEventListener('DOMContentLoaded', startObserving, { once: true });
}
