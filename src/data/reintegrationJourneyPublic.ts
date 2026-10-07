import { ABERTURA_OFICIAL, JORNADA_21_DIAS, RETORNO_DIARIO, SILENCIO_ABSORCAO, type DiaJornada } from './jornada21Dias.js';

export type GuidedCue = { at: number; text: string };
export type ReintegrationDay = {
  day: number; cycle: string; title: string; intention: string; meditation: string;
  audioCues: GuidedCue[]; reflectionPrompts: [string, string]; energyNotes: { name: string; focus: string }[];
};


const opening: GuidedCue[] = [
  { at: 0, text: ABERTURA_OFICIAL.boasVindas + ' Encontre uma posição confortável. Você pode permanecer sentado ou deitado, escolhendo a forma em que o seu corpo se sente mais amparado agora. Ajuste as pernas, os braços e a cabeça com calma. Feche os olhos e permita-se chegar exatamente como está.' },
  { at: 40, text: 'Perceba os pontos em que o corpo encontra apoio. Sinta a superfície sustentando o seu peso. Você não precisa manter nenhuma postura perfeita. Faça os pequenos ajustes de que precisar e permita que o corpo compreenda que, durante os próximos minutos, ele pode diminuir o ritmo.' },
  { at: 80, text: 'Inspire lentamente pelo nariz, levando o ar até o abdômen. Segure apenas por um instante e solte devagar. Respire novamente. Ao expirar, deixe os ombros descerem, relaxe a mandíbula e suavize a região ao redor dos olhos. Faça mais uma respiração profunda no seu próprio tempo.' },
  { at: 120, text: 'Agora deixe a respiração seguir de maneira natural. Não é necessário controlá-la. Apenas acompanhe o ar entrando e saindo. Se algum pensamento surgir, não lute contra ele. Reconheça sua presença e volte gentilmente para a respiração, para o corpo e para este momento.' },
  { at: 160, text: 'Leve a atenção ao centro do peito. Perceba como você chegou até aqui hoje. Talvez exista cansaço, ansiedade, esperança, silêncio ou muitas sensações ao mesmo tempo. Nada precisa ser corrigido agora. Este espaço acolhe você como está, respeitando seu ritmo, seus limites e sua autonomia.' },
  { at: 200, text: ABERTURA_OFICIAL.aceiteConexao },
];

const closing: GuidedCue[] = [
  { at: 1620, text: RETORNO_DIARIO.conducao },
  { at: 1665, text: 'Faça uma respiração mais profunda. Mova suavemente os dedos das mãos e dos pés. Permita que a presença retorne gradualmente ao corpo.' },
  { at: 1710, text: RETORNO_DIARIO.perguntaAcao },
  { at: 1750, text: RETORNO_DIARIO.fechamento },
];

