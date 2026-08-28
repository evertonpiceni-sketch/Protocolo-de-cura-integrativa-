/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SessionCheckIn {
  mood: number; // 1 to 5
  stateTitle?: string; // e.g. "Ansioso", "Neutro", "Renovado", etc.
  notes: string;
  sensations: string[];
  loggedAt: string;
}

export interface DayProgress {
  dayNumber: number;
  completed: boolean;
  completedAt?: string; // ISO date string
  journalText?: string;
  mood?: number; // 1 to 5 scale (1: Heavy, 5: Completely Peaceful)
  beforeFeeling?: SessionCheckIn;
  afterFeeling?: SessionCheckIn;
  systemicAnswer?: string;
  systemicAnsweredAt?: string;
}

export interface SpecificTreatment {
  id: string;
  requestedAt: string;
  durationDays?: 1 | 7 | 21; // 1 dia (sessão única), 7 dias ou 21 dias
  category: 'prosperidade' | 'saude_fisica' | 'liberacao_emocional' | 'relacionamentos' | 'limpeza_espiritual' | 'outro';
  title: string;
  patientDescription: string;
  urgentPains: string[];
  status: 'pendente' | 'aprovado' | 'ativo' | 'concluido';
  price: number; // R$ 59.90
  paymentMethod: 'pix' | 'cartao';
  therapistNotes?: string;
  customChannelingTheme?: string;
  assignedFrequency?: '396hz' | '528hz' | '432hz' | '639hz' | '741hz' | '852hz' | '963hz' | '417hz' | 'waves' | 'florestazen' | 'chuvaserena';
  targetDecree?: string;
  whatsappMessageUrl?: string;
}

export interface AiAnamnesisResult {
  paciente_nome: string;
  padrao_emocional_detectado: string;
  ciclo_recomendado: string;
  justificativa_terapeutica: string;
  receita_integrativa?: {
    floral_bach: string;
    floral_instrucao: string;
    aromaterapia_oleo: string;
    aromaterapia_instrucao: string;
  };
  matriz_vibracional_audio: Array<{
    tempo: string;
    simbolo: string;
    acao_sutil: string;
  }>;
  trava_paywall_mensagem?: string;
  nota_terapeutica_disclaimer: string;
  status_servidor: string;
}

export interface AnamnesisData {
  filledAt: string;
  mainComplaints: string[];
  complaintNotes: string;
  stressLevel: number; // 1 to 10
  sleepQuality: 'pessimo' | 'ruim' | 'regular' | 'bom' | 'excelente';
  physicalSymptoms: string[];
  emotionalState: string[];
  chakraImbalance: string[];
  primaryGoal: string;
  goalDetails: string;
  dailyTimeAvailable: '10min' | '20min' | '30min+';
  recommendedFrequency: '396hz' | '528hz' | '432hz' | '639hz' | '741hz' | '852hz' | '963hz' | '417hz' | 'waves' | 'florestazen' | 'chuvaserena';
  prescribedFocus: string;
  recommendedFloral?: string;
  recommendedAromatherapy?: string;
  customDecree: string;
  aiAnalysis?: AiAnamnesisResult;
}

export type JourneyType = '7d' | '21d';

export type SubscriptionPlanType = 'teste_vip_7d' | 'jornada_7d' | 'semanal' | 'mensal' | 'trimestral' | 'semestral' | 'anual';

export interface AstralElementBalance {
  fire: number;   // Fogo %
  earth: number;  // Terra %
  air: number;    // Ar %
  water: number;  // Água %
}

export interface PlanetaryPlacement {
  planet: string;
  planetSymbol: string;
  sign: string;
  signSymbol: string;
  house: number;
  spiritualMeaning: string;
}

export interface AstralMapData {
  sunSign: string;
  sunSignSymbol: string;
  sunSignElement: 'Fogo' | 'Terra' | 'Ar' | 'Água';
  sunSignModality: 'Cardinal' | 'Fixo' | 'Mutável';
  sunSignChakra: string;
  sunSignVirtue: string;
  sunSignMantra: string;
  sunDecanate?: string;
  sunDegree?: number;
  
