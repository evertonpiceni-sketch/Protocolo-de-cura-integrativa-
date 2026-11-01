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
    description: 'Natureza realista, base creme/marfim, café, dourado refinado e verde apenas como acento natural.',
    swatches: ['#FAF7F2', '#2A2421', '#6B7A4B', '#C89D52'],
    tone: 'light'
  },
  {
    id: 'elegancia-profunda',
    name: 'Elegância Profunda',
    description: 'Natureza integrada, verde profundo intencional, dourado nobre/champagne/bronze e marfim em uma composição sofisticada, contemplativa e elegante.',
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
    description: 'Espiritualidade com tecnologia, fundo noturno sofisticado, índigo e violeta com dourado elegante.',
    swatches: ['#0A0F18', '#6C3FA0', '#D4AF37', '#141F30'],
    tone: 'dark'
  }
];

export function isLayoutId(value: unknown): value is LayoutId {
  return OFFICIAL_LAYOUTS.some(layout => layout.id === value);
}

export function normalizeLayoutId(value: unknown): LayoutId {
  return isLayoutId(value) ? value : DEFAULT_LAYOUT;
}
