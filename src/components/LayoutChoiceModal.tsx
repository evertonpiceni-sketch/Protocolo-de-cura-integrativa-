import React, { useRef, useState } from 'react';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { Check } from 'lucide-react';
import { OFFICIAL_LAYOUTS, LayoutDefinition, LayoutId } from '../config/layouts';

interface LayoutChoiceModalProps {
  onSelect: (layout: LayoutId) => void;
}

function LayoutPreview({ layout }: { layout: LayoutDefinition }) {
  // A prévia do Estilo 3 usa sua própria paleta, sem herdar os acentos dos outros estilos.
  const isEssenciaLuminosa = layout.id === 'essencia-luminosa';
  const [canvas, accent, gold, surface] = isEssenciaLuminosa
    ? ['#FFFFF8', '#A6B49B', '#C6A46A', '#F7F3E8']
    : layout.swatches;
  const foreground = layout.tone === 'dark' ? '#F4F1EB' : '#2A2420';
  const muted = layout.tone === 'dark' ? 'rgba(244,241,235,.68)' : 'rgba(42,36,32,.62)';
  const isNaturalSereno = layout.id === 'natural-sereno';
  const naturalIvory = '#F3EDE4';
  const previewBackground = isNaturalSereno
    ? `linear-gradient(145deg, ${canvas}, ${naturalIvory})`
    : `linear-gradient(145deg, ${canvas}, ${surface})`;
  const previewSurface = isNaturalSereno ? 'rgba(255,255,255,.78)' : `${accent}33`;
  // No Místico Moderno, o CTA deve permanecer dourado/âmbar e legível:
  // mesclar dourado com violeta escurece a metade do botão sob texto escuro.
  const actionBackground = isNaturalSereno
    ? `linear-gradient(135deg, ${gold}, #A87E37)`
    : layout.id === 'mistico-moderno'
      ? `linear-gradient(135deg, ${gold}, #E2B96B)`
      : layout.id === 'elegancia-profunda'
        ? 'linear-gradient(135deg, #D4AF77, #A77B43)'
        : `linear-gradient(135deg, ${gold}, ${accent})`;
  const previewSwatches = isNaturalSereno
    ? [canvas, gold, naturalIvory, '#E8E0D5']
    : [canvas, gold, surface, accent];

  return (
    <div
      className="mt-4 overflow-hidden rounded-2xl border border-black/10 shadow-inner"
      style={{ background: previewBackground, color: foreground }}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between border-b border-black/5 px-3 py-2">
        <span className="h-1.5 w-14 rounded-full" style={{ backgroundColor: gold, opacity: .75 }} />
        <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: isNaturalSereno ? surface : accent, opacity: isNaturalSereno ? .62 : 1 }} />
      </div>
      <div className="p-3">
        <div className="rounded-xl border border-black/5 p-3 shadow-sm" style={{ backgroundColor: previewSurface }}>
          <span className="block h-1.5 w-16 rounded-full" style={{ backgroundColor: gold }} />
          <span className="mt-2 block h-2.5 w-3/4 rounded-full" style={{ backgroundColor: foreground, opacity: .9 }} />
          <span className="mt-1.5 block h-1.5 w-1/2 rounded-full" style={{ backgroundColor: muted }} />
          {isNaturalSereno && (
            <span className="mt-3 flex h-7 w-full items-center rounded-lg border border-black/5 px-2" style={{ background: `linear-gradient(90deg, ${canvas}, ${naturalIvory})` }}>
              <span className="h-2 w-8 rounded-full" style={{ backgroundColor: surface, opacity: .48 }} />
            </span>
          )}
          <span
            className="mt-3 inline-flex rounded-full px-3 py-1 text-[8px] font-bold uppercase tracking-[.12em] shadow-sm"
            style={{ background: actionBackground, color: isEssenciaLuminosa || layout.id === 'mistico-moderno' ? '#2A2420' : layout.tone === 'dark' ? '#0B1712' : '#fff' }}
          >
            Iniciar jornada
          </span>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {previewSwatches.map((color, index) => (
            <span key={`${color}-${index}`} className="h-7 rounded-lg border border-black/5" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LayoutChoiceModal({ onSelect }: LayoutChoiceModalProps) {
  const [selectedLayout, setSelectedLayout] = useState<LayoutId | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  // Selection is mandatory: trap keyboard focus without allowing Escape to bypass confirmation.
  useDialogFocus(true, dialogRef, null);
  const selectedDefinition = OFFICIAL_LAYOUTS.find(layout => layout.id === selectedLayout);

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[160] flex items-center justify-center overflow-y-auto overscroll-contain bg-[#2A2420]/35 p-2 sm:p-5 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="layout-choice-title"
    >
      <section className="my-2 w-full max-w-4xl rounded-[2rem] border border-[#E5DAC6] bg-[#FBF8F2] p-5 shadow-2xl sm:p-7">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#B88736]">4 estilos, uma mesma essência</p>
          <h2 id="layout-choice-title" className="mt-2 font-display text-3xl text-[#2A2420]">Escolha o que mais toca você</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#5C5248]">
            Veja a prévia de cada atmosfera, selecione uma opção e confirme. A jornada, os conteúdos e seus dados permanecem iguais.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {OFFICIAL_LAYOUTS.map(layout => {
            const isSelected = selectedLayout === layout.id;
            return (
              <button
                key={layout.id}
                type="button"
                onClick={() => setSelectedLayout(layout.id)}
                aria-pressed={isSelected}
                className={`group min-h-36 rounded-2xl border bg-white/85 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35 ${isSelected ? 'border-[#B88736] ring-2 ring-[#B88736]/20 shadow-lg' : 'border-[#E5DAC6] hover:border-[#B88736]/60'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[#2A2420]">{layout.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#5C5248]">{layout.description}</p>
                  </div>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${isSelected ? 'border-[#B88736] bg-[#B88736] text-white opacity-100' : 'border-[#E5DAC6] text-[#B88736] opacity-0 group-hover:opacity-100'}`} aria-hidden="true">
                    <Check size={16} />
                  </span>
                </div>
                <LayoutPreview layout={layout} />
                <div className="mt-4 flex gap-2" aria-hidden="true">
                  {(layout.id === 'natural-sereno'
                    ? [layout.swatches[0], layout.swatches[2], '#F3EDE4', '#E8E0D5']
                    : layout.id === 'essencia-luminosa'
                      ? ['#FFFFF8', '#C6A46A', '#F7F3E8', '#A6B49B']
                      : layout.swatches
                  ).map((color, index) => (
                    <span key={index} className="h-3 flex-1 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 border-t border-[#E5DAC6] pt-5">
          <button
            type="button"
            disabled={!selectedLayout}
            onClick={() => selectedLayout && onSelect(selectedLayout)}
            className="min-h-12 w-full max-w-sm rounded-full bg-gradient-to-r from-[#C89D52] via-[#D9B66D] to-[#A87E37] px-6 py-3 text-sm font-bold uppercase tracking-[.12em] text-[#2A2420] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/40 focus-visible:ring-offset-2"
          >
            {selectedDefinition ? `Confirmar ${selectedDefinition.name}` : 'Selecione um estilo'}
          </button>
          <p className="text-center text-xs text-[#6B625B]">O estilo só será aplicado depois da sua confirmação.</p>
        </div>
      </section>
    </div>
  );
}