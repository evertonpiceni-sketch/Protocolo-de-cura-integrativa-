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

  useEffect(() => {
    // Read completions from ArcanjoProtocolView logic to sync exactly with it
    const completed: number[] = [];
    for (let i = 1; i <= 7; i += 1) {
      if (localStorage.getItem(`reiki_arcanjo_dia_${i}`) === 'true') {
        completed.push(i);
      }
    }
    setCompletedDays(completed);
  }, []);

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
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#050508] text-slate-100 font-sans selection:bg-[#E4C573]/30 overflow-y-auto">
      {/* Background Gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,#141829_0%,#09090E_40%,#050508_100%)]" />

      {/* Header */}
      <header className="relative z-10 mx-auto w-full max-w-lg px-5 py-6">
        <button
          onClick={onClose}
          className="mb-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
        >
          <ArrowLeft size={18} /> Voltar
        </button>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Olá, {userProfile?.name?.split(' ')[0] || 'Viajante'}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Seu campo magnético está se expandindo. Continue sua cura.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl border border-[#7233E6]/30 bg-[#7233E6]/10 px-4 py-2.5 shadow-[0_0_15px_rgba(114,51,230,0.15)]">
            <Flame className="text-[#9F7AEA] mb-1" size={24} />
            <div className="text-lg font-bold text-white leading-none">{streak}</div>
            <div className="text-[9px] uppercase tracking-wider text-slate-400 mt-1">Dias Seguidos</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-7">
          <div className="flex items-end justify-between mb-2">
            <span className="text-sm font-semibold text-[#E4C573]">{percentage}% Concluído</span>
            <span className="text-xs text-slate-400">{totalCompleted} de 7 Dias</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#B89845] to-[#E4C573] shadow-[0_0_10px_rgba(228,197,115,0.6)] transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-lg flex-1 px-5 pb-12">
        {/* Central Energy Visualizer */}
        <div className="relative mx-auto my-8 h-[380px] w-full max-w-[280px] rounded-3xl border border-white/5 bg-[#09090E]/50 shadow-inner overflow-hidden">
          {/* Subtle human silhouette or light beam */}
          <div className="absolute inset-x-0 bottom-0 top-10 mx-auto w-[60px] bg-gradient-to-b from-transparent via-white/5 to-transparent blur-md" />
          <div className="absolute inset-x-0 bottom-10 top-14 mx-auto w-1.5 rounded-full bg-gradient-to-b from-white/10 to-white/5" />
          
          {CHAKRAS_DATA.map((chakra) => {
            const isCompleted = completedDays.includes(chakra.day);
            return (
              <div
                key={chakra.name}
                className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 w-full"
                style={{ top: chakra.yPos }}
              >
                <div 
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-1000 ${
                    isCompleted ? 'scale-110' : 'scale-90 opacity-40 grayscale'
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
                      background: isCompleted ? chakra.color : '#334155',
                      boxShadow: isCompleted ? `0 0 15px ${chakra.color}` : 'none'
                    }}
                  />
                </div>
                {/* Optional floating labels for the chakras */}
                {/* <span className={`text-[9px] uppercase tracking-wider ${isCompleted ? 'text-slate-300' : 'text-slate-600'}`}>{chakra.sanskrit}</span> */}
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
                <div key={day} onClick={() => handlePlayDay(day)} className="relative flex cursor-pointer items-center justify-between rounded-2xl border border-[#E4C573]/50 bg-[#E4C573]/5 px-5 py-4 transition hover:bg-[#E4C573]/10">
                  <div className="absolute left-0 top-0 h-full w-2 rounded-l-2xl" style={{ backgroundColor: chakra.color, opacity: 0.8 }} />
                  <div className="ml-3">
                    <h3 className="font-serif text-[15px] font-semibold text-[#E4C573]">Dia {day}: {chakra.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Concluído</p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E4C573]/20 text-[#E4C573]">
                    <CheckCircle2 size={18} />
                  </div>
                </div>
              );
            }

            if (isCurrent) {
              return (
                <div key={day} className="relative overflow-hidden rounded-2xl border border-white/20 bg-[#161824] shadow-lg">
                  {/* Pulsating glow in chakra color */}
                  <div className="absolute inset-0 opacity-20 mix-blend-screen animate-pulse" style={{ background: `radial-gradient(circle at center, ${chakra.color} 0%, transparent 70%)` }} />
                  <div className="absolute left-0 top-0 h-full w-2 rounded-l-2xl" style={{ backgroundColor: chakra.color }} />
                  
                  <div className="relative flex items-center justify-between px-5 py-5 ml-2">
                    <div>
                      <h3 className="font-serif text-[16px] font-bold text-white">Dia {day}: {chakra.name}</h3>
                      <p className="text-[13px] text-slate-300 mt-1">Pronto para iniciar (15 min)</p>
                    </div>
                    <button 
                      onClick={() => handlePlayDay(day)}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105"
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
              <div key={day} className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#0E1017]/50 px-5 py-4 opacity-60">
                <div className="ml-1">
                  <h3 className="font-serif text-[15px] font-medium text-slate-500">Dia {day}: {chakra.name}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {day === nextAvailableDay + 1 ? 'Disponível amanhã' : 'Bloqueado'}
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-500">
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
               <h3 className="font-serif text-xl font-bold text-white relative z-10 mb-5">Jornada Concluída</h3>
               <button 
                 onClick={() => {
                   onClose();
                   window.dispatchEvent(new CustomEvent('OPEN_CERTIFICATE'));
                 }}
                 className="relative z-10 w-full rounded-full bg-gradient-to-r from-[#E4C573] to-[#B89845] py-[16px] text-[15px] font-bold text-[#09090E] shadow-[0_5px_15px_rgba(228,197,115,0.3)] transition hover:brightness-110"
               >
                 ✨ Resgatar Meu Certificado de Luz
               </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#0E1017] px-6 py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#161824] text-slate-500 mb-3">
                <Award size={24} />
              </div>
              <p className="text-[13px] leading-relaxed text-slate-400">
                <span className="mr-1">🔒</span> Conclua todos os 7 dias para desbloquear seu Certificado de Alinhamento Espiritual.
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