const energyNotesByDay: ReintegrationDay['energyNotes'][] = [
  [
    {
      "name": "Rama e Life Force Energy Cone",
      "focus": "Aterramento, presença e energia vital."
    },
    {
      "name": "Jaspe Vermelho, Turmalina Negra e Cornalina",
      "focus": "Chakra básico, corpo físico e estabilidade."
    }
  ],
  [
    {
      "name": "Soul Shakti, Rama e Shanti",
      "focus": "Corpo, campo energético, presença e tranquilidade."
    },
    {
      "name": "Hematita, Turmalina Negra e Quartzo Fumê",
      "focus": "Chakra básico e liberação de sobrecargas."
    }
  ],
  [
    {
      "name": "Kriya, Mind Empowerment e Life Force Energy Cone",
      "focus": "Movimento, decisão e vitalidade."
    },
    {
      "name": "Cornalina, Olho de Tigre e Jaspe Vermelho",
      "focus": "Chakras básico e sacral, iniciativa e constância."
    }
  ],
  [
    {
      "name": "Harth, Soul Healing, Universal Love e Shanti",
      "focus": "Acolhimento, amor e segurança emocional."
    },
    {
      "name": "Quartzo Rosa, Rodonita e Aventurina Verde",
      "focus": "Chakra cardíaco e receptividade."
    }
  ],
  [
    {
      "name": "Harth, Soul Healing, Soul Shakti e Universal Love",
      "focus": "Amor-próprio, dignidade e cuidado emocional."
    },
    {
      "name": "Quartzo Rosa, Rodocrosita e Aventurina Verde",
      "focus": "Coração e restauração emocional."
    }
  ],
  [
    {
      "name": "Soul Awakening, Life Force Energy Cone, Soul Healing e Shanti",
      "focus": "Vitalidade, sensibilidade e segurança para sentir."
    },
    {
      "name": "Cornalina, Calcita Laranja e Pedra da Lua",
      "focus": "Chakra sacral, prazer e criatividade."
    }
  ],
  [
    {
      "name": "Zonar, Halu, Gnosa e Mind Empowerment",
      "focus": "Percepção, liberação de padrões e organização mental."
    },
    {
      "name": "Ametista, Labradorita e Lápis-Lazúli",
      "focus": "Chakra frontal, consciência e verdade interior."
    }
  ],
  [
    {
      "name": "Halu, Soul Healing, Soul Shakti e Shanti",
      "focus": "Liberação suave, purificação e pacificação."
    },
    {
      "name": "Quartzo Fumê, Turmalina Negra e Ametista",
      "focus": "Plexo solar, proteção e transformação."
    }
  ],
  [
    {
      "name": "Kriya, Iava, Soul Fire e Mind Empowerment",
      "focus": "Autonomia, movimento e decisão consciente."
    },
    {
      "name": "Olho de Tigre, Citrino e Cornalina",
      "focus": "Plexo solar, chakra sacral e confiança."
    }
  ],
  [
    {
      "name": "Soul Regeneration, Harth e Universal Love",
      "focus": "Reconstrução, amor-próprio e dignidade."
    },
    {
      "name": "Quartzo Rosa, Rodonita e Citrino",
      "focus": "Coração, plexo solar e identidade emocional."
    }
  ],
  [
    {
      "name": "Shanti, Harth e Mind Empowerment",
      "focus": "Paz, gentileza e reorganização mental."
    },
    {
      "name": "Ametista, Ágata Blue Lace e Quartzo Rosa",
      "focus": "Garganta, mente, coração e autocobrança."
    }
  ],
  [
    {
      "name": "Divine Blueprint, Spiritual Alignment, Soul Awakening e Soul Regeneration",
      "focus": "Essência, alinhamento e renovação interior."
    },
    {
      "name": "Cristal de Quartzo, Labradorita e Lápis-Lazúli",
      "focus": "Coração, garganta, frontal e identidade."
    }
  ],
  [
    {
      "name": "Rama, Kriya e Life Force Energy Cone",
      "focus": "Aterramento, movimento e vitalidade."
    },
    {
      "name": "Cornalina, Jaspe Vermelho e Pedra do Sol",
      "focus": "Pernas, chakra básico e abertura ao mundo."
    }
  ],
  [
    {
      "name": "Harth, Iava, Universal Love e Soul Shakti",
      "focus": "Confiança, pertencimento, vínculos e proteção."
    },
    {
      "name": "Aventurina Verde, Água-Marinha e Quartzo Rosa",
      "focus": "Coração, garganta e contato seguro."
    }
  ],
  [
    {
      "name": "Kriya, Soul Fire, Mind Empowerment e Life Force Energy Cone",
      "focus": "Ação, foco, vontade e sustentação."
    },
    {
      "name": "Citrino, Olho de Tigre e Cornalina",
      "focus": "Plexo solar, confiança e conclusão."
    }
  ],
  [
    {
      "name": "Gnosa, Spiritual Alignment e Divine Blueprint",
      "focus": "Clareza, alinhamento e próximo passo."
    },
    {
      "name": "Lápis-Lazúli, Sodalita e Cristal de Quartzo",
      "focus": "Chakra frontal, discernimento e direção."
    }
  ],
  [
    {
      "name": "Haku Superluminal, Kriya, Iava e Soul Fire",
      "focus": "Condução, movimento e abertura de possibilidades."
    },
    {
      "name": "Labradorita, Citrino e Olho de Tigre",
      "focus": "Campo pessoal, direção e confiança."
    }
  ],
  [
    {
      "name": "Kriya, Gnosa, Spiritual Alignment e Rama",
      "focus": "Movimento, discernimento e estabilidade."
    },
    {
      "name": "Sodalita, Olho de Tigre e Jaspe Vermelho",
      "focus": "Chakra básico, plexo solar e confiança."
    }
  ],
  [
    {
      "name": "Harth, Shanti, Rama e Soul Regeneration",
      "focus": "Acolhimento, paz, presença e integração."
    },
    {
      "name": "Ametista, Quartzo Rosa e Cristal de Quartzo",
      "focus": "Sistema energético, compaixão e unificação."
    }
  ],
  [
    {
      "name": "Soul Regeneration, Universal Love, Soul Awakening e Life Force Energy Cone",
      "focus": "Renovação, pertencimento, esperança e vitalidade."
    },
    {
      "name": "Pedra do Sol, Citrino e Aventurina Verde",
      "focus": "Coração, plexo solar e futuro."
    }
  ],
  [
    {
      "name": "Integração de toda a estrutura energética",
      "focus": "Sete chakras, chakras celestiais e harmonização final."
    },
    {
      "name": "Cristal de Quartzo, Ametista, Pedra do Sol e Quartzo Rosa",
      "focus": "Continuidade, vitalidade e amor-próprio."
    }
  ]
];

