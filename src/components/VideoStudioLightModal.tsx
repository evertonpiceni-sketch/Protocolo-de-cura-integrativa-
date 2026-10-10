import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Film, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { VISUAL_MAP_21_DIAS } from '../data/visualMap21Dias';
import { useDialogFocus } from '../hooks/useDialogFocus';
import ReintegrationPresenceVisual from './ReintegrationPresenceVisual';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialDay?: number;
}

export default function VideoStudioLightModal({ isOpen, onClose, initialDay = 1 }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(isOpen, dialogRef, onClose);
  const [day, setDay] = useState(Math.min(21, Math.max(1, initialDay)));
  const [aspect, setAspect] = useState<'9:16'|'16:9'|'1:1'>('1:1');
  const item = useMemo(() => VISUAL_MAP_21_DIAS.find(v => v.dia === day) ?? VISUAL_MAP_21_DIAS[0], [day]);

  if (!isOpen) return null;

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="visual-studio-title" className="fixed inset-0 z-[100] overflow-y-auto bg-[#F8F4EC] text-[#2A2420]">
      <div className="mx-auto min-h-screen max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
        <header className="mb-5 flex items-start justify-between gap-4 border-b border-[#E5DAC6] pb-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#B88736]/25 bg-[#B88736]/10 text-[#71511C]">
              <Film size={21} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[.18em] text-[#71511C]">Estúdio de vídeos do Admin</div>
              <h1 id="visual-studio-title" className="mt-1 font-serif text-2xl sm:text-3xl">Reintegração da Vida</h1>
              <p className="mt-1 text-sm text-[#5C5248]">21 Dias para Voltar para Mim · mapa visual oficial</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full border border-[#E5DAC6] bg-white/70 p-2.5 text-[#5C5248] hover:bg-white" aria-label="Fechar">
            <X size={19}/>
          </button>
        </header>

        <div className="mb-5 grid grid-cols-3 gap-2 rounded-2xl border border-[#E5DAC6] bg-white/55 p-2 sm:max-w-xl">
          {(['9:16','16:9','1:1'] as const).map(a => (
            <button key={a} aria-pressed={aspect===a} onClick={()=>setAspect(a)} className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${aspect===a?'bg-[#174B37] text-[#FFFAE7] shadow-sm':'text-[#5C5248] hover:bg-[#F5EFE4]'}`}>
              {a==='9:16'?'Vertical 9:16':a==='16:9'?'Horizontal 16:9':'Quadrado 1:1'}
            </button>
          ))}
        </div>

        <section className="mb-6 rounded-[24px] border border-[#E5DAC6] bg-white/55 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#41503A]">Selecione o dia da jornada</div>
              <div className="mt-1 text-sm text-[#5C5248]">Dia {String(day).padStart(2,'0')}: <strong className="text-[#2A2420]">{item.titulo}</strong></div>
            </div>
            <div className="rounded-full border border-[#5E7153]/25 bg-[#5E7153]/10 px-3 py-1 text-[10px] font-bold text-[#41503A]">{item.ciclo}</div>
          </div>
          <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-11">
            {VISUAL_MAP_21_DIAS.map(d => (
              <button key={d.dia} aria-pressed={day===d.dia} onClick={()=>setDay(d.dia)} className={`aspect-square rounded-xl border text-[11px] font-bold transition ${day===d.dia?'border-[#B88736] bg-[#174B37] text-[#FFFAE7] shadow-sm':'border-[#E5DAC6] bg-[#FBF8F2] text-[#5C5248] hover:border-[#B88736]/50'}`}>
                {d.dia}
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(330px,.95fr)]">
          <div className="rounded-[30px] border border-[#E5DAC6] bg-white/65 p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#71511C]">Prévia específica do dia</div>
                <h2 className="mt-1 font-serif text-xl">{item.titulo}</h2>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#586454]"><ImageIcon size={13}/> Presença humana</div>
            </div>
            <div className={aspect==='9:16'?'mx-auto max-w-[360px]':aspect==='16:9'?'mx-auto max-w-2xl':''}>
              <div className="visual-studio-human-frame" style={{aspectRatio:aspect.replace(':','/')}}><ReintegrationPresenceVisual day={day} elapsedSeconds={0}/></div>
              <p className="mt-3 text-sm text-[#5C5248]">Estado inicial da presença. O vídeo específico deste dia ainda está em preparação.</p>
            </div>
            <div className="mt-3 rounded-2xl border border-[#B88736]/20 bg-[#F5EFE4] p-3 text-xs leading-relaxed text-[#5C5248]">
              <strong className="text-[#2A2420]">Movimento da luz:</strong> {item.movimentoLuz}
            </div>
          </div>

          <aside className="space-y-3">
            <div className="rounded-[24px] border border-[#E5DAC6] bg-white/70 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#71511C]">Região corporal</div>
              <p className="mt-2 text-sm leading-relaxed text-[#5C5248]">{item.regiaoCorporal}</p>
            </div>
            <div className="rounded-[24px] border border-[#E5DAC6] bg-white/70 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#71511C]">Estado inicial</div>
              <p className="mt-2 text-sm leading-relaxed text-[#5C5248]">{item.estadoInicial}</p>
            </div>
            <div className="rounded-[24px] border border-[#E5DAC6] bg-white/70 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#71511C]">Transformação</div>
              <p className="mt-2 text-sm leading-relaxed text-[#5C5248]">{item.transformacao}</p>
            </div>
            <div className="rounded-[24px] border border-[#E5DAC6] bg-white/70 p-4">
              <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#71511C]">Estado final</div>
              <p className="mt-2 text-sm leading-relaxed text-[#5C5248]">{item.estadoFinal}</p>
            </div>
            <div className="rounded-[24px] border border-[#5E7153]/25 bg-white/90 p-4">
              <div className="flex items-start gap-2">
                <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#41503A]"/>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[.16em] text-[#41503A]">Critério de aprovação</div>
                  <p className="mt-2 text-sm font-semibold leading-relaxed">{item.criterioAprovacao}</p>
                  <p className="mt-2 text-xs leading-relaxed text-[#5C5248]">Sem ouvir o áudio, consigo perceber visualmente o movimento interno proposto para este dia?</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E5DAC6] pt-4">
          <button disabled={day<=1} onClick={()=>setDay(d=>Math.max(1,d-1))} className="flex items-center gap-1.5 rounded-full border border-[#E5DAC6] bg-white/70 px-4 py-2 text-sm text-[#5C5248] disabled:opacity-35"><ChevronLeft size={15}/> Dia anterior</button>
          <div className="text-sm font-bold text-[#71511C]">{day} / 21</div>
          <button disabled={day>=21} onClick={()=>setDay(d=>Math.min(21,d+1))} className="flex items-center gap-1.5 rounded-full border border-[#E5DAC6] bg-white/70 px-4 py-2 text-sm text-[#5C5248] disabled:opacity-35">Próximo dia <ChevronRight size={15}/></button>
        </footer>
      </div>
    </div>
  );
}
