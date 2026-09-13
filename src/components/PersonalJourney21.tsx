import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Gem, Music2, Pause, Play, ShieldCheck, Sparkles } from 'lucide-react';
import { audioEngine } from '../lib/audio';
import { PERSONAL_JOURNEY_21_DAYS, PERSONAL_JOURNEY_ACCEPTANCE } from '../data/reintegrationJourney21';

type Props = { userName: string; onClose: () => void };
const STORAGE_KEY = 'transformacao_jornada_pessoal_21_dias_v1';

export default function PersonalJourney21({ userName, onClose }: Props) {
  const [day, setDay] = useState(1);
  const [accepted, setAccepted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  });
  const item = PERSONAL_JOURNEY_21_DAYS[day - 1];
  const command = useMemo(() => item.command.replace('[NOME]', userName || 'diga seu nome'), [item, userName]);

  useEffect(() => () => audioEngine.stopBG(), []);
  useEffect(() => { setAccepted(false); setPlaying(false); audioEngine.stopBG(); }, [day]);

  const toggleMusic = () => {
    if (playing) { audioEngine.stopBG(); setPlaying(false); return; }
    audioEngine.unlock();
    audioEngine.startBG(item.frequency);
    setPlaying(true);
  };
  const complete = () => {
    const next = completed.includes(day) ? completed : [...completed, day].sort((a, b) => a - b);
    setCompleted(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (day < 21) setDay(day + 1);
  };

  return <div className="min-h-screen bg-[#9fbaa2] px-4 py-5 text-[#173f35]">
    <main className="mx-auto w-full max-w-[620px]">
      <button onClick={onClose} className="mb-4 flex items-center gap-2 rounded-full bg-[#fffaf0]/90 px-4 py-2 text-sm font-semibold"><ArrowLeft size={17}/>Voltar ao início</button>
      <section className="overflow-hidden rounded-[2rem] border border-[#d6ae52]/40 bg-[#fffaf0]/95 shadow-[0_24px_70px_rgba(42,77,58,.18)]">
        <div className="bg-gradient-to-br from-[#315f49] to-[#244c3a] px-6 py-7 text-[#fffaf0]">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#ead28d]">21 Dias para Voltar para Mim</p>
          <p className="mt-2 font-display text-xl italic text-[#fffaf0]">Reintegração da Vida</p>
          <h1 className="mt-3 font-display text-3xl leading-tight">Dia {day}: {item.title}</h1>
          <p className="mt-3 text-base leading-7 text-[#e7eee5]">{item.cycle}</p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/20"><div className="h-full rounded-full bg-[#d6ae52]" style={{width:`${Math.round((completed.length / 21) * 100)}%`}}/></div>
          <p className="mt-2 text-xs text-[#dce8d8]">{completed.length} de 21 momentos concluídos</p>
        </div>
        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid grid-cols-7 gap-2">{PERSONAL_JOURNEY_21_DAYS.map(entry => <button key={entry.day} onClick={() => setDay(entry.day)} aria-label={`Abrir dia ${entry.day}`} className={`flex aspect-square items-center justify-center rounded-full border text-xs font-bold ${day === entry.day ? 'border-[#315f49] bg-[#315f49] text-white' : completed.includes(entry.day) ? 'border-[#d6ae52] bg-[#ead28d] text-[#173f35]' : 'border-[#72927c]/35 bg-[#e7eee5]'}`}>{completed.includes(entry.day) ? <Check size={14}/> : entry.day}</button>)}</div>
          <article className="rounded-3xl border border-[#72927c]/25 bg-[#e7eee5]/70 p-5"><p className="text-xs uppercase tracking-[.16em] text-[#587d67]">Intenção do dia</p><p className="mt-2 text-base leading-7">{item.intention}.</p></article>
          <div className="grid gap-3 sm:grid-cols-2"><article className="rounded-3xl border border-[#d6ae52]/35 p-5"><Music2 size={21} className="text-[#9a742b]"/><p className="mt-3 text-xs uppercase tracking-[.15em] text-[#587d67]">Base sonora</p><strong className="mt-1 block">{item.frequencyLabel}</strong></article><article className="rounded-3xl border border-[#d6ae52]/35 p-5"><Gem size={21} className="text-[#9a742b]"/><p className="mt-3 text-xs uppercase tracking-[.15em] text-[#587d67]">Cristal etérico</p><strong className="mt-1 block">{item.ethericCrystal}</strong></article></div>
          <article className="rounded-3xl bg-[#315f49] p-5 text-[#fffaf0]"><div className="flex items-center gap-2 text-[#ead28d]"><Sparkles size={19}/><p className="text-xs uppercase tracking-[.16em]">Programação energética</p></div><ul className="mt-4 space-y-2 text-sm leading-6 text-[#e7eee5]">{item.energies.map(energy => <li key={energy}>• {energy}</li>)}</ul></article>
          <article className="rounded-3xl border border-[#72927c]/25 p-5"><p className="text-xs uppercase tracking-[.16em] text-[#587d67]">Comando de programação</p><p className="mt-3 text-sm leading-7">{command}</p></article>
          <article className="rounded-3xl border border-[#72927c]/25 p-5"><p className="text-xs uppercase tracking-[.16em] text-[#587d67]">Meditação do dia</p><p className="mt-3 whitespace-pre-line text-base leading-8">{item.meditation}</p></article>
          <label className="flex cursor-pointer items-start gap-3 rounded-3xl border border-[#d6ae52]/35 bg-[#fff7df] p-5"><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} className="mt-1 h-5 w-5 accent-[#315f49]"/><span className="text-sm leading-6">{PERSONAL_JOURNEY_ACCEPTANCE}</span></label>
          <button disabled={!accepted} onClick={toggleMusic} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#efd78f] to-[#d4aa4e] px-5 py-4 font-bold disabled:opacity-40">{playing ? <Pause size={20}/> : <Play size={20}/>} {playing ? 'Pausar música' : 'Iniciar música e prática'}</button>
          <p className="flex items-start gap-2 text-xs leading-5 text-[#587d67]"><ShieldCheck size={17} className="mt-0.5 shrink-0"/>Esta jornada é uma experiência espiritual e integrativa complementar. Ela não substitui atendimento médico, psicológico ou apoio humano necessário.</p>
          <div className="flex items-center justify-between gap-3 border-t border-[#72927c]/20 pt-5"><button disabled={day === 1} onClick={() => setDay(day - 1)} className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold disabled:opacity-30"><ChevronLeft size={18}/>Anterior</button><button onClick={complete} className="rounded-full bg-[#315f49] px-5 py-3 text-sm font-bold text-white">{day === 21 ? 'Concluir jornada' : 'Concluir dia'}</button><button disabled={day === 21} onClick={() => setDay(day + 1)} className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold disabled:opacity-30">Próximo<ChevronRight size={18}/></button></div>
        </div>
      </section>
    </main>
  </div>;
}
