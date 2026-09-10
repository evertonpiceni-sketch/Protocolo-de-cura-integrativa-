import React from 'react';
import { BookOpen, ChevronRight, Flower2, Headphones, Leaf, Play, Sliders, Sparkles, Sun, Waves } from 'lucide-react';
import { DayProgress } from '../types';
import brandLogo from '../assets/images/app_icon_lotus_1787334709504.jpg';

type Props = {
  userName: string;
  currentDay: number;
  progress: DayProgress[];
  onStartSession: (day: number) => void;
  onOpenJournal: () => void;
  onOpenAnamnesis: () => void;
  onOpenArcanjo: () => void;
  onOpenChakras: () => void;
  onOpenBaths: () => void;
  onOpenAstral: () => void;
  onOpenNumerology: () => void;
  onOpenSettings: () => void;
};

const careCards = [
  { key: 'chakras', title: 'Guia dos 7 Chakras', copy: 'Conheça seus centros de energia', icon: Sparkles },
  { key: 'bath', title: 'Banhos e Aromas', copy: 'Natureza como parte do cuidado', icon: Leaf },
  { key: 'astral', title: 'Mapa Astral', copy: 'Um olhar simbólico para sua jornada', icon: Sun },
  { key: 'numerology', title: 'Numerologia', copy: 'Ciclos, essência e caminhos', icon: Flower2 },
];

