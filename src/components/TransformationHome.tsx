import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Leaf, Play, Sparkles, Sun } from 'lucide-react';
import { AnamnesisData, DayProgress } from '../types';
import { REINTEGRACAO_ACCEPTANCE, REINTEGRACAO_AUDIO_URL, getReintegracaoStage } from '../config/reintegracaoVida';

type Props = {
  userName: string;
  currentDay: number;
  progress: DayProgress[];
  anamnesis?: AnamnesisData;
  onStartSession: (day: number) => void;
  onOpenJournal: () => void;
  onOpenAnamnesis: () => void;
  onOpenArcanjo: () => void;
  onOpenChakras: () => void;
  onOpenBaths: () => void;
  onOpenAstral: () => void;
  onOpenNumerology: () => void;
  onOpenSettings: () => void;
  onOpenSystemic: () => void;
  onOpenHooponopono: () => void;
  onOpenAchievements: () => void;
  onOpenCourses: () => void;
  onOpenContact: () => void;
};

type View = 'home' | 'reintegracao';

export default function TransformationHome(props: Props) {
  const [view, setView] = useState<View>('home');
  const [accepted, setAccepted] = useState(false);
  const day = Math.min(21, Math.max(1, props.currentDay || 1));
  const stage = getReintegracaoStage(day);
  const firstName = props.userName?.trim().split(' ')[0] || 'bem-vindo';

  if (view === 'reintegracao') {
    return (
      <main className="min-h-screen bg-[#f7f1e4] text-[#28483b]">
        <div className="mx-auto w-full max-w-[560px] px-4 pb-24 pt-5">
          <button onClick={() => setView('home')} className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#b7c8b9] bg-white/80 px-4 py-2 text-sm font-semibold text-[#496557]">
            <ChevronLeft size={17}/> Voltar
          </button>

          <section className="overflow-hidden rounded-[2rem] border border-[#d7c58f] bg-[#fffaf0] shadow-[0_20px_60px_rgba(73,101,87,.15)]">
            <div className="relative h-72 overflow-hidden bg-[#e9efe3]">
              <img src="/brand/forest-app-background.png" alt="Natureza iluminada" className="h-full w-full object-cover opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fffaf0] via-[#fffaf0]/10 to-transparent" />
              <img src="/brand/chakra-body.png" alt="Corpo em meditação com chakras" className="absolute bottom-0 left-1/2 h-[92%] -translate-x-1/2 object-contain drop-shadow-xl" />
            </div>

            <div className="px-6 pb-7 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[.24em] text-[#a07d2d]">Jornada interativa de 21 dias</p>
              <h1 className="mt-3 font-display text-4xl leading-tight text-[#315746]">Reintegração à Vida</h1>
              <p className="mx-auto mt-3 max-w-md text-base leading-7 text-[#61766b]">21 dias para voltar, pouco a pouco, a sentir energia, presença, vontade, amor por si e movimento.</p>

              <div className="mt-6 rounded-[1.5rem] border border-[#d8dfcf] bg-white/80 p-5 text-left">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#a07d2d]">Dia {day} de 21</p>
                    <h2 className="mt-2 font-display text-2xl text-[#315746]">{stage.title}</h2>
                  </div>
                  <span className="rounded-full bg-[#edf2e8] px-3 py-1 text-xs font-semibold text-[#557061]">{Math.round((day / 21) * 100)}%</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e8e4d8]"><div className="h-full rounded-full bg-[#9fb69f]" style={{ width: `${(day / 21) * 100}%` }}/></div>
                <p className="mt-4 text-sm leading-6 text-[#687b71]">{stage.focus.join(' · ')}</p>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-[#e1d6b5] bg-[#fffdf7] p-5 text-left">
                <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#a07d2d]">Antes de começar</p>
                <p className="mt-3 text-sm leading-6 text-[#607369]">Leia com calma. O áudio começa somente depois do seu aceite consciente.</p>
                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl bg-[#f1f4ec] p-4">
                  <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="mt-1 h-5 w-5 accent-[#718f78]" />
                  <span className="text-sm leading-6 text-[#496557]">{REINTEGRACAO_ACCEPTANCE}</span>
                </label>
              </div>

              <div className={`mt-5 overflow-hidden rounded-[1.5rem] border p-5 text-left transition ${accepted ? 'border-[#cbb36c] bg-[#fffdf7]' : 'border-[#dedbd1] bg-[#f5f3ed] opacity-55'}`}>
                <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf2e8] text-[#6f8b72]"><Play size={20} fill="currentColor"/></div><div><p className="text-xs font-bold uppercase tracking-[.15em] text-[#a07d2d]">Prática do dia</p><p className="mt-1 font-semibold text-[#315746]">REINTEGRAÇÃO À VIDA · 30 min</p></div></div>
                <audio className="mt-4 w-full" controls preload="metadata" src={accepted ? REINTEGRACAO_AUDIO_URL : undefined} />
                {!accepted && <p className="mt-3 text-center text-xs text-[#7b817c]">Marque o aceite acima para liberar o áudio.</p>}
              </div>

              <div className="mt-5 rounded-[1.5rem] bg-[#edf2e8] p-5 text-left">
                <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#70826f]">Depois da prática</p>
                <h3 className="mt-2 font-display text-xl text-[#315746]">O que você vai fazer com essa energia?</h3>
                <p className="mt-2 text-sm leading-6 text-[#607369]">{stage.actionPrompt}</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f1e4] text-[#28483b]">
      <div className="mx-auto w-full max-w-[560px] px-4 pb-24 pt-5">
        <section className="relative overflow-hidden rounded-[2rem] border border-[#d7c58f] bg-[#fffaf0] px-6 pb-8 pt-7 text-center shadow-[0_20px_60px_rgba(73,101,87,.15)]">
          <div className="absolute inset-x-0 top-0 h-40 bg-[url('/brand/forest-app-background.png')] bg-cover bg-center opacity-20" />
          <div className="relative">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#d7c58f] bg-[#f1f4ec] shadow-sm"><img src="/brand/chakra-body.png" alt="Protocolo da Transformação" className="h-20 object-contain" /></div>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[.24em] text-[#a07d2d]">Protocolo da Transformação</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-[#315746]">Olá, {firstName}.</h1>
            <p className="mx-auto mt-3 max-w-sm text-base leading-7 text-[#65786e]">Que bom que você voltou para si. Escolha apenas o cuidado que combina com o seu momento.</p>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-[2rem] border border-[#d7c58f] bg-[#fffaf0] shadow-[0_18px_50px_rgba(73,101,87,.12)]">
          <div className="relative h-64 overflow-hidden bg-[#e9efe3]">
            <img src="/brand/forest-app-background.png" alt="Natureza" className="h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fffaf0]/95 via-[#fffaf0]/55 to-transparent" />
            <img src="/brand/chakra-body.png" alt="Corpo com chakras" className="absolute bottom-0 right-1 h-[94%] object-contain" />
            <div className="absolute left-5 top-6 max-w-[62%] text-left">
              <span className="rounded-full border border-[#cbb36c] bg-[#fffaf0]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[.15em] text-[#9a792f]">Nova jornada</span>
              <h2 className="mt-4 font-display text-3xl leading-tight text-[#315746]">Reintegração à Vida</h2>
              <p className="mt-2 text-sm leading-6 text-[#5d7468]">Uma jornada de 21 dias para voltar a sentir presença, vontade e movimento.</p>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-[#607369]"><div className="rounded-xl bg-[#edf2e8] p-3"><Sun className="mx-auto mb-1" size={18}/>21 dias</div><div className="rounded-xl bg-[#edf2e8] p-3"><Heart className="mx-auto mb-1" size={18}/>7 etapas</div><div className="rounded-xl bg-[#edf2e8] p-3"><Sparkles className="mx-auto mb-1" size={18}/>1 prática/dia</div></div>
            <button onClick={() => { setAccepted(false); setView('reintegracao'); }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6f8b72] px-5 py-4 text-base font-bold text-white shadow-[0_10px_24px_rgba(75,105,82,.2)]">Começar minha jornada <ChevronRight size={20}/></button>
          </div>
        </section>

        <section className="mt-5 rounded-[1.75rem] border border-[#d8dfcf] bg-white/70 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#8d7a45]">Outros cuidados</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button onClick={props.onOpenAnamnesis} className="rounded-2xl bg-[#edf2e8] p-4 text-left"><Heart size={20}/><strong className="mt-3 block">Como você está?</strong><span className="mt-1 block text-xs text-[#6d7e74]">Anamnese e acolhimento</span></button>
            <button onClick={props.onOpenChakras} className="rounded-2xl bg-[#edf2e8] p-4 text-left"><Sparkles size={20}/><strong className="mt-3 block">Chakras</strong><span className="mt-1 block text-xs text-[#6d7e74]">Conheça seus centros</span></button>
            <button onClick={props.onOpenBaths} className="rounded-2xl bg-[#edf2e8] p-4 text-left"><Leaf size={20}/><strong className="mt-3 block">Banhos e aromas</strong><span className="mt-1 block text-xs text-[#6d7e74]">Natureza e cuidado</span></button>
            <button onClick={props.onOpenJournal} className="rounded-2xl bg-[#edf2e8] p-4 text-left"><Sun size={20}/><strong className="mt-3 block">Meu diário</strong><span className="mt-1 block text-xs text-[#6d7e74]">Perceba seu caminho</span></button>
          </div>
        </section>
      </div>
    </main>
  );
}
