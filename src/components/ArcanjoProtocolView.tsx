import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { Shield, Sparkles, Volume2, Square, RefreshCw, ClipboardList, Flower2, Clock3, Flame, Sword, HeartPulse } from 'lucide-react';

interface ArcanjoProtocolViewProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

type SfxType = 'sword' | 'fire' | 'bell' | 'wind' | 'water' | 'break' | 'harp' | 'spark' | 'space' | 'gong' | 'choir';

interface ChakraCue {
  at: number;
  label: string;
  text: string;
  sfx?: SfxType;
}

interface ChakraDay {
  nome: string;
  chakra: string;
  local: string;
  foco: string;
  cor: string;
  corNome: string;
  freq: number;
  petalas: number;
  geometria: 'square' | 'moon' | 'triangle' | 'hexagram' | 'throat' | 'ajna' | 'om';
  ambient: string;
  audioFile: string;
  roteiro: string;
  cues: ChakraCue[];
}

const DADOS_CHAKRAS: Record<number, ChakraDay> = {
  1: {
    nome: "Dia 1: Rompendo Laços",
    chakra: "Chakra Básico (Muladhara)", local: "Base da coluna", foco: "Terra, segurança e sobrevivência",
    cor: "#e74c3c",
    corNome: "Vermelho vibrante", freq: 396, petalas: 4, geometria: 'square', ambient: "396 Hz + tambores xamânicos suaves", audioFile: "/audio/audio_day1_396hz.mp3",
    roteiro: "Respire fundo. Direcione sua atenção para a base da sua coluna. Sinta a cor vermelha pulsar.",
    cues: [
      { at: 0, label: "Abertura", text: "Respire fundo. Direcione sua atenção para a base da sua coluna. Sinta a cor vermelha pulsar." },
      { at: 180, label: "Espada de luz", sfx: 'sword', text: "São Miguel Arcanjo corta agora todos os cordões que sugam sua segurança." },
      { at: 300, label: "Chama Violeta", sfx: 'fire', text: "A Chama Violeta transmuta a densidade e o medo da escassez." },
      { at: 480, label: "Raio de Ouro", sfx: 'bell', text: "O Raio de Ouro de São Rafael envolve e sela o seu Chakra Básico." },
      { at: 840, label: "Integração", text: "Permaneça em silêncio, respirando e integrando esta prática." }
    ]
  },
  2: {
    nome: "Dia 2: Cura Física", chakra: "Chakra Sacro (Svadhisthana)", local: "Baixo ventre", foco: "Vitalidade, emoções e criatividade",
    cor: "#f97316", corNome: "Laranja", freq: 417, petalas: 6, geometria: 'moon', ambient: "417 Hz + água mística", audioFile: "/audio/audio_day2_417hz.mp3",
    roteiro: "Visualize o segundo chakra, quatro dedos abaixo do umbigo. Uma roda laranja em movimento suave.",
    cues: [
      { at: 0, label: "Abertura", text: "Visualize o seu segundo chakra, quatro dedos abaixo do umbigo. Uma roda laranja em constante movimento." },
      { at: 240, label: "Limpeza", sfx: 'wind', text: "Imagine as tensões saindo do baixo ventre em forma de fumaça escura." },
      { at: 420, label: "Transmutação", sfx: 'water', text: "A Chama Violeta transmuta essa energia. São Rafael derrama o Raio de Ouro, envolvendo seus órgãos vitais." },
      { at: 840, label: "Integração", text: "Acolha o silêncio e a sensação de fluidez." }
    ]
  },
  3: {
    nome: "Dia 3: Libertação Emocional", chakra: "Chakra Plexo Solar (Manipura)", local: "Boca do estômago", foco: "Poder pessoal, ansiedade e controle",
    cor: "#facc15", corNome: "Amarelo sol", freq: 528, petalas: 10, geometria: 'triangle', ambient: "528 Hz + fogo mágico", audioFile: "/audio/audio_day3_528hz.mp3",
    roteiro: "Foque na boca do estômago. Sinta o vórtice amarelo do Plexo Solar rodar.",
    cues: [
      { at: 0, label: "Abertura", text: "Foque na boca do seu estômago. Sinta o vórtice amarelo do Plexo Solar rodar." },
      { at: 210, label: "Rompimento", sfx: 'break', text: "São Miguel quebra as armaduras emocionais construídas pelo medo de ser ferido." },
      { at: 360, label: "Chama Violeta", sfx: 'fire', text: "A fogueira Violeta transmuta a ansiedade guardada no estômago." },
      { at: 540, label: "Raio de Ouro", sfx: 'harp', text: "São Rafael derrama o ouro da paz interior e da autoconfiança." },
      { at: 840, label: "Integração", text: "Permaneça com a respiração e o seu poder pessoal." }
    ]
  },
  4: {
    nome: "Dia 4: Cura dos Relacionamentos", chakra: "Chakra Cardíaco (Anahata)", local: "Centro do peito", foco: "Amor, compaixão e perdão",
    cor: "#10b981", corNome: "Verde esmeralda e rosa", freq: 639, petalas: 12, geometria: 'hexagram', ambient: "639 Hz + sinos tibetanos", audioFile: "/audio/audio_day4_639hz.mp3",
    roteiro: "Sinta o peito expandir. O chakra do coração gira em verde e rosa, emanando amor.",
    cues: [
      { at: 0, label: "Abertura", text: "Sinta o seu peito expandir. O chakra do coração gira em verde e rosa, emanando amor." },
      { at: 240, label: "Liberação", sfx: 'wind', text: "Deixe ir a mágoa. Exale a dor da rejeição e abra espaço para o acolhimento." },
      { at: 420, label: "Cicatrização", sfx: 'bell', text: "O Reiki e a Chama Violeta envolvem o hexagrama do seu peito. O Raio de Ouro de São Rafael acolhe as feridas do passado." },
      { at: 840, label: "Perdão", text: "Permaneça na frequência do perdão e do amor por si." }
    ]
  },
  5: {
    nome: "Dia 5: Expressão e Caminhos", chakra: "Chakra Laríngeo (Vishuddha)", local: "Garganta", foco: "Comunicação, expressão e verdade",
    cor: "#38bdf8", corNome: "Azul celeste", freq: 741, petalas: 16, geometria: 'throat', ambient: "741 Hz + centelhas suaves", audioFile: "/audio/audio_day5_741hz.mp3",
    roteiro: "Leve a consciência à garganta. Um vórtice azul-celeste de 16 pétalas gira purificando sua voz.",
    cues: [
      { at: 0, label: "Abertura", text: "Leve a consciência à sua garganta. Um vórtice azul-celeste de 16 pétalas gira purificando sua voz." },
      { at: 210, label: "Libertação", sfx: 'sword', text: "São Miguel remove os nós na garganta, os silêncios forçados e as palavras não ditas." },
      { at: 360, label: "Abertura", sfx: 'spark', text: "A Chama Violeta limpa crenças de não merecimento. O Raio de Ouro ilumina novos caminhos." },
      { at: 840, label: "Integração", text: "Respire na sua verdade com serenidade." }
    ]
  },
  6: {
    nome: "Dia 6: Clareza Mental", chakra: "Chakra Frontal (Ajna)", local: "Entre as sobrancelhas", foco: "Intuição, mente e sabedoria espiritual",
    cor: "#4338ca", corNome: "Azul índigo", freq: 852, petalas: 2, geometria: 'ajna', ambient: "852 Hz + atmosfera espacial", audioFile: "/audio/audio_day6_852hz.mp3",
    roteiro: "Silencie o mundo externo. Entre as sobrancelhas, o terceiro olho se abre em azul índigo.",
    cues: [
      { at: 0, label: "Abertura", text: "Silencie o mundo externo. Entre as suas sobrancelhas, o terceiro olho se abre em azul índigo." },
      { at: 240, label: "Silêncio mental", sfx: 'space', text: "A densidade dos pensamentos repetitivos e da ilusão se dissolve no ar." },
      { at: 420, label: "Clareza", sfx: 'spark', text: "São Rafael ativa o Raio de Ouro no centro do triângulo. Sua intuição se torna clara e serena." },
      { at: 840, label: "Integração", text: "Descanse na quietude e observe sem julgamento." }
    ]
  },
  7: {
    nome: "Dia 7: Conexão e Selamento", chakra: "Chakra Coronário (Sahasrara)", local: "Topo da cabeça", foco: "Conexão com o Divino e integração",
    cor: "#c084fc", corNome: "Violeta claro e branco dourado", freq: 963, petalas: 1000, geometria: 'om', ambient: "963 Hz + coro etéreo", audioFile: "/audio/audio_day7_963hz.mp3",
    roteiro: "O topo da sua cabeça se abre para o cosmos. O lótus de mil pétalas desabrocha em luz violeta e dourada.",
    cues: [
      { at: 0, label: "Abertura", text: "O topo da sua cabeça se abre para o cosmos. O lótus de mil pétalas desabrocha em luz violeta e dourada." },
      { at: 240, label: "Alinhamento", sfx: 'gong', text: "Todo o canal de energia do seu corpo, do básico ao coronário, é envolvido por uma luz límpida e serena." },
      { at: 420, label: "Selamento", sfx: 'choir', text: "São Miguel sela sua aura em azul-turquesa. São Rafael envolve você em ouro. O Reiki brilha em Violeta. Você é um canal de luz." },
      { at: 840, label: "Encerramento", sfx: 'bell', text: "Integre os sete centros em silêncio. Ao final, retorne devagar ao momento presente." }
    ]
  }
};

