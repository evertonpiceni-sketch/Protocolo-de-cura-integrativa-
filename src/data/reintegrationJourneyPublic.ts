export type ReintegrationDay = {
  day: number;
  cycle: string;
  title: string;
  intention: string;
  meditation: string;
  energyNotes: { name: string; focus: string }[];
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

const blocks = [
  { start: 1, end: 3, cycle: 'Eu permaneço', title: 'Presença e chão', intention: 'Encontrar chão, presença e força para um pequeno começo.', meditation: 'Perceba seus pés. Existe um chão sustentando você agora. Não é preciso correr. Talvez você esteja cansado. Primeiro vamos reconhecer esse cansaço. Respire e diga, por dentro: eu estou aqui. Imagine uma pequena luz começando nos seus pés. Hoje, uma luz pequena basta. Pergunte ao seu corpo: do que eu preciso hoje para me sentir um pouco mais cuidado? Escolha apenas uma coisa. Hoje eu cuido da vida começando pelo meu corpo.', energyNotes: [{ name: 'Rama', focus: 'Aterramento, presença e capacidade de iniciar movimentos possíveis.' }, { name: 'Life Force Energy Cone', focus: 'Sustentação da energia vital e disposição.' }, { name: 'Soul Shakti e Original Reiki Platinum', focus: 'Campo, corpo, base e integração da experiência.' }] },
  { start: 4, end: 6, cycle: 'Eu volto a sentir', title: 'Receptividade e cuidado', intention: 'Abrir espaço para cuidado, conforto e pequenas experiências agradáveis.', meditation: 'Leve sua atenção ao centro do peito. Talvez sentir tenha se tornado cansativo. Não vamos obrigar nenhuma porta a abrir. Vamos apenas ficar perto. Perceba se existe alguma sensação agradável, por menor que seja. Eu posso receber um pouco de cuidado. Eu não preciso merecer descanso. Eu posso estar do meu próprio lado. Pergunte: o que hoje me faria sentir apenas um pouco mais presente? Não procure dez por cento. Procure um por cento. Um pequeno bem-estar também conta.', energyNotes: [{ name: 'Harth', focus: 'Chakra cardíaco, acolhimento e amor-próprio.' }, { name: 'Shanti', focus: 'Tranquilidade, adaptação e integração emocional.' }, { name: 'Soul Healing e Universal Love', focus: 'Receptividade, cuidado e reconexão com o sentir.' }] },
  { start: 7, end: 9, cycle: 'Eu volto a escolher', title: 'Percepção e escolha', intention: 'Perceber o que se repete e experimentar uma resposta diferente e possível.', meditation: 'Pense com delicadeza em algo que vem se repetindo. Não use essa percepção para se acusar. Pergunte: o que acontece dentro de mim pouco antes de eu repetir isso? Eu não preciso me julgar para me compreender. Imagine uma pequena bifurcação. Um caminho é a resposta automática. O outro representa uma possibilidade diferente. Qual é a menor resposta diferente que consigo experimentar hoje? Eu posso perceber. Eu posso acolher. Eu posso escolher.', energyNotes: [{ name: 'Zonar e Halu', focus: 'Percepção e liberação suave de padrões repetitivos.' }, { name: 'Kriya', focus: 'Movimento, escolha e transformação da intenção em ação.' }, { name: 'Soul Fire e Mind Empowerment', focus: 'Plexo solar, clareza de prioridades e confiança.' }] },
  { start: 10, end: 12, cycle: 'Eu volto para mim', title: 'Valor e amor-próprio', intention: 'Reconhecer seu valor antes do desempenho e diminuir a cobrança interna.', meditation: 'Coloque as mãos sobre o peito. Por alguns minutos, solte a lista do que você acha que deveria ter conseguido. Você não é apenas aquilo que produz. Imagine uma versão sua cansada de se cobrar. Aproxime-se sem dar conselhos. Eu vejo o quanto você tentou. Eu continuo com você. Pergunte: como eu trataria alguém que amo se essa pessoa estivesse sentindo exatamente o que sinto? Meu valor não começa depois que eu produzir. Ele já está aqui.', energyNotes: [{ name: 'Harth e Shanti', focus: 'Cardíaco, amor-próprio e uma relação mais gentil consigo.' }, { name: 'Soul Healing e Soul Regeneration', focus: 'Acolhimento e reconstrução interior.' }, { name: 'Universal Love e Divine Blueprint', focus: 'Dignidade, pertencimento e integração do próprio valor.' }] },
  { start: 13, end: 15, cycle: 'Eu volto ao mundo', title: 'Contato e movimento', intention: 'Transformar presença em um gesto pequeno, concreto e sustentável no mundo.', meditation: 'Imagine uma porta. Do outro lado existe o mundo: céu, pessoas, ruas, sons, lugares, vida acontecendo. Não é preciso atravessar essa porta de uma vez. Talvez hoje seja abrir a janela, caminhar alguns minutos, falar com alguém ou sentar ao sol. Eu não preciso voltar de uma vez. Posso voltar aos poucos. Qual é o tamanho do passo que realmente consigo dar hoje? Um passo real vale mais do que uma cobrança enorme.', energyNotes: [{ name: 'Kriya, Iava e Rama', focus: 'Iniciativa, aterramento e participação no mundo.' }, { name: 'Life Force Energy Cone', focus: 'Energia vital e sustentação do movimento.' }, { name: 'Soul Awakening e Mind Empowerment', focus: 'Sacral, plexo solar, motivação e confiança.' }] },
  { start: 16, end: 18, cycle: 'Eu movimento meus caminhos', title: 'Clareza e direção', intention: 'Enxergar o próximo trecho sem precisar controlar o caminho inteiro.', meditation: 'Imagine uma estrada. Você não consegue enxergá-la inteira. Somente alguns metros estão iluminados. Talvez isso seja suficiente. Qual é o próximo passo possível? Eu posso caminhar sem conhecer todo o caminho. Eu posso experimentar. Eu posso mudar de direção. Imagine-se dando um único passo e transforme esse passo em uma atitude pequena e concreta. Eu não preciso de certeza absoluta para me mover.', energyNotes: [{ name: 'Gnosa, Kriya e Iava', focus: 'Clareza, discernimento, direção e movimento.' }, { name: 'Spiritual Alignment e Divine Blueprint', focus: 'Alinhamento interior e percepção de possibilidades.' }, { name: 'Plexo solar, frontal e chakras celestiais', focus: 'Confiança, foco e visão do próximo passo.' }] },
  { start: 19, end: 21, cycle: 'Eu reintegro a vida', title: 'Integração e esperança', intention: 'Reunir presença, sentir, escolha, valor, contato, direção e esperança.', meditation: 'Respire profundamente. Imagine todas as versões suas que chegaram até aqui: a que estava cansada, a que teve medo, a que tentou, a que caiu e a que voltou a tentar. Todas pertencem à sua história. Eu não preciso apagar quem fui para continuar. Agora imagine uma versão futura sua. Não perfeita. Apenas vivendo. Ela lembra que ainda existem partes da sua história que não aconteceram. Minha história continua aberta. Eu ainda posso conhecer novos momentos. Eu posso continuar.', energyNotes: [{ name: 'Harth, Shanti e Rama', focus: 'Amor-próprio, paz, presença e aterramento.' }, { name: 'Universal Love e Divine Blueprint', focus: 'Integração do aprendizado e continuidade.' }, { name: 'Sete chakras e chakras celestiais', focus: 'Integração do campo energético ao final da jornada.' }] },
] as const;

export const REINTEGRATION_DAYS: ReintegrationDay[] = Array.from({ length: 21 }, (_, index) => {
  const day = index + 1;
  const block = blocks.find(value => day >= value.start && day <= value.end)!;
  return { day, cycle: block.cycle, title: block.title, intention: block.intention, meditation: `${OPENING}\n\n${block.meditation}\n\n${CLOSING}`, energyNotes: block.energyNotes.map(note => ({ ...note })) };
});

export const REINTEGRATION_ACCEPTANCE = 'Eu aceito conscientemente receber a prática e a programação energética correspondente ao meu dia na jornada 21 Dias para Voltar para Mim — Reintegração da Vida, conforme programado e energizado neste áudio por Everton Rodrigo Piceni, respeitando meus limites, minha autonomia e minha liberdade de interromper a prática quando desejar.';
