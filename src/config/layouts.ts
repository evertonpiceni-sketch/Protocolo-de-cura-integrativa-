export type LayoutId =
  | 'natural-sereno'
  | 'elegancia-profunda'
  | 'essencia-luminosa'
  | 'mistico-moderno';

export interface LayoutDefinition {
  id: LayoutId;
  name: string;
  description: string;
}

export const DEFAULT_LAYOUT: LayoutId = 'natural-sereno';

export const OFFICIAL_LAYOUTS: LayoutDefinition[] = [
  {
    id: 'natural-sereno',
    name: 'Natural Sereno',
    description: 'Natureza, profundidade orgânica, dourado suave e presença acolhedora.'
  },
  {
    id: 'elegancia-profunda',
    name: 'Elegância Profunda',
    description: 'Sofisticação, contraste refinado e presença contemplativa.'
  },
  {
    id: 'essencia-luminosa',
    name: 'Essência Luminosa',
    description: 'Leveza, luz, respiro e delicadeza visual.'
  },
  {
    id: 'mistico-moderno',
    name: 'Místico Moderno',
    description: 'Espiritualidade contemporânea com acabamento limpo e simbologia sutil.'
  }
];

export function isLayoutId(value: unknown): value is LayoutId {
  return OFFICIAL_LAYOUTS.some(layout => layout.id === value);
}

export function normalizeLayoutId(value: unknown): LayoutId {
  return isLayoutId(value) ? value : DEFAULT_LAYOUT;
}
