/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NumerologyData } from '../types';

// Pythagorean letter-to-number mapping table
const PYTHAGOREAN_TABLE: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U', 'Y']);

function normalizeText(text: string): string {
  return text
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z]/g, '');
}

function reduceToSingleOrMaster(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num
      .toString()
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return num;
}

function reduceToSingle(num: number): number {
  while (num > 9) {
    num = num
      .toString()
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return num;
}

// Life path archetypes
const LIFE_PATH_ARCHETYPES: Record<number, {
  title: string;
  meaning: string;
  keywords: string[];
  color: string;
  crystal: string;
  frequency: string;
  affirmation: string;
}> = {
  1: {
    title: 'O Líder Pioneiro & Criador',
    meaning: 'Sua jornada é marcada pela independência, originalidade, autoconfiança e capacidade de abrir novos caminhos onde ninguém antes pisou.',
    keywords: ['Liderança', 'Iniciativa', 'Autonomia', 'Originalidade', 'Coragem'],
    color: 'Vermelho Rubi / Dourado Solar',
    crystal: 'Pirita & Cornalina',
    frequency: '528Hz (Transformação Solar)',
    affirmation: 'Eu confio no meu poder criativo e abro caminhos com coragem e luz.'
  },
  2: {
    title: 'O Diplomata Intuitivo & Pacificador',
    meaning: 'Sua missão envolve cooperação, sensibilidade empática, escuta profunda e construção de pontes de harmonia e amor no mundo.',
    keywords: ['Sensibilidade', 'Empatia', 'Parceria', 'Paz', 'Intuição'],
    color: 'Laranja Suave / Prata Lunar',
    crystal: 'Pedra da Lua & Quartzo Rosa',
    frequency: '639Hz (Conexão e Relacionamentos)',
    affirmation: 'Minha presença traz paz, união e harmonia para todas as relações.'
  },
  3: {
    title: 'O Comunicador Brilhante & Expressivo',
    meaning: 'Sua alma vibra na arte da expressão, otimismo, magnetismo social, criatividade inspiradora e alegria de viver.',
    keywords: ['Comunicação', 'Criatividade', 'Alegria', 'Entusiasmo', 'Inspiração'],
    color: 'Amarelo Radiante / Âmbar',
    crystal: 'Citrino & Olho de Tigre',
    frequency: '528Hz (Alegria & Milagres)',
    affirmation: 'Expresso minha verdade com brilho, amor, criatividade e alegria.'
  },
  4: {
    title: 'O Construtor Sólido & Mestre da Disciplina',
    meaning: 'Sua vocação é estruturar bases firmes, trazer segurança material, organização prática, lealdade e realização terrena consistente.',
    keywords: ['Estrutura', 'Estabilidade', 'Organização', 'Foco', 'Perseverança'],
    color: 'Verde Esmeralda / Terracota',
    crystal: 'Jaspe Vermelho & Quartzo Verde',
    frequency: '396Hz (Aterramento e Segurança)',
    affirmation: 'Construo minhas vitórias sobre alicerces sólidos de paz e perseverança.'
  },
  5: {
    title: 'O Viajante Livre & Agente de Transformação',
    meaning: 'Sua missão é experienciar a liberdade divina, adaptação dinâmica a mudanças, evolução veloz e magnetismo aventureiro.',
    keywords: ['Liberdade', 'Mudança', 'Curiosidade', 'Magnetismo', 'Evolução'],
    color: 'Azul Turquesa / Celeste',
    crystal: 'Água-Marinha & Sodalita',
    frequency: '741Hz (Despertar da Intuição)',
    affirmation: 'Abraço as transformações da vida com leveza, sabedoria e liberdade.'
  },
  6: {
    title: 'O Guardião do Amor & Harmonia Familiar',
    meaning: 'Sua essência é o serviço amoroso, acolhimento generoso, cura de feridas relacionais, proteção do lar e senso de beleza sagrada.',
    keywords: ['Amor Incondicional', 'Cuidado', 'Família', 'Equilíbrio', 'Cura'],
    color: 'Rosa Suave / Verde Oliva',
    crystal: 'Quartzo Rosa & Rodocrosita',
    frequency: '639Hz (Harmonia no Amor)',
    affirmation: 'Eu sou um canal vivo de amor incondicional, acolhimento e equilíbrio.'
  },
  7: {
    title: 'O Místico Sábio & Buscador da Verdade',
    meaning: 'Sua jornada é a investigação espiritual profunda, meditação, sabedoria oculta, introspecção refinada e transcendência consciencial.',
    keywords: ['Espiritualidade', 'Sabedoria', 'Introspecção', 'Filosofia', 'Conexão Superior'],
    color: 'Violeta / Índigo Profundo',
    crystal: 'Ametista & Lápis-Lazúli',
    frequency: '852Hz (Despertar Espiritual)',
    affirmation: 'Minha mente silencia para ouvir a sabedoria eterna da minha alma.'
  },
  8: {
    title: 'O Mestre da Realização & Prosperidade Quântica',
    meaning: 'Seu destino é governar com integridade, gerenciar grandes energias de abundância, liderança executiva e justiça kármica.',
    keywords: ['Abundância', 'Poder Pessoal', 'Justiça', 'Eficiência', 'Vitória'],
    color: 'Dourado Imperial / Preto Ônix',
    crystal: 'Pirita & Turmalina Negra',
    frequency: '963Hz / 528Hz (Abundância Universal)',
    affirmation: 'Eu atraio e multiplico a prosperidade divina em benefício de todos.'
  },
  9: {
    title: 'O Filantropo Universal & Consciência Crística',
    meaning: 'Sua alma encarna a compaixão global, desapego sábio, fechamento de ciclos kármicos e iluminação através da fraternidade universal.',
    keywords: ['Compaixão', 'Amor Universal', 'Sabedoria Ancestral', 'Perdão', 'Transcendência'],
    color: 'Branco Pérola / Dourado Branco',
    crystal: 'Selenita & Cristal de Rocha',
    frequency: '963Hz (Conexão Divina e Unidade)',
    affirmation: 'Eu perdoo o passado e acolho a humanidade na luz do amor crístico.'
  },
  11: {
    title: 'Número Mestre 11: O Farol Espiritual & Canalizador de Luz',
    meaning: 'Vibração mestre de altíssima frequência. Você é um canal sensitivo direto para as dimensões superiores, inspirando multidões pela presença e intuição.',
    keywords: ['Mestria', 'Canalização', 'Iluminação', 'Visão Superior', 'Inspiração Divina'],
    color: 'Prata Celestial / Luz Translúcida',
    crystal: 'Labradorita & Selenita',
    frequency: '963Hz (Frequência Pineal dos Mestres)',
    affirmation: 'Sou um pilar de luz cósmica manifestando a verdade divina na Terra.'
  },
  22: {
    title: 'Número Mestre 22: O Grande Construtor do Novo Mundo',
    meaning: 'Vibração mestre dos visionários práticos. Capacidade ímpar de materializar sonhos grandiosos que beneficiam gerações inteiras e a sociedade.',
    keywords: ['Grande Arquiteto', 'Impacto Global', 'Materialização', 'Legado', 'Poder Manifestador'],
    color: 'Azul Real / Dourado Esmeralda',
    crystal: 'Malaquita & Safira Azul',
    frequency: '528Hz & 963Hz (Manifestação Perfeita)',
    affirmation: 'Eu construo obras de luz duradouras que elevam a humanidade.'
  },
  33: {
    title: 'Número Mestre 33: O Mestre da Compaixão & Guia Crístico',
    meaning: 'A mais elevada vibração de amor altruísta. Vocação para cura espontânea, serviço aos necessitados, iluminação espiritual e graça divina.',
    keywords: ['Graça Divina', 'Cura Quântica', 'Amor Sacrificial', 'Mestre Espiritual', 'Redenção'],
    color: 'Rosa Dourado / Violeta Translúcido',
    crystal: 'Kunzita & Diamante de Herkimer',
    frequency: '963Hz / 528Hz (Amor Cósmico Supremo)',
    affirmation: 'Meu coração irradia a graça e a cura do amor divino incondicional.'
  }
};

// Personal Year forecasts
const PERSONAL_YEAR_DATA: Record<number, { meaning: string; guidance: string }> = {
  1: {
    meaning: 'Ano 1: Início de um Novo Ciclo de 9 Anos. Momento de plantar sementes, tomar iniciativas corajosas e lançar projetos.',
    guidance: 'Não hesite em começar de novo. Tudo o que você iniciar com determinação neste ano definirá os próximos 9 anos da sua vida.'
  },
  2: {
    meaning: 'Ano 2: Paciência, Parcerias e Gestação. Momento de cuidar do que foi plantado, cultivar diplomacia e nutrir relacionamentos.',
    guidance: 'Pratique a escuta e a cooperação. Não force resultados imediatos; permita que o tempo mature suas conquistas.'
  },
  3: {
    meaning: 'Ano 3: Expansão, Criatividade e Autoexpressão. Momento de brilhar socialmente, comunicar suas ideias e celebrar a vida.',
    guidance: 'Expresse seus talentos com entusiasmo. Esteja aberto(a) para contatos benéficos e atividades criativas.'
  },
  4: {
    meaning: 'Ano 4: Trabalho Focado, Organização e Alvenaria. Momento de colocar a casa em ordem, consolidar finanças e construir estabilidade.',
    guidance: 'Tenha disciplina e atenção aos detalhes. O esforço bem direcionado agora garante segurança duradoura.'
  },
  5: {
    meaning: 'Ano 5: Mudanças, Viagens e Libertação. Ano dinâmico de reviravoltas positivas, novas oportunidades e quebra de rotinas estagnadas.',
    guidance: 'Seja flexível e aceite as novidades. Livre-se do que te aprisiona e aproveite o fluxo da liberdade.'
  },
  6: {
    meaning: 'Ano 6: Lar, Família, Amor e Responsabilidades Afetivas. Momento de harmonizar a casa, resolver questões familiares e cuidar de quem se ama.',
    guidance: 'Dedique tempo para embelezar seu espaço e curar pendências com entes queridos. O amor é sua maior força.'
  },
  7: {
    meaning: 'Ano 7: Introspecção, Estudo e Crescimento Espiritual. Ano de recolhimento fértil, conexão com a alma e aprofundamento filosófico.',
    guidance: 'Priorize o silêncio, a meditação e o autoconhecimento. Evite correrias materiais desnecessárias.'
  },
  8: {
    meaning: 'Ano 8: Colheita Material, Prosperidade e Poder Pessoal. Momento de colher os frutos financeiros e profissionais dos anos anteriores.',
    guidance: 'Assuma sua liderança e aja com justiça e ética. As portas do sucesso financeiro e do reconhecimento estão abertas.'
  },
  9: {
    meaning: 'Ano 9: Encerramento de Ciclo, Limpeza e Libertação. Ano de desapego do que não serve mais, perdão e preparação para o novo ciclo.',
    guidance: 'Desfaça-se de pesos do passado. Perdoe de coração aberto e prepare seu campo para o novo ciclo que nascerá.'
  }
};

export function calculateNumerology(fullName: string, birthDate: string): NumerologyData {
  const cleanName = normalizeText(fullName || 'Consulente');
  const [yearStr, monthStr, dayStr] = (birthDate || '1990-01-01').split('-');
  
  const birthYear = parseInt(yearStr, 10) || 1990;
  const birthMonth = parseInt(monthStr, 10) || 1;
  const birthDay = parseInt(dayStr, 10) || 1;

  // 1. Life Path Number (Caminho de Vida / Destino)
  const daySum = reduceToSingle(birthDay);
  const monthSum = reduceToSingle(birthMonth);
  const yearSum = reduceToSingle(
    birthYear
      .toString()
      .split('')
      .reduce((acc, d) => acc + parseInt(d, 10), 0)
  );

  const rawLifePath = daySum + monthSum + yearSum;
  const lifePathNumber = reduceToSingleOrMaster(rawLifePath);

  // 2. Soul Number (Número da Alma / Vogais)
  let soulSum = 0;
  for (const char of cleanName) {
    if (VOWELS.has(char)) {
      soulSum += PYTHAGOREAN_TABLE[char] || 0;
    }
  }
  const soulNumber = reduceToSingleOrMaster(soulSum || 1);

  // 3. Personality Number (Número da Personalidade / Consoantes)
  let personalitySum = 0;
  for (const char of cleanName) {
    if (!VOWELS.has(char)) {
      personalitySum += PYTHAGOREAN_TABLE[char] || 0;
    }
  }
  const personalityNumber = reduceToSingleOrMaster(personalitySum || 1);

  // 4. Expression Number (Número de Expressão / Total do Nome)
  let expressionSum = 0;
  for (const char of cleanName) {
    expressionSum += PYTHAGOREAN_TABLE[char] || 0;
  }
  const expressionNumber = reduceToSingleOrMaster(expressionSum || 1);

  // 5. Personal Year (Ano Pessoal)
  const currentCalendarYear = new Date().getFullYear(); // 2026
  const rawPersonalYear = daySum + monthSum + reduceToSingle(
    currentCalendarYear
      .toString()
      .split('')
      .reduce((acc, d) => acc + parseInt(d, 10), 0)
  );
  const personalYear = reduceToSingle(rawPersonalYear);

  // 6. Birth Day Number (Dia Natalício)
  const birthDayNumber = birthDay;

  // 7. Maturity Number (Número de Maturidade = Caminho de Vida + Expressão)
  const rawMaturity = lifePathNumber + expressionNumber;
  const maturityNumber = reduceToSingleOrMaster(rawMaturity);
  const maturityArchetype = LIFE_PATH_ARCHETYPES[maturityNumber] || LIFE_PATH_ARCHETYPES[1];

  // Archetype Data
  const archetype = LIFE_PATH_ARCHETYPES[lifePathNumber] || LIFE_PATH_ARCHETYPES[1];
  const personalYearInfo = PERSONAL_YEAR_DATA[personalYear] || PERSONAL_YEAR_DATA[1];

  const soulArchetype = LIFE_PATH_ARCHETYPES[soulNumber] || LIFE_PATH_ARCHETYPES[1];
  const personalityArchetype = LIFE_PATH_ARCHETYPES[personalityNumber] || LIFE_PATH_ARCHETYPES[1];
  const expressionArchetype = LIFE_PATH_ARCHETYPES[expressionNumber] || LIFE_PATH_ARCHETYPES[1];

  // Name Prosperity Harmonization & Signature Analysis
  const currentNameVibration = expressionNumber;
  let prosperityScore = 75;
  if ([8, 11, 22, 1, 3].includes(currentNameVibration)) prosperityScore = 95;
  else if ([4, 5, 6].includes(currentNameVibration)) prosperityScore = 85;

  const currentVibrationMeaning = (() => {
    switch (currentNameVibration) {
      case 8: return 'Vibração 8: Frequência máxima de abundância material, poder executivo, liderança de negócios e justiça kármica próspera.';
      case 1: return 'Vibração 1: Magnetismo de liderança pioneira, conquistas independentes e abertura de novos mercados e projetos.';
      case 3: return 'Vibração 3: Magnetismo expressivo para vendas, comunicação, visibilidade pública, redes sociais e expansão de clientes.';
      case 4: return 'Vibração 4: Estabilidade e construção sólida de patrimônio; exige atenção para não cair no excesso de rigidez.';
      case 5: return 'Vibração 5: Rapidez de negócios e versatilidade; excelente para comércio, viagens e oportunidades dinâmicas.';
      case 6: return 'Vibração 6: Prosperidade gerada pelo afeto, prestação de serviços com amor, consultoria, saúde e acolhimento.';
      case 7: return 'Vibração 7: Prosperidade via autoridade técnica, sabedoria especializada, ensino, mentorias e espiritualidade.';
      case 9: return 'Vibração 9: Atração de recursos através de grandes projetos filantrópicos, alcance internacional e liderança humanitária.';
      case 11: return 'Vibração Mestre 11: Iluminação inspiradora que magnetiza reconhecimento, autoridade moral e recursos de alto impacto.';
      case 22: return 'Vibração Mestre 22: O Grande Manifestador. Capacidade ímpar de criar impérios e estruturas que sustentam milhares de pessoas.';
      default: return 'Vibração em harmonização para aceleração de prosperidade financeira e clareza de propósitos.';
    }
  })();

  const recommendedNameHarmonizations: string[] = [
    `Análise da Vibração Atual do Nome (${currentNameVibration}): ${currentVibrationMeaning}`,
    'Ajuste para Assinatura Profissional: Para potencializar contratos e transações comerciais, busque assinar com uma combinação de nomes que resulte na soma 8 (Materialização & Lucro) ou soma 1 (Pioneirismo & Sucesso).',
    'Adição Harmônica de Letra ou Acento: Se seu nome social estiver em vibrações com lições kármicas, a adição sutil de uma letra (como duplicar uma consoante intermediária "L" ou "R") ou o uso de um segundo sobrenome pode transmutar a vibração para 8 ou 3.',
    'Nome de Marca e Nome Artístico: Para empresas, perfis digitais e marcas, padronize a escrita para que a soma dos caracteres vibre nas frequências de magnetismo de prosperidade (3, 8 ou 22).'
  ];

  const signatureAdvice: string[] = [
    'Inclinação Ascendente (15° a 30°): Assine sempre com o traço subindo para o alto e para a direita. Jamais assine com linha descendente para baixo (que denota esgotamento energético e perda de recursos).',
    'Sem Cortes ou Traços Regressivos: Nunca trace linhas ou riscos que cortem as letras do seu próprio nome, nem passe um traço por baixo voltando para a esquerda (isso bloqueia inconscientemente seu progresso financeiro).',
    'Nome Legível e Completo no Início: A primeira letra do seu nome deve ser desenhada com clareza, firmeza e elegância, afirmando sua autoridade no plano físico.',
    'Ponto Final Sagrado (.): Finalize a assinatura com um ponto final firme à direita. Na radiestesia cabalística, o ponto final sela os ganhos financeiros, blindando contra desperdícios e vazamento de energia.',
    'Fluidez e Firmeza: Pratique sua nova assinatura 21 vezes em papel branco virgem em estado de meditação, consagrando-a com a frequência 528Hz.'
  ];

  const dailyProsperityAttitudes: string[] = [
    '1. Bênção Imediata de Todos os Pagamentos: Toda vez que pagar um boleto, conta ou compra, decrete mentalmente: "Abençoo este dinheiro que sai e abro espaço para que ele retorne multiplicado por mil à minha vida e à de quem recebe."',
    '2. Carteira e Dinheiro em Ordem Sagrada: Mantenha suas notas desdobradas, organizadas por valor crescente e descarte recibos antigos. A energia do dinheiro busca ambientes de ordem, respeito e clareza.',
    '3. Liberação da Culpa do Merecimento: Todo dia pela manhã, coloque a mão direita no coração e afirme 3 vezes: "Eu mereço viver com abundância divina, conforto, paz e fartura transbordante."',
    '4. Circulação e Gratidão: Pratique ao menos uma micro-ação diária de generosidade espontânea (um elogio sincero, uma gorjeta consciente ou auxílio a alguém). A prosperidade é um rio que precisa fluir.',
    '5. Conexão Noturna com a Frequência 528Hz ou 852Hz: Antes de adormecer, escute 5 a 10 minutos de frequências sonoras no app visualizando seus projetos materializados com plenitude.'
  ];

  // Specific Practical Attitudes based on Life Path Number
  const practicalAttitudes: string[] = [
    `🎯 Ação Chave do Caminho ${lifePathNumber}: ${archetype.affirmation}`,
    `💎 Cristal e Conexão: Mantenha um(a) ${archetype.crystal} na sua mesa de trabalho ou cabeceira para alinhar seu campo eletromagnético.`,
    `🎨 Cor de Ativação Quântica: Utilize a cor ${archetype.color} em roupas ou acessórios em dias de decisões importantes ou negociações.`,
    `🌊 Frequência Vibracional: Realize as meditações diárias sintonizando em ${archetype.frequency} para dissolver bloqueios no chakra correspondente.`,
    `⚖️ Postura Sistêmica Recomendada: Honre profundamente pai e mãe no seu coração para liberar o fluxo de força realizadora e sucesso na matéria.`
  ];

  // Missing numbers in the name (Karmic lessons)
  const presentDigits = new Set<number>();
  for (const char of cleanName) {
    const val = PYTHAGOREAN_TABLE[char];
    if (val) presentDigits.add(val);
  }
  const karmicLessons: string[] = [];
  for (let i = 1; i <= 9; i++) {
    if (!presentDigits.has(i)) {
      switch (i) {
        case 1: karmicLessons.push('Lição 1: Desenvolver autoconfiança, independência e iniciativa pessoal sem depender de validação alheia.'); break;
        case 2: karmicLessons.push('Lição 2: Cultivar paciência, diplomacia e escuta amorosa nas parcerias e sociedades.'); break;
        case 3: karmicLessons.push('Lição 3: Expressar sua criatividade autêntica e liberar sua voz e talentos sem medo do julgamento.'); break;
        case 4: karmicLessons.push('Lição 4: Aprender a ter método, rotina produtiva, organização financeira e foco constante.'); break;
        case 5: karmicLessons.push('Lição 5: Aceitar mudanças com sabedoria, flexibilidade e vivenciar a liberdade com responsabilidade.'); break;
        case 6: karmicLessons.push('Lição 6: Assumir compromissos familiares com amor, sem carregar pesos que não são seus.'); break;
        case 7: karmicLessons.push('Lição 7: Dedicar tempo à espiritualidade, silêncio interior e estudo dos mistérios da vida.'); break;
        case 8: karmicLessons.push('Lição 8: Harmonizar o fluxo de abundância material com ética, senso de merecimento e liderança.'); break;
        case 9: karmicLessons.push('Lição 9: Praticar a compaixão e o desapego sábio, fechando ciclos antigos com gratidão e perdão.'); break;
      }
    }
  }

  return {
    lifePathNumber,
    lifePathTitle: archetype.title,
    lifePathMeaning: archetype.meaning,
    lifePathKeywords: archetype.keywords,

    soulNumber,
    soulMeaning: `O que sua alma secretamente busca e anseia: ${soulArchetype.keywords.join(', ')}. ${soulArchetype.meaning}`,

    personalityNumber,
    personalityMeaning: `A impressão magnética que você causa nos outros ao entrar em um ambiente: ${personalityArchetype.keywords.join(', ')}.`,

    expressionNumber,
    expressionMeaning: `O conjunto de talentos inatos e ferramentas que o Universo colocou à sua disposição para realizar seu destino: ${expressionArchetype.title}.`,

    maturityNumber,
    maturityMeaning: `O Número de Maturidade (${maturityNumber}) entra em vigor pleno a partir dos 35-40 anos, revelando o ápice da sua colheita de vida e sabedoria: ${maturityArchetype.title} - ${maturityArchetype.meaning}`,

    personalYear,
    personalYearMeaning: personalYearInfo.meaning,
    personalYearGuidance: personalYearInfo.guidance,

    birthDayNumber,
    birthDayMeaning: `Nascido(a) no dia ${birthDay}: Traz dons especiais de ${birthDay <= 9 ? (LIFE_PATH_ARCHETYPES[birthDay]?.keywords[0] || 'Liderança') : 'Força Solar, Intuição e Magnetismo de Realização'}.`,

    karmicLessons: karmicLessons.length > 0 ? karmicLessons : ['Seu nome possui todas as vibrações de 1 a 9 ativadas, conferindo grande versatilidade e maturidade kármica.'],

    harmonicColor: archetype.color,
    harmonicCrystal: archetype.crystal,
    suggestedFrequency: archetype.frequency,
    affirmation: archetype.affirmation,
    isFullUnlocked: false,

    nameProsperityAnalysis: {
      currentNameVibration,
      currentVibrationMeaning,
      prosperityScore,
      recommendedNameHarmonizations,
      signatureAdvice,
      dailyProsperityAttitudes
    },
    practicalAttitudes
  };
}
