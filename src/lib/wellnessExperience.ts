export type ArrivalState =
  | 'peace'
  | 'slow-down'
  | 'heavy-heart'
  | 'heavy-day'
  | 'restart'
  | 'me-time';

export interface ArrivalOption {
  id: ArrivalState;
  label: string;
  response: string;
}

export const ARRIVAL_OPTIONS: ArrivalOption[] = [
  { id: 'peace', label: 'Estou em paz', response: 'Que bom encontrar esse espaço dentro de você. Vamos cuidar dele com presença.' },
  { id: 'slow-down', label: 'Preciso desacelerar', response: 'Então não precisamos correr. Escolha apenas alguns minutos para voltar ao seu ritmo.' },
  { id: 'heavy-heart', label: 'Meu coração está apertado', response: 'Você não precisa resolver tudo agora. Podemos começar apenas criando um pouco de espaço para respirar.' },
  { id: 'heavy-day', label: 'Hoje está pesado', response: 'Então não vamos exigir mais de você agora. Vamos apenas encontrar um lugar para ficar por alguns minutos.' },
  { id: 'restart', label: 'Quero recomeçar', response: 'Recomeçar não precisa ser grande. Um pequeno gesto de cuidado já pode ser o primeiro passo.' },
  { id: 'me-time', label: 'Só quero um momento para mim', response: 'Este momento é seu. Sem desempenho, sem pressa e sem precisar provar nada.' },
];

export type SoundscapeId = 'silence' | 'nature' | 'meditation' | 'ambient' | 'frequency';

export const SOUNDSCAPES = [
  { id: 'silence' as const, label: 'Silêncio' },
  { id: 'nature' as const, label: 'Natureza' },
  { id: 'meditation' as const, label: 'Meditação' },
  { id: 'ambient' as const, label: 'Som ambiente suave' },
  { id: 'frequency' as const, label: 'Frequências' },
];

export const GUIDED_MEDITATION_PRICE_BRL = 10;

export interface GuidedMeditationOffer {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  previewSeconds: number;
  priceBRL: number;
  access: 'permanent';
}

export const GUIDED_MEDITATIONS: GuidedMeditationOffer[] = [
  { id: 'slow-down', title: 'Para desacelerar', description: 'Uma pausa guiada para diminuir o ritmo e voltar ao presente.', durationMinutes: 10, previewSeconds: 45, priceBRL: GUIDED_MEDITATION_PRICE_BRL, access: 'permanent' },
  { id: 'difficult-days', title: 'Para dias difíceis', description: 'Acolhimento e presença para atravessar um momento exigente sem promessas clínicas.', durationMinutes: 12, previewSeconds: 45, priceBRL: GUIDED_MEDITATION_PRICE_BRL, access: 'permanent' },
  { id: 'sleep', title: 'Antes de dormir', description: 'Uma transição suave para encerrar o dia e preparar o descanso.', durationMinutes: 15, previewSeconds: 45, priceBRL: GUIDED_MEDITATION_PRICE_BRL, access: 'permanent' },
  { id: 'self-compassion', title: 'Autocompaixão', description: 'Um encontro guiado com gentileza, limites e cuidado consigo.', durationMinutes: 12, previewSeconds: 45, priceBRL: GUIDED_MEDITATION_PRICE_BRL, access: 'permanent' },
];

export const COMMERCIAL_PRINCIPLE = 'A pessoa pode pagar para aprofundar a experiência — nunca para merecer acolhimento.';

export const ENERGIZED_PROTOCOLS = [
  { id: '7-days', label: 'Protocolo de 7 Dias', badge: 'Prática Energizada' },
  { id: '21-days', label: 'Protocolo de 21 Dias', badge: 'Prática Energizada' },
  { id: 'saint-michael', label: 'Protocolos de São Miguel', badge: 'Prática Energizada' },
] as const;

export const CHAKRA_DAILY_VISUALS = [
  { day: 1, id: 'muladhara', name: 'Muladhara', label: 'Chakra Raiz', tone: 'vermelho' },
  { day: 2, id: 'svadhisthana', name: 'Svadhisthana', label: 'Chakra Sacral', tone: 'laranja' },
  { day: 3, id: 'manipura', name: 'Manipura', label: 'Plexo Solar', tone: 'amarelo' },
  { day: 4, id: 'anahata', name: 'Anahata', label: 'Chakra Cardíaco', tone: 'verde' },
  { day: 5, id: 'vishuddha', name: 'Vishuddha', label: 'Chakra Laríngeo', tone: 'azul' },
  { day: 6, id: 'ajna', name: 'Ajna', label: 'Chakra Frontal', tone: 'índigo' },
  { day: 7, id: 'sahasrara', name: 'Sahasrara', label: 'Chakra Coronário', tone: 'violeta' },
] as const;
