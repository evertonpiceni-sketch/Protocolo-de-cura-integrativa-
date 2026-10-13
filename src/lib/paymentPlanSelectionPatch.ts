const PREFERRED_PLAN_KEY = 'preferred_checkout_plan';

const CTA_TO_PLAN: Record<string, string> = {
  'Escolher acesso de 7 dias': 'jornada_7d',
  'Escolher acesso de 21 dias': 'jornada_21d',
  'Escolher Mensal': 'mensal',
  'Escolher Trimestral': 'trimestral',
  'Escolher Semestral': 'semestral',
  'Escolher Anual': 'anual',
};

const PLAN_TO_TITLE: Record<string, string> = {
  jornada_7d: 'Acesso avulso — 7 dias',
  jornada_21d: 'Acesso avulso — 21 dias',
  mensal: 'Plano Mensal',
  trimestral: 'Plano Trimestral',
  semestral: 'Plano Semestral',
  anual: 'Plano Anual',
};

function rememberGuideSelection(event: Event) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const button = target.closest('#plans-values-guide-modal button');
  if (!(button instanceof HTMLButtonElement)) return;
  const planId = CTA_TO_PLAN[button.textContent?.trim() || ''];
  if (!planId) return;
  try {
    window.sessionStorage.setItem(PREFERRED_PLAN_KEY, planId);
  } catch {
    // Privacy-restricted browsers can deny sessionStorage; checkout keeps its approved default.
  }
}

function applyRememberedSelection() {
  const modal = document.getElementById('plans-modal');
  if (!modal) return;

  let planId = '';
  try {
    planId = window.sessionStorage.getItem(PREFERRED_PLAN_KEY) || '';
  } catch {
    return;
  }
  const title = PLAN_TO_TITLE[planId];
  if (!title) return;

  const article = Array.from(modal.querySelectorAll('article')).find((candidate) =>
    candidate.querySelector('h4')?.textContent?.trim() === title
  );
  if (!article) return;
  const chooseButton = Array.from(article.querySelectorAll('button')).find((candidate) =>
    candidate.textContent?.trim() === 'Escolher'
  );
  if (!(chooseButton instanceof HTMLButtonElement)) return;

  try {
    window.sessionStorage.removeItem(PREFERRED_PLAN_KEY);
  } catch {
    // Selection can still be applied for the current render.
  }
  chooseButton.click();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('click', rememberGuideSelection, true);
  const observer = new MutationObserver(() => applyRememberedSelection());
  const start = () => {
    if (!document.body) return;
    observer.observe(document.body, { childList: true, subtree: true });
    applyRememberedSelection();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}
