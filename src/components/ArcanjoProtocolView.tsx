import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { Shield, Sparkles, Volume2, Square, RefreshCw, ClipboardList } from 'lucide-react';

interface ArcanjoProtocolViewProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

const DADOS_CHAKRAS: Record<number, any> = {
  1: {
    nome: "Dia 1: Chakra Básico (Muladhara)",
    cor: "#e74c3c",
    freq: 396,
    info: "Frequência: 396 Hz • Cor: Vermelho • Foco: Segurança e Ancoramento",
    roteiro: "Dia 1. Ativando o Chakra Básico. Posicione suas mãos na base da coluna. Sinta a luz vermelha pulsando. A energia Reiki flui eliminando inseguranças, medos e estabilizando sua presença física na Terra. Sinta-se seguro e ancorado."
  },
  2: {
    nome: "Dia 2: Chakra Sacral (Svadhisthana)",
    cor: "#e67e22",
    freq: 417,
    info: "Frequência: 417 Hz • Cor: Laranja • Foco: Emoções e Criatividade",
    roteiro: "Dia 2. Ativando o Chakra Sacral. Posicione suas mãos abaixo do umbigo. Uma luz laranja vibrante limpa bloqueios emocionais, liberando sua criatividade, fluidez e alegria interior."
  },
  3: {
    nome: "Dia 3: Chakra Plexo Solar (Manipura)",
    cor: "#f1c40f",
    freq: 528,
    info: "Frequência: 528 Hz • Cor: Amarelo • Foco: Poder Pessoal e Autoestima",
    roteiro: "Dia 3. Ativando o Chakra Plexo Solar. Mãos na região do estômago. A luz amarela dourada expande sua autoconfiança, coragem e determinação. Toda a ansiedade se dissolve na luz do Reiki."
  },
  4: {
    nome: "Dia 4: Chakra Cardíaco (Anahata)",
    cor: "#2ecc71",
    freq: 639,
    info: "Frequência: 639 Hz • Cor: Verde • Foco: Amor Incondicional e Cura",
    roteiro: "Dia 4. Ativando o Chakra Cardíaco. Mãos no centro do peito. Sinta o brilho verde-esmeralda abrindo seu coração para o amor, o perdão e a harmonização de todos os seus relacionamentos."
  },
  5: {
    nome: "Dia 5: Chakra Laríngeo (Vishuddha)",
    cor: "#3498db",
    freq: 741,
    info: "Frequência: 741 Hz • Cor: Azul Claro • Foco: Comunicação e Verdade",
    roteiro: "Dia 5. Ativando o Chakra Laríngeo. Mãos sobre a garganta. A luz azul-celeste purifica sua expressão verbal, permitindo que sua verdade seja dita com clareza, sabedoria e amor."
  },
  6: {
    nome: "Dia 6: Chakra Frontal (Ajna)",
    cor: "#34495e",
    freq: 852,
    info: "Frequência: 852 Hz • Cor: Azul Índigo • Foco: Intuição e Clarividência",
    roteiro: "Dia 6. Ativando o Chakra Frontal. Mãos na testa, entre as sobrancelhas. Uma luz azul-índigo desperta sua intuição, clareza mental e percepção espiritual superior."
  },
  7: {
    nome: "Dia 7: Chakra Coronário (Sahasrara)",
    cor: "#9b59b6",
    freq: 963,
    info: "Frequência: 963 Hz • Cor: Violeta / Dourado • Foco: Conexão Divina",
    roteiro: "Dia 7. Ativando o Chakra Coronário. Mãos no topo da cabeça. A luz violeta e dourada conecta seu ser com a Fonte Criadora Unipresente. O ciclo de 7 dias de cura está selado e integrado."
  }
};

export default function ArcanjoProtocolView({ userProfile, onLogout }: ArcanjoProtocolViewProps) {
  const [activeTab, setActiveTab] = useState<'jornada' | 'anamnese'>('jornada');
  const [diaAtual, setDiaAtual] = useState<number>(1);
  const [isPulsing, setIsPulsing] = useState<boolean>(false);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  
  // Anamnesis state
  const [pacienteNome, setPacienteNome] = useState(userProfile.name);
  const [sintoma, setSintoma] = useState('ansiedade');
  const [prescricao, setPrescricao] = useState<any>(null);

  // Audio Context
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

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
    gain.gain.value = 0.15;

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

  const iniciarSessao = () => {
    pararSessao();
    const config = DADOS_CHAKRAS[diaAtual];

    iniciarSom(config.freq);
    setIsPulsing(true);

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(config.roteiro);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.85;

      utterance.onend = () => {
        pararSom();
        setIsPulsing(false);
        marcarConcluido(diaAtual);
      };
      
      utterance.onerror = () => {
        pararSom();
        setIsPulsing(false);
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const pararSessao = () => {
    pararSom();
    setIsPulsing(false);
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
                    <span>Dia {d}</span>
                    {isCompleted && <Sparkles size={12} className="text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 mt-6 relative overflow-hidden text-center shadow-2xl">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${config.cor}, transparent 70%)` }} />
              
              <h3 className="text-lg font-bold text-slate-100 relative z-10">{config.nome}</h3>
              <p className="text-sm text-slate-400 mt-2 relative z-10">{config.info}</p>

              <div className="h-40 flex items-center justify-center my-8 relative z-10">
                <div 
                  className={`w-24 h-24 rounded-full shadow-[0_0_40px_currentColor] transition-all duration-700 ${isPulsing ? 'animate-pulse scale-110' : ''}`}
                  style={{ backgroundColor: config.cor, color: config.cor }}
                />
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 leading-relaxed mb-6 relative z-10 italic">
                "{config.roteiro}"
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
                <button
                  onClick={iniciarSessao}
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-violet-500/20"
                >
                  <Volume2 size={18} />
                  Iniciar Transmissão
                </button>
                <button
                  onClick={pararSessao}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition"
                >
                  <Square size={18} />
                  Parar Áudio
                </button>
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
