import { audioEngine } from './audio';

/**
 * Arcanjo/Solfeggio owns the audio surface while its full-screen protocol is mounted.
 * This guard prevents the app-level background player (including gesture unlock)
 * from restarting underneath the protocol until App.tsx carries the same ownership
 * rule directly. It is intentionally narrow and does not alter narration/synth audio.
 */
// O Estilo 3 usa a arte corporal neutra; os demais mantêm a descrição histórica.
const ARCANJO_VIEW_MARKER = 'img[alt="Pessoa em meditação com os sete chakras"], img[alt="Representação corporal neutra em meditação com sete centros de energia"]';
const DASHBOARD_MARKER = '#progress-dashboard';
const ARCANJO_OPENING_GUARD_MS = 5000;
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
  if (arcanjoOwnsAudio()) {
    audioEngine.stopBG();
    return;
  }
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
    if (isArcanjoViewMounted()) {
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
