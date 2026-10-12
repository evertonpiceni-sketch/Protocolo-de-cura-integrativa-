import { setStableText } from './stableDomText';

const HOME_FLOW_STYLE_ID = 'ep-natural-sereno-home-flow-state-fix';
const CURRENT_LOGIN_KEY = 'cura_integrada_logged_in_user_v1';
const ACCOUNTS_KEY = 'cura_integrada_accounts_v1';

type HomeJourneyState = {
  selectedJourney?: string;
  selectedProtocolId?: string;
  subscriptionPlan?: string;
  startedAt?: string;
  profile?: Record<string, unknown>;
  progress?: unknown[];
};

let remoteState: HomeJourneyState | null = null;
let remoteStateRequested = false;
let bypassNextProtocolClick = false;

function textOf(element: Element | null) {
  return (element?.textContent || '').replace(/\s+/g, ' ').trim();
}

function addFlowStyles() {
  if (document.getElementById(HOME_FLOW_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = HOME_FLOW_STYLE_ID;
  style.textContent = `
    :root[data-layout="natural-sereno"] .ep-home-needs-protocol .ns-current-day,
    :root[data-layout="natural-sereno"] .ep-home-needs-access .ns-current-day,
    :root[data-layout="natural-sereno"] .ep-home-needs-anamnesis .ns-current-day,
    :root[data-layout="natural-sereno"] .ep-home-needs-protocol .ns-home-scene > .ns-gold,
    :root[data-layout="natural-sereno"] .ep-home-needs-access .ns-home-scene > .ns-gold,
    :root[data-layout="natural-sereno"] .ep-home-needs-anamnesis .ns-home-scene > .ns-gold {
      display: none !important;
    }

    :root[data-layout="natural-sereno"] [data-ep-requires-active-journey="true"][aria-disabled="true"] {
      pointer-events: none !important;
      opacity: .42 !important;
      cursor: not-allowed !important;
    }

    :root[data-layout="natural-sereno"] .ns-dock [data-ep-requires-active-journey="true"][aria-disabled="true"] span::after {
      content: ' · escolha primeiro';
      display: block;
      font-size: 7px;
      line-height: 1.1;
      opacity: .82;
    }

    :root[data-layout="natural-sereno"] .ep-home-needs-protocol.ep-home-has-anamnesis .ns-home-content,
    :root[data-layout="natural-sereno"] .ep-home-needs-access.ep-home-has-anamnesis .ns-home-content,
    :root[data-layout="natural-sereno"] .ep-home-active-journey .ns-home-content {
      margin-top: -34px;
      padding-top: 0 !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-active-journey .ns-current-day {
      display: flex !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-protocol-choice {
      margin: 0 0 18px;
      padding: 24px 22px 22px;
      border-radius: 28px;
      border: 1px solid rgba(182,139,54,.28);
      background: rgba(255,250,238,.98);
      box-shadow: 0 18px 42px rgba(82,60,22,.11);
    }

    :root[data-layout="natural-sereno"] .ep-home-protocol-choice small {
      display: inline-block;
      margin-bottom: 8px;
      color: #9c7429;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .14em;
      text-transform: uppercase;
    }

    :root[data-layout="natural-sereno"] .ep-home-protocol-choice h2 {
      margin: 0 0 10px;
      color: #26372a;
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 29px;
      line-height: 1.05;
      font-weight: 500;
    }

    :root[data-layout="natural-sereno"] .ep-home-protocol-choice p {
      margin: 0 0 16px;
      color: #5f6857;
      font-size: 14px;
      line-height: 1.6;
    }

    :root[data-layout="natural-sereno"] .ep-home-protocol-options {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }

    :root[data-layout="natural-sereno"] .ep-home-protocol-choice button {
      width: 100%;
      min-height: 54px;
      border: 1px solid #073b2b;
      border-radius: 18px;
      background: #073b2b;
      color: #fff9e8;
      padding: 10px 14px;
      font-family: 'Lora', Georgia, serif;
      font-size: 14px;
      line-height: 1.25;
      box-shadow: 0 10px 24px rgba(7,59,43,.14);
    }

    :root[data-layout="natural-sereno"] .ep-home-protocol-choice button span {
      display: block;
      margin-top: 3px;
      color: #e3cd8a;
      font-family: system-ui, sans-serif;
      font-size: 9px;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    :root[data-layout="natural-sereno"] .ep-home-moment-card {
      position: relative;
    }

    :root[data-layout="natural-sereno"] .ep-home-recommended-label {
      display: block;
      margin-bottom: 7px;
      color: #9c7429;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: .13em;
      text-transform: uppercase;
    }

    :root[data-layout="natural-sereno"] .ep-home-active-journey .ep-home-continue { display: flex; }
    :root[data-layout="natural-sereno"] .ep-home-needs-protocol .ep-home-continue,
    :root[data-layout="natural-sereno"] .ep-home-needs-access .ep-home-continue,
    :root[data-layout="natural-sereno"] .ep-home-needs-anamnesis .ep-home-continue { display: none !important; }
  `;
  document.head.appendChild(style);
}

function readLocalAccount(): any | null {
  try {
    const login = localStorage.getItem(CURRENT_LOGIN_KEY);
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!login || !raw) return null;
    const accounts = JSON.parse(raw);
    if (!Array.isArray(accounts)) return null;
    return accounts.find((item: any) => item?.login === login || item?.profile?.login === login) || null;
  } catch {
    return null;
  }
}

function readLocalState(): HomeJourneyState {
  const account = readLocalAccount();
  return {
    selectedJourney: account?.profile?.selectedJourney,
    selectedProtocolId: account?.profile?.selectedProtocolId,
    subscriptionPlan: account?.profile?.subscriptionPlan,
    startedAt: account?.profile?.startedAt,
    profile: account?.profile,
    progress: account?.progress,
  };
}

function requestRemoteState(force = false) {
  if (remoteStateRequested && !force) return;
  remoteStateRequested = true;
  fetch('/api/auth/me', { credentials: 'same-origin' })
    .then(response => response.ok ? response.json() : null)
    .then(data => {
      const profile = data?.user?.profile;
      if (profile) {
        remoteState = {
          selectedJourney: profile.selectedJourney,
          selectedProtocolId: profile.selectedProtocolId,
          subscriptionPlan: profile.subscriptionPlan,
          startedAt: profile.startedAt,
          profile,
          progress: data?.user?.progress || [],
        };
        queueApply();
      }
    })
    .catch(() => undefined);
}

function getJourneyState(): HomeJourneyState {
  return remoteState || readLocalState();
}

function hasExplicitJourney(state: HomeJourneyState) {
  const validDuration = state.selectedJourney === '7d' || state.selectedJourney === '21d';
  return Boolean(state.selectedProtocolId && validDuration);
}

function hasCommercialAccess(state: HomeJourneyState) {
  if (!state.subscriptionPlan) return false;
  return state.subscriptionPlan !== 'teste_vip_7d';
}

function isWithinFreeDay(state: HomeJourneyState) {
  if (!state.startedAt) return true;
  const started = new Date(state.startedAt).getTime();
  if (!Number.isFinite(started)) return true;
  return Date.now() - started < 24 * 60 * 60 * 1000;
}

function findPlanTrigger(): HTMLButtonElement | null {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('button'))
    .filter(button => !button.closest('.ep-home-protocol-choice'));
  const preferred = ['planos', 'valores', 'upgrade', 'vip'];
  for (const term of preferred) {
    const match = buttons.find(button => textOf(button).toLocaleLowerCase('pt-BR').includes(term));
    if (match) return match;
  }
  return null;
}

