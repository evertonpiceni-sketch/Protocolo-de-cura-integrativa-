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
  const question = QUESTIONS[currentIdx];

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(index => index + 1);
      return;
    }
    onFinishReflection?.(answers);
  };

  const handleBack = () => {
    if (currentIdx > 0) setCurrentIdx(index => index - 1);
  };

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-[#F8F4EC] px-4 py-6 font-sans text-[#2A2420] sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] -z-10 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-[#EBD9BF]/50 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] -z-10 h-[550px] w-[550px] rounded-full bg-gradient-to-tl from-[#D8C7AA]/40 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/4 -z-10 h-80 w-80 rounded-full bg-gradient-to-l from-[#5E7153]/5 to-transparent blur-3xl" />

      <header className="mx-auto flex w-full max-w-md items-center justify-between gap-3">
        <div className="w-24">
          {currentIdx > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex min-h-11 items-center gap-1 rounded-xl px-2 text-xs uppercase tracking-wider text-[#7A6D5E] transition-colors hover:bg-[#F5EFE4] hover:text-[#2A2420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Voltar</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#7A6D5E]" aria-live="polite">
          <Feather className="h-3.5 w-3.5 text-[#5E7153]" />
          <span>Reflexão {currentIdx + 1} de {QUESTIONS.length}</span>
        </div>

        <div className="w-24" aria-hidden="true" />
      </header>

      <main className="mx-auto my-auto w-full max-w-md py-6">
        <AnimatePresence mode="wait">
          <motion.section
            key={question.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-[#E8DFC8] bg-white/85 p-6 shadow-xl shadow-[#B88736]/5 backdrop-blur-xl sm:p-9"
            aria-labelledby={`reflection-question-${question.id}`}
          >
            <div className="mb-3 inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5E7153]" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#B88736]">Ainda Há Algo em Mim</span>
            </div>

            <h1 id={`reflection-question-${question.id}`} className="mb-2 font-serif text-2xl leading-snug text-[#2A2420] sm:text-3xl">{question.title}</h1>
            <p className="mb-6 text-xs font-light leading-relaxed text-[#5C5248]">{question.subtitle}</p>

            <div className="mb-6 space-y-2">
              <label htmlFor={`reflection-answer-${question.id}`} className="sr-only">Resposta opcional para: {question.title}</label>
              <textarea
                id={`reflection-answer-${question.id}`}
                value={answers[question.id] || ''}
                onChange={event => setAnswers(previous => ({ ...previous, [question.id]: event.target.value }))}
                placeholder={question.placeholder}
                rows={4}
                className="w-full resize-none rounded-2xl border border-[#E2D5BE] bg-[#F5EFE4] p-4 text-sm font-light leading-relaxed text-[#2A2420] placeholder-[#9E9080] transition-all focus:border-[#B88736] focus:outline-none focus:ring-2 focus:ring-[#B88736]/20"
              />
              <span className="block text-right text-[10px] text-[#8A7C6D]">A escrita é opcional. Você pode apenas refletir em silêncio se preferir.</span>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D6A756] via-[#B88736] to-[#9E6E24] px-6 py-3.5 text-sm font-medium text-white shadow-md shadow-[#B88736]/25 transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35"
            >
              <span>{currentIdx === QUESTIONS.length - 1 ? 'Concluir reflexão' : 'Avançar com calma'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.section>
        </AnimatePresence>

        <div className="mt-6 space-y-1.5 text-center">
          <p className="text-xs font-light text-[#5C5248]">“Aqui, ninguém precisa estar bem para ser bem-vindo.”</p>
          <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-[#8A7C6D]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#B88736]" />
            <span>Você decide o que deseja escrever e registrar.</span>
          </div>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-md border-t border-[#E8DFC8]/70 pt-4 text-center">
        <div className="text-[11px] uppercase tracking-wider text-[#7A6D5E]">@terapiamorevida • Evoluir também é cuidar de si</div>
        <p className="mt-1 text-[10px] text-[#9E9080]">Se esta reflexão despertar sofrimento intenso, interrompa a prática e procure uma pessoa ou serviço de apoio adequado.</p>
      </footer>
    </div>
  );
};
