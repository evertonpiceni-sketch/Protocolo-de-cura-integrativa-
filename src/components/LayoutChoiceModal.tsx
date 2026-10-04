import React from 'react';
import { Check } from 'lucide-react';
import { OFFICIAL_LAYOUTS, LayoutId } from '../config/layouts';

interface LayoutChoiceModalProps {
  onSelect: (layout: LayoutId) => void;
}

export default function LayoutChoiceModal({ onSelect }: LayoutChoiceModalProps) {
  return (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center overflow-y-auto overscroll-contain bg-[#2A2420]/35 p-2 sm:p-5 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="layout-choice-title"
    >
      <section className="my-2 w-full max-w-3xl rounded-[2rem] border border-[#E5DAC6] bg-[#FBF8F2] p-5 shadow-2xl sm:p-7">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#B88736]">4 estilos, uma mesma essência</p>
          <h2 id="layout-choice-title" className="mt-2 font-display text-3xl text-[#2A2420]">Escolha o que mais toca você</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#5C5248]">
            A jornada, os conteúdos e seus dados permanecem iguais. Muda apenas a atmosfera visual.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {OFFICIAL_LAYOUTS.map(layout => (
            <button
              key={layout.id}
              type="button"
              onClick={() => onSelect(layout.id)}
              className="group min-h-36 rounded-2xl border border-[#E5DAC6] bg-white/85 p-5 text-left transition hover:-translate-y-0.5 hover:border-[#B88736]/60 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-semibold text-[#2A2420]">{layout.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#5C5248]">{layout.description}</p>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E5DAC6] text-[#B88736] opacity-0 transition group-hover:opacity-100" aria-hidden="true">
                  <Check size={16} />
                </span>
              </div>
              <div className="mt-5 flex gap-2" aria-hidden="true">
                {layout.swatches.map(color => (
                  <span key={color} className="h-7 flex-1 rounded-lg border border-black/10 shadow-inner" style={{ backgroundColor: color }} />
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