function updateLocalProtocol(protocolId: string, duration: '7d' | '21d') {
  try {
    const login = localStorage.getItem(CURRENT_LOGIN_KEY);
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!login || !raw) return;
    const accounts = JSON.parse(raw);
    if (!Array.isArray(accounts)) return;
    const index = accounts.findIndex((item: any) => item?.login === login || item?.profile?.login === login);
    if (index < 0) return;
    accounts[index] = {
      ...accounts[index],
      profile: {
        ...accounts[index].profile,
        selectedProtocolId: protocolId,
        selectedJourney: duration,
      },
    };
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    // Local cache is only a resilience layer; remote sync remains authoritative when available.
  }
}

async function persistProtocolChoice(protocolId: string, duration: '7d' | '21d') {
  const state = getJourneyState();
  const baseProfile = state.profile || readLocalState().profile;
  const progress = state.progress || readLocalState().progress || [];
  if (!baseProfile) {
    updateLocalProtocol(protocolId, duration);
    remoteState = { ...state, selectedProtocolId: protocolId, selectedJourney: duration };
    return;
  }

  const profile = { ...baseProfile, selectedProtocolId: protocolId, selectedJourney: duration };
  updateLocalProtocol(protocolId, duration);
  remoteState = { ...state, profile, progress, selectedProtocolId: protocolId, selectedJourney: duration };

  try {
    const response = await fetch('/api/user/sync', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, progress }),
    });
    if (!response.ok) throw new Error('Falha ao sincronizar escolha');
  } catch {
    // The local choice remains available offline and will be reconciled by the normal profile sync.
  }
}

function setGatedControls(root: HTMLElement, activeJourney: boolean) {
  for (const control of Array.from(root.querySelectorAll<HTMLElement>('[data-ep-requires-active-journey="true"]'))) {
    control.setAttribute('aria-disabled', activeJourney ? 'false' : 'true');
    if (control instanceof HTMLButtonElement) control.tabIndex = activeJourney ? 0 : -1;
  }
}

