const STYLE_ID = 'ep-screen-by-screen-polish';

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/\s+/g, ' ')
    .trim();
}

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .ep-care-onboarding-card p:not(.text-\[\#d5ba78\]):not(.text-\[\#cbbf9f\]),
    .ep-care-onboarding-card .text-\[\#5C5248\] { color:#eee6d4!important; }
    .ep-care-onboarding-card button.text-\[\#5C5248\] { color:#26372a!important; }

    #numerology-modal > div > .absolute,
    #systemic-questions-modal > div > .absolute { opacity:.55!important; pointer-events:none!important; z-index:0!important; }
    #numerology-modal > div > :not(.absolute),
    #systemic-questions-modal > div > :not(.absolute) { position:relative; z-index:1; }

    #plans-values-guide-modal [data-ep-manual-pix-hidden="true"],
    #specific-treatment-modal [data-ep-manual-pix-hidden="true"],
    #specific-treatment-modal [data-ep-legacy-trial-hidden="true"],
    #specific-treatment-modal [data-ep-duplicate-price-hidden="true"] { display:none!important; }

    #plans-values-guide-modal .ep-secure-checkout-note,
    #specific-treatment-modal .ep-secure-checkout-note {
      display:flex;align-items:center;justify-content:center;gap:8px;margin:0 auto;
      max-width:680px;padding:12px 14px;border:1px solid rgba(216,184,103,.35);
      border-radius:16px;background:rgba(255,255,255,.66);color:#5f6857;
      font:600 12px/1.45 Inter,system-ui,sans-serif;text-align:center;
    }

    #numerology-modal,#systemic-questions-modal,#anamnesis-modal,#courses-modal,#plans-values-guide-modal,#specific-treatment-modal { overflow-x:hidden!important; }
    #numerology-modal > div,#systemic-questions-modal > div,#anamnesis-modal > div,#courses-modal > div,#plans-values-guide-modal > div,#specific-treatment-modal > div { max-width:calc(100vw - 1rem)!important; }
  `;
  document.head.appendChild(style);
}

function deepestBlockWithText(root: HTMLElement, terms: string[]) {
  const normalizedTerms = terms.map(normalize);
  return Array.from(root.querySelectorAll<HTMLElement>('div,section')).find(element => {
    const ownText = normalize(element.textContent || '');
    if (!normalizedTerms.every(term => ownText.includes(term))) return false;
    return !Array.from(element.children).some(child => {
      const childText = normalize(child.textContent || '');
      return normalizedTerms.every(term => childText.includes(term));
    });
  }) || null;
}

function replaceManualPixGuide() {
  const modal = document.getElementById('plans-values-guide-modal');
  if (!modal) return;
  const pixBlock = deepestBlockWithText(modal, ['chave pix oficial', 'evertonpiceni@gmail.com']);
  const block = pixBlock?.closest<HTMLElement>('.rounded-2xl') || pixBlock;
  if (!block) return;
  block.setAttribute('data-ep-manual-pix-hidden', 'true');

  const parent = block.parentElement;
  if (!parent || parent.querySelector('.ep-secure-checkout-note')) return;
  const note = document.createElement('div');
  note.className = 'ep-secure-checkout-note';
  note.textContent = 'O pagamento dos protocolos é concluído no checkout seguro da InfinityPay. Nenhuma chave PIX manual é necessária nesta tela.';
  parent.insertBefore(note, block.nextSibling);
}

function polishSpecificTreatment() {
  const modal = document.getElementById('specific-treatment-modal');
  if (!modal) return;

  for (const button of Array.from(modal.querySelectorAll<HTMLButtonElement>('button'))) {
    const text = normalize(button.textContent || '');
    if (text.includes('vip7') && text.includes('7 dias')) {
      button.setAttribute('data-ep-legacy-trial-hidden', 'true');
    }
    if (text === 'pix') {
      const label = button.querySelector('span');
      if (label) label.textContent = 'InfinityPay';
      button.setAttribute('aria-label', 'Checkout seguro pela InfinityPay');
      button.dataset.epInfinityPaySelector = 'true';
    }
  }

  const pixDetails = deepestBlockWithText(modal, ['chave pix oficial', 'evertonpiceni@gmail.com']);
  const pixCard = pixDetails?.closest<HTMLElement>('.rounded-xl') || pixDetails;
  pixCard?.setAttribute('data-ep-manual-pix-hidden', 'true');

  const paymentCard = Array.from(modal.querySelectorAll<HTMLElement>('div')).find(element => {
    const text = normalize(element.textContent || '');
    return text.includes('valor da pratica') && text.includes('infinitypay');
  })?.closest<HTMLElement>('.rounded-2xl');

  if (paymentCard && !paymentCard.querySelector('.ep-secure-checkout-note')) {
    const note = document.createElement('div');
    note.className = 'ep-secure-checkout-note';
    note.textContent = 'Ao continuar, você será direcionado ao checkout seguro da InfinityPay. O valor válido é o exibido no resumo do ciclo selecionado acima.';
    paymentCard.appendChild(note);
  }

  const duplicatePrice = Array.from(modal.querySelectorAll<HTMLElement>('span')).find(element => normalize(element.textContent || '') === 'valor da pratica:');
  duplicatePrice?.closest<HTMLElement>('.flex.flex-col')?.setAttribute('data-ep-duplicate-price-hidden', 'true');
  if (duplicatePrice && !duplicatePrice.closest<HTMLElement>('[data-ep-duplicate-price-hidden="true"]')) {
    duplicatePrice.parentElement?.setAttribute('data-ep-duplicate-price-hidden', 'true');
  }

  for (const element of Array.from(modal.querySelectorAll<HTMLElement>('p,span'))) {
    if (element.children.length) continue;
    const text = element.textContent || '';
    if (text.includes('VIP7 é exclusivo da degustação PRO de 7 dias')) {
      element.textContent = 'Este código não se aplica à prática individual.';
    }
  }
}

function cleanAdminPlanLabel() {
  const admin = document.getElementById('admin-panel-modal');
  if (!admin) return;
  for (const node of Array.from(admin.querySelectorAll<HTMLElement>('span'))) {
    if (node.children.length) continue;
    const text = node.textContent || '';
    if (text.includes('PRO VIP')) node.textContent = text.replace(/★?\s*PRO VIP/g, 'PRO');
  }
}

function apply() {
  ensureStyles();
  replaceManualPixGuide();
  polishSpecificTreatment();
  cleanAdminPlanLabel();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const start = () => {
    apply();
    document.addEventListener('click', event => {
      const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('#specific-treatment-modal [data-ep-infinity-pay-selector="true"]') : null;
      if (!button) return;
      // The legacy PIX selector copied a manual key. PIX remains the checkout method,
      // but the provider now owns the actual payment experience.
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
    new MutationObserver(apply).observe(document.body, { childList:true, subtree:true, characterData:true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once:true });
  else start();
}

export {};
