import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, Feather, ShieldCheck } from "lucide-react";

interface Props {
  onFinishReflection?: (answers: Record<number, string>) => void;
}

const QUESTIONS = [
  {
    id: 1,
    title: "Como você está, de verdade?",
    subtitle: "Sem precisar aparentar força ou dar respostas prontas. Apenas o que é real agora.",
    placeholder: "Se desejar, escreva aqui como se sente neste momento...",
  },
  {
    id: 2,
    title: "O que ainda importa para você?",
    subtitle: "Pode ser algo muito pequeno, uma pessoa, uma lembrança ou um valor seu.",
    placeholder: "O que vem à sua mente e ao seu coração...",
  },
  {
    id: 3,
    title: "O que você gostaria de voltar a sentir?",
    subtitle: "Uma sensação de paz, leveza, interesse, calma ou entusiasmo.",
    placeholder: "Qual sentimento ou estado você gostaria de reencontrar...",
  },
  {
    id: 4,
    title: "Existe alguma coisa que você ainda gostaria de viver?",
    subtitle: "Um plano simples, uma conversa, um lugar ou uma experiência que você ainda quer vivenciar.",
    placeholder: "Um desejo ou semente para o seu futuro...",
  },
];

export const AindaHaAlgoEmMimLight: React.FC<Props> = ({ onFinishReflection }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const q = QUESTIONS[currentIdx];

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) setCurrentIdx(i => i + 1);
    else onFinishReflection?.(answers);
  };

  const handleBack = () => {
    if (currentIdx > 0) setCurrentIdx(i => i - 1);
  };

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#2A2420] font-sans flex flex-col justify-between relative overflow-hidden px-6 py-8 select-none">
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-gradient-to-br from-[#EBD9BF]/50 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-gradient-to-tl from-[#D8C7AA]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-l from-[#5E7153]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <header className="max-w-md mx-auto w-full flex items-center justify-between">
        {currentIdx > 0 ? (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-xs uppercase tracking-wider text-[#7A6D5E] hover:text-[#2A2420] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar</span>
          </button>
        ) : (
          <div className="w-12" />
        )}

        <div className="flex items-center gap-1.5 text-xs text-[#7A6D5E]">
          <Feather className="w-3.5 h-3.5 text-[#5E7153]" />
          <span>Reflexão {currentIdx + 1} de {QUESTIONS.length}</span>
        </div>

        <div className="w-12" />
      </header>

      <main className="max-w-md mx-auto w-full my-auto py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="bg-white/85 backdrop-blur-xl border border-[#E8DFC8] rounded-3xl p-7 sm:p-9 shadow-xl shadow-[#B88736]/5"
          >
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5E7153]" />
              <span className="text-[11px] font-semibold tracking-widest text-[#B88736] uppercase">
                Ainda Há Algo em Mim
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif text-[#2A2420] leading-snug mb-2">{q.title}</h2>
            <p className="text-xs text-[#5C5248] font-light leading-relaxed mb-6">{q.subtitle}</p>

            <div className="space-y-2 mb-6">
              <textarea
                value={answers[q.id] || ""}
                onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                placeholder={q.placeholder}
                rows={4}
                className="w-full p-4 rounded-2xl bg-[#F5EFE4] border border-[#E2D5BE] text-[#2A2420] placeholder-[#9E9080] text-sm focus:outline-none focus:border-[#B88736] focus:ring-2 focus:ring-[#B88736]/20 transition-all resize-none font-light leading-relaxed"
              />
              <span className="text-[10px] text-[#8A7C6D] block text-right">
                A escrita é opcional. Você pode apenas refletir em silêncio se preferir.
              </span>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3.5 px-6 rounded-xl font-medium text-sm text-white flex items-center justify-center gap-2 bg-gradient-to-r from-[#D6A756] via-[#B88736] to-[#9E6E24] hover:brightness-105 active:scale-[0.99] transition-all shadow-md shadow-[#B88736]/25 cursor-pointer"
            >
              <span>{currentIdx === QUESTIONS.length - 1 ? "Concluir reflexão" : "Avançar com calma"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 text-center space-y-1.5">
          <p className="text-xs text-[#5C5248] font-light">
            “Aqui, ninguém precisa estar bem para ser bem-vindo.”
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-[#8A7C6D]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B88736]" />
            <span>Suas respostas são pessoais e protegidas.</span>
          </div>
        </div>
      </main>

      <footer className="max-w-md mx-auto w-full text-center border-t border-[#E8DFC8]/70 pt-4">
        <div className="text-[11px] text-[#7A6D5E] tracking-wider uppercase">
          @terapiamorevida • Evoluir também é cuidar de si
        </div>
        <p className="text-[10px] text-[#9E9080] mt-1">
          Em momentos de sofrimento agudo, lembre-se: procure apoio humano especializado (CVV: 188).
        </p>
      </footer>
    </div>
  );
};
