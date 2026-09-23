import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { ORIGINAL_PROTOCOL_SCRIPTS } from '../../data/protocol_scripts';
import { PROTOCOL_STAGES, ProtocolStage } from '../../types';

interface SecondaryScriptDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeStageId?: string;
  userName: string;
  onSelectStage?: (stageIndex: number) => void;
}

export const SecondaryScriptDrawer: React.FC<SecondaryScriptDrawerProps> = ({
  isOpen,
  onClose,
  activeStageId,
  userName,
  onSelectStage
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-xl bg-gradient-to-b from-[#0a261c] via-[#061410] to-[#04100c] border-l border-[#d4af37]/25 shadow-2xl flex flex-col h-full text-[#f4f1ea]"
          >
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-[#8ca89a]/15 flex items-center justify-between bg-[#061410]/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#e6ca65]">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#f4f1ea] font-medium leading-none">
                    Roteiro Canônico Completo
                  </h3>
                  <p className="text-xs text-[#8ca89a] mt-1 font-sans">
                    Canalizado por Éverton Rodrigo Piceni
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#8ca89a] hover:text-[#f4f1ea] hover:bg-[#8ca89a]/10 transition-colors"
                aria-label="Fechar roteiro"
              >
                <X size={20} />
              </button>
            </div>

            {/* Script Chapters Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div className="p-4 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/20 text-xs text-[#e8e3d5] leading-relaxed flex items-start gap-3">
                <Sparkles size={18} className="text-[#d4af37] shrink-0 mt-0.5" />
                <span>
                  Este roteiro contém as 6 etapas completas com todas as invocações, frequências sutis e decretos sagrados de cada fase. Você pode acompanhar a leitura em seu próprio ritmo.
                </span>
              </div>

              {PROTOCOL_STAGES.map((stage, idx) => {
                const stageKey = stage.id as keyof typeof ORIGINAL_PROTOCOL_SCRIPTS;
                const canonical = ORIGINAL_PROTOCOL_SCRIPTS[stageKey];
                const isActive = stage.id === activeStageId;
                const title = canonical?.title || stage.title;
                const subtitle = canonical?.subtitle || stage.subtitle;
                const rawFullText = canonical?.fullText || stage.text;
                const textWithUser = rawFullText.replace(/\[NOME\]/g, userName || 'Você');

                return (
                  <div
                    key={stage.id}
                    className={`rounded-2xl p-5 border transition-all duration-200 ${
                      isActive
                        ? 'bg-[#0b1f18]/90 border-[#d4af37]/45 shadow-[0_0_25px_rgba(212,175,55,0.15)]'
                        : 'bg-[#061410]/50 border-[#8ca89a]/15 hover:border-[#8ca89a]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#e6ca65] border border-[#d4af37]/30">
                          Etapa {idx + 1} de 6
                        </span>
                        {isActive && (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
                            <CheckCircle2 size={11} /> Em reprodução
                          </span>
                        )}
                      </div>
                      {onSelectStage && (
                        <button
                          onClick={() => {
                            onSelectStage(idx);
                            onClose();
                          }}
                          className="text-xs text-[#d4af37] hover:underline font-medium"
                        >
                          Ir para esta etapa
                        </button>
                      )}
                    </div>

                    <h4 className="font-serif text-lg text-[#f4f1ea] font-medium mb-1">
                      {title}
                    </h4>
                    <p className="text-xs text-[#8ca89a] mb-4 font-sans">
                      {subtitle}
                    </p>

                    <div className="text-sm font-serif text-[#e8e3d5] leading-relaxed whitespace-pre-line bg-[#04100c]/60 p-4 rounded-xl border border-[#8ca89a]/10">
                      {textWithUser}
                    </div>

                    {canonical?.mantras && canonical.mantras.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#8ca89a]/10">
                        <p className="text-[11px] uppercase tracking-wider text-[#d4af37] font-medium mb-2">
                          Mantras de Ancoramento:
                        </p>
                        <div className="space-y-1.5">
                          {canonical.mantras.map((mantra: string, mIdx: number) => (
                            <div
                              key={mIdx}
                              className="text-xs italic text-[#8ca89a] flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/50" />
                              <span>“{mantra}”</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#8ca89a]/15 bg-[#061410]/95 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#e6ca65] hover:bg-[#d4af37]/30 text-sm font-medium transition-colors"
              >
                Fechar Roteiro
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
