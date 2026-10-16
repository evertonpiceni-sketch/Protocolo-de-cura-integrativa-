const CORE_BENEFIT_TEXT = 'Anamnese Energética + Diário de desabafo incluídos';

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

  if (element.hasAttribute('disabled')) element.removeAttribute('disabled');
  if (element.getAttribute('aria-disabled') !== 'false') element.setAttribute('aria-disabled', 'false');
  for (const token of ['pointer-events-none', 'cursor-not-allowed', 'opacity-40', 'opacity-50']) {
    if (element.classList.contains(token)) element.classList.remove(token);
  }
  element.dataset.coreAccess = 'universal';
};

const addCoreBenefitToPlanCard = (card: Element) => {
  if (card.querySelector('[data-universal-core-benefit="true"]')) return;

  const marker = document.createElement('div');
  marker.dataset.universalCoreBenefit = 'true';
  marker.className = 'mt-3 rounded-xl border border-[#D8CBA8]/45 bg-[#FBF8EF]/70 px-3 py-2 text-[11px] font-medium leading-5 text-[#355548]';
  marker.textContent = CORE_BENEFIT_TEXT;
  card.appendChild(marker);
};

const patchPlanPresentation = (root: ParentNode) => {
  const planRoots = [
    root.querySelector?.('#plans-modal'),
    root.querySelector?.('#plans-values-guide-modal')
  ].filter(Boolean) as Element[];

  for (const planRoot of planRoots) {
    const candidates = Array.from(planRoot.querySelectorAll('article, [class*="rounded-3xl"], [class*="rounded-2xl"]'));
    for (const candidate of candidates) {
      const text = normalize(candidate.textContent || '');
      const looksLikePlan = /r\$|jornada|plano|tratamento|pro mensal|pro trimestral|pro semestral|pro anual/.test(text);
      if (looksLikePlan && candidate.querySelector('button')) addCoreBenefitToPlanCard(candidate);
    }
  }
};

const applyUniversalCoreAccess = () => {
  document.documentElement.dataset.anamnesisDiaryAccess = 'universal';

  document.querySelectorAll('button, a').forEach(unlockCoreControl);
  patchPlanPresentation(document);
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
