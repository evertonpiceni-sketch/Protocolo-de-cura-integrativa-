import { useDialogFocus } from '../hooks/useDialogFocus';
import React, { useMemo, useEffect, useState } from 'react';
import { DayProgress, UserProfile } from '../types';
import { ArrowLeft, Flame, Lock, Play, CheckCircle2, Award, Sparkles } from 'lucide-react';

const CHAKRAS_DATA = [
  { day: 7, name: 'Chakra Coronário', sanskrit: 'Sahasrara', color: '#a855f7', glow: 'rgba(168,85,247,.72)', yPos: '10%' },
  { day: 6, name: 'Chakra Frontal', sanskrit: 'Ajna', color: '#6366f1', glow: 'rgba(99,102,241,.72)', yPos: '22%' },
  { day: 5, name: 'Chakra Laríngeo', sanskrit: 'Vishuddha', color: '#38bdf8', glow: 'rgba(56,189,248,.72)', yPos: '34%' },
  { day: 4, name: 'Chakra Cardíaco', sanskrit: 'Anahata', color: '#22c55e', glow: 'rgba(34,197,94,.72)', yPos: '48%' },
  { day: 3, name: 'Chakra Plexo Solar', sanskrit: 'Manipura', color: '#facc15', glow: 'rgba(250,204,21,.72)', yPos: '62%' },
  { day: 2, name: 'Chakra Esplênico', sanskrit: 'Svadhisthana', color: '#fb923c', glow: 'rgba(251,146,60,.72)', yPos: '75%' },
  { day: 1, name: 'Chakra Básico', sanskrit: 'Muladhara', color: '#ef4444', glow: 'rgba(239,68,68,.72)', yPos: '88%' },
];