  ascendantSign: string;
  ascendantSignSymbol: string;
  ascendantSignElement: 'Fogo' | 'Terra' | 'Ar' | 'Água';
  ascendantSignMeaning: string;
  ascendantHouseLord?: string;
  
  moonSign: string;
  moonSignSymbol: string;
  moonSignElement: 'Fogo' | 'Terra' | 'Ar' | 'Água';
  moonSignMeaning: string;

  midheavenSign?: string;
  midheavenSignSymbol?: string;
  midheavenMission?: string;

  planets?: PlanetaryPlacement[];

  dominantElement: 'Fogo' | 'Terra' | 'Ar' | 'Água';
  elementBalance: AstralElementBalance;
  suggestedFrequency: string;
  suggestedChakraHealing: string;
  suggestedCrystals?: string[];
  suggestedHerbsAromas?: string[];
  astralSpiritualGuidance: string;
  powerColor: string;
  soulMissionSummary?: string;
  isFullUnlocked?: boolean;
  practicalAttitudes?: {
    dailyPractices: string[];
    shadowWork: string[];
    elementHarmonization: string[];
    guidedMeditationPrompt: string;
  };
}

export interface NumerologyData {
  lifePathNumber: number;
  lifePathTitle: string;
  lifePathMeaning: string;
  lifePathKeywords: string[];
  
  soulNumber: number;
  soulMeaning: string;
  
  personalityNumber: number;
  personalityMeaning: string;
  
  expressionNumber: number;
  expressionMeaning: string;

  maturityNumber?: number;
  maturityMeaning?: string;
  
  personalYear: number;
  personalYearMeaning: string;
  personalYearGuidance: string;
  
  birthDayNumber: number;
  birthDayMeaning: string;
  
  karmicLessons: string[];
  
  harmonicColor: string;
  harmonicCrystal: string;
  suggestedFrequency: string;
  affirmation: string;
  isFullUnlocked?: boolean;

  nameProsperityAnalysis?: {
    currentNameVibration: number;
    currentVibrationMeaning: string;
    prosperityScore: number;
    recommendedNameHarmonizations: string[];
    signatureAdvice: string[];
    dailyProsperityAttitudes: string[];
  };
  practicalAttitudes?: string[];
}

export interface UserProfile {
  name: string;
  fullName: string;
  birthDate: string;
  birthTime?: string;
  birthCity?: string;
  email: string;
  phone?: string;
  login: string;
  startedAt?: string;
  reminderTime?: string; // Format: "HH:MM"
  currentStreak: number;
  longestStreak: number;
  audioEnabled: boolean;
  bgMusicVolume: number;
  voiceVolume: number;
  bgMusicType: '396hz' | '528hz' | '432hz' | '639hz' | '741hz' | '852hz' | '963hz' | '417hz' | 'waves' | 'florestazen' | 'chuvaserena' | 'none';
  healingFocuses?: string[]; // Array of custom healing focuses
  pauseDuration?: number; // Duration of silent pauses in seconds (e.g. 5, 10, 15)
  plan?: 'free' | 'pro';
  subscriptionPlan?: SubscriptionPlanType;
  subscriptionExpiresAt?: string;
  subscriptionPrice?: number;
  subscriptionPaymentMethod?: 'pix' | 'card' | 'cupom_vip';
  selectedJourney?: JourneyType;
  voiceId?: string;
  preferredVoice?: string;
  preferredVoiceGender?: 'masculina' | 'feminina';
  voiceRate?: number;
  voicePitch?: number;
  proActiveSince?: string;
  treatmentExpectations?: string; // O que se espera com este tratamento (intenção e metas)
  unlockedAchievements?: string[]; // IDs dos emblemas conquistados
  archangelPrayerCompletedDays?: number[]; // Dias de oração de Miguel
  hooponoponoPracticedCount?: number; // Vezes em que o Ho'oponopono foi praticado
  anamnesis?: AnamnesisData;
  specificTreatments?: SpecificTreatment[];
  astralMap?: AstralMapData;
  astralMapPurchased?: boolean;
  numerology?: NumerologyData;
  numerologyPurchased?: boolean;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  category: 'constancia' | 'jornada' | 'espiritual' | 'autoconhecimento';
  icon: string;
  points: number;
  requirementText: string;
}