function YantraLotus({ day, active }: { day: ChakraDay; active: boolean }) {
  const petalCount = day.petalas === 1000 ? 72 : day.petalas;
  const petals = Array.from({ length: petalCount });
  return (
    <div className={`yantra-breath ${active ? 'yantra-breath--active' : ''}`} style={{ color: day.cor }} aria-label={`Yantra de ${day.chakra}, lótus de ${day.petalas} pétalas`}>
      <svg viewBox="0 0 240 240" role="img" className="h-full w-full overflow-visible">
        <defs><radialGradient id="yantraGlow"><stop offset="0" stopColor="currentColor" stopOpacity=".5"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient></defs>
        <circle cx="120" cy="120" r="112" fill="url(#yantraGlow)" opacity=".45" />
        <g className="yantra-rotate" style={{ transformOrigin: '120px 120px' }}>
          {petals.map((_, index) => <ellipse key={index} cx="120" cy="45" rx={day.petalas === 1000 ? 3 : 13} ry={day.petalas === 1000 ? 26 : 34} fill="currentColor" fillOpacity={day.petalas === 1000 ? .32 : .24} stroke="currentColor" strokeWidth="1.4" transform={`rotate(${index * (360 / petalCount)} 120 120)`} />)}
          <circle cx="120" cy="120" r="62" fill="#020617" fillOpacity=".78" stroke="currentColor" strokeWidth="2" />
          {day.geometria === 'square' && <rect x="82" y="82" width="76" height="76" fill="#facc15" fillOpacity=".45" stroke="#fde047" strokeWidth="3" />}
          {day.geometria === 'moon' && <><circle cx="120" cy="120" r="36" fill="#e2e8f0" fillOpacity=".8"/><circle cx="136" cy="106" r="35" fill="#020617"/></>}
          {day.geometria === 'triangle' && <><polygon points="120,166 74,88 166,88" fill="#ef4444" fillOpacity=".45" stroke="#f87171" strokeWidth="3"/><text x="73" y="91" fill="#fde68a" fontSize="13">卐</text><text x="158" y="91" fill="#fde68a" fontSize="13">卐</text><text x="115" y="168" fill="#fde68a" fontSize="13">卐</text></>}
          {day.geometria === 'hexagram' && <><polygon points="120,73 164,149 76,149" fill="none" stroke="#d1d5db" strokeWidth="3"/><polygon points="120,167 76,91 164,91" fill="none" stroke="#d1d5db" strokeWidth="3"/></>}
          {day.geometria === 'throat' && <><polygon points="120,160 82,94 158,94" fill="none" stroke="#f8fafc" strokeWidth="3"/><circle cx="120" cy="119" r="19" fill="#cbd5e1" fillOpacity=".55" stroke="#fff"/></>}
          {day.geometria === 'ajna' && <><circle cx="120" cy="120" r="35" fill="#facc15" fillOpacity=".28" stroke="#fde047" strokeWidth="3"/><polygon points="120,158 86,99 154,99" fill="#312e81" stroke="#a5b4fc" strokeWidth="3"/></>}
          {day.geometria === 'om' && <text x="120" y="142" textAnchor="middle" fill="#fff7cc" fontSize="67" fontFamily="serif">ॐ</text>}
        </g>
      </svg>
    </div>
  );
}

