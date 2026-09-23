import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Feather } from 'lucide-react';
import { ProtocolStage, StageContent } from '../../types';
import { ORIGINAL_PROTOCOL_SCRIPTS } from '../../data/protocol_scripts';

interface SecondaryScriptDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stages: StageContent[];
  currentStageId: ProtocolStage;
  userName: string;
}

export const SecondaryScriptDrawer: React.FC<SecondaryScriptDrawerProps> = ({
  isOpen,
  onClose,
  stages,
  currentStageId,
  userName
}) => {
  const displayName = userName?.trim() ? userName.trim() : 'Filho da Luz';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#2A2420]/40 backdrop-blur-xs"
          />

          {/* Drawer Body - Warm Ivory & Soft Gold Palette */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative z-10 w-full max-w-xl bg-[#FAF7F2] border-l border-[#E5DAC6] shadow-2xl flex flex-col h-full text-[#2A2420]"
          >
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-[#E5DAC6] flex items-center justify-between bg-[#F4EFE6]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAF4E8] border border-[#B88736]/30 flex items-center justify-center text-[#8F631E]">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#2A2420] font-medium">
                    Roteiro Canônico de Cura
                  </h3>
                  <p className="text-xs text-[#5C5248]">
                    Textos, decretos e canalizações sagradas
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-[#E5DAC6] hover:border-[#8F631E] flex items-center justify-center text-[#5C5248] hover:text-[#2A2420] transition-colors"
                aria-label="Fechar roteiro"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div className="p-4 rounded-xl bg-[#F4EFE6] border border-[#E5DAC6] text-xs text-[#5C5248] leading-relaxed">
                Este roteiro é mantido sob demanda para leitura reflexiva. Durante a sessão, permita-se apenas ouvir e respirar.
              </div>

              {stages.map((stg, index) => {
                const isCurrent = stg.id === currentStageId;
                const scriptData = ORIGINAL_PROTOCOL_SCRIPTS[stg.id];
                const cleanScriptText = (scriptData.text || '')
                  .replace(/\{userName\}/g, displayName)
                  .replace(/\[NOME\]/g, displayName);

                return (
                  <div
                    key={stg.id}
                    className={`rounded-2xl border p-5 transition-all duration-200 ${
                      isCurrent
                        ? 'bg-white border-[#8F631E] shadow-[0_4px_20px_rgba(143,99,30,0.08)] ring-1 ring-[#8F631E]/30'
                        : 'bg-white/80 border-[#E5DAC6] hover:border-[#8F631E]/40'
                    }`}
                  >
                    {/* Stage Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full text-[11px] font-mono flex items-center justify-center font-medium ${
                            isCurrent
                              ? 'bg-[#8F631E] text-white'
                              : 'bg-[#E5DAC6]/60 text-[#5C5248]'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <h4 className="font-serif text-base text-[#2A2420] font-medium">
                          {stg.title}
                        </h4>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#8F631E] bg-[#FAF4E8] px-2 py-0.5 rounded-full border border-[#B88736]/30 font-semibold">
                          Em Execução
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#5C5248] mb-3 font-serif italic">
                      {stg.subtitle}
                    </p>

                    {/* Symbols or Mantras if available */}
                    {scriptData.symbols && scriptData.symbols.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {scriptData.symbols.map((sym, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F4EFE6] text-[#8F631E] border border-[#E5DAC6]"
                          >
                            ✦ {sym}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Canonical Text */}
                    <div className="text-sm font-serif text-[#3E3832] leading-relaxed whitespace-pre-line bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DAC6]">
                      {cleanScriptText}
                    </div>

                    {/* Mantra / Decree Highlight */}
                    {scriptData.mantra && (
                      <div className="mt-3 p-3 rounded-xl bg-[#FAF4E8] border border-[#B88736]/25 flex items-start gap-2 text-xs font-serif text-[#8F631E]">
                        <Feather size={14} className="mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold uppercase tracking-wider text-[10px] mb-0.5">
                            Mantra / Chave de Fixação
                          </p>
                          <p className="italic text-[#2A2420]">“{scriptData.mantra}”</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-[#E5DAC6] bg-[#F4EFE6] flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#8F631E] text-white text-xs font-medium hover:bg-[#7A5318] transition-colors"
              >
                Fechar e Continuar Sessão
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
