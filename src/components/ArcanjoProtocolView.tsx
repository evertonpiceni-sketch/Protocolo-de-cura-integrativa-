import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, RotateCcw, RotateCw, Volume2, BookOpen, ChevronLeft, Leaf, ShieldCheck, Heart, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';
import { audioEngine } from '../lib/audio';

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

function ChakraBody({ config, active }: { config: ProtocolConfig; active: boolean }) {
  const petalCount = Math.min(config.petals, 16);
  return <div className="relative mx-auto flex aspect-[4/5] w-full max-w-[430px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-[#e5c66f]/30 bg-[radial-gradient(circle_at_50%_42%,rgba(24,91,62,.72),rgba(3,38,26,.97)_62%)] shadow-[0_24px_70px_rgba(0,0,0,.38)]">
    <div className="absolute inset-0 opacity-25 bg-[linear-gradient(125deg,transparent_20%,rgba(229,198,111,.17)_50%,transparent_80%)]" />
    <div className={`relative h-72 w-72 ${active ? 'animate-pulse' : ''}`} style={{filter:`drop-shadow(0 0 24px ${config.cor})`}} aria-label={`${config.nome} em destaque`}>
      <div className="absolute inset-8 rounded-full border border-[#f5dda0]/45" />
      {Array.from({length: petalCount}).map((_, index) => <span key={index} className="absolute left-1/2 top-1/2 h-[43%] w-[22%] origin-[50%_100%] -translate-x-1/2 -translate-y-full rounded-[70%_70%_48%_48%] border-2" style={{transform:`translate(-50%,-100%) rotate(${index * 360 / petalCount}deg)`,borderColor:config.corSecundaria,background:`linear-gradient(to top,${config.cor}38,${config.corSecundaria}b8)`,boxShadow:`inset 0 0 18px ${config.corSecundaria}88,0 0 10px ${config.cor}88`}} />)}
      <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-3xl font-display" style={{borderColor:config.corSecundaria,background:`radial-gradient(circle,${config.corSecundaria},${config.cor})`,boxShadow:`0 0 30px 12px ${config.cor}aa`}}>
        <span className="text-white drop-shadow-md">{config.dia}</span>
      </div>
    </div>
    <div className="relative mt-4 text-center">
      <p className="text-2xl font-display text-[#fff8e7]">{config.freq} Hz</p>
      <p className="mt-1 text-xs uppercase tracking-[.2em] text-[#e5c66f]">{config.nome}</p>
    </div>
  </div>;
}

