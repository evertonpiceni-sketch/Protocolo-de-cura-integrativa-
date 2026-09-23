import { ProtocolStage } from '../types';

export const ORIGINAL_PROTOCOL_SCRIPTS: Record<string, any> = {
  ABERTURA: {
    id: 'ABERTURA',
    stageNumber: 1,
    title: 'Abertura e Decreto de Aceitação',
    subtitle: '',
    fullText: `Que bom ter você aqui.

Este momento foi preparado para que, por alguns minutos, você possa deixar um pouco do mundo lá fora e voltar a atenção para si.

Não há nada para provar, alcançar ou compreender agora. Apenas permita-se chegar, respirar e receber aquilo que foi preparado para esta jornada.

Eu, [NOME], aceito receber neste momento, com todo o meu coração, o Protocolo de Cura Integrada de 21 dias, conforme canalizado e aplicado por Everton Rodrigo Piceni.

Respire profundamente.

Perceba que, a partir deste momento, você não precisa carregar tudo sozinho.

Este é o seu tempo.

O seu espaço.

O seu encontro com você.`,
    ttsScript: `Que bom ter você aqui. <break time="1.8s" /> Este momento foi preparado para que, por alguns minutos, você possa deixar um pouco do mundo lá fora e voltar a atenção para si. <break time="2.2s" /> Não há nada para provar, alcançar ou compreender agora. Apenas permita-se chegar, respirar e receber aquilo que foi preparado para esta jornada. <break time="2.5s" /> Eu, [NOME], aceito receber neste momento, com todo o meu coração, o Protocolo de Cura Integrada de 21 dias, conforme canalizado e aplicado por Everton Rodrigo Piceni. <break time="2.5s" /> Respire profundamente. <break time="3s" /> Perceba que, a partir deste momento, você não precisa carregar tudo sozinho. <break time="2s" /> Este é o seu tempo. <break time="1.5s" /> O seu espaço. <break time="1.5s" /> O seu encontro com você.`,
    mantras: []
  },
  ATERRAMENTO: {
    id: 'ATERRAMENTO',
    stageNumber: 2,
    title: 'Aterramento e Purificação',
    subtitle: '',
    fullText: `Agora, vamos começar permitindo que o seu corpo reconheça o apoio que o sustenta. Antes de seguirmos, perceba que você pode repousar por alguns instantes. Há algo muito simples e profundo em sentir-se amparado. Por alguns instantes, não precisamos resolver nada. Vamos apenas chegar por inteiro neste momento.

Feche os olhos.

Respire fundo.

Puxe o ar pelo nariz, segure por três segundos e solte devagar pela boca.

Sinta o seu corpo relaxar na cadeira ou na cama.

Deixe de lado as preocupações, os pensamentos e os rótulos.

Neste momento, você é apenas presença, consciência e luz.

Imagine agora que raízes fortes saem da sola dos seus pés e da base da sua coluna, descendo profundamente até o coração da Terra.

Perceba essas raízes atravessando suavemente cada camada, encontrando um lugar firme onde possam se ancorar.

Sinta-se seguro.

Sinta-se firme.

Sinta-se aterrado.

Sinta que existe algo sustentando você.

Neste momento, ativo o Benzi Reiki.

Sinta uma mão ancestral e amorosa benzer a sua testa, o seu peito, as suas costas.

Como um sopro de arruda, guiné e benjoim, tudo aquilo que trouxe inquietação, pensamentos acelerados e peso ao longo do dia começa a ser suavemente cortado, limpo e desfeito.

Seu campo começa a se tornar mais leve.

Respire fundo, bem devagar.

Ao inspirar, traga para dentro de você a força, a coragem, a presença.

Segure o ar por alguns instantes.

E agora solte bem devagar, permitindo que vá embora tudo aquilo que já não precisa permanecer com você neste momento.

Perceba seus ombros relaxando.

A musculatura do rosto suavizando.

A cabeça ficando um pouco mais leve.

A respiração encontrando o próprio ritmo.

Permita-se relaxar.

Você está aqui.

Você está sendo sustentado.

E por alguns instantes, isso é suficiente.`,
    ttsScript: `Agora, vamos começar permitindo que o seu corpo reconheça o apoio que o sustenta. <break time="1.5s" /> Antes de seguirmos, perceba que você pode repousar por alguns instantes. Há algo muito simples e profundo em sentir-se amparado. <break time="2s" /> Por alguns instantes, não precisamos resolver nada. Vamos apenas chegar por inteiro neste momento. <break time="2.5s" /> Feche os olhos. <break time="2s" /> Respire fundo. <break time="3s" /> Puxe o ar pelo nariz. <break time="3s" /> Segure por três segundos. <break time="3s" /> E solte devagar pela boca. <break time="3s" /> Sinta o seu corpo relaxar na cadeira ou na cama. Deixe de lado as preocupações, os pensamentos e os rótulos. <break time="2s" /> Neste momento, você é apenas presença, consciência e luz. <break time="2s" /> Imagine agora que raízes fortes saem da sola dos seus pés e da base da sua coluna, descendo profundamente até o coração da Terra. <break time="3s" /> Perceba essas raízes atravessando suavemente cada camada, encontrando um lugar firme onde possam se ancorar. <break time="3s" /> Sinta-se seguro. <break time="1.5s" /> Sinta-se firme. <break time="1.5s" /> Sinta-se aterrado. <break time="1.8s" /> Sinta que existe algo sustentando você. <break time="2.5s" /> Neste momento, ativo o Benzi Reiki. Sinta uma mão ancestral e amorosa benzer a sua testa, o seu peito, as suas costas. <break time="2.5s" /> Como um sopro de arruda, guiné e benjoim, tudo aquilo que trouxe inquietação, pensamentos acelerados e peso ao longo do dia começa a ser suavemente cortado, limpo e desfeito. Seu campo começa a se tornar mais leve. <break time="2.5s" /> Respire fundo, bem devagar. <break time="3s" /> Ao inspirar, traga para dentro de você a força, a coragem, a presença. <break time="3s" /> Segure o ar por alguns instantes. <break time="3s" /> E agora solte bem devagar, permitindo que vá embora tudo aquilo que já não precisa permanecer com você neste momento. <break time="3s" /> Perceba seus ombros relaxando. <break time="1.8s" /> A musculatura do rosto suavizando. <break time="1.8s" /> A cabeça ficando um pouco mais leve. <break time="1.8s" /> A respiração encontrando o próprio ritmo. <break time="2.2s" /> Permita-se relaxar. Você está aqui. <break time="1.8s" /> Você está sendo sustentado. <break time="2s" /> E por alguns instantes, isso é suficiente.`,
    mantras: [
      'Meu corpo relaxa e minha mente serena.',
      'Estou seguro, firme e aterrado.',
      'Eu me permito receber sustentação.'
    ]
  },
  VITALIDADE: {
    id: 'VITALIDADE',
    stageNumber: 3,
    title: 'Desbloqueio, Vitalidade e Alinhamento',
    subtitle: '',
    fullText: `Com o corpo mais presente e o campo mais tranquilo, vamos agora abrir espaço para a sua força vital. Talvez existam partes de você que passaram muito tempo cansadas, sobrecarregadas ou simplesmente tentando continuar. Não precisamos exigir energia delas. Vamos apenas permitir que aquilo que ainda vive dentro de você comece, pouco a pouco, a se movimentar novamente.

Ativo o Reiki Usui e o Kundalini Reiki.

Sinta um calor suave e reconfortante subir pela sua coluna, desde a base até o topo da cabeça.

Esse calor atravessa as regiões onde a energia parecia parada.

Vai aquecendo aquilo que estava frio.

Movimentando aquilo que estava adormecido.

Suavizando o cansaço acumulado.

Sinta a força vital retornando às suas células.

Não de uma vez.

Não como uma exigência.

Mas como uma presença que começa a lembrar o seu corpo de que ainda existe vida circulando dentro dele.

Visualizamos agora o Reiki Cristalino e a Acupuntura Etérica Quântica.

Pequenos cristais de luz pura se formam ao redor do seu corpo e dos seus órgãos.

Imagine-os tocando suavemente as regiões que precisam de mais equilíbrio, dissolvendo antigas impressões de dor e abrindo espaço para um fluxo mais leve.

Agulhas feitas de pura luz dourada e azul são suavemente posicionadas nos pontos principais da sua cabeça e do seu corpo.

Elas não machucam.

São pontos de luz.

Perceba essas luzes organizando o fluxo energético, suavizando o excesso de estímulos, favorecendo mais presença, mais clareza, mais foco e mais estabilidade interior.

Respire profundamente.

Sinta essa energia percorrendo o seu campo mental e emocional.

Ela encontra aquilo que ficou guardado.

Dores.

Mágoas.

Tristezas.

Cansaços.

Experiências que ainda ocupavam espaço dentro de você.

E, com muito cuidado, tudo isso pode começar a receber um novo significado.

Respire novamente.

E, ao soltar o ar, imagine que parte desse peso pode finalmente deixar você.

Não precisamos retirar toda a história.

Apenas o peso que já não precisa acompanhá-la.

Respire no seu tempo.

Sinta a vida voltando a circular.`,
    ttsScript: `Com o corpo mais presente e o campo mais tranquilo, vamos agora abrir espaço para a sua força vital. <break time="2s" /> Talvez existam partes de você que passaram muito tempo cansadas, sobrecarregadas ou simplesmente tentando continuar. Não precisamos exigir energia delas. <break time="2s" /> Vamos apenas permitir que aquilo que ainda vive dentro de você comece, pouco a pouco, a se movimentar novamente. <break time="2.5s" /> Ativo o Reiki Usui e o Kundalini Reiki. <break time="1.8s" /> Sinta um calor suave e reconfortante subir pela sua coluna, desde a base até o topo da cabeça. <break time="3s" /> Esse calor atravessa as regiões onde a energia parecia parada. Vai aquecendo aquilo que estava frio. <break time="1.8s" /> Movimentando aquilo que estava adormecido. <break time="1.8s" /> Suavizando o cansaço acumulado. <break time="2s" /> Sinta a força vital retornando às suas células. Não de uma vez. <break time="1.5s" /> Não como uma exigência. <break time="1.5s" /> Mas como uma presença que começa a lembrar o seu corpo de que ainda existe vida circulando dentro dele. <break time="2.5s" /> Visualizamos agora o Reiki Cristalino e a Acupuntura Etérica Quântica. Pequenos cristais de luz pura se formam ao redor do seu corpo e dos seus órgãos. <break time="2s" /> Imagine-os tocando suavemente as regiões que precisam de mais equilíbrio, dissolvendo antigas impressões de dor e abrindo espaço para um fluxo mais leve. <break time="2.5s" /> Agulhas feitas de pura luz dourada e azul são suavemente posicionadas nos pontos principais da sua cabeça e do seu corpo. Elas não machucam. São pontos de luz. <break time="2s" /> Perceba essas luzes organizando o fluxo energético, suavizando o excesso de estímulos, favorecendo mais presença, mais clareza, mais foco e mais estabilidade interior. <break time="2.5s" /> Respire profundamente. <break time="3s" /> Sinta essa energia percorrendo o seu campo mental e emocional. Ela encontra aquilo que ficou guardado. <break time="1.8s" /> Dores. <break time="1.2s" /> Mágoas. <break time="1.2s" /> Tristezas. <break time="1.2s" /> Cansaços. <break time="1.8s" /> Experiências que ainda ocupavam espaço dentro de você. E, com muito cuidado, tudo isso pode começar a receber um novo significado. <break time="2.5s" /> Respire novamente. <break time="3s" /> E, ao soltar o ar, imagine que parte desse peso pode finalmente deixar você. <break time="3s" /> Não precisamos retirar toda a história. Apenas o peso que já não precisa acompanhá-la. <break time="2.5s" /> Respire no seu tempo. <break time="3s" /> Sinta a vida voltando a circular.`,
    mantras: [
      'A vitalidade encontra espaço dentro de mim.',
      'Minha mente encontra clareza e presença.',
      'Eu permito que a vida volte a circular.'
    ]
  },
  TRANSMUTACAO: {
    id: 'TRANSMUTACAO',
    stageNumber: 4,
    title: 'Transmutação e Proteção',
    subtitle: '',
    fullText: `Agora vamos um pouco mais fundo. Existem coisas que carregamos por tanto tempo que passam a fazer parte da maneira como vivemos, reagimos e nos protegemos. Neste momento, você não precisa lutar contra nenhuma delas. Apenas permita que sejam alcançadas por uma energia de transformação, proteção e acolhimento. Você continua sustentado durante todo este processo.

Elevamos agora a nossa vibração para uma frequência de grande intensidade e profundidade.

Ativo o Imara Reiki.

Permita que essa energia veloz e poderosa alcance as camadas mais escondidas do seu ser.

Camadas onde ficaram guardadas experiências antigas.

Dores da infância.

Memórias que talvez você compreenda e outras que talvez nem consiga nomear.

Sinta essa energia atravessando barreiras interiores.

Tocando aquilo que permaneceu em defesa por muito tempo.

Suavizando pensamentos que traziam medo.

Acalmando movimentos emocionais intensos.

Abrindo espaço onde antes parecia existir apenas confusão.

Para sustentar essa limpeza profunda, ativo o Reiki de São Miguel e os símbolos Zonar e Halu do Karuna Ki.

Uma poderosa cúpula de luz azul-safira começa a se formar ao seu redor.

Ela envolve o seu corpo.

O seu campo.

A sua presença.

Sinta-se protegido dentro dessa luz.

A Espada de São Miguel passa ao redor do seu campo, cortando os cordões da autossabotagem, do medo, das antigas dependências emocionais e das situações que já terminaram, mas que ainda pareciam permanecer ligadas a você.

Tudo aquilo que não precisa mais acompanhá-lo começa a ser liberado.

Dentro dessa cúpula azul, acendemos agora a Chama Violeta.

Veja essa chama envolvendo suavemente aquilo que ainda pesa.

As feridas da alma.

As culpas guardadas.

Os pensamentos que voltavam repetidamente.

As histórias que você carregou por tanto tempo.

Nada precisa ser negado.

Nada precisa ser arrancado.

Apenas permita que essa energia transforme aquilo que já pode ser transformado.

O turbilhão começa a desacelerar.

O caos começa a encontrar espaço.

Há um pouco mais de silêncio.

Um pouco mais de espaço dentro de você.

Respire novamente.

Ao inspirar, receba a leveza.

Receba o perdão por si mesmo.

Receba a paz.

Receba o amor próprio.

E, ao soltar o ar, permita que se afastem a autossabotagem, o medo, o sentimento de rejeição e aquilo que fez você acreditar que precisava se defender o tempo inteiro.

Lembre-se: estamos juntos neste processo.

Eu estou aqui ao seu lado, guiando este momento com cuidado, para que você possa se aproximar novamente do seu equilíbrio, da sua força e de si mesmo.`,
    ttsScript: `Agora vamos um pouco mais fundo. <break time="1.8s" /> Existem coisas que carregamos por tanto tempo que passam a fazer parte da maneira como vivemos, reagimos e nos protegemos. Neste momento, você não precisa lutar contra nenhuma delas. <break time="2s" /> Apenas permita que sejam alcançadas por uma energia de transformação, proteção e acolhimento. Você continua sustentado durante todo este processo. <break time="2.5s" /> Elevamos agora a nossa vibração para uma frequência de grande intensidade e profundidade. <break time="2s" /> Ativo o Imara Reiki. <break time="1.8s" /> Permita que essa energia veloz e poderosa alcance as camadas mais escondidas do seu ser. <break time="2.5s" /> Camadas onde ficaram guardadas experiências antigas. <break time="1.5s" /> Dores da infância. <break time="1.5s" /> Memórias que talvez você compreenda e outras que talvez nem consiga nomear. <break time="2s" /> Sinta essa energia atravessando barreiras interiores. Tocando aquilo que permaneceu em defesa por muito tempo. <break time="1.8s" /> Suavizando pensamentos que traziam medo. <break time="1.8s" /> Acalmando movimentos emocionais intensos. <break time="1.8s" /> Abrindo espaço onde antes parecia existir apenas confusão. <break time="2.5s" /> Para sustentar essa limpeza profunda, ativo o Reiki de São Miguel e os símbolos Zonar e Halu do Karuna Ki. <break time="2s" /> Uma poderosa cúpula de luz azul-safira começa a se formar ao seu redor. <break time="2.5s" /> Ela envolve o seu corpo. <break time="1.2s" /> O seu campo. <break time="1.2s" /> A sua presença. <break time="1.8s" /> Sinta-se protegido dentro dessa luz. <break time="2.5s" /> A Espada de São Miguel passa ao redor do seu campo, cortando os cordões da autossabotagem, do medo, das antigas dependências emocionais e das situações que já terminaram, mas que ainda pareciam permanecer ligadas a você. <break time="2.5s" /> Tudo aquilo que não precisa mais acompanhá-lo começa a ser liberado. <break time="2.5s" /> Dentro dessa cúpula azul, acendemos agora a Chama Violeta. <break time="2s" /> Veja essa chama envolvendo suavemente aquilo que ainda pesa. <break time="1.8s" /> As feridas da alma. <break time="1.2s" /> As culpas guardadas. <break time="1.2s" /> Os pensamentos que voltavam repetidamente. <break time="1.2s" /> As histórias que você carregou por tanto tempo. <break time="2s" /> Nada precisa ser negado. <break time="1.5s" /> Nada precisa ser arrancado. <break time="1.8s" /> Apenas permita que essa energia transforme aquilo que já pode ser transformado. <break time="2.5s" /> O turbilhão começa a desacelerar. O caos começa a encontrar espaço. <break time="2s" /> Há um pouco mais de silêncio. <break time="1.5s" /> Um pouco mais de espaço dentro de você. <break time="2.5s" /> Respire novamente. <break time="3s" /> Ao inspirar, receba a leveza. <break time="1.5s" /> Receba o perdão por si mesmo. <break time="1.5s" /> Receba a paz. <break time="1.5s" /> Receba o amor próprio. <break time="2s" /> E, ao soltar o ar, permita que se afastem a autossabotagem, o medo, o sentimento de rejeição e aquilo que fez você acreditar que precisava se defender o tempo inteiro. <break time="3s" /> Lembre-se: estamos juntos neste processo. <break time="1.8s" /> Eu estou aqui ao seu lado, guiando este momento com cuidado, para que você possa se aproximar novamente do seu equilíbrio, da sua força e de si mesmo.`,
    mantras: [
      'Eu acolho o que vivi e libero o que já pode partir.',
      'Estou protegido pela luz azul-safira.',
      'Respiro leveza, perdão e amor próprio.'
    ]
  },
  BALSAMO: {
    id: 'BALSAMO',
    stageNumber: 5,
    title: 'Amor Incondicional e Luz da Fonte',
    subtitle: '',
    fullText: `Depois de soltar, também existe o momento de receber. Talvez você tenha aprendido a ser forte, cuidar, sustentar, resolver e continuar. Agora, por alguns instantes, não é você quem precisa oferecer. É você quem pode receber. Permita que aquilo que se abriu dentro de você seja preenchido por presença, ternura, amor e cuidado.

Após essa grande limpeza, sinta a energia se suavizar.

Ela deixa de ter a intensidade da transmutação e começa a se tornar pura doçura.

Ativo o Reiki Raio Rosa.

Perceba essa energia chegando ao seu chakra cardíaco.

Uma luz rosa-quartzo começa a nascer no centro do seu peito.

Primeiro pequena.

Delicada.

E, pouco a pouco, ela começa a se expandir.

Sinta essa luz alcançando as regiões do seu coração onde ficaram guardadas experiências de abandono, rejeição, solidão, falta de acolhimento e momentos em que você gostaria de ter sido cuidado e talvez precisou continuar sozinho.

Essa luz não precisa apagar a sua história.

Ela apenas envolve essa história com outra presença.

Autoaceitação.

Compaixão.

Carinho.

Amor pela pessoa que você foi, pela pessoa que precisou sobreviver e pela pessoa que continua aqui.

Permita que os espaços vazios comecem a receber presença.

Conectamos agora com a Golden Light Source, a Fonte de Luz Dourada Primordial.

Imagine uma cascata de ouro líquido descendo suavemente do alto.

Ela toca o topo da sua cabeça e começa a atravessar todo o seu corpo.

Ilumina sua mente.

Passa pela garganta.

Encontra o coração.

Desce pelo abdômen.

Pelas pernas.

Até chegar aos pés.

Essa luz dourada se funde ao Raio de Ouro e Verde de São Rafael.

Imagine essa energia percorrendo todo o seu ser, levando equilíbrio, renovação e uma sensação profunda de reconexão.

Cada região recebe aquilo que precisa deste momento.

Sem pressa.

Sem excesso.

Apenas presença.

Você é parte da Fonte.

Você merece receber amor.

Você merece receber cuidado.

Respire novamente.

Segure o ar por alguns instantes.

E sinta o amor entrando em você.

Sinta os pensamentos desacelerando.

Sinta a coragem encontrando espaço.

Sinta a estabilidade se aproximando.

Sinta essa energia lembrando você de algo muito simples: você também merece estar ao seu próprio lado.

Agora solte o ar bem devagar.

Deixe ir os sentimentos que já cumpriram o papel deles.

Deixe ir aquilo que não precisa mais definir quem você é.

Você é especial.

Não pelo que produz.

Não pelo que consegue fazer.

Mas simplesmente porque existe.`,
    ttsScript: `Depois de soltar, também existe o momento de receber. <break time="1.8s" /> Talvez você tenha aprendido a ser forte, cuidar, sustentar, resolver e continuar. Agora, por alguns instantes, não é você quem precisa oferecer. <break time="2s" /> É você quem pode receber. <break time="2s" /> Permita que aquilo que se abriu dentro de você seja preenchido por presença, ternura, amor e cuidado. <break time="2.5s" /> Após essa grande limpeza, sinta a energia se suavizar. Ela deixa de ter a intensidade da transmutação e começa a se tornar pura doçura. <break time="2.5s" /> Ativo o Reiki Raio Rosa. Perceba essa energia chegando ao seu chakra cardíaco. <break time="2s" /> Uma luz rosa-quartzo começa a nascer no centro do seu peito. Primeiro pequena. <break time="1.2s" /> Delicada. <break time="1.5s" /> E, pouco a pouco, ela começa a se expandir. <break time="2.5s" /> Sinta essa luz alcançando as regiões do seu coração onde ficaram guardadas experiências de abandono, rejeição, solidão, falta de acolhimento e momentos em que você gostaria de ter sido cuidado e talvez precisou continuar sozinho. <break time="2.5s" /> Essa luz não precisa apagar a sua história. Ela apenas envolve essa história com outra presença. <break time="1.8s" /> Autoaceitação. <break time="1.2s" /> Compaixão. <break time="1.2s" /> Carinho. <break time="1.2s" /> Amor pela pessoa que você foi, pela pessoa que precisou sobreviver e pela pessoa que continua aqui. <break time="2.5s" /> Permita que os espaços vazios comecem a receber presença. <break time="2.5s" /> Conectamos agora com a Golden Light Source, a Fonte de Luz Dourada Primordial. <break time="2s" /> Imagine uma cascata de ouro líquido descendo suavemente do alto. <break time="2.5s" /> Ela toca o topo da sua cabeça e começa a atravessar todo o seu corpo. <break time="1.8s" /> Ilumina sua mente. <break time="1.2s" /> Passa pela garganta. <break time="1.2s" /> Encontra o coração. <break time="1.2s" /> Desce pelo abdômen. <break time="1.2s" /> Pelas pernas. <break time="1.2s" /> Até chegar aos pés. <break time="2.5s" /> Essa luz dourada se funde ao Raio de Ouro e Verde de São Rafael. Imagine essa energia percorrendo todo o seu ser, levando equilíbrio, renovação e uma sensação profunda de reconexão. <break time="2.5s" /> Cada região recebe aquilo que precisa deste momento. Sem pressa. <break time="1.5s" /> Sem excesso. <break time="1.5s" /> Apenas presença. <break time="2s" /> Você é parte da Fonte. <break time="1.5s" /> Você merece receber amor. <break time="1.5s" /> Você merece receber cuidado. <break time="2.5s" /> Respire novamente. <break time="3s" /> Segure o ar por alguns instantes. <break time="3s" /> E sinta o amor entrando em você. <break time="2s" /> Sinta os pensamentos desacelerando. <break time="1.5s" /> Sinta a coragem encontrando espaço. <break time="1.5s" /> Sinta a estabilidade se aproximando. <break time="1.8s" /> Sinta essa energia lembrando você de algo muito simples: você também merece estar ao seu próprio lado. <break time="2.5s" /> Agora solte o ar bem devagar. <break time="3s" /> Deixe ir os sentimentos que já cumpriram o papel deles. Deixe ir aquilo que não precisa mais definir quem você é. <break time="2.5s" /> Você é especial. <break time="1.5s" /> Não pelo que produz. <break time="1.2s" /> Não pelo que consegue fazer. <break time="1.5s" /> Mas simplesmente porque existe.`,
    mantras: [
      'Eu me permito receber amor e cuidado.',
      'Eu acolho a minha própria história.',
      'Eu também mereço estar ao meu lado.'
    ]
  },
  SELAMENTO: {
    id: 'SELAMENTO',
    stageNumber: 6,
    title: 'Selamento e Decreto Final',
    subtitle: '',
    fullText: `Estamos chegando ao encerramento deste encontro. Mas não há necessidade de sair daqui de repente. Vamos reunir tudo o que foi vivido, integrar aquilo que chegou até você e guardar dentro do seu campo o que este momento despertou. Talvez você não consiga explicar tudo agora, e não precisa. Apenas reconheça que esteve aqui, se permitiu receber e chegou até este ponto da jornada.

Para encerrar, integrar e proteger esta prática, ativo o Empoderamento de Ganesha.

Sinta a presença magnífica do removedor de obstáculos ao seu redor.

Não como algo distante.

Mas como uma força firme e acolhedora que caminha ao seu lado.

Ganesha começa a abrir espaço onde antes existiam barreiras.

Barreiras mentais.

Bloqueios emocionais.

Travas internas.

Medos que fizeram alguns caminhos parecerem impossíveis.

Sinta uma força de prosperidade, estabilidade e poder pessoal chegando suavemente ao topo da sua cabeça.

Perceba essa energia descendo e se espalhando por todo o seu corpo, encontrando os lugares que precisam de mais firmeza, confiança e sustentação.

Respire.

E permita-se receber essa força.

Visualize-se agora sentado firmemente naquele trono do seu sonho.

Perceba o lugar onde você está.

As nuvens sob você estão calmas.

O movimento ao redor diminuiu.

Existe silêncio.

Existe presença.

E você permanece sentado ali.

Não porque precisa dominar alguma coisa.

Mas porque reconhece o seu próprio lugar.

Ganesha se posiciona ao seu lado como um guardião.

Uma nova chance existe diante de você.

Os caminhos começam a se abrir.

E tudo aquilo que foi vivido neste encontro permanece integrado e protegido em seu campo.

Respire profundamente.

Sinta tudo se acomodando.

E agora, devagar, repita internamente cada uma destas palavras.

Dê tempo para que cada frase encontre espaço dentro de você.

Eu sou livre para ser feliz.

Respire.

Eu me perdoo por todas as vezes em que duvidei de mim mesmo.

Respire.

Eu sou cura.

Eu sou amor.

Eu estou em paz.

Sinto muito.

Me perdoe.

Eu te amo.

Sou grato.

E por último:

Gratidão por ter chegado até aqui.

Permaneça alguns instantes em silêncio.

Perceba a sua respiração.

O seu corpo.

A presença que existe agora.

E, quando retornar, leve com você apenas uma lembrança:

Você pode voltar para si quantas vezes precisar.`,
    ttsScript: `Estamos chegando ao encerramento deste encontro. Mas não há necessidade de sair daqui de repente. <break time="2s" /> Vamos reunir tudo o que foi vivido, integrar aquilo que chegou até você e guardar dentro do seu campo o que este momento despertou. <break time="2s" /> Talvez você não consiga explicar tudo agora, e não precisa. Apenas reconheça que esteve aqui, se permitiu receber e chegou até este ponto da jornada. <break time="2.5s" /> Para encerrar, integrar e proteger esta prática, ativo o Empoderamento de Ganesha. <break time="2s" /> Sinta a presença magnífica do removedor de obstáculos ao seu redor. Não como algo distante. <break time="1.5s" /> Mas como uma força firme e acolhedora que caminha ao seu lado. <break time="2s" /> Ganesha começa a abrir espaço onde antes existiam barreiras. <break time="1.5s" /> Barreiras mentais. <break time="1.2s" /> Bloqueios emocionais. <break time="1.2s" /> Travas internas. <break time="1.2s" /> Medos que fizeram alguns caminhos parecerem impossíveis. <break time="2s" /> Sinta uma força de prosperidade, estabilidade e poder pessoal chegando suavemente ao topo da sua cabeça. <break time="2.5s" /> Perceba essa energia descendo e se espalhando por todo o seu corpo, encontrando os lugares que precisam de mais firmeza, confiança e sustentação. <break time="2.5s" /> Respire. <break time="3s" /> E permita-se receber essa força. <break time="2.5s" /> Visualize-se agora sentado firmemente naquele trono do seu sonho. <break time="2.5s" /> Perceba o lugar onde você está. As nuvens sob você estão calmas. O movimento ao redor diminuiu. <break time="2s" /> Existe silêncio. <break time="1.5s" /> Existe presença. <break time="1.8s" /> E você permanece sentado ali. Não porque precisa dominar alguma coisa. Mas porque reconhece o seu próprio lugar. <break time="2.5s" /> Ganesha se posiciona ao seu lado como um guardião. Uma nova chance existe diante de você. Os caminhos começam a se abrir. <break time="2.5s" /> E tudo aquilo que foi vivido neste encontro permanece integrado e protegido em seu campo. <break time="2.5s" /> Respire profundamente. <break time="3s" /> Sinta tudo se acomodando. <break time="2.5s" /> E agora, devagar, repita internamente cada uma destas palavras. Dê tempo para que cada frase encontre espaço dentro de você. <break time="2.5s" /> Eu sou livre para ser feliz. <break time="3s" /> Respire. <break time="3s" /> Eu me perdoo por todas as vezes em que duvidei de mim mesmo. <break time="3s" /> Respire. <break time="3s" /> Eu sou cura. <break time="2.5s" /> Eu sou amor. <break time="2.5s" /> Eu estou em paz. <break time="3s" /> Sinto muito. <break time="2s" /> Me perdoe. <break time="2s" /> Eu te amo. <break time="2s" /> Sou grato. <break time="3s" /> E por último: Gratidão por ter chegado até aqui. <break time="3s" /> Permaneça alguns instantes em silêncio. <break time="3s" /> Perceba a sua respiração. <break time="2s" /> O seu corpo. <break time="1.5s" /> A presença que existe agora. <break time="2.5s" /> E, quando retornar, leve com você apenas uma lembrança: <break time="2s" /> Você pode voltar para si quantas vezes precisar.`,
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