export interface SystemicQuestionItem {
  day: number;
  theme: string;
  systemicLaw: string;
  question: string;
  guidedReflection: string;
  healingSentence: string;
  practicalAction: string;
}

export interface UserAccount {
  fullName: string;
  birthDate: string;
  birthTime?: string;
  birthCity?: string;
  email: string;
  phone?: string;
  login: string;
  password?: string;
  plan?: 'free' | 'pro';
  profile: UserProfile;
  progress: DayProgress[];
}

export enum ProtocolStage {
  ABERTURA = 'ABERTURA',
  ATERRAMENTO = 'ATERRAMENTO',
  VITALIDADE = 'VITALIDADE',
  TRANSMUTACAO = 'TRANSMUTACAO',
  BALSAMO = 'BALSAMO',
  SELAMENTO = 'SELAMENTO'
}

export interface StageContent {
  id: ProtocolStage;
  title: string;
  subtitle: string;
  text: string;
  durationSeconds: number; // Suggested duration if auto-playing
  colorTheme: {
    bg: string;
    glow: string;
    text: string;
    accent: string;
  };
}

export const PROTOCOL_STAGES: StageContent[] = [
  {
    id: ProtocolStage.ABERTURA,
    title: "Abertura e Decreto de Aceitação",
    subtitle: "Permissão Sagrada",
    text: "Eu [NOME], aceito receber nesse momento com todo o meu coração, o Protocolo de Cura Integrada de 21 dias, conforme canalizado e aplicado por Éverton Rodrigo Piceni.",
    durationSeconds: 20,
    colorTheme: {
      bg: "from-slate-900 to-indigo-950",
      glow: "rgba(99, 102, 241, 0.15)",
      text: "text-indigo-200",
      accent: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10"
    }
  },
  {
    id: ProtocolStage.ATERRAMENTO,
    title: "Aterramento e Purificação",
    subtitle: "Conexão com a Terra e Silêncio Mental",
    text: "Feche os olhos. Respire fundo... Puxe o ar pelo nariz, segure por três segundos... e solte devagar pela boca. Sinta o seu corpo físico relaxar na cadeira ou na cama. Deixe de lado as preocupações, os diagnósticos, os rótulos. Neste momento, você é apenas consciência e luz.\n\nImagine agora que raízes fortes saem da sola dos seus pés e da base da sua coluna, descendo profundamente até o coração da Terra. Sinta-se seguro, firme e aterrado.\n\nNeste momento, ativo o Benzi Reiki. Sinta uma mão ancestral e amorosa benzer a sua testa, o seu peito, as suas costas. Como um sopro de arruda, guiné e benjoim, toda a ansiedade, os pensamentos acelerados e o peso do dia começam a ser cortados e desfeitos agora. O seu campo está limpo. Respire fundo bem devagar trazendo para si a força, a coragem, segure o ar por 5 segundos, agora solte bem devagar, começando a deixar ir, tudo o que já não é necessário e sentindo o seus ombros relaxaram, a cabeça começa a ficar leve. Se permita relaxar nesse momento.",
    durationSeconds: 65,
    colorTheme: {
      bg: "from-stone-900 to-emerald-950",
      glow: "rgba(16, 185, 129, 0.15)",
      text: "text-emerald-200",
      accent: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
    }
  },
  {
    id: ProtocolStage.VITALIDADE,
    title: "Desbloqueio, Vitalidade e Alinhamento do Sistema Nervoso",
    subtitle: "Recalibração e Foco do Sistema Nervoso",
    text: "Ativo o Reiki Usui e o Kundalini Reiki. Sinta um calor suave e reconfortante subir pela sua coluna, desde a base até o topo da cabeça. Esse calor queima a apatia, a depressão e a exaustão do Burnout. Sinta a força vital retornando às suas células. Visualizamos agora o Reiki Cristalino e a Acupuntura Etérica Quântica. Pequenos cristais de luz pura se formam ao redor do seu corpo e nos seus órgãos, dissolvendo suavemente as memórias de dor celular. Agulhas feitas de pura luz dourada e azul são suavemente posicionadas nos pontos principais da sua cabeça e do seu corpo. Sinta essas agulhas invisíveis organizarem o fluxo de energia no seu cérebro. Elas trazem foco para o TDAH, acalmam o excesso de estímulos do Autismo e equilibram as correntes elétricas dos ciclos da Bipolaridade. Respire na certeza de que seu sistema nervoso está sendo recalibrado.\n\nRespire bem fundo novamente, sentindo a energia fluir em seu campo mental e emocional, indo diretamente na raíz das suas dores, mágoas, tristezas e ressignificando tudo isso. Agora solte o ar devagarinho, sentindo esse peso de emoções pesadas indo embora. Respire no seu tempo.",
    durationSeconds: 60,
    colorTheme: {
      bg: "from-blue-950 to-slate-900",
      glow: "rgba(234, 179, 8, 0.15)",
      text: "text-amber-200",
      accent: "border-amber-500/30 text-amber-400 bg-amber-500/10"
    }
  },
  {
    id: ProtocolStage.TRANSMUTACAO,
    title: "A Força do Imara, Transmutação e Proteção Psíquica",
    subtitle: "A Chama Violeta e o Escudo Safira",
    text: "Elevamos agora a nossa vibração para uma frequência de altíssima intensidade. Ativo o Imara Reiki. Deixe que essa energia veloz e poderosa penetre nas camadas mais escondidas da sua mente. O Imara atua diretamente nos traumas de vidas passadas, nas dores da infância e nas feridas do TEPT que você nem lembra que existem. Sinta essa força quebrando barreiras espirituais, dissipando as paranoias e acalmando a instabilidade do Borderline.\n\nPara sustentar essa limpeza profunda, ativo o Reiki de São Miguel e os símbolos Zonar e Halu do Karuna Ki. Uma poderosa cúpula de luz azul-safira se fecha ao seu redor. A Espada de São Miguel corta todos os cordões de autossabotagem. Dentro dessa cúpula azul, acendemos a Chama Violeta. Veja as feridas da alma e a culpa inconsciente serem queimadas e transmutadas em pura força de recomeço. O turbilhão passou. O caos foi limpo.\n\nRespire novamente: Respirando nesse momento a leveza, o perdão a si mesmo, a paz, o amor próprio. E inspire: Deixando ir a autosabotagem, o medo, o sentimento de rejeição. Lembre-se estamos juntos nesse processo. Eu estou aqui ao seu lado, lhe guiando para a sua melhora do quadro.",
    durationSeconds: 70,
    colorTheme: {
      bg: "from-violet-950 to-blue-950",
      glow: "rgba(139, 92, 246, 0.2)",
      text: "text-violet-200",
      accent: "border-purple-500/30 text-purple-400 bg-purple-500/10"
    }
  },
  {
    id: ProtocolStage.BALSAMO,
    title: "Amor Incondicional e Luz da Fonte",
    subtitle: "Amor Incondicional e Névoa Regeneradora",
    text: "Após a grande limpeza, sinta a energia se suavizar, tornando-se pura doçura. O Reiki Raio Rosa inunda o seu chakra cardíaco. Sinta uma luz rosa-quartzo expandir do seu peito. Ela cura a dor do abandono e da rejeição, preenchendo o seu ser com autoaceitação, compaixão e amor por sua própria jornada. O vazio da depressão é totalmente preenchido.\n\nConectamos agora com a Golden Light Source, a Fonte de Luz Dourada Primordial. Uma cascata de ouro líquido desce do topo da sua cabeça, iluminando cada átomo do seu corpo. Essa luz dourada se funde ao Raio de Ouro e Verde de São Rafael, promovendo uma regeneração biológica e espiritual completa nos seus pulmões, na sua mente e na sua alma. Você é perfeito, você é um reflexo da Fonte.\n\nRespire novamente e segure por 5 segundos e sinta o amor entrando em você, os pensamentos desacelrando, a caragaem vindo, a estabilidade chegando, sinta essa energia de reconexão contigo. Solte bem devagar e deixe ir todos aqueles sentimentos que outrora você nutria. Você é especial.",
    durationSeconds: 60,
    colorTheme: {
      bg: "from-rose-950 to-slate-900",
      glow: "rgba(244, 63, 94, 0.15)",
      text: "text-rose-200",
      accent: "border-rose-500/30 text-rose-300 bg-rose-500/10"
    }
  },
  {
    id: ProtocolStage.SELAMENTO,
    title: "Selamento com Ganesha e Decreto de Libertação",
    subtitle: "Estabilidade Cósmica e Mantras de Cura",
    text: "Para encerrar, selar e blindar este tratamento, ativo o Empoderamento de Ganesha. Sinta a presença magnífica e aterradora do removedor de obstáculos ao seu redor. Ganesha quebra todas as barreiras mentais, os bloqueios emocionais e as travas que impediam a sua evolução. Sinta uma força de prosperidade, estabilidade e poder pessoal preencher o seu Ori.\n\nVisualize-se agora sentado firmemente naquele trono do seu sonho. As nuvens sob você estão calmas. Ganesha se posiciona ao seu lado como um guardião. A \'nova chance\' foi dada, os caminhos estão abertos e o tratamento está totalmente selado no seu DNA cósmico.\n\n(Agora fale de forma pausada, sentindo cada palavra)\nEu sou livre para ser feliz.\nEu me perdoo por todas as vezes que duvidei de mim mesmo.\nEu sou cura.\nEu sou amor.\nEu estou em paz\nSinto muito.\nMe perdoe.\nEu te amo.\nSou grato.\nGratidão por ter chegado até aqui.",
    durationSeconds: 60,
    colorTheme: {
      bg: "from-amber-950 via-slate-900 to-indigo-950",
      glow: "rgba(251, 191, 36, 0.15)",
      text: "text-amber-100",
      accent: "border-amber-400/30 text-amber-300 bg-amber-400/10"
    }
  }
];

