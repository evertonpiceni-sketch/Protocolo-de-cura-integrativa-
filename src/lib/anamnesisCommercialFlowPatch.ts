const CURRENT_LOGIN_KEY = 'cura_integrada_logged_in_user_v1';
const ACCOUNTS_KEY = 'cura_integrada_accounts_v1';

type CommercialState = {
  subscriptionPlan?: string;
  plan?: string;
};

let remoteState: CommercialState | null = null;
let requested = false;

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/\s+/g, ' ')
    .trim();
}

function readLocalState(): CommercialState {
  try {
    const login = localStorage.getItem(CURRENT_LOGIN_KEY);
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!login || !raw) return {};
    const accounts = JSON.parse(raw);
    if (!Array.isArray(accounts)) return {};
    const account = accounts.find((item: any) => item?.login === login || item?.profile?.login === login);
    return {
      subscriptionPlan: account?.profile?.subscriptionPlan,
      plan: account?.profile?.plan || account?.plan,
    };
  } catch {
    return {};
  }
}

function requestRemoteState() {
  if (requested) return;
  requested = true;
  fetch('/api/auth/me', { credentials: 'same-origin' })
    .then(response => response.ok ? response.json() : null)
    .then(data => {
      const profile = data?.user?.profile;
      if (!profile) return;
      remoteState = {
        subscriptionPlan: profile.subscriptionPlan,
        plan: profile.plan || data?.user?.plan,
      };
      queueApply();
    })
    .catch(() => undefined);
}

function commercialState() {
  return remoteState || readLocalState();
}

function completeIncluded(state: CommercialState) {
  return ['trimestral', 'semestral', 'anual'].includes(state.subscriptionPlan || '');
}

function monthlyDiscount(state: CommercialState) {
  return state.subscriptionPlan === 'mensal';
}

function addStyles() {
  if (document.getElementById('ep-anamnesis-commercial-flow-styles')) return;
  const style = document.createElement('style');
  style.id = 'ep-anamnesis-commercial-flow-styles';
  style.textContent = `
    #anamnesis-modal [data-ep-compact-hidden="true"]{display:none!important}
    #anamnesis-modal .ep-anamnesis-offer{margin-top:14px;padding:18px;border:1px solid rgba(184,135,54,.28);border-radius:20px;background:linear-gradient(180deg,#fffaf0,#f8f1e4);box-shadow:0 10px 28px rgba(70,54,25,.07)}
    #anamnesis-modal .ep-anamnesis-offer small{display:block;margin-bottom:6px;color:#8f631e;font:700 10px/1.35 Inter,sans-serif;letter-spacing:.12em;text-transform:uppercase}
    #anamnesis-modal .ep-anamnesis-offer h3{margin:0 0 8px;color:#26372a;font:600 22px/1.12 Georgia,serif}
    #anamnesis-modal .ep-anamnesis-offer p{margin:0 0 9px;color:#5c5248;font:400 12px/1.65 Inter,sans-serif}
    #anamnesis-modal .ep-anamnesis-price{margin:12px 0 10px!important;color:#26372a!important;font-weight:700!important}
    #anamnesis-modal .ep-anamnesis-price del{color:#85786c;font-weight:500;margin-right:5px}
    #anamnesis-modal .ep-anamnesis-offer button{width:100%;min-height:48px;border:0;border-radius:15px;padding:11px 16px;background:#073b2b;color:#fff9e8;font:700 13px/1.3 Inter,sans-serif;cursor:pointer}
    #anamnesis-modal .ep-anamnesis-offer button:disabled{opacity:.65;cursor:wait}
    #anamnesis-modal .ep-anamnesis-offer .ep-anamnesis-secondary{margin-top:7px;background:transparent;color:#5c5248;border:1px solid #e5dac6;font-weight:600}
    #anamnesis-modal .ep-anamnesis-payment-status{margin-top:8px!important;font-size:11px!important;color:#71511c!important}
  `;
  document.head.appendChild(style);
}

function cardContaining(root: HTMLElement, phrase: string) {
  const normalizedPhrase = normalize(phrase);
  return Array.from(root.querySelectorAll<HTMLElement>('div,section')).find(element => {
    if (element.dataset.epAnamnesisOffer === 'true') return false;
    const text = normalize(element.textContent || '');
    return text.includes(normalizedPhrase) && !Array.from(element.children).some(child => normalize(child.textContent || '').includes(normalizedPhrase));
  })?.closest<HTMLElement>('.rounded-2xl,.rounded-xl,.space-y-3') || null;
}

function setCompactVisibility(modal: HTMLElement, included: boolean) {
  const technicalPhrases = [
    'Mapa do Momento Bioenergético',
    'Sistema de Reiki sugerido para este momento',
    'Sistemas Complementares Ativados no Protocolo',
    'Práticas Integrativas Complementares Recomendadas',
  ];

  for (const phrase of technicalPhrases) {
    const nodes = Array.from(modal.querySelectorAll<HTMLElement>('span,h4,h5'))
      .filter(node => normalize(node.textContent || '').includes(normalize(phrase)));
    for (const node of nodes) {
      const card = node.closest<HTMLElement>('.rounded-2xl,.space-y-3') || node.parentElement;
      if (!card) continue;
      if (included) card.removeAttribute('data-ep-compact-hidden');
      else card.setAttribute('data-ep-compact-hidden', 'true');
    }
  }
}