const cuesFor = (source: DiaJornada, day: number): GuidedCue[] => {
  const approvedLines = source.meditacao;
  const meditation = [0, 1, 2].map(index => approvedLines.slice(
    Math.floor(index * approvedLines.length / 3),
    Math.floor((index + 1) * approvedLines.length / 3)
  ).join(' '));
  const original = source;
  return [...opening,
    { at: 240, text: `Bem-vindo ao Dia ${day}: ${original.titulo}. A intenção de hoje é ${original.intencao}` },
    { at: 285, text: 'Deixe essa intenção encontrar espaço dentro de você. Não é necessário compreendê-la somente com a mente. Perceba como o corpo reage ao ouvi-la e permita que a respiração a conduza para mais perto do seu centro.' },
    { at: 330, text: 'Respire profundamente mais uma vez. Ao soltar o ar, abandone por alguns instantes a expectativa de fazer esta prática da maneira certa. Apenas escute, sinta e siga a condução no seu próprio ritmo.' },
    { at: 360, text: meditation[0] },
    { at: 420, text: 'Continue respirando com suavidade. Apenas perceba o que surge em seu corpo, na sua emoção ou nos seus pensamentos.' },
    { at: 480, text: meditation[1] },
    { at: 540, text: 'Inspire contando lentamente até quatro. Permaneça por dois instantes, sem forçar. Depois solte o ar contando até seis. Repita mais uma vez. Ao prolongar a expiração, permita que o corpo diminua a tensão e abra espaço para compreender o que está sentindo.' },
    { at: 600, text: meditation[2] },
    { at: 660, text: `Pergunte a si mesmo: ${original.pergunta} Não transforme a pergunta em cobrança. Deixe que a resposta apareça como palavra, sensação, imagem ou silêncio.` },
    { at: 720, text: `Retorne à intenção do Dia ${day}: ${source.titulo}. Repita por dentro, com as suas próprias palavras, aquilo que deseja levar desta prática para a vida cotidiana. Não transforme essa escolha em cobrança. Deixe que ela seja uma direção suave.` },
    { at: 780, text: 'Imagine essa intenção encontrando um lugar seguro dentro do seu corpo. Observe sua cor, sua temperatura ou apenas sua presença. Respire como se estivesse oferecendo espaço para uma nova possibilidade crescer no tempo certo.' },
    { at: 840, text: 'Agora permita que a atenção se torne mais receptiva. Não é necessário visualizar perfeitamente nem produzir qualquer sensação. Apenas permaneça disponível para o próximo momento da prática, respeitando sua autonomia e seus limites.' },
    { at: 900, text: original.meditacao[original.meditacao.length - 2] },
    { at: 990, text: 'Você não precisa dirigir esse processo com a mente. Apenas respire e observe o corpo. Se alguma região chamar sua atenção, acolha-a sem medo e sem esforço, permitindo que a experiência aconteça de maneira suave.' },
    { at: 1080, text: original.meditacao[original.meditacao.length - 1] },
    { at: 1170, text: 'Respire lentamente e permita que o corpo encontre sua própria forma de integração.' },
    { at: 1230, text: SILENCIO_ABSORCAO.aviso },
    ...closing,
  ];
};

export const REINTEGRATION_DAYS: ReintegrationDay[] = JORNADA_21_DIAS.map((original, index) => ({
  day: original.dia,
  cycle: original.ciclo,
  title: original.titulo,
  intention: original.intencao,
  meditation: original.meditacao.join(' '),
  energyNotes: energyNotesByDay[index],
  reflectionPrompts: [original.pergunta, RETORNO_DIARIO.perguntaAcao],
  audioCues: cuesFor(original, original.dia),
}));

const REINTEGRATION_ACCEPTANCE_INTENTIONS: Record<number, string> = {
  1: 'reconhecer meu corpo, encontrar sustentação',
  2: 'voltar a habitar meu corpo e escutar minhas necessidades',
  3: 'dar o menor passo possível em direção ao movimento',
  4: 'permitir o cuidado e abrir espaço para receber',
  5: 'permanecer ao meu próprio lado com gentileza',
  6: 'reabrir espaço para o prazer e para o conforto possível',
  7: 'perceber meus padrões com acolhimento e sem julgamento',
  8: 'liberar o que já não me sustenta e guardar o aprendizado',
  9: 'escolher uma nova resposta que seja respeitosa comigo',
  10: 'reconhecer meu valor antes de qualquer desempenho',
  11: 'suavizar a autocobrança e me orientar com calma',
  12: 'reencontrar quem eu sou além das dores e rótulos',
  13: 'abrir uma pequena porta de aproximação segura com a vida',
  14: 'permitir o contato preservando meus limites e autonomia',
  15: 'sustentar uma pequena ação com constância e sem sobrecarga',
  16: 'iluminar o próximo passo sem precisar controlar tudo',
  17: 'desbloquear meus caminhos e permitir que a vida circule',
  18: 'caminhar com coragem, mesmo sem todas as certezas',
  19: 'escolher a vida novamente e oferecer um sim íntimo à continuidade',
  20: 'reunir e reintegrar todas as partes da minha história',
  21: 'integrar a travessia e retornar à vida cotidiana',
};

export const getReintegrationAcceptance = (day: number) => {
  const item = REINTEGRATION_DAYS.find(entry => entry.day === day) || REINTEGRATION_DAYS[0];
  const intention = REINTEGRATION_ACCEPTANCE_INTENTIONS[item.day] || 'reconhecer meu momento';
  return `Eu aceito receber esta prática do Dia ${item.day} — ${item.title}, conforme programada e sintonizada por Everton Rodrigo Piceni para a Reintegração da Vida. No meu tempo e respeitando meus limites, permito-me estar aqui, ${intention} e dar mais um passo de volta para mim.`;
};