export interface DailyInsight {
  day: number;
  title: string;
  description: string;
  focus: string;
  quote: string;
  quoteAuthor?: string;
}

export const DAILY_INSIGHTS: DailyInsight[] = [
  { 
    day: 1, 
    title: "O Despertar da Decisão", 
    description: "O primeiro passo é o mais sagrado. Hoje você declara ao universo que está pronto para receber sua cura.", 
    focus: "Declarar aceitação e respirar profundamente.",
    quote: "A cura começa no exato instante em que você decide que merece viver em paz e harmonia.",
    quoteAuthor: "Éverton Rodrigo Piceni"
  },
  { 
    day: 2, 
    title: "Raízes de Sustentação", 
    description: "Fortalecendo seu aterramento com a Terra para acalmar as flutuações e a ansiedade da mente.", 
    focus: "Visualizar raízes de luz saindo de seus pés.",
    quote: "Quem possui raízes profundas na verdade do próprio ser não se abala com os ventos passageiros do mundo.",
    quoteAuthor: "Sabedoria Ancestral"
  },
  { 
    day: 3, 
    title: "Purificação das Águas", 
    description: "Limpando as memórias ancestrais de dor e abrindo espaço para o novo fluxo celular.", 
    focus: "Sentir o sopro sutil de ervas sagradas.",
    quote: "Permita que o passado escorra como água pura. Cada gota que se vai abre espaço para a sua renovação.",
    quoteAuthor: "Tradição de Cura"
  },
  { 
    day: 4, 
    title: "O Despertar da Força Vital", 
    description: "Ativando o calor na base da coluna para despertar a energia adormecida e dissolver a apatia.", 
    focus: "Acompanhar o calor subindo vértebra por vértebra.",
    quote: "A força vital divina que criou o cosmos habita em cada uma de suas células. Desperte-a com amor.",
    quoteAuthor: "Éverton Rodrigo Piceni"
  },
  { 
    day: 5, 
    title: "Clareza do Pensamento", 
    description: "Alinhando os pontos dourados e azuis em seu cérebro para silenciar os ruídos diários.", 
    focus: "Focar no espaço de silêncio entre os pensamentos.",
    quote: "No silêncio sereno da mente, a voz da intuição e da cura se torna clara como a luz da manhã.",
    quoteAuthor: "Mestres da Quietude"
  },
  { 
    day: 6, 
    title: "Dissolvendo Barreiras", 
    description: "Preparando as camadas profundas do inconsciente para transmutar dores antigas.", 
    focus: "Permitir que as barreiras emocionais invisíveis ruam.",
    quote: "Nenhuma muralha erguida pelo medo é mais forte que a suave luz do amor e da consciência desperta.",
    quoteAuthor: "Éverton Rodrigo Piceni"
  },
  { 
    day: 7, 
    title: "A Armadura Safira", 
    description: "Selando seu campo áurico em um escudo de luz azul-safira impenetrável contra a autossabotagem.", 
    focus: "Visualizar uma cúpula de luz azul brilhante ao seu redor.",
    quote: "Você é um templo sagrado. Proteja sua energia, honre seus limites e caminhe em segurança e graça.",
    quoteAuthor: "Raio Azul Cósmico"
  },
  { 
    day: 8, 
    title: "O Fogo da Transmutação", 
    description: "Entrando em contato com a Chama Violeta para converter mágoas acumuladas em puro recomeço.", 
    focus: "Entregar culpas e medos ao fogo violeta sem medo.",
    quote: "O que ontem doeu, hoje é entregue ao fogo da transmutação e transformado em sabedoria e luz.",
    quoteAuthor: "Chama Violeta"
  },
  { 
    day: 9, 
    title: "O Voo da Ave Sagrada", 
    description: "Desapegando-se das ilusões do ego sob a proteção silenciosa do cosmos.", 
    focus: "Sentir o repouso e silêncio das asas cósmicas.",
    quote: "Soltar não é perder; é abrir as mãos para receber a imensidão do que o Universo tem reservado para você.",
    quoteAuthor: "Sabedoria Universal"
  },
  { 
    day: 10, 
    title: "O Toque do Quartzo Rosa", 
    description: "Emanando amor incondicional a partir de seu peito para curar a dor oculta do abandono.", 
    focus: "Sentir um calor rosa-quartzo se expandindo no peito.",
    quote: "O amor incondicional por si mesmo é o remédio mais sagrado que existe. Abrace-se com toda a ternura.",
    quoteAuthor: "Éverton Rodrigo Piceni"
  },
  { 
    day: 11, 
    title: "Cascata de Luz Ouro", 
    description: "Recebendo do infinito um banho de ouro líquido que ilumina e regenera cada átomo.", 
    focus: "Visualizar e sentir a luz dourada fluindo no topo da cabeça.",
    quote: "Você é herdeiro da abundância divina. Deixe que a luz dourada preencha cada fresta do seu corpo e espírito.",
    quoteAuthor: "Canalização Solar"
  },
  { 
    day: 12, 
    title: "Sopro de Cura Verde-Oliva", 
    description: "Inalando a névoa verde-oliva brilhante para restaurar a saúde de seus pulmões e vias aéreas.", 
    focus: "Focar na regeneração respiratória e no frescor da névoa.",
    quote: "A cada inspiração você recebe a vitalidade da criação; a cada expiração você se liberta de todo o peso.",
    quoteAuthor: "Mestres de Cura"
  },
  { 
    day: 13, 
    title: "Alinhamento Céu e Terra", 
    description: "Encontrando o ponto de equilíbrio absoluto onde o cosmos e o planeta se unem em seu coração.", 
    focus: "Respirar na certeza de ser um reflexo perfeito da Fonte.",
    quote: "Você é a ponte viva entre o céu e a terra. Quando seu coração está em paz, todo o universo conspira ao seu favor.",
    quoteAuthor: "Éverton Rodrigo Piceni"
  },
  { 
    day: 14, 
    title: "A Presença Próspera", 
    description: "Ancorando uma força de solidez e prosperidade material e espiritual ao seu lado.", 
    focus: "Sentir os caminhos se abrindo e os obstáculos se quebrando.",
    quote: "Todos os caminhos que antes pareciam fechados agora se abrem com clareza, fluidez e prosperidade.",
    quoteAuthor: "Canalização de Abertura"
  },
  { 
    day: 15, 
    title: "O Trono de Nuvens", 
    description: "Sentar-se em sua soberania pessoal, observando o caos externo sem perder sua paz.", 
    focus: "Manter-se firme na estabilidade de seu trono interno.",
    quote: "O mundo ao redor pode estar em turbulência, mas dentro de você habita um trono inabalável de paz serena.",
    quoteAuthor: "Éverton Rodrigo Piceni"
  },
  { 
    day: 16, 
    title: "A Nova Chance", 
    description: "Seu DNA cósmico é atualizado com o padrão de saúde e merecimento original.", 
    focus: "Integrar o sentimento de renovação biológica.",
    quote: "Hoje você renasce para uma nova história. As velhas dores não definem quem você é hoje.",
    quoteAuthor: "Regeneração Celular"
  },
  { 
    day: 17, 
    title: "A Força do Autoperdão", 
    description: "Acolhendo as falhas do passado e liberando-se da pesada cobrança do julgamento interno.", 
    focus: "Pronunciar de coração: 'Eu me perdoo por duvidar de mim'.",
    quote: "Perdoar a si mesmo é o ato supremo de libertação. Você fez o melhor que pôde com o que sabia; agora é livre.",
    quoteAuthor: "Éverton Rodrigo Piceni"
  },
  { 
    day: 18, 
    title: "A Verdade do Ser: Cura", 
    description: "Reconhecendo que a cura não é algo externo, mas sua verdadeira natureza original.", 
    focus: "Repetir mentalmente: 'Eu sou cura, eu sou luz'.",
    quote: "Você não está quebrado. A cura não é consertar, mas lembrar a perfeita luz e integridade que você sempre foi.",
    quoteAuthor: "Consciência Primordial"
  },
  { 
    day: 19, 
    title: "Sinfonia da Gratidão", 
    description: "Conectando-se ao sentimento de ser grato por toda a jornada, inclusive pelos desafios.", 
    focus: "Sentir a vibração de 'Sou Grato' preencher o peito.",
    quote: "A gratidão é a chave dourada que abre as portas para milagres diários e expande a presença do amor.",
    quoteAuthor: "Éverton Rodrigo Piceni"
  },
  { 
    day: 20, 
    title: "O Círculo Ho'oponopono", 
    description: "Recitando as palavras de reconciliação para pacificar todas as relações e linhas de tempo.", 
    focus: "Entoar: Sinto Muito, Me Perdoe, Te Amo, Sou Grato.",
    quote: "Sinto muito. Me perdoe. Eu te amo. Sou grato. Quatro frases sagradas que pacificam a alma e curam o mundo.",
    quoteAuthor: "Tradição Ho'oponopono"
  },
  { 
    day: 21, 
    title: "Soberania Espiritual", 
    description: "O ciclo se completa. Você está blindado, livre, desperto e pronto para caminhar com autonomia.", 
    focus: "Gozar da libertação total e celebrar a conclusão do ciclo.",
    quote: "Você completou a jornada. A chama da cura agora brilha eternamente em seu coração, iluminando todos os seus passos.",
    quoteAuthor: "Éverton Rodrigo Piceni"
  }
];

