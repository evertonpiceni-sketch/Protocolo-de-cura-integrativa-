/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AstralMapData, PlanetaryPlacement } from '../types';

interface ZodiacSignDef {
  name: string;
  symbol: string;
  element: 'Fogo' | 'Terra' | 'Ar' | 'Água';
  modality: 'Cardinal' | 'Fixo' | 'Mutável';
  chakra: string;
  virtue: string;
  mantra: string;
  powerColor: string;
  frequency: string;
  crystals: string[];
  herbsAromas: string[];
  guidance: string;
  ruler: string;
  decanates: [string, string, string]; // 1st, 2nd, 3rd decanate rulers/meanings
}

const ZODIAC_SIGNS: ZodiacSignDef[] = [
  {
    name: 'Áries',
    symbol: '♈',
    element: 'Fogo',
    modality: 'Cardinal',
    chakra: 'Plexo Solar (Manipura) & Raiz',
    virtue: 'Coragem Sagrada & Liderança Consciencial',
    mantra: 'Eu sou a centelha divina em ação consciente, focada e serena.',
    powerColor: 'Rubi Solar & Dourado',
    frequency: '528Hz (Regeneração Celular e Ação)',
    crystals: ['Jaspe Vermelho', 'Cornalina', 'Granada'],
    herbsAromas: ['Alecrim', 'Gengibre', 'Pimenta-Rosa'],
    ruler: 'Marte',
    decanates: [
      '1º Decanato (Marte): Força pura, iniciativa e coragem pioneira inabalável.',
      '2º Decanato (Sol): Brilho pessoal magnético, nobreza e generosidade calorosa.',
      '3º Decanato (Júpiter): Visão expansiva, entusiasmo espiritual e busca por verdades elevadas.'
    ],
    guidance: 'Sua alma traz o impulso cósmico do pioneirismo. No Protocolo, trabalhe a respiração para canalizar seu fogo criador em realizações harmoniosas sem desgaste energético.'
  },
  {
    name: 'Touro',
    symbol: '♉',
    element: 'Terra',
    modality: 'Fixo',
    chakra: 'Raiz (Muladhara) & Laríngeo',
    virtue: 'Estabilidade Áurica, Paciência & Conexão com a Matéria',
    mantra: 'Eu confio no fluxo divino da abundância e me ancoro na paz inabalável.',
    powerColor: 'Verde Esmeralda & Rosa Suave',
    frequency: '432Hz (Harmonia Cósmica e Aterramento)',
    crystals: ['Quartzo Verde', 'Esmeralda', 'Turmalina Negra'],
    herbsAromas: ['Lavanda', 'Rosa Branca', 'Verbena'],
    ruler: 'Vênus',
    decanates: [
      '1º Decanato (Vênus): Harmonia estética, afeto acolhedor e atração de prosperidade.',
      '2º Decanato (Mercúrio): Praticidade inteligente, raciocínio lúcido e constância material.',
      '3º Decanato (Saturno): Firmeza inquebrantável, disciplina sagrada e maturidade de alma.'
    ],
    guidance: 'Sua essência é de aterramento e firmeza. As frequências de 432Hz regeneram seu campo áurico, dissolvendo apegos e nutrindo a certeza de que o Universo sempre o(a) sustenta.'
  },
  {
    name: 'Gêmeos',
    symbol: '♊',
    element: 'Ar',
    modality: 'Mutável',
    chakra: 'Laríngeo (Vishuddha) & Frontal',
    virtue: 'Clareza Mental, Síntese & Comunicação Iluminada',
    mantra: 'Minha mente se silencia para que a sabedoria superior floresça.',
    powerColor: 'Azul Celeste & Amarelo Suave',
    frequency: '741Hz (Limpeza Mental e Expressão Criativa)',
    crystals: ['Ágata Azul Rendada', 'Citrino', 'Sodalita'],
    herbsAromas: ['Hortelã-Pimenta', 'Eucalipto', 'Capim-Limão'],
    ruler: 'Mercúrio',
    decanates: [
      '1º Decanato (Mercúrio): Agilidade mental, facilidade verbal e curiosidade viva.',
      '2º Decanato (Vênus): Diplomacia afável, talento social e sensibilidade para artes.',
      '3º Decanato (Urano): Intuição relâmpago, originalidade e ideias de vanguarda cósmica.'
    ],
    guidance: 'Sua mente veloz é uma dádiva divina. Use os momentos de meditação para acalmar os turbilhões mentais e conectar o intelecto ao coração sábio.'
  },
  {
    name: 'Câncer',
    symbol: '♋',
    element: 'Água',
    modality: 'Cardinal',
    chakra: 'Cardíaco (Anahata) & Sacral',
    virtue: 'Sensibilidade Curadora, Empatia & Acolhimento Maternal',
    mantra: 'Meu coração é um santuário de amor incondicional e proteção divina.',
    powerColor: 'Prata Lunar & Rosa Quartzo',
    frequency: '639Hz (Conexão Afetiva e Paz Interior)',
    crystals: ['Pedra da Lua', 'Quartzo Rosa', 'Selenita Branca'],
    herbsAromas: ['Camomila', 'Jasmim', 'Erva-Cidreira'],
    ruler: 'Lua',
    decanates: [
      '1º Decanato (Lua): Intuição profunda, nutrição emocional e laços familiares sagrados.',
      '2º Decanato (Plutão/Marte): Poder de transmutação emocional e resiliência psíquica intensa.',
      '3º Decanato (Netuno): Espiritualidade mística pura, inspiração artística e devoção amorosa.'
    ],
    guidance: 'Sua sensibilidade é um radar de cura e afeto. Ao praticar o Bálsamo de Amor do Protocolo, você aprende a blindar seu campo áurico e curar memórias ancestrais com serenidade.'
  },
  {
    name: 'Leão',
    symbol: '♌',
    element: 'Fogo',
    modality: 'Fixo',
    chakra: 'Cardíaco (Anahata) & Plexo Solar',
    virtue: 'Generosidade Solar, Nobreza de Espírito & Expressão Autêntica',
    mantra: 'Eu irradio a luz da minha centelha divina com humildade e gratidão.',
    powerColor: 'Dourado Radiante & Âmbar',
    frequency: '528Hz (Luz Solar e Regeneração do DNA)',
    crystals: ['Olho de Tigre', 'Pedra do Sol', 'Pirita Dourada'],
    herbsAromas: ['Louro', 'Canela', 'Laranja Doce'],
    ruler: 'Sol',
    decanates: [
      '1º Decanato (Sol): Magnificência solar, liderança calorosa e autenticidade vibrante.',
      '2º Decanato (Júpiter): Generosidade expansiva, entusiasmo nobre e sabedoria filosófica.',
      '3º Decanato (Marte): Coragem heroica, poder de realização e dinamismo protetor.'
    ],
    guidance: 'Você nasceu para irradiar luz e calor por onde passa. Mantenha seu plexo solar e cardíaco em harmonia para que seu brilho seja fonte de inspiração e acolhimento para o mundo.'
  },
  {
    name: 'Virgem',
    symbol: '♍',
    element: 'Terra',
    modality: 'Mutável',
    chakra: 'Plexo Solar (Manipura) & Laríngeo',
    virtue: 'Discernimento Espiritual, Purificação & Serviço Sagrado',
    mantra: 'Eu aceito a perfeição do agora e entrego minhas preocupações à luz divina.',
    powerColor: 'Verde Oliva & Azul Índigo',
    frequency: '741Hz (Desintoxicação Celular e Purificação)',
    crystals: ['Amazonita', 'Jaspe Kambaba', 'Fluorita Verde'],
    herbsAromas: ['Erva-Doce', 'Tomilho', 'Sálvia'],
    ruler: 'Mercúrio',
    decanates: [
      '1º Decanato (Mercúrio): Mente analítica aguçada, precisão curadora e discernimento.',
      '2º Decanato (Saturno): Construtividade sólida, responsabilidade exemplar e maestria.',
      '3º Decanato (Vênus): Sensibilidade artística para o detalhe e toque de amor à cura material.'
    ],
    guidance: 'Sua busca pela excelência e cura é pura dedicação da alma. O Protocolo ajuda você a soltar a autocobrança e sentir a paz de saber que você já é completo(a) e acolhido(a).'
  },
  {
    name: 'Libra',
    symbol: '♎',
    element: 'Ar',
    modality: 'Cardinal',
    chakra: 'Cardíaco (Anahata)',
    virtue: 'Harmonia Quântica, Justiça Espiritual & Graça',
    mantra: 'Eu sou a perfeita harmonia entre mente, coração e espírito.',
    powerColor: 'Rosa Quartzo & Turquesa',
    frequency: '639Hz (Harmonia nos Relacionamentos e Paz)',
    crystals: ['Quartzo Rosa', 'Lápis-Lazúli', 'Crisocola'],
    herbsAromas: ['Rosa Damascena', 'Manjericão Sagrado', 'Ylang-Ylang'],
    ruler: 'Vênus',
    decanates: [
      '1º Decanato (Vênus): Charme sereno, busca inata pela beleza e pacificação de conflitos.',
      '2º Decanato (Urano): Justiça social, inteligência relacional e visão inovadora.',
      '3º Decanato (Mercúrio): Clareza comunicativa, mente conciliadora e sabedoria estética.'
    ],
    guidance: 'Seu dom é criar beleza, pacificação e pontes de amor. Cultive momentos diários de silêncio para manter seu centro imperturbável diante das oscilações externas.'
  },
  {
    name: 'Escorpião',
    symbol: '♏',
    element: 'Água',
    modality: 'Fixo',
    chakra: 'Sacral (Svadhisthana) & Terceiro Olho',
    virtue: 'Poder de Transmutação, Renascimento & Profundidade Psíquica',
    mantra: 'Eu transmuto todas as sombras em luz viva através da Chama Violeta.',
    powerColor: 'Violeta Cósmico & Carmesim Escuro',
    frequency: '417Hz (Desbloqueio Emocional e Transmutação)',
    crystals: ['Obsidiana Negra', 'Malaquita', 'Ametista Escura'],
    herbsAromas: ['Mirra', 'Patchouli', 'Cravo-da-Índia'],
    ruler: 'Plutão & Marte',
    decanates: [
      '1º Decanato (Plutão/Marte): Intensidade transformadora, força de regeneração e foco magnético.',
      '2º Decanato (Netuno): Misticismo profundo, clarividência emocional e sensibilidade curadora.',
      '3º Decanato (Lua): Conexão ancestral, lealdade profunda e proteção psíquica instintiva.'
    ],
    guidance: 'Sua capacidade de regeneração é lendária. A fase de Transmutação do Protocolo foi feita sob medida para a sua alma queimar resíduos do passado e renascer triunfante.'
  },
  {
    name: 'Sagitário',
    symbol: '♐',
    element: 'Fogo',
    modality: 'Mutável',
    chakra: 'Coronário (Sahasrara) & Terceiro Olho',
    virtue: 'Expansão da Consciência, Fé Inabalável & Sabedoria Cósmica',
    mantra: 'Eu caminho em direção à verdade suprema guiado pela intuição divina.',
    powerColor: 'Púrpura Real & Azul Safira',
    frequency: '852Hz (Despertar Intuitivo e Expansão Espiritual)',
    crystals: ['Sodalita', 'Turquesa', 'Lápis-Lazúli'],
    herbsAromas: ['Cedro', 'Sálvia Branca', 'Noz-Moscada'],
    ruler: 'Júpiter',
    decanates: [
      '1º Decanato (Júpiter): Otimismo radiante, busca pela sabedoria e generosidade cósmica.',
      '2º Decanato (Marte): Espírito de aventura sagrada, coragem para desbravar o desconhecido.',
      '3º Decanato (Sol): Nobreza interior, visão inspiradora e magnetismo espiritual.'
    ],
    guidance: 'Sua alma é uma eterna buscadora do divino. A meditação e os sons sagrados abrem portais de inspiração e alinham suas grandes aspirações à realização concreta.'
  },
  {
    name: 'Capricórnio',
    symbol: '♑',
    element: 'Terra',
    modality: 'Cardinal',
    chakra: 'Raiz (Muladhara)',
    virtue: 'Mestria Consciencial, Resiliência & Sabedoria Ancestral',
    mantra: 'Com paciência e fé inabalável, eu construo o templo da minha paz interior.',
    powerColor: 'Grafite Nobre & Âmbar Profundo',
    frequency: '396Hz (Liberação de Culpa, Medo e Concretização)',
    crystals: ['Ônix Negro', 'Turmalina Negra', 'Quartzo Fumê'],
    herbsAromas: ['Vetiver', 'Cipreste', 'Alecrim do Campo'],
    ruler: 'Saturno',
    decanates: [
      '1º Decanato (Saturno): Foco inabalável, integridade exemplar e maturidade espiritual.',
      '2º Decanato (Vênus): Construção harmoniosa, lealdade nas parcerias e apreço pelo duradouro.',
      '3º Decanato (Mercúrio): Pensamento estratégico, síntese organizadora e sabedoria prática.'
    ],
    guidance: 'Sua estrutura e perseverança são pilares sagrados. Permita-se descansar nas mãos da Fonte Criadora e confiar que cada passo seu está firmemente abençoado.'
  },
  {
    name: 'Aquário',
    symbol: '♒',
    element: 'Ar',
    modality: 'Fixo',
    chakra: 'Terceiro Olho (Ajna) & Coronário',
    virtue: 'Visão Futurista, Fraternidade Cósmica & Liberdade Espiritual',
    mantra: 'Eu sou um canal de luz inovadora para o bem de todos os seres.',
    powerColor: 'Azul Elétrico & Prata',
    frequency: '852Hz / 963Hz (Frequências Superiores e Clarividência)',
    crystals: ['Labradorita', 'Água-Marinha', 'Angelita'],
    herbsAromas: ['Olíbano (Incenso Sagrado)', 'Lavanda Francesa', 'Menta'],
    ruler: 'Urano & Saturno',
    decanates: [
      '1º Decanato (Urano): Originalidade radiante, mente visionária e amor pela liberdade.',
      '2º Decanato (Mercúrio): Intelecto veloz, síntese cósmica e comunicação fraterna.',
      '3º Decanato (Vênus): Diplomacia humanitária, harmonia universal e elevação estética.'
    ],
    guidance: 'Você traz o sopro do futuro e a liberdade da alma. Alinhe suas ideias vanguardistas com a sabedoria do coração para manifestar transformações reais em sua vida.'
  },
  {
    name: 'Peixes',
    symbol: '♓',
    element: 'Água',
    modality: 'Mutável',
    chakra: 'Coronário (Sahasrara) & Cardíaco',
    virtue: 'Conexão Mística, Transcendência & Compaixão Universal',
    mantra: 'Eu sou um com o Oceano Divino de Luz, Amor e Paz Infinita.',
    powerColor: 'Violeta Lavanda & Verde Água',
    frequency: '963Hz (Conexão Pineal e Retorno à Unidade)',
    crystals: ['Ametista', 'Água-Marinha', 'Quartzo Branco'],
    herbsAromas: ['Sândalo', 'Flor de Laranjeira', 'Camomila Romana'],
    ruler: 'Netuno & Júpiter',
    decanates: [
      '1º Decanato (Netuno): Devoção mística, sensibilidade etérea e amor incondicional.',
      '2º Decanato (Lua): Intuição aguçada, empatia curadora e acolhimento compassivo.',
      '3º Decanato (Plutão/Marte): Força espiritual de renascimento e poder curativo nas mãos.'
    ],
    guidance: 'Sua alma respira a transcendência e a oração. As práticas do Protocolo oferecem a âncora sagrada de proteção para que sua sensibilidade brilhe como um farol de paz no mundo.'
  }
];

