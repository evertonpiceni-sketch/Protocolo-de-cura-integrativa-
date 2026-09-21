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
      "Ao expirar pela boca, solte os ombros de uma vez, deixando cair o peso.",
      "Afaste os dentes de trás, relaxando a mandíbula e a testa.",
      "Faça movimentos circulares lentos com o pescoço, sem forçar."
    ]
  },
  {
    id: "descanso-10",
    title: "Preparação para Descansar",
    duration: 10,
    description: "Desacelere o ritmo mental e o corpo para a noite.",
    posture: "Adaptável",
    steps: [
      "Encontre uma postura confortável e relaxada.",
      "Prolongue a expiração, soltando o ar mais lentamente do que puxou.",
      "Permita que o corpo pese sobre o apoio, entregando o cansaço do dia.",
      "Acolha tudo o que foi feito hoje. Agora é o seu momento de repouso."
    ]
  }
];

export const PausaConscienteLight: React.FC = () => {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [activePractice, setActivePractice] = useState<Practice | null>(null);

  const filteredPractices = selectedDuration
    ? PRACTICES.filter(p => p.duration === selectedDuration)
    : PRACTICES;

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#2A2420] font-sans relative overflow-hidden px-6 py-8 select-none">
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-gradient-to-br from-[#EBD9BF]/50 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-gradient-to-tl from-[#D8C7AA]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-gradient-to-r from-[#5E7153]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <main className="max-w-md mx-auto w-full my-auto py-6">
        {!activePractice ? (
          <div className="bg-white/85 backdrop-blur-xl border border-[#E8DFC8] rounded-3xl p-7 sm:p-9 shadow-xl shadow-[#B88736]/5">
            <div className="text-center mb-6">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[#B88736] block mb-1">
                Autocuidado Corporal
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#2A2420]">Pausa Consciente</h2>
              <p className="text-xs text-[#5C5248] mt-1.5 font-light leading-relaxed">
                Pequenas experiências para interromper o automático, perceber o corpo e voltar ao presente.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-[11px] text-[#7A6D5E] mr-1">Tenho:</span>
              {[2, 5, 10].map(duration => (
                <button
                  key={duration}
                  onClick={() => setSelectedDuration(selectedDuration === duration ? null : duration)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    selectedDuration === duration
                      ? "bg-[#B88736] text-white shadow-xs"
                      : "bg-[#F5EFE4] text-[#5C5248] hover:bg-[#E8DFC8]"
                  }`}
                >
                  {duration} min
                </button>
              ))}
            </div>

            <div className="space-y-3.5 mb-7">
              {filteredPractices.map(practice => (
                <div
                  key={practice.id}
                  onClick={() => setActivePractice(practice)}
                  className="p-4 rounded-2xl bg-[#FBF8F2] border border-[#E5DAC6] hover:border-[#B88736] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-[#2A2420] group-hover:text-[#B88736] transition-colors">
                      {practice.title}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#7A6D5E]">
                      <Clock className="w-3 h-3 text-[#5E7153]" />
                      <span>{practice.duration} min</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#5C5248] font-light leading-relaxed mb-2">{practice.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-[#8A7C6D]">
                    <Armchair className="w-3 h-3 text-[#B88736]" />
                    <span>Postura: {practice.posture}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-2 border-t border-[#E8DFC8]/70">
              <p className="font-serif italic text-xs text-[#5C5248]">
                “O autocuidado deve se adaptar à pessoa — e não a pessoa ao aplicativo.”
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-xl border border-[#E8DFC8] rounded-3xl p-7 sm:p-9 shadow-xl shadow-[#B88736]/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5E7153]" />
                <span className="text-[11px] font-semibold tracking-widest uppercase text-[#B88736]">
                  {activePractice.duration} Minutos • {activePractice.posture}
                </span>
              </div>
              <button
                onClick={() => setActivePractice(null)}
                className="w-7 h-7 rounded-full hover:bg-black/5 flex items-center justify-center text-[#7A6D5E] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-2xl font-serif text-[#2A2420] mb-2">{activePractice.title}</h2>
            <p className="text-xs text-[#5C5248] font-light leading-relaxed mb-6">{activePractice.description}</p>

            <div className="space-y-4 mb-8">
              {activePractice.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FAF4EB] border border-[#D5C29D] text-[11px] font-medium text-[#B88736] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-[#2A2420] leading-relaxed font-light">{step}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActivePractice(null)}
              className="w-full py-3 px-6 rounded-xl font-medium text-xs text-white flex items-center justify-center gap-2 bg-gradient-to-r from-[#D6A756] via-[#B88736] to-[#9E6E24] hover:brightness-105 active:scale-[0.99] transition-all shadow-md shadow-[#B88736]/25 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir Prática</span>
            </button>
          </div>
        )}
      </main>

      <footer className="max-w-md mx-auto w-full text-center border-t border-[#E8DFC8]/70 pt-4">
        <div className="text-[11px] text-[#7A6D5E] tracking-wider uppercase">
          Everton Piceni • Terapias Holísticas e Bem-Estar
        </div>
      </footer>
    </div>
  );
};