function removeDirectStart(modal: HTMLElement) {
  const buttons = Array.from(modal.querySelectorAll<HTMLButtonElement>('button'));
  for (const button of buttons) {
    const text = normalize(button.textContent || '');
    if (text.includes('iniciar caminho sugerido') || text.includes('iniciar tratamento sugerido')) {
      button.setAttribute('data-ep-compact-hidden', 'true');
      button.disabled = true;
    }
    if (text === 'concluir') {
      const span = button.querySelector('span');
      if (span) span.textContent = 'Concluir e escolher meu protocolo';
      else button.textContent = 'Concluir e escolher meu protocolo';
    }
  }
}

async function startCompleteCheckout(price: number, button: HTMLButtonElement, status: HTMLElement) {
  button.disabled = true;
  status.textContent = 'Preparando o pagamento…';
  try {
    const response = await fetch('/api/payment/create-checkout', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productType: 'anamnesis_complete', paymentMethod: 'provider', price }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Não foi possível iniciar o pagamento agora.');
    if (data.checkoutUrl) {
      window.location.assign(data.checkoutUrl);
      return;
    }
    status.textContent = 'Pagamento confirmado. Sua análise completa será liberada.';
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : 'Não foi possível iniciar o pagamento agora.';
    button.disabled = false;
  }
}

function ensureOffer(modal: HTMLElement, state: CommercialState) {
  const resultAnchor = Array.from(modal.querySelectorAll<HTMLElement>('button'))
    .find(button => normalize(button.textContent || '').includes('atualizar / refazer ficha'));
  if (!resultAnchor) return;

  const existing = modal.querySelector<HTMLElement>('[data-ep-anamnesis-offer="true"]');
  const included = completeIncluded(state);
  const monthly = monthlyDiscount(state);

  if (existing && existing.dataset.epPlanState === `${state.subscriptionPlan || 'avulso'}:${included}:${monthly}`) return;
  existing?.remove();

  const offer = document.createElement('section');
  offer.className = 'ep-anamnesis-offer';
  offer.dataset.epAnamnesisOffer = 'true';
  offer.dataset.epPlanState = `${state.subscriptionPlan || 'avulso'}:${included}:${monthly}`;

  if (included) {
    offer.innerHTML = `
      <small>Anamnese Completa</small>
      <h3>Seu plano já inclui a análise completa.</h3>
      <p>Além do resultado compacto que orienta seu próximo passo, você pode consultar o aprofundamento detalhado sem cobrança adicional.</p>
    `;
  } else if (monthly) {
    offer.innerHTML = `
      <small>Aprofundamento opcional</small>
      <h3>Quer receber sua Anamnese Completa?</h3>
      <p>Como você está no plano mensal, recebe R$ 5,00 de desconto no aprofundamento da sua análise.</p>
      <p class="ep-anamnesis-price"><del>R$ 15,00</del> por R$ 10,00.</p>
      <button type="button" data-ep-complete-checkout="10">Quero minha análise completa — R$ 10,00</button>
      <button type="button" class="ep-anamnesis-secondary" data-ep-keep-compact="true">Prefiro seguir com meu resultado atual</button>
      <p class="ep-anamnesis-payment-status" aria-live="polite"></p>
    `;
  } else {
    offer.innerHTML = `
      <small>Aprofundamento opcional</small>
      <h3>Quer compreender seu resultado com mais profundidade?</h3>
      <p>O que você acabou de receber já traz as informações essenciais para orientar seu próximo passo.</p>
      <p>Se sentir que gostaria de olhar com mais calma para os padrões, relações e detalhes que apareceram nas suas respostas, você pode acessar também a Anamnese Completa.</p>
      <p>Ela amplia a leitura do seu momento e apresenta uma análise mais profunda e detalhada.</p>
      <p class="ep-anamnesis-price">Resultado completo — R$ 15,00</p>
      <button type="button" data-ep-complete-checkout="15">Aprofundar meu resultado</button>
      <button type="button" class="ep-anamnesis-secondary" data-ep-keep-compact="true">Prefiro seguir com meu resultado atual</button>
      <p class="ep-anamnesis-payment-status" aria-live="polite"></p>
    `;
  }

  const actionBar = resultAnchor.closest<HTMLElement>('.print\\:hidden') || resultAnchor.parentElement?.parentElement;
  if (actionBar?.parentElement) actionBar.parentElement.insertBefore(offer, actionBar);
  else resultAnchor.parentElement?.prepend(offer);

  offer.querySelector<HTMLButtonElement>('[data-ep-keep-compact="true"]')?.addEventListener('click', () => {
    offer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  const checkout = offer.querySelector<HTMLButtonElement>('[data-ep-complete-checkout]');
  const status = offer.querySelector<HTMLElement>('.ep-anamnesis-payment-status');
  if (checkout && status) {
    checkout.addEventListener('click', () => {
      const price = Number(checkout.dataset.epCompleteCheckout || 15);
      void startCompleteCheckout(price, checkout, status);
    });
  }
}

function apply() {
  addStyles();
  requestRemoteState();
  const modal = document.getElementById('anamnesis-modal') as HTMLElement | null;
  if (!modal) return;
  const state = commercialState();
  const included = completeIncluded(state);
  removeDirectStart(modal);
  setCompactVisibility(modal, included);
  ensureOffer(modal, state);
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
    window.addEventListener('focus', () => {
      remoteState = null;
      requested = false;
      queueApply();
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}

export {};
