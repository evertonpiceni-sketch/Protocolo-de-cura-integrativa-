/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MindfulnessItem {
  id: string;
  type: 'affirmation' | 'mindfulness_tip' | 'breathing_anchor';
  category: 'cura_celular' | 'prosperidade' | 'calma_mental' | 'amor_proprio' | 'protecao_luz' | 'presente_agora';
  categoryLabel: string;
  title: string;
  text: string;
  practicalAction?: string;
  frequencyHz?: string;
  chakra?: string;
  authorOrTradition?: string;
}

export const MINDFULNESS_AND_AFFIRMATIONS: MindfulnessItem[] = [
  {
    id: 'mind-1',
    type: 'affirmation',
    category: 'calma_mental',
    categoryLabel: 'Paz & Serenidade',
    title: 'Soberania da Calma Interior',
    text: 'Eu permito que a minha mente descanse no silêncio sagrado. Nenhuma agitação externa é maior do que a paz que habita no centro do meu coração.',
    practicalAction: 'Feche os olhos por 3 respirações profundas e sinta o ar entrando geladinho e saindo morno.',
    frequencyHz: '528 Hz',
    chakra: 'Cardíaco'
  },
  {
    id: 'mind-2',
    type: 'mindfulness_tip',
    category: 'presente_agora',
    categoryLabel: 'Atenção Plena',
    title: 'A Âncora dos 5 Sentidos',
    text: 'Traga sua atenção para o momento presente: identifique agora 3 coisas que você pode ver, 2 que pode tocar e 1 som suave ao seu redor.',
    practicalAction: 'Pare por 30 segundos e observe o ambiente sem julgamento, apenas testemunhando.',
    frequencyHz: '432 Hz',
    chakra: 'Básico'
  },
  {
    id: 'mind-3',
    type: 'affirmation',
    category: 'cura_celular',
    categoryLabel: 'Cura & Vitalidade',
    title: 'Regeneração Quântica das Células',
    text: 'Todas as células do meu corpo vibram em perfeita harmonia divina. A inteligência inata do meu templo regenera, desinflama e restaura minha força vital.',
    practicalAction: 'Coloque as duas mãos sobre o peito e envie um pensamento de gratidão a todos os seus órgãos.',
    frequencyHz: '528 Hz',
    chakra: 'Cardíaco / Plexo Solar'
  },
  {
    id: 'mind-4',
    type: 'affirmation',
    category: 'prosperidade',
    categoryLabel: 'Abundância & Fluxo',
    title: 'Ressonância com a Prosperidade',
    text: 'Eu sou um canal aberto para a abundância universal. O dinheiro, as oportunidades e a riqueza fluem para mim com facilidade, integridade e propósito elevado.',
    practicalAction: 'Respire fundo imaginando uma luz dourada banhando sua coluna e suas mãos.',
    frequencyHz: '852 Hz',
    chakra: 'Plexo Solar'
  },
  {
    id: 'mind-5',
    type: 'mindfulness_tip',
    category: 'calma_mental',
    categoryLabel: 'Desapego de Pensamentos',
    title: 'Pensamentos como Nuvens no Céu',
    text: 'Você não é os seus pensamentos; você é a consciência pura que os observa. Veja as preocupações passarem como nuvens em um céu azul imutável.',
    practicalAction: 'Diga internamente: "Eu observo este pensamento e permito que ele se dissipe suavemente."',
    frequencyHz: '432 Hz',
    chakra: 'Frontal'
  },
  {
    id: 'mind-6',
    type: 'affirmation',
    category: 'amor_proprio',
    categoryLabel: 'Amor-Próprio & Honra',
    title: 'Autoacolhimento e Merecimento',
    text: 'Eu honro quem eu fui, agradeço por quem sou e me abro para quem estou me tornando. Eu mereço amor, descanso, respeito e felicidade plena.',
    practicalAction: 'Dê um sorriso suave para si mesmo e solte as tensões do maxilar e da testa.',
    frequencyHz: '639 Hz',
    chakra: 'Cardíaco'
  },
  {
    id: 'mind-7',
    type: 'mindfulness_tip',
    category: 'presente_agora',
    categoryLabel: 'Micro-Pausa Consciente',
    title: 'A Respiração do Suspiro Terapêutico',
    text: 'Faça duas inspirações curtas seguidas pelo nariz e solte todo o ar pela boca com um longo suspiro sonoro. Isso desativa instantaneamente a resposta de estresse.',
    practicalAction: 'Repita este duplo suspiro 3 vezes agora mesmo e sinta os ombros caírem.',
    frequencyHz: '432 Hz',
    chakra: 'Laríngeo'
  },
  {
    id: 'mind-8',
    type: 'affirmation',
    category: 'protecao_luz',
    categoryLabel: 'Proteção & Blindagem',
    title: 'Cúpula de Luz do Arcanjo Miguel',
    text: 'Eu estou envolto(a) pelo Manto Azul e Dourado de Proteção Divina. Apenas o que é Luz, Amor e Verdade tem permissão para entrar no meu campo áurico.',
    practicalAction: 'Visualize um domo azul-celeste brilhante em torno de todo o seu corpo físico e sutil.',
    frequencyHz: '741 Hz',
    chakra: 'Coronário'
  },
  {
    id: 'mind-9',
    type: 'affirmation',
    category: 'calma_mental',
    categoryLabel: 'Liberação do Controle',
    title: 'Entrega e Confiança no Fluxo',
    text: 'Eu solto a necessidade de controlar tudo. Eu entrego, confio, aceito e agradeço. A Vida sabe exatamente o melhor caminho para o meu bem maior.',
    practicalAction: 'Abra as palmas das mãos voltadas para cima em sinal de receptividade e confiança.',
    frequencyHz: '528 Hz',
    chakra: 'Frontal'
  },
  {
    id: 'mind-10',
    type: 'mindfulness_tip',
    category: 'presente_agora',
    categoryLabel: 'Check-in Corporal',
    title: 'Escaneamento Rápido das Tensões',
    text: 'Note onde seu corpo está guardando tensão neste exato minuto: na testa? nos ombros? no estômago? Leve uma respiração morna direto para essa região.',
    practicalAction: 'Inspire imaginando luz desatando o nó e expire soltando completamente a musculatura.',
    frequencyHz: '432 Hz',
    chakra: 'Básico'
  },
  {
    id: 'mind-11',
    type: 'affirmation',
    category: 'prosperidade',
    categoryLabel: 'Gratidão Multiplicadora',
    title: 'O Ímã da Gratidão',
    text: 'Quanto mais eu agradeço pelo que já possuo, mais motivos para agradecer o Universo me envia. Minha vida é rica em bênçãos, saúde e amparo.',
    practicalAction: 'Pense em 3 coisas simples que aconteceram hoje pelas quais você é verdadeiramente grato(a).',
    frequencyHz: '639 Hz',
    chakra: 'Cardíaco'
  },
  {
    id: 'mind-12',
    type: 'affirmation',
    category: 'amor_proprio',
    categoryLabel: 'Liberação do Passado',
    title: 'Perdão e Libertação de Cordões',
    text: 'Eu me liberto e liberto todas as pessoas do passado com amor e respeito. Corto laços de mágoa e fico apenas com o aprendizado e a sabedoria.',
    practicalAction: 'Diga mentalmente: "Eu sinto muito, me perdoe, te amo, sou grato(a)."',
    frequencyHz: '741 Hz',
    chakra: 'Cardíaco / Laríngeo'
  },
  {
    id: 'mind-13',
    type: 'mindfulness_tip',
    category: 'presente_agora',
    categoryLabel: 'Aterramento Natural',
    title: 'Sentir os Pés no Chão',
    text: 'Mesmo calçado(a), pressione suavemente a sola dos pés contra o piso. Sinta a gravidade da Terra te sustentando de forma firme, estável e inabalável.',
    practicalAction: 'Sinta suas raízes energéticas descendo em direção ao centro cristalino da Terra.',
    frequencyHz: '432 Hz',
    chakra: 'Básico (Raiz)'
  },
  {
    id: 'mind-14',
    type: 'affirmation',
    category: 'cura_celular',
    categoryLabel: 'Sono Reparador & Paz',
    title: 'Desconexão e Repouso Sagrado',
    text: 'Ao descansar, meu espírito se renova e meu corpo rejuvenesce. Eu durmo em paz e acordo com alegria, disposição e clareza mental.',
    practicalAction: 'Solte a língua do céu da boca e relaxe os olhos por alguns instantes.',
    frequencyHz: '528 Hz',
    chakra: 'Frontal'
  },
  {
    id: 'mind-15',
    type: 'affirmation',
    category: 'protecao_luz',
    categoryLabel: 'Iluminação & Pineal',
    title: 'Alinhamento com a Centelha Divina',
    text: 'Eu sou um ser espiritual vivendo uma experiência humana. Minha intuição é cristalina e sou constantemente guiado(a) pelas ordens do Amor Maior.',
    practicalAction: 'Toque levemente o ponto entre as sobrancelhas e inspire serenidade.',
    frequencyHz: '963 Hz',
    chakra: 'Coronário'
  }
];

export function getRandomMindfulnessItem(excludeId?: string): MindfulnessItem {
  const pool = excludeId
    ? MINDFULNESS_AND_AFFIRMATIONS.filter(item => item.id !== excludeId)
    : MINDFULNESS_AND_AFFIRMATIONS;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || MINDFULNESS_AND_AFFIRMATIONS[0];
}
