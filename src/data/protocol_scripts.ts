import { ProtocolStage } from '../types';

export const ORIGINAL_PROTOCOL_SCRIPTS: Record<string, any> = {
  ABERTURA: {
    id: 'ABERTURA',
    stageNumber: 1,
    title: 'Abertura e Decreto de Aceitação',
    subtitle: 'Portal Energético',
    fullText: `"Eu... (diga seu nome), aceito receber nesse momento com todo o meu coração, o Protocolo de Cura Integrada de 21 dias, conforme canalizado e aplicado por Éverton Rodrigo Piceni."`,
    ttsScript: `Eu, [NOME], aceito receber nesse momento com todo o meu coração, o Protocolo de Cura Integrada de 21 dias, conforme canalizado e aplicado por Éverton Rodrigo Piceni.`,
    mantras: []
  },
  ATERRAMENTO: {
    id: 'ATERRAMENTO',
    stageNumber: 2,
    title: 'Aterramento e Purificação',
    subtitle: 'Conexão com a Terra e Limpeza',
    fullText: `"Feche os olhos. Respire fundo... Puxe o ar pelo nariz, segure por três segundos... e solte devagar pela boca. Sinta o seu corpo físico relaxar na cadeira ou na cama. Deixe de lado as preocupações, os diagnósticos, os rótulos. Neste momento, você é apenas consciência e luz.

Imagine agora que raízes fortes saem da sola dos seus pés e da base da sua coluna, descendo profundamente até o coração da Terra. Sinta-se seguro, firme e aterrado.

Neste momento, ativo o Benzi Reiki. Sinta uma mão ancestral e amorosa benzer a sua testa, o seu peito, as suas costas. Como um sopro de arruda, guiné e benjoim, toda a ansiedade, os pensamentos acelerados e o peso do dia começam a ser cortados e desfeitos agora. O seu campo está limpo. Respire fundo bem devagar trazendo para si a força, a coragem, segure o ar por 5 segundos, agora solte bem devagar, começando a deixar ir, tudo o que já não é necessário e sentindo o seus ombros relaxaram, a cabeça começa a ficar leve. Se permita relaxar nesse momento."`,
    ttsScript: `Feche os olhos. Respire fundo... Puxe o ar pelo nariz, segure por três segundos... e solte devagar pela boca. Sinta o seu corpo físico relaxar na cadeira ou na cama. Deixe de lado as preocupações, os diagnósticos, os rótulos. Neste momento, você é apenas consciência e luz. Imagine agora que raízes fortes saem da sola dos seus pés e da base da sua coluna, descendo profundamente até o coração da Terra. Sinta-se seguro, firme e aterrado. Neste momento, ativo o Benzi Reiki. Sinta uma mão ancestral e amorosa benzer a sua testa, o seu peito, as suas costas. Como um sopro de arruda, guiné e benjoim, toda a ansiedade, os pensamentos acelerados e o peso do dia começam a ser cortados e desfeitos agora. O seu campo está limpo. Respire fundo bem devagar trazendo para si a força, a coragem, segure o ar por 5 segundos, agora solte bem devagar, começando a deixar ir, tudo o que já não é necessário e sentindo o seus ombros relaxaram, a cabeça começa a ficar leve. Se permita relaxar nesse momento.`,
    mantras: [
      'Meu corpo relaxa e minha mente serena.',
      'Estou seguro, firme e aterrado.',
      'Toda a ansiedade se desfaz, eu sinto paz.'
    ]
  },
  VITALIDADE: {
    id: 'VITALIDADE',
    stageNumber: 3,
    title: 'Desbloqueio, Vitalidade e Alinhamento do Sistema Nervoso',
    subtitle: 'Kundalini e Recalibração Mental',
    fullText: `"Ativo o Reiki Usui e o Kundalini Reiki. Sinta um calor suave e reconfortante subir pela sua coluna, desde a base até o topo da cabeça. Esse calor queima a apatia, a depressão e a exaustão do Burnout. Sinta a força vital retornando às suas células. Visualizamos agora o Reiki Cristalino e a Acupuntura Etérica Quântica. Pequenos cristais de luz pura se formam ao redor do seu corpo e nos seus órgãos, dissolvendo suavemente as memórias de dor celular. Agulhas feitas de pura luz dourada e azul são suavemente posicionadas nos pontos principais da sua cabeça e do seu corpo. Sinta essas agulhas invisíveis organizarem o fluxo de energia no seu cérebro. Elas trazem foco para o TDAH, acalmam o excesso de estímulos do Autismo e equilibram as correntes elétricas dos ciclos da Bipolaridade. Respire na certeza de que seu sistema nervoso está sendo recalibrado.

Respire bem fundo novamente, sentindo a energia fluir em seu campo mental e emocional, indo diretamente na raíz das suas dores, mágoas, tristezas e ressignificando tudo isso. Agora solte o ar devagarinho, sentindo esse peso de emoções pesadas indo embora. Respire no seu tempo."`,
    ttsScript: `Ativo o Reiki Usui e o Kundalini Reiki. Sinta um calor suave e reconfortante subir pela sua coluna, desde a base até o topo da cabeça. Esse calor queima a apatia, a depressão e a exaustão do Burnout. Sinta a força vital retornando às suas células. Visualizamos agora o Reiki Cristalino e a Acupuntura Etérica Quântica. Pequenos cristais de luz pura se formam ao redor do seu corpo e nos seus órgãos, dissolvendo suavemente as memórias de dor celular. Agulhas feitas de pura luz dourada e azul são suavemente posicionadas nos pontos principais da sua cabeça e do seu corpo. Sinta essas agulhas invisíveis organizarem o fluxo de energia no seu cérebro. Elas trazem foco para o TDAH, acalmam o excesso de estímulos do Autismo e equilibram as correntes elétricas dos ciclos da Bipolaridade. Respire na certeza de que seu sistema nervoso está sendo recalibrado. Respire bem fundo novamente, sentindo a energia fluir em seu campo mental e emocional, indo diretamente na raíz das suas dores, mágoas, tristezas e ressignificando tudo isso. Agora solte o ar devagarinho, sentindo esse peso de emoções pesadas indo embora. Respire no seu tempo.`,
    mantras: [
      'A vitalidade retorna para cada célula.',
      'Minha mente está em foco, clareza e paz.',
      'Meu sistema nervoso está recalibrado.'
    ]
  },
  TRANSMUTACAO: {
    id: 'TRANSMUTACAO',
    stageNumber: 4,
    title: 'A Força do Imara, Transmutação e Proteção Psíquica',
    subtitle: 'Limpeza de Traumas e Chama Violeta',
    fullText: `"Elevamos agora a nossa vibração para uma frequência de altíssima intensidade. Ativo o Imara Reiki. Deixe que essa energia veloz e poderosa penetre nas camadas mais escondidas da sua mente. O Imara atua diretamente nos traumas de vidas passadas, nas dores da infância e nas feridas do TEPT que você nem lembra que existem. Sinta essa força quebrando barreiras espirituais, dissipando as paranoias e acalmando a instabilidade do Borderline.

Para sustentar essa limpeza profunda, ativo o Reiki de São Miguel e os símbolos Zonar e Halu do Karuna Ki. Uma poderosa cúpula de luz azul-safira se fecha ao seu redor. A Espada de São Miguel corta todos os cordões de autossabotagem. Dentro dessa cúpula azul, acendemos a Chama Violeta. Veja as feridas da alma e a culpa inconsciente serem queimadas e transmutadas em pura força de recomeço. O turbilhão passou. O caos foi limpo.

Respire novamente: Respirando nesse momento a leveza, o perdão a si mesmo, a paz, o amor próprio. E inspire: Deixando ir a autosabotagem, o medo, o sentimento de rejeição. Lembre-se estamos juntos nesse processo. Eu estou aqui ao seu lado, lhe guiando para a sua melhora do quadro."`,
    ttsScript: `Elevamos agora a nossa vibração para uma frequência de altíssima intensidade. Ativo o Imara Reiki. Deixe que essa energia veloz e poderosa penetre nas camadas mais escondidas da sua mente. O Imara atua diretamente nos traumas de vidas passadas, nas dores da infância e nas feridas do TEPT que você nem lembra que existem. Sinta essa força quebrando barreiras espirituais, dissipando as paranoias e acalmando a instabilidade do Borderline. Para sustentar essa limpeza profunda, ativo o Reiki de São Miguel e os símbolos Zonar e Halu do Karuna Ki. Uma poderosa cúpula de luz azul-safira se fecha ao seu redor. A Espada de São Miguel corta todos os cordões de autossabotagem. Dentro dessa cúpula azul, acendemos a Chama Violeta. Veja as feridas da alma e a culpa inconsciente serem queimadas e transmutadas em pura força de recomeço. O turbilhão passou. O caos foi limpo. Respire novamente: Respirando nesse momento a leveza, o perdão a si mesmo, a paz, o amor próprio. E inspire: Deixando ir a autosabotagem, o medo, o sentimento de rejeição. Lembre-se estamos juntos nesse processo. Eu estou aqui ao seu lado, lhe guiando para a sua melhora do quadro.`,
    mantras: [
      'A Chama Violeta transmuta todo medo e dor.',
      'Estou protegido pela luz azul-safira.',
      'Respiro leveza, perdão e amor próprio.'
    ]
  },
  BALSAMO: {
    id: 'BALSAMO',
    stageNumber: 5,
    title: 'Amor Incondicional e Luz da Fonte',
    subtitle: 'Névoa Regeneradora e Autoaceitação',
    fullText: `"Após a grande limpeza, sinta a energia se suavizar, tornando-se pura doçura. O Reiki Raio Rosa inunda o seu chakra cardíaco. Sinta uma luz rosa-quartzo expandir do seu peito. Ela cura a dor do abandono e da rejeição, preenchendo o seu ser com autoaceitação, compaixão e amor por sua própria jornada. O vazio da depressão é totalmente preenchido. 

Conectamos agora com a Golden Light Source, a Fonte de Luz Dourada Primordial. Uma cascata de ouro líquido desce do topo da sua cabeça, iluminando cada átomo do seu corpo. Essa luz dourada se funde ao Raio de Ouro e Verde de São Rafael, promovendo uma regeneração biológica e espiritual completa nos seus pulmões, na sua mente e na sua alma. Você é perfeito, você é um reflexo da Fonte. 

Respire novamente e segure por 5 segundos e sinta o amor entrando em você, os pensamentos desacelrando, a caragaem vindo, a estabilidade chegando, sinta essa energia de reconexão contigo. Solte bem devagar e deixe ir todos aqueles sentimentos que outrora você nutria. Você é especial."`,
    ttsScript: `Após a grande limpeza, sinta a energia se suavizar, tornando-se pura doçura. O Reiki Raio Rosa inunda o seu chakra cardíaco. Sinta uma luz rosa-quartzo expandir do seu peito. Ela cura a dor do abandono e da rejeição, preenchendo o seu ser com autoaceitação, compaixão e amor por sua própria jornada. O vazio da depressão é totalmente preenchido. Conectamos agora com a Golden Light Source, a Fonte de Luz Dourada Primordial. Uma cascata de ouro líquido desce do topo da sua cabeça, iluminando cada átomo do seu corpo. Essa luz dourada se funde ao Raio de Ouro e Verde de São Rafael, promovendo uma regeneração biológica e espiritual completa nos seus pulmões, na sua mente e na sua alma. Você é perfeito, você é um reflexo da Fonte. Respire novamente e segure por 5 segundos e sinta o amor entrando em você, os pensamentos desacelrando, a caragaem vindo, a estabilidade chegando, sinta essa energia de reconexão contigo. Solte bem devagar e deixe ir todos aqueles sentimentos que outrora você nutria. Você é especial.`,
    mantras: [
      'Eu sou amor incondicional e autoaceitação.',
      'Minha saúde e células se regeneram em luz.',
      'Eu sou um reflexo da Fonte Criadora.'
    ]
  },
  SELAMENTO: {
    id: 'SELAMENTO',
    stageNumber: 6,
    title: 'Selamento com Ganesha e Decreto de Libertação',
    subtitle: 'Estabilidade e Mantras de Cura',
    fullText: `Para encerrar, selar e blindar este tratamento, ativo o Empoderamento de Ganesha. Sinta a presença magnífica e aterradora do removedor de obstáculos ao seu redor. Ganesha quebra todas as barreiras mentais, os bloqueios emocionais e as travas que impediam a sua evolução. Sinta uma força de prosperidade, estabilidade e poder pessoal preencher o seu Ori.

Visualize-se agora sentado firmemente naquele trono do seu sonho. As nuvens sob você estão calmas. Ganesha se posiciona ao seu lado como um guardião. A 'nova chance' foi dada, os caminhos estão abertos e o tratamento está totalmente selado no seu DNA cósmico.

(Agora fale de forma pausada, sentindo cada palavra) 
Eu sou livre para ser feliz.
Eu me perdoo por todas as vezes que duvidei de mim mesmo.
Eu sou cura.
Eu sou amor.
Eu estou em paz.
Sinto muito.
Me perdoe.
Eu te amo.
Sou grato.
Gratidão por ter chegado até aqui.`,
    ttsScript: `Para encerrar, selar e blindar este tratamento, ativo o Empoderamento de Ganesha. Sinta a presença magnífica e aterradora do removedor de obstáculos ao seu redor. Ganesha quebra todas as barreiras mentais, os bloqueios emocionais e as travas que impediam a sua evolução. Sinta uma força de prosperidade, estabilidade e poder pessoal preencher o seu Ori. Visualize-se agora sentado firmemente naquele trono do seu sonho. As nuvens sob você estão calmas. Ganesha se posiciona ao seu lado como um guardião. A nova chance foi dada, os caminhos estão abertos e o tratamento está totalmente selado no seu DNA cósmico. Eu sou livre para ser feliz. Eu me perdoo por todas as vezes que duvidei de mim mesmo. Eu sou cura. Eu sou amor. Eu estou em paz. Sinto muito. Me perdoe. Eu te amo. Sou grato. Gratidão por ter chegado até aqui.`,
    mantras: [
      'Eu sou livre para ser feliz.',
      'Eu sou cura, amor e paz.',
      'Sinto muito. Me perdoe. Eu te amo. Sou grato.'
    ]
  }
};

