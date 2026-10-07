/**
 * MAPA DIDÁTICO VISUAL OFICIAL — 21 DIAS PARA VOLTAR PARA MIM (REINTEGRAÇÃO DA VIDA)
 * Everton Piceni — Terapias Holísticas e Bem-Estar
 *
 * RÉGUA OFICIAL CONGELADA (MUDANÇA 5):
 * 1. Modelo corporal único: neutro, universal, sem gênero/sexo, sem mandalas, símbolos ou chakras coloridos avulsos.
 * 2. Progressão de iluminação: Todo vídeo inicia em menor luminosidade basal (20-30%),
 *    percorre a didática corporal/energética da intenção do dia, e finaliza em estado de maior integração.
 * 3. Critério de corte oficial: "Sem ouvir o áudio, consigo perceber visualmente o movimento interno proposto para este dia?"
 * 4. Fonte Única da Verdade para: Clara (IA), Admin, Produção dos Vídeos e Auditoria Técnica.
 */


export interface VisualDiaInstrucao {
  readonly dia: number;
  readonly ciclo:
    | "EU PERMANEÇO"
    | "EU VOLTO A SENTIR"
    | "EU VOLTO A ESCOLHER"
    | "EU VOLTO PARA MIM"
    | "EU VOLTO AO MUNDO"
    | "EU MOVIMENTO MEUS CAMINHOS"
    | "EU REINTEGRO A VIDA";
  readonly titulo: string;
  readonly intencao: string;
  readonly regiaoCorporal: string;
  readonly movimentoLuz: string;
  readonly estadoInicial: string;
  readonly transformacao: string;
  readonly estadoFinal: string;
  readonly criterioAprovacao: string;
  readonly arquivoVideoEsperado: string;
  readonly posterEsperado: string;
  readonly videoPath?: string;
  readonly posterPath?: string;
}


export const REGUA_VISUAL_MUDANCA_5 = {
  versao: "Mudança 5 — Congelada Oficial",
  modeloHumano: "Silhueta neutra universal, sem sexo biológico, linhas orgânicas suaves em tom marfim/linho (#FAF7F2 / #2A2421)",
  elementosProibidos: [
    "Cores de chakras psicodélicas (arco-íris / luzes neon)",
    "Mandalas giratórias estridentes",
    "Símbolos esotéricos ou geométricos avulsos",
    "Estereótipos anatômicos masculinos ou femininos",
    "Brilhos genéricos de corpo inteiro sem didática corporal localizada"
  ],
  criterioDeCorte: "Sem ouvir o áudio, consigo perceber visualmente o movimento interno proposto para este dia?",
  tresEstadosObrigatorios: [
    "Estado 1: Vídeo MP4 presente no servidor (/videos/dia-X.mp4) executando em loop sutil",
    "Estado 2: Fallback sem MP4 (poster /artes/dia-X.png + silhueta SVG oficial com pulsação suave)",
    "Estado 3: Player ativo com áudio oficial sincronizado (29:57) e fases sonoras"
  ]
} as const;


