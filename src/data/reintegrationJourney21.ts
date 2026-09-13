export type PersonalJourneyDay = {
  day: number;
  cycle: string;
  title: string;
  intention: string;
  frequency: 'waves';
  frequencyLabel: string;
  energies: string[];
  ethericCrystal: string;
  command: string;
  meditation: string;
};

type Block = {
  start: number;
  end: number;
  cycle: string;
  title: string;
  intention: string;
  crystals: string[];
  energies: string[];
  command: string;
  meditation: string;
};

const OPENING = `Encontre uma posição confortável.

Você não precisa chegar bem. Não precisa estar calmo. Não precisa deixar seus pensamentos do lado de fora. Pode chegar exatamente como está.

Respire devagar. Perceba o ar entrando. E saindo. Talvez hoje exista disposição. Talvez hoje tudo pareça pesado. Aqui cabem as duas coisas.

Se for confortável, coloque uma das mãos sobre o peito.

Eu aceito este momento de cuidado. Não preciso resolver minha vida nos próximos minutos. Não preciso provar nada. Por enquanto, eu apenas fico aqui comigo.

Respire mais uma vez. Hoje eu escolho me oferecer mais uma possibilidade.`;

const CLOSING = `Perceba novamente seu corpo. Seus pés. Suas mãos. O lugar onde você está.

Pergunte: qual pequena atitude pode cuidar de mim e da minha vida hoje? Escolha algo possível. Não algo perfeito.

Eu não preciso fazer tudo hoje. Não preciso caminhar no ritmo de ninguém. Posso respeitar meu tempo sem abandonar a mim mesmo. Hoje escolho um pequeno movimento. E por hoje, isso basta.

Abra os olhos quando estiver pronto. A prática termina aqui. Seu dia continua. E o próximo passo continua sendo seu.`;