export default function DashboardCura({ onClose, progress, userProfile }: { onClose: () => void; progress: DayProgress[], userProfile?: UserProfile }) {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const isEssenciaLuminosa = typeof document !== 'undefined' && document.documentElement.dataset.layout === 'essencia-luminosa';
  const chakraBodyImage = isEssenciaLuminosa ? '/brand/chakra-body-neutral.svg' : '/brand/human-chakra-model.jpg';
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  useDialogFocus(['natural-sereno', 'essencia-luminosa'].includes(document.documentElement.dataset.layout || ''), dialogRef, onClose);

  useEffect(() => {
    const profileCompleted = userProfile?.journeyProgress?.arcanjo7CompletedDays;
    if (Array.isArray(profileCompleted)) {
      setCompletedDays([...new Set(profileCompleted)].filter(day => day >= 1 && day <= 7).sort((a,b) => a-b));
      return;
    }
    const localCompleted: number[] = [];
    for (let i = 1; i <= 7; i += 1) {
      if (localStorage.getItem(`reiki_arcanjo_dia_${i}`) === 'true') localCompleted.push(i);
    }
    setCompletedDays(localCompleted);
  }, [userProfile?.journeyProgress?.arcanjo7CompletedDays]);

  const totalCompleted = completedDays.length;
  const percentage = Math.round((totalCompleted / 7) * 100);
  const nextAvailableDay = Math.min(totalCompleted + 1, 7);
  const journeyCompleted = totalCompleted === 7;
  
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
    <div ref={dialogRef} id="progress-dashboard" role="dialog" aria-modal="true" aria-label="Dashboard de Progresso Analítico" className={`fixed inset-0 z-[100] flex flex-col ${isEssenciaLuminosa ? 'bg-[#FFFFF8]' : 'bg-[#F8F4EC]'} text-[#2A2420] font-sans ${isEssenciaLuminosa ? 'selection:bg-[#C6A46A]/25' : 'selection:bg-[#E4C573]/30'} overflow-y-auto`}>
      {/* Background Gradient */}
      <div className={`fixed inset-0 pointer-events-none ${isEssenciaLuminosa ? 'bg-[radial-gradient(circle_at_50%_0,rgba(198,164,106,.10),transparent_30rem),linear-gradient(180deg,#FFFFF8,#F7F3E8)]' : 'bg-[radial-gradient(circle_at_50%_0,rgba(214,167,86,.12),transparent_30rem),linear-gradient(180deg,#FBF8F2,#F8F4EC)]'}`} />

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
            <h1 className={`text-xl sm:text-2xl font-serif font-bold ${isEssenciaLuminosa ? 'text-[#2A2420]' : 'text-white'}`}>
              Olá, {userProfile?.name?.split(' ')[0] || 'Viajante'}
            </h1>
            <p className="mt-1 text-sm text-[#5C5248]">
              Equilíbrio hoje, um amanhã mais leve.
            </p>
          </div>
          <div className={`flex shrink-0 flex-col items-center justify-center rounded-2xl border bg-white/80 px-4 py-2.5 ${isEssenciaLuminosa ? 'border-[#E5DAC6] shadow-[0_8px_24px_rgba(112,91,58,.08)]' : 'border-[#E4C573]/35 shadow-[0_0_15px_rgba(228,197,115,0.12)]'}`}>
            <Flame className={`mb-1 ${isEssenciaLuminosa ? 'text-[#A87E37]' : 'text-[#E4C573]'}`} size={24} />
            <div className="text-lg font-bold text-[#2A2420] leading-none">{streak}</div>
            <div className="text-[9px] uppercase tracking-wider text-[#5C5248] mt-1">Dias Seguidos</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-7">
          <div className="flex items-end justify-between mb-2">
            <span className={`text-sm font-semibold ${isEssenciaLuminosa ? 'text-[#A87E37]' : 'text-[#E4C573]'}`}>{percentage}% Concluído</span>
            <span className="text-xs text-[#5C5248]">{totalCompleted} de 7 Dias</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5DAC6]">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${isEssenciaLuminosa ? 'shadow-[0_0_8px_rgba(168,126,55,.18)]' : 'bg-gradient-to-r from-[#B89845] to-[#E4C573] shadow-[0_0_10px_rgba(228,197,115,0.6)]'}`}
              style={{ width: `${percentage}%`, ...(isEssenciaLuminosa ? { background: 'linear-gradient(90deg, #C6A46A, #A87E37)' } : {}) }}
            />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-lg flex-1 px-5 pb-12">
        {/* Central Energy Visualizer */}
        <div className={`relative mx-auto my-8 aspect-[4/5] w-full max-w-[360px] rounded-[2rem] border bg-white/75 overflow-hidden ${isEssenciaLuminosa ? 'border-[#E5DAC6] shadow-[0_18px_48px_rgba(112,91,58,.10)]' : 'border-[#E4C573]/30 shadow-[0_22px_60px_rgba(0,0,0,.38)]'}`}>
          <img src={chakraBodyImage} alt={isEssenciaLuminosa ? "Representação corporal neutra em meditação com sete centros de energia" : "Pessoa em meditação com os sete chakras"} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F4EC]/70 via-transparent to-transparent" />
          
          {CHAKRAS_DATA.map((chakra) => {
            const isCompleted = completedDays.includes(chakra.day);
            return (
              <div
                key={chakra.name}
                className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 w-full pointer-events-none"
                style={{ top: chakra.yPos }}
              >
                <div 
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-1000 ${
                    isCompleted ? 'scale-110' : chakra.day === nextAvailableDay ? 'scale-110 animate-pulse' : 'scale-90 opacity-25 grayscale'
                  }`}
                >
                  <div
                    className="absolute inset-0 rounded-full blur-md"
                    style={{ background: isCompleted ? chakra.color : 'transparent', opacity: 0.6 }}
                  />
                  <div
                    className="relative h-4 w-4 rounded-full border-2"
                    style={{
                      borderColor: isCompleted ? '#fff' : '#64748b',
                      background: isCompleted || chakra.day === nextAvailableDay ? chakra.color : '#365849',
                      boxShadow: isCompleted || chakra.day === nextAvailableDay ? `0 0 18px 6px ${chakra.color}` : 'none'
                    }}
                  />
                </div>
                {/* Optional floating labels for the chakras */}
                {/* <span className={`text-[9px] uppercase tracking-wider ${isCompleted ? 'text-[#5C5248]' : 'text-[#85786C]'}`}>{chakra.sanskrit}</span> */}
              </div>
            );
          })}
        </div>

        {/* 7 Days Timeline Cards */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const chakra = [...CHAKRAS_DATA].reverse()[day - 1]; // Reverse because CHAKRAS_DATA is top-to-bottom (7 to 1)
            const isCompleted = completedDays.includes(day);
            const isCurrent = day === nextAvailableDay;
            const isLocked = day > nextAvailableDay;

            if (isCompleted) {
              return (
                <button type="button" key={day} onClick={() => handlePlayDay(day)} className={`relative flex w-full text-left cursor-pointer items-center justify-between rounded-2xl border px-5 py-4 transition ${isEssenciaLuminosa ? 'border-[#C6A46A]/35 bg-[#F7F3E8]/70 hover:bg-[#F7F3E8]' : 'border-[#E4C573]/50 bg-[#E4C573]/5 hover:bg-[#E4C573]/10'}`}>
                  <div className="absolute left-0 top-0 h-full w-2 rounded-l-2xl" style={{ backgroundColor: chakra.color, opacity: 0.8 }} />
                  <div className="ml-3">
                    <h3 className={`font-serif text-[15px] font-semibold ${isEssenciaLuminosa ? 'text-[#A87E37]' : 'text-[#E4C573]'}`}>Dia {day}: {chakra.name}</h3>
                    <p className="text-xs text-[#5C5248] mt-0.5">Concluído</p>
                  </div>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isEssenciaLuminosa ? 'bg-[#C6A46A]/15 text-[#A87E37]' : 'bg-[#E4C573]/20 text-[#E4C573]'}`}>
                    <CheckCircle2 size={18} />
                  </div>
                </button>
              );
            }

            if (isCurrent) {
              return (
                <div key={day} className={`relative overflow-hidden rounded-2xl border bg-white/90 ${isEssenciaLuminosa ? 'border-[#C6A46A]/35 shadow-[0_12px_32px_rgba(112,91,58,.08)]' : 'border-[#E4C573]/35 shadow-lg'}`}>
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
                      aria-label={`Iniciar dia ${day}: ${chakra.name}`} className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 ${isEssenciaLuminosa ? 'focus-visible:ring-[#C6A46A]/40' : 'focus-visible:ring-[#B88736]/30'}`}
                      style={{ background: isEssenciaLuminosa ? `linear-gradient(135deg, ${chakra.color}, #A87E37)` : `linear-gradient(135deg, ${chakra.color}, #09090E)` }}
                    >
                      <Play size={22} className={`ml-1 ${isEssenciaLuminosa ? 'text-[#2A2420]' : 'text-white'}`} fill="currentColor" />
                    </button>
                  </div>
                </div>
              );
            }

            // Locked
            return (
              <div key={day} className={`flex items-center justify-between rounded-2xl border px-5 py-4 opacity-60 ${isEssenciaLuminosa ? 'border-[#E5DAC6] bg-[#F7F3E8]' : 'border-[#E4C573]/12 bg-[#F5EFE4]'}`}>
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
            <div className={`relative flex flex-col items-center justify-center rounded-3xl border px-6 py-8 text-center overflow-hidden ${isEssenciaLuminosa ? 'border-[#E5DAC6] bg-gradient-to-br from-[#F7F3E8] to-[#FFFFF8] shadow-[0_16px_40px_rgba(112,91,58,.08)]' : 'border-[#E4C573]/40 bg-gradient-to-br from-[#E4C573]/20 to-[#B89845]/5 shadow-[0_0_30px_rgba(228,197,115,0.15)]'}`}>
               <div className={`absolute inset-0 opacity-50 blur-2xl pointer-events-none ${isEssenciaLuminosa ? 'bg-[radial-gradient(circle_at_center,#C6A46A_0%,transparent_70%)]' : 'bg-[radial-gradient(circle_at_center,#E4C573_0%,transparent_70%)]'}`} />
               <Sparkles className={`mb-3 relative z-10 ${isEssenciaLuminosa ? 'text-[#A87E37]' : 'text-[#E4C573]'}`} size={32} />
               <h3 className="font-serif text-xl font-bold text-[#2A2420] relative z-10 mb-5">Jornada Concluída</h3>
               <button 
                 onClick={() => {
                   onClose();
                   window.dispatchEvent(new CustomEvent('OPEN_CERTIFICATE'));
                 }}
                 className={`relative z-10 w-full py-[16px] text-[15px] font-bold transition hover:brightness-105 ${isEssenciaLuminosa ? 'rounded-2xl bg-gradient-to-r from-[#C6A46A] to-[#A87E37] text-[#2A2420] shadow-[0_8px_20px_rgba(112,91,58,.12)]' : 'rounded-full bg-gradient-to-r from-[#E4C573] to-[#B89845] text-[#09090E] shadow-[0_5px_15px_rgba(228,197,115,0.3)]'}`}
               >
                 Resgatar Meu Certificado de Luz
               </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-[#E5DAC6] bg-white/80 px-6 py-6 text-center">
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${isEssenciaLuminosa ? 'border border-[#E5DAC6] bg-[#F7F3E8] text-[#A87E37]' : 'bg-[#161824] text-[#85786C]'}`}>
                <Award size={24} />
              </div>
              <p className="text-[13px] leading-relaxed text-[#5C5248]">
                Conclua todos os 7 dias para desbloquear seu Certificado de Alinhamento Espiritual.
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
