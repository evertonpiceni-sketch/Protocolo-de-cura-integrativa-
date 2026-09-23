import { useEffect, useState } from 'react';
import type { UserProfile } from '../types';

export type VisualTheme = NonNullable<UserProfile['visualTheme']>;

export const VISUAL_THEMES: ReadonlyArray<{ id: VisualTheme; name: string; image: string }> = [
  { id: 'natural-sereno', name: 'Natural Sereno', image: '/brand/official-themes/natural-sereno.png' },
  { id: 'elegancia-profunda', name: 'Elegância Profunda', image: '/brand/official-themes/elegancia-profunda.png' },
  { id: 'essencia-luminosa', name: 'Essência Luminosa', image: '/brand/official-themes/essencia-luminosa.png' },
  { id: 'mistico-moderno', name: 'Místico Moderno', image: '/brand/official-themes/mistico-moderno.png' },
];

type Props = {
  current: VisualTheme;
  onConfirm: (theme: VisualTheme) => Promise<void>;
  firstAccess?: boolean;
};

export default function VisualThemePicker({ current, onConfirm, firstAccess = false }: Props) {
  const [selected, setSelected] = useState<VisualTheme>(current);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => setSelected(current), [current]);

  const confirm = async () => {
    setSaving(true);
    setError('');
    try { await onConfirm(selected); }
    catch { setError('Não foi possível salvar sua escolha. Tente novamente.'); }
    finally { setSaving(false); }
  };

  return (
    <section className={`ep-theme-choice ${firstAccess ? 'ep-theme-choice--first' : ''}`} aria-labelledby="theme-choice-title">
      <div className="ep-theme-choice-inner">
        <h1 id="theme-choice-title">{firstAccess ? 'Escolha como deseja viver sua experiência' : 'Aparência'}</h1>
        {!firstAccess && <p>Escolha o estilo visual da sua experiência</p>}
        <div className="ep-theme-choice-grid" role="radiogroup" aria-label="Modelos visuais">
          {VISUAL_THEMES.map(({ id, name, image }) => (
            <button key={id} type="button" className={`ep-theme-choice-card ep-theme-choice-card--${id}`}
              role="radio" aria-checked={selected === id} onClick={() => setSelected(id)}>
              <span className="ep-theme-choice-art"><img src={image} alt={`Prancha oficial: ${name}`} /></span>
              <span className="ep-theme-choice-name">{name}</span>
              <span className="ep-theme-choice-indicator" aria-hidden="true">{selected === id ? 'Selecionado' : 'Selecionar'}</span>
            </button>
          ))}
        </div>
        {error && <p role="alert" className="ep-theme-choice-error">{error}</p>}
        <button type="button" className="ep-theme-choice-confirm" disabled={saving} onClick={confirm}>
          {saving ? 'Salvando…' : firstAccess ? 'Confirmar e entrar' : 'Aplicar aparência'}
        </button>
      </div>
    </section>
  );
}
