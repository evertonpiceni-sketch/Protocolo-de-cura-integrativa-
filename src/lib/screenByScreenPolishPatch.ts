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
    /* Onboarding uses the dark Natural Sereno card: body copy must remain readable. */
    .ep-care-onboarding-card p:not(.text-\[\#d5ba78\]):not(.text-\[\#cbbf9f\]),
    .ep-care-onboarding-card .text-\[\#5C5248\] { color:#eee6d4!important; }
    .ep-care-onboarding-card button.text-\[\#5C5248\] { color:#26372a!important; }

    /* Keep legacy pale glows decorative and always behind readable content. */
    #numerology-modal > div > .absolute,
    #systemic-questions-modal > div > .absolute { opacity:.55!important; pointer-events:none!important; z-index:0!important; }
    #numerology-modal > div > :not(.absolute),
    #systemic-questions-modal > div > :not(.absolute) { position:relative; z-index:1; }

    /* The payment guide no longer exposes a manual PIX key. */
    #plans-values-guide-modal [data-ep-manual-pix-hidden="true"] { display:none!important; }
    #plans-values-guide-modal .ep-secure-checkout-note {
      display:flex;align-items:center;justify-content:center;gap:8px;margin:0 auto;
      max-width:680px;padding:12px 14px;border:1px solid rgba(216,184,103,.35);
      border-radius:16px;background:rgba(255,255,255,.66);color:#5f6857;
      font:600 12px/1.45 Inter,system-ui,sans-serif;text-align:center;
    }

    /* Prevent accidental horizontal overflow on modal surfaces. */
    #numerology-modal,#systemic-questions-modal,#anamnesis-modal,#courses-modal,#plans-values-guide-modal { overflow-x:hidden!important; }
    #numerology-modal > div,#systemic-questions-modal > div,#anamnesis-modal > div,#courses-modal > div,#plans-values-guide-modal > div { max-width:calc(100vw - 1rem)!important; }
  `;
  document.head.appendChild(style);
}

function replaceManualPixGuide() {
  const modal = document.getElementById('plans-values-guide-modal');
  if (!modal) return;
  const all = Array.from(modal.querySelectorAll<HTMLElement>('div'));
  const pixBlock = all.find(element => {
    const ownText = normalize(element.textContent || '');
    if (!ownText.includes('chave pix oficial') || !ownText.includes('evertonpiceni@gmail.com')) return false;
    return !Array.from(element.children).some(child => {
      const childText = normalize(child.textContent || '');
      return childText.includes('chave pix oficial') && childText.includes('evertonpiceni@gmail.com');
    });
  });
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
  cleanAdminPlanLabel();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const start = () => {
    apply();
    new MutationObserver(apply).observe(document.body, { childList:true, subtree:true, characterData:true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once:true });
  else start();
}

export {};
