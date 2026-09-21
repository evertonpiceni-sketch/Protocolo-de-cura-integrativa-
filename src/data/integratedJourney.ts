export type IntegratedJourneyDuration = 7 | 14 | 21;
export type IntegratedJourneyKey = '7d' | '14d' | '21d';

export type IntegratedJourneyCycle =
  | 'presenca-protecao'
  | 'transmutacao-libertacao'
  | 'integracao-recomeco';

export interface IntegratedJourneyPhase {
  id: 'opening' | 'michael' | 'violet' | 'raphael' | 'integration' | 'return';
  label: string;
  start: string;
  end: string;
  quality: string;
  visual: string;
}

export interface IntegratedJourneyDay {
  day: number;
  cycle: IntegratedJourneyCycle;
  title: string;
  intention: string;
  michaelPhase: string;
  violetPhase: string;
  raphaelPhase: string;
  integrationPhase: string;
  journalQuestion: string;
  audioPath: string;
  videoPath: string;
  posterPath: string;
}

export interface IntegratedJourneyOption {
  key: IntegratedJourneyKey;
  duration: IntegratedJourneyDuration;
  label: string;
  description: string;
}

export const INTEGRATED_JOURNEY_OPTIONS: IntegratedJourneyOption[] = [
  {
    key: '7d',
    duration: 7,
    label: '7 Dias — Essencial',
    description: 'Presença, proteção, liberação e recomposição inicial.',
  },
  {
    key: '14d',
    duration: 14,
    label: '14 Dias — Aprofundamento',
    description: 'Aprofunda limites, vínculos, autocobrança, confiança e autonomia.',
  },
  {
    key: '21d',
    duration: 21,
    label: '21 Dias — Integração Completa',
    description: 'Travessia completa em três ciclos: presença, transmutação e recomeço.',
  },
];

export const INTEGRATED_DAILY_PHASES: IntegratedJourneyPhase[] = [
  {
    id: 'opening',
    label: 'Abertura, Presença e Ancoragem no Corpo',
    start: '00:00',
    end: '04:00',
    quality: 'Chegada ao corpo, respiração e presença.',
    visual: 'Estado inicial contido; corpo neutro e anatômico ganhando presença.',
  },
  {
    id: 'michael',
    label: 'São Miguel',
    start: '04:00',
    end: '09:00',
    quality: 'Proteção, firmeza, limites e sustentação.',
    visual: 'Azul-safira e dourado estabelecem chão, contorno e estabilidade.',
  },
  {
    id: 'violet',
    label: 'Chama Violeta',
    start: '09:00',
    end: '14:00',
    quality: 'Transmutação simbólica, desapego e liberação.',
    visual: 'Violeta percorre simbolicamente tensões e padrões ligados ao tema do dia.',
  },
  {
    id: 'raphael',
    label: 'Arcanjo Rafael',
    start: '14:00',
    end: '20:00',
    quality: 'Acolhimento, repouso, recomposição interior e vitalidade percebida.',
    visual: 'Verde-esmeralda e dourado trazem acolhimento, reorganização e sensação de renovação.',
  },
  {
    id: 'integration',
    label: 'Integração das Três Qualidades',
    start: '20:00',
    end: '26:00',
    quality: 'Absorção silenciosa e integração.',
    visual: 'Azul, violeta, esmeralda e dourado se harmonizam sem excesso de efeitos.',
  },
  {
    id: 'return',
    label: 'Selamento e Retorno Suave',
    start: '26:00',
    end: '29:57',
    quality: 'Selamento simbólico, retorno e pergunta vivencial.',
    visual: 'Estado final estável, luminoso, presente e integrado.',
  },
];

const day = (
  day: number,
  cycle: IntegratedJourneyCycle,
  title: string,
  intention: string,
  journalQuestion: string,
): IntegratedJourneyDay => ({
  day,
  cycle,
  title,
  intention,
  michaelPhase: 'Estabelecer proteção, firmeza, limites e sustentação aplicados ao tema do dia.',
  violetPhase: 'Transmutar simbolicamente excessos, padrões e pesos relacionados ao tema do dia.',
  raphaelPhase: 'Acolher, integrar e favorecer sensação de renovação, repouso e vitalidade percebida.',
  integrationPhase: 'Integrar as três qualidades em uma experiência única, contínua e coerente.',
  journalQuestion,
  audioPath: `/audio/jornada-integrada/dia-${day}.mp3`,
  videoPath: `/videos/jornada-integrada/dia-${day}.mp4`,
  posterPath: `/videos/jornada-integrada/posters/dia-${day}.webp`,
});

