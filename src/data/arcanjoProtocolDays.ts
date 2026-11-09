export type ArcanjoProtocolDay = {
  dia: number;
  nome: string;
  subtitulo: string;
  local: string;
  foco: string;
  freq: 396 | 417 | 528 | 639 | 741 | 852 | 963;
  posicaoLuz: number;
  intencao: string;
};

/**
 * Progressão de sete dias do protocolo Arcanjo.
 * Os dias mantêm seus focos, regiões, frequências e intenções já existentes,
 * mas não são organizados nem nomeados como sete chakras.
 */
export const ARCANJO_PROTOCOL_DAYS: ArcanjoProtocolDay[] = [
  {
    dia: 1,
    nome: 'Segurança',
    subtitulo: 'Aterramento e presença',
    local: 'Base do tronco',
    foco: 'Aterramento físico e liberação do medo da escassez',
    freq: 396,
    posicaoLuz: 78,
    intencao: 'trazendo estabilidade, presença e segurança interior'
  },
  {
    dia: 2,
    nome: 'Vitalidade',
    subtitulo: 'Emoções e criatividade',
    local: 'Região abdominal',
    foco: 'Liberação de bloqueios emocionais e resgate da força criativa',
    freq: 417,
    posicaoLuz: 68,
    intencao: 'liberando emoções e permitindo que a vitalidade e a criatividade voltem a fluir'
  },
  {
    dia: 3,
    nome: 'Autoconfiança',
    subtitulo: 'Coragem e poder pessoal',
    local: 'Centro do abdômen',
    foco: 'Liberação de laços de ansiedade, insegurança e controle',
    freq: 528,
    posicaoLuz: 58,
    intencao: 'resgatando autoconfiança, coragem e poder pessoal'
  },
  {
    dia: 4,
    nome: 'Acolhimento',
    subtitulo: 'Amor próprio e aceitação',
    local: 'Centro do peito',
    foco: 'Transmutação simbólica de mágoas, rejeição e culpas',
    freq: 639,
    posicaoLuz: 47,
    intencao: 'abrindo espaço para amor próprio, acolhimento e perdão'
  },
  {
    dia: 5,
    nome: 'Expressão',
    subtitulo: 'Verdade e comunicação',
    local: 'Garganta',
    foco: 'Liberação simbólica de travas de comunicação e expressão',
    freq: 741,
    posicaoLuz: 36,
    intencao: 'liberando sua expressão e permitindo que sua verdade seja comunicada com clareza'
  },
  {
    dia: 6,
    nome: 'Clareza',
    subtitulo: 'Foco e discernimento',
    local: 'Região da testa',
    foco: 'Acalmar o excesso de estímulos e favorecer foco e clareza mental',
    freq: 852,
    posicaoLuz: 25,
    intencao: 'favorecendo silêncio interior, foco, discernimento e intuição'
  },
  {
    dia: 7,
    nome: 'Integração',
    subtitulo: 'Presença e conexão espiritual',
    local: 'Topo da cabeça',
    foco: 'Integração, presença e conexão espiritual',
    freq: 963,
    posicaoLuz: 15,
    intencao: 'aprofundando presença, integração e conexão espiritual'
  }
];
