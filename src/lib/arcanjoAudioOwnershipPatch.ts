import { audioEngine } from './audio';

/**
 * Arcanjo/Solfeggio owns the audio surface while its full-screen protocol is mounted.
 * This guard prevents the app-level background player (including gesture unlock)
 * from restarting underneath the protocol until App.tsx carries the same ownership
 * rule directly. It is intentionally narrow and does not alter narration/synth audio.
 */
const ARCANJO_VIEW_MARKER = 'img[alt="Pessoa em meditação com os sete chakras"]';
let arcanjoOpening = false;

const isArcanjoViewMounted = () =>
  typeof document !== 'undefined' && Boolean(document.querySelector(ARCANJO_VIEW_MARKER));

const arcanjoOwnsAudio = () => arcanjoOpening || isArcanjoViewMounted();

const originalStartBG = audioEngine.startBG.bind(audioEngine);
audioEngine.startBG = ((type: Parameters<typeof audioEngine.startBG>[0]) => {
  if (arcanjoOwnsAudio()) {
    audioEngine.stopBG();
    return;
  }
  return originalStartBG(type);
}) as typeof audioEngine.startBG;

if (typeof window !== 'undefined') {
  // OPEN_PROTOCOL_DAY fires before React has mounted the full-screen protocol.
  // Claim ownership immediately so a gesture/autoplay effect cannot restart the
  // global background in the small interval before the DOM marker exists.
  window.addEventListener('OPEN_PROTOCOL_DAY', () => {
    arcanjoOpening = true;
    audioEngine.stopBG();
    window.setTimeout(() => {
      arcanjoOpening = false;
      if (isArcanjoViewMounted()) audioEngine.stopBG();
    }, 1200);
  });
}

if (typeof document !== 'undefined' && typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(() => {
    if (isArcanjoViewMounted()) {
      arcanjoOpening = false;
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
