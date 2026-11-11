import React, { useRef, useState } from 'react';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { Check } from 'lucide-react';
import { OFFICIAL_LAYOUTS, LayoutDefinition, LayoutId } from '../config/layouts';

// Referências visuais oficiais dos quatro estilos; paletas e tratamentos seguem as decisões aprovadas mais recentes.
const NATURAL_SERENO_OFFICIAL_BOARD = new URL('../../docs/visual-qa/natural-sereno/reference.jpg', import.meta.url).href;
// Derived from the verified 1536×1152 official board; 4:3 and displayed without cropping.
const MISTICO_MODERNO_OFFICIAL_BOARD = '/brand/mistico-moderno/prancha-oficial-card.svg';

interface LayoutChoiceModalProps {
  onSelect: (layout: LayoutId) => void | Promise<void>;
}

function LayoutPreview({ layout }: { layout: LayoutDefinition }) {
  const isEssenciaLuminosa = layout.id === 'essencia-luminosa';
  const isMysticCard = layout.id === 'mistico-moderno';
  const isNaturalSereno = layout.id === 'natural-sereno';

  if (isNaturalSereno) {
    return (
      <div
        className="mt-4 flex h-[184px] w-full items-center justify-center overflow-hidden rounded-2xl border shadow-inner"
        style={{ backgroundColor: '#FAF7F2', borderColor: 'rgba(200,157,82,.34)' }}
        aria-hidden="true"
      >
        <img
          src={NATURAL_SERENO_OFFICIAL_BOARD}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-full w-full object-contain p-1"
        />
      </div>
    );
  }

  if (isMysticCard) {
    return (
      <div
        className="mt-4 flex h-[184px] w-full items-center justify-center overflow-hidden rounded-2xl border shadow-inner"
        style={{ backgroundColor: '#0A2742', borderColor: 'rgba(212,175,55,.38)' }}
        aria-hidden="true"
      >
        <img
          src={MISTICO_MODERNO_OFFICIAL_BOARD}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-full w-full object-contain p-1"
        />
      </div>
    );
  }

  if (layout.id === 'elegancia-profunda') {
    // A prancha 1001194194.png orienta atmosfera e composição; decisões posteriores prevalecem: 21 dias, corpo neutro e logo discreto como assinatura.
    return (
      <div
        className="mt-4 flex h-[184px] w-full items-center justify-center overflow-hidden rounded-2xl border shadow-inner"
        style={{ backgroundColor: '#0B1712', borderColor: 'rgba(212,175,119,.35)' }}
        aria-hidden="true"
      >
        <img
          src="/brand/elegancia-profunda/prancha-oficial.svg"
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  if (isEssenciaLuminosa) {
    return (
      <div
        className="mt-4 flex h-[184px] w-full items-center justify-center overflow-hidden rounded-2xl border shadow-inner"
        style={{ backgroundColor: '#FFFFF8', borderColor: 'rgba(198,164,106,.32)' }}
        aria-hidden="true"
      >
        <img
          src="/brand/essencia-luminosa/prancha-oficial.webp"
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-full w-full object-contain p-1"
        />
      </div>
    );
  }

  return null;
}

export default function LayoutChoiceModal({ onSelect }: LayoutChoiceModalProps) {
  const [selectedLayout, setSelectedLayout] = useState<LayoutId | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const confirmSelection = async () => {
    if (!selectedLayout || isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSelect(selectedLayout);
    } catch (error) {
      console.error('Layout selection could not be persisted', error);
      setSaveError('Não foi possível salvar sua escolha. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };
  const dialogRef = useRef<HTMLDivElement>(null);
  // Selection is mandatory: trap keyboard focus without allowing Escape to bypass confirmation.
  useDialogFocus(true, dialogRef, null);
  const selectedDefinition = OFFICIAL_LAYOUTS.find(layout => layout.id === selectedLayout);
  // Antes da escolha, o CTA permanece neutro. A cor do estilo só aparece após seleção explícita.
  const confirmButtonTone = !selectedLayout
    ? 'bg-gradient-to-r from-[#D8D4CB] via-[#C7C1B6] to-[#AFA99D] focus-visible:ring-[#85847B]/40'
    : selectedLayout === 'essencia-luminosa'
      ? 'bg-gradient-to-r from-[#D8C59B] via-[#C6A46A] to-[#E9DCC4] focus-visible:ring-[#C6A46A]/40'
      : selectedLayout === 'mistico-moderno'
        ? 'bg-gradient-to-r from-[#D4AF37] via-[#E2B96B] to-[#A87E37] focus-visible:ring-[#D4AF37]/45'
        : 'bg-gradient-to-r from-[#C89D52] via-[#D9B66D] to-[#A87E37] focus-visible:ring-[#B88736]/40';

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[160] flex items-start justify-center overflow-y-auto overscroll-contain bg-[#302E2A]/35 p-2 sm:p-5 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="layout-choice-title"
    >
      <section data-layout-choice-shell="true" className="my-2 w-full max-w-4xl rounded-[2rem] border border-[#E3DFD6] bg-[#F8F7F3] p-5 shadow-2xl sm:p-7">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#625E56]">4 estilos, uma mesma essência</p>
          <h2 id="layout-choice-title" className="mt-2 font-display text-3xl text-[#302E2A]">Escolha o que mais toca você</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#625E56]">
            Veja a prévia de cada atmosfera, selecione uma opção e confirme. A jornada, os conteúdos e seus dados permanecem iguais.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {OFFICIAL_LAYOUTS.map(layout => {
            const isSelected = selectedLayout === layout.id;
            const isEssenciaCard = layout.id === 'essencia-luminosa';
            const isMysticCard = layout.id === 'mistico-moderno';
            const selectionClasses = isEssenciaCard
              ? isSelected
                ? 'border-[#C6A46A] ring-2 ring-[#C6A46A]/20 shadow-lg'
                : 'border-[#E3DFD6] hover:border-[#C6A46A]/60'
              : isMysticCard
                ? isSelected
                  ? 'border-[#D4AF37] ring-2 ring-[#6C3FA0]/35 shadow-lg shadow-[#0A0F18]/40'
                  : 'border-[#6C3FA0]/40 hover:border-[#D4AF37]/70'
                : isSelected
                  ? 'border-[#B88736] ring-2 ring-[#B88736]/20 shadow-lg'
                  : 'border-[#E3DFD6] hover:border-[#B88736]/60';
            const focusRingClass = isEssenciaCard
              ? 'focus-visible:ring-[#C6A46A]/35'
              : isMysticCard
                ? 'focus-visible:ring-[#D4AF37]/45'
                : 'focus-visible:ring-[#B88736]/35';
            const cardBackgroundClass = isMysticCard ? 'bg-[#0A2742]' : 'bg-white/85';
            const cardHeadingClass = isMysticCard ? 'text-[#F4F1EB]' : 'text-[#302E2A]';
            const cardDescriptionClass = isMysticCard ? 'text-[#D5DCE7]' : 'text-[#625E56]';
            return (
              <button
                key={layout.id}
                type="button"
                onClick={() => { setSelectedLayout(layout.id); setSaveError(null); }}
                disabled={isSaving}
                aria-pressed={isSelected}
                className={`group min-h-36 rounded-2xl border ${cardBackgroundClass} p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 ${focusRingClass} ${selectionClasses}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className={`font-display text-xl font-semibold ${cardHeadingClass}`}>{layout.name}</h3>
                    <p className={`mt-1 text-xs leading-relaxed ${cardDescriptionClass}`}>{layout.description}</p>
                  </div>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${isSelected ? (isEssenciaCard ? 'border-[#C6A46A] bg-[#C6A46A] text-white opacity-100' : isMysticCard ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0A0F18] opacity-100' : 'border-[#B88736] bg-[#B88736] text-white opacity-100') : (isEssenciaCard ? 'border-[#E3DFD6] text-[#C6A46A] opacity-0 group-hover:opacity-100' : isMysticCard ? 'border-[#6C3FA0]/45 text-[#E2B96B] opacity-0 group-hover:opacity-100' : 'border-[#E3DFD6] text-[#B88736] opacity-0 group-hover:opacity-100')}`} aria-hidden="true">
                    <Check size={16} />
                  </span>
                </div>
                <LayoutPreview layout={layout} />
                {isMysticCard && (
                  <p className="mt-2 text-[11px] leading-relaxed text-[#CBD5E1]">
                    A prancha é referência de atmosfera e paleta; prevalecem as decisões aprovadas posteriores: jornada de 21 dias, corpo neutro e logo oficial discreto/transparente.
                  </p>
                )}
                <div className="mt-4 flex gap-2" aria-hidden="true">
                  {(layout.id === 'natural-sereno'
                    ? layout.swatches
                    : layout.id === 'essencia-luminosa'
                      ? ['#FFFFF8', '#C6A46A', '#F7F3E8', '#A6B49B']
                      : layout.id === 'elegancia-profunda'
                        ? ['#0B1712', '#2E6B4F', '#D4AF37', '#E5D3B1', '#8A5D3B', '#F4F1EB']
                        : layout.id === 'mistico-moderno'
                          ? ['#0A2742', '#2E3B73', '#6C3FA0', '#D4AF37', '#E2B96B', '#F4F1EB', '#141F30']
                          : layout.swatches
                  ).map((color, index) => (
                    <span key={index} className="h-3 flex-1 rounded-full border shadow-inner" style={{ backgroundColor: color, borderColor: layout.id === 'elegancia-profunda' ? 'rgba(212,175,119,.35)' : layout.id === 'mistico-moderno' ? 'rgba(212,175,55,.35)' : 'rgba(48,46,42,.10)' }} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 border-t border-[#E3DFD6] pt-5">
          <button
            type="button"
            disabled={!selectedLayout || isSaving}
            onClick={confirmSelection}
            className={`min-h-12 w-full max-w-sm rounded-xl ${confirmButtonTone} px-6 py-3 text-sm font-bold uppercase tracking-[.12em] ${selectedLayout === 'mistico-moderno' ? 'text-[#0A0F18]' : 'text-[#302E2A]'} shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
          >
            {isSaving ? 'Salvando escolha…' : selectedDefinition ? `Confirmar ${selectedDefinition.name}` : 'Selecione um estilo'}
          </button>
          {saveError && <p role="alert" className="text-center text-sm font-medium text-red-800">{saveError}</p>}
          <p className="text-center text-xs text-[#625E56]">O estilo só será aplicado depois da sua confirmação.</p>
        </div>
      </section>
    </div>
  );
}