import { audioEngine } from './audio';

/**
 * Arcanjo/Solfeggio owns the audio surface while its full-screen protocol is mounted.
 * This guard prevents the app-level background player (including gesture unlock)
 * from restarting underneath the protocol until App.tsx can carry the same ownership
 * rule directly. It is intentionally narrow and does not alter narration/synth audio.
 */
const ARCANJO_VIEW_MARKER = 'img[alt="Pessoa em meditação com os sete chakras"]';

const isArcanjoViewMounted = () =>
  typeof document !== 'undefined' && Boolean(document.querySelector(ARCANJO_VIEW_MARKER));

const originalStartBG = audioEngine.startBG.bind(audioEngine);
audioEngine.startBG = ((type: Parameters<typeof audioEngine.startBG>[0]) => {
  if (isArcanjoViewMounted()) {
    audioEngine.stopBG();
    return;
  }
  return originalStartBG(type);
}) as typeof audioEngine.startBG;

if (typeof document !== 'undefined' && typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(() => {
    if (isArcanjoViewMounted()) audioEngine.stopBG();
  });

  const startObserving = () => {
    if (!document.body) return;
    observer.observe(document.body, { childList: true, subtree: true });
    if (isArcanjoViewMounted()) audioEngine.stopBG();
  };

  if (document.body) startObserving();
  else document.addEventListener('DOMContentLoaded', startObserving, { once: true });
}
