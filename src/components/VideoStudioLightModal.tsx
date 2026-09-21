import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Film, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { VISUAL_MAP_21_DIAS } from '../data/visualMap21Dias';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialDay?: number;
}

const BODY = {
  head: <ellipse cx="100" cy="38" rx="14" ry="17" />,
  torso: <path d="M84 61 C79 80 79 110 82 134 C85 143 91 148 100 148 C109 148 115 143 118 134 C121 110 121 80 116 61 Z" />,
  leftArm: <path d="M83 67 C73 85 69 109 72 132 C73 138 79 139 82 132 C80 111 81 88 87 68 Z" />,
  rightArm: <path d="M117 67 C127 85 131 109 128 132 C127 138 121 139 118 132 C120 111 119 88 113 68 Z" />,
  leftLeg: <path d="M86 146 L86 194 C86 200 93 201 96 194 L99 148 Z" />,
  rightLeg: <path d="M114 146 L114 194 C114 200 107 201 104 194 L101 148 Z" />,
};

const BaseBody = () => (
  <g fill="#F5EFE4" stroke="#8D8175" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    {BODY.head}{BODY.torso}{BODY.leftArm}{BODY.rightArm}{BODY.leftLeg}{BODY.rightLeg}
    <path d="M80 195 C84 192 91 192 96 195" fill="none" />
    <path d="M104 195 C109 192 116 192 120 195" fill="none" />
  </g>
);

const glow = { filter: 'drop-shadow(0 0 8px rgba(184,135,54,.55))' };

