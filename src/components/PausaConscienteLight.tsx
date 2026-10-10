import React, { useState } from "react";
import { Clock, Armchair, CheckCircle2, X } from "lucide-react";

interface Practice {
  id: string;
  title: string;
  duration: 2 | 5 | 10;
  description: string;
  posture: string;
  steps: string[];
}

const PRACTICES: Practice[] = [
  {
    id: "respiro-2",
    title: "Pausa de Presença",
    duration: 2,
    description: "Interrompa o piloto automático e perceba sua respiração agora.",
    posture: "Sentado(a)",
    steps: [
      "Apoie os pés firmes no chão e descanse as mãos sobre as pernas.",
      "Feche os olhos ou suavize o olhar para baixo.",
      "Sinta o ar entrando suavemente pelo nariz e saindo sem pressa.",
      "Observe onde seu corpo toca a cadeira e retorne ao presente."
    ]
  },
  {
    id: "tensao-5",
    title: "Alívio de Ombros e Mandíbula",
    duration: 5,
    description: "Solte a tensão acumulada na parte superior do corpo.",
    posture: "Sentado(a)",
    steps: [
      "Eleve os ombros suavemente até as orelhas ao inspirar.",
      "Ao expirar pela boca, solte os ombros e perceba a mudança de peso.",
      "Afaste os dentes de trás, relaxando a mandíbula e a testa.",
      "Faça movimentos pequenos e lentos com o pescoço, sem forçar e sem buscar amplitude."
    ]
  },
  {
    id: "descanso-10",
    title: "Preparação para Descansar",
    duration: 10,
    description: "Desacelere o ritmo antes do período de repouso.",
    posture: "Adaptável",
    steps: [
      "Encontre uma postura confortável e relaxada.",
      "Se for confortável, prolongue a expiração sem prender ou forçar o ar.",
      "Perceba o peso do corpo sobre o apoio e deixe o ritmo diminuir aos poucos.",
      "Acolha o que foi possível fazer hoje. Agora é um momento de pausa."
    ]
  }
];

export const PausaConscienteLight: React.FC = () => {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [activePractice, setActivePractice] = useState<Practice | null>(null);

  const filteredPractices = selectedDuration
    ? PRACTICES.filter(practice => practice.duration === selectedDuration)
    : PRACTICES;

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#F8F4EC] px-4 py-6 font-sans text-[#2A2420] sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] -z-10 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-[#EBD9BF]/50 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] -z-10 h-[550px] w-[550px] rounded-full bg-gradient-to-tl from-[#D8C7AA]/40 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute left-0 top-1/3 -z-10 h-80 w-80 rounded-full bg-gradient-to-r from-[#5E7153]/5 to-transparent blur-3xl" />

      <main className="mx-auto my-auto w-full max-w-md py-6">
        {!activePractice ? (
          <section className="rounded-3xl border border-[#E8DFC8] bg-white/85 p-6 shadow-xl shadow-[#B88736]/5 backdrop-blur-xl sm:p-9" aria-labelledby="pause-title">
            <header className="mb-6 text-center">
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[#B88736]">Autocuidado Corporal</span>
              <h1 id="pause-title" className="font-serif text-2xl text-[#2A2420] sm:text-3xl">Pausa Consciente</h1>
              <p className="mt-1.5 text-xs font-light leading-relaxed text-[#5C5248]">Pequenas experiências para interromper o automático, perceber o corpo e voltar ao presente.</p>
            </header>

            <div className="mb-6 flex flex-wrap items-center justify-center gap-2" aria-label="Filtrar pela duração">
              <span className="mr-1 text-[11px] text-[#7A6D5E]">Tenho:</span>
              {[2, 5, 10].map(duration => (
                <button
                  key={duration}
                  type="button"
                  aria-pressed={selectedDuration === duration}
                  onClick={() => setSelectedDuration(selectedDuration === duration ? null : duration)}
                  className={`min-h-11 min-w-14 rounded-full px-3.5 py-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35 ${
                    selectedDuration === duration
                      ? 'bg-[#B88736] text-white shadow-sm'
                      : 'bg-[#F5EFE4] text-[#5C5248] hover:bg-[#E8DFC8]'
                  }`}
                >
                  {duration} min
                </button>
              ))}
            </div>

            <div className="mb-7 space-y-3.5">
              {filteredPractices.map(practice => (
                <button
                  key={practice.id}
                  type="button"
                  onClick={() => setActivePractice(practice)}
                  className="group w-full rounded-2xl border border-[#E5DAC6] bg-[#FBF8F2] p-4 text-left transition-all hover:border-[#B88736] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
                >
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-[#2A2420] transition-colors group-hover:text-[#8F631E]">{practice.title}</span>
                    <span className="flex shrink-0 items-center gap-1.5 text-[11px] text-[#7A6D5E]"><Clock className="h-3 w-3 text-[#5E7153]" />{practice.duration} min</span>
                  </div>
                  <p className="mb-2 text-[11px] font-light leading-relaxed text-[#5C5248]">{practice.description}</p>
                  <span className="flex items-center gap-2 text-[10px] text-[#8A7C6D]"><Armchair className="h-3 w-3 text-[#B88736]" />Postura: {practice.posture}</span>
                </button>
              ))}
            </div>

            <p className="border-t border-[#E8DFC8]/70 pt-4 text-center font-serif text-xs italic text-[#5C5248]">“O autocuidado deve se adaptar à pessoa — e não a pessoa ao aplicativo.”</p>
          </section>
        ) : (
          <section className="rounded-3xl border border-[#E8DFC8] bg-white/90 p-6 shadow-xl shadow-[#B88736]/10 backdrop-blur-xl sm:p-9" aria-labelledby="active-pause-title">
            <header className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#5E7153]" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#B88736]">{activePractice.duration} minutos • {activePractice.posture}</span>
              </div>
              <button
                type="button"
                onClick={() => setActivePractice(null)}
                aria-label="Voltar à lista de pausas"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E5DAC6] bg-[#F5EFE4] text-[#7A6D5E] transition hover:bg-[#EFE4D3] hover:text-[#2A2420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <h2 id="active-pause-title" className="mb-2 font-serif text-2xl text-[#2A2420]">{activePractice.title}</h2>
            <p className="mb-6 text-xs font-light leading-relaxed text-[#5C5248]">{activePractice.description}</p>

            <ol className="mb-8 space-y-4">
              {activePractice.steps.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#D5C29D] bg-[#FAF4EB] text-[11px] font-medium text-[#B88736]">{index + 1}</span>
                  <p className="text-xs font-light leading-relaxed text-[#2A2420]">{step}</p>
                </li>
              ))}
            </ol>

            <button
              type="button"
              onClick={() => setActivePractice(null)}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D6A756] via-[#B88736] to-[#9E6E24] px-6 py-3 text-xs font-medium text-white shadow-md shadow-[#B88736]/25 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Concluir prática</span>
            </button>
          </section>
        )}
      </main>

      <footer className="mx-auto w-full max-w-md border-t border-[#E8DFC8]/70 pt-4 text-center">
        <div className="text-[11px] uppercase tracking-wider text-[#7A6D5E]">Everton Piceni • Terapias Holísticas e Bem-Estar</div>
      </footer>
    </div>
  );
};
