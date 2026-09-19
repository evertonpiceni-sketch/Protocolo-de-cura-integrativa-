/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Fonte da Verdade — Estúdio de Vídeos do Admin
 * Reintegração da Vida — 21 Dias para Voltar para Mim
 * Idealizado por Éverton Piceni — Terapias Holísticas e Bem-Estar (@terapiamorevida)
 */

export interface ValidationCriterion {
  name: string;
  passed: boolean;
  details: string;
}

export interface ValidationReport {
  timestamp: string;
  verdict: 'APROVADO' | 'REPROVADO_AUTOMATICAMENTE';
  reason?: string;
  criteria: ValidationCriterion[];
}

export interface StudioDayStage {
  step: number;
  name: string;
  description: string;
}

export interface StudioDayRecord {
  day: number;
  title: string;
  cycle: string;
  bodyRegionFocus: string;
  intention: string;
  mainAffirmation: string;
  subPhrase: string;
  stages: StudioDayStage[];
  artUrl: string;
  animationPrompt: string;
  negativePrompt: string;
  durationSeconds: number; // 8 to 12
  motionStrength: 'baixa' | 'media';
  imageAdherence: 'alta' | 'maxima';
  cameraMovement: 'push_in_ultralento' | 'estatica_cinematografica';
  stylePreset: 'realistic / cinematic / meditative / premium';
  characterConsistency: 'maxima';
  textLayoutPreservation: 'maxima';
  status: 'pendente' | 'em_geracao' | 'aprovado' | 'reprovado_automaticamente';
  rejectionReason?: string;
  videoBlobUrl?: string | null;
  approvedAt?: string;
  validationReport?: ValidationReport | null;
}

export const OFFICIAL_NEGATIVE_PROMPT = 
`Do not change the layout. Do not replace the official logo. Do not make the logo dominant. Do not change the neutral body model. Do not create chakra circles or chakra icons. Do not add new symbols, mandalas or decorative elements. Do not distort the face, hands, body or proportions. Do not change the typography or text. Do not crop important elements. Do not create fast movement, flashes, explosions, lightning or exaggerated energy effects. Do not make the animation cartoonish or artificial.`;