export default function ArcanjoProtocolView({ userProfile, onLogout }: ArcanjoProtocolViewProps) {
  const [activeTab, setActiveTab] = useState<'jornada' | 'anamnese'>('jornada');
  const [diaAtual, setDiaAtual] = useState<number>(1);
  const [isPulsing, setIsPulsing] = useState<boolean>(false);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeCue, setActiveCue] = useState<ChakraCue | null>(null);
  
  // Anamnesis state
  const [pacienteNome, setPacienteNome] = useState(userProfile.name);
  const [sintoma, setSintoma] = useState('ansiedade');
  const [prescricao, setPrescricao] = useState<any>(null);

  // Audio Context
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const cueTimersRef = useRef<number[]>([]);
  const sessionStartedAtRef = useRef<number | null>(null);

  useEffect(() => {
    // Load completed days from local storage
    const completed = [];
    for (let i = 1; i <= 7; i++) {
      if (localStorage.getItem(`reiki_arcanjo_dia_${i}`)) {
        completed.push(i);
      }
    }
    setCompletedDays(completed);

    // Initial select
    const firstUncompleted = [1,2,3,4,5,6,7].find(d => !completed.includes(d)) || 1;
    setDiaAtual(firstUncompleted);

    return () => {
      pararSessao();
    };
  }, []);

  const iniciarSom = (freq: number) => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
    }
    const AudioContextClass = AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;
    
    const osc = ctx.createOscillator();
    oscRef.current = osc;
    const gain = ctx.createGain();

    osc.frequency.value = freq;
    gain.gain.value = 0.025;

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
  };

  const pararSom = () => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (oscRef.current) {
      oscRef.current = null;
    }
  };

  const falar = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.82;
    utterance.pitch = 0.96;
    window.speechSynthesis.speak(utterance);
  };

  const tocarSfx = (type?: SfxType) => {
    const ctx = audioCtxRef.current;
    if (!ctx || !type) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const frequencies: Record<SfxType, [number, number]> = {
      sword: [1400, 180], fire: [180, 90], bell: [1200, 720], wind: [520, 120], water: [420, 260],
      break: [900, 120], harp: [880, 440], spark: [1600, 600], space: [320, 90], gong: [180, 55], choir: [520, 390]
    };
    const [start, end] = frequencies[type];
    osc.type = type === 'fire' || type === 'wind' ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(start, now);
    osc.frequency.exponentialRampToValueAtTime(end, now + 1.6);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
    osc.connect(gain); gain.connect(ctx.destination); osc.start(now); osc.stop(now + 1.9);
  };

  const iniciarSessao = () => {
    pararSessao();
    const config = DADOS_CHAKRAS[diaAtual];

    iniciarSom(config.freq);
    setIsPulsing(true);
    setElapsedSeconds(0);
    sessionStartedAtRef.current = Date.now();
    timerRef.current = window.setInterval(() => {
      const startedAt = sessionStartedAtRef.current;
      if (!startedAt) return;
      const elapsed = Math.min(900, Math.floor((Date.now() - startedAt) / 1000));
      setElapsedSeconds(elapsed);
      if (elapsed >= 900) {
        marcarConcluido(diaAtual);
        pararSessao();
      }
    }, 1000);
    config.cues.forEach(cue => {
      const id = window.setTimeout(() => {
        setActiveCue(cue);
        tocarSfx(cue.sfx);
        falar(cue.text);
      }, cue.at * 1000);
      cueTimersRef.current.push(id);
    });
  };

  const pararSessao = () => {
    pararSom();
    setIsPulsing(false);
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
    cueTimersRef.current.forEach(id => window.clearTimeout(id));
    cueTimersRef.current = [];
    sessionStartedAtRef.current = null;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const marcarConcluido = (d: number) => {
    localStorage.setItem(`reiki_arcanjo_dia_${d}`, 'true');
    setCompletedDays(prev => Array.from(new Set([...prev, d])));
  };

  const reiniciarProgresso = () => {
    if (window.confirm('Deseja reiniciar a contagem dos 7 dias?')) {
      for (let i = 1; i <= 7; i++) {
        localStorage.removeItem(`reiki_arcanjo_dia_${i}`);
      }
      setCompletedDays([]);
      setDiaAtual(1);
    }
  };

  const gerarPrescricao = () => {
    let receita = { floral: '', aroma: '', indicacao: '' };
    switch(sintoma) {
      case 'ansiedade':
        receita.floral = 'Rescue Remedy + White Chestnut';
        receita.aroma = 'Óleo Essencial de Lavanda (Difusão noturna)';
        receita.indicacao = 'Acalmar pensamentos e trabalhar os Chakras Frontal e Coronário.';
        break;
      case 'cansaco':
        receita.floral = 'Olive + Hornbeam';
        receita.aroma = 'Óleo Essencial de Alecrim (Uso matinal)';
        receita.indicacao = 'Restaurar a força física nos Chakras Básico e Plexo Solar.';
        break;
      case 'bloqueio_emocional':
        receita.floral = 'Holly + Star of Bethlehem';
        receita.aroma = 'Óleo Essencial de Gerânio ou Rosa';
        receita.indicacao = 'Abertura afetiva e restauração do Chakra Cardíaco.';
        break;
      case 'comunicacao':
        receita.floral = 'Larch + Agrimony';
        receita.aroma = 'Óleo Essencial de Hortelã-Pimenta';
        receita.indicacao = 'Desbloqueio da expressão no Chakra Laríngeo.';
        break;
      case 'criatividade':
        receita.floral = 'Wild Oat + Scleranthus';
        receita.aroma = 'Óleo Essencial de Ylang-Ylang ou Laranja Doce';
        receita.indicacao = 'Estímulo da energia vital do Chakra Sacral.';
        break;
    }
    setPrescricao(receita);
  };

  const config = DADOS_CHAKRAS[diaAtual];
  const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-200">Protocolo de Cura São Miguel</h1>
              <p className="text-xs text-slate-400">Raio de Ouro e Chama Violeta</p>
            </div>
          </div>
          <button onClick={onLogout} className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition">
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto p-4 py-8">
        
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('jornada')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
              activeTab === 'jornada' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Tratamento de 7 Dias
          </button>
          <button
            onClick={() => setActiveTab('anamnese')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
              activeTab === 'anamnese' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Anamnese & Prescrição
          </button>
        </div>

        {activeTab === 'jornada' && (
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest text-center">Selecione o Dia de Aplicação</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
              {[1,2,3,4,5,6,7].map(d => {
                const isSelected = diaAtual === d;
                const isCompleted = completedDays.includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => {
                      pararSessao();
                      setDiaAtual(d);
                    }}
                    className={`py-3 rounded-xl border-2 text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                      isSelected ? 'border-violet-500 bg-violet-500/10 text-violet-300' :
                      isCompleted ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' :
                      'border-slate-800 bg-slate-950 text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    {isCompleted ? <Flower2 size={16} className="text-emerald-400 drop-shadow-sm animate-pulse" /> : <Flower2 size={16} className="opacity-30" />}
                    <span>Dia {d}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 mt-6 relative overflow-hidden text-center shadow-2xl">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${config.cor}, transparent 70%)` }} />
              
              <div className="relative z-10 flex flex-wrap justify-center gap-2 mb-3">
                <span className="rounded-full border px-3 py-1 text-xs font-semibold" style={{ color: config.cor, borderColor: `${config.cor}66`, backgroundColor: `${config.cor}16` }}>{config.freq} Hz</span>
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">São Miguel • São Rafael • Chama Violeta</span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 relative z-10">{config.nome}</h3>
              <p className="text-base font-semibold mt-2 relative z-10" style={{ color: config.cor }}>{config.chakra}</p>
              <p className="text-sm text-slate-400 mt-1 relative z-10">{config.local} • {config.foco}</p>

              <div className="h-64 flex items-center justify-center my-6 relative z-10">
                <YantraLotus day={config} active={isPulsing} />
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-3 mb-5 text-left">
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3"><span className="block text-xs text-slate-500">Identidade visual</span><strong className="text-sm text-slate-200">{config.corNome} • {config.petalas} pétalas</strong></div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3"><span className="block text-xs text-slate-500">Paisagem sonora</span><strong className="text-sm text-slate-200">{config.ambient}</strong></div>
              </div>

              {isPulsing && (
                <div className="relative z-10 mb-5 rounded-2xl border border-violet-400/30 bg-violet-950/40 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-violet-200"><Clock3 size={16}/> Respiração 4–4–4–4</span><strong>{formatTime(elapsedSeconds)} / 15:00</strong></div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-amber-300 to-emerald-400 transition-all" style={{ width: `${(elapsedSeconds / 900) * 100}%` }} /></div>
                  <p className="mt-3 text-sm text-slate-200">{activeCue?.text || config.roteiro}</p>
                </div>
              )}

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 leading-relaxed mb-6 relative z-10 italic">
                “{config.roteiro}”
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
                <button
                  onClick={iniciarSessao}
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-violet-500/20"
                >
                  <Volume2 size={18} />
                  Iniciar meditação de 15 minutos
                </button>
                <button
                  onClick={pararSessao}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition"
                >
                  <Square size={18} />
                  Parar Áudio
                </button>
              </div>

              <div className="relative z-10 mt-6 text-left">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">Roteiro e efeitos</h4>
                <div className="space-y-2">
                  {config.cues.map(cue => (
                    <div key={`${diaAtual}-${cue.at}`} className="flex gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                      <span className="shrink-0 font-mono text-xs font-bold" style={{ color: config.cor }}>{formatTime(cue.at)}</span>
                      <div><strong className="block text-sm text-slate-200">{cue.label}</strong><p className="mt-1 text-sm leading-relaxed text-slate-400">{cue.text}</p></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-5 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-left text-xs leading-relaxed text-slate-400">
                <HeartPulse size={16} className="mt-0.5 shrink-0 text-amber-300" />
                Prática integrativa de meditação e bem-estar. Não substitui diagnóstico, tratamento ou acompanhamento médico, psicológico ou psiquiátrico.
              </div>
            </div>

            <button
              onClick={reiniciarProgresso}
              className="w-full py-4 text-slate-500 hover:text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <RefreshCw size={14} />
              Reiniciar Progresso dos 7 Dias
            </button>
          </div>
        )}

        {activeTab === 'anamnese' && (
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <ClipboardList className="text-violet-400" />
              <div>
                <h2 className="text-lg font-bold text-slate-200">Anamnese do Paciente</h2>
                <p className="text-xs text-slate-400 mt-1">Avaliação prévia para indicação de Florais de Bach e Aromaterapia.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nome do Paciente</label>
                <input
                  type="text"
                  value={pacienteNome}
                  onChange={e => setPacienteNome(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-violet-500 transition"
                  placeholder="Seu nome completo..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Sintoma / Desequilíbrio Dominante</label>
                <select
                  value={sintoma}
                  onChange={e => setSintoma(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-violet-500 transition"
                >
                  <option value="ansiedade">Ansiedade e Mente Acelerada (Chakra Frontal/Coronário)</option>
                  <option value="cansaco">Cansaço Físico e Desânimo (Chakra Básico/Plexo)</option>
                  <option value="bloqueio_emocional">Mágoas e Bloqueio Afetivo (Chakra Cardíaco)</option>
                  <option value="comunicacao">Dificuldade de Expressão e Comunicação (Chakra Laríngeo)</option>
                  <option value="criatividade">Falta de Criatividade e Libido (Chakra Sacral)</option>
                </select>
              </div>

              <button
                onClick={gerarPrescricao}
                className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-violet-500/20 transition mt-2"
              >
                Gerar Prescrição Integrativa
              </button>

              {prescricao && (
                <div className="mt-6 p-6 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                  <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                    <Sparkles size={16} />
                    Prescrição Terapêutica (7 Dias)
                  </h3>
                  <div className="space-y-3 text-sm text-slate-300">
                    <p><strong className="text-slate-200">Paciente:</strong> {pacienteNome}</p>
                    <p><strong className="text-slate-200">Floral Recomendado:</strong> {prescricao.floral}</p>
                    <p><strong className="text-slate-200">Aromaterapia Recomendada:</strong> {prescricao.aroma}</p>
                    <p><strong className="text-slate-200">Foco Terapêutico:</strong> {prescricao.indicacao}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-emerald-500/20 text-[11px] text-emerald-400/80 leading-relaxed italic">
                    "Nota Terapêutica: O Protocolo de Cura Integrada e as sugestões de Florais de Bach e Óleos Essenciais atuam como práticas integrativas e tratamentos complementares. Eles não substituem, sob nenhuma hipótese, o diagnóstico, tratamento ou acompanhamento médico, psiquiátrico ou psicológico tradicional. Mantenha seus tratamentos de saúde ativos."
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
