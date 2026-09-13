import type { TransformationalProtocol } from './protocols';

// IMPORTANTE: o nome do arquivo é parte da programação aprovada e não deve ser alterado.
export const REINTEGRACAO_AUDIO_FILENAME = 'REINTEGRAÇÃO À VIDA.mp3' as const;
export const REINTEGRACAO_AUDIO_URL = `/audio/${REINTEGRACAO_AUDIO_FILENAME}`;

export interface ReintegracaoStage {
  fromDay: number;
  toDay: number;
  title: string;
  focus: string[];
  crystalIntention: string;
  actionPrompt: string;
}

export const REINTEGRACAO_STAGES: ReintegracaoStage[] = [
  { fromDay: 1, toDay: 3, title: 'Eu permaneço', focus: ['Energia', 'Aterramento', 'Presença', 'Sustentação'], crystalIntention: 'Dissolução simbólica dos padrões associados ao esgotamento, imobilidade, sensação de peso e dificuldade de iniciar o movimento.', actionPrompt: 'Qual pequeno cuidado com seu corpo representa presença hoje?' },
  { fromDay: 4, toDay: 6, title: 'Eu volto a sentir', focus: ['Afeto', 'Prazer', 'Acolhimento', 'Amor-próprio'], crystalIntention: 'Dissolução simbólica dos padrões associados ao fechamento emocional, desvalorização pessoal e afastamento dos pequenos prazeres.', actionPrompt: 'O que pode fazer você se sentir 1% mais vivo hoje?' },
  { fromDay: 7, toDay: 9, title: 'Eu volto a escolher', focus: ['Percepção', 'Escolha', 'Iniciativa', 'Movimento'], crystalIntention: 'Apoio simbólico à percepção de ciclos repetitivos, hesitação e paralisia diante da ação, favorecendo a possibilidade de uma pequena resposta diferente.', actionPrompt: 'Qual é a menor escolha diferente que você pode transformar em ação hoje?' },
  { fromDay: 10, toDay: 12, title: 'Eu volto para mim', focus: ['Autoestima', 'Dignidade', 'Acolhimento', 'Amor-próprio'], crystalIntention: 'Dissolução simbólica dos padrões associados à autodesvalorização, autocobrança excessiva e dificuldade de reconhecer o próprio valor.', actionPrompt: 'Qual ato concreto demonstra que você está do seu próprio lado hoje?' },
  { fromDay: 13, toDay: 15, title: 'Eu volto ao mundo', focus: ['Movimento', 'Curiosidade', 'Contato', 'Participação'], crystalIntention: 'Dissolução simbólica dos padrões associados ao isolamento, resistência ao movimento e dificuldade de experimentar novamente o mundo externo.', actionPrompt: 'Qual pequeno movimento para fora do isolamento você fará hoje?' },
  { fromDay: 16, toDay: 18, title: 'Eu movimento meus caminhos', focus: ['Clareza', 'Direção', 'Oportunidade', 'Ação'], crystalIntention: 'Dissolução simbólica dos padrões que dificultam a percepção de possibilidades, tomada de decisão e movimento em direção aos caminhos disponíveis.', actionPrompt: 'Qual é o menor movimento real que você pode fazer hoje na direção que deseja?' },
  { fromDay: 19, toDay: 21, title: 'Eu reintegro a vida', focus: ['Energia', 'Vontade', 'Prazer', 'Autoestima', 'Paz', 'Direção', 'Esperança', 'Vida'], crystalIntention: 'Integração simbólica dos padrões abordados nas etapas anteriores, favorecendo continuidade e novas respostas por meio de escolhas e ações concretas.', actionPrompt: 'Qual ação representa hoje sua escolha de continuar participando da vida?' },
];

export const getReintegracaoStage = (day: number): ReintegracaoStage => {
  const normalized = Math.min(21, Math.max(1, Math.trunc(day || 1)));
  return REINTEGRACAO_STAGES.find(stage => normalized >= stage.fromDay && normalized <= stage.toDay) ?? REINTEGRACAO_STAGES[0];
};

export const REINTEGRACAO_ACCEPTANCE = 'Eu aceito conscientemente receber a prática e a programação energética correspondente ao meu dia na Jornada Reintegração à Vida, conforme programado e energizado neste áudio por Everton Rodrigo Piceni, respeitando meus limites, minha autonomia e minha liberdade de interromper a prática quando desejar.';

export const REINTEGRACAO_DA_VIDA: TransformationalProtocol = {
  id: 'reintegracao-da-vida',
  name: 'Reintegração à Vida',
  description: 'Jornada de 21 dias de meditação, presença e pequenas ações concretas para cultivar energia, movimento, autoestima, amor-próprio, serenidade e participação na vida.',
  durationDays: 21,
  baseCycleDays: 21,
  acceptanceText: REINTEGRACAO_ACCEPTANCE,
  dailyContent: Array.from({ length: 21 }, (_, index) => {
    const dayNumber = index + 1;
    const stage = getReintegracaoStage(dayNumber);
    return {
      dayNumber,
      title: stage.title,
      description: stage.actionPrompt,
      audioUrl: REINTEGRACAO_AUDIO_URL,
      durationMinutes: 30,
      immutableAudioFilename: REINTEGRACAO_AUDIO_FILENAME,
      focus: stage.focus,
      crystalIntention: stage.crystalIntention,
    };
  }),
  energyMatrix: {
    stages: REINTEGRACAO_STAGES,
    metadata: {
      goldenLightSource: 'sustentação contínua conforme a prática espiritual do usuário',
      crystalChangesOnDays: [4, 7, 10, 13, 16, 19],
      programmedAndEnergizedBy: 'Everton Rodrigo Piceni',
      activationRequiresConsentAndPlayback: true,
      audioFilenameLocked: true,
      audioFilename: REINTEGRACAO_AUDIO_FILENAME,
    },
  },
  playerConfiguration: {
    sessionDurationMinutes: 30,
    allowSeek: true,
    backgroundMusicType: 'uploaded-programmed-audio',
    preserveOriginalFilename: true,
  },
  completionRules: {
    requireJournal: false,
    minimumListenTimeSeconds: 0,
    allowSkip: false,
    requireConsentBeforePlayback: true,
    requireActionPromptAfterPlayback: true,
  },
};
