import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, RotateCcw, RotateCw, Volume2, BookOpen, ChevronLeft } from 'lucide-react';
import { UserProfile } from '../types';

interface ArcanjoProtocolViewProps {
  userProfile: UserProfile;
  onLogout: () => void;
  onClose?: () => void;
}

type ProtocolConfig = {
  dia: number;
  nome: string;
  subtitulo: string;
  local: string;
  foco: string;
  cor: string;
  corSecundaria: string;
  freq: number;
  petals: number;
  intencao: string;
};

const DADOS_PROTOCOLO: Record<number, ProtocolConfig> = {
  1: { dia: 1, nome: 'Chakra Básico', subtitulo: 'Raiz • Sobrevivência e Segurança', local: 'Base da coluna', foco: 'Aterramento físico e liberação do medo da escassez', cor: '#ef4444', corSecundaria: '#fca5a5', freq: 396, petals: 4, intencao: 'trazendo estabilidade, presença e segurança interior' },
  2: { dia: 2, nome: 'Chakra Esplênico', subtitulo: 'Sacral • Vitalidade e Emoções', local: 'Abaixo do umbigo', foco: 'Liberação de bloqueios emocionais e resgate da força criativa', cor: '#f97316', corSecundaria: '#fdba74', freq: 417, petals: 6, intencao: 'liberando emoções e permitindo que a vitalidade e a criatividade voltem a fluir' },
  3: { dia: 3, nome: 'Chakra Plexo Solar', subtitulo: 'Poder Pessoal e Autoconfiança', local: 'Boca do estômago', foco: 'Liberação de laços de ansiedade, insegurança e controle', cor: '#eab308', corSecundaria: '#fde047', freq: 528, petals: 10, intencao: 'resgatando autoconfiança, coragem e poder pessoal' },
  4: { dia: 4, nome: 'Chakra Cardíaco', subtitulo: 'Coração • Amor e Aceitação', local: 'Centro do peito', foco: 'Transmutação simbólica de mágoas, rejeição e culpas', cor: '#22c55e', corSecundaria: '#86efac', freq: 639, petals: 12, intencao: 'abrindo espaço para amor próprio, acolhimento e perdão' },
  5: { dia: 5, nome: 'Chakra Laríngeo', subtitulo: 'Garganta • Expressão e Verdade', local: 'Garganta', foco: 'Liberação simbólica de travas de comunicação e expressão', cor: '#0ea5e9', corSecundaria: '#7dd3fc', freq: 741, petals: 16, intencao: 'liberando sua expressão e permitindo que sua verdade seja comunicada com clareza' },
  6: { dia: 6, nome: 'Chakra Frontal', subtitulo: 'Terceiro Olho • Mente e Intuição', local: 'Centro da testa', foco: 'Acalmar o excesso de estímulos e favorecer foco e clareza mental', cor: '#4f46e5', corSecundaria: '#a5b4fc', freq: 852, petals: 2, intencao: 'favorecendo silêncio interior, foco, discernimento e intuição' },
  7: { dia: 7, nome: 'Chakra Coronário', subtitulo: 'Coroa • Conexão Espiritual', local: 'Topo da cabeça', foco: 'Integração, presença e conexão espiritual', cor: '#a855f7', corSecundaria: '#d8b4fe', freq: 963, petals: 24, intencao: 'aprofundando presença, integração e conexão espiritual' },
};

const ETAPAS = [
  { inicio: 0, fim: 90, titulo: 'Abertura e Portal do Dia', assinatura: 'Hon-Sha-Ze-Sho-Nen' },
  { inicio: 90, fim: 270, titulo: 'Corte e Proteção', assinatura: 'Cúpula e Espada de São Miguel' },
  { inicio: 270, fim: 450, titulo: 'Transmutação Profunda', assinatura: 'Chama Violeta' },
  { inicio: 450, fim: 540, titulo: 'Integração e Regeneração Sutil', assinatura: 'Raio de Ouro e Verde de São Rafael' },
  { inicio: 540, fim: 600, titulo: 'Selamento e Poder Pessoal', assinatura: 'Cho-Ku-Rei de Ouro' },
];

function roteiroDoDia(config: ProtocolConfig) {
  return `[00:00 – 01:30] ABERTURA E PORTAL DO DIA\n\nEu aceito receber neste momento, com todo o meu coração, esta prática do Protocolo da Transformação.\n\nFeche os olhos. Respire fundo pelo nariz... sustente o ar por alguns instantes... e solte lentamente pela boca. Mais uma vez. Inspire com suavidade... perceba o ar entrando... e expire, permitindo que o corpo fique um pouco mais solto.\n\nSinta o peso do corpo apoiado onde você está. Perceba os pés, as pernas, o quadril, o abdômen, o peito, os ombros e o rosto. Não existe nada para alcançar agora. Apenas permaneça presente.\n\nImagine raízes de luz partindo dos seus pés e descendo profundamente em direção à Terra. A cada expiração, permita-se sentir mais firme, presente e amparado.\n\nLeve agora sua atenção ao ${config.nome}, localizado em ${config.local}. Hoje direcionamos nossa intenção para este centro, ${config.intencao}. Respire e permita-se apenas observar.\n\n[01:30 – 04:30] CORTE E PROTEÇÃO DE SÃO MIGUEL\n\nVisualize ao seu redor uma luz azul-safira ampla e luminosa, formando simbolicamente um espaço de proteção. Dentro desse espaço, imagine a presença firme e amorosa de São Miguel.\n\nLeve novamente sua consciência ao ${config.nome}. Imagine uma espada de luz azul passando ao redor desse centro, não tocando seu corpo físico, mas representando a liberação de vínculos, preocupações e padrões que você escolhe não carregar mais.\n\nA cada respiração, repita mentalmente: eu libero o que já cumpriu seu papel. Eu permaneço com aquilo que fortalece minha paz, minha consciência e minha autonomia.\n\nPermaneça alguns instantes em silêncio. Inspire... expire... perceba o espaço que surge quando você deixa de apertar aquilo que pode ser solto.\n\nVisualize o centro do dia ficando mais livre e luminoso. Você continua protegido dentro da luz azul. Respire devagar e permita que essa sensação se estabilize.\n\n[04:30 – 07:30] TRANSMUTAÇÃO PROFUNDA DA CHAMA VIOLETA\n\nImagine agora uma chama violeta suave envolvendo simbolicamente o ${config.nome}. Ela não queima nem machuca. É uma imagem de transformação interior.\n\nPermita que nela sejam colocadas lembranças difíceis, culpas, mágoas, receios e padrões emocionais relacionados ao foco de hoje: ${config.foco.toLowerCase()}.\n\nVocê não precisa reviver nenhuma experiência. Apenas reconheça que pode olhar para o que sente com mais espaço e gentileza. A cada expiração, imagine a chama transformando peso em aprendizado, tensão em espaço e rigidez em possibilidade de mudança.\n\nRespire. Se alguma emoção aparecer, apenas observe. Não force, não lute e não julgue. Volte à respiração e ao contato com o seu corpo.\n\nMentalmente diga: eu reconheço minha história sem precisar permanecer preso a ela. Eu escolho caminhar com mais consciência e leveza.\n\nPermaneça por alguns instantes recebendo o silêncio.\n\n[07:30 – 09:00] RAIO VERDE E OURO DE SÃO RAFAEL\n\nAgora imagine uma luz verde-esmeralda misturada a reflexos dourados descendo suavemente e envolvendo o ${config.nome}. Receba essa imagem como um símbolo de equilíbrio, cuidado, integração e renovação interior.\n\nRespire com calma. Perceba o corpo. Permita que a região relacionada ao centro do dia relaxe sem esforço. Imagine a luz preenchendo os espaços que ficaram mais leves durante a prática.\n\nRepita mentalmente: eu acolho meu corpo. Eu respeito meu tempo. Eu escolho cultivar equilíbrio, presença e cuidado comigo.\n\n[09:00 – 10:00] SELAMENTO E ASSUNÇÃO DO PODER PESSOAL\n\nPara encerrar, visualize-se sentado em um trono de luz. Não como alguém acima dos outros, mas como alguém que reassume responsabilidade pela própria caminhada.\n\nO ${config.nome} permanece luminoso e integrado aos demais centros. Respire profundamente.\n\nRepita devagar:\nEu sou livre para construir minha felicidade.\nEu me acolho quando sinto medo ou dúvida.\nEu escolho cuidar de mim.\nEu sou amor.\nEu escolho a paz.\nSinto muito. Me perdoe. Eu te amo. Sou grato.\n\nRespire mais uma vez. Perceba novamente seu corpo e o ambiente ao redor. Quando se sentir pronto, movimente as mãos e os pés e abra os olhos lentamente. A prática de hoje está encerrada.`;
}

function ChakraMandala({ config, rotating }: { config: ProtocolConfig; rotating: boolean }) {
  const count = Math.max(config.petals, 2);
  return <div className={`relative w-full h-full flex items-center justify-center ${rotating ? 'animate-[spin_40s_linear_infinite]' : ''}`}>
    <div className="absolute inset-[12%] rounded-full blur-[45px] opacity-50" style={{ background: config.cor }} />
    <svg viewBox="-120 -120 240 240" className="w-full h-full relative drop-shadow-[0_0_18px_rgba(255,255,255,.25)]">
      <circle cx="0" cy="0" r="103" fill="none" stroke={config.corSecundaria} strokeWidth="2" opacity=".55" />
      {Array.from({ length: count }).map((_, i) => <ellipse key={i} cx="0" cy="-58" rx="22" ry="52" fill={config.cor} fillOpacity=".38" stroke={config.corSecundaria} strokeWidth="1.4" transform={`rotate(${i * 360 / count})`} />)}
      <circle cx="0" cy="0" r="34" fill={config.cor} fillOpacity=".72" stroke="white" strokeOpacity=".55" />
      <circle cx="0" cy="0" r="8" fill="white" opacity=".9" />
    </svg>
  </div>;
}

export default function ArcanjoProtocolView({ userProfile, onClose }: ArcanjoProtocolViewProps) {
  const [diaAtual, setDiaAtual] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showRoteiro, setShowRoteiro] = useState(false);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const timerRef = useRef<number | null>(null);
  const config = DADOS_PROTOCOLO[diaAtual];
  const TOTAL_SECONDS = 10 * 60;
  const progressPercent = Math.min(100, elapsed / TOTAL_SECONDS * 100);
  const etapaAtual = ETAPAS.find(e => elapsed >= e.inicio && elapsed < e.fim) || ETAPAS[ETAPAS.length - 1];

  useEffect(() => {
    const done: number[] = [];
    for (let i = 1; i <= 7; i++) if (localStorage.getItem(`reiki_arcanjo_dia_${i}`) === 'true') done.push(i);
    setCompletedDays(done);
    setDiaAtual([1,2,3,4,5,6,7].find(d => !done.includes(d)) || 1);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, []);

  const formatTime = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${Math.floor(s%60).toString().padStart(2,'0')}`;
  const stop = () => { setIsPlaying(false); if (timerRef.current) window.clearInterval(timerRef.current); timerRef.current = null; if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  const complete = () => { localStorage.setItem(`reiki_arcanjo_dia_${diaAtual}`, 'true'); setCompletedDays(p => [...new Set([...p, diaAtual])]); stop(); };
  const start = () => {
    stop(); setElapsed(0); setIsPlaying(true);
    if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(roteiroDoDia(config).replace(/\[[^\]]+\]/g, '')); u.lang='pt-BR'; u.rate=.72; u.pitch=.95; window.speechSynthesis.speak(u); }
    timerRef.current = window.setInterval(() => setElapsed(p => { const n=p+1; if(n>=TOTAL_SECONDS){ setTimeout(complete,0); return TOTAL_SECONDS; } return n; }),1000);
  };
  const selectDay = (d:number) => { stop(); setElapsed(0); setDiaAtual(d); };

  return <div className="fixed inset-0 z-[100] flex flex-col bg-[#05060D] text-white overflow-y-auto">
    <div className="fixed inset-0 pointer-events-none opacity-20" style={{background:`radial-gradient(circle at center 35%,${config.cor},#05060D 65%)`}} />
    <header className="relative z-10 flex items-center justify-between px-5 py-5 w-full max-w-md mx-auto">
      <button onClick={onClose} className="text-slate-400"><ChevronLeft size={24}/></button>
      <div className="text-center"><div className="text-[11px] uppercase tracking-widest text-slate-300">Protocolo da Transformação</div><h1 className="text-sm mt-1">Dia {config.dia} de 7 • {config.nome}</h1></div>
      <button onClick={onClose} className="text-slate-400"><X size={24}/></button>
    </header>
    <main className="relative z-10 flex-1 flex flex-col items-center px-5 w-full max-w-md mx-auto pb-12">
      <div className="w-full aspect-square max-w-[300px] my-4"><ChakraMandala config={config} rotating={isPlaying}/></div>
      <div className="text-center mb-7"><h2 className="text-3xl font-serif font-bold" style={{color:config.corSecundaria}}>{config.nome}</h2><p className="text-sm text-slate-300 mt-2">{config.subtitulo}</p><p className="text-xs text-slate-400 mt-2">{config.local} • {config.freq} Hz</p><p className="text-sm text-slate-300 mt-4 leading-relaxed">{config.foco}</p></div>
      <div className="w-full mb-7"><div className="h-1 bg-white/10 rounded-full"><div className="h-full rounded-full" style={{width:`${progressPercent}%`,background:config.corSecundaria}}/></div><div className="flex justify-between text-xs text-slate-400 font-mono mt-3"><span>{formatTime(elapsed)}</span><span>10:00</span></div>
        <div className="flex items-center justify-between mt-5"><Volume2 size={20} className="text-slate-400"/><button onClick={()=>setElapsed(p=>Math.max(0,p-10))}><RotateCcw/></button><button onClick={()=>isPlaying?stop():start()} className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center">{isPlaying?<Pause size={28}/>:<Play size={30}/>}</button><button onClick={()=>setElapsed(p=>Math.min(TOTAL_SECONDS,p+10))}><RotateCw/></button><span className="w-5"/></div>
      </div>
      <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 text-center"><p className="text-[11px] text-slate-400 uppercase tracking-widest">Etapa atual</p><p className="text-sm text-slate-200 mt-1">{etapaAtual.titulo}</p><p className="text-xs text-slate-500 mt-1">Programação interna: {etapaAtual.assinatura}</p><button onClick={()=>setShowRoteiro(!showRoteiro)} className="mt-3 text-xs underline text-slate-400">{showRoteiro?'Ocultar meditação':'Ler meditação completa'}</button>{showRoteiro&&<div className="mt-4 text-sm text-slate-300 leading-relaxed text-left bg-black/20 p-4 rounded-xl whitespace-pre-line"><BookOpen size={18} className="mb-3"/>{roteiroDoDia(config)}</div>}</div>
      <p className="text-[11px] text-slate-500 text-center mb-7">Prática espiritual e integrativa. Não substitui cuidados médicos, psicológicos ou outros tratamentos de saúde.</p>
      <div className="w-full"><h4 className="text-xs uppercase tracking-widest text-slate-400 text-center mb-4">Ciclo dos 7 chakras • repetir por 3 semanas para 21 dias</h4><div className="grid grid-cols-2 gap-3">{[1,2,3,4,5,6,7].map(d=>{const c=DADOS_PROTOCOLO[d];return <button key={d} onClick={()=>selectDay(d)} className={`p-3 rounded-xl border text-left ${diaAtual===d?'border-white/40 bg-white/10':'border-white/10 bg-white/5'}`}><div className="text-xs text-slate-400">Dia {d} {completedDays.includes(d)?'✓':''}</div><div className="text-sm font-semibold mt-1" style={{color:c.corSecundaria}}>{c.nome}</div><div className="text-[10px] text-slate-500 mt-1">10 minutos</div></button>})}</div></div>
    </main>
  </div>;
}
