import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ProtocolAcceptancePortalProps {
  userName: string;
  onAccept: () => void;
  onBack: () => void;
}

export const ProtocolAcceptancePortal: React.FC<ProtocolAcceptancePortalProps> = ({
  userName,
  onAccept,
  onBack
}) => {
  const displayName = userName?.trim() ? userName.trim() : 'Buscador de Luz';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 max-w-xl mx-auto w-full px-5 py-8 my-auto"
    >
      {/* Sacred Portal Card */}
      <div className="relative rounded-3xl p-8 sm:p-10 border border-[#d4af37]/30 bg-gradient-to-b from-[#0a261c]/90 via-[#061410]/95 to-[#04100c] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.08)] backdrop-blur-xl overflow-hidden text-center">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#d4af37]/15 blur-3xl pointer-events-none rounded-full" />
        
        {/* Subtle Decorative Emblem */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/35 flex items-center justify-center text-[#e6ca65] mb-6 shadow-[0_0_25px_rgba(212,175,55,0.2)]">
          <Sparkles size={28} className="animate-pulse" />
        </div>

        {/* Portal Headers */}
        <p className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-serif font-medium mb-2">
          Portal de Entrada Energético
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#f4f1ea] font-normal tracking-wide mb-6">
          Decreto de Abertura e Permissão
        </h2>

        {/* Sacred Declaration Typography */}
        <div className="relative py-6 px-6 sm:px-8 my-4 rounded-2xl bg-[#061410]/60 border border-[#8ca89a]/20 text-left">
          <div className="absolute top-2 left-4 text-4xl font-serif text-[#d4af37]/20 select-none leading-none">“</div>
          <p className="text-base sm:text-lg font-serif italic text-[#e8e3d5] leading-relaxed relative z-10 pt-2 pb-1">
            Eu, <span className="font-semibold text-[#f4f1ea] not-italic border-b border-[#d4af37]/40 pb-0.5">{displayName}</span>, aceito receber nesse momento com todo o meu coração, o <span className="text-[#e6ca65] not-italic font-medium">Protocolo de Cura Integrada de 21 dias</span>, conforme canalizado e aplicado por <span className="text-[#f4f1ea] not-italic font-medium">Éverton Rodrigo Piceni</span>.
          </p>
          <div className="absolute bottom-1 right-4 text-4xl font-serif text-[#d4af37]/20 select-none leading-none">”</div>
        </div>

        <p className="text-xs text-[#8ca89a] leading-relaxed my-5 max-w-md mx-auto">
          Ao declarar a sua permissão consciente, as frequências quânticas e sutis do campo são autorizadas a atuar no seu alinhamento com acolhimento e respeito ao seu livre-arbítrio.
        </p>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#8ca89a]/25 text-[#8ca89a] hover:text-[#f4f1ea] hover:bg-[#8ca89a]/10 text-sm font-medium transition-all duration-200"
          >
            Retornar
          </button>
          
          <button
            onClick={onAccept}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#c5a059] via-[#d4af37] to-[#e6ca65] text-[#061410] text-sm font-semibold tracking-wide shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>Aceitar e Adentrar o Espaço Sagrado</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </motion.div>
  );
};
