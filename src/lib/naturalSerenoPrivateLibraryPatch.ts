const PRIVATE_LIBRARY_PATCH_ID = 'ep-private-library-patch';

function textOf(element: Element | null) {
  return (element?.textContent || '').replace(/\s+/g, ' ').trim();
}

function openProfileFromDock(root: HTMLElement) {
  const homeMenu = root.querySelector<HTMLButtonElement>('.ns-home-menu');
  if (homeMenu) {
    homeMenu.click();
    window.setTimeout(() => {
      const app = document.querySelector<HTMLElement>('.ns-app');
      const profile = Array.from(app?.querySelectorAll<HTMLButtonElement>('button') || [])
        .find(button => textOf(button).includes('Meu Perfil'));
      profile?.click();
    }, 0);
    return;
  }

  const app = document.querySelector<HTMLElement>('.ns-app');
  const back = app?.querySelector<HTMLButtonElement>('.ns-page-heading > button');
  back?.click();
  window.setTimeout(() => openProfileFromDock(document.querySelector<HTMLElement>('.ns-app') || root), 0);
}

function installStyles() {
  if (document.getElementById(PRIVATE_LIBRARY_PATCH_ID)) return;
  const style = document.createElement('style');
  style.id = PRIVATE_LIBRARY_PATCH_ID;
  style.textContent = `
    :root[data-layout="natural-sereno"] [data-ep-private-library-entry="true"] { display: none !important; }
    :root[data-layout="natural-sereno"] .ep-my-space-dock svg { color: currentColor; }
  `;
  document.head.appendChild(style);
}

function applyPrivateLibraryRule() {
  const root = document.querySelector<HTMLElement>('.ns-app');
  if (!root) return;
  installStyles();

  for (const button of Array.from(root.querySelectorAll<HTMLButtonElement>('button'))) {
    const label = textOf(button);
    if (label.includes('Biblioteca Integrativa')) {
      button.setAttribute('data-ep-private-library-entry', 'true');
      button.setAttribute('aria-hidden', 'true');
      button.tabIndex = -1;
    }
  }

  const dock = root.querySelector<HTMLElement>('.ns-dock');
  if (!dock) return;
  const libraryButton = Array.from(dock.querySelectorAll<HTMLButtonElement>('button'))
    .find(button => textOf(button) === 'Biblioteca');
  if (!libraryButton || libraryButton.classList.contains('ep-my-space-dock')) return;

  const replacement = libraryButton.cloneNode(true) as HTMLButtonElement;
  replacement.classList.add('ep-my-space-dock');
  replacement.removeAttribute('aria-current');
  const label = replacement.querySelector('span');
  if (label) label.textContent = 'Meu Espaço';
  replacement.setAttribute('aria-label', 'Meu Espaço');
  replacement.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    openProfileFromDock(document.querySelector<HTMLElement>('.ns-app') || root);
  });
  libraryButton.replaceWith(replacement);
}

let queued = false;
function queueApply() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    applyPrivateLibraryRule();
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', queueApply, { once: true });
  else queueApply();
  new MutationObserver(queueApply).observe(document.documentElement, { childList: true, subtree: true });
}
