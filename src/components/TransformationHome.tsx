import React, { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Leaf, Pause, Play, Sparkles, Sun } from 'lucide-react';
import { AnamnesisData, DayProgress } from '../types';
import { REINTEGRACAO_ACCEPTANCE, REINTEGRACAO_AUDIO_URL, REINTEGRACAO_STAGES, getReintegracaoStage } from '../config/reintegracaoVida';

type Props = {
  userName: string; currentDay: number; progress: DayProgress[]; anamnesis?: AnamnesisData;
  onStartSession: (day: number) => void; onOpenJournal: () => void; onOpenAnamnesis: () => void;
  onOpenArcanjo: () => void; onOpenChakras: () => void; onOpenBaths: () => void; onOpenAstral: () => void;
  onOpenNumerology: () => void; onOpenSettings: () => void; onOpenSystemic: () => void; onOpenHooponopono: () => void;
  onOpenAchievements: () => void; onOpenCourses: () => void; onOpenContact: () => void;
};

type View = 'home' | 'reintegracao';
type Moment = 'arrival' | 'practice' | 'action';

const stageMessages = [
  'Hoje não é preciso correr. Primeiro, permaneça com você.',
  'A vida também retorna pelos pequenos lugares onde ainda existe sensação.',
  'Perceber abre espaço. Uma escolha pequena já pode mudar a direção.',
  'Seu valor não começa depois que você produzir. Ele já está aqui.',
  'Você não precisa voltar ao mundo de uma vez. Um passo real já é movimento.',
  'Você não precisa enxergar todo o caminho para começar a caminhar.',
  'Não procure uma versão perfeita de você. Procure os sinais de vida que voltaram a aparecer.'
];

export default function TransformationHome(props: Props) {
  const [view, setView] = useState<View>('home');
  const [moment, setMoment] = useState<Moment>('arrival');
  const [accepted, setAccepted] = useState(false);
  const [energy, setEnergy] = useState(3);
  const [action, setAction] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const day = Math.min(21, Math.max(1, props.currentDay || 1));
  const stage = getReintegracaoStage(day);
  const stageIndex = Math.max(0, REINTEGRACAO_STAGES.indexOf(stage));
  const firstName = props.userName?.trim().split(' ')[0] || 'bem-vindo';
  const journeyProgress = Math.round((day / 21) * 100);
  const completed = useMemo(() => props.progress.filter(p => p.completed).length, [props.progress]);

  const enterJourney = () => { setAccepted(false); setMoment('arrival'); setView('reintegracao'); };
  const toggleAudio = async () => {
    if (!audioRef.current || !accepted) return;
    if (audioRef.current.paused) await audioRef.current.play(); else audioRef.current.pause();
  };

  if (view === 'reintegracao') {
    return <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fffdf5_0%,#f3eddf_48%,#e7eee4_100%)] text-[#28483b]">
      <div className="mx-auto w-full max-w-[590px] px-4 pb-24 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => setView('home')} className="inline-flex items-center gap-2 rounded-full border border-[#cbd5c8] bg-white/75 px-4 py-2 text-sm font-semibold text-[#496557]"><ChevronLeft size={17}/> Voltar</button>
          <span className="text-xs font-semibold uppercase tracking-[.16em] text-[#9a7a34]">Dia {day} de 21</span>
        </div>

        <section className="overflow-hidden rounded-[2.25rem] border border-[#dbc991] bg-[#fffaf1] shadow-[0_28px_80px_rgba(65,91,75,.16)]">
          <div className="relative h-[360px] overflow-hidden bg-[#e9efe3]">
            <img src="/brand/forest-app-background.png" alt="Natureza iluminada" className="absolute inset-0 h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(255,224,132,.75),transparent_30%),linear-gradient(to_top,#fffaf1_0%,rgba(255,250,241,.06)_55%)]" />
            <div className="absolute left-1/2 top-7 h-20 w-20 -translate-x-1/2 rounded-full bg-[#ffe39a]/45 blur-xl" />
            <img src="/brand/chakra-body.png" alt="Corpo em meditação" className={`absolute bottom-0 left-1/2 h-[88%] -translate-x-1/2 object-contain drop-shadow-xl transition-all duration-1000 ${isPlaying ? 'brightness-110 saturate-125' : 'brightness-95 saturate-75'}`} />
            <div className="absolute bottom-5 left-1/2 w-[88%] -translate-x-1/2 rounded-2xl border border-white/60 bg-white/65 px-4 py-3 text-center backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#9b7a31]">{stage.title}</p>
              <p className="mt-1 text-sm font-medium text-[#4c6759]">{stage.focus.join(' · ')}</p>
            </div>
          </div>

          <div className="px-6 pb-8 pt-4">
            <div className="flex items-center gap-2">{REINTEGRACAO_STAGES.map((s, i) => <div key={s.title} className={`h-1.5 flex-1 rounded-full ${i <= stageIndex ? 'bg-[#a9bda8]' : 'bg-[#e8e2d5]'}`} />)}</div>
            <div className="mt-5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[.14em] text-[#8d8061]"><span>Início</span><span>{journeyProgress}% da jornada</span><span>Reintegração</span></div>

            {moment === 'arrival' && <div className="mt-7">
              <p className="text-center text-[11px] font-bold uppercase tracking-[.22em] text-[#a07d2d]">Chegada</p>
              <h1 className="mt-3 text-center font-display text-4xl leading-tight text-[#315746]">{stage.title}</h1>
              <p className="mx-auto mt-4 max-w-md text-center text-lg leading-8 text-[#62766b]">{stageMessages[stageIndex]}</p>
              <div className="mt-7 rounded-[1.6rem] border border-[#d9dfd2] bg-white/75 p-5">
                <p className="font-display text-xl text-[#315746]">Como sua energia está agora?</p>
                <p className="mt-1 text-sm text-[#718078]">Sem certo ou errado. Apenas perceba.</p>
                <div className="mt-5 grid grid-cols-5 gap-2">{[1,2,3,4,5].map(n => <button key={n} onClick={() => setEnergy(n)} className={`rounded-2xl py-3 text-sm font-bold transition ${energy === n ? 'bg-[#78947c] text-white shadow-md' : 'bg-[#edf2e9] text-[#62766b]'}`}>{n}</button>)}</div>
              </div>
              <button onClick={() => setMoment('practice')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#78947c] px-5 py-4 font-bold text-white shadow-[0_12px_28px_rgba(74,105,82,.22)]">Preparar minha prática <ChevronRight size={19}/></button>
            </div>}

            {moment === 'practice' && <div className="mt-7">
              <p className="text-center text-[11px] font-bold uppercase tracking-[.22em] text-[#a07d2d]">Sua prática de hoje</p>
              <h2 className="mt-3 text-center font-display text-3xl text-[#315746]">Um momento só seu</h2>
              {!accepted ? <>
                <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-[#687b71]">Respire com calma. Quando estiver presente, leia a frase abaixo e escolha conscientemente iniciar.</p>
                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-[1.5rem] border border-[#d9dfd2] bg-white/80 p-5"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="mt-1 h-5 w-5 accent-[#78947c]"/><span className="text-sm leading-6 text-[#4f685b]">{REINTEGRACAO_ACCEPTANCE}</span></label>
              </> : <div className="mt-5 rounded-[1.7rem] border border-[#d9c98e] bg-[linear-gradient(145deg,#fffdf7,#edf3e9)] p-6 text-center">
                <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#d7c58f] bg-white shadow-[0_0_36px_rgba(205,178,93,.22)] ${isPlaying ? 'animate-pulse' : ''}`}><button onClick={toggleAudio} className="flex h-16 w-16 items-center justify-center rounded-full bg-[#78947c] text-white">{isPlaying ? <Pause size={27} fill="currentColor"/> : <Play size={27} fill="currentColor" className="ml-1"/>}</button></div>
                <p className="mt-4 font-display text-2xl text-[#315746]">{isPlaying ? 'Sua prática está acontecendo' : 'REINTEGRAÇÃO À VIDA'}</p>
                <p className="mt-2 text-sm text-[#6d7e74]">{isPlaying ? 'Permaneça aqui. Respire. Não é preciso fazer mais nada agora.' : 'Áudio-matriz · aproximadamente 30 minutos'}</p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#dfe6dc]"><div className="h-full rounded-full bg-[#c7a951] transition-all" style={{width:`${audioProgress}%`}}/></div>
                <audio ref={audioRef} src={REINTEGRACAO_AUDIO_URL} preload="metadata" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onTimeUpdate={e => { const a=e.currentTarget; if(a.duration) setAudioProgress((a.currentTime/a.duration)*100); }} onEnded={() => { setIsPlaying(false); setAudioProgress(100); setMoment('action'); }} />
              </div>}
              {!accepted && <button disabled={!accepted} className="mt-5 w-full rounded-2xl bg-[#78947c] px-5 py-4 font-bold text-white disabled:opacity-35">Eu aceito — iniciar minha prática</button>}
              {accepted && !isPlaying && <button onClick={toggleAudio} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#78947c] px-5 py-4 font-bold text-white"><Play size={19}/> Iniciar minha prática</button>}
              {accepted && <button onClick={() => setMoment('action')} className="mt-3 w-full px-4 py-2 text-sm font-semibold text-[#75837b]">Ir para o fechamento</button>}
            </div>}

            {moment === 'action' && <div className="mt-7 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#edf2e8] text-[#78947c]"><Leaf size={28}/></div>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[.22em] text-[#a07d2d]">Depois da prática</p>
              <h2 className="mt-3 font-display text-3xl text-[#315746]">O que você vai fazer com essa energia?</h2>
              <p className="mx-auto mt-3 max-w-md text-base leading-7 text-[#687b71]">{stage.actionPrompt}</p>
              <div className="mt-6 rounded-[1.5rem] border border-[#d9dfd2] bg-white/80 p-5 text-left"><label className="text-xs font-bold uppercase tracking-[.15em] text-[#9a7a34]">Minha ação de hoje</label><textarea value={action} onChange={e=>setAction(e.target.value)} rows={3} placeholder="Um movimento pequeno e possível..." className="mt-3 w-full resize-none rounded-2xl border border-[#dfe4da] bg-[#fafbf7] p-4 text-sm text-[#496557] outline-none focus:border-[#9db19d]"/></div>
              <button onClick={props.onOpenJournal} className="mt-5 w-full rounded-2xl bg-[#78947c] px-5 py-4 font-bold text-white">Eu me comprometo com este pequeno movimento</button>
              <p className="mt-5 font-display text-lg italic leading-7 text-[#6a7d72]">“Um pequeno movimento também é vida acontecendo.”</p>
            </div>}
          </div>
        </section>
      </div>
    </main>;
  }

  return <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fffdf5_0%,#f3eddf_55%,#e9efe5_100%)] text-[#28483b]">
    <div className="mx-auto w-full max-w-[590px] px-4 pb-24 pt-5">
      <section className="relative overflow-hidden rounded-[2.2rem] border border-[#dbc991] bg-[#fffaf1] px-6 pb-8 pt-7 text-center shadow-[0_24px_70px_rgba(65,91,75,.14)]">
        <div className="absolute inset-x-0 top-0 h-44 bg-[url('/brand/forest-app-background.png')] bg-cover bg-center opacity-20"/><div className="relative"><div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-[#d7c58f] bg-white/70 shadow-[0_0_32px_rgba(205,178,93,.16)]"><img src="/brand/chakra-body.png" alt="Protocolo da Transformação" className="h-24 object-contain"/></div><p className="mt-5 text-[11px] font-bold uppercase tracking-[.24em] text-[#a07d2d]">Protocolo da Transformação</p><h1 className="mt-3 font-display text-4xl text-[#315746]">Olá, {firstName}.</h1><p className="mx-auto mt-3 max-w-sm text-base leading-7 text-[#65786e]">Hoje você não precisa resolver tudo. Escolha apenas o próximo cuidado possível.</p></div>
      </section>
      <section className="mt-5 overflow-hidden rounded-[2.2rem] border border-[#dbc991] bg-[#fffaf1] shadow-[0_22px_60px_rgba(65,91,75,.13)]">
        <div className="relative h-[330px] overflow-hidden bg-[#e9efe3]"><img src="/brand/forest-app-background.png" alt="Natureza" className="h-full w-full object-cover opacity-70"/><div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_15%,rgba(255,224,132,.62),transparent_25%),linear-gradient(to_right,#fffaf1_0%,rgba(255,250,241,.7)_43%,transparent_75%)]"/><img src="/brand/chakra-body.png" alt="Corpo com chakras" className="absolute bottom-0 right-0 h-[94%] object-contain"/><div className="absolute left-6 top-7 max-w-[62%] text-left"><span className="rounded-full border border-[#cbb36c] bg-[#fffaf0]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[.15em] text-[#9a792f]">Jornada de 21 dias</span><h2 className="mt-5 font-display text-[2.15rem] leading-tight text-[#315746]">Reintegração à Vida</h2><p className="mt-3 text-sm leading-6 text-[#5d7468]">Um caminho para voltar, pouco a pouco, a sentir presença, vontade, amor por si e movimento.</p></div></div>
        <div className="p-5"><div className="grid grid-cols-3 gap-2 text-center text-xs text-[#607369]"><div className="rounded-xl bg-[#edf2e8] p-3"><Sun className="mx-auto mb-1" size={18}/>21 dias</div><div className="rounded-xl bg-[#edf2e8] p-3"><Heart className="mx-auto mb-1" size={18}/>7 etapas</div><div className="rounded-xl bg-[#edf2e8] p-3"><Sparkles className="mx-auto mb-1" size={18}/>1 ritual/dia</div></div><div className="mt-4 rounded-2xl bg-[#f7f3e8] p-4 text-sm leading-6 text-[#687b71]">Chegada → percepção → aceite → prática → pequeno movimento → registro.</div><button onClick={enterJourney} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#78947c] px-5 py-4 text-base font-bold text-white shadow-[0_12px_28px_rgba(74,105,82,.22)]">Entrar na Reintegração <ChevronRight size={20}/></button></div>
      </section>
      <section className="mt-5 rounded-[1.75rem] border border-[#d8dfcf] bg-white/65 p-5"><div className="flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#8d7a45]">Seu caminho</p><p className="mt-1 text-sm text-[#6d7e74]">{completed} práticas concluídas</p></div><span className="font-display text-2xl text-[#78947c]">{Math.min(21,completed)}/21</span></div></section>
    </div>
  </main>;
}
