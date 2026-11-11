import React, { useRef, useState } from 'react';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { Check } from 'lucide-react';
import { OFFICIAL_LAYOUTS, LayoutDefinition, LayoutId } from '../config/layouts';

// Referências visuais oficiais dos quatro estilos; paletas e tratamentos seguem as decisões aprovadas mais recentes.
// Verified against the Library original 1001196520.png (file_id: file_00000000317c820ebaad657dc3680de5).
// The repository asset is a visually matched JPEG derivative; later approved palette/body/logo decisions prevail.
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
    // A prancha oficial permanece como referência de composição. A prévia principal
    // mostra a identidade vigente; cores e componentes antigos da prancha não prevalecem.
    return (
      <div
        className="mt-4 h-[184px] w-full overflow-hidden rounded-2xl border border-[#E8E0D5] bg-[#FAF7F2] shadow-inner"
        aria-hidden="true"
      >
        <div className="relative h-[120px] overflow-hidden">
          <img
            src="/brand/natural-sereno/vale-amanhecer.webp"
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'center 35%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/35 to-transparent" />
          <span className="absolute left-3 top-3 rounded-lg border border-[#E8E0D5] bg-[#FAF7F2]/90 px-2 py-1 text-[8px] font-semibold uppercase tracking-[.14em] text-[#6B625B]">
            Natureza realista
          </span>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <span className="block text-[9px] font-semibold uppercase tracking-[.12em] text-[#6B625B]">
                Natural Sereno
              </span>
              <span className="block truncate font-display text-sm font-medium text-[#2A2421]">
                Um lugar para voltar para si
              </span>
            </div>
            <span className="shrink-0 rounded-xl border border-[#A87E37] bg-gradient-to-b from-[#E2B96B] to-[#C89D52] px-3 py-2 text-[8px] font-bold uppercase tracking-[.08em] text-[#2A2421] shadow-sm">
              Iniciar jornada
            </span>
          </div>
        </div>
        <div className="flex h-[64px] items-center justify-between gap-2 border-t border-[#E8E0D5] px-2">
          <div className="flex min-w-0 items-center gap-2">
            <img
              src={NATURAL_SERENO_OFFICIAL_BOARD}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
              className="h-14 w-16 shrink-0 rounded-lg border border-[#E8E0D5] bg-[#FAF7F2] p-0.5 object-contain"
            />
            <span className="max-w-[112px] text-[8px] leading-tight text-[#6B625B]">
              Prancha oficial de referência. Decisões posteriores prevalecem.
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1" aria-hidden="true">
            {['#FAF7F2', '#F5EFE5', '#2A2421', '#C89D52', '#6F7B55'].map((color, index) => (
              <span
                key={`${color}-${index}`}
                className="h-3.5 w-3.5 rounded-full border border-[#E8E0D5]"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (layout.id === 'elegancia-profunda') {
    // A prancha 1001194194.png orienta atmosfera e composição; decisões posteriores prevalecem: 21 dias, corpo neutro e logo discreto como assinatura.
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
    ? layout.swatches
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
  // Antes da escolha, o CTA permanece neutro. A cor do estilo só aparece após seleção explícita.
  const confirmButtonTone = !selectedLayout
    ? 'bg-gradient-to-r from-[#A99B84] via-[#B7AD9D] to-[#817460] focus-visible:ring-[#817460]/40'
    : selectedLayout === 'natural-sereno'
      ? 'bg-gradient-to-r from-[#E2B96B] via-[#C89D52] to-[#A87E37] focus-visible:ring-[#C89D52]/40'
      : selectedLayout === 'essencia-luminosa'
        ? 'bg-gradient-to-r from-[#D8C59B] via-[#C6A46A] to-[#E9DCC4] focus-visible:ring-[#C6A46A]/40'
        : 'bg-gradient-to-r from-[#C89D52] via-[#D9B66D] to-[#A87E37] focus-visible:ring-[#B88736]/40';

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
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#817460]">4 estilos, uma mesma essência</p>
          <h2 id="layout-choice-title" className="mt-2 font-display text-3xl text-[#2A2420]">Escolha o que mais toca você</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#5C5248]">
            Veja a prévia de cada atmosfera, selecione uma opção e confirme. A jornada, os conteúdos e seus dados permanecem iguais.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {OFFICIAL_LAYOUTS.map(layout => {
            const isSelected = selectedLayout === layout.id;
            const isNaturalSerenoCard = layout.id === 'natural-sereno';
            const isEssenciaCard = layout.id === 'essencia-luminosa';
            const selectionClasses = isNaturalSerenoCard
              ? isSelected
                ? 'border-[#C89D52] ring-2 ring-[#C89D52]/20 shadow-lg'
                : 'border-[#E8E0D5] hover:border-[#C89D52]/60'
              : isEssenciaCard
                ? isSelected
                  ? 'border-[#C6A46A] ring-2 ring-[#C6A46A]/20 shadow-lg'
                  : 'border-[#E5DAC6] hover:border-[#C6A46A]/60'
                : isSelected
                  ? 'border-[#B88736] ring-2 ring-[#B88736]/20 shadow-lg'
                  : 'border-[#E5DAC6] hover:border-[#B88736]/60';
            const focusRingClass = isNaturalSerenoCard
              ? 'focus-visible:ring-[#C89D52]/35'
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
                className={`group min-h-36 rounded-2xl border bg-white/85 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 ${focusRingClass} ${selectionClasses}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[#2A2420]">{layout.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#5C5248]">{layout.description}</p>
                  </div>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${isSelected ? (isNaturalSerenoCard ? 'border-[#A87E37] bg-[#C89D52] text-[#2A2421] opacity-100' : isEssenciaCard ? 'border-[#C6A46A] bg-[#C6A46A] text-white opacity-100' : 'border-[#B88736] bg-[#B88736] text-white opacity-100') : (isNaturalSerenoCard ? 'border-[#E8E0D5] text-[#A87E37] opacity-0 group-hover:opacity-100' : isEssenciaCard ? 'border-[#E5DAC6] text-[#C6A46A] opacity-0 group-hover:opacity-100' : 'border-[#E5DAC6] text-[#B88736] opacity-0 group-hover:opacity-100')}`} aria-hidden="true">
                    <Check size={16} />
                  </span>
                </div>
                <LayoutPreview layout={layout} />
                <div className="mt-4 flex gap-2" aria-hidden="true">
                  {(layout.id === 'natural-sereno'
                    ? layout.swatches
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
            className={`min-h-12 w-full max-w-sm rounded-xl ${confirmButtonTone} px-6 py-3 text-sm font-bold uppercase tracking-[.12em] text-[#2A2420] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
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