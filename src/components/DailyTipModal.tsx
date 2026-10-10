import React, { useEffect, useState } from 'react';
import { X, Wind, Sparkles } from 'lucide-react';

const TIPS = [
  'Respire pelo nariz por 4 segundos, sustente com suavidade por 3 e solte por 5. Perceba o corpo antes de continuar sua jornada de hoje.',
  'Feche os olhos por alguns instantes e leve a atenção para o centro do peito. Qual intenção você deseja cultivar hoje?',
  'Se for confortável para você, beba um copo de água com atenção plena antes de começar e perceba esse pequeno gesto de cuidado.',
  'Mindfulness não exige parar de pensar. Observe o pensamento chegar e passar, retornando gentilmente ao momento presente.',
  'Relaxe os ombros, solte o maxilar e perceba os pontos de apoio do seu corpo. Você não precisa resolver tudo neste instante.',
  'Antes do áudio, reconheça que você separou alguns minutos para si. A gratidão pode ser usada aqui como uma prática de presença.'
];

interface DailyTipModalProps {
  onClose: () => void;
  userName?: string;
}

export default function DailyTipModal({ onClose, userName }: DailyTipModalProps) {
  const [tip, setTip] = useState(TIPS[0]);

  useEffect(() => {
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overscroll-contain bg-[#2A2420]/25 p-2 sm:p-4 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-tip-title"
    >
      <div className="relative w-full max-w-sm rounded-3xl border border-[#E5DAC6] bg-[#FBF8F2] p-6 shadow-2xl">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#B88736]/10 blur-2xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-10 -left-8 h-36 w-36 rounded-full bg-[#5E7153]/8 blur-2xl" aria-hidden="true" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar dica do dia"
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5DAC6] bg-[#F5EFE4] text-[#5C5248] transition hover:bg-[#EFE4D3] hover:text-[#2A2420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
        >
          <X size={18} />
        </button>

        <div className="relative z-10 mb-4 flex justify-center pt-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#B88736]/30 bg-[#B88736]/10 text-[#8F631E]">
            <Wind size={23} />
          </div>
        </div>

        <h2 id="daily-tip-title" className="relative z-10 mb-2 text-center font-display text-lg font-semibold text-[#2A2420]">
          Pausa de presença
        </h2>
        <p className="relative z-10 mb-6 text-center text-sm leading-relaxed text-[#5C5248]">
          {userName ? `Olá, ${userName.split(' ')[0]}. ` : ''}{tip}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="relative z-10 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#B88736] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#8F631E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35"
        >
          <Sparkles size={16} />
          <span>Continuar minha jornada</span>
        </button>
      </div>
    </div>
  );
}
