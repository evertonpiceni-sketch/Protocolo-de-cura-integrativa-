import React, { useEffect, useState } from 'react';
import { Leaf, X, Wind, Sparkles } from 'lucide-react';

const TIPS = [
  "Respire profundamente por 3 segundos, segure por 3, e solte por 3. Sinta a presença antes de iniciar sua jornada de hoje.",
  "Feche os olhos e leve a atenção para o centro do peito. Qual é a intenção que você deseja para o dia de hoje?",
  "Beba um copo de água com consciência antes de começar. A hidratação ajuda na fluidez da energia.",
  "Mindfulness não é não pensar, é perceber o pensamento e deixá-lo ir. Apenas observe sua mente hoje.",
  "Relaxe os ombros, solte o maxilar e permita-se estar 100% presente no aqui e agora. Você está no seu lugar seguro.",
  "Antes de dar play no seu áudio, agradeça por ter tirado esse tempo para se cuidar. A gratidão eleva sua frequência instantaneamente."
];

interface DailyTipModalProps {
  onClose: () => void;
  userName?: string;
}

export default function DailyTipModal({ onClose, userName }: DailyTipModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tip, setTip] = useState(TIPS[0]);

  useEffect(() => {
    // Select random tip
    const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];
    setTip(randomTip);
    setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl max-w-sm w-full relative transform transition-all">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Wind className="text-indigo-400" size={24} />
          </div>
        </div>

        <h3 className="text-lg font-display font-bold text-slate-100 text-center mb-2">
          Pausa para Mindfulness
        </h3>
        
        <p className="text-sm text-slate-300 text-center leading-relaxed mb-6">
          {userName ? `Olá, ${userName.split(' ')[0]}. ` : ''}{tip}
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles size={16} />
          <span>Iniciar Protocolo de Hoje</span>
        </button>
      </div>
    </div>
  );
}
