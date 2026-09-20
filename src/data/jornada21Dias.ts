export interface DiaJornada {
  dia: number;
  ciclo: string;
  titulo: string;
  intencao: string;
  meditacao: string[];
  pergunta: string;
  aceite?: string;
}

export const ABERTURA_OFICIAL = {
  boasVindas: "É muito especial receber você nesse espaço. Sua presença nos deixa felizes, em mais um dia nessa jornada de reencontro com você.",
  aceiteConexao: "Eu aceito receber esta prática, conforme programada e sintonizada por Everton Rodrigo Piceni, para o meu processo de Reintegração da Vida e para tudo aquilo que possa contribuir para o meu bem-estar neste momento. Eu me permito estar aqui, me escolher e dar mais um passo de volta para mim."
};

export const SILENCIO_ABSORCAO = {
  aviso: "Agora eu vou permanecer em silêncio por alguns instantes. A música continua acompanhando você. Não há nada que precise ser feito. Apenas permita que esta experiência encontre o seu lugar. Eu volto daqui a pouco para acompanhar você no retorno."
};

export const RETORNO_DIARIO = {
  conducao: "Aos poucos, perceba novamente seu corpo. Perceba sua respiração. Seus pés. Suas mãos. O espaço ao seu redor. Não existe pressa para voltar. Leve consigo apenas aquilo que fizer sentido para você hoje.",
  perguntaAcao: "Qual pequeno movimento pode cuidar de mim e da minha vida hoje?",
  fechamento: "Não precisa ser perfeito. Precisa apenas ser possível. A experiência deste dia se encerra aqui. E você pode continuar no seu tempo, um pequeno passo de cada vez."
};