function openSelectedProtocol(protocolId: string) {
  const root = document.querySelector<HTMLElement>('.ns-app');
  const homeMenu = root?.querySelector<HTMLButtonElement>('.ns-home-menu');
  if (!homeMenu) return;
  homeMenu.click();
  window.setTimeout(() => {
    const activeRoot = document.querySelector<HTMLElement>('.ns-app');
    const button = activeRoot?.querySelector<HTMLButtonElement>(`[data-ep-protocol-id="${protocolId}"]`);
    if (!button) return;
    bypassNextProtocolClick = true;
    button.click();
  }, 0);
}

function ensureProtocolChoice(root: HTMLElement, recommendationRow: HTMLElement | undefined, state: HomeJourneyState, hasAccess: boolean) {
  const content = root.querySelector<HTMLElement>('.ns-home-content');
  if (!content) return;

  let card = content.querySelector<HTMLElement>('.ep-home-protocol-choice');
  if (!card) {
    card = document.createElement('section');
    card.className = 'ep-home-protocol-choice';
    const insight = content.querySelector<HTMLElement>('.ns-insight');
    if (recommendationRow?.nextSibling) content.insertBefore(card, recommendationRow.nextSibling);
    else if (insight) content.insertBefore(card, insight);
    else content.prepend(card);
  }

  const renderKey = hasAccess ? 'protocols' : `plans-${isWithinFreeDay(state)}`;
  if (card.dataset.renderKey === renderKey) return;
  card.dataset.renderKey = renderKey;

  if (!hasAccess) {
    const trialCopy = isWithinFreeDay(state)
      ? 'Você está no seu dia de experiência. Seu resultado já está disponível; quando quiser iniciar oficialmente uma jornada, escolha a forma de acesso que combina com você.'
      : 'Seu dia de experiência terminou. Para iniciar oficialmente uma jornada, escolha a forma de acesso que combina com você.';
    card.innerHTML = `
      <small>Seu próximo passo</small>
      <h2>Escolha quando deseja começar oficialmente.</h2>
      <p>${trialCopy}</p>
      <button type="button" data-ep-open-plans="true">Ver formas de acesso</button>
    `;
    card.querySelector<HTMLButtonElement>('[data-ep-open-plans="true"]')?.addEventListener('click', () => findPlanTrigger()?.click());
    return;
  }

  card.innerHTML = `
    <small>Seu próximo passo</small>
    <h2>Agora escolha o protocolo que deseja seguir.</h2>
    <p>Sua leitura orienta a escolha, mas a decisão continua sendo sua. As opções abaixo são protocolos que já existem no aplicativo; nenhuma jornada começa antes da sua escolha.</p>
    <div class="ep-home-protocol-options">
      <button type="button" data-ep-select-protocol="transformacao" data-ep-select-duration="21d">Protocolo da Transformação<span>21 dias</span></button>
      <button type="button" data-ep-select-protocol="reintegracao-vida" data-ep-select-duration="21d">21 Dias para Voltar para Mim<span>Reintegração da Vida · 21 dias</span></button>
    </div>
  `;

  for (const button of Array.from(card.querySelectorAll<HTMLButtonElement>('[data-ep-select-protocol]'))) {
    button.addEventListener('click', async () => {
      const protocolId = button.dataset.epSelectProtocol;
      const duration = button.dataset.epSelectDuration as '7d' | '21d' | undefined;
      if (!protocolId || !duration) return;
      button.disabled = true;
      await persistProtocolChoice(protocolId, duration);
      queueApply();
      openSelectedProtocol(protocolId);
    }, { once: true });
  }
}

function markRecommendation(row: HTMLElement | undefined) {
  if (!row) return;
  row.classList.add('ep-home-moment-card');
  if (!row.querySelector('.ep-home-recommended-label')) {
    const label = document.createElement('span');
    label.className = 'ep-home-recommended-label';
    label.textContent = 'Orientação para sua escolha';
    const copy = row.querySelector('.ns-row-copy');
    if (copy) copy.prepend(label);
  }
}