function DayOverlay({ day }: { day: number }) {
  const common = { repeat: Infinity, duration: 4.8, ease: 'easeInOut' as const };
  switch (day) {
    case 1:
      return <g>
        <motion.circle cx="100" r="7" fill="#D6A756" style={glow} animate={{ cy:[28,80,142,194], opacity:[.25,.9,.95,1] }} transition={common}/>
        {['M94 194 C84 208 67 215 50 225','M106 194 C116 208 133 215 150 225','M100 194 C98 211 98 220 96 232','M100 194 C102 211 102 220 104 232'].map((d,i)=><motion.path key={i} d={d} fill="none" stroke="#B88736" strokeWidth={i<2?2:1.4} animate={{pathLength:[0,1,.8],opacity:[.25,1,.7]}} transition={{...common,delay:i*.18}}/>)}
      </g>;
    case 2:
      return <motion.g animate={{y:[12,45,85,130,176],opacity:[.25,.9,.9,.9,.25]}} transition={{...common,duration:6.2}}>
        <rect x="66" y="25" width="68" height="8" rx="4" fill="#D6A756" opacity=".75" style={glow}/>
      </motion.g>;
    case 3:
      return <g>
        <motion.circle cx="100" cy="92" r="9" fill="#D6A756" style={glow} animate={{r:[6,11,8],opacity:[.35,1,.55]}} transition={common}/>
        <motion.path d="M100 92 C88 91 78 97 74 116" fill="none" stroke="#B88736" strokeWidth="3" animate={{pathLength:[0,1,1],opacity:[.2,1,.55]}} transition={common}/>
        <motion.path d="M100 92 C112 91 122 97 126 116" fill="none" stroke="#B88736" strokeWidth="3" animate={{pathLength:[0,1,1],opacity:[.2,1,.55]}} transition={common}/>
        <motion.circle cx="73" cy="130" r="6" fill="#D6A756" style={glow} animate={{opacity:[.15,.95,.5]}} transition={{...common,delay:.8}}/>
        <motion.circle cx="127" cy="130" r="6" fill="#D6A756" style={glow} animate={{opacity:[.15,.95,.5]}} transition={{...common,delay:.8}}/>
      </g>;
    case 4:
      return <g><motion.path d="M91 91 Q100 82 109 91" fill="none" stroke="#B88736" strokeWidth="3" animate={{pathLength:[.1,1,.5],opacity:[.25,1,.45]}} transition={common}/><motion.ellipse cx="100" cy="95" rx="11" ry="8" fill="#D6A756" animate={{rx:[5,18,10],ry:[4,13,7],opacity:[.15,.7,.3]}} transition={common}/></g>;
    case 5:
      return <motion.path d="M70 70 Q55 112 70 152 Q100 174 130 152 Q145 112 130 70 Q100 54 70 70 Z" fill="none" stroke="#B88736" strokeWidth="3" animate={{opacity:[.2,.8,.35],pathLength:[.2,1,.8]}} transition={common}/>;
    case 6:
      return <g>{[0,1,2].map(i=><motion.ellipse key={i} cx="100" cy="128" rx={12+i*8} ry={7+i*5} fill="none" stroke="#D6A756" strokeWidth="2" animate={{opacity:[.1,.8,0],scale:[.7,1.25,1.5]}} transition={{...common,delay:i*.55}}/>)}</g>;
    case 7:
      return <g><motion.circle cx="100" cy="38" r="24" fill="none" stroke="#5E7153" strokeWidth="2" animate={{opacity:[.2,.7,.3],r:[18,27,22]}} transition={common}/><motion.path d="M100 54 L100 85" stroke="#B88736" strokeWidth="2" animate={{opacity:[.2,.8,.25]}} transition={common}/></g>;
    case 8:
      return <g><motion.path d="M73 70 C76 92 82 118 88 152" fill="none" stroke="#85786C" strokeWidth="5" animate={{pathLength:[0,1,1],opacity:[.65,.35,0],y:[0,8,28]}} transition={common}/><motion.path d="M127 70 C124 92 118 118 112 152" fill="none" stroke="#85786C" strokeWidth="5" animate={{pathLength:[0,1,1],opacity:[.65,.35,0],y:[0,8,28]}} transition={common}/></g>;
    case 9:
      return <g><motion.line x1="100" y1="192" x2="100" y2="58" stroke="#B88736" strokeWidth="3" animate={{pathLength:[0,1,.9],opacity:[.2,1,.55]}} transition={common}/><motion.path d="M86 194 Q100 187 114 194" fill="none" stroke="#5E7153" strokeWidth="2" animate={{opacity:[.2,.8,.35]}} transition={common}/></g>;
    case 10:
      return <motion.circle cx="100" cy="104" r="14" fill="#B88736" style={glow} animate={{r:[9,16,12],opacity:[.4,1,.65]}} transition={common}/>;
    case 11:
      return <motion.path d="M88 47 Q100 62 112 47 M89 57 Q100 70 111 57 M91 68 Q100 78 109 68" fill="none" stroke="#D6A756" strokeWidth="3" animate={{opacity:[.2,.85,.35],y:[-2,4,8]}} transition={common}/>;
    case 12:
      return <motion.line x1="100" y1="20" x2="100" y2="198" stroke="#B88736" strokeWidth="3.5" style={glow} animate={{pathLength:[.1,1,.9],opacity:[.2,.95,.6]}} transition={common}/>;
    case 13:
      return <g>{[-1,0,1].map(i=><motion.path key={i} d={`M${100+i*15} 75 C${125+i*18} 88 ${130+i*20} 118 ${145+i*24} 128`} fill="none" stroke="#D6A756" strokeWidth="2" animate={{pathLength:[0,1,.8],opacity:[.15,.75,.25]}} transition={{...common,delay:(i+1)*.25}}/>)}</g>;
    case 14:
      return <g><motion.path d="M100 92 C118 94 132 104 148 118" fill="none" stroke="#B88736" strokeWidth="3" animate={{pathLength:[0,1,.85],opacity:[.2,.85,.4]}} transition={common}/><motion.path d="M84 66 Q67 105 82 145" fill="none" stroke="#5E7153" strokeWidth="2" animate={{opacity:[.25,.75,.4]}} transition={common}/></g>;
    case 15:
      return <g><motion.ellipse cx="112" cy="205" rx="23" ry="6" fill="#D6A756" animate={{opacity:[.1,.7,.25],x:[0,10,14]}} transition={common}/><motion.path d="M106 193 Q113 190 120 193" fill="none" stroke="#B88736" strokeWidth="3" animate={{x:[0,8,12],opacity:[.3,.9,.5]}} transition={common}/></g>;
    case 16:
      return <motion.path d="M100 52 L122 188 L155 215 L92 215 Z" fill="#D6A756" opacity=".25" animate={{opacity:[.08,.35,.15]}} transition={common}/>;
    case 17:
      return <g>{[[82,72],[118,72],[88,146],[112,146],[88,190],[112,190]].map(([cx,cy],i)=><motion.circle key={i} cx={cx} cy={cy} r="6" fill="none" stroke="#B88736" strokeWidth="2" animate={{r:[4,9,5],opacity:[.2,.85,.3]}} transition={{...common,delay:i*.16}}/>)}</g>;
    case 18:
      return <g><motion.ellipse cx="110" cy="202" rx="22" ry="7" fill="#D6A756" animate={{x:[-10,8,18],opacity:[.15,.75,.3]}} transition={common}/><motion.path d="M100 70 L100 160" stroke="#B88736" strokeWidth="3" animate={{opacity:[.3,.9,.55]}} transition={common}/></g>;
    case 19:
      return <motion.path d="M100 112 C89 102 92 88 100 83 C108 88 111 102 100 112 Z" fill="#D6A756" style={glow} animate={{scale:[.75,1.25,.9],opacity:[.35,1,.6]}} transition={common}/>;
    case 20:
      return <g>{[[100,35],[72,105],[128,105],[88,180],[112,180]].map(([cx,cy],i)=><motion.path key={i} d={`M${cx} ${cy} Q100 112 100 112`} fill="none" stroke="#B88736" strokeWidth="2" animate={{pathLength:[0,1,.8],opacity:[.15,.8,.4]}} transition={{...common,delay:i*.14}}/>)}</g>;
    case 21:
      return <g><motion.rect x="142" y="42" width="28" height="154" rx="14" fill="#D6A756" animate={{opacity:[.08,.32,.16]}} transition={common}/><motion.path d="M100 112 C118 116 130 126 148 140" fill="none" stroke="#B88736" strokeWidth="3" animate={{pathLength:[0,1,.85],opacity:[.25,.9,.5]}} transition={common}/></g>;
    default:
      return null;
  }
}

