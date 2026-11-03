import { normalizeLayoutId, OFFICIAL_LAYOUTS } from '../config/layouts';

/**
 * Prevents Ajustes > Aparência from persisting a layout on the first card click.
 * The React view currently saves immediately; this capture-phase guard turns the
 * first click into a preview/selection step and only replays the original click
 * after an explicit confirmation.
 */
const DIALOG_ID = 'layout-settings-explicit-confirmation';
let replayingConfirmedClick = false;

const getLayoutFromButton = (button: HTMLElement) => {
  const name = button.querySelector('span')?.textContent?.trim();
  return OFFICIAL_LAYOUTS.find(layout => layout.name === name);
};

const closeDialog = () => document.getElementById(DIALOG_ID)?.remove();

const openConfirmation = (button: HTMLButtonElement) => {
  closeDialog();
  const layout = getLayoutFromButton(button);
  if (!layout) return;

  const overlay = document.createElement('div');
  overlay.id = DIALOG_ID;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', `Confirmar ${layout.name}`);
  overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483001;background:rgba(4,8,20,.72);backdrop-filter:blur(10px);display:grid;place-items:center;padding:20px';

  const swatches = layout.swatches.map(color => `<i aria-hidden="true" style="display:block;width:22px;height:22px;border-radius:999px;background:${color};border:1px solid rgba(255,255,255,.18)"></i>`).join('');
  overlay.innerHTML = `<section style="width:min(520px,100%);border:1px solid rgba(226,185,107,.34);border-radius:24px;padding:26px;background:linear-gradient(155deg,#081225,#11152f 58%,#17122f);box-shadow:0 28px 90px rgba(0,0,0,.48);color:#f7f0df;font-family:inherit">
    <p style="margin:0 0 7px;color:#e2b96b;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase">Prévia selecionada</p>
    <h2 style="margin:0;font-size:24px;line-height:1.2">${layout.name}</h2>
    <div style="display:flex;gap:7px;margin:16px 0">${swatches}</div>
    <p style="margin:0;color:#d8d4ca;font-size:13px;line-height:1.65">${layout.description}</p>
    <p style="margin:14px 0 0;color:#aaa9b8;font-size:12px;line-height:1.55">A aparência só será aplicada depois da sua confirmação.</p>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:24px;flex-wrap:wrap">
      <button type="button" data-layout-cancel style="border:1px solid rgba(247,240,223,.22);border-radius:13px;background:transparent;color:#f7f0df;padding:11px 17px;font-weight:650;cursor:pointer">Voltar</button>
      <button type="button" data-layout-confirm style="border:1px solid #e2b96b;border-radius:13px;background:linear-gradient(145deg,#c89d52,#a87e37);color:#fffdf8;padding:11px 18px;font-weight:750;cursor:pointer;box-shadow:0 10px 28px rgba(200,157,82,.18)">Aplicar ${layout.name}</button>
    </div>
  </section>`;

  overlay.querySelector<HTMLButtonElement>('[data-layout-cancel]')?.addEventListener('click', closeDialog);
  overlay.addEventListener('click', event => { if (event.target === overlay) closeDialog(); });
  overlay.querySelector<HTMLButtonElement>('[data-layout-confirm]')?.addEventListener('click', () => {
    replayingConfirmedClick = true;
    closeDialog();
    button.click();
    queueMicrotask(() => { replayingConfirmedClick = false; });
  });
  document.body.appendChild(overlay);
  overlay.querySelector<HTMLButtonElement>('[data-layout-confirm]')?.focus();
};

if (typeof document !== 'undefined') {
  document.addEventListener('click', event => {
    if (replayingConfirmedClick) return;
    const target = event.target as HTMLElement | null;
    const button = target?.closest<HTMLButtonElement>('#settings-view .ep-layout-choice');
    if (!button) return;
    const layout = getLayoutFromButton(button);
    if (!layout) return;
    const current = normalizeLayoutId(document.documentElement.dataset.layout);
    if (current === layout.id) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openConfirmation(button);
  }, true);
}
