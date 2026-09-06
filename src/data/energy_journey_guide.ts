export type EnergyDimension = 'body' | 'mind' | 'emotions' | 'spirit';

export interface EnergyPracticeGuide {
  id: string;
  name: string;
  subtitle: string;
  tradition: string;
  intention: string;
  body: string;
  mind: string;
  emotions: string;
  spirit: string;
  during: string;
  disclaimer?: string;
}

/**
 * Educational descriptions for the orientation shown before Day 1 and in
 * the daily "Energias de hoje" cards. These texts describe intentions and
 * traditional associations; they intentionally avoid medical claims.
 */
export const ENERGY_PRACTICE_GUIDES: EnergyPracticeGuide[] = [
  {
    id: 'reiki-usui',
    name: 'Reiki Usui',
    subtitle: 'Equilíbrio, presença e harmonização',
    tradition: 'Sistema de Reiki associado à tradição de Mikao Usui.',
    intention: 'Criar um momento de presença, relaxamento e percepção do próprio estado interior.',
    body: 'Prática voltada ao relaxamento e à percepção corporal, sem substituir cuidados de saúde.',
    mind: 'Convida à desaceleração, ao silêncio e à atenção ao momento presente.',
    emotions: 'Oferece um espaço de acolhimento e observação das emoções sem julgamento.',
    spirit: 'Tradicionalmente utilizado como prática de harmonização e conexão interior.',
    during: 'Respire naturalmente e apenas observe sensações, pensamentos e emoções, sem tentar produzir uma experiência específica.'
  },
  {
    id: 'karuna-ki',
    name: 'Karuna Ki',
    subtitle: 'Compaixão e acolhimento interior',
    tradition: 'Prática contemporânea de Reiki voltada simbolicamente à compaixão.',
    intention: 'Apoiar uma experiência meditativa de autocompaixão, acolhimento e transformação pessoal.',
    body: 'Pode acompanhar momentos de repouso consciente e percepção das tensões do corpo.',
    mind: 'Direciona a atenção para pensamentos recorrentes com uma postura mais compassiva.',
    emotions: 'Convida ao acolhimento de sentimentos difíceis e à reflexão sobre padrões emocionais.',
    spirit: 'É tradicionalmente associada à compaixão, ao perdão e ao aprofundamento da conexão interior.',
    during: 'Permita que a prática seja contemplativa. Não é necessário sentir calor, vibração ou qualquer outra sensação para que o momento tenha significado.'
  },
  {
    id: 'magnified-healing',
    name: 'Magnified Healing',
    subtitle: 'Intenção, centramento e consciência',
    tradition: 'Sistema espiritual contemporâneo utilizado em práticas meditativas e energéticas.',
    intention: 'Favorecer um momento de centramento, intenção consciente e reflexão espiritual.',
    body: 'Propõe atenção consciente ao corpo e à respiração durante a prática.',
    mind: 'Estimula foco, intenção e redução de distrações durante o exercício meditativo.',
    emotions: 'Convida a reconhecer o estado emocional presente com gentileza e consciência.',
    spirit: 'Na tradição da prática, está relacionado à expansão da consciência e ao sentido de conexão espiritual.',
    during: 'Mantenha uma postura confortável, respiração tranquila e uma intenção simples para o momento.'
  },
  {
    id: 'reiki-xamanico-estelar',
    name: 'Reiki Xamânico / Estelar',
    subtitle: 'Natureza, simbolismo e conexão',
    tradition: 'Abordagem espiritual que combina elementos simbólicos de Reiki e práticas inspiradas em tradições xamânicas.',
    intention: 'Criar uma experiência contemplativa de conexão com a natureza, símbolos e propósito pessoal.',
    body: 'Utiliza respiração e atenção corporal como recursos de aterramento e presença.',
    mind: 'Convida à imaginação guiada, concentração e observação de imagens e símbolos interiores.',
    emotions: 'Pode ser utilizado como espaço simbólico de reflexão e expressão emocional.',
    spirit: 'É apresentado como prática espiritual de conexão, ancestralidade simbólica e contemplação.',
    during: 'Receba imagens e sensações como parte da experiência subjetiva, sem necessidade de interpretá-las como fatos objetivos.'
  },
  {
    id: 'solfeggio',
    name: 'Frequências Solfeggio',
    subtitle: 'Som para ambientação meditativa',
    tradition: 'Frequências sonoras usadas em conteúdos contemporâneos de meditação e relaxamento.',
    intention: 'Oferecer uma paisagem sonora para respiração, atenção plena e prática contemplativa.',
    body: 'O som funciona como apoio para relaxamento e percepção corporal; não é apresentado como tratamento fisiológico.',
    mind: 'Pode servir como ponto de atenção durante meditação e exercícios respiratórios.',
    emotions: 'Ajuda a criar um ambiente pessoal para pausa, introspecção e observação emocional.',
    spirit: 'Pode acompanhar práticas espirituais conforme as crenças e preferências de cada pessoa.',
    during: 'Use volume confortável. Interrompa o áudio se causar incômodo, dor de cabeça ou desconforto.'
  },
  {
    id: 'respiracao-consciente',
    name: 'Respiração Consciente',
    subtitle: 'Presença e autorregulação',
    tradition: 'Exercício simples de atenção à respiração utilizado em diversas práticas contemplativas.',
    intention: 'Criar uma transição consciente entre a rotina e o momento de prática.',
    body: 'Direciona a atenção ao ritmo respiratório e às sensações presentes no corpo.',
    mind: 'Oferece um ponto de foco simples para retornar quando houver distrações.',
    emotions: 'Pode ajudar a observar emoções com mais espaço e menos reatividade durante a prática.',
    spirit: 'Pode ser utilizada como preparação para oração, meditação ou outras práticas espirituais.',
    during: 'Respire sem forçar retenções ou ritmos desconfortáveis. Retorne à respiração natural sempre que necessário.'
  }
];

export const ENERGY_JOURNEY_INTRO = {
  eyebrow: 'Antes do Dia 1',
  title: 'Conheça as Energias da sua Jornada',
  description: 'Antes de começar, conheça as práticas que farão parte da sua jornada de transformação. Você verá a intenção de cada prática e suas associações tradicionais nas dimensões Corpo, Mente, Emoções e Espírito.',
  dailyTitle: 'Energias de hoje',
  acknowledgement: 'Entendi as práticas da minha jornada',
  disclaimer: 'Estas informações descrevem práticas integrativas, experiências subjetivas e associações tradicionais de bem-estar. Não constituem diagnóstico, tratamento médico ou promessa de resultado e não substituem acompanhamento profissional de saúde.'
};

export function getEnergyPracticeGuide(id: string) {
  return ENERGY_PRACTICE_GUIDES.find(item => item.id === id);
}
