import { audioEngine } from './audio';
import { shouldBlockArcanjoBackground } from './arcanjoAudioPolicy';

/**
 * Arcanjo owns the audio surface while its full-screen protocol is mounted.
 * Block the app-level startBG path without calling stopBG on every attempted
 * restart: stopBG also stops the protocol oscillator. The protocol's own
 * seven Solfeggio tones are started independently through audioEngine.startSynth.
 */
const ARCANJO_VIEW_MARKER = 'img[alt="Pessoa em meditação com os sete chakras"]';
const DASHBOARD_MARKER = '#progress-dashboard';
const ARCANJO_OPENING_GUARD_MS = 5000;
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
  if (shouldBlockArcanjoBackground(type, arcanjoOwnsAudio())) return;
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
  // Claim ownership before React mounts the protocol so global audio cannot restart.
  window.addEventListener('OPEN_PROTOCOL_DAY', () => {
    arcanjoOpening = true;
    audioEngine.stopBG();

    if (openingGuardTimer !== null) window.clearTimeout(openingGuardTimer);
    // The observer stops global audio on mount. Do not stop it again at timeout:
    // by then the protocol-owned Solfeggio oscillator may already be playing.
    openingGuardTimer = window.setTimeout(releaseOpeningGuard, ARCANJO_OPENING_GUARD_MS);
  });
}

if (typeof document !== 'undefined' && typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(() => {
    const mounted = isArcanjoViewMounted();
    if (!mounted) {
      arcanjoWasMounted = false;
      return;
    }

    // Stop global audio once on entry. Later React mutations must not interrupt
    // the Solfeggio oscillator started by the Arcanjo player.
    if (!arcanjoWasMounted) {
      arcanjoWasMounted = true;
      releaseOpeningGuard();
      audioEngine.stopBG();
    }
  });

  const startObserving = () => {
    if (!document.body) return;
    observer.observe(document.body, { childList: true, subtree: true });
    arcanjoWasMounted = isArcanjoViewMounted();
    if (arcanjoWasMounted) {
      releaseOpeningGuard();
      audioEngine.stopBG();
    }
  };

  if (document.body) startObserving();
  else document.addEventListener('DOMContentLoaded', startObserving, { once: true });
}
