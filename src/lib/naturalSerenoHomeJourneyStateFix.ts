const HOME_FLOW_STYLE_ID = 'ep-natural-sereno-home-flow-state-fix';
const CURRENT_LOGIN_KEY = 'cura_integrada_logged_in_user_v1';
const ACCOUNTS_KEY = 'cura_integrada_accounts_v1';

type HomeJourneyState = {
  selectedJourney?: string;
  selectedProtocolId?: string;
  subscriptionPlan?: string;
};

let remoteState: HomeJourneyState | null = null;
let remoteStateRequested = false;

function textOf(element: Element | null) {
  return (element?.textContent || '').replace(/\s+/g, ' ').trim();
}

function addFlowStyles() {
  if (document.getElementById(HOME_FLOW_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = HOME_FLOW_STYLE_ID;
  style.textContent = `
    :root[data-layout="natural-sereno"] .ep-home-needs-protocol .ns-current-day,
    :root[data-layout="natural-sereno"] .ep-home-needs-anamnesis .ns-current-day {
      display: none !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-needs-protocol .ns-home-scene > .ns-gold,
    :root[data-layout="natural-sereno"] .ep-home-needs-anamnesis .ns-home-scene > .ns-gold {
      display: none !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-needs-protocol.ep-home-has-anamnesis .ns-home-content,
    :root[data-layout="natural-sereno"] .ep-home-active-journey .ns-home-content {
      margin-top: -34px;
      padding-top: 0 !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-active-journey .ns-current-day {
      display: flex !important;
    }

    :root[data-layout="natural-sereno"] .ep-home-needs-protocol .ep-home-protocol-choice {
      display: block;
    }

    :root[data-layout="natural-sereno"] .ep-home-active-journey .ep-home-protocol-choice,
    :root[data-layout="natural-sereno"] .ep-home-needs-anamnesis .ep-home-protocol-choice {
      display: none;
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
      margin: 0 0 18px;
      color: #5f6857;
      font-size: 14px;
      line-height: 1.6;
    }

    :root[data-layout="natural-sereno"] .ep-home-protocol-choice button {
      width: 100%;
      min-height: 54px;
      border: 1px solid #073b2b;
      border-radius: 999px;
      background: #073b2b;
      color: #fff9e8;
      font-family: 'Lora', Georgia, serif;
      font-size: 15px;
      box-shadow: 0 10px 24px rgba(7,59,43,.18);
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

    :root[data-layout="natural-sereno"] .ep-home-active-journey .ep-home-continue {
      display: flex;
    }

    :root[data-layout="natural-sereno"] .ep-home-needs-protocol .ep-home-continue,
    :root[data-layout="natural-sereno"] .ep-home-needs-anamnesis .ep-home-continue {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}

function readLocalState(): HomeJourneyState {
  try {
    const login = localStorage.getItem(CURRENT_LOGIN_KEY);
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!login || !raw) return {};
    const accounts = JSON.parse(raw);
    if (!Array.isArray(accounts)) return {};
    const account = accounts.find((item: any) => item?.login === login || item?.profile?.login === login);
    return {
      selectedJourney: account?.profile?.selectedJourney,
      selectedProtocolId: account?.profile?.selectedProtocolId,
      subscriptionPlan: account?.profile?.subscriptionPlan,
    };
  } catch {
    return {};
  }
}

function requestRemoteState() {
  if (remoteStateRequested) return;
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

function findPlanTrigger(): HTMLButtonElement | null {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('button'))
    .filter(button => !button.closest('.ep-home-protocol-choice'));
  const preferred = ['valores', 'planos', 'upgrade', 'vip'];
  for (const term of preferred) {
    const match = buttons.find(button => textOf(button).toLocaleLowerCase('pt-BR').includes(term));
    if (match) return match;
  }
  return null;
}

function ensureProtocolChoice(root: HTMLElement, recommendationRow: HTMLElement | undefined) {
  const content = root.querySelector<HTMLElement>('.ns-home-content');
  if (!content) return;

  let card = content.querySelector<HTMLElement>('.ep-home-protocol-choice');
  if (!card) {
    card = document.createElement('section');
    card.className = 'ep-home-protocol-choice';
    card.innerHTML = `
      <small>Seu próximo passo</small>
      <h2>Escolha o caminho que combina com o seu momento.</h2>
      <p>Seu resultado já pode orientar você. Veja o protocolo mais indicado, compare as outras possibilidades e escolha livremente o protocolo e a duração de 7 ou 21 dias.</p>
      <button type="button">Escolher protocolo e duração</button>
    `;
    card.querySelector('button')?.addEventListener('click', () => {
      const trigger = findPlanTrigger();
      trigger?.click();
    });

    const insight = content.querySelector<HTMLElement>('.ns-insight');
    if (recommendationRow?.nextSibling) content.insertBefore(card, recommendationRow.nextSibling);
    else if (insight) content.insertBefore(card, insight);
    else content.prepend(card);
  }
}

function markRecommendation(row: HTMLElement | undefined) {
  if (!row) return;
  row.classList.add('ep-home-moment-card');
  if (!row.querySelector('.ep-home-recommended-label')) {
    const label = document.createElement('span');
    label.className = 'ep-home-recommended-label';
    label.textContent = 'Mais indicado para o seu momento';
    const copy = row.querySelector('.ns-row-copy');
    if (copy) copy.prepend(label);
  }
}

function setHeroCopy(root: HTMLElement, needsAnamnesis: boolean, needsProtocol: boolean, activeJourney: boolean) {
  const greeting = root.querySelector<HTMLElement>('.ns-greeting');
  if (!greeting) return;
  const paragraphs = greeting.querySelectorAll('p');
  if (paragraphs[0]) {
    paragraphs[0].textContent = activeJourney
      ? 'Que bom ter você aqui novamente.'
      : needsProtocol
        ? 'Seu resultado já está pronto.'
        : 'Que bom que você está aqui novamente.';
  }
  if (paragraphs[1]) {
    paragraphs[1].textContent = activeJourney
      ? 'Sua jornada está em andamento. Siga no seu tempo, um dia de cada vez.'
      : needsProtocol
        ? 'Agora você pode conhecer a indicação para o seu momento e escolher livremente o protocolo e a duração que fazem sentido para você.'
        : 'Seu primeiro dia é um espaço para experimentar, se ouvir e conhecer o cuidado antes de escolher o protocolo que deseja seguir.';
  }
}

function adjustQuickJourney(root: HTMLElement, activeJourney: boolean) {
  const button = root.querySelector<HTMLButtonElement>('[data-ep-quick="journey"]');
  if (!button) return;
  button.disabled = !activeJourney;
  const helper = button.querySelector('small');
  if (helper) helper.textContent = activeJourney ? 'Meu progresso do dia a dia' : 'Disponível após escolher protocolo e duração';
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
  const activeJourney = hasAnamnesis && hasExplicitJourney(journeyState);
  const needsProtocol = hasAnamnesis && !activeJourney;
  const needsAnamnesis = !hasAnamnesis;

  root.classList.toggle('ep-home-needs-anamnesis', needsAnamnesis);
  root.classList.toggle('ep-home-needs-protocol', needsProtocol);
  root.classList.toggle('ep-home-active-journey', activeJourney);
  root.classList.toggle('ep-home-has-anamnesis', hasAnamnesis);

  setHeroCopy(root, needsAnamnesis, needsProtocol, activeJourney);

  const content = root.querySelector<HTMLElement>('.ns-home-content');
  const rows = content ? Array.from(content.querySelectorAll<HTMLElement>(':scope > .ns-row')) : [];
  const recommendationRow = rows.find(row =>
    !row.classList.contains('ns-current-day') &&
    !textOf(row).startsWith('Menu') &&
    !textOf(row).startsWith('Fale conosco')
  );

  if (hasAnamnesis) {
    markRecommendation(recommendationRow);
    ensureProtocolChoice(root, recommendationRow);
  }

  const currentDay = root.querySelector<HTMLElement>('.ns-current-day');
  if (currentDay) {
    currentDay.setAttribute('aria-hidden', activeJourney ? 'false' : 'true');
    if (!activeJourney) currentDay.setAttribute('tabindex', '-1');
    else currentDay.removeAttribute('tabindex');
  }

  const heroCta = root.querySelector<HTMLButtonElement>('.ns-home-scene > .ns-gold');
  if (heroCta && activeJourney) {
    for (const node of Array.from(heroCta.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) node.textContent = 'Continuar minha jornada ';
    }
  }

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
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', queueApply, { once: true });
  else queueApply();
  new MutationObserver(queueApply).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('storage', queueApply);
}
