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
  const layout = typeof document !== 'undefined' ? document.documentElement.dataset.layout : undefined;
  const isMystic = layout === 'mistico-moderno';
  const isElegant = layout === 'elegancia-profunda';

  useEffect(() => {
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
  }, []);

  return (
    <div
      id="daily-tip-modal"
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overscroll-contain p-2 sm:p-4 backdrop-blur-sm animate-fade-in ${isMystic ? 'bg-[#04070D]/75' : isElegant ? 'bg-[#07130F]/72' : 'bg-[#2A2420]/25'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-tip-title"
    >
      <div className={`relative w-full max-w-sm rounded-3xl border p-6 shadow-2xl ${isMystic ? 'border-[#D4AF37]/20 bg-[#101827] text-[#F5F0E6]' : isElegant ? 'border-[#C9A86A]/30 bg-[#10241D] text-[#F4EBDD] shadow-[0_28px_70px_rgba(2,10,7,0.48)]' : 'border-[#E5DAC6] bg-[#FBF8F2]'}`}>
        <div className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl ${isMystic ? 'bg-[#6C3FA0]/15' : isElegant ? 'bg-[#D8BE86]/10' : 'bg-[#B88736]/10'}`} aria-hidden="true" />
        <div className={`pointer-events-none absolute -bottom-10 -left-8 h-36 w-36 rounded-full blur-2xl ${isMystic ? 'bg-[#166552]/10' : isElegant ? 'bg-[#244D3B]/28' : 'bg-[#5E7153]/8'}`} aria-hidden="true" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar dica do dia"
          className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 ${isMystic ? 'border-[#6C3FA0]/30 bg-[#141F30] text-[#C7CFDC] hover:border-[#D4AF37]/35 hover:text-[#F5F0E6] focus-visible:ring-[#D4AF37]/25' : isElegant ? 'border-[#C9A86A]/28 bg-[#173128] text-[#D9CEBC] hover:border-[#D8BE86]/50 hover:text-[#FFF8EB] focus-visible:ring-[#D8BE86]/30' : 'border-[#E5DAC6] bg-[#F5EFE4] text-[#5C5248] hover:bg-[#EFE4D3] hover:text-[#2A2420] focus-visible:ring-[#B88736]/30'}`}
        >
          <X size={18} />
        </button>

        <div className="relative z-10 mb-4 flex justify-center pt-2">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full border ${isMystic ? 'border-[#D4AF37]/25 bg-[#6C3FA0]/15 text-[#E6C66B]' : isElegant ? 'border-[#D8BE86]/32 bg-[#D8BE86]/10 text-[#E6CF9C]' : 'border-[#B88736]/30 bg-[#B88736]/10 text-[#8F631E]'}`}>
            <Wind size={23} />
          </div>
        </div>

        <h2 id="daily-tip-title" className={`relative z-10 mb-2 text-center font-display text-lg font-semibold ${isMystic ? 'text-[#F5F0E6]' : isElegant ? 'text-[#FFF8EB]' : 'text-[#2A2420]'}`}>
          Pausa de presença
        </h2>
        <p className={`relative z-10 mb-6 text-center text-sm leading-relaxed ${isMystic ? 'text-[#C7CFDC]' : isElegant ? 'text-[#D9CEBC]' : 'text-[#5C5248]'}`}>
          {userName ? `Olá, ${userName.split(' ')[0]}. ` : ''}{tip}
        </p>

        <button
          type="button"
          onClick={onClose}
          className={`relative z-10 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 ${isMystic ? 'border border-[#D4AF37]/35 bg-gradient-to-r from-[#B88736] to-[#E6C66B] text-[#0A0F18] shadow-[0_10px_24px_rgba(184,135,54,0.18)] hover:brightness-105 focus-visible:ring-[#D4AF37]/30' : isElegant ? 'border border-[#E2C88F]/45 bg-gradient-to-r from-[#A77A3D] via-[#C6A25E] to-[#E0C78F] text-[#102019] shadow-[0_12px_28px_rgba(2,10,7,0.32)] hover:brightness-105 focus-visible:ring-[#D8BE86]/35' : 'bg-[#B88736] text-white hover:bg-[#8F631E] focus-visible:ring-[#B88736]/35'}`}
        >
          <Sparkles size={16} />
          <span>Continuar minha jornada</span>
        </button>
      </div>
    </div>
  );
}