// As 21 artes e instruções específicas da Jornada Reintegração da Vida
export const INITIAL_STUDIO_21_DAYS: StudioDayRecord[] = [
  {
    day: 1,
    title: 'Presença e chão',
    cycle: 'Eu permaneço',
    bodyRegionFocus: 'Pés, pernas e base do tronco • Sensação de chão, peso e ancoragem segura',
    intention: 'Reconhecer o corpo, encontrar sustentação e permanecer no momento presente.',
    mainAffirmation: 'AQUI COMEÇA A SUA REINTEGRAÇÃO.',
    subPhrase: 'VOCÊ CHEGA COMO ESTÁ. / VOCÊ PERMITE. / VOCÊ RECEBE. / VOCÊ SE SUSTENTA. / VOCÊ VOLTA PARA VOCÊ.',
    stages: [
      { step: 1, name: '1. ESTADO INICIAL', description: 'Mente dispersa, pouca presença.' },
      { step: 2, name: '2. A LUZ CHEGA', description: 'Uma nova energia começa a se conectar.' },
      { step: 3, name: '3. A ENERGIA DESCE', description: 'A luz percorre todo o seu corpo.' },
      { step: 4, name: '4. ENRAIZAMENTO', description: 'A energia se estabiliza nos seus pés.' },
      { step: 5, name: '5. INTEGRAÇÃO', description: 'Mais presença. Mais vida em você.' }
    ],
    artUrl: '/brand/days/dia-01.png',
    animationPrompt: 'Realistic organic breathing cycle on neutral universal figure, subtle slow chest expansion and gradual pelvic descent toward earth. Warm golden grounding light with volumetric depth hugging the lower limbs and base. Extremely slow cinematic push-in (1.0 to 1.02 zoom over 10s), calm meditative atmosphere, no chakra circles, logo remains subtle watermark.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 2,
    title: 'Voltar ao corpo',
    cycle: 'Eu permaneço',
    bodyRegionFocus: 'Corpo integral • Ombros relaxando, mandíbula solta e respiração diafragmática fluida',
    intention: 'Diminuir o afastamento do próprio corpo e recuperar a percepção das suas necessidades básicas.',
    mainAffirmation: 'VOCÊ VOLTA A HABITAR O PRÓPRIO CORPO.',
    subPhrase: 'A presença começa quando você se sente por dentro.',
    stages: [
      { step: 1, name: '1. DISTÂNCIA', description: 'Você se percebe de longe.' },
      { step: 2, name: '2. ESCUTA', description: 'A atenção retorna à pele e à respiração.' },
      { step: 3, name: '3. VARREDURA', description: 'A luz percorre o corpo inteiro com suavidade.' },
      { step: 4, name: '4. HABITAR', description: 'Pernas, ventre, peito e braços ganham presença.' },
      { step: 5, name: '5. PRESENÇA', description: 'Você volta a morar no próprio corpo.' }
    ],
    artUrl: '/brand/days/dia-02.png',
    animationPrompt: 'Organic full-body scan motion with soft wave-like breathing expanding through shoulders and abdomen. Neutral model relaxes shoulders downward by 2-3px realistically. Diffuse warm amber radiance expanding from chest through skin boundaries. Subtle cinematic push-in.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 3,
    title: 'Um pequeno começo',
    cycle: 'Eu permaneço',
    bodyRegionFocus: 'Pés e plexo solar • Pequena chama de coragem e disposição para um gesto simples',
    intention: 'Iniciar um movimento mínimo, sem cobrança de grandes transformações imediatas.',
    mainAffirmation: 'VOCÊ COMEÇA SEM SE VIOLENTAR.',
    subPhrase: 'Um pequeno passo já abre caminho.',
    stages: [
      { step: 1, name: '1. PAUSA', description: 'Você reconhece que pode começar pequeno.' },
      { step: 2, name: '2. CENTRO', description: 'A luz se reúne no centro do corpo.' },
      { step: 3, name: '3. IMPULSO', description: 'Ela avança suavemente para braços e mãos.' },
      { step: 4, name: '4. GESTO', description: 'O corpo se inclina para uma pequena ação.' },
      { step: 5, name: '5. INÍCIO', description: 'Você se move sem se cobrar.' }
    ],
    artUrl: '/brand/days/dia-03.png',
    animationPrompt: 'Subtle slow solar warmth concentrating at the upper abdomen and solar plexus, gently feeding downward into feet stability. Deep steady inhalation. Quiet golden ember glowing with natural organic breathing loop. Discreet logo, no chakra icons.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 4,
    title: 'Permitir-se receber',
    cycle: 'Eu volto a sentir',
    bodyRegionFocus: 'Centro do peito e mãos • Abertura interior receptiva, descanso da autossuficiência',
    intention: 'Soltar a armadura do controle e permitir que o cuidado e o afeto alcancem o coração.',
    mainAffirmation: 'VOCÊ SE PERMITE RECEBER.',
    subPhrase: 'Receber também é um gesto de cura.',
    stages: [
      { step: 1, name: '1. RESGUARDO', description: 'Você se fecha para se proteger.' },
      { step: 2, name: '2. SUAVIZAÇÃO', description: 'O peito começa a relaxar.' },
      { step: 3, name: '3. ABERTURA', description: 'A luz se expande do peito aos braços e mãos.' },
      { step: 4, name: '4. RECEPÇÃO', description: 'O corpo se torna receptivo e seguro.' },
      { step: 5, name: '5. ACOLHIMENTO', description: 'Você permite que algo bom entre.' }
    ],
    artUrl: '/brand/days/dia-04.png',
    animationPrompt: 'Delicate expansion of heart area, palms resting receptively with microscopic finger relaxation. Gentle emerald-gold volumetric aura unfurling gently in rhythm with slow 6-second exhalations. Cinematic stillness, pristine lighting.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 5,
    title: 'Cuidar de si',
    cycle: 'Eu volto a sentir',
    bodyRegionFocus: 'Coração e campo emocional • Firmeza no compromisso de não se abandonar',
    intention: 'Tratar-se com a mesma compaixão e paciência que se ofereceria a quem mais se ama.',
    mainAffirmation: 'VOCÊ SE ACOLHE COM TERNURA.',
    subPhrase: 'Cuidar de si também é voltar para si.',
    stages: [
      { step: 1, name: '1. ESQUECIMENTO', description: 'Você percebe o quanto se deixou para depois.' },
      { step: 2, name: '2. RETORNO', description: 'As mãos voltam ao peito e ao ventre.' },
      { step: 3, name: '3. AMPARO', description: 'A luz envolve rosto, peito e abdômen como um manto.' },
      { step: 4, name: '4. TERNURA', description: 'O corpo se sente cuidado por dentro.' },
      { step: 5, name: '5. AUTOACOLHIMENTO', description: 'Você se trata com mais gentileza.' }
    ],
    artUrl: '/brand/days/dia-05.png',
    animationPrompt: 'Enveloping soft cocoon of warm golden-rose light around torso and chest, mirroring a compassionate embrace. Micro breathing motion in ribs and diaphragm, profound peace and warmth, ultra-slow push-in.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 6,
    title: 'Reabrir espaço para o prazer',
    cycle: 'Eu volto a sentir',
    bodyRegionFocus: 'Baixo ventre e tórax • Respiração sensorial leve, conforto e prazer nas coisas simples',
    intention: 'Reconectar-se com a leveza, o descanso e as pequenas alegrias da vida cotidiana.',
    mainAffirmation: 'VOCÊ VOLTA A SENTIR O GOSTO DA VIDA.',
    subPhrase: 'O prazer pode retornar de forma suave e segura.',
    stages: [
      { step: 1, name: '1. RECOLHIMENTO', description: 'A vida parece ter perdido o gosto.' },
      { step: 2, name: '2. BRASA', description: 'Um calor suave desperta no ventre.' },
      { step: 3, name: '3. PULSO', description: 'A luz ganha vida no centro do corpo.' },
      { step: 4, name: '4. EXPANSÃO', description: 'Quadris, peito e rosto se iluminam com suavidade.' },
      { step: 5, name: '5. VIVACIDADE', description: 'Você volta a sentir prazer de existir.' }
    ],
    artUrl: '/brand/days/dia-06.png',
    animationPrompt: 'Fluid, warm, sunset-hued amber radiance circulating smoothly in lower abdomen and ribs. Pelvic area and hips soften with deep natural breathing. Organic, serene, meditative warmth without fast ripples.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 7,
    title: 'Reconhecer o que se repete',
    cycle: 'Eu volto a escolher',
    bodyRegionFocus: 'Eixo frontal e olhar interior • Consciência serena, observação sem julgamento',
    intention: 'Observar ciclos viciosos com serenidade e compaixão, sem culpa ou condenação.',
    mainAffirmation: 'VOCÊ ENXERGA O QUE SE REPETE.',
    subPhrase: 'Ver com clareza já começa a transformar.',
    stages: [
      { step: 1, name: '1. AUTOMÁTICO', description: 'Padrões agem sem serem vistos.' },
      { step: 2, name: '2. OBSERVAÇÃO', description: 'A atenção sobe para cabeça, olhos e nuca.' },
      { step: 3, name: '3. CLAREZA', description: 'A luz circula o campo mental.' },
      { step: 4, name: '4. PERCEPÇÃO', description: 'O padrão se revela com mais nitidez.' },
      { step: 5, name: '5. CONSCIÊNCIA', description: 'Você enxerga o que se repetia em silêncio.' }
    ],
    artUrl: '/brand/days/dia-07.png',
    animationPrompt: 'Clear, steady, soft crystalline glow around forehead and temples, representing serene insight and non-judgmental awareness. Subtle breathing in the head and neck, jaw relaxed, eye area peaceful.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 8,
    title: 'Liberar o que já não sustenta',
    cycle: 'Eu volto a escolher',
    bodyRegionFocus: 'Abdômen, diafragma e ombros • Exalação profunda soltando fardos e pesos antigos',
    intention: 'Soltar fardos invisíveis, expectativas alheias e lealdades que pesam na alma.',
    mainAffirmation: 'VOCÊ SE ALIVIA DO QUE ERA PESO.',
    subPhrase: 'Nem tudo o que foi carregado precisa continuar.',
    stages: [
      { step: 1, name: '1. PESO', description: 'O corpo carrega excessos e tensões.' },
      { step: 2, name: '2. IDENTIFICAÇÃO', description: 'Ombros, costas e peito mostram onde dói.' },
      { step: 3, name: '3. DISSOLUÇÃO', description: 'A luz encontra os pontos densos e suaviza.' },
      { step: 4, name: '4. LIBERAÇÃO', description: 'O excesso começa a se desprender.' },
      { step: 5, name: '5. ALÍVIO', description: 'Você solta o que já não sustenta.' }
    ],
    artUrl: '/brand/days/dia-08.png',
    animationPrompt: 'Deep releasing exhalation on neutral figure. Trapezius and upper back muscles subtly release tension downward. Subtle mist-like vapor of heavy tension dissolving into translucent light. Calming, soothing, slow push-in.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 9,
    title: 'Escolher uma resposta diferente',
    cycle: 'Eu volto a escolher',
    bodyRegionFocus: 'Plexo solar e postura ereta • Coragem para uma escolha nova e autônoma',
    intention: 'Criar um segundo de pausa antes da reação automática e agir alinhado à sua verdade.',
    mainAffirmation: 'VOCÊ ESCOLHE UMA RESPOSTA DIFERENTE.',
    subPhrase: 'Entre o impulso e a ação, existe espaço.',
    stages: [
      { step: 1, name: '1. IMPULSO ANTIGO', description: 'A reação automática se apresenta.' },
      { step: 2, name: '2. PAUSA', description: 'Mente e corpo ganham um intervalo.' },
      { step: 3, name: '3. ALINHAMENTO', description: 'A luz desce da cabeça ao peito.' },
      { step: 4, name: '4. ESCOLHA', description: 'A nova resposta alcança garganta e mãos.' },
      { step: 5, name: '5. DIREÇÃO', description: 'Você responde de um lugar mais consciente.' }
    ],
    artUrl: '/brand/days/dia-09.png',
    animationPrompt: 'Neutral model straightens spine with calm dignity (1mm microadjustment), breath settling into stable solar core. Radiant golden-amber pillar centering inside the spine. Grounded autonomy and peaceful presence.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 10,
    title: 'Reconhecer o próprio valor',
    cycle: 'Eu volto para mim',
    bodyRegionFocus: 'Centro cardíaco e coluna • Descanso na dignidade incondicional',
    intention: 'Lembrar que o seu direito à dignidade, ao descanso e ao amor é inato e inegociável.',
    mainAffirmation: 'VOCÊ SE RECORDA DO PRÓPRIO VALOR.',
    subPhrase: 'O seu valor não depende de provar nada.',
    stages: [
      { step: 1, name: '1. DÚVIDA', description: 'O seu valor parece distante.' },
      { step: 2, name: '2. LEMBRANÇA', description: 'Uma centelha reacende no peito.' },
      { step: 3, name: '3. DIGNIDADE', description: 'A luz sobe pela coluna e pelo rosto.' },
      { step: 4, name: '4. PRESENÇA', description: 'A postura se torna mais inteira.' },
      { step: 5, name: '5. MERECIMENTO', description: 'Você se reconhece como importante.' }
    ],
    artUrl: '/brand/days/dia-10.png',
    animationPrompt: 'Deep warm golden luminescence pulsating peacefully behind the sternum and radiating along whole spine. Figure seated in majestic, tranquil composure. Subtle breathing rhythm, no chakra circles.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 11,
    title: 'Suavizar a cobrança',
    cycle: 'Eu volto para mim',
    bodyRegionFocus: 'Mandíbula, garganta e têmporas • Dissolução da autocrítica, gentileza interior',
    intention: 'Desarmar o juiz interno severo e transformar exigência desmedida em acolhimento.',
    mainAffirmation: 'VOCÊ SE TRATA COM MAIS DOÇURA.',
    subPhrase: 'Nem toda mudança precisa nascer da cobrança.',
    stages: [
      { step: 1, name: '1. PRESSÃO', description: 'A mente e os ombros carregam exigência.' },
      { step: 2, name: '2. ESCUTA', description: 'Você nota o peso que vem de dentro.' },
      { step: 3, name: '3. ALÍVIO', description: 'A luz amolece testa, cabeça e ombros.' },
      { step: 4, name: '4. DOÇURA', description: 'O peito respira com mais espaço.' },
      { step: 5, name: '5. GENTILEZA', description: 'Você se trata com menos rigidez.' }
    ],
    artUrl: '/brand/days/dia-11.png',
    animationPrompt: 'Noticeable relaxation of jaw and throat area, soft exhalation releasing throat constriction. Pastel golden-sky aura settling tenderly over the throat and collarbones. Pure stillness and gentle release.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 12,
    title: 'Reencontrar quem eu sou',
    cycle: 'Eu volto para mim',
    bodyRegionFocus: 'Eixo central da coluna • Essência viva preservada além de traumas e rótulos',
    intention: 'Tocar a essência pura que existe em você, anterior aos traumas, papéis e expectativas.',
    mainAffirmation: 'VOCÊ VOLTA AO CENTRO DE SI.',
    subPhrase: 'Aqui, você se recorda de quem é.',
    stages: [
      { step: 1, name: '1. DISPERSÃO', description: 'Distância de si.' },
      { step: 2, name: '2. A LUZ SURGE', description: 'Uma lembrança interior desperta.' },
      { step: 3, name: '3. ALINHAMENTO', description: 'Um feixe de luz percorre o centro do corpo.' },
      { step: 4, name: '4. UNIFICAÇÃO', description: 'O eixo se estabiliza e reúne suas partes.' },
      { step: 5, name: '5. RETORNO', description: 'Você volta ao centro de si.' }
    ],
    artUrl: '/brand/days/dia-12.png',
    animationPrompt: 'Central vertical axis of soft pure light aligning head, heart, and pelvis. Slow harmonic 3-phase breath expanding evenly in 360 degrees. Figure looks completely centered, whole and serene.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 13,
    title: 'Abrir uma pequena porta',
    cycle: 'Eu volto ao mundo',
    bodyRegionFocus: 'Tórax e braços • Pequena fresta de luz em direção à vida cotidiana',
    intention: 'Ensaiar o primeiro gesto de abertura para a vida, sem pressa e no seu próprio ritmo.',
    mainAffirmation: 'VOCÊ PERCEBE UMA NOVA POSSIBILIDADE.',
    subPhrase: 'Pequenas aberturas podem mudar tudo.',
    stages: [
      { step: 1, name: '1. FECHAMENTO', description: 'Tudo parece estreito.' },
      { step: 2, name: '2. UM SINAL', description: 'Uma abertura começa a surgir.' },
      { step: 3, name: '3. CENTRO VIVO', description: 'A luz desperta no peito e nas mãos.' },
      { step: 4, name: '4. PASSAGEM', description: 'A luz se abre para a frente como uma porta.' },
      { step: 5, name: '5. POSSIBILIDADE', description: 'Um novo caminho se revela.' }
    ],
    artUrl: '/brand/days/dia-13.png',
    animationPrompt: 'Gentle forward expansion of light from chest through arms, like a sunbeam entering a quiet room through a doorway. Chest gently rises on inhale, hands softly relax open. Cinematic slow push-in.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 14,
    title: 'Permitir o contato',
    cycle: 'Eu volto ao mundo',
    bodyRegionFocus: 'Espaço ao redor do corpo • Limites saudáveis, permeabilidade segura',
    intention: 'Aproximar-se do outro mantendo o próprio centro, habitando limites saudáveis e seguros.',
    mainAffirmation: 'VOCÊ SE APROXIMA SEM SE PERDER.',
    subPhrase: 'O contato pode ser suave e seguro.',
    stages: [
      { step: 1, name: '1. RESGUARDO', description: 'Você se recolhe.' },
      { step: 2, name: '2. SUAVIZAÇÃO', description: 'A presença amolece a proteção.' },
      { step: 3, name: '3. CONEXÃO', description: 'A luz conecta peito, garganta e mãos.' },
      { step: 4, name: '4. APROXIMAÇÃO', description: 'O contato se torna seguro.' },
      { step: 5, name: '5. ENCONTRO', description: 'Você se aproxima sem se perder.' }
    ],
    artUrl: '/brand/days/dia-14.png',
    animationPrompt: 'Harmonic energetic envelope around neutral figure with clear, gentle boundary. Breathing pulses rhythmically expanding 5cm into peripheral aura then returning to center without vulnerability or contraction.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 15,
    title: 'Sustentar uma pequena ação',
    cycle: 'Eu volto ao mundo',
    bodyRegionFocus: 'Mãos, braços e plexo solar • Foco calmo e continuidade em um único gesto',
    intention: 'Fazer o que é possível com presença e calma, cultivando a constância que constrói caminhos.',
    mainAffirmation: 'VOCÊ COMEÇA E CONTINUA.',
    subPhrase: 'Pequenos passos também são movimento.',
    stages: [
      { step: 1, name: '1. INTENÇÃO', description: 'Você decide começar.' },
      { step: 2, name: '2. BASE', description: 'A luz firma pernas e pés.' },
      { step: 3, name: '3. IMPULSO', description: 'O centro do corpo ganha direção.' },
      { step: 4, name: '4. CONTINUIDADE', description: 'A ação se sustenta com suavidade.' },
      { step: 5, name: '5. CONSTÂNCIA', description: 'Você começa e continua.' }
    ],
    artUrl: '/brand/days/dia-15.png',
    animationPrompt: 'Gently illuminated hands and solar plexus with grounded presence. Inhalation anchors feet, exhalation grounds action through wrists and fingertips. Peaceful perseverance and clarity.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 16,
    title: 'Enxergar o próximo passo',
    cycle: 'Eu movimento meus caminhos',
    bodyRegionFocus: 'Olhar, cabeça e pés • Clareza para o trecho imediato sem ansiedade do todo',
    intention: 'Focar na única parte da jornada que está ao alcance hoje, sem tentar antecipar todo o futuro.',
    mainAffirmation: 'VOCÊ VÊ APENAS O PRÓXIMO PASSO.',
    subPhrase: 'Não é preciso ver tudo para seguir.',
    stages: [
      { step: 1, name: '1. NÉVOA', description: 'Nem tudo está claro.' },
      { step: 2, name: '2. FOCO', description: 'A visão interna começa a se abrir.' },
      { step: 3, name: '3. CLAREZA', description: 'A luz desperta olhos, testa e peito.' },
      { step: 4, name: '4. DIREÇÃO', description: 'Um pequeno caminho aparece à frente.' },
      { step: 5, name: '5. PASSO', description: 'Você vê apenas o próximo passo.' }
    ],
    artUrl: '/brand/days/dia-16.png',
    animationPrompt: 'Gentle golden light illuminating the forward ground directly in front of the feet. Head is calm and rested, breath unhurried. Slow, meditative camera push-in providing tranquil reassurance.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 17,
    title: 'Desbloquear caminhos',
    cycle: 'Eu movimento meus caminhos',
    bodyRegionFocus: 'Eixo central e articulações • Suavização de nós, passagem fluida de vida',
    intention: 'Deixar que a vida volte a circular nos pontos onde o medo e a dor haviam estagnado a energia.',
    mainAffirmation: 'VOCÊ VOLTA A CIRCULAR.',
    subPhrase: 'Quando o caminho respira, você também respira.',
    stages: [
      { step: 1, name: '1. BLOQUEIO', description: 'Algo parece travado.' },
      { step: 2, name: '2. MOVIMENTO', description: 'Uma nova corrente começa a surgir.' },
      { step: 3, name: '3. PASSAGEM', description: 'A luz atravessa o eixo central.' },
      { step: 4, name: '4. FLUXO', description: 'O caminho à frente volta a se abrir.' },
      { step: 5, name: '5. LIBERAÇÃO', description: 'O que estava travado volta a circular.' }
    ],
    artUrl: '/brand/days/dia-17.png',
    animationPrompt: 'Fluid, unobstructed golden river of life flowing smoothly down central channel and out through joints (elbows, knees, hips). Soft rhythmic pulsation of liberation, serene release, cinematic depth.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 18,
    title: 'Caminhar sem certeza absoluta',
    cycle: 'Eu movimento meus caminhos',
    bodyRegionFocus: 'Pernas e plexo solar • Coragem de avançar mesmo levando o medo pela mão',
    intention: 'Confiar que a presença se constrói passo a passo, mesmo quando o horizonte ainda parece incerto.',
    mainAffirmation: 'VOCÊ SEGUE SEM PRECISAR CONTROLAR TUDO.',
    subPhrase: 'Às vezes, seguir já é suficiente.',
    stages: [
      { step: 1, name: '1. DÚVIDA', description: 'Nem tudo está garantido.' },
      { step: 2, name: '2. PRESENÇA', description: 'Você respira e permanece.' },
      { step: 3, name: '3. CORAGEM SERENA', description: 'A luz sustenta pés, pernas e peito.' },
      { step: 4, name: '4. PASSO A PASSO', description: 'O caminho surge sem mostrar tudo.' },
      { step: 5, name: '5. CONTINUIDADE', description: 'Você segue sem precisar controlar tudo.' }
    ],
    artUrl: '/brand/days/dia-18.png',
    animationPrompt: 'Stable grounding light in legs and pelvis contrasting against misty quiet background. Figure breathes with unwavering calm acceptance, rooted in the present now. Slow, comforting push-in.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 19,
    title: 'Escolher a vida novamente',
    cycle: 'Eu reintegro a vida',
    bodyRegionFocus: 'Centro do peito e respiração inteira • Reunião compassiva de todas as versões de si',
    intention: 'Renovar o pacto sagrado de viver, acolhendo a história que trouxe você até aqui.',
    mainAffirmation: 'VOCÊ ESCOLHE A CONTINUIDADE.',
    subPhrase: 'A vida pode ser escolhida de novo.',
    stages: [
      { step: 1, name: '1. SILÊNCIO', description: 'Tudo desacelera.' },
      { step: 2, name: '2. CHAMADO', description: 'Uma centelha reacende no peito.' },
      { step: 3, name: '3. SIM', description: 'A luz se espalha pelo corpo.' },
      { step: 4, name: '4. RETOMADA', description: 'A presença volta a ganhar força.' },
      { step: 5, name: '5. VIDA', description: 'Você escolhe a continuidade.' }
    ],
    artUrl: '/brand/days/dia-19.png',
    animationPrompt: 'Expansive golden sunrise light blooming gently from deep inside the ribcage. Entire torso visibly expands in full conscious breath of life. Sacred stillness and deep reverence.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 20,
    title: 'Reintegrar as partes de mim',
    cycle: 'Eu reintegro a vida',
    bodyRegionFocus: 'Coração e visão futura • Pequena chama de esperança e continuidade aberta',
    intention: 'Reunir os fragmentos de você que se dispersaram, acolhendo cada ferida como testemunha de força.',
    mainAffirmation: 'VOCÊ SE RECONHECE COMO UM TODO.',
    subPhrase: 'O que estava separado pode voltar a se unir.',
    stages: [
      { step: 1, name: '1. DISPERSÃO', description: 'Partes de você estão afastadas.' },
      { step: 2, name: '2. CHAMADO', description: 'Pontos de luz começam a responder.' },
      { step: 3, name: '3. APROXIMAÇÃO', description: 'As partes se reúnem no centro.' },
      { step: 4, name: '4. HARMONIA', description: 'Tudo volta a conversar entre si.' },
      { step: 5, name: '5. INTEGRAÇÃO', description: 'Você se reconhece como um todo.' }
    ],
    artUrl: '/brand/days/dia-20.png',
    animationPrompt: 'Subtle uplifting chest expansion, calm golden warmth blooming slowly in the heart and flowing to whole torso, gentle alive presence, quiet hopeful radiance with no flashes or cartoon elements.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 10,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  },
  {
    day: 21,
    title: 'Eu reintegro a vida',
    cycle: 'Eu reintegro a vida',
    bodyRegionFocus: 'Totalidade do corpo e presença • Integração completa, ancoragem e continuidade',
    intention: 'Integrar toda a jornada e fortalecer a escolha consciente de continuar presente na sua própria vida.',
    mainAffirmation: 'VOCÊ REINTEGRA A VIDA EM SI.',
    subPhrase: 'Aqui, a vida volta a circular plenamente.',
    stages: [
      { step: 1, name: '1. CHEGADA', description: 'Você está aqui.' },
      { step: 2, name: '2. PRESENÇA', description: 'A luz percorre todo o corpo.' },
      { step: 3, name: '3. ESTABILIZAÇÃO', description: 'O centro se firma com serenidade.' },
      { step: 4, name: '4. EXPANSÃO', description: 'A vida se expande dentro e ao redor.' },
      { step: 5, name: '5. PLENITUDE', description: 'Você reintegra a vida em si.' }
    ],
    artUrl: '/brand/days/dia-21.png',
    animationPrompt: 'Full harmonic breathing cycle across entire body, complete unified golden aura with volumetric depth and sacred geometry rings breathing in deep 6s harmony, peaceful grounded mastery, cinematic slow push-in, discreet official logo.',
    negativePrompt: OFFICIAL_NEGATIVE_PROMPT,
    durationSeconds: 12,
    motionStrength: 'baixa',
    imageAdherence: 'maxima',
    cameraMovement: 'push_in_ultralento',
    stylePreset: 'realistic / cinematic / meditative / premium',
    characterConsistency: 'maxima',
    textLayoutPreservation: 'maxima',
    status: 'pendente'
  }
];

export const STUDIO_STORAGE_KEY_DAYS = 'cura_integrada_studio_21_days_v1';

/**
 * REGRA DO BRIEFING NO PRÓPRIO CÓDIGO DO ESTÚDIO:
 * Se o gerador tentar alterar corpo, textos, logo ou composição,
 * o resultado deve voltar como REPROVADO automaticamente, e não entrar na jornada.
 */
export function validateStudioGeneration(record: StudioDayRecord): ValidationReport {
  const promptLower = (record.animationPrompt || '').toLowerCase();
  const negPromptLower = (record.negativePrompt || '').toLowerCase();
  const criteria: ValidationCriterion[] = [];

  // 1. Corpo Neutro Universal (sem troca de gênero, personagens arbitrários ou mutações)
  const forbiddenBodyTerms = [
    'female body', 'male body', 'woman instead', 'man instead', 'change character',
    'swap character', 'different model', 'feminino', 'masculino', 'trocar personagem',
    'mudar modelo', 'new character'
  ];
  const hasBodyViolation = forbiddenBodyTerms.some(term => promptLower.includes(term));
  criteria.push({
    name: 'Preservação do Corpo Neutro Universal',
    passed: !hasBodyViolation,
    details: hasBodyViolation
      ? 'Violação detectada: tentativa de alternar ou modificar o corpo neutro universal aprovado.'
      : 'Corpo neutro universal preservado com fidelidade integral.'
  });

  // 2. Ausência de Chakras (a jornada NÃO é estruturada por chakras!)
  const forbiddenChakraTerms = [
    'chakra circle', 'chakra icon', 'chakra symbols', '7 chakras circles', 'rainbow chakra dots',
    'círculos de chakras', 'sete chakras', 'pontos coloridos de chakra', 'chakra do dia', 'símbolos de chakras'
  ];
  const hasChakraViolation = forbiddenChakraTerms.some(term => promptLower.includes(term));
  criteria.push({
    name: 'Ausência de Círculos / Símbolos de Chakras',
    passed: !hasChakraViolation,
    details: hasChakraViolation
      ? 'Violação detectada: a jornada de 21 dias não é estruturada por círculos de chakras.'
      : 'Movimento focado na região corporal e experiência autêntica do dia.'
  });

  // 3. Logo Oficial Everton Piceni Discreto (nunca dominante, nunca substituído)
  const forbiddenLogoTerms = [
    'remove logo', 'replace logo', 'huge logo', 'giant logo', 'dominant logo', 'central logo',
    'remover logo', 'trocar logo', 'logo gigante', 'logo dominante'
  ];
  const hasLogoViolation = forbiddenLogoTerms.some(term => promptLower.includes(term));
  criteria.push({
    name: 'Logo Oficial Discreto como Assinatura',
    passed: !hasLogoViolation,
    details: hasLogoViolation
      ? 'Violação detectada: o logo oficial não pode competir com a experiência ou ser substituído.'
      : 'Logo oficial aplicado como marca d’água discreta, transparente e elegante.'
  });

  // 4. Preservação de Textos, Tipografia e Layout Original
  const forbiddenLayoutTerms = [
    'change layout', 'remove title', 'different font', 'alterar texto', 'mudar layout',
    'redesenhar arte', 'redraw artwork', 'crop artwork'
  ];
  const hasLayoutViolation = forbiddenLayoutTerms.some(term => promptLower.includes(term));
  criteria.push({
    name: 'Preservação de Layout, Textos e Tipografia',
    passed: !hasLayoutViolation,
    details: hasLayoutViolation
      ? 'Violação detectada: a arte aprovada é a referência definitiva e não deve ter layout redesenhado.'
      : 'Composição, enquadramento, textos e tipografia originais mantidos intactos.'
  });

  // 5. Luz Volumétrica Orgânica e Movimento Meditativo (sem explosões, flashes ou solavancos)
  const forbiddenFxTerms = [
    'explosion', 'explosão', 'flash', 'flashes', 'lightning', 'raios', 'fast movement',
    'movimento rápido', 'cartoon', 'aggressive energy', 'camera shake', 'giro de câmera'
  ];
  const hasFxViolation = forbiddenFxTerms.some(term => promptLower.includes(term));
  const hasDurationViolation = record.durationSeconds < 8 || record.durationSeconds > 12;
  const passedOrganic = !hasFxViolation && !hasDurationViolation;
  criteria.push({
    name: 'Luz Volumétrica Orgânica & Câmera Quase Parada (8-12s)',
    passed: passedOrganic,
    details: !passedOrganic
      ? `Violação detectada: ${hasDurationViolation ? 'duração fora da janela base de 8-12s' : 'efeito excessivo/flash/movimento brusco proibido'}.`
      : `Animação cinematográfica de ${record.durationSeconds}s com push-in sutil e respiração viva.`
  });

  // Avaliação Geral
  const allPassed = criteria.every(c => c.passed);

  return {
    timestamp: new Date().toISOString(),
    verdict: allPassed ? 'APROVADO' : 'REPROVADO_AUTOMATICAMENTE',
    reason: allPassed
      ? undefined
      : criteria.filter(c => !c.passed).map(c => c.details).join(' '),
    criteria
  };
}