export const INTEGRATED_JOURNEY_DAYS: IntegratedJourneyDay[] = [
  day(1, 'presenca-protecao', 'Presença, proteção e chão', 'Chegar ao corpo, perceber o chão e estabelecer uma base interna de segurança.', 'O que me ajuda a permanecer presente hoje?'),
  day(2, 'presenca-protecao', 'Corte de excessos e liberação', 'Reconhecer excessos e abrir espaço para o que é essencial.', 'O que posso soltar sem me abandonar?'),
  day(3, 'presenca-protecao', 'Transmutação de padrões repetitivos', 'Observar um padrão recorrente e experimentar uma resposta mais consciente.', 'Qual padrão eu reconheço e qual pequena escolha diferente posso fazer?'),
  day(4, 'presenca-protecao', 'Alívio de tensões e reorganização interior', 'Perceber tensões e favorecer um estado de maior organização interna.', 'Onde meu corpo pede mais espaço e gentileza?'),
  day(5, 'presenca-protecao', 'Coração, acolhimento e perdão', 'Cultivar acolhimento, compaixão e abertura para o perdão possível.', 'O que em mim precisa ser acolhido antes de ser transformado?'),
  day(6, 'presenca-protecao', 'Coragem, vitalidade e movimento', 'Reconectar-se com coragem tranquila e disposição para um próximo passo.', 'Qual movimento pequeno e verdadeiro posso iniciar?'),
  day(7, 'presenca-protecao', 'Integração, selamento e continuidade', 'Integrar a primeira etapa e reconhecer recursos construídos ao longo da semana.', 'O que quero levar comigo para a próxima etapa?'),

  day(8, 'transmutacao-libertacao', 'Limites conscientes e discernimento', 'Perceber limites com clareza e escolher onde investir presença e energia.', 'Onde um limite claro pode proteger o que é importante para mim?'),
  day(9, 'transmutacao-libertacao', 'Vínculos e desapego', 'Observar vínculos, expectativas e a possibilidade de desapego com respeito.', 'O que posso amar sem precisar controlar?'),
  day(10, 'transmutacao-libertacao', 'Culpa, cobrança interna e reconciliação', 'Reconhecer autocobranças e abrir espaço para uma relação interna mais justa.', 'Que cobrança posso transformar em responsabilidade sem punição?'),
  day(11, 'transmutacao-libertacao', 'Mágoas antigas e abertura do peito', 'Dar espaço às emoções antigas sem precisar permanecer preso a elas.', 'O que eu reconheço hoje sem precisar carregar do mesmo jeito?'),
  day(12, 'transmutacao-libertacao', 'Confiança e segurança interior', 'Fortalecer referências internas de confiança e presença.', 'Que evidência de força e capacidade já existe em mim?'),
  day(13, 'transmutacao-libertacao', 'Autonomia e soberania pessoal', 'Reafirmar escolhas próprias com respeito aos vínculos e aos próprios limites.', 'Qual escolha minha precisa voltar para as minhas mãos?'),
  day(14, 'transmutacao-libertacao', 'Integração da nova postura', 'Consolidar aprendizados e reconhecer uma postura interna mais consciente.', 'O que mudou na forma como eu me posiciono diante de mim e do mundo?'),

  day(15, 'integracao-recomeco', 'Reabertura para a vida com limites conscientes', 'Abrir-se ao novo sem abandonar os limites construídos.', 'A que quero dizer sim sem dizer não a mim?'),
  day(16, 'integracao-recomeco', 'Vitalidade fluida e desbloqueio da ação', 'Favorecer movimento gradual e continuidade prática.', 'Qual ação simples pode devolver fluxo ao meu dia?'),
  day(17, 'integracao-recomeco', 'Coerência entre mente, coração e corpo', 'Aproximar pensamento, sentimento e ação em torno do que importa.', 'Onde posso agir de forma mais coerente com o que sinto e penso?'),
  day(18, 'integracao-recomeco', 'Movimento seguro no mundo', 'Levar a presença construída para decisões e relações cotidianas.', 'Como posso ocupar meu espaço com firmeza e gentileza?'),
  day(19, 'integracao-recomeco', 'Reconciliação com a própria história', 'Reconhecer a própria trajetória com mais integração e menos luta interna.', 'Que parte da minha história posso olhar hoje com mais compreensão?'),
  day(20, 'integracao-recomeco', 'Enraizamento da paz interior', 'Fortalecer uma presença estável que possa acompanhar a vida cotidiana.', 'Que prática simples ajuda minha paz a ganhar raízes?'),
  day(21, 'integracao-recomeco', 'Integração da jornada e novo começo', 'Reconhecer a travessia concluída e abrir espaço para continuidade autônoma.', 'O que significa para mim poder dizer: “Você não precisa mais voltar para si. Você chegou.”?'),
];

export const getIntegratedJourneyDuration = (journey: IntegratedJourneyKey): IntegratedJourneyDuration =>
  journey === '7d' ? 7 : journey === '14d' ? 14 : 21;

export const getIntegratedJourneyDays = (duration: IntegratedJourneyDuration): IntegratedJourneyDay[] =>
  INTEGRATED_JOURNEY_DAYS.slice(0, duration);

export const getIntegratedJourneyDay = (
  dayNumber: number,
  duration: IntegratedJourneyDuration,
): IntegratedJourneyDay => {
  const safeDay = Math.min(Math.max(1, dayNumber), duration);
  return INTEGRATED_JOURNEY_DAYS[safeDay - 1];
};

export const getJourneyDurationRecommendation = (
  depth: 'pontual' | 'aprofundamento' | 'ampla',
): IntegratedJourneyDuration => {
  if (depth === 'pontual') return 7;
  if (depth === 'aprofundamento') return 14;
  return 21;
};

export const INTEGRATED_JOURNEY_WELLNESS_NOTICE =
  'Esta jornada é uma prática integrativa de bem-estar espiritual e não substitui diagnóstico, tratamento ou acompanhamento médico, psicológico ou psiquiátrico quando necessários.';