export default function TransformationHome(props: Props) {
  const firstName = props.userName?.trim().split(' ')[0] || 'bem-vindo';
  const completed = props.progress.filter(item => item.completed).length;
  const total = Math.max(props.progress.length, 21);
  const percentage = Math.min(100, Math.round((completed / total) * 100));
  const actions: Record<string, () => void> = {
    chakras: props.onOpenChakras,
    bath: props.onOpenBaths,
    astral: props.onOpenAstral,
    numerology: props.onOpenNumerology,
  };

  return (
    <div className="ep-home mx-auto w-full max-w-[520px] px-4 pb-28 sm:px-5">
      <section className="ep-home-hero overflow-hidden rounded-[2rem] border border-[#e7ca76]/35 px-6 py-8 text-center shadow-[0_24px_70px_rgba(0,0,0,.34)]">
        <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-[#e7ca76]/55 bg-[#062d20] shadow-[0_0_28px_rgba(231,202,118,.2)]">
          <img src={brandLogo} alt="Everton Piceni — Terapias Holísticas e Bem-Estar" className="h-full w-full object-cover" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[.24em] text-[#e7ca76]">Protocolo da Transformação</p>
        <h2 className="mt-4 font-display text-[2.15rem] font-semibold leading-tight text-[#fff8e7]">Olá, {firstName}.</h2>
        <p className="mx-auto mt-3 max-w-sm font-display text-xl italic leading-7 text-[#dce9df]">Que bom que você voltou para si.</p>
        <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-[#e7ca76] to-transparent" />
        <p className="mx-auto mt-5 max-w-sm text-base leading-7 text-[#d7e4db]">Respire. Você não precisa fazer tudo hoje. Escolha apenas o cuidado que combina com o seu momento.</p>
      </section>

      <section className="mt-5 rounded-[1.75rem] border border-[#e7ca76]/30 bg-[#062f21]/92 p-5 shadow-[0_18px_48px_rgba(0,0,0,.28)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <div><p className="text-xs uppercase tracking-[.2em] text-[#e7ca76]">Seu momento de hoje</p><h3 className="mt-2 font-display text-3xl text-[#fff8e7]">Dia {props.currentDay}</h3></div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e7ca76]/30 bg-[#e7ca76]/10 text-[#e7ca76]"><Headphones size={24}/></div>
        </div>
        <p className="mt-4 text-base leading-7 text-[#c9d9ce]">Uma prática guiada com voz humana, frequência e espaço para respirar no seu tempo.</p>
        <button onClick={() => props.onStartSession(props.currentDay)} className="ep-gold-button mt-6 flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-base font-bold"><Play size={20} fill="currentColor"/>Iniciar meditação</button>
      </section>

      <section className="mt-5 rounded-[1.75rem] border border-[#e7ca76]/25 bg-[#052a1e]/92 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-[#e7ca76]">Seu progresso</p><h3 className="mt-2 font-display text-2xl text-[#fff8e7]">Um passo de cada vez</h3></div><span className="font-display text-2xl text-[#e7ca76]">{percentage}%</span></div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/25"><div className="h-full rounded-full bg-gradient-to-r from-[#b78d32] to-[#f0d98d]" style={{width:`${percentage}%`}}/></div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={props.onOpenJournal} className="flex items-center gap-3 rounded-2xl border border-[#e7ca76]/20 bg-[#0a3a29]/75 p-4 text-left"><BookOpen size={21} className="text-[#e7ca76]"/><span><strong className="block text-sm text-[#fff8e7]">Meu Diário</strong><small className="mt-1 block text-xs text-[#b9cdbf]">Registrar percepções</small></span></button>
          <button onClick={props.onOpenAnamnesis} className="flex items-center gap-3 rounded-2xl border border-[#e7ca76]/20 bg-[#0a3a29]/75 p-4 text-left"><Waves size={21} className="text-[#e7ca76]"/><span><strong className="block text-sm text-[#fff8e7]">Como estou?</strong><small className="mt-1 block text-xs text-[#b9cdbf]">Olhar meu momento</small></span></button>
        </div>
      </section>

      <section className="mt-5">
        <div className="mb-4 px-1"><p className="text-xs uppercase tracking-[.2em] text-[#e7ca76]">Caminhos de cuidado</p><h3 className="mt-2 font-display text-3xl text-[#fff8e7]">Escolha o que faz sentido</h3></div>
        <button onClick={props.onOpenArcanjo} className="group flex w-full items-center justify-between rounded-[1.6rem] border border-[#e7ca76]/35 bg-gradient-to-br from-[#0a412d]/95 to-[#052a1e]/95 p-5 text-left shadow-[0_16px_42px_rgba(0,0,0,.24)]"><span className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e7ca76]/12 text-[#e7ca76]"><Sparkles size={24}/></span><span><strong className="block font-display text-xl text-[#fff8e7]">Proteção e Presença</strong><small className="mt-1 block text-sm text-[#c3d4c8]">Jornada de São Miguel</small></span></span><ChevronRight className="text-[#e7ca76]"/></button>
        <div className="mt-3 grid grid-cols-2 gap-3">{careCards.map(card => { const Icon=card.icon; return <button key={card.key} onClick={actions[card.key]} className="min-h-40 rounded-[1.5rem] border border-[#e7ca76]/22 bg-[#062f21]/90 p-4 text-left backdrop-blur-xl"><Icon size={24} className="text-[#e7ca76]"/><strong className="mt-5 block font-display text-xl leading-5 text-[#fff8e7]">{card.title}</strong><small className="mt-2 block text-sm leading-5 text-[#b9cdbf]">{card.copy}</small></button>})}</div>
      </section>

      <nav className="fixed inset-x-0 bottom-3 z-40 mx-auto flex w-[calc(100%-1.5rem)] max-w-[500px] items-center justify-around rounded-[1.4rem] border border-[#e7ca76]/35 bg-[#042a1d]/95 px-2 py-2 shadow-[0_18px_50px_rgba(0,0,0,.45)] backdrop-blur-xl">
        <button onClick={() => props.onStartSession(props.currentDay)} className="flex min-w-16 flex-col items-center gap-1 p-2 text-xs text-[#efd786]"><Play size={21}/><span>Prática</span></button>
        <button onClick={props.onOpenJournal} className="flex min-w-16 flex-col items-center gap-1 p-2 text-xs text-[#d6e3d9]"><BookOpen size={21}/><span>Diário</span></button>
        <button onClick={props.onOpenAnamnesis} className="flex min-w-16 flex-col items-center gap-1 p-2 text-xs text-[#d6e3d9]"><Leaf size={21}/><span>Momento</span></button>
        <button onClick={props.onOpenSettings} className="flex min-w-16 flex-col items-center gap-1 p-2 text-xs text-[#d6e3d9]"><Sliders size={21}/><span>Ajustes</span></button>
      </nav>
    </div>
  );
}