export const JOURNEY_21D_INSIGHTS = DAILY_INSIGHTS;

export const JOURNEY_7D_INSIGHTS: DailyInsight[] = [
  {
    day: 1,
    title: "Chakra Raiz (Muladhara) • Aterramento & Segurança Primordial",
    description: "Conexão profunda com a Mãe Terra, dissolução do medo da escassez e ancoragem do sentimento de segurança absoluta.",
    focus: "Visualizar raízes vermelhas e douradas descendo dos pés até o centro cristalino da Terra.",
    quote: "Quando você está perfeitamente enraizado na sua verdade cósmica, nenhuma tempestade do mundo pode abalar a sua paz.",
    quoteAuthor: "Éverton Rodrigo Piceni"
  },
  {
    day: 2,
    title: "Chakra Sacral (Svadhisthana) • Purificação das Águas & Fluidez",
    description: "Liberação de culpas antigas, desbloqueio da criatividade e restauração da alegria de sentir e viver plenamente.",
    focus: "Sentir uma cascata de águas sagradas alaranjadas lavando o baixo-ventre e purificando emoções reprimidas.",
    quote: "Permita que o passado escorra como um rio cristalino. Cada mágoa liberada abre espaço para a sua verdadeira luz.",
    quoteAuthor: "Tradição Ancestral de Cura"
  },
  {
    day: 3,
    title: "Chakra Plexo Solar (Manipura) • Fogo Sagrado & Poder Pessoal",
    description: "Despertar do sol dourado interno, transmutação da insegurança e reconexão com a força de realização e merecimento.",
    focus: "Ativar o fogo solar no centro do abdômen, dissolvendo a autossabotagem e a ansiedade.",
    quote: "O fogo sagrado que habita em você transmuta qualquer dúvida em certeza inabalável e merecimento infinito.",
    quoteAuthor: "Éverton Rodrigo Piceni"
  },
  {
    day: 4,
    title: "Chakra Cardíaco (Anahata) • Bálsamo do Amor & Cura Celular",
    description: "Abertura do coração para o amor incondicional, cicatrização de dores afetivas e irradiação de compaixão e autoaceitação.",
    focus: "Expandir uma luz rosa-quartzo e esmeralda a partir do peito, envolvendo cada célula do seu corpo.",
    quote: "O amor incondicional por si mesmo é o remédio mais sagrado do cosmos. Acolha a sua história com carinho e honra.",
    quoteAuthor: "Éverton Rodrigo Piceni"
  },
  {
    day: 5,
    title: "Chakra Laríngeo (Vishuddha) • Expressão Sagrada & Verdade",
    description: "Desbloqueio da garganta, liberação de palavras não ditas e alinhamento do verbo criador com a vontade divina.",
    focus: "Inalar a névoa azul celeste, dissolvendo nós e tensões acumuladas na garganta e ombros.",
    quote: "Sua voz é um canal sagrado da Criação. Expresse a sua verdade com pureza, doçura, firmeza e sabedoria.",
    quoteAuthor: "Mestres do Verbo Sagrado"
  },
  {
    day: 6,
    title: "Chakra Frontal (Ajna) • Terceiro Olho & Despertar Intuitivo",
    description: "Silenciamento do excesso de pensamentos, recalibração das ondas cerebrais e ativação da visão sutil e clareza mental.",
    focus: "Fixar a atenção no ponto luminoso índigo entre as sobrancelhas e repousar na quietude do silêncio interior.",
    quote: "No silêncio puro da mente serena, a intuição e a cura se revelam tão cristalinas quanto a luz da alvorada.",
    quoteAuthor: "Éverton Rodrigo Piceni"
  },
  {
    day: 7,
    title: "Chakra Coronário (Sahasrara) • Selamento Cósmico & Soberania",
    description: "Integração total dos 7 centros de força, cascata de ouro líquido do cosmos, blindagem áurica e celebração da soberania espiritual.",
    focus: "Sentir a comunhão perfeita com a Fonte Criadora e receber a bênção do selamento definitivo da cura.",
    quote: "Você completou a jornada sagrada dos 7 chakras. A sua luz está selada, alinhada e pronta para brilhar no mundo com autonomia e paz.",
    quoteAuthor: "Éverton Rodrigo Piceni"
  }
];

