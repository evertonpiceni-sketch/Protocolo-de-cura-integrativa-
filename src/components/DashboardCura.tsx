import { INTEGRATED_REIKI_DAYS, INTEGRATED_REIKI_ART } from '../data/integratedReikiJourney';
import { useDialogFocus } from '../hooks/useDialogFocus';
import React, { useMemo, useEffect, useState } from 'react';
import { DayProgress, UserProfile } from '../types';
import { ArrowLeft, Flame, Lock, Play, CheckCircle2, Award, Sparkles } from 'lucide-react';

export default function DashboardCura({ onClose, progress, userProfile }: { onClose: () => void; progress: DayProgress[], userProfile?: UserProfile }) {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  useDialogFocus(document.documentElement.dataset.layout === 'natural-sereno', dialogRef, onClose);

  useEffect(() => {
    const profileCompleted = userProfile?.journeyProgress?.integratedReiki21CompletedDays;
    if (Array.isArray(profileCompleted)) {
      setCompletedDays([...new Set(profileCompleted)].filter(day => day >= 1 && day <= 21).sort((a,b) => a-b));
      return;
    }
    const localCompleted: number[] = [];
    for (let i = 1; i <= 21; i += 1) {
      if (localStorage.getItem(`reiki_integrada_21_dia_${i}`) === 'true') localCompleted.push(i);
    }
    setCompletedDays(localCompleted);
  }, [userProfile?.journeyProgress?.integratedReiki21CompletedDays]);

  const totalCompleted = completedDays.length;
  const percentage = Math.round((totalCompleted / 21) * 100);
  const nextAvailableDay = INTEGRATED_REIKI_DAYS.find(day=>!completedDays.includes(day.dia))?.dia ?? 21;
  const journeyCompleted = totalCompleted === 21;
  
  // Calculate Streak (consecutive days completed up to current day)
  // For simplicity, we assume streak equals total completed in this 7-day flow, 
  // or we can calculate based on consecutive days completed from day 1.
  const streak = completedDays.length; 

  const handlePlayDay = (day: number) => {
    // In a real flow, this could navigate to the specific day in the ArcanjoProtocolView
    onClose(); 
    // Triggering a custom event or you would pass a callback to open the specific day
    window.dispatchEvent(new CustomEvent('OPEN_PROTOCOL_DAY', { detail: { day } }));
  };

  return (
    <div ref={dialogRef} id="progress-dashboard" role="dialog" aria-modal="true" aria-label="Dashboard de Progresso Analítico" className="fixed inset-0 z-[100] flex flex-col bg-[#F8F4EC] text-[#2A2420] font-sans selection:bg-[#E4C573]/30 overflow-y-auto">
      {/* Background Gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0,rgba(214,167,86,.12),transparent_30rem),linear-gradient(180deg,#FBF8F2,#F8F4EC)]" />

      {/* Header */}
      <header className="relative z-10 mx-auto w-full max-w-lg px-5 py-6">
        <button
          onClick={onClose}
          className="mb-4 flex items-center gap-2 text-sm text-[#5C5248] hover:text-[#2A2420] transition"
        >
          <ArrowLeft size={18} /> Voltar
        </button>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Olá, {userProfile?.name?.split(' ')[0] || 'Viajante'}
            </h1>
            <p className="mt-1 text-sm text-[#5C5248]">
              Equilíbrio hoje, um amanhã mais leve.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl border border-[#E4C573]/35 bg-white/80 px-4 py-2.5 shadow-[0_0_15px_rgba(228,197,115,0.12)]">
            <Flame className="text-[#E4C573] mb-1" size={24} />
            <div className="text-lg font-bold text-[#2A2420] leading-none">{streak}</div>
            <div className="text-[9px] uppercase tracking-wider text-[#5C5248] mt-1">Dias Seguidos</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-7">
          <div className="flex items-end justify-between mb-2">
            <span className="text-sm font-semibold text-[#E4C573]">{percentage}% Concluído</span>
            <span className="text-xs text-[#5C5248]">{totalCompleted} de 21 Dias</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5DAC6]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#B89845] to-[#E4C573] shadow-[0_0_10px_rgba(228,197,115,0.6)] transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-lg flex-1 px-5 pb-12">
        <img src={INTEGRATED_REIKI_ART} alt="Jornada Integrada: São Miguel, Chama Violeta e Rafael, em 21 dias" className="my-6 w-full rounded-2xl" />

        {/* 7 Days Timeline Cards */}
        <div className="space-y-4">
          {INTEGRATED_REIKI_DAYS.map((entry) => {
            const day = entry.dia;
            const chakra = {name:entry.nome,color:entry.cor};
            const isCompleted = completedDays.includes(day);
            const isCurrent = day === nextAvailableDay;
            const isLocked = day > nextAvailableDay;

            if (isCompleted) {
              return (
                <button type="button" key={day} onClick={() => handlePlayDay(day)} className="relative flex w-full text-left cursor-pointer items-center justify-between rounded-2xl border border-[#E4C573]/50 bg-[#E4C573]/5 px-5 py-4 transition hover:bg-[#E4C573]/10">
                  <div className="absolute left-0 top-0 h-full w-2 rounded-l-2xl" style={{ backgroundColor: chakra.color, opacity: 0.8 }} />
                  <div className="ml-3">
                    <h3 className="font-serif text-[15px] font-semibold text-[#E4C573]">Dia {day}: {chakra.name}</h3>
                    <p className="text-xs text-[#5C5248] mt-0.5">Concluído</p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E4C573]/20 text-[#E4C573]">
                    <CheckCircle2 size={18} />
                  </div>
                </button>
              );
            }

            if (isCurrent) {
              return (
                <div key={day} className="relative overflow-hidden rounded-2xl border border-[#E4C573]/35 bg-white/90 shadow-lg">
                  {/* Pulsating glow in chakra color */}
                  <div className="absolute inset-0 opacity-20 mix-blend-screen animate-pulse" style={{ background: `radial-gradient(circle at center, ${chakra.color} 0%, transparent 70%)` }} />
                  <div className="absolute left-0 top-0 h-full w-2 rounded-l-2xl" style={{ backgroundColor: chakra.color }} />
                  
                  <div className="relative flex items-center justify-between px-5 py-5 ml-2">
                    <div>
                      <h3 className="font-serif text-[16px] font-bold text-[#2A2420]">Dia {day}: {chakra.name}</h3>
                      <p className="text-[13px] text-[#5C5248] mt-1">Pronto para iniciar (15 min)</p>
                    </div>
                    <button 
                      onClick={() => handlePlayDay(day)}
                      aria-label={`Iniciar dia ${day}: ${chakra.name}`} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
                      style={{ background: `linear-gradient(135deg, ${chakra.color}, #09090E)` }}
                    >
                      <Play size={22} className="ml-1 text-white" fill="white" />
                    </button>
                  </div>
                </div>
              );
            }

            // Locked
            return (
              <div key={day} className="flex items-center justify-between rounded-2xl border border-[#E4C573]/12 bg-[#F5EFE4] px-5 py-4 opacity-60">
                <div className="ml-1">
                  <h3 className="font-serif text-[15px] font-medium text-[#85786C]">Dia {day}: {chakra.name}</h3>
                  <p className="text-xs text-[#85786C] mt-0.5">
                    {day === nextAvailableDay + 1 ? 'Disponível amanhã' : 'Bloqueado'}
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5EFE4] text-[#85786C]">
                  <Lock size={16} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: Certificate Section */}
        <div className="mt-10">
          {journeyCompleted ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-[#E4C573]/40 bg-gradient-to-br from-[#E4C573]/20 to-[#B89845]/5 px-6 py-8 text-center shadow-[0_0_30px_rgba(228,197,115,0.15)] relative overflow-hidden">
               <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_center,#E4C573_0%,transparent_70%)] blur-2xl pointer-events-none" />
               <Sparkles className="text-[#E4C573] mb-3 relative z-10" size={32} />
               <h3 className="font-serif text-xl font-bold text-[#2A2420] relative z-10 mb-5">Jornada Concluída</h3>
               <button 
                 onClick={() => {
                   onClose();
                   window.dispatchEvent(new CustomEvent('OPEN_CERTIFICATE'));
                 }}
                 className="relative z-10 w-full rounded-full bg-gradient-to-r from-[#E4C573] to-[#B89845] py-[16px] text-[15px] font-bold text-[#09090E] shadow-[0_5px_15px_rgba(228,197,115,0.3)] transition hover:brightness-110"
               >
                 Resgatar Meu Certificado de Luz
               </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-[#E5DAC6] bg-white/80 px-6 py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#161824] text-[#85786C] mb-3">
                <Award size={24} />
              </div>
              <p className="text-[13px] leading-relaxed text-[#5C5248]">
                Conclua todos os 21 dias para desbloquear seu Certificado de Alinhamento Espiritual.
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
