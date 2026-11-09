import { useDialogFocus } from '../hooks/useDialogFocus';
import React, { useEffect, useState } from 'react';
import { DayProgress, UserProfile } from '../types';
import { ARCANJO_PROTOCOL_DAYS } from '../data/arcanjoProtocolDays';
import NeutralBodyLightProgress from './NeutralBodyLightProgress';
import { ArrowLeft, Flame, Lock, Play, CheckCircle2, Award, Sparkles } from 'lucide-react';

/** Mantém o nome do componente por compatibilidade com o App; o conteúdo não é mais chakra-led. */
export default function DashboardCura({ onClose, progress, userProfile }: { onClose: () => void; progress: DayProgress[]; userProfile?: UserProfile }) {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const activeDay = ARCANJO_PROTOCOL_DAYS[Math.min(completedDays.length, ARCANJO_PROTOCOL_DAYS.length - 1)];
  const totalCompleted = completedDays.length;
  const percentage = Math.round((totalCompleted / ARCANJO_PROTOCOL_DAYS.length) * 100);
  const nextAvailableDay = Math.min(totalCompleted + 1, ARCANJO_PROTOCOL_DAYS.length);
  const journeyCompleted = totalCompleted === ARCANJO_PROTOCOL_DAYS.length;
  const streak = completedDays.length;

  // A prop pertence ao dashboard geral da jornada de 21 dias; este painel acompanha
  // separadamente o progresso do protocolo Arcanjo de sete dias.
  void progress;
  useDialogFocus(document.documentElement.dataset.layout === 'natural-sereno', dialogRef, onClose);

  useEffect(() => {
    const profileCompleted = userProfile?.journeyProgress?.arcanjo7CompletedDays;
    if (Array.isArray(profileCompleted)) {
      setCompletedDays([...new Set(profileCompleted)].filter(day => day >= 1 && day <= ARCANJO_PROTOCOL_DAYS.length).sort((a, b) => a - b));
      return;
    }
    const localCompleted: number[] = [];
    for (let day = 1; day <= ARCANJO_PROTOCOL_DAYS.length; day += 1) {
      if (localStorage.getItem(`reiki_arcanjo_dia_${day}`) === 'true') localCompleted.push(day);
    }
    setCompletedDays(localCompleted);
  }, [userProfile?.journeyProgress?.arcanjo7CompletedDays]);

  const handlePlayDay = (day: number) => {
    onClose();
    window.dispatchEvent(new CustomEvent('OPEN_PROTOCOL_DAY', { detail: { day } }));
  };

  return (
    <div
      ref={dialogRef}
      id="progress-dashboard"
      role="dialog"
      aria-modal="true"
      aria-label="Dashboard de progresso do protocolo Arcanjo"
      className="ep-arcanjo-progress-dashboard fixed inset-0 z-[100] flex flex-col overflow-y-auto font-sans selection:bg-[#C89D52]/20"
      style={{ background: 'var(--layout-canvas, #FAF7F2)', color: 'var(--layout-text, #2A2421)' }}
    >
      <div className="pointer-events-none fixed inset-0" style={{ background: 'linear-gradient(180deg,var(--layout-canvas,#FAF7F2),var(--layout-canvas-alt,#F5EFE5))' }} />

      <header className="relative z-10 mx-auto w-full max-w-lg px-5 py-6">
        <button
          onClick={onClose}
          className="mb-4 flex min-h-11 items-center gap-2 rounded-[18px] px-3 text-sm transition"
          style={{ color: 'var(--layout-text-secondary, #6B625B)' }}
        >
          <ArrowLeft size={18} /> Voltar
        </button>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-xl font-bold sm:text-2xl" style={{ color: 'var(--layout-text, #2A2421)' }}>
              Olá, {userProfile?.name?.split(' ')[0] || 'Viajante'}
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--layout-text-secondary, #6B625B)' }}>
              Equilíbrio hoje, um amanhã mais leve.
            </p>
          </div>
          <div
            className="flex shrink-0 flex-col items-center justify-center rounded-2xl border bg-white/70 px-4 py-2.5 shadow-sm"
            style={{ borderColor: 'var(--layout-gold-border, #E8E0D5)', background: 'var(--layout-card, #FFFDF8)' }}
          >
            <Flame className="mb-1" size={24} style={{ color: 'var(--layout-gold, #C89D52)' }} />
            <div className="text-lg font-bold leading-none" style={{ color: 'var(--layout-text, #2A2421)' }}>{streak}</div>
            <div className="mt-1 text-[9px] uppercase tracking-wider" style={{ color: 'var(--layout-text-muted, #6B625B)' }}>Dias Seguidos</div>
          </div>
        </div>

        <div className="mt-7">
          <div className="mb-2 flex items-end justify-between">
            <span className="text-sm font-semibold" style={{ color: 'var(--layout-gold-dark, #A87E37)' }}>{percentage}% Concluído</span>
            <span className="text-xs" style={{ color: 'var(--layout-text-secondary, #6B625B)' }}>{totalCompleted} de 7 dias</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--layout-border, #E8E0D5)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%`, background: 'var(--layout-gold-gradient, linear-gradient(90deg,#E2B96B,#C89D52,#A87E37))' }}
            />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-lg flex-1 px-5 pb-12">
        <section aria-label="Progresso visual do protocolo">
          <NeutralBodyLightProgress
            progress={percentage}
            active={false}
            focusPosition={activeDay.posicaoLuz}
            focusLabel={activeDay.local}
            className="my-8"
          />
        </section>

        <section className="space-y-4" aria-label="Etapas do protocolo Arcanjo">
          {ARCANJO_PROTOCOL_DAYS.map((dayConfig) => {
            const day = dayConfig.dia;
            const isCompleted = completedDays.includes(day);
            const isCurrent = day === nextAvailableDay && !isCompleted;
            const isLocked = day > nextAvailableDay;

            if (isCompleted) {
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => handlePlayDay(day)}
                  className="relative flex w-full items-center justify-between rounded-[18px] border px-5 py-4 text-left transition hover:-translate-y-0.5"
                  style={{ borderColor: 'var(--layout-gold-border, #E8E0D5)', background: 'var(--layout-card, #FFFDF8)' }}
                >
                  <div className="absolute bottom-0 left-0 top-0 w-1.5 rounded-l-[18px]" style={{ background: 'var(--layout-gold, #C89D52)' }} />
                  <div className="ml-3">
                    <h3 className="font-serif text-[15px] font-semibold" style={{ color: 'var(--layout-gold-dark, #A87E37)' }}>Dia {day}: {dayConfig.nome}</h3>
                    <p className="mt-0.5 text-xs" style={{ color: 'var(--layout-text-secondary, #6B625B)' }}>Concluído</p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'var(--layout-gold-soft, rgba(200,157,82,.12))', color: 'var(--layout-gold-dark, #A87E37)' }}>
                    <CheckCircle2 size={18} />
                  </div>
                </button>
              );
            }

            if (isCurrent) {
              return (
                <div
                  key={day}
                  className="relative overflow-hidden rounded-[18px] border shadow-sm"
                  style={{ borderColor: 'var(--layout-gold-border, #E8E0D5)', background: 'var(--layout-card, #FFFDF8)' }}
                >
                  <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(circle at 90% 50%,var(--layout-gold-soft,rgba(200,157,82,.12)),transparent 60%)' }} />
                  <div className="relative flex items-center justify-between gap-4 px-5 py-5">
                    <div>
                      <h3 className="font-serif text-base font-bold" style={{ color: 'var(--layout-text, #2A2421)' }}>Dia {day}: {dayConfig.nome}</h3>
                      <p className="mt-1 text-[13px]" style={{ color: 'var(--layout-text-secondary, #6B625B)' }}>{dayConfig.subtitulo}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePlayDay(day)}
                      aria-label={`Iniciar dia ${day}: ${dayConfig.nome}`}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2"
                      style={{ background: 'var(--layout-gold-gradient, linear-gradient(135deg,#E2B96B,#C89D52))', color: 'var(--layout-text, #2A2421)' }}
                    >
                      <Play size={21} className="ml-0.5" fill="currentColor" />
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={day}
                className="flex items-center justify-between rounded-[18px] border px-5 py-4"
                style={{ borderColor: 'var(--layout-border, #E8E0D5)', background: 'var(--layout-card-subtle, #F5EFE5)', opacity: isLocked ? 0.68 : 1 }}
              >
                <div className="ml-1">
                  <h3 className="font-serif text-[15px] font-medium" style={{ color: 'var(--layout-text-muted, #6B625B)' }}>Dia {day}: {dayConfig.nome}</h3>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--layout-text-muted, #6B625B)' }}>
                    {day === nextAvailableDay + 1 ? 'Disponível amanhã' : 'Bloqueado'}
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'var(--layout-card, #FFFDF8)', color: 'var(--layout-text-muted, #6B625B)' }}>
                  <Lock size={16} />
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-10">
          {journeyCompleted ? (
            <div
              className="relative flex flex-col items-center justify-center overflow-hidden rounded-[24px] border px-6 py-8 text-center shadow-sm"
              style={{ borderColor: 'var(--layout-gold-border, #E8E0D5)', background: 'var(--layout-card, #FFFDF8)' }}
            >
              <Sparkles className="relative z-10 mb-3" size={32} style={{ color: 'var(--layout-gold, #C89D52)' }} />
              <h3 className="relative z-10 mb-5 font-serif text-xl font-bold" style={{ color: 'var(--layout-text, #2A2421)' }}>Protocolo concluído</h3>
              <button
                onClick={() => {
                  onClose();
                  window.dispatchEvent(new CustomEvent('OPEN_CERTIFICATE'));
                }}
                className="relative z-10 w-full rounded-[18px] px-5 py-4 text-[15px] font-bold shadow-sm transition hover:-translate-y-0.5"
                style={{ background: 'var(--layout-gold-gradient, linear-gradient(135deg,#E2B96B,#C89D52))', color: 'var(--layout-text, #2A2421)' }}
              >
                Resgatar meu certificado
              </button>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center rounded-[24px] border px-6 py-6 text-center"
              style={{ borderColor: 'var(--layout-border, #E8E0D5)', background: 'var(--layout-card, #FFFDF8)' }}
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'var(--layout-card-subtle, #F5EFE5)', color: 'var(--layout-gold-dark, #A87E37)' }}>
                <Award size={24} />
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--layout-text-secondary, #6B625B)' }}>
                Conclua os sete dias do protocolo para desbloquear seu certificado.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