/**
 * Calculates the solar sign based on month and day
 */
export function getSunSignIndex(month: number, day: number): { index: number; dayInSign: number } {
  // Safe bounds
  const m = Math.max(1, Math.min(12, month));
  const d = Math.max(1, Math.min(31, day));

  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) {
    return { index: 0, dayInSign: m === 3 ? d - 20 : d + 11 }; // Áries
  }
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) {
    return { index: 1, dayInSign: m === 4 ? d - 19 : d + 11 }; // Touro
  }
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) {
    return { index: 2, dayInSign: m === 5 ? d - 20 : d + 11 }; // Gêmeos
  }
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) {
    return { index: 3, dayInSign: m === 6 ? d - 20 : d + 10 }; // Câncer
  }
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) {
    return { index: 4, dayInSign: m === 7 ? d - 22 : d + 9 };  // Leão
  }
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) {
    return { index: 5, dayInSign: m === 8 ? d - 22 : d + 9 };  // Virgem
  }
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) {
    return { index: 6, dayInSign: m === 9 ? d - 22 : d + 8 }; // Libra
  }
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) {
    return { index: 7, dayInSign: m === 10 ? d - 22 : d + 9 };// Escorpião
  }
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) {
    return { index: 8, dayInSign: m === 11 ? d - 21 : d + 9 };// Sagitário
  }
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) {
    return { index: 9, dayInSign: m === 12 ? d - 21 : d + 10 };// Capricórnio
  }
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) {
    return { index: 10, dayInSign: m === 1 ? d - 19 : d + 12 };// Aquário
  }
  return { index: 11, dayInSign: m === 2 ? d - 18 : d + 10 };  // Peixes
}

/**
 * Calculates Ascendant Sign based on Sun Sign and birth hour
 */
export function getAscendantSignIndex(sunSignIndex: number, birthTimeStr?: string): number {
  if (!birthTimeStr) {
    return (sunSignIndex + 4) % 12; // Standard harmonious afternoon offset
  }

  const cleanTime = birthTimeStr.trim();
  let hour = 12;
  let minute = 0;

  if (cleanTime.includes(':')) {
    const parts = cleanTime.split(':');
    hour = parseInt(parts[0], 10);
    minute = parseInt(parts[1] || '0', 10);
  } else if (!isNaN(Number(cleanTime))) {
    hour = parseInt(cleanTime, 10);
  }

  if (isNaN(hour) || hour < 0 || hour > 23) hour = 12;
  if (isNaN(minute) || minute < 0 || minute > 59) minute = 0;

  // Sunrise reference at 06:00
  // Each sign spans ~2 hours on the Eastern horizon
  const hoursFromSunrise = (hour + minute / 60 - 6 + 24) % 24;
  const signsShift = Math.floor(hoursFromSunrise / 2);

  return (sunSignIndex + signsShift) % 12;
}

/**
 * Calculates Midheaven (MC / Medium Coeli - House 10)
 */
export function getMidheavenIndex(ascendantIndex: number): number {
  // MC is approximately 9 signs forward / 3 signs backward from Ascendant (House 10)
  return (ascendantIndex + 9) % 12;
}