const blocks: Block[] = [
  { start: 1, end: 3, cycle: 'Eu permaneço', title: 'Presença e chão', intention: 'aterramento, presença, desbloqueio suave, energia vital e capacidade de iniciar pequenos movimentos', crystals: ['Rama', 'Jaspe Vermelho', 'Turmalina Negra', 'Cornalina'], energies: ['Life Force Energy Cone', 'Soul Shakti: Aura Healing e Body Purification', 'Original Reiki Platinum', 'Trabalho de base, pés e corpo'], command: 'Ativando Acupuntura Etérica Quântica na pessoa que conscientemente aceitar esta prática, com as frequências de Rama, Jaspe Vermelho, Turmalina Negra e Cornalina, e com as energias de sustentação deste bloco, em todos os pontos necessários para favorecer aterramento, presença, desbloqueio suave, energia vital e capacidade de iniciar pequenos movimentos. Ativo e deixo programada esta sessão para começar quando a pessoa aceitar conscientemente e iniciar a prática correspondente ao dia, encerrando-se automaticamente ao final da sessão.', meditation: 'Perceba seus pés. Existe um chão sustentando você agora. Não é preciso correr. Talvez você esteja cansado. Primeiro vamos reconhecer esse cansaço. Respire e diga, por dentro: eu estou aqui. Imagine uma pequena luz começando nos seus pés. Hoje, uma luz pequena basta. Pergunte ao seu corpo: do que eu preciso hoje para me sentir um pouco mais cuidado? Escolha apenas uma coisa. Hoje eu cuido da vida começando pelo meu corpo.' },
  { start: 4, end: 6, cycle: 'Eu volto a sentir', title: 'Receptividade e cuidado', intention: 'equilíbrio emocional, amor-próprio, receptividade, adaptação, tranquilidade e pequenas experiências agradáveis', crystals: ['Harth', 'Shanti', 'Quartzo Rosa', 'Pedra da Lua', 'Amazonita'], energies: ['Soul Shakti: Soul Healing', 'DNA Light Integrative: Universal Love', 'Original Reiki Platinum', 'Cardíaco e Sacral', 'Life Force Energy Cone como sustentação de fundo'], command: 'Ativando Acupuntura Etérica Quântica na pessoa que conscientemente aceitar esta prática, com as frequências de Harth, Shanti, Quartzo Rosa, Pedra da Lua e Amazonita, e com as energias de acolhimento deste bloco, em todos os pontos necessários para favorecer equilíbrio emocional, amor-próprio, receptividade, adaptação, tranquilidade e capacidade de reconhecer pequenas experiências agradáveis. Ativo e deixo programada esta sessão para começar quando a pessoa aceitar conscientemente e iniciar a prática correspondente ao dia, encerrando-se automaticamente ao final da sessão.', meditation: 'Leve sua atenção ao centro do peito. Talvez sentir tenha se tornado cansativo. Não vamos obrigar nenhuma porta a abrir. Vamos apenas ficar perto. Perceba se existe alguma sensação agradável, por menor que seja. Eu posso receber um pouco de cuidado. Eu não preciso merecer descanso. Eu posso estar do meu próprio lado. Pergunte: o que hoje me faria sentir apenas um pouco mais presente? Não procure dez por cento. Procure um por cento. Um pequeno bem-estar também conta.' },
  { start: 7, end: 9, cycle: 'Eu volto a escolher', title: 'Percepção e escolha', intention: 'consciência dos ciclos repetitivos, liberação suave de bloqueios, clareza de prioridades, confiança e uma resposta diferente possível', crystals: ['Zonar', 'Halu', 'Kriya', 'Citrino', 'Olho de Tigre', 'Ametista'], energies: ['Etheric Clearing Sequences: primeira sequência', 'Life Force Energy Cone', 'Soul Shakti: Soul Fire, Mind Empowerment e Spiritual Individuality', 'Plexo Solar'], command: 'Ativando Acupuntura Etérica Quântica na pessoa que conscientemente aceitar esta prática, com as frequências de Zonar, Halu, Kriya, Citrino, Olho de Tigre e Ametista, e com as energias de percepção e movimento deste bloco, em todos os pontos necessários para favorecer consciência dos ciclos repetitivos, liberação suave de bloqueios associados ao adiamento, medo, dúvida e autossabotagem, clareza de prioridades, confiança, motivação e capacidade de escolher uma resposta diferente e possível. Ativo e deixo programada esta sessão para começar quando a pessoa aceitar conscientemente e iniciar a prática correspondente ao dia, encerrando-se automaticamente ao final da sessão.', meditation: 'Pense com delicadeza em algo que vem se repetindo. Não use essa percepção para se acusar. Pergunte: o que acontece dentro de mim pouco antes de eu repetir isso? Eu não preciso me julgar para me compreender. Imagine uma pequena bifurcação. Um caminho é a resposta automática. O outro representa uma possibilidade diferente. Qual é a menor resposta diferente que consigo experimentar hoje? Eu posso perceber. Eu posso acolher. Eu posso escolher.' },
  { start: 10, end: 12, cycle: 'Eu volto para mim', title: 'Valor e amor-próprio', intention: 'amor-próprio, equilíbrio emocional, tranquilidade, percepção mais gentil de si e redução da cobrança interna', crystals: ['Harth', 'Shanti', 'Quartzo Rosa', 'Amazonita', 'Ametista'], energies: ['Soul Shakti: Soul Healing e Soul Regeneration', 'DNA Light Integrative: Universal Love e Divine Blueprint', 'Cardíaco'], command: 'Ativando Acupuntura Etérica Quântica na pessoa que conscientemente aceitar esta prática, com as frequências de Harth, Shanti, Quartzo Rosa, Amazonita e Ametista, e com as energias de reconstrução deste bloco, em todos os pontos necessários para favorecer amor-próprio, equilíbrio emocional, adaptação, tranquilidade, percepção mais gentil de si e redução da cobrança interna que dificulta o movimento. Ativo e deixo programada esta sessão para começar quando a pessoa aceitar conscientemente e iniciar a prática correspondente ao dia, encerrando-se automaticamente ao final da sessão.', meditation: 'Coloque as mãos sobre o peito. Por alguns minutos, solte a lista do que você acha que deveria ter conseguido. Você não é apenas aquilo que produz. Imagine uma versão sua cansada de se cobrar. Aproxime-se sem dar conselhos. Eu vejo o quanto você tentou. Eu continuo com você. Pergunte: como eu trataria alguém que amo se essa pessoa estivesse sentindo exatamente o que sinto? Meu valor não começa depois que eu produzir. Ele já está aqui.' },
  { start: 13, end: 15, cycle: 'Eu volto ao mundo', title: 'Contato e movimento', intention: 'energia vital, iniciativa, confiança, motivação, participação, contato e um gesto concreto possível no mundo', crystals: ['Kriya', 'Iava', 'Rama', 'Cornalina', 'Citrino', 'Olho de Tigre'], energies: ['Life Force Energy Cone', 'Soul Shakti: Soul Awakening e Mind Empowerment', 'Original Reiki Platinum', 'Sacral e Plexo Solar'], command: 'Ativando Acupuntura Etérica Quântica na pessoa que conscientemente aceitar esta prática, com as frequências de Kriya, Iava, Rama, Cornalina, Citrino e Olho de Tigre, e com as energias de movimento deste bloco, em todos os pontos necessários para favorecer energia vital, aterramento, iniciativa, confiança, motivação, participação, contato e capacidade de transformar intenção em um pequeno gesto concreto no mundo. Ativo e deixo programada esta sessão para começar quando a pessoa aceitar conscientemente e iniciar a prática correspondente ao dia, encerrando-se automaticamente ao final da sessão.', meditation: 'Imagine uma porta. Do outro lado existe o mundo: céu, pessoas, ruas, sons, lugares, vida acontecendo. Não é preciso atravessar essa porta de uma vez. Talvez hoje seja abrir a janela, caminhar alguns minutos, falar com alguém ou sentar ao sol. Eu não preciso voltar de uma vez. Posso voltar aos poucos. Qual é o tamanho do passo que realmente consigo dar hoje? Um passo real vale mais do que uma cobrança enorme.' },
  { start: 16, end: 18, cycle: 'Eu movimento meus caminhos', title: 'Clareza e direção', intention: 'atenção, foco, discernimento, confiança, percepção de possibilidades e capacidade de escolher o próximo passo', crystals: ['Gnosa', 'Kriya', 'Iava', 'Sodalita', 'Citrino', 'Olho de Tigre', 'Ametista'], energies: ['Soul Shakti: Spiritual Alignment', 'DNA Light Integrative: Divine Blueprint', 'Plexo Solar e Frontal', 'Chakras Celestiais 8 a 12'], command: 'Ativando Acupuntura Etérica Quântica na pessoa que conscientemente aceitar esta prática, com as frequências de Gnosa, Kriya, Iava, Sodalita, Citrino, Olho de Tigre e Ametista, e com as energias de clareza deste bloco, em todos os pontos necessários para favorecer atenção, foco, intuição equilibrada, discernimento, confiança, motivação, percepção de possibilidades e capacidade de escolher o próximo passo sem precisar controlar todo o caminho. Ativo e deixo programada esta sessão para começar quando a pessoa aceitar conscientemente e iniciar a prática correspondente ao dia, encerrando-se automaticamente ao final da sessão.', meditation: 'Imagine uma estrada. Você não consegue enxergá-la inteira. Somente alguns metros estão iluminados. Talvez isso seja suficiente. Qual é o próximo passo possível? Eu posso caminhar sem conhecer todo o caminho. Eu posso experimentar. Eu posso mudar de direção. Imagine-se dando um único passo e transforme esse passo em uma atitude pequena e concreta. Eu não preciso de certeza absoluta para me mover.' },
  { start: 19, end: 21, cycle: 'Eu reintegro a vida', title: 'Integração e esperança', intention: 'presença, amor-próprio, paz, energia vital, alegria possível, aterramento, esperança e continuidade', crystals: ['Harth', 'Shanti', 'Rama', 'Quartzo Transparente', 'Quartzo Rosa', 'Citrino', 'Cornalina'], energies: ['Life Force Energy Cone', 'Soul Shakti: seleção integrativa conforme necessidade', 'DNA Light Integrative: Universal Love e Divine Blueprint', 'Original Reiki Platinum', 'Sete chakras tradicionais', 'Chakras Celestiais 8 a 15'], command: 'Ativando Acupuntura Etérica Quântica na pessoa que conscientemente aceitar esta prática, com as frequências de Harth, Shanti, Rama, Quartzo Transparente, Quartzo Rosa, Citrino e Cornalina, e com as energias de integração desta jornada, em todos os pontos necessários para favorecer presença, amor-próprio, paz, energia vital, alegria possível, aterramento, esperança, integração do aprendizado e capacidade de continuar participando da própria vida. Ativo e deixo programada esta sessão para começar quando a pessoa aceitar conscientemente e iniciar a prática correspondente ao dia, encerrando-se automaticamente ao final da sessão.', meditation: 'Respire profundamente. Imagine todas as versões suas que chegaram até aqui: a que estava cansada, a que teve medo, a que tentou, a que caiu e a que voltou a tentar. Todas pertencem à sua história. Eu não preciso apagar quem fui para continuar. Agora imagine uma versão futura sua. Não perfeita. Apenas vivendo. Ela lembra que ainda existem partes da sua história que não aconteceram. Minha história continua aberta. Eu ainda posso conhecer novos momentos. Eu posso continuar.' },
];

export const PERSONAL_JOURNEY_21_DAYS: PersonalJourneyDay[] = Array.from({ length: 21 }, (_, index) => {
  const day = index + 1;
  const block = blocks.find(value => day >= value.start && day <= value.end)!;
  return {
    day,
    cycle: block.cycle,
    title: block.title,
    intention: block.intention,
    frequency: 'waves',
    frequencyLabel: 'Música oficial da Reintegração da Vida',
    energies: ['HSZSN e seu mantra, três vezes', 'Raku Superluminal e seu mantra, três vezes', 'Golden Light Source como fonte contínua de integração', ...block.energies],
    ethericCrystal: block.crystals.join(', '),
    command: block.command,
    meditation: `${OPENING}\n\n${block.meditation}\n\n${CLOSING}`,
  };
});

export const PERSONAL_JOURNEY_ACCEPTANCE = 'Eu aceito este momento de cuidado. Não preciso resolver minha vida nos próximos minutos. Não preciso provar nada. Por enquanto, eu apenas fico aqui comigo.';