function setHeroCopy(root: HTMLElement, needsAnamnesis: boolean, needsAccess: boolean, needsProtocol: boolean, activeJourney: boolean) {
  const greeting = root.querySelector<HTMLElement>('.ns-greeting');
  if (!greeting) return;
  const paragraphs = greeting.querySelectorAll('p');
  if (paragraphs[0]) {
    setStableText(paragraphs[0], activeJourney
      ? 'Que bom ter você aqui novamente.'
      : needsProtocol
        ? 'Seu acesso está pronto.'
        : needsAccess
          ? 'Seu resultado já está pronto.'
          : 'Que bom que você está aqui novamente.');
  }
  if (paragraphs[1]) {
    setStableText(paragraphs[1], activeJourney
      ? 'Sua jornada está em andamento. Siga no seu tempo, um dia de cada vez.'
      : needsProtocol
        ? 'Agora escolha qual protocolo deseja seguir. A decisão é sua e nenhum Dia 1 começa antes dessa escolha.'
        : needsAccess
          ? 'Use seu dia de experiência para conhecer o espaço. Quando quiser iniciar oficialmente, escolha seu acesso e depois o protocolo.'
          : 'Seu primeiro dia é um espaço para experimentar, se ouvir e conhecer o cuidado antes de escolher o protocolo que deseja seguir.');
  }
}

function adjustQuickJourney(root: HTMLElement, activeJourney: boolean) {
  const button = root.querySelector<HTMLButtonElement>('[data-ep-quick="journey"]');
  if (!button) return;
  if (button.disabled !== !activeJourney) button.disabled = !activeJourney;
  const helper = button.querySelector('small');
  setStableText(helper, activeJourney ? 'Meu progresso do dia a dia' : 'Disponível após escolher acesso e protocolo');
}

function installProtocolCapture() {
  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('[data-ep-protocol-id]') : null;
    if (!target) return;
    if (bypassNextProtocolClick) {
      bypassNextProtocolClick = false;
      return;
    }

    const state = getJourneyState();
    const activeJourney = hasExplicitJourney(state);
    if (activeJourney) return;

    event.preventDefault();
    event.stopPropagation();

    if (!hasCommercialAccess(state)) {
      findPlanTrigger()?.click();
      return;
    }

    const protocolId = target.dataset.epProtocolId;
    const duration = target.dataset.epProtocolDuration as '7d' | '21d' | undefined;
    if (!protocolId || !duration) return;
    void persistProtocolChoice(protocolId, duration).then(() => {
      queueApply();
      bypassNextProtocolClick = true;
      target.click();
    });
  }, true);
}

function applyFlowState() {
  addFlowStyles();
  requestRemoteState();

  const root = document.querySelector<HTMLElement>('.ns-app[data-ns-screen="home"]');
  if (!root) return;

  const anamnesisCard = Array.from(root.querySelectorAll<HTMLElement>('.ns-editorial-card'))
    .find(card => textOf(card.querySelector('h2')).includes('Como você está de verdade'));
  const hasAnamnesis = !anamnesisCard;
  const journeyState = getJourneyState();
  const hasAccess = hasCommercialAccess(journeyState);
  const activeJourney = hasAnamnesis && hasAccess && hasExplicitJourney(journeyState);
  const needsProtocol = hasAnamnesis && hasAccess && !activeJourney;
  const needsAccess = hasAnamnesis && !hasAccess;
  const needsAnamnesis = !hasAnamnesis;

  root.classList.toggle('ep-home-needs-anamnesis', needsAnamnesis);
  root.classList.toggle('ep-home-needs-access', needsAccess);
  root.classList.toggle('ep-home-needs-protocol', needsProtocol);
  root.classList.toggle('ep-home-active-journey', activeJourney);
  root.classList.toggle('ep-home-has-anamnesis', hasAnamnesis);

  setHeroCopy(root, needsAnamnesis, needsAccess, needsProtocol, activeJourney);
  setGatedControls(root, activeJourney);

  const content = root.querySelector<HTMLElement>('.ns-home-content');
  const rows = content ? Array.from(content.querySelectorAll<HTMLElement>(':scope > .ns-row')) : [];
  const recommendationRow = rows.find(row =>
    !row.classList.contains('ns-current-day') &&
    !textOf(row).startsWith('Menu') &&
    !textOf(row).startsWith('Fale conosco')
  );

  if (hasAnamnesis && !activeJourney) {
    markRecommendation(recommendationRow);
    ensureProtocolChoice(root, recommendationRow, journeyState, hasAccess);
  } else {
    content?.querySelector('.ep-home-protocol-choice')?.remove();
  }

  const currentDay = root.querySelector<HTMLElement>('.ns-current-day');
  if (currentDay) currentDay.setAttribute('aria-hidden', activeJourney ? 'false' : 'true');

  adjustQuickJourney(root, activeJourney);
}

let queued = false;
function queueApply() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    applyFlowState();
  });
}

if (typeof window !== 'undefined') {
  installProtocolCapture();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', queueApply, { once: true });
  else queueApply();
  new MutationObserver(queueApply).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('storage', () => {
    remoteState = null;
    remoteStateRequested = false;
    queueApply();
  });
  window.addEventListener('focus', () => requestRemoteState(true));
}
