export type EvertonTheme = 'light' | 'green' | 'dark';

const STORAGE_KEY = 'everton-piceni-app-theme';
const DEFAULT_THEME: EvertonTheme = 'light';

const isTheme = (value: string | null): value is EvertonTheme =>
  value === 'light' || value === 'green' || value === 'dark';

export const getEvertonTheme = (): EvertonTheme => {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isTheme(stored) ? stored : DEFAULT_THEME;
};

export const applyEvertonTheme = (theme: EvertonTheme) => {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.evertonTheme = theme;
  document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
};

export const setEvertonTheme = (theme: EvertonTheme) => {
  if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, theme);
  applyEvertonTheme(theme);
  window.dispatchEvent(new CustomEvent('everton-theme-change', { detail: theme }));
};

export const initEvertonTheme = () => applyEvertonTheme(getEvertonTheme());