export const VISUAL_MAP_21_DIAS: readonly VisualDiaInstrucao[] = [
  // =========================================================================
  // CICLO 1 — EU PERMANEÇO (Presença, chão, corpo e primeiro movimento)
  // =========================================================================
  {
    dia: 1,
    ciclo: "EU PERMANEÇO",
    titulo: "Presença e chão",
    intencao: "Chegar ao corpo, encontrar sustentação e permanecer.",
    regiaoCorporal: "Pés, pernas, base de sustentação e solo.",
    movimentoLuz: "A luz DESCE pelo corpo → percorre as pernas → alcança os pés → raízes energéticas douradas surgem a partir dos pés → ramificam-se visivelmente no solo.",
    estadoInicial: "Corpo com menor luminosidade e presença ainda sutil.",
    transformacao: "A luz desce suavemente pelo eixo corporal, percorre as pernas até alcançar os pés; a partir dos pés, raízes energéticas douradas brotam e se ramificam visivelmente no solo.",
    estadoFinal: "Corpo firme, sustentado, enraizado e estável.",
    criterioAprovacao: "Percebo claramente a descida da luz e o enraizamento no chão?",
    arquivoVideoEsperado: "/videos/dia-1.mp4",
    posterEsperado: "/artes/dia-1.png",
    videoPath: "/videos/dia-1.mp4",
    posterPath: "/artes/dia-1.png"
  },
  {
    dia: 2,
    ciclo: "EU PERMANEÇO",
    titulo: "Voltar ao corpo",
    intencao: "Voltar a habitar o próprio corpo.",
    regiaoCorporal: "Escaneamento corporal integral descendente: testa, olhos, mandíbula, pescoço, ombros, peito, abdômen, quadris, pernas e pés.",
    movimentoLuz: "Feixe contínuo de atenção atenta e mansa que desce do topo da cabeça até as solas dos pés em varredura lenta, dissolvendo tensões pelo caminho.",
    estadoInicial: "Corpo opaco com pontos isolados de tensão visível (mandíbula travada, ombros elevados), silhueta retraída.",
    transformacao: "A onda de atenção percorre cada segmento corporal; onde toca, as linhas de rigidez afrouxam e dão lugar a espaço respiratório.",
    estadoFinal: "Silhueta corporal integralmente delineada por uma luz homogênea e serena, transmitindo a sensação de corpo habitado por inteiro.",
    criterioAprovacao: "Sem áudio, é possível acompanhar visualmente a varredura atenta descendo da cabeça aos pés e relaxando as tensões até habitar o corpo inteiro?",
    arquivoVideoEsperado: "/videos/dia-2.mp4",
    posterEsperado: "/artes/dia-2.png",
    videoPath: "/videos/dia-2.mp4",
    posterPath: "/artes/dia-2.png"
  },
  {
    dia: 3,
    ciclo: "EU PERMANEÇO",
    titulo: "Um pequeno começo",
    intencao: "Transformar imobilidade em movimento possível.",
    regiaoCorporal: "Pés, subindo pelas canelas e joelhos até o centro do ventre (abdômen inferior).",
    movimentoLuz: "Uma centelha discreta e concentrada nasce nos pés, sobe em linha fina pelas pernas e fixa-se no centro do ventre como uma chama pequena e estável.",
    estadoInicial: "Silhueta em imobilidade aparente, sensação de inércia ou bloqueio inicial.",
    transformacao: "Sem explosão ou labareda, uma pequena centelha de luz dourada move-se com calma da base das pernas até o centro vital do corpo.",
    estadoFinal: "Um ponto de luz quente aceso e pulsando suavemente no centro do abdômen, pronto para sustentar o menor gesto real.",
    criterioAprovacao: "Sem áudio, percebe-se que a animação mostra a ignição do menor passo viável (centelha contida que sobe da base ao centro), sem pirotecnia de luz?",
    arquivoVideoEsperado: "/videos/dia-3.mp4",
    posterEsperado: "/artes/dia-3.png",
    videoPath: "/videos/dia-3.mp4",
    posterPath: "/artes/dia-3.png"
  },


  // =========================================================================
  // CICLO 2 — EU VOLTO A SENTIR (Receptividade, autocuidado e prazer possível)
  // =========================================================================
  {
    dia: 4,
    ciclo: "EU VOLTO A SENTIR",
    titulo: "Permitir-se receber",
    intencao: "Permitir cuidado e receptividade.",
    regiaoCorporal: "Centro do peito (esterno e caixa torácica).",
    movimentoLuz: "Luz sutil externa que se aproxima respeitosamente; o peito amolece e abre uma fresta luminosa delicada para que a luz externa entre e se aninhe.",
    estadoInicial: "Tórax contraído em postura defensiva de contenção, luminosidade recolhida.",
    transformacao: "O esterno afrouxa; uma fresta suave se abre no centro do peito, permitindo a entrada pacífica de claridade nutridora que não exige nada.",
    estadoFinal: "Cavidade torácica aliviada, respirando com folga, preenchida por um brilho interno confortável de descanso.",
    criterioAprovacao: "Sem áudio, fica evidente a transição de um tórax defensivo/fechado para uma abertura delicada que aceita receber descanso e luz?",
    arquivoVideoEsperado: "/videos/dia-4.mp4",
    posterEsperado: "/artes/dia-4.png",
    videoPath: "/videos/dia-4.mp4",
    posterPath: "/artes/dia-4.png"
  },
  {
    dia: 5,
    ciclo: "EU VOLTO A SENTIR",
    titulo: "Cuidar de si",
    intencao: "Permanecer ao próprio lado.",
    regiaoCorporal: "Peito, abdômen, mãos pousadas e face (contorno do autocuidado).",
    movimentoLuz: "Luz morna que se curva como um envoltório suave (abraço que não aperta), contornando o tronco e aquecendo mãos e peito.",
    estadoInicial: "Silhueta com postura de cansaço ou desamparo interior, bordas corporais frias.",
    transformacao: "Em vez de exigir conserto, uma emanação aveludada envolve o contorno corporal com acolhimento e companhia silenciosa.",
    estadoFinal: "Campo térmico reconfortante ao redor do tronco e das mãos, traduzindo visualmente o permanecer ao lado de si mesmo.",
    criterioAprovacao: "Sem áudio, é nítido o desenho de um envoltório protetor morno que abraça a silhueta cansada sem forçar postura ereta artificial?",
    arquivoVideoEsperado: "/videos/dia-5.mp4",
    posterEsperado: "/artes/dia-5.png",
    videoPath: "/videos/dia-5.mp4",
    posterPath: "/artes/dia-5.png"
  },
  {
    dia: 6,
    ciclo: "EU VOLTO A SENTIR",
    titulo: "Reabrir espaço para o prazer",
    intencao: "Permitir novamente pequenas experiências agradáveis.",
    regiaoCorporal: "Centro do ventre expandindo para a pele, superfície do corpo e sentidos.",
    movimentoLuz: "Ondulações calmas e térmicas de luz dourada que nascem no centro visceral e viajam até a pele, como sol da manhã ou brisa suave.",
    estadoInicial: "Superfície corporal fosca, insensível ou anestesiada.",
    transformacao: "Pulsos amenos no ventre fluem para as bordas do corpo, criando um brilho tátil e aveludado na superfície da pele.",
    estadoFinal: "Silhueta relaxada e sensorialmente desperta, comunicando conforto e receptividade a pequenas sensações agradáveis.",
    criterioAprovacao: "Sem áudio, é evidente o despertar de uma sensação agradável e tátil na pele e respiração, sem euforia ou hiperestimulação?",
    arquivoVideoEsperado: "/videos/dia-6.mp4",
    posterEsperado: "/artes/dia-6.png",
    videoPath: "/videos/dia-6.mp4",
    posterPath: "/artes/dia-6.png"
  },


  // =========================================================================
  // CICLO 3 — EU VOLTO A ESCOLHER (Percepção dos padrões, liberação e escolha)
  // =========================================================================
  {
    dia: 7,
    ciclo: "EU VOLTO A ESCOLHER",
    titulo: "Reconhecer o que se repete",
    intencao: "Perceber padrões sem julgamento.",
    regiaoCorporal: "Eixo cabeça-peito (espaço entre estímulo e reação).",
    movimentoLuz: "Pulsações aceleradas e cíclicas entre mente e peito desaceleram visivelmente, abrindo um halo límpido de espaço contemplativo.",
    estadoInicial: "Ritmo visual apressado e tenso no tórax e cabeça, ilustrando o laço de reação automática.",
    transformacao: "O laço perde velocidade e afrouxa; surge um espaço luminoso claro e amplo entre o que acontece e a resposta.",
    estadoFinal: "Silhueta em repouso lúcido, com um intervalo sereno de observação sem julgamento ao redor.",
    criterioAprovacao: "Sem áudio, o observador consegue ver a desaceleração de um ciclo reativo e o surgimento de um espaço visível de pausa lúcida?",
    arquivoVideoEsperado: "/videos/dia-7.mp4",
    posterEsperado: "/artes/dia-7.png",
    videoPath: "/videos/dia-7.mp4",
    posterPath: "/artes/dia-7.png"
  },
  {
    dia: 8,
    ciclo: "EU VOLTO A ESCOLHER",
    titulo: "Liberar o que já não sustenta",
    intencao: "Deixar pesos antigos perderem força.",
    regiaoCorporal: "Ombros, trapézios, escápulas descendo pela coluna para o solo.",
    movimentoLuz: "Faixas opacas e densas acumuladas sobre a cintura escapular escorrem e decantam para o chão, dissipando-se na base.",
    estadoInicial: "Ombros contraídos para cima e encurvados sob carga opaca aparente.",
    transformacao: "Os ombros descem visivelmente; a densidade escura se solta das costas e escorre em direção à terra, dando lugar a espaço leve.",
    estadoFinal: "Linha dos ombros desarmada e solta, clavículas abertas, postura rebaixada sem tensão de sobrecarga.",
    criterioAprovacao: "Sem áudio, o espectador consegue ver claramente o descarrego físico e luminoso dos ombros, que baixam e se livram do peso?",
    arquivoVideoEsperado: "/videos/dia-8.mp4",
    posterEsperado: "/artes/dia-8.png",
    videoPath: "/videos/dia-8.mp4",
    posterPath: "/artes/dia-8.png"
  },
  {
    dia: 9,
    ciclo: "EU VOLTO A ESCOLHER",
    titulo: "Escolher uma resposta diferente",
    intencao: "Experimentar uma nova possibilidade.",
    regiaoCorporal: "Pés, pernas e centro de gravidade (vetor de deslocamento).",
    movimentoLuz: "Na base, uma trilha luminosa gasta perde intensidade enquanto um feixe suave ao lado se ilumina para receber um deslocamento milimétrico do pé.",
    estadoInicial: "Postura bloqueada na mesma posição estática sobre a trilha antiga.",
    transformacao: "O centro de equilíbrio muda sutilmente; o pé avança um passo mínimo para a nova direção, iluminando o solo sob o apoio.",
    estadoFinal: "Base plantada na nova direção respeitosa, transmitindo autonomia e tranquilidade para prosseguir.",
    criterioAprovacao: "Sem áudio, é nítido que o corpo e a luz realizam uma mudança sutil de direção e apoio nos pés, indicando uma nova escolha?",
    arquivoVideoEsperado: "/videos/dia-9.mp4",
    posterEsperado: "/artes/dia-9.png",
    videoPath: "/videos/dia-9.mp4",
    posterPath: "/artes/dia-9.png"
  },


  // =========================================================================
  // CICLO 4 — EU VOLTO PARA MIM (Valor, suavização da cobrança e identidade)
  // =========================================================================
  {
    dia: 10,
    ciclo: "EU VOLTO PARA MIM",
    titulo: "Reconhecer o próprio valor",
    intencao: "Lembrar o próprio valor antes do desempenho.",
    regiaoCorporal: "Centro do peito (coração profundo e cavidade esternal).",
    movimentoLuz: "Luz dourada aveludada e profunda que desabrocha do núcleo do peito, perene e estável, sem vir de fora e sem esforço de produção.",
    estadoInicial: "Corpo inclinado para frente em postura de esforço ou busca de validação externa.",
    transformacao: "O corpo recua para o próprio prumo; o fulgor dourado brota do centro do peito como algo que sempre esteve presente.",
    estadoFinal: "Tórax irradiando dourado nobre constante, silhueta descansando no próprio direito de existir.",
    criterioAprovacao: "Sem áudio, é claro que a luz dourada do peito surge do próprio centro (intrínseca) e não como um troféu ou faísca externa?",
    arquivoVideoEsperado: "/videos/dia-10.mp4",
    posterEsperado: "/artes/dia-10.png",
    videoPath: "/videos/dia-10.mp4",
    posterPath: "/artes/dia-10.png"
  },
  {
    dia: 11,
    ciclo: "EU VOLTO PARA MIM",
    titulo: "Suavizar a cobrança",
    intencao: "Substituir dureza por orientação gentil.",
    regiaoCorporal: "Garganta, mandíbula, pescoço e peito superior.",
    movimentoLuz: "Luz fluida como bálsamo (ouro pálido e marfim) que banha a rigidez da garganta e nuca, dissolvendo arestas e nós de cobrança.",
    estadoInicial: "Garganta comprimida, maxilar tenso e linhas duras na fisionomia.",
    transformacao: "O fluxo balsâmico de luz desliza pela garganta e queixo, desarmando as travas da fala e amaciando a postura.",
    estadoFinal: "Pescoço e mandíbula soltos, respiração desobstruída e postura corporal gentil consigo mesma.",
    criterioAprovacao: "Sem áudio, observa-se o amolecimento e descompressão evidente da região da garganta, mandíbula e ombros?",
    arquivoVideoEsperado: "/videos/dia-11.mp4",
    posterEsperado: "/artes/dia-11.png",
    videoPath: "/videos/dia-11.mp4",
    posterPath: "/artes/dia-11.png"
  },
  {
    dia: 12,
    ciclo: "EU VOLTO PARA MIM",
    titulo: "Reencontrar quem eu sou",
    intencao: "Reencontrar o centro de si.",
    regiaoCorporal: "Eixo vertical central do corpo (do topo da cabeça aos pés pela coluna).",
    movimentoLuz: "Coluna vertical límpida e aprumada de luz clara que alinha a coroa, garganta, coração, abdômen e base em um único prumo.",
    estadoInicial: "Silhueta desalinhada, dispersa em contornos fragmentados e sem eixo orientador.",
    transformacao: "As dispersões recolhem-se em direção à linha média, compondo um canal luminoso vertical sólido e integrado.",
    estadoFinal: "Eixo vertical nítido e ereto sem rigidez, equilibrado com firmeza no próprio centro de gravidade.",
    criterioAprovacao: "Sem áudio, é evidente a reconexão e alinhamento de um eixo luminoso vertical único percorrendo o centro do corpo do topo aos pés?",
    arquivoVideoEsperado: "/videos/dia-12.mp4",
    posterEsperado: "/artes/dia-12.png",
    videoPath: "/videos/dia-12.mp4",
    posterPath: "/artes/dia-12.png"
  },


  // =========================================================================
  // CICLO 5 — EU VOLTO AO MUNDO (Abertura, contato e ação sustentada)
  // =========================================================================
  {
    dia: 13,
    ciclo: "EU VOLTO AO MUNDO",
    titulo: "Abrir uma pequena porta",
    intencao: "Perceber uma nova possibilidade.",
    regiaoCorporal: "Olhos, testa, rosto e plano frontal do corpo.",
    movimentoLuz: "Raio suave e externo de luz clara que passa por uma fresta vertical à frente e toca com carinho a fronte e o rosto.",
    estadoInicial: "Silhueta voltada inteiramente para dentro, recolhida em ambiente fechado e sombrio.",
    transformacao: "Uma fresta abre-se à frente; o olhar eleva-se lentamente e recebe o ar fresco e o raio luminoso matinal.",
    estadoFinal: "Rosto iluminado por perspectiva pacífica, contemplando o mundo externo sem sobressaltos.",
    criterioAprovacao: "Sem áudio, percebe-se a abertura de uma fresta de luz frontal que toca o rosto e convida a olhar para o mundo?",
    arquivoVideoEsperado: "/videos/dia-13.mp4",
    posterEsperado: "/artes/dia-13.png",
    videoPath: "/videos/dia-13.mp4",
    posterPath: "/artes/dia-13.png"
  },
  {
    dia: 14,
    ciclo: "EU VOLTO AO MUNDO",
    titulo: "Permitir o contato",
    intencao: "Aproximar-se sem perder a si mesmo.",
    regiaoCorporal: "Peito, braços, mãos e membrana de contorno periférico.",
    movimentoLuz: "Halo luminoso protetor e maleável que circunda o tronco e as mãos, viabilizando aproximação externa com limites claros.",
    estadoInicial: "Isolamento rígido ou contorno corporal vulnerável e indistinto.",
    transformacao: "Uma membrana dourada translúcida firma-se nas mãos e peito; acolhe presença respeitosa mantendo o espaço próprio.",
    estadoFinal: "Fronteira corporal sadia: mãos abertas e peito acolhedor cercados por limite íntegro que protege a identidade.",
    criterioAprovacao: "Sem áudio, é visível que o corpo estabelece um campo de contato que aproxima o outro sem romper o espaço pessoal?",
    arquivoVideoEsperado: "/videos/dia-14.mp4",
    posterEsperado: "/artes/dia-14.png",
    videoPath: "/videos/dia-14.mp4",
    posterPath: "/artes/dia-14.png"
  },
  {
    dia: 15,
    ciclo: "EU VOLTO AO MUNDO",
    titulo: "Sustentar uma pequena ação",
    intencao: "Transformar intenção em continuidade.",
    regiaoCorporal: "Pernas, abdômen inferior descendo para os braços e mãos.",
    movimentoLuz: "Luz que se concentra no ventre e desce com firmeza para as palmas das mãos, pronta para segurar e sustentar um gesto real.",
    estadoInicial: "Ideia abstrata flutuando fora do corpo, sem ligação motora ou ancoragem muscular.",
    transformacao: "A luz desce da mente para o ventre e flui para as mãos, ganhando consistência executável e prática.",
    estadoFinal: "Mãos e membros inferiores firmes e iluminados, transmitindo capacidade sustentada de realização contínua.",
    criterioAprovacao: "Sem áudio, é nítida a condução da energia para as mãos e pernas, demonstrando capacidade de executar um gesto real?",
    arquivoVideoEsperado: "/videos/dia-15.mp4",
    posterEsperado: "/artes/dia-15.png",
    videoPath: "/videos/dia-15.mp4",
    posterPath: "/artes/dia-15.png"
  },


  // =========================================================================
  // CICLO 6 — EU MOVIMENTO MEUS CAMINHOS (Direção, desbloqueio e confiança)
  // =========================================================================
  {
    dia: 16,
    ciclo: "EU MOVIMENTO MEUS CAMINHOS",
    titulo: "Enxergar o próximo passo",
    intencao: "Encontrar direção sem precisar controlar o caminho inteiro.",
    regiaoCorporal: "Olhos, testa e o solo imediatamente adiante dos pés (alcance de 1 a 2 passos).",
    movimentoLuz: "Luz clara e amena na fronte que projeta foco circunscrito no chão apenas sob os passos imediatos, mantendo o restante na penumbra tranquila.",
    estadoInicial: "Ansiedade na face tentando vasculhar um horizonte distante e escuro.",
    transformacao: "O horizonte distante desvanece; o feixe de luz foca exclusivamente no metro de chão logo adiante dos pés.",
    estadoFinal: "Testa aliviada e pés descansados no passo imediato, livres da necessidade de controlar todo o trajeto.",
    criterioAprovacao: "Sem áudio, fica evidente que apenas o próximo passo à frente dos pés é iluminado, desanuviando a mente da cobrança?",
    arquivoVideoEsperado: "/videos/dia-16.mp4",
    posterEsperado: "/artes/dia-16.png",
    videoPath: "/videos/dia-16.mp4",
    posterPath: "/artes/dia-16.png"
  },
  {
    dia: 17,
    ciclo: "EU MOVIMENTO MEUS CAMINHOS",
    titulo: "Desbloquear caminhos",
    intencao: "Permitir que aquilo que estava parado volte a circular.",
    regiaoCorporal: "Articulações principais (quadris, joelhos, tornozelos, ombros, cotovelos).",
    movimentoLuz: "Luz fluida e desobstrutora que banha e dissolve pontos de estagnação nas curvas articulares, reativando a circulação corporal.",
    estadoInicial: "Nós opacos ou bloqueios visíveis travando as passagens articulares nos membros.",
    transformacao: "A luz líquida amolece e dilui as resistências; o fluxo volta a circular límpido por pernas e braços.",
    estadoFinal: "Canais articulares livres, membros relaxados e corrente luminosa desimpedida da base ao topo.",
    criterioAprovacao: "Sem áudio, é perceptível a dissolução de nós/bloqueios articulares com o retorno do fluxo contínuo de luz pelos membros?",
    arquivoVideoEsperado: "/videos/dia-17.mp4",
    posterEsperado: "/artes/dia-17.png",
    videoPath: "/videos/dia-17.mp4",
    posterPath: "/artes/dia-17.png"
  },
  {
    dia: 18,
    ciclo: "EU MOVIMENTO MEUS CAMINHOS",
    titulo: "Caminhar sem certeza absoluta",
    intencao: "Continuar mesmo sem conhecer todas as respostas.",
    regiaoCorporal: "Pés em marcha pausada e centro de gravidade em balanço suave.",
    movimentoLuz: "O chão de luz surge unicamente sob o pé no exato instante do toque; o caminhar gera a própria sustentação.",
    estadoInicial: "Paralisia hesitante dos pés perante o escuro, aguardando certezas antes de andar.",
    transformacao: "Um pé se levanta na penumbra e, ao tocar o solo, acende um círculo firme de apoio luminoso; o ciclo se repete.",
    estadoFinal: "Marcha tranquila e contínua, onde o suporte se cria a cada passo, em paz com a incerteza do caminho.",
    criterioAprovacao: "Sem áudio, vê-se claramente que o solo se ilumina conforme os pés tocam o chão, passo a passo, mostrando sustentação na incerteza?",
    arquivoVideoEsperado: "/videos/dia-18.mp4",
    posterEsperado: "/artes/dia-18.png",
    videoPath: "/videos/dia-18.mp4",
    posterPath: "/artes/dia-18.png"
  },


  // =========================================================================
  // CICLO 7 — EU REINTEGRO A VIDA (Escolha da vida, integração e fechamento)
  // =========================================================================
  {
    dia: 19,
    ciclo: "EU REINTEGRO A VIDA",
    titulo: "Escolher a vida novamente",
    intencao: "Reacender um sim íntimo à continuidade.",
    regiaoCorporal: "Centro do peito irradiando pela coluna vertebral, abdômen e membros.",
    movimentoLuz: "Uma chama tranquila e vital que reacende no coração e irriga calmamente a coluna como um pulso dourado contínuo.",
    estadoInicial: "Silhueta em estado de frieza ou amortecimento, chama quase apagada.",
    transformacao: "A fagulha do 'sim' ganha calor consistente no peito e viaja pelas vértebras até os pés e braços, revigorando o corpo.",
    estadoFinal: "Corpo permeado por pulsação dourada viva e serena, afirmando com clareza o compromisso de continuar.",
    criterioAprovacao: "Sem áudio, é perceptível o reacender gradual de uma chama no peito que irriga calmamente a coluna com vitalidade serena?",
    arquivoVideoEsperado: "/videos/dia-19.mp4",
    posterEsperado: "/artes/dia-19.png",
    videoPath: "/videos/dia-19.mp4",
    posterPath: "/artes/dia-19.png"
  },
  {
    dia: 20,
    ciclo: "EU REINTEGRO A VIDA",
    titulo: "Reintegrar as partes de mim",
    intencao: "Reunir a própria história sem abandonar partes de si.",
    regiaoCorporal: "Todo o campo corporal recebendo múltiplos pontos de luz periféricos que convergem para o centro.",
    movimentoLuz: "Pontos de luz dispersos ao redor (versões passadas e marcas da jornada) convergem suavemente para a silhueta central e são acolhidos.",
    estadoInicial: "Corpo central cercado por fragmentos luminosos isolados e afastados na órbita externa.",
    transformacao: "O centro acolhe cada ponto luminoso sem repulsa; os fragmentos penetram e encontram repouso no tecido corporal.",
    estadoFinal: "Silhueta unificada, íntegra e acolhedora, onde nenhuma história precisou ser rejeitada para haver paz.",
    criterioAprovacao: "Sem áudio, vê-se a convergência e reintegração visível de múltiplos fragmentos de luz retornando e se acomodando no corpo central?",
    arquivoVideoEsperado: "/videos/dia-20.mp4",
    posterEsperado: "/artes/dia-20.png",
    videoPath: "/videos/dia-20.mp4",
    posterPath: "/artes/dia-20.png"
  },
  {
    dia: 21,
    ciclo: "EU REINTEGRO A VIDA",
    titulo: "Eu reintegro a vida",
    intencao: "Integrar a travessia e retornar à vida cotidiana levando consigo o que foi reconstruído.",
    regiaoCorporal: "Corpo pleno unificado (dos pés à cabeça) voltado para uma porta aberta de transição ao mundo real.",
    movimentoLuz: "Ressonância homogênea e nobre por todo o organismo que se estende suavemente para uma passagem iluminada à frente.",
    estadoInicial: "Silhueta íntegra e amadurecida após os 20 dias de travessia.",
    transformacao: "A luz interna do corpo harmoniza-se com a luminosidade do ambiente cotidiano; o corpo dá um passo sereno rumo à porta aberta.",
    estadoFinal: "Passagem serena e assentada para a vida real; a pessoa retorna ancorada em si mesma. 'Eu reintegro a vida.'",
    criterioAprovacao: "Sem áudio, o espectador testemunha o fechamento com o corpo inteiro iluminado harmonicamente e a transição serena para a vida cotidiana?",
    arquivoVideoEsperado: "/videos/dia-21.mp4",
    posterEsperado: "/artes/dia-21.png",
    videoPath: "/videos/dia-21.mp4",
    posterPath: "/artes/dia-21.png"
  }
] as const;

export const REGRA_UNIVERSAL_VIDEO = REGUA_VISUAL_MUDANCA_5.criterioDeCorte;
export const getVisualDiaInstrucao = (dia: number): VisualDiaInstrucao =>
  VISUAL_MAP_21_DIAS.find(item => item.dia === dia) ?? VISUAL_MAP_21_DIAS[0];