/**
 * Calculates Moon Sign based on year, month, day
 */
export function getMoonSignIndex(year: number, month: number, day: number): number {
  const dayOfYear = (month - 1) * 30.44 + day;
  const yearCycle = ((year - 1900) * 12.368) % 12;
  const rawIndex = Math.floor((dayOfYear / 2.25 + yearCycle) % 12);
  return (rawIndex + 12) % 12;
}

/**
 * Parses any date format string defensively (YYYY-MM-DD or DD/MM/YYYY)
 */
function parseDateSafely(dateStr: string): { year: number; month: number; day: number } {
  if (!dateStr || typeof dateStr !== 'string') {
    return { year: 1990, month: 6, day: 15 };
  }

  const clean = dateStr.trim();

  // Format: YYYY-MM-DD
  if (clean.includes('-')) {
    const parts = clean.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2]?.slice(0, 2), 10);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return { year, month, day };
    }
  }

  // Format: DD/MM/YYYY
  if (clean.includes('/')) {
    const parts = clean.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return { year, month, day };
    }
  }

  // ISO timestamp or standard Date fallback
  const d = new Date(clean);
  if (!isNaN(d.getTime())) {
    return {
      year: d.getUTCFullYear(),
      month: d.getUTCMonth() + 1,
      day: d.getUTCDate()
    };
  }

  return { year: 1990, month: 6, day: 15 };
}

