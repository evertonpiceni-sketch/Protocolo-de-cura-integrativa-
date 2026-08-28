import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Heart, ArrowRight, BookOpen, AlertCircle, Play } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const nextStep = () => {
    if (step === 3) {
      onComplete();
    } else {
      setStep(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="text-center space-y-6 relative z-10">
              <div className="mx-auto w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Sparkles size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-display font-medium text-slate-100 mb-3">Bem-vindo ao seu espaço de retorno.</h1>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Você não chegou até aqui por acaso. Este aplicativo é o seu portal seguro para silenciar o caos externo e olhar para dentro.
                </p>
              </div>
              <button
                onClick={nextStep}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Iniciar Minha Jornada</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="text-center space-y-6 relative z-10">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Shield size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-display font-medium text-slate-100 mb-3">Um complemento ao seu caminhar.</h1>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Lembre-se: este protocolo é um poderoso complemento ao seu tratamento de saúde. Ele vai ajudar a elucidar e liberar tudo aquilo que, de alguma forma, você ainda não se permitiu deixar ir.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-left space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Para garantir sua segurança emocional, precisamos que você leia e concorde com a nossa Política de Privacidade.
                  </p>
                </div>
                <button
                  onClick={() => setShowPrivacy(true)}
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition"
                >
                  Ler Política de Privacidade e Proteção de Dados
                </button>
              </div>

              <button
                onClick={nextStep}
                disabled={!acceptedPrivacy}
                className={`w-full font-medium py-3.5 rounded-xl transition flex items-center justify-center gap-2 ${
                  acceptedPrivacy
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Compreendo e Aceito</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="text-center space-y-6 relative z-10">
              <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <BookOpen size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-display font-medium text-slate-100 mb-3">A importância do seu registro.</h1>
                <p className="text-sm text-slate-300 leading-relaxed">
                  A cada dia de aplicação, nosso sistema abrirá o seu Diário de Sensações. Anotar as reações físicas e os sentimentos que vierem à tona é fundamental para mapearmos a sua evolução biológica e espiritual.
                </p>
              </div>
              <button
                onClick={nextStep}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Play size={18} className="fill-current" />
                <span>Começar Protocolo de 21 Dias</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Pop-up */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto flex flex-col"
            >
              <h2 className="text-lg font-semibold text-slate-100 mb-4 border-b border-slate-800 pb-3">
                Política de Privacidade e Proteção de Dados
              </h2>
              <div className="flex-1 space-y-4 text-xs text-slate-300 leading-relaxed overflow-y-auto pr-2 mb-6">
                <p>
                  <strong>Aviso Importante sobre Dados de Saúde Emocional:</strong><br />
                  O Protocolo de Cura Integrada de 21 Dias coleta informações fornecidas por você através da Anamnese e do Diário de Sensações. Estes dados são extremamente confidenciais e tratados com o mais absoluto respeito.
                </p>
                <p>
                  <strong>Criptografia e Purificação (Chama Violeta):</strong><br />
                  Seus desabafos, dores e registros íntimos não são mantidos no nosso servidor de forma exposta. Aplicamos um protocolo de transmutação de dados ("Chama Violeta"): os dados sensíveis são purificados após a análise terapêutica e a geração da sua matriz vibracional, garantindo que "miasmas" ou energias estagnadas não sejam armazenadas.
                </p>
                <p>
                  <strong>Isenção Médica (Medical Disclaimer):</strong><br />
                  Este aplicativo atua como uma prática integrativa e complementar. Em nenhuma hipótese substitui diagnóstico, tratamento ou acompanhamento médico, psiquiátrico ou psicológico tradicional.
                </p>
                <p>
                  <strong>Compartilhamento de Dados:</strong><br />
                  Seus dados pessoais (como e-mail e nome) são utilizados apenas para garantir seu acesso e para notificações importantes do seu protocolo, não sendo vendidos a terceiros.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 shrink-0">
                <button
                  onClick={() => setShowPrivacy(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setAcceptedPrivacy(true);
                    setShowPrivacy(false);
                  }}
                  className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition"
                >
                  Eu concordo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