function Preview({ day }: { day: number }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-[28px] border border-[#E5DAC6] bg-gradient-to-b from-[#FBF8F2] to-[#F5EFE4] shadow-sm">
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#B88736]/10 to-transparent" />
      <svg viewBox="0 0 200 240" className="h-full w-full p-7" aria-label={`Prévia visual específica do Dia ${day}`}>
        <line x1="28" y1="202" x2="172" y2="202" stroke="#E5DAC6" strokeWidth="1.5" />
        <BaseBody />
        <DayOverlay day={day} />
      </svg>
    </div>
  );
}

export default function VideoStudioLightModal({ isOpen, onClose, initialDay = 1 }: Props) {
  const [day, setDay] = useState(Math.min(21, Math.max(1, initialDay)));
  const [aspect, setAspect] = useState<'9:16'|'16:9'|'1:1'>('1:1');
  const item = useMemo(() => VISUAL_MAP_21_DIAS.find(v => v.dia === day) ?? VISUAL_MAP_21_DIAS[0], [day]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#F8F4EC] text-[#2A2420]">
      <div className="mx-auto min-h-screen max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
        <header className="mb-5 flex items-start justify-between gap-4 border-b border-[#E5DAC6] pb-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#B88736]/25 bg-[#B88736]/10 text-[#B88736]">
              <Film size={21} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[.18em] text-[#B88736]">Estúdio de vídeos do Admin</div>
              <h1 className="mt-1 font-serif text-2xl sm:text-3xl">Reintegração da Vida</h1>
              <p className="mt-1 text-sm text-[#5C5248]">21 Dias para Voltar para Mim · mapa visual oficial</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full border border-[#E5DAC6] bg-white/70 p-2.5 text-[#5C5248] hover:bg-white" aria-label="Fechar">
            <X size={19}/>
          </button>
        </header>

        <div className="mb-5 grid grid-cols-3 gap-2 rounded-2xl border border-[#E5DAC6] bg-white/55 p-2 sm:max-w-xl">
          {(['9:16','16:9','1:1'] as const).map(a => (
            <button key={a} onClick={()=>setAspect(a)} className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${aspect===a?'bg-[#B88736] text-white shadow-sm':'text-[#5C5248] hover:bg-[#F5EFE4]'}`}>
              {a==='9:16'?'Vertical 9:16':a==='16:9'?'Horizontal 16:9':'Quadrado 1:1'}
            </button>
          ))}
        </div>

        <section className="mb-6 rounded-[24px] border border-[#E5DAC6] bg-white/55 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#5E7153]">Selecione o dia da jornada</div>
              <div className="mt-1 text-sm text-[#5C5248]">Dia {String(day).padStart(2,'0')}: <strong className="text-[#2A2420]">{item.titulo}</strong></div>
            </div>
            <div className="rounded-full border border-[#5E7153]/25 bg-[#5E7153]/10 px-3 py-1 text-[10px] font-bold text-[#5E7153]">{item.ciclo}</div>
          </div>
          <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-11">
            {VISUAL_MAP_21_DIAS.map(d => (
              <button key={d.dia} onClick={()=>setDay(d.dia)} className={`aspect-square rounded-xl border text-[11px] font-bold transition ${day===d.dia?'border-[#B88736] bg-[#B88736] text-white shadow-sm':'border-[#E5DAC6] bg-[#FBF8F2] text-[#5C5248] hover:border-[#B88736]/50'}`}>
                {d.dia}
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(330px,.95fr)]">
          <div className="rounded-[30px] border border-[#E5DAC6] bg-white/65 p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#B88736]">Prévia específica do dia</div>
                <h2 className="mt-1 font-serif text-xl">{item.titulo}</h2>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#85786C]"><ImageIcon size={13}/> fallback vetorial</div>
            </div>
            <div className={aspect==='9:16'?'mx-auto max-w-[360px]':aspect==='16:9'?'mx-auto max-w-2xl':''}>
              <Preview day={day}/>
            </div>
            <div className="mt-3 rounded-2xl border border-[#B88736]/20 bg-[#F5EFE4] p-3 text-xs leading-relaxed text-[#5C5248]">
              <strong className="text-[#2A2420]">Movimento da luz:</strong> {item.movimentoLuz}
            </div>
          </div>

          <aside className="space-y-3">
            <div className="rounded-[24px] border border-[#E5DAC6] bg-white/70 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#B88736]">Região corporal</div>
              <p className="mt-2 text-sm leading-relaxed text-[#5C5248]">{item.regiaoCorporal}</p>
            </div>
            <div className="rounded-[24px] border border-[#E5DAC6] bg-white/70 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#B88736]">Estado inicial</div>
              <p className="mt-2 text-sm leading-relaxed text-[#5C5248]">{item.estadoInicial}</p>
            </div>
            <div className="rounded-[24px] border border-[#E5DAC6] bg-white/70 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#B88736]">Transformação</div>
              <p className="mt-2 text-sm leading-relaxed text-[#5C5248]">{item.transformacao}</p>
            </div>
            <div className="rounded-[24px] border border-[#E5DAC6] bg-white/70 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#B88736]">Estado final</div>
              <p className="mt-2 text-sm leading-relaxed text-[#5C5248]">{item.estadoFinal}</p>
            </div>
            <div className="rounded-[24px] border border-[#5E7153]/25 bg-[#5E7153]/10 p-4">
              <div className="flex items-start gap-2">
                <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#5E7153]"/>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#5E7153]">Critério de aprovação</div>
                  <p className="mt-2 text-sm font-semibold leading-relaxed">{item.criterioAprovacao}</p>
                  <p className="mt-2 text-xs leading-relaxed text-[#5C5248]">Sem ouvir o áudio, consigo perceber visualmente o movimento interno proposto para este dia?</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E5DAC6] pt-4">
          <button disabled={day<=1} onClick={()=>setDay(d=>Math.max(1,d-1))} className="flex items-center gap-1.5 rounded-full border border-[#E5DAC6] bg-white/70 px-4 py-2 text-sm text-[#5C5248] disabled:opacity-35"><ChevronLeft size={15}/> Dia anterior</button>
          <div className="text-sm font-bold text-[#B88736]">{day} / 21</div>
          <button disabled={day>=21} onClick={()=>setDay(d=>Math.min(21,d+1))} className="flex items-center gap-1.5 rounded-full border border-[#E5DAC6] bg-white/70 px-4 py-2 text-sm text-[#5C5248] disabled:opacity-35">Próximo dia <ChevronRight size={15}/></button>
        </footer>
      </div>
    </div>
  );
}
