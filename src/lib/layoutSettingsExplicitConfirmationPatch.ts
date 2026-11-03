import { normalizeLayoutId, OFFICIAL_LAYOUTS } from '../config/layouts';

/**
 * Prevents Ajustes > Aparência from persisting a layout on the first card click.
 * The first click is preview/selection only; persistence happens after confirmation.
 * The confirmation surface follows the selected official layout instead of leaking
 * Místico Moderno colors into the other three styles.
 */
const DIALOG_ID = 'layout-settings-explicit-confirmation';
let replayingConfirmedClick = false;

const getLayoutFromButton = (button: HTMLElement) => {
  const name = button.querySelector('span')?.textContent?.trim();
  return OFFICIAL_LAYOUTS.find(layout => layout.name === name);
};

const closeDialog = () => document.getElementById(DIALOG_ID)?.remove();

const previewTheme = (layoutId: string) => {
  switch (normalizeLayoutId(layoutId)) {
    case 'essencia-luminosa':
      return {
        overlay: 'rgba(73,66,55,.42)',
        surface: 'linear-gradient(155deg,#FFFDF8,#F7F1E5 58%,#EEF0E4)',
        border: '#D8C59B', title: '#332E28', text: '#665E53', muted: '#81786D',
        accent: '#B38B43', secondary: '#788265', cancelBorder: 'rgba(120,130,101,.34)',
        cancelText: '#5F6850', shadow: '0 28px 90px rgba(74,62,42,.20)'
      };
    case 'natural-sereno':
      return {
        overlay: 'rgba(55,59,45,.46)', surface: 'linear-gradient(155deg,#FAF7F2,#F3EEE5 58%,#E9E9DD)',
        border: '#D9CFBE', title: '#2A2421', text: '#625B53', muted: '#7A726A', accent: '#A87E37',
        secondary: '#66704D', cancelBorder: '#D8D0C3', cancelText: '#5D574F', shadow: '0 28px 90px rgba(50,45,37,.20)'
      };
    case 'elegancia-profunda':
      return {
        overlay: 'rgba(12,10,9,.72)', surface: 'linear-gradient(155deg,#1A1715,#25201C 58%,#30271F)',
        border: '#806A48', title: '#F4EBDD', text: '#D5C9B8', muted: '#AA9C89', accent: '#C89D52',
        secondary: '#9B7B4D', cancelBorder: 'rgba(244,235,221,.22)', cancelText: '#F4EBDD', shadow: '0 28px 90px rgba(0,0,0,.46)'
      };
    default:
      return {
        overlay: 'rgba(4,8,20,.72)', surface: 'linear-gradient(155deg,#081225,#11152f 58%,#17122f)',
        border: 'rgba(226,185,107,.34)', title: '#F7F0DF', text: '#D8D4CA', muted: '#AAA9B8', accent: '#E2B96B',
        secondary: '#C89D52', cancelBorder: 'rgba(247,240,223,.22)', cancelText: '#F7F0DF', shadow: '0 28px 90px rgba(0,0,0,.48)'
      };
  }
};

const openConfirmation = (button: HTMLButtonElement) => {
  closeDialog();
  const layout = getLayoutFromButton(button);
  if (!layout) return;
  const theme = previewTheme(layout.id);

  const overlay = document.createElement('div');
  overlay.id = DIALOG_ID;
  overlay.dataset.previewLayout = layout.id;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', `Confirmar ${layout.name}`);
  overlay.style.cssText = `position:fixed;inset:0;z-index:2147483001;background:${theme.overlay};backdrop-filter:blur(10px);display:grid;place-items:center;padding:20px`;

  const swatches = layout.swatches.map(color => `<i aria-hidden="true" style="display:block;width:22px;height:22px;border-radius:999px;background:${color};border:1px solid rgba(0,0,0,.10)"></i>`).join('');
  overlay.innerHTML = `<section style="width:min(520px,100%);border:1px solid ${theme.border};border-radius:24px;padding:26px;background:${theme.surface};box-shadow:${theme.shadow};color:${theme.title};font-family:inherit">
    <p style="margin:0 0 7px;color:${theme.accent};font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase">Prévia selecionada</p>
    <h2 style="margin:0;font-size:24px;line-height:1.2;color:${theme.title}">${layout.name}</h2>
    <div style="display:flex;gap:7px;margin:16px 0">${swatches}</div>
    <p style="margin:0;color:${theme.text};font-size:13px;line-height:1.65">${layout.description}</p>
    <p style="margin:14px 0 0;color:${theme.muted};font-size:12px;line-height:1.55">A aparência só será aplicada depois da sua confirmação.</p>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:24px;flex-wrap:wrap">
      <button type="button" data-layout-cancel style="border:1px solid ${theme.cancelBorder};border-radius:13px;background:transparent;color:${theme.cancelText};padding:11px 17px;font-weight:650;cursor:pointer">Voltar</button>
      <button type="button" data-layout-confirm style="border:1px solid ${theme.accent};border-radius:13px;background:linear-gradient(145deg,${theme.accent},${theme.secondary});color:#FFFDF8;padding:11px 18px;font-weight:750;cursor:pointer;box-shadow:0 10px 28px rgba(80,66,42,.18)">Aplicar ${layout.name}</button>
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
