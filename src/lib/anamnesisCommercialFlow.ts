const STYLE_ID = 'ep-anamnesis-commercial-flow-style';
const CURRENT_LOGIN_KEY = 'cura_integrada_logged_in_user_v1';
const ACCOUNTS_KEY = 'cura_integrada_accounts_v1';

type AccessProfile = {
  subscriptionPlan?: string;
  plan?: string;
};

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').replace(/\s+/g, ' ').trim();
}

function textOf(element: Element | null) {
  return (element?.textContent || '').replace(/\s+/g, ' ').trim();
}

function readProfile(): AccessProfile {
  try {
    const login = localStorage.getItem(CURRENT_LOGIN_KEY);
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return {};
    const accounts = JSON.parse(raw);
    if (!Array.isArray(accounts)) return {};
    const account = (login ? accounts.find((item: any) => item?.login === login || item?.profile?.login === login) : accounts[0]) || {};
    return account.profile || {};
  } catch {
    return {};
  }
}

function installStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .ep-anamnesis-complete-offer{margin-top:14px;padding:16px;border:1px solid rgba(184,135,54,.28);border-radius:20px;background:linear-gradient(180deg,#fffaf0,#f8f0df);box-shadow:0 10px 26px rgba(82,60,22,.08)}
    .ep-anamnesis-complete-offer small{display:block;margin-bottom:5px;color:#9c7429;font:700 9px/1.3 system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase}
    .ep-anamnesis-complete-offer h4{margin:0 0 7px;color:#26372a;font:600 20px/1.15 Georgia,serif}
    .ep-anamnesis-complete-offer p{margin:0 0 11px;color:#5f6857;font:400 12px/1.55 system-ui,sans-serif}
    .ep-anamnesis-complete-offer strong{color:#073b2b}
    .ep-anamnesis-complete-offer a,.ep-anamnesis-complete-offer button{display:flex;width:100%;min-height:44px;align-items:center;justify-content:center;border:1px solid #073b2b;border-radius:14px;background:#073b2b;color:#fff9e8;text-decoration:none;font:700 12px/1.2 system-ui,sans-serif;padding:10px 12px}
    .ep-anamnesis-complete-offer .ep-secondary{margin-top:7px;border-color:#d8b867;background:transparent;color:#5f6857}
    [data-ep-compact-hidden="true"]{display:none!important}
  `;
  document.head.appendChild(style);
}

function hasFullIncluded(profile: AccessProfile) {
  return ['trimestral', 'semestral', 'anual'].includes(profile.subscriptionPlan || '');
}

function isMonthly(profile: AccessProfile) {
  return profile.subscriptionPlan === 'mensal';
}

function findByExactText(root: ParentNode, selector: string, expected: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).find(element => normalize(textOf(element)) === normalize(expected));
}

function findResultRoot() {
  const marker = Array.from(document.querySelectorAll<HTMLElement>('span,h2,h3,h4'))
    .find(element => normalize(textOf(element)).includes('caminhos de cuidado personalizados'));
  if (!marker) return null;
  return marker.closest<HTMLElement>('[role="dialog"]') || marker.closest<HTMLElement>('.fixed.inset-0') || marker.parentElement;
}

function resolveAvailableProtocol(resultRoot: HTMLElement) {
  const content = normalize(textOf(resultRoot));
  const transformationSignals = ['protecao simbolica', 'espiritualidade', 'prosperidade', 'autoconfianca', 'aterramento'];
  return transformationSignals.some(signal => content.includes(signal))
    ? 'Protocolo da Transformação — 21 dias'
    : '21 Dias para Voltar para Mim — Reintegração da Vida';
}

function hideFullOnlySections(resultRoot: HTMLElement, compactOnly: boolean) {
  const fullSectionHeadings = [
    'Mapa do Momento Bioenergético',
    'Práticas Integrativas Complementares Recomendadas:'
  ];

  for (const heading of fullSectionHeadings) {
    const element = findByExactText(resultRoot, 'span,h3,h4,h5', heading);
    if (!element) continue;
    const section = element.closest<HTMLElement>('.rounded-2xl') || element.closest<HTMLElement>('.space-y-1\.5') || element.parentElement?.parentElement;
    if (!section) continue;
    section.dataset.epCompactHidden = compactOnly ? 'true' : 'false';
  }
}

function correctRecommendation(resultRoot: HTMLElement) {
  const suggestedPlan = findByExactText(resultRoot, 'span', 'Plano Sugerido');
  if (suggestedPlan) {
    suggestedPlan.textContent = 'Protocolo sugerido';
    const container = suggestedPlan.closest<HTMLElement>('.rounded-xl');
    const value = container?.querySelector<HTMLElement>('p');
    if (value) value.textContent = resolveAvailableProtocol(resultRoot);
  }

  const title = Array.from(resultRoot.querySelectorAll<HTMLElement>('h3'))
    .find(element => {
      const value = normalize(textOf(element));
      return value.includes('jornada de 21 dias') || value.includes('seguranca interior') || value.includes('presenca corporal') || value.includes('autoconfianca') || value.includes('reconciliacao interior') || value.includes('protecao simbolica');
    });
  if (title) title.textContent = resolveAvailableProtocol(resultRoot);
}

function correctPrimaryAction(resultRoot: HTMLElement) {
  const button = Array.from(resultRoot.querySelectorAll<HTMLButtonElement>('button'))
    .find(item => normalize(textOf(item)).includes('iniciar caminho sugerido'));
  if (!button || button.dataset.epProtocolChoiceAction === 'true') return;

  button.dataset.epProtocolChoiceAction = 'true';
  button.querySelector('span')?.replaceChildren('Escolher meu protocolo');
  button.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const dialog = button.closest<HTMLElement>('[role="dialog"]') || button.closest<HTMLElement>('.fixed.inset-0');
    const close = dialog?.querySelector<HTMLButtonElement>('button[aria-label="Fechar"]');
    close?.click();
    window.setTimeout(() => document.querySelector<HTMLElement>('.ep-home-protocol-choice')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
  }, true);
}

function ensureOffer(resultRoot: HTMLElement, profile: AccessProfile) {
  let offer = resultRoot.querySelector<HTMLElement>('.ep-anamnesis-complete-offer');
  if (!offer) {
    offer = document.createElement('section');
    offer.className = 'ep-anamnesis-complete-offer';
    const actions = resultRoot.querySelector<HTMLElement>('.ep-assessment-actions');
    if (actions?.parentElement) actions.parentElement.insertBefore(offer, actions);
    else resultRoot.appendChild(offer);
  }

  if (hasFullIncluded(profile)) {
    offer.innerHTML = `<small>Benefício do seu plano</small><h4>Sua Anamnese Completa já está incluída.</h4><p>Você pode acessar o aprofundamento do resultado sem cobrança adicional.</p>`;
    return;
  }

  const monthly = isMonthly(profile);
  const price = monthly ? 'R$ 10,00' : 'R$ 15,00';
  const benefit = monthly
    ? 'Como você está no plano mensal, recebe R$ 5,00 de desconto no aprofundamento da sua análise. De R$ 15,00 por R$ 10,00.'
    : 'O resultado que você acabou de receber já traz as informações essenciais para orientar seu próximo passo. Se quiser olhar com mais profundidade para os padrões e detalhes das suas respostas, você pode solicitar também a Anamnese Completa.';
  const message = encodeURIComponent(`Olá, Éverton. Quero minha Anamnese Completa por ${price}.`);

  offer.innerHTML = `
    <small>Aprofundamento opcional</small>
    <h4>Quer receber sua Anamnese Completa?</h4>
    <p>${benefit}</p>
    <p><strong>${monthly ? 'De R$ 15,00 por R$ 10,00.' : 'Resultado completo — R$ 15,00.'}</strong></p>
    <a href="https://wa.me/5551982215296?text=${message}" target="_blank" rel="noopener noreferrer">Quero minha análise completa — ${price}</a>
    <button type="button" class="ep-secondary" data-ep-dismiss-complete="true">Prefiro seguir com meu resultado atual</button>
  `;
  offer.querySelector<HTMLButtonElement>('[data-ep-dismiss-complete="true"]')?.addEventListener('click', () => { offer?.remove(); }, { once: true });
}

function apply() {
  installStyles();
  const resultRoot = findResultRoot();
  if (!resultRoot) return;

  const profile = readProfile();
  const fullIncluded = hasFullIncluded(profile);
  hideFullOnlySections(resultRoot, !fullIncluded);
  correctRecommendation(resultRoot);
  correctPrimaryAction(resultRoot);
  ensureOffer(resultRoot, profile);

  const compactLabel = Array.from(resultRoot.querySelectorAll<HTMLElement>('span,p'))
    .find(element => normalize(textOf(element)) === 'caminhos de cuidado personalizados');
  if (compactLabel) compactLabel.textContent = fullIncluded ? 'Anamnese Completa' : 'Resultado da Anamnese Compacta';
}

let queued = false;
function queueApply() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    apply();
  });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const start = () => {
    queueApply();
    new MutationObserver(queueApply).observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}
