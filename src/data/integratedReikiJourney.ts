/** Titles and intentions transcribed from the user's approved 21-day board. */
export const INTEGRATED_REIKI_ART = '/brand/jornada-integrada-21-dias-aprovada.jpg';
export const REIKI_CYCLES = ['Presença e proteção', 'Transmutação e libertação', 'Integração e recomeço'] as const;
const days = [
 ['Presença e chão','A luz azul-dourada ancora o corpo; o violeta suaviza tensões; o verde integra paz e presença.'],
 ['O manto protetor','Proteção serena ao redor do corpo, menos hipervigilância e mais sensação de amparo.'],
 ['Corte de excessos','São Miguel firma limites, o violeta corta o peso e Rafael recompõe o centro.'],
 ['Purificação do campo','A luz percorre o campo sutil, dissolve densidades e devolve clareza ao corpo.'],
 ['Acolhimento do coração','O peito se abre ao cuidado: menos dureza, mais suavidade, acolhimento e calor interno.'],
 ['Coragem serena','Firmeza sem rigidez, proteção interna e um pequeno passo possível com confiança.'],
 ['Selamento do primeiro ciclo','Proteção, transmutação e acolhimento se unem em uma base mais estável.'],
 ['Verdade interior','A luz sobe ao eixo e favorece presença, discernimento e expressão do que é verdadeiro.'],
 ['Soltar o passado','O violeta libera memórias densas e o verde acolhe o espaço que se abre.'],
 ['Reorganização interior','Proteção no contorno, transmutação no centro e reorganização suave do campo interno.'],
 ['Autoperdão','O coração relaxa a cobrança e recebe compaixão pela própria história.'],
 ['Limpeza das preocupações','Cabeça, nuca e peito encontram alívio; o mental desacelera e a presença se amplia.'],
 ['Desbloqueio de caminhos','A energia volta a circular com mais liberdade em direção ao próximo passo.'],
 ['Liberdade emocional','Menos peso, mais espaço interno e uma respiração mais livre no corpo.'],
 ['Centro e direção','O eixo se alinha e a jornada ganha sentido: foco manso e direção interna.'],
 ['Vitalidade restaurada','O corpo recebe nutrição simbólica de luz e desperta uma energia mais viva e estável.'],
 ['Confiança para agir','A proteção sustenta a ação; o medo perde força e a presença avança.'],
 ['Relação consigo','Cabeça, mãos e peito se reúnem no centro, aprofundando vínculo consigo.'],
 ['Expansão tranquila','O campo se amplia sem perder o enraizamento, com serenidade e equilíbrio.'],
 ['Consagração da nova postura','Mais limites, mais leveza e mais cuidado sustentam a nova forma de viver.'],
 ['Eu volto para mim','O corpo se integra em luz, selando a jornada com presença, paz e continuidade.'],
] as const;
export const INTEGRATED_REIKI_DAYS = days.map(([nome,intencao],index)=>{
 const cycle=Math.floor(index/7);const column=index%7;
 return {dia:index+1,nome,intencao,subtitulo:`${['São Miguel','Chama Violeta','Arcanjo Rafael'][cycle]} • ${REIKI_CYCLES[cycle]}`,local:'seu corpo e sua respiração',foco:intencao,cor:['#235681','#77429d','#2c7657'][cycle],corSecundaria:['#d6e8f5','#e8d4f7','#d6eddf'][cycle],freq:([396,417,528,639,741,852,963] as const)[column],cycle,
 artwork:{x:72+column*118,y:[222,568,887][cycle],width:114,height:[176,154,145][cycle]}};
});
export const integratedReikiProgress = (days: number[] = []) => [...new Set(days)].filter(day=>Number.isInteger(day)&&day>=1&&day<=21).sort((a,b)=>a-b);
