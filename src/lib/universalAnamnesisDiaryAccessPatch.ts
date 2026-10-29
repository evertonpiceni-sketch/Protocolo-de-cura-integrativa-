

const normalize = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim();

const isCoreAccessControl = (element: Element) => {
  const text = normalize(element.textContent || '');
  const aria = normalize(element.getAttribute('aria-label') || '');
  const title = normalize(element.getAttribute('title') || '');
  const haystack = `${text} ${aria} ${title}`;

  return [
    'anamnese',
    'anamnese energetica',
    'meu diario',
    'diario de reconexao',
    'diario de bordo'
  ].some(term => haystack.includes(term));
};

const unlockCoreControl = (element: Element) => {
  if (!(element instanceof HTMLButtonElement || element instanceof HTMLAnchorElement)) return;
  if (!isCoreAccessControl(element)) return;

  // The observer watches these attributes: write only when they change so
  // applying the same access policy cannot starve rendering in a microtask loop.
  if (element.hasAttribute('disabled')) element.removeAttribute('disabled');
  if (element.getAttribute('aria-disabled') !== 'false') element.setAttribute('aria-disabled', 'false');
  for (const token of ['pointer-events-none', 'cursor-not-allowed', 'opacity-40', 'opacity-50']) {
    if (element.classList.contains(token)) element.classList.remove(token);
  }
  element.dataset.coreAccess = 'universal';
};

const applyUniversalCoreAccess = () => {
  document.documentElement.dataset.anamnesisDiaryAccess = 'universal';

  document.querySelectorAll('button, a').forEach(unlockCoreControl);

};

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const start = () => {
    applyUniversalCoreAccess();

    const observer = new MutationObserver(() => applyUniversalCoreAccess());
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'aria-disabled', 'class'] });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
}

export const UNIVERSAL_CORE_ACCESS = Object.freeze({
  anamnesis: true,
  diary: true,
  weeklyDiaryAnalysisDays: [7, 14, 21] as const,
  libraryVisibleToUsers: false
});
