import React, { useEffect, useState } from 'react';
import { Moon, Sun, Leaf } from 'lucide-react';
import { EvertonTheme, getEvertonTheme, setEvertonTheme } from '../theme-choice';

const options: Array<{ id: EvertonTheme; label: string; title: string; Icon: typeof Sun }> = [
  { id: 'light', label: 'Claro', title: 'Leveza · Natureza · Equilíbrio', Icon: Sun },
  { id: 'green', label: 'Verde', title: 'Harmonia · Vitalidade · Renovação', Icon: Leaf },
  { id: 'dark', label: 'Escuro', title: 'Profundidade · Foco · Intuição', Icon: Moon },
];

export default function ThemeSelector() {
  const [theme, setTheme] = useState<EvertonTheme>(() => getEvertonTheme());

  useEffect(() => {
    const sync = (event: Event) => setTheme((event as CustomEvent<EvertonTheme>).detail || getEvertonTheme());
    window.addEventListener('everton-theme-change', sync);
    return () => window.removeEventListener('everton-theme-change', sync);
  }, []);

  return (
    <div className="ep-theme-selector" role="group" aria-label="Escolha o tema visual do aplicativo">
      {options.map(({ id, label, title, Icon }) => (
        <button key={id} type="button" aria-label={`Tema ${label}: ${title}`} title={`Tema ${label} — ${title}`} aria-pressed={theme === id}
          onClick={() => { setEvertonTheme(id); setTheme(id); }}>
          <Icon size={17} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
