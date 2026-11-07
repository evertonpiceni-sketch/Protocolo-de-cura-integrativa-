import { audioEngine } from './audio';

/**
 * Arcanjo/Solfeggio owns its synthesized frequency while the full-screen
 * protocol is mounted. The app-level ambient player must neither restart over
 * it nor stop it; explicit stopSynth() still releases ownership and stops it.
 */
const DASHBOARD_MARKER = '#progress-dashboard';
const ARCANJO_OPENING_GUARD_MS = 5000;
let arcanjoOpening = false;
let openingGuardTimer: number | null = null;

const isArcanjoViewMounted = () => {
  if (typeof document === 'undefined') return false;
  if (document.getElementById('arcanjo-protocol-view') || document.querySelector('[data-arcanjo-protocol="active"]')) return true;
  return Array.from(document.querySelectorAll('img[alt="Pessoa em meditação com os sete chakras"]')).some(
    marker => !marker.closest(DASHBOARD_MARKER)
  );
};

const arcanjoOwnsAudio = () => arcanjoOpening || isArcanjoViewMounted();
const isStartingSynth = () => audioEngine.isStartingSynth();
const isProtocolSynthActive = () => audioEngine.isProtocolSynthActive();
const getProtocolSynthType = () => audioEngine.getProtocolSynthType();

const originalStartBG = audioEngine.startBG.bind(audioEngine);
const originalStopBG = audioEngine.stopBG.bind(audioEngine);

audioEngine.startBG = ((type: Parameters<typeof audioEngine.startBG>[0]) => {
  const isOwnedSolfeggio = isProtocolSynthActive() && String(type) === getProtocolSynthType();
  if (arcanjoOwnsAudio() && !isStartingSynth() && !isOwnedSolfeggio) {
    // Do not stop a frequency that belongs to the mounted Arcanjo protocol.
    if (!isProtocolSynthActive()) originalStopBG();
    return;
  }
  return originalStartBG(type);
}) as typeof audioEngine.startBG;

audioEngine.stopBG = (() => {
  // App effects may request stopBG while the Arcanjo protocol is active.
  // Only stopSynth() is allowed to release and stop its owned Solfeggio tone.
  if (arcanjoOwnsAudio() && isProtocolSynthActive()) return;
  return originalStopBG();
}) as typeof audioEngine.stopBG;

const releaseOpeningGuard = () => {
  arcanjoOpening = false;
  if (openingGuardTimer !== null) {
    window.clearTimeout(openingGuardTimer);
    openingGuardTimer = null;
  }
};

if (typeof window !== 'undefined') {
  // Claim ownership before React mounts the full-screen protocol.
  window.addEventListener('OPEN_PROTOCOL_DAY', () => {
    arcanjoOpening = true;
    if (isProtocolSynthActive()) audioEngine.stopSynth();
    else originalStopBG();

    if (openingGuardTimer !== null) window.clearTimeout(openingGuardTimer);
    openingGuardTimer = window.setTimeout(() => {
      releaseOpeningGuard();
      if (isArcanjoViewMounted() && !isProtocolSynthActive()) originalStopBG();
    }, ARCANJO_OPENING_GUARD_MS);
  });
}

if (typeof document !== 'undefined' && typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(() => {
    if (isArcanjoViewMounted()) {
      releaseOpeningGuard();
      if (!isProtocolSynthActive()) originalStopBG();
    }
  });

  const startObserving = () => {
    if (!document.body) return;
    observer.observe(document.body, { childList: true, subtree: true });
    if (isArcanjoViewMounted() && !isProtocolSynthActive()) originalStopBG();
  };

  if (document.body) startObserving();
  else document.addEventListener('DOMContentLoaded', startObserving, { once: true });
}