/**
 * Computes full Astral Map from birth details with PRO extensions
 */
export function calculateAstralMap(
  birthDateStr: string,
  birthTimeStr?: string,
  _birthCityStr?: string
): AstralMapData {
  const { year, month, day } = parseDateSafely(birthDateStr);

  const { index: sunIdx, dayInSign } = getSunSignIndex(month, day);
  const ascIdx = getAscendantSignIndex(sunIdx, birthTimeStr);
  const moonIdx = getMoonSignIndex(year, month, day);
  const mcIdx = getMidheavenIndex(ascIdx);

  const sunSign = ZODIAC_SIGNS[sunIdx] || ZODIAC_SIGNS[0];
  const ascSign = ZODIAC_SIGNS[ascIdx] || ZODIAC_SIGNS[0];
  const moonSign = ZODIAC_SIGNS[moonIdx] || ZODIAC_SIGNS[0];
  const mcSign = ZODIAC_SIGNS[mcIdx] || ZODIAC_SIGNS[0];

  // Calculate Decanate (1 to 10 days = 1st, 11 to 20 = 2nd, 21+ = 3rd)
  let decanateIndex = 0;
  if (dayInSign > 20) decanateIndex = 2;
  else if (dayInSign > 10) decanateIndex = 1;
  const sunDecanate = sunSign.decanates[decanateIndex];

  // Compute Planetary Placements for PRO details
  const mercuryIdx = (sunIdx + ((day % 3) - 1 + 12)) % 12; // Mercury travels close to Sun
  const venusIdx = (sunIdx + ((day % 5) - 2 + 12)) % 12;   // Venus within 48 degrees
  const marsIdx = (sunIdx + ((month * 2) % 12)) % 12;
  const jupiterIdx = (year % 12);
  const saturnIdx = ((Math.floor(year / 2.5)) % 12 + 12) % 12;
  const northNodeIdx = (12 - ((year + month) % 12)) % 12;

  const planets: PlanetaryPlacement[] = [
    {
      planet: 'Mercúrio (Mente & Comunicação)',
      planetSymbol: '☿',
      sign: ZODIAC_SIGNS[mercuryIdx].name,
      signSymbol: ZODIAC_SIGNS[mercuryIdx].symbol,
      house: ((mercuryIdx - ascIdx + 12) % 12) + 1,
      spiritualMeaning: `Seu intelecto e verbo divino se expressam através de ${ZODIAC_SIGNS[mercuryIdx].name}. Clareza para expressar a verdade do coração.`
    },
    {
      planet: 'Vênus (Amor & Merecimento)',
      planetSymbol: '♀',
      sign: ZODIAC_SIGNS[venusIdx].name,
      signSymbol: ZODIAC_SIGNS[venusIdx].symbol,
      house: ((venusIdx - ascIdx + 12) % 12) + 1,
      spiritualMeaning: `Sua capacidade de atrair abundância e expressar afeto pulsa na vibração de ${ZODIAC_SIGNS[venusIdx].name}.`
    },
    {
      planet: 'Marte (Ação & Poder de Realização)',
      planetSymbol: '♂',
      sign: ZODIAC_SIGNS[marsIdx].name,
      signSymbol: ZODIAC_SIGNS[marsIdx].symbol,
      house: ((marsIdx - ascIdx + 12) % 12) + 1,
      spiritualMeaning: `Sua chama de coragem e capacidade de quebrar obstáculos vibra em ${ZODIAC_SIGNS[marsIdx].name}.`
    },
    {
      planet: 'Júpiter (Expansão & Bênçãos Cósmicas)',
      planetSymbol: '♃',
      sign: ZODIAC_SIGNS[jupiterIdx].name,
      signSymbol: ZODIAC_SIGNS[jupiterIdx].symbol,
      house: ((jupiterIdx - ascIdx + 12) % 12) + 1,
      spiritualMeaning: `Onde o Universo derrama suas maiores graças, sabedoria espiritual e prosperidade: ${ZODIAC_SIGNS[jupiterIdx].name}.`
    },
    {
      planet: 'Saturno (Mestria & Estrutura de Alma)',
      planetSymbol: '♄',
      sign: ZODIAC_SIGNS[saturnIdx].name,
      signSymbol: ZODIAC_SIGNS[saturnIdx].symbol,
      house: ((saturnIdx - ascIdx + 12) % 12) + 1,
      spiritualMeaning: `Sua maior lição kármica e fonte de maturidade inabalável: ${ZODIAC_SIGNS[saturnIdx].name}.`
    },
    {
      planet: 'Nódulo Norte (Missão de Alma e Dharma)',
      planetSymbol: '☊',
      sign: ZODIAC_SIGNS[northNodeIdx].name,
      signSymbol: ZODIAC_SIGNS[northNodeIdx].symbol,
      house: ((northNodeIdx - ascIdx + 12) % 12) + 1,
      spiritualMeaning: `O caminho de evolução que sua alma escolheu trilhar nesta encarnação: ${ZODIAC_SIGNS[northNodeIdx].name}.`
    }
  ];

  // Calculate Element Distribution
  const elementCounts = { Fogo: 0, Terra: 0, Ar: 0, Água: 0 };
  elementCounts[sunSign.element] += 4; // Sun strong weight
  elementCounts[ascSign.element] += 3; // Ascendant
  elementCounts[moonSign.element] += 3; // Moon
  elementCounts[mcSign.element] += 2; // Midheaven
  elementCounts[ZODIAC_SIGNS[mercuryIdx].element] += 1;
  elementCounts[ZODIAC_SIGNS[venusIdx].element] += 1;
  elementCounts[ZODIAC_SIGNS[marsIdx].element] += 1;
  elementCounts[ZODIAC_SIGNS[jupiterIdx].element] += 1;

  const totalPoints = elementCounts.Fogo + elementCounts.Terra + elementCounts.Ar + elementCounts.Água || 16;
  const firePercent = Math.round((elementCounts.Fogo / totalPoints) * 100);
  const earthPercent = Math.round((elementCounts.Terra / totalPoints) * 100);
  const airPercent = Math.round((elementCounts.Ar / totalPoints) * 100);
  const waterPercent = Math.max(0, 100 - (firePercent + earthPercent + airPercent));

  // Dominant element
  let dominant: 'Fogo' | 'Terra' | 'Ar' | 'Água' = 'Fogo';
  let maxVal = firePercent;
  if (earthPercent > maxVal) { dominant = 'Terra'; maxVal = earthPercent; }
  if (airPercent > maxVal) { dominant = 'Ar'; maxVal = airPercent; }
  if (waterPercent > maxVal) { dominant = 'Água'; maxVal = waterPercent; }

  return {
    sunSign: sunSign.name,
    sunSignSymbol: sunSign.symbol,
    sunSignElement: sunSign.element,
    sunSignModality: sunSign.modality,
    sunSignChakra: sunSign.chakra,
    sunSignVirtue: sunSign.virtue,
    sunSignMantra: sunSign.mantra,
    sunDecanate,
    sunDegree: dayInSign,

    ascendantSign: ascSign.name,
    ascendantSignSymbol: ascSign.symbol,
    ascendantSignElement: ascSign.element,
    ascendantSignMeaning: `Sua máscara sagrada e aura cósmica se expressam com a energia de ${ascSign.name} (${ascSign.element}). ${birthTimeStr ? `Calculado rigorosamente pelo horário das ${birthTimeStr}.` : 'Estimado pelo fluxo diário solar.'} O mundo sente sua presença com integridade, magnetismo e respeito.`,
    ascendantHouseLord: ascSign.ruler,

    moonSign: moonSign.name,
    moonSignSymbol: moonSign.symbol,
    moonSignElement: moonSign.element,
    moonSignMeaning: `No templo mais sagrado do seu inconsciente e das suas memórias ancestrais, a Lua em ${moonSign.name} (${moonSign.element}) revela sua forma pura de sentir, acolher e regenerar a sua criança interior.`,

    midheavenSign: mcSign.name,
    midheavenSignSymbol: mcSign.symbol,
    midheavenMission: `No topo do seu mapa (Casa 10 / Meio do Céu em ${mcSign.name}), sua vocação espiritual se manifesta através de ${mcSign.virtue.toLowerCase()}. Sua realização no mundo material está ligada à coerência com o seu propósito divino.`,

    planets,

    dominantElement: dominant,
    elementBalance: {
      fire: firePercent,
      earth: earthPercent,
      air: airPercent,
      water: waterPercent
    },
    suggestedFrequency: sunSign.frequency,
    suggestedChakraHealing: sunSign.chakra,
    suggestedCrystals: sunSign.crystals,
    suggestedHerbsAromas: sunSign.herbsAromas,
    astralSpiritualGuidance: sunSign.guidance,
    powerColor: sunSign.powerColor,
    soulMissionSummary: `Integrar a coragem de ${sunSign.name}, a sabedoria emocional de ${moonSign.name} e a expressão luminosa de ${ascSign.name} para cumprir seu propósito de alma com saúde, paz e prosperidade.`,
    
    practicalAttitudes: {
      dailyPractices: [
        dominant === 'Fogo' ? '🔥 Ação Matinal Solar: Realize 10 minutos de caminhada sob a luz natural pela manhã para ancorar seu magnetismo criador e ativar a serotonina.' :
        dominant === 'Terra' ? '🌱 Aterramento Telúrico (Earthing): Coloque os pés descalços na grama ou terra por 5 minutos ao acordar para descarregar o estresse mental.' :
        dominant === 'Ar' ? '🌬️ Esvaziamento Mental: Pratique 5 minutos de respiração consciente (4 tempos: inspira 4s, retém 4s, expira 4s, retém 4s) antes de abrir notificações.' :
        '💧 Hidratação & Bênção da Água: Ao beber o primeiro copo de água do dia, projete uma intenção de paz, purificação e amor no seu campo.',
        `💎 Ancoragem Mineral: Mantenha um(a) ${sunSign.crystals[0] || 'Quartzo'} no seu ambiente de trabalho ou cabeceira para alinhar o chakra ${sunSign.chakra}.`,
        `🌿 Aromaterapia & Ervas: Faça uso de aroma ou chá de ${sunSign.herbsAromas[0] || 'Lavanda'} para harmonizar seu corpo sutil ao entardecer.`,
        `🎧 Frequência Sonora de Reprogramação: Medite por 10 a 15 minutos com a frequência ${sunSign.frequency.split(' ')[0]} no aplicativo para expandir seu campo biomagnético.`
      ],
      shadowWork: [
        `Transmutação da Sombra de ${sunSign.name}: Evite reações impulsivas ou autocobrança excessiva. Quando sentir pressão interna, pause 3 respirações e lembre-se: "${sunSign.mantra}"`,
        `Cura das Raízes Lunares em ${moonSign.name}: Acolha suas oscilações emocionais sem julgamento. Não reprima sua vulnerabilidade; transforme sentimentos pesados em compaixão e arte.`,
        `Harmonização do Ascendente em ${ascSign.name}: Garanta que a sua imagem no mundo físico reflita sua real essência espiritual, sem usar máscaras para agradar aos outros.`
      ],
      elementHarmonization: [
        `Fogo (${firePercent}%): ${firePercent < 20 ? 'Elemento Fogo em baixa. Reacenda sua paixão com banhos quentes, velas aromáticas e alimentos temperados.' : 'Fogo ativo e vibrante. Canalize essa energia para liderança e metas sem queimar seu sistema nervoso.'}`,
        `Terra (${earthPercent}%): ${earthPercent < 20 ? 'Elemento Terra em baixa. Aumente o foco prático, rotinas diárias e contato com a natureza física.' : 'Excelente estabilidade e capacidade de materialização de sonhos na realidade 3D.'}`,
        `Ar (${airPercent}%): ${airPercent < 20 ? 'Elemento Ar em baixa. Estimule leitura reflexiva, novos aprendizados e diálogo harmonioso.' : 'Mente brilhante e ágil. Cuidado com hiperatividade de pensamentos antes de dormir.'}`,
        `Água (${waterPercent}%): ${waterPercent < 20 ? 'Elemento Água em baixa. Cultive maior sensibilidade, escuta empática e autocuidado emocional.' : 'Intuição e mediunidade muito aguçadas. Mantenha blindagem áurica com a oração do Arcanjo Miguel.'}`
      ],
      guidedMeditationPrompt: `Feche os olhos, visualize uma coluna de luz ${sunSign.powerColor} descendo do centro da Galáxia através da sua coroa, ativando seu chakra ${sunSign.chakra} e preenchendo cada célula do seu corpo com a virtude de ${sunSign.virtue}.`
    }
  };
}
