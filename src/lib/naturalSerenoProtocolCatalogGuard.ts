const APPROVED_PUBLIC_PROTOCOL_IDS = new Set(['transformacao', 'reintegracao-vida']);

function textOf(element: Element | null) {
  return (element?.textContent || '').replace(/\s+/g, ' ').trim();
}

function guardNaturalSerenoProtocolCatalog() {
  const root = document.querySelector<HTMLElement>('.ns-app');
  if (!root) return;

  for (const button of Array.from(root.querySelectorAll<HTMLButtonElement>('button'))) {
    const protocolId = button.dataset.epProtocolId;
    if (protocolId && !APPROVED_PUBLIC_PROTOCOL_IDS.has(protocolId)) {
      button.hidden = true;
      button.setAttribute('aria-hidden', 'true');
      button.tabIndex = -1;
      continue;
    }

    const label = textOf(button);
    if (label.startsWith('Proteção e Presença') || label.includes('Jornada de São Miguel')) {
      button.hidden = true;
      button.setAttribute('aria-hidden', 'true');
      button.tabIndex = -1;
    }
  }
}

let queued = false;
function queueGuard() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    guardNaturalSerenoProtocolCatalog();
  });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const start = () => {
    queueGuard();
    new MutationObserver(queueGuard).observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}