export const DISTANCE_TREATMENT_SCRIPT = {
  INTRO: {
    title: 'Introdução e Preparação',
    fullText: `Olá. Seja muito bem-vindo, seja muito bem-vinda a esta sessão de alinhamento e transmutação energética à distância. Este áudio está programado para ativar no seu campo exatamente no momento em que você o escuta. Agora, procure uma posição confortável. Você pode se deitar ou sentar-se com a coluna ereta e os pés bem apoiados no chão. Feche os olhos suavemente... Respire fundo... Inspire trazendo ar fresco para os seus pulmões... e expire, soltando qualquer tensão do dia, qualquer preocupação, qualquer pressa... (Pausa) Mais uma vez, respire fundo... e ao soltar o ar, autorize o seu corpo a relaxar completamente. Coloque a intenção de receber todas as frequências de cura que serão enviadas a você agora.`,
    ttsScript: `Olá. Seja muito bem-vindo, seja muito bem-vinda a esta sessão de alinhamento e transmutação energética à distância. Este áudio está programado para ativar no seu campo exatamente no momento em que você o escuta. Agora, procure uma posição confortável. Você pode se deitar ou sentar-se com a coluna ereta e os pés bem apoiados no chão. Feche os olhos suavemente. Respire fundo. Inspire trazendo ar fresco para os seus pulmões, e expire, soltando qualquer tensão do dia, qualquer preocupação, qualquer pressa. Mais uma vez, respire fundo, e ao soltar o ar, autorize o seu corpo a relaxar completamente. Coloque a intenção de receber todas as frequências de cura que serão enviadas a você agora.`
  },
  MIGUEL: {
    title: 'Limpeza e Proteção com Reiki São Miguel',
    fullText: `Neste momento, abrimos o nosso canal energético e invocamos a presença, a proteção e a luz do Arcanjo Miguel e a frequência sagrada do Reiki São Miguel. Visualize ou sinta, no topo da sua cabeça, uma intensa luz azul-safira começar a se formar. Ela envolve todo o seu corpo físico, criando uma bolha de proteção brilhante e impenetrável ao seu redor. (Pausa) Com a Espada de Luz de São Miguel, cortamos agora todos os cordões energéticos nocivos, todos os apegos, formas-pensamento de ansiedade, medos e influências externas que não pertencem ao seu bem maior. Está cortado, liberado e purificado. Sinta um alívio imediato no seu peito e nos seus ombros. Apenas a luz permanece no seu campo.`,
    ttsScript: `Neste momento, abrimos o nosso canal energético e invocamos a presença, a proteção e a luz do Arcanjo Miguel e a frequência sagrada do Reiki São Miguel. Visualize ou sinta, no topo da sua cabeça, uma intensa luz azul-safira começar a se formar. Ela envolve todo o seu corpo físico, criando uma bolha de proteção brilhante e impenetrável ao seu redor. Com a Espada de Luz de São Miguel, cortamos agora todos os cordões energéticos nocivos, todos os apegos, formas-pensamento de ansiedade, medos e influências externas que não pertencem ao seu bem maior. Está cortado, liberado e purificado. Sinta um alívio imediato no seu peito e nos seus ombros. Apenas a luz permanece no seu campo.`
  },
  VIOLETA: {
    title: 'Transmutação com a Chama Violeta',
    fullText: `Agora, ancoramos a frequência da Chama Violeta e a presença do Mestre Saint Germain. Imagine que, a partir da sola dos seus pés, uma chama de cor violeta intensa e brilhante começa a subir. Ela não queima, ela purifica. Essa chama violeta envolve cada uma das suas células, subindo pelas suas pernas, abdômen, peito, braços, garganta e cabeça. Ela atua transmutando cada bloqueio, cada tristeza guardada, cada energia estagnada em pura sabedoria e luz. (Pausa) Deixe que o fogo sagrado limpe a sua mente e acalme as suas emoções. O que era denso agora se dissolve e se transforma.`,
    ttsScript: `Agora, ancoramos a frequência da Chama Violeta e a presença do Mestre Saint Germain. Imagine que, a partir da sola dos seus pés, uma chama de cor violeta intensa e brilhante começa a subir. Ela não queima, ela purifica. Essa chama violeta envolve cada uma das suas células, subindo pelas suas pernas, abdômen, peito, braços, garganta e cabeça. Ela atua transmutando cada bloqueio, cada tristeza guardada, cada energia estagnada em pura sabedoria e luz. Deixe que o fogo sagrado limpe a sua mente e acalme as suas emoções. O que era denso agora se dissolve e se transforma.`
  },
  RAFAEL: {
    title: 'Regeneração com os Raios de Ouro de São Rafael',
    fullText: `Com o campo limpo e transmutado, invocamos a presença do Arcanjo Rafael, do Mestre Hilarion e dos Raios de Ouro e Verde-Esmeralda. Uma chuva de luz dourada reluzente, entremeada com relâmpagos verde-esmeralda, começa a descer sobre você. Essa luz de ouro preenche cada espaço que foi limpo, restaurando a sua vitalidade, selando a sua aura com cura, paz e equilíbrio físico e emocional. (Pausa) Sinta suas energias completamente renovadas. Todo o seu sistema elétrico e os seus chakras estão agora alinhados, pulsando em perfeita harmonia.`,
    ttsScript: `Com o campo limpo e transmutado, invocamos a presença do Arcanjo Rafael, do Mestre Hilarion e dos Raios de Ouro e Verde-Esmeralda. Uma chuva de luz dourada reluzente, entremeada com relâmpagos verde-esmeralda, começa a descer sobre você. Essa luz de ouro preenche cada espaço que foi limpo, restaurando a sua vitalidade, selando a sua aura com cura, paz e equilíbrio físico e emocional. Sinta suas energias completamente renovadas. Todo o seu sistema elétrico e os seus chakras estão agora alinhados, pulsando em perfeita harmonia.`
  },
  ANCORAMENTO: {
    title: 'Encerramento e Ancoramento',
    fullText: `Para ancorar essa cura na Terra, visualize raízes de luz saindo da sola dos seus pés, descendo profundamente até o centro da Mãe Terra, fixando toda essa energia no seu dia a dia. Agradecemos ao Arcanjo Miguel, ao Arcanjo Rafael, ao Mestre Saint Germain e a todas as forças de luz que sustentaram esta sessão. (Pausa) Grave essa sensação de paz no seu peito. Comece a mexer suavemente os dedos das mãos, os dedos dos pés... Respire fundo mais uma vez... e quando se sentir pronto, pode abrir os olhos, no seu tempo.`,
    ttsScript: `Para ancorar essa cura na Terra, visualize raízes de luz saindo da sola dos seus pés, descendo profundamente até o centro da Mãe Terra, fixando toda essa energia no seu dia a dia. Agradecemos ao Arcanjo Miguel, ao Arcanjo Rafael, ao Mestre Saint Germain e a todas as forças de luz que sustentaram esta sessão. Grave essa sensação de paz no seu peito. Comece a mexer suavemente os dedos das mãos, os dedos dos pés... Respire fundo mais uma vez... e quando se sentir pronto, pode abrir os olhos, no seu tempo.`
  }
};
