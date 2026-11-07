import React, { useRef, useState } from 'react';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { Check } from 'lucide-react';
import { OFFICIAL_LAYOUTS, LayoutDefinition, LayoutId } from '../config/layouts';

// Prancha oficial do Natural Sereno. As amostras abaixo continuam refletindo a paleta aprovada posteriormente.
const NATURAL_SERENO_OFFICIAL_BOARD = new URL('../../docs/visual-qa/natural-sereno/reference.jpg', import.meta.url).href;

interface LayoutChoiceModalProps {
  onSelect: (layout: LayoutId) => void | Promise<void>;
}

function LayoutPreview({ layout }: { layout: LayoutDefinition }) {
  // A prévia do Estilo 3 usa a prancha oficial como referência visual aprovada.
  const isEssenciaLuminosa = layout.id === 'essencia-luminosa';
  const [canvas, accent, gold, surface] = layout.swatches;
  const foreground = layout.tone === 'dark' ? '#F4F1EB' : '#2A2420';
  const muted = layout.tone === 'dark' ? 'rgba(244,241,235,.68)' : 'rgba(42,36,32,.62)';
  const isNaturalSereno = layout.id === 'natural-sereno';
  const previewBorder = layout.id === 'elegancia-profunda' ? 'rgba(212,175,119,.35)' : layout.id === 'mistico-moderno' ? 'rgba(108,63,160,.40)' : 'rgba(42,36,32,.10)';
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
  if (layout.id === 'elegancia-profunda') {
    return (
      <div
        className="mt-4 flex h-[184px] w-full items-center justify-center overflow-hidden rounded-2xl border shadow-inner"
        style={{ backgroundColor: '#0B1712', borderColor: previewBorder }}
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
  if (layout.id === 'mistico-moderno') {
    return (
      <div
        className="mt-4 flex h-[184px] w-full items-center justify-center overflow-hidden rounded-2xl border shadow-inner"
        style={{
          backgroundColor: '#0A0F18',
          borderColor: 'rgba(212,175,55,.32)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.04), 0 12px 28px rgba(0,0,0,.22)'
        }}
        aria-hidden="true"
      >
        <img
          src="/brand/mistico-moderno/prancha-oficial.webp"
          alt=""
          loading="eager"
          decoding="async"
          draggable={false}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }
  const innerBorder = layout.id === 'mistico-moderno' ? 'rgba(108,63,160,.28)' : 'rgba(42,36,32,.06)';
  const naturalIvory = '#F3EDE4';
  const previewBackground = isNaturalSereno
    ? `linear-gradient(145deg, ${canvas}, ${naturalIvory})`
    : `linear-gradient(145deg, ${canvas}, ${surface})`;
  const previewSurface = isNaturalSereno ? 'rgba(255,255,255,.78)' : `${accent}33`;
  // No Místico Moderno, o CTA deve permanecer dourado/âmbar e legível:
  // mesclar dourado com violeta escurece a metade do botão sob texto escuro.
  const actionBackground = isNaturalSereno
    ? `linear-gradient(135deg, ${gold}, #A87E37)`
    : `linear-gradient(135deg, ${gold}, #E2B96B)`;
  const previewSwatches = isNaturalSereno
    ? [canvas, accent, gold, naturalIvory]
    : [canvas, gold, surface, accent];

  return (
    <div
      className="mt-4 overflow-hidden rounded-2xl border shadow-inner"
      style={{ background: previewBackground, color: foreground, borderColor: previewBorder }}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: innerBorder }}>
        <span className="h-1.5 w-14 rounded-full" style={{ backgroundColor: gold, opacity: .75 }} />
        <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: isNaturalSereno ? '#E8E0D5' : accent, borderColor: innerBorder, opacity: 1 }} />
      </div>
      <div className="p-3">
        <div className="rounded-xl border p-3 shadow-sm" style={{ backgroundColor: previewSurface, borderColor: innerBorder }}>
          <span className="block h-1.5 w-16 rounded-full" style={{ backgroundColor: gold }} />
          <span className="mt-2 block h-2.5 w-3/4 rounded-full" style={{ backgroundColor: foreground, opacity: .9 }} />
          <span className="mt-1.5 block h-1.5 w-1/2 rounded-full" style={{ backgroundColor: muted }} />
          {isNaturalSereno && (
            <span
              className="mt-3 block h-20 w-full overflow-hidden rounded-lg border border-[#E8E0D5]"
              style={{
                backgroundImage: 'linear-gradient(180deg, rgba(250,247,242,.06), rgba(42,36,33,.14)), url("/brand/natural-sereno/vale-amanhecer.webp")',
                backgroundPosition: 'center 55%',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundColor: naturalIvory
              }}
            />
          )}
          <span
            className="mt-3 inline-flex rounded-full px-3 py-1 text-[8px] font-bold uppercase tracking-[.12em] shadow-sm"
            style={{ background: actionBackground, color: '#2A2420' }}
          >
            Iniciar jornada
          </span>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {previewSwatches.map((color, index) => (
            <span key={`${color}-${index}`} className="h-7 rounded-lg border" style={{ backgroundColor: color, borderColor: innerBorder }} />
          ))}
        </div>
      </div>
    </div>
  );
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

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[160] flex items-start justify-center overflow-y-auto overscroll-contain bg-[#2A2420]/35 p-2 sm:p-5 backdrop-blur-md"
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
            const isMysticCard = layout.id === 'mistico-moderno';
            const isEssenciaCard = layout.id === 'essencia-luminosa';
            const selectionClasses = isMysticCard
              ? isSelected
                ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/25 shadow-lg'
                : 'border-[#6C3FA0]/45 hover:border-[#D4AF37]/60'
              : isEssenciaCard
                ? isSelected
                  ? 'border-[#C6A46A] ring-2 ring-[#C6A46A]/20 shadow-lg'
                  : 'border-[#E5DAC6] hover:border-[#C6A46A]/60'
                : isSelected
                  ? 'border-[#B88736] ring-2 ring-[#B88736]/20 shadow-lg'
                  : 'border-[#E5DAC6] hover:border-[#B88736]/60';
            const focusRingClass = isMysticCard
              ? 'focus-visible:ring-[#D4AF37]/40'
              : isEssenciaCard
                ? 'focus-visible:ring-[#C6A46A]/35'
                : 'focus-visible:ring-[#B88736]/35';
            return (
              <button
                key={layout.id}
                type="button"
                onClick={() => { setSelectedLayout(layout.id); setSaveError(null); }}
                disabled={isSaving}
                aria-pressed={isSelected}
                className={`group min-h-36 rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 ${isMysticCard ? 'bg-[#0A0F18]' : 'bg-white/85'} ${focusRingClass} ${selectionClasses}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className={`font-display text-xl font-semibold ${isMysticCard ? 'text-[#F4F1EB]' : 'text-[#2A2420]'}`}>{layout.name}</h3>
                    <p className={`mt-1 text-xs leading-relaxed ${isMysticCard ? 'text-[#C8D0DC]' : 'text-[#5C5248]'}`}>{layout.description}</p>
                  </div>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${isSelected
                    ? (isMysticCard ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0A0F18] opacity-100' : isEssenciaCard ? 'border-[#C6A46A] bg-[#C6A46A] text-white opacity-100' : 'border-[#B88736] bg-[#B88736] text-white opacity-100')
                    : (isMysticCard ? 'border-[#6C3FA0]/70 text-[#D4AF37] opacity-100' : isEssenciaCard ? 'border-[#E5DAC6] text-[#C6A46A] opacity-0 group-hover:opacity-100' : 'border-[#E5DAC6] text-[#B88736] opacity-0 group-hover:opacity-100')}`} aria-hidden="true">
                    {isSelected || !isMysticCard ? <Check size={16} /> : null}
                  </span>
                </div>
                <LayoutPreview layout={layout} />
                <div className="mt-4 flex gap-2" aria-hidden="true">
                  {(layout.id === 'natural-sereno'
                    ? [layout.swatches[0], layout.swatches[1], layout.swatches[2], '#F3EDE4']
                    : layout.id === 'essencia-luminosa'
                      ? ['#FFFFF8', '#C6A46A', '#F7F3E8', '#A6B49B']
                      : layout.id === 'elegancia-profunda'
                        ? ['#0B1712', '#2E6B4F', '#D4AF37', '#E5D3B1', '#8A5D3B', '#F4F1EB']
                        : layout.swatches
                  ).map((color, index) => (
                    <span key={index} className="h-3 flex-1 rounded-full border shadow-inner" style={{ backgroundColor: color, borderColor: layout.id === 'elegancia-profunda' ? 'rgba(212,175,119,.35)' : layout.id === 'mistico-moderno' ? 'rgba(108,63,160,.40)' : 'rgba(42,36,32,.10)' }} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 border-t border-[#E5DAC6] pt-5">
          <button
            type="button"
            disabled={!selectedLayout || isSaving}
            onClick={confirmSelection}
            className={`min-h-12 w-full max-w-sm rounded-full ${selectedLayout === 'essencia-luminosa' ? 'bg-gradient-to-r from-[#D8C59B] via-[#C6A46A] to-[#E9DCC4] focus-visible:ring-[#C6A46A]/40' : 'bg-gradient-to-r from-[#C89D52] via-[#D9B66D] to-[#A87E37] focus-visible:ring-[#B88736]/40'} px-6 py-3 text-sm font-bold uppercase tracking-[.12em] text-[#2A2420] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
          >
            {isSaving ? 'Salvando escolha…' : selectedDefinition ? `Confirmar ${selectedDefinition.name}` : 'Selecione um estilo'}
          </button>
          {saveError && <p role="alert" className="text-center text-sm font-medium text-red-800">{saveError}</p>}
          <p className="text-center text-xs text-[#6B625B]">O estilo só será aplicado depois da sua confirmação.</p>
        </div>
      </section>
    </div>
  );
}