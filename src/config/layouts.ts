export type LayoutId =
  | 'natural-sereno'
  | 'elegancia-profunda'
  | 'essencia-luminosa'
  | 'mistico-moderno';

export interface LayoutDefinition {
  id: LayoutId;
  name: string;
  description: string;
  swatches: [string, string, string, string];
  tone: 'light' | 'dark';
}

export const DEFAULT_LAYOUT: LayoutId = 'natural-sereno';

export const OFFICIAL_LAYOUTS: LayoutDefinition[] = [
  {
    id: 'natural-sereno',
    name: 'Natural Sereno',
    description: 'Natureza, profundidade orgânica, dourado suave e presença acolhedora.',
    swatches: ['#2D4A3E', '#4A6E5F', '#F5EFE6', '#B38634'],
    tone: 'light'
  },
  {
    id: 'elegancia-profunda',
    name: 'Elegância Profunda',
    description: 'Sofisticação, contraste refinado e presença contemplativa.',
    swatches: ['#0B1712', '#2E6B4F', '#D4AF37', '#132A1F'],
    tone: 'dark'
  },
  {
    id: 'essencia-luminosa',
    name: 'Essência Luminosa',
    description: 'Leveza, luz, respiro e delicadeza visual.',
    swatches: ['#FFFFF8', '#F7F3E8', '#7E9680', '#C29648'],
    tone: 'light'
  },
  {
    id: 'mistico-moderno',
    name: 'Místico Moderno',
    description: 'Espiritualidade contemporânea com acabamento limpo e simbologia sutil.',
    swatches: ['#0A0F18', '#141F30', '#6C3FA0', '#D4AF37'],
    tone: 'dark'
  }
];

export function isLayoutId(value: unknown): value is LayoutId {
  return OFFICIAL_LAYOUTS.some(layout => layout.id === value);
}

export function normalizeLayoutId(value: unknown): LayoutId {
  return isLayoutId(value) ? value : DEFAULT_LAYOUT;
}