export const JORNADA_21_DIAS: DiaJornada[] = [
  {
    "dia": 1,
    "ciclo": "EU PERMANEÇO",
    "titulo": "Presença e chão",
    "intencao": "chegar ao corpo, encontrar sustentação e permanecer.",
    "meditacao": [
      "Perceba seus pés. Perceba o contato deles com o chão.",
      "Não é preciso chegar a lugar algum agora. Apenas reconheça que você está aqui.",
      "Imagine uma luz quente e muito suave surgindo sob seus pés, como o primeiro brilho do amanhecer.",
      "Respire devagar. A cada expiração, permita que o peso do seu corpo encontre sustentação.",
      "A luz começa a percorrer você lentamente e encontra estabilidade nos pés.",
      "Você não precisa resolver tudo agora. Apenas estar aqui. Respirar. E reconhecer o chão que sustenta você."
    ],
    "pergunta": "O que dentro de mim precisa encontrar chão hoje?",
    "aceite": "Hoje eu me permito chegar. Não preciso resolver tudo agora. Posso apenas estar aqui, respirar e reconhecer o chão que me sustenta."
  },
  {
    "dia": 2,
    "ciclo": "EU PERMANEÇO",
    "titulo": "Voltar ao corpo",
    "intencao": "voltar a habitar o próprio corpo.",
    "meditacao": [
      "Perceba sua testa. Seu rosto. O pescoço. Os ombros.",
      "Imagine sua atenção como uma luz suave percorrendo lentamente seu corpo.",
      "Ela passa pelos braços, pelo peito, pelo abdômen, pelos quadris, pelas pernas e chega aos pés.",
      "Onde encontrar tensão, não lute. Apenas ofereça espaço.",
      "Respire. Como se cada parte pudesse dizer: eu também estou aqui.",
      "Permita que seu corpo volte a ser percebido por inteiro."
    ],
    "pergunta": "Se meu corpo pudesse me pedir uma única forma de cuidado hoje, o que ele pediria?"
  },
  {
    "dia": 3,
    "ciclo": "EU PERMANEÇO",
    "titulo": "Um pequeno começo",
    "intencao": "transformar imobilidade em movimento possível.",
    "meditacao": [
      "Imagine uma pequena luz surgindo nos pés.",
      "Ela sobe lentamente pelas pernas e encontra o centro do seu corpo.",
      "Não precisa se transformar em uma grande chama. Uma pequena centelha basta.",
      "Pense em uma única ação que realmente cabe no seu dia.",
      "Veja apenas o começo. O primeiro gesto. O primeiro minuto.",
      "Respire."
    ],
    "pergunta": "Qual é o menor passo que ainda assim me coloca em movimento?"
  },
  {
    "dia": 4,
    "ciclo": "EU VOLTO A SENTIR",
    "titulo": "Permitir-se receber",
    "intencao": "permitir cuidado e receptividade.",
    "meditacao": [
      "Perceba o centro do peito. Imagine ali uma pequena abertura.",
      "Não é preciso abrir tudo. Apenas uma fresta.",
      "Uma luz suave se aproxima. Ela não invade. Não exige. Apenas chega.",
      "Respire e permita que um pouco dessa luz encontre espaço dentro de você.",
      "Por alguns instantes, você não precisa sustentar tudo sozinho."
    ],
    "pergunta": "O que acontece em mim quando eu permito receber?"
  },
  {
    "dia": 5,
    "ciclo": "EU VOLTO A SENTIR",
    "titulo": "Cuidar de si",
    "intencao": "permanecer ao próprio lado.",
    "meditacao": [
      "Imagine diante de você uma versão sua que está cansada.",
      "Não dê conselhos. Não tente consertá-la. Apenas se aproxime.",
      "Permaneça ao lado dela. E diga: Eu não vou me abandonar hoje.",
      "Imagine uma luz morna envolvendo seu peito, seu abdômen, seu rosto e suas mãos. Como um abraço que não aperta."
    ],
    "pergunta": "Que gesto concreto pode mostrar hoje que eu permaneci ao meu lado?"
  },
  {
    "dia": 6,
    "ciclo": "EU VOLTO A SENTIR",
    "titulo": "Reabrir espaço para o prazer",
    "intencao": "permitir novamente pequenas experiências agradáveis.",
    "meditacao": [
      "Perceba o ar tocando sua pele. Os sons ao redor. A temperatura.",
      "Imagine um lugar onde seu corpo pudesse experimentar algum conforto: sol entrando por uma janela, água morna, a sombra de uma árvore, uma brisa, o cheiro da chuva.",
      "Uma luz morna começa a nascer no centro do corpo.",
      "Não force alegria. Apenas reconheça: o agradável ainda pode existir."
    ],
    "pergunta": "Qual pequena experiência de prazer meu corpo consegue receber hoje?"
  },
  {
    "dia": 7,
    "ciclo": "EU VOLTO A ESCOLHER",
    "titulo": "Reconhecer o que se repete",
    "intencao": "perceber padrões sem julgamento.",
    "meditacao": [
      "Imagine uma situação conhecida diante de você, como uma cena observada à distância.",
      "Veja o instante anterior à sua reação automática. O que acontece no corpo? Aperto? Pressa? Medo? Vontade de fugir?",
      "Agora permita que a cena desacelere.",
      "Entre o que acontece e a sua resposta surge um pequeno espaço. Respire dentro desse espaço."
    ],
    "pergunta": "O que esse padrão tenta proteger, evitar ou comunicar?"
  },
  {
    "dia": 8,
    "ciclo": "EU VOLTO A ESCOLHER",
    "titulo": "Liberar o que já não sustenta",
    "intencao": "deixar pesos antigos perderem força.",
    "meditacao": [
      "Imagine que você carrega uma mochila. Perceba seu peso.",
      "Não precisamos abrir todas as histórias que estão dentro dela.",
      "A cada expiração, imagine retirar uma pedra e colocá-la no chão.",
      "Você não está apagando o que viveu. Está apenas escolhendo não carregar tudo da mesma maneira.",
      "Perceba seus ombros. Seu peito. Seu abdômen."
    ],
    "pergunta": "O que posso deixar aqui hoje e ainda conservar o aprendizado?"
  },
  {
    "dia": 9,
    "ciclo": "EU VOLTO A ESCOLHER",
    "titulo": "Escolher uma resposta diferente",
    "intencao": "experimentar uma nova possibilidade.",
    "meditacao": [
      "Imagine uma estrada se dividindo diante de você. Um caminho é conhecido. O outro ainda não tem todas as marcas.",
      "Respire. Perceba seu corpo diante das duas possibilidades.",
      "Agora dê apenas um passo imaginário na nova direção. Sinta seus pés tocando esse caminho."
    ],
    "pergunta": "Qual resposta diferente seria mais respeitosa comigo e ainda possível hoje?"
  },
  {
    "dia": 10,
    "ciclo": "EU VOLTO PARA MIM",
    "titulo": "Reconhecer o próprio valor",
    "intencao": "lembrar o próprio valor antes do desempenho.",
    "meditacao": [
      "Imagine diante de você a parte que vive tentando provar que merece amor, descanso ou reconhecimento.",
      "Aproxime-se. E diga: Eu vejo o quanto você tentou.",
      "Imagine uma luz dourada suave surgindo no centro do peito. Ela não nasceu de uma conquista. Ela já estava ali.",
      "Respire."
    ],
    "pergunta": "Quem sou eu quando não preciso provar meu direito de existir?"
  },
  {
    "dia": 11,
    "ciclo": "EU VOLTO PARA MIM",
    "titulo": "Suavizar a cobrança",
    "intencao": "substituir dureza por orientação gentil.",
    "meditacao": [
      "Perceba alguma frase de cobrança que costuma aparecer dentro de você.",
      "Imagine essa frase diante de você. Respire. Veja-a perdendo força.",
      "Agora pense no que você diria a alguém que ama profundamente se essa pessoa estivesse vivendo exatamente o que você vive.",
      "Permita que essa frase encontre você. Perceba o peito. A garganta. Os ombros."
    ],
    "pergunta": "Como posso me orientar sem me ferir?"
  },
  {
    "dia": 12,
    "ciclo": "EU VOLTO PARA MIM",
    "titulo": "Reencontrar quem eu sou",
    "intencao": "reencontrar o centro de si.",
    "meditacao": [
      "Imagine um caminho conduzindo você para um espaço silencioso dentro de si.",
      "Ali não existem expectativas. Não existem versões impostas por outras pessoas. Existe presença.",
      "Imagine uma luz clara percorrendo o centro do seu corpo. Do alto da cabeça até os pés.",
      "Como se diferentes partes suas voltassem a encontrar um mesmo eixo."
    ],
    "pergunta": "O que em mim permaneceu vivo apesar de tudo?"
  },
  {
    "dia": 13,
    "ciclo": "EU VOLTO AO MUNDO",
    "titulo": "Abrir uma pequena porta",
    "intencao": "perceber uma nova possibilidade.",
    "meditacao": [
      "Imagine-se diante de uma porta. Você não precisa atravessá-la. Apenas abra uma pequena fresta.",
      "Veja a luz entrando. Sinta o ar tocando seu rosto.",
      "Perceba que existe algo além do espaço onde você estava. Respire."
    ],
    "pergunta": "Qual pequena aproximação com a vida cabe em mim hoje?"
  },
  {
    "dia": 14,
    "ciclo": "EU VOLTO AO MUNDO",
    "titulo": "Permitir o contato",
    "intencao": "aproximar-se sem perder a si mesmo.",
    "meditacao": [
      "Imagine uma presença respeitosa a alguns passos de você. Ela não invade. Não exige. Não apressa.",
      "Perceba uma luz suave envolvendo seu peito, seus braços, sua garganta e suas mãos.",
      "Essa luz permite aproximação e preserva seus limites. Você pode estar próximo sem desaparecer."
    ],
    "pergunta": "Que tipo de contato me permite sentir acompanhado sem deixar de ser eu?"
  },
  {
    "dia": 15,
    "ciclo": "EU VOLTO AO MUNDO",
    "titulo": "Sustentar uma pequena ação",
    "intencao": "transformar intenção em continuidade.",
    "meditacao": [
      "Pense em uma única ação possível. Apenas uma.",
      "Visualize o primeiro gesto. Depois o segundo.",
      "Se parecer grande demais, diminua essa ação até que ela caiba nas suas mãos.",
      "Perceba suas pernas. Seu abdômen. Seus braços. Suas mãos.",
      "A luz encontra estabilidade na base e conduz você suavemente adiante."
    ],
    "pergunta": "Como posso tornar essa ação simples o bastante para realmente realizá-la?"
  },
  {
    "dia": 16,
    "ciclo": "EU MOVIMENTO MEUS CAMINHOS",
    "titulo": "Enxergar o próximo passo",
    "intencao": "encontrar direção sem precisar controlar o caminho inteiro.",
    "meditacao": [
      "Imagine uma estrada à noite. Você não consegue enxergar tudo.",
      "Apenas alguns metros à frente estão iluminados. E talvez isso seja suficiente.",
      "Respire. Perceba seus olhos. Sua testa. Seu peito.",
      "A luz revela somente o trecho necessário agora."
    ],
    "pergunta": "Qual parte do caminho já está suficientemente iluminada para eu seguir?"
  },
  {
    "dia": 17,
    "ciclo": "EU MOVIMENTO MEUS CAMINHOS",
    "titulo": "Desbloquear caminhos",
    "intencao": "permitir que aquilo que estava parado volte a circular.",
    "meditacao": [
      "Imagine-se diante de uma paisagem que parecia sem saída. Observe novamente, sem pressa.",
      "Talvez exista uma passagem que antes não podia ser percebida: uma trilha, um espaço entre as árvores, uma ponte, uma abertura.",
      "Imagine a luz atravessando suavemente aquilo que parecia uma barreira. O fluxo retorna."
    ],
    "pergunta": "Que possibilidade pequena já existe e ainda não recebeu minha atenção?"
  },
  {
    "dia": 18,
    "ciclo": "EU MOVIMENTO MEUS CAMINHOS",
    "titulo": "Caminhar sem certeza absoluta",
    "intencao": "continuar mesmo sem conhecer todas as respostas.",
    "meditacao": [
      "Perceba seus pés. Imagine um caminho surgindo passo a passo diante de você.",
      "Ele não revela tudo. Apenas o necessário para continuar.",
      "Respire. Dê um passo. Depois outro.",
      "A incerteza pode continuar existindo sem precisar comandar você."
    ],
    "pergunta": "O que eu faria se não precisasse esperar ter certeza absoluta para começar?"
  },
  {
    "dia": 19,
    "ciclo": "EU REINTEGRO A VIDA",
    "titulo": "Escolher a vida novamente",
    "intencao": "reacender um sim íntimo à continuidade.",
    "meditacao": [
      "Perceba o centro do peito. Imagine uma pequena luz reacendendo ali.",
      "Não como uma explosão. Como uma chama tranquila.",
      "Ela começa a se espalhar lentamente pela coluna, pelo abdômen, pelos braços e pelas pernas.",
      "Respire. Não precisamos negar aquilo que foi difícil. Apenas reconhecer que, mesmo depois de tudo, você está aqui."
    ],
    "pergunta": "Que pequeno sim à vida consigo oferecer hoje?"
  },
  {
    "dia": 20,
    "ciclo": "EU REINTEGRO A VIDA",
    "titulo": "Reintegrar as partes de mim",
    "intencao": "reunir a própria história sem abandonar partes de si.",
    "meditacao": [
      "Imagine um círculo de luz ao seu redor.",
      "Aos poucos, diferentes versões suas podem se aproximar: a que teve medo, a que resistiu, a que caiu, a que tentou novamente, a que permaneceu.",
      "Nenhuma delas precisa ser expulsa.",
      "Imagine pequenos pontos de luz retornando ao centro e formando novamente um corpo inteiro."
    ],
    "pergunta": "Que parte minha ainda precisa ouvir que também tem lugar aqui?"
  },
  {
    "dia": 21,
    "ciclo": "EU REINTEGRO A VIDA",
    "titulo": "Eu reintegro a vida",
    "intencao": "integrar a travessia e retornar à vida cotidiana levando consigo o que foi reconstruído.",
    "meditacao": [
      "Imagine os vinte e um dias como um caminho atrás de você. Não procure perfeição. Apenas reconheça que você chegou até aqui.",
      "Imagine uma luz percorrendo todo o seu corpo. Dos pés ao alto da cabeça. Presença. Sentir. Escolha. Valor. Contato. Direção. Esperança. Tudo encontra lugar dentro de você.",
      "Respire.",
      "Agora imagine uma porta se abrindo para sua vida. Você não retorna como alguém que resolveu tudo. Retorna como alguém que pode continuar se escolhendo.",
      "A jornada termina. A relação com você continua.",
      "Eu reintegro a vida."
    ],
    "pergunta": "O que eu escolho levar comigo daqui para frente?"
  }
];