export default function ArcanjoProtocolView({ userProfile, onClose }: ArcanjoProtocolViewProps) {
  const [diaAtual, setDiaAtual] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPreparingAudio, setIsPreparingAudio] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showRoteiro, setShowRoteiro] = useState(false);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const timerRef = useRef<number | null>(null);
  const narrationRunRef = useRef(0);
  const config = DADOS_PROTOCOLO[diaAtual];
  const TOTAL_SECONDS = 10 * 60;
  const progressPercent = Math.min(100, elapsed / TOTAL_SECONDS * 100);
  const etapaAtual = ETAPAS.find(e => elapsed >= e.inicio && elapsed < e.fim) || ETAPAS[ETAPAS.length - 1];

  useEffect(() => {
    const done: number[] = [];
    for (let i = 1; i <= 7; i++) if (localStorage.getItem(`reiki_arcanjo_dia_${i}`) === 'true') done.push(i);
    setCompletedDays(done);
    setDiaAtual([1,2,3,4,5,6,7].find(d => !done.includes(d)) || 1);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); audioEngine.stopSpeech(); };
  }, []);

  const formatTime = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${Math.floor(s%60).toString().padStart(2,'0')}`;
  const stop = () => { narrationRunRef.current += 1; setIsPlaying(false); setIsPreparingAudio(false); if (timerRef.current) window.clearInterval(timerRef.current); timerRef.current = null; audioEngine.stopSpeech(); };
  const complete = () => { localStorage.setItem(`reiki_arcanjo_dia_${diaAtual}`, 'true'); setCompletedDays(p => [...new Set([...p, diaAtual])]); stop(); };
  const start = () => {
    stop(); setElapsed(0); setIsPlaying(true);
    setIsPreparingAudio(true);
    audioEngine.unlock();
    const runId = narrationRunRef.current;
    const chunks = roteiroDoDia(config)
      .split(/(?=\[\d{2}:\d{2})/)
      .map(part => part.replace(/\[[^\]]+\]/g, '').trim())
      .filter(Boolean);
    void audioEngine.playGuidedMeditation(chunks, {
      title: `Proteção e Presença — Dia ${config.dia}`,
      subtitle: `${config.nome} • ${config.freq} Hz`,
      voiceId: userProfile.voiceId || 'Marcus',
      volume: userProfile.voiceVolume ?? 0.9,
      stability: 0.45,
      similarityBoost: 0.75,
      userName: userProfile.name,
      onStart: () => {
        if (runId !== narrationRunRef.current) return;
        setIsPreparingAudio(false);
        setIsPlaying(true);
      },
      onTimeUpdate: (seconds, duration) => {
        if (runId !== narrationRunRef.current) return;
        setElapsed(duration > 0 ? Math.min(TOTAL_SECONDS, seconds / duration * TOTAL_SECONDS) : seconds);
      },
      onEnd: () => { if (runId === narrationRunRef.current) complete(); },
      onError: () => {
        if (runId !== narrationRunRef.current) return;
        setIsPreparingAudio(false);
        setIsPlaying(false);
      }
    });
  };
  const selectDay = (d:number) => { stop(); setElapsed(0); setDiaAtual(d); };

  return <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#031b12] text-[#fff8e7]">
    <div className="fixed inset-0 bg-[linear-gradient(rgba(2,30,20,.80),rgba(1,22,15,.95)),url('/brand/forest-app-background.png')] bg-cover bg-center" />
    <header className="sticky top-0 z-20 border-b border-[#e5c66f]/20 bg-[#032319]/88 px-4 py-4 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <button onClick={onClose} className="p-2 text-[#e5c66f]" aria-label="Voltar"><ChevronLeft size={25}/></button>
        <div className="text-center"><div className="text-xs uppercase tracking-[.22em] text-[#e5c66f]">Protocolo da Transformação</div><h1 className="mt-1 font-display text-lg">Proteção e Presença — São Miguel</h1></div>
        <button onClick={onClose} className="p-2 text-[#e5c66f]" aria-label="Fechar"><X size={23}/></button>
      </div>
    </header>
    <main className="relative z-10 mx-auto w-full max-w-[500px] space-y-5 px-4 py-6 pb-16">
      <section>
        <div className="mb-4 flex items-center justify-center gap-2 text-sm text-[#dce9df]"><ShieldCheck size={18} className="text-[#e5c66f]"/><span>Dia {config.dia} de 7</span><span className="text-[#e5c66f]/60">•</span><span>{config.freq} Hz</span></div>
        <ChakraBody config={config} active={isPlaying}/>
      </section>

      <section className="space-y-5">
        <div className="ep-forest-panel rounded-[1.75rem] p-5 sm:p-7">
          <div className="mb-3 flex items-center justify-between text-sm"><span className="text-[#e5c66f]">{etapaAtual.titulo}</span><span className="font-mono text-[#d9e6dc]">{formatTime(elapsed)} / 10:00</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-black/30"><div className="h-full rounded-full transition-all duration-700" style={{width:`${progressPercent}%`,background:`linear-gradient(90deg,#c69b3d,${config.corSecundaria})`,boxShadow:`0 0 12px ${config.cor}`}}/></div>
          <div className="mt-6 flex items-center justify-center gap-6"><button className="p-2 text-[#d7e2d8]" aria-label="Voltar dez segundos" onClick={()=>audioEngine.seekSpeech(-10)}><RotateCcw/></button><button onClick={()=>isPlaying||isPreparingAudio?stop():start()} className="ep-gold-button flex h-20 w-20 items-center justify-center rounded-full" aria-label={isPreparingAudio?'Preparando voz humana':isPlaying?'Pausar':'Iniciar'}>{isPreparingAudio?<Loader2 size={32} className="animate-spin"/>:isPlaying?<Pause size={34}/>:<Play size={35} className="ml-1"/>}</button><button className="p-2 text-[#d7e2d8]" aria-label="Avançar dez segundos" onClick={()=>audioEngine.seekSpeech(10)}><RotateCw/></button></div>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#bad0c4]"><Volume2 size={17}/><span>{isPreparingAudio?'Preparando voz humana…':'Voz humana e frequência guiada'}</span></div>
        </div>

        <div className="ep-forest-panel rounded-[1.75rem] p-5 sm:p-7">
          <div className="flex items-center gap-2 text-[#e5c66f]"><Leaf size={18}/><span className="text-xs uppercase tracking-[.2em]">Mantra e afirmação</span></div>
          <h2 className="mt-3 font-display text-3xl font-semibold" style={{color:config.corSecundaria}}>{config.nome}</h2>
          <p className="mt-2 text-base text-[#e9f1e9]">{config.subtitulo}</p>
          <p className="mt-4 border-t border-[#e5c66f]/20 pt-4 text-center font-display text-xl italic leading-8 text-[#fff8e7]">Eu acolho meu momento. Eu confio no meu caminho. Eu escolho evoluir.</p>
        </div>

        <div className="ep-forest-panel rounded-[1.75rem] p-5 sm:p-7">
          <div className="text-center"><p className="text-xs uppercase tracking-[.2em] text-[#e5c66f]">Programação energética</p><p className="mt-2 text-base text-[#e9f1e9]">{etapaAtual.assinatura}</p></div>
          <button onClick={()=>setShowRoteiro(!showRoteiro)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e5c66f]/35 px-4 py-3 text-sm text-[#f0d989]"><BookOpen size={17}/>{showRoteiro?'Ocultar meditação':'Ler meditação completa'}</button>
          {showRoteiro&&<div className="mt-4 whitespace-pre-line rounded-2xl bg-black/20 p-5 text-base leading-7 text-[#e6eee8]">{roteiroDoDia(config)}</div>}
        </div>

        <div className="ep-forest-panel rounded-[1.75rem] p-5 sm:p-7"><div className="mb-5 text-center"><h3 className="font-display text-2xl text-[#fff8e7]">Seu progresso</h3><p className="mt-1 text-sm text-[#bad0c4]">Equilíbrio hoje, presença amanhã.</p></div><div className="grid grid-cols-7 gap-2">{[1,2,3,4,5,6,7].map(d=>{const c=DADOS_PROTOCOLO[d];const done=completedDays.includes(d);return <button key={d} onClick={()=>selectDay(d)} aria-label={`Abrir dia ${d}, ${c.nome}`} className={`flex min-w-0 flex-col items-center gap-2 rounded-xl border px-1 py-3 ${diaAtual===d?'border-[#e5c66f] bg-[#e5c66f]/12':'border-[#e5c66f]/15 bg-black/10'}`}><span className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold" style={{background:done||diaAtual===d?c.cor:'#214536',color:'#fff'}}>{done?'✓':d}</span><span className="hidden text-[11px] text-[#c8d8cc] sm:block">{c.nome.replace('Chakra ','')}</span></button>})}</div></div>

        <button className="ep-gold-button flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-semibold" onClick={complete}><Heart size={18}/>Concluir o momento de hoje</button>
        <p className="px-4 text-center text-xs leading-5 text-[#9fb8a9]">Prática espiritual e integrativa. Não substitui cuidados médicos, psicológicos ou outros tratamentos de saúde.</p>
      </section>
    </main>
  </div>;
}
