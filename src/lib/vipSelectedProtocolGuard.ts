type ServerJourneyState = {
  selectedProtocolId?: string;
  selectedJourney?: string;
  subscriptionPlan?: string;
};

const STYLE_ID = 'ep-vip-selected-protocol-guard';
let state: ServerJourneyState | null = null;
let scheduled = false;
let loading = false;

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    :root[data-layout="natural-sereno"] .ns-app[data-ep-selected-protocol="transformacao"] [data-ep-protocol-id]:not([data-ep-protocol-id="transformacao"]),
    :root[data-layout="natural-sereno"] .ns-app[data-ep-selected-protocol="reintegracao-vida"] [data-ep-protocol-id]:not([data-ep-protocol-id="reintegracao-vida"]) {
      display: none !important;
    }

    :root[data-layout="natural-sereno"] .ns-app.ep-server-vip-access.ep-server-active-journey .ns-current-day,
    :root[data-layout="natural-sereno"] .ns-app.ep-server-vip-access.ep-server-active-journey .ns-home-scene > .ns-gold {
      display: flex !important;
    }

    :root[data-layout="natural-sereno"] .ns-app.ep-server-vip-access.ep-server-active-journey .ep-home-protocol-choice {
      display: none !important;
    }

    :root[data-layout="natural-sereno"] .ns-app.ep-server-vip-access.ep-server-active-journey [data-ep-requires-active-journey="true"] {
      pointer-events: auto !important;
      opacity: 1 !important;
      cursor: pointer !important;
    }
  `;
  document.head.appendChild(style);
}

function isVipAccess(plan?: string) {
  return plan === 'teste_vip_7d' || plan === 'vip_7d' || plan === 'vip_21d' || plan === 'terapeuta_vip';
}

function hasSelectedProtocol(current: ServerJourneyState) {
  return Boolean(
    (current.selectedProtocolId === 'transformacao' || current.selectedProtocolId === 'reintegracao-vida') &&
    (current.selectedJourney === '7d' || current.selectedJourney === '21d')
  );
}

function apply() {
  ensureStyles();
  const root = document.querySelector<HTMLElement>('.ns-app');
  if (!root || !state) return;

  if (state.selectedProtocolId) root.dataset.epSelectedProtocol = state.selectedProtocolId;
  else delete root.dataset.epSelectedProtocol;

  const vip = isVipAccess(state.subscriptionPlan);
  const active = vip && hasSelectedProtocol(state);
  root.classList.toggle('ep-server-vip-access', vip);
  root.classList.toggle('ep-server-active-journey', active);

  if (active) {
    root.classList.remove('ep-home-needs-access', 'ep-home-needs-protocol');
    root.classList.add('ep-home-active-journey');
    root.querySelectorAll<HTMLElement>('[data-ep-requires-active-journey="true"]').forEach(control => {
      control.setAttribute('aria-disabled', 'false');
      if (control instanceof HTMLButtonElement) control.tabIndex = 0;
    });
  }
}

async function refresh() {
  if (loading) return;
  loading = true;
  try {
    const response = await fetch('/api/auth/me', { credentials: 'same-origin', cache: 'no-store' });
    if (!response.ok) {
      state = null;
      return;
    }
    const data = await response.json();
    const profile = data?.user?.profile || {};
    state = {
      selectedProtocolId: profile.selectedProtocolId,
      selectedJourney: profile.selectedJourney,
      subscriptionPlan: profile.subscriptionPlan,
    };
    apply();
  } catch {
    state = null;
  } finally {
    loading = false;
  }
}

function scheduleApply() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    apply();
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => void refresh(), { once: true });
  } else {
    void refresh();
  }
  new MutationObserver(scheduleApply).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('focus', () => void refresh());
  window.addEventListener('storage', () => void refresh());
}
