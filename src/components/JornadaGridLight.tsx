import React from "react";
import { Check, ChevronRight, Clock, Feather } from "lucide-react";
import { JORNADA_21_DIAS } from "../data/jornada21Dias";

interface Props {
  diaAtualAtivo?: number;
  diasConcluidos?: number[];
  onSelectDia: (dia: number) => void;
  onOpenPausaConsciente?: () => void;
  onOpenReflexao?: () => void;
}

export const JornadaGridLight: React.FC<Props> = ({
  diaAtualAtivo = 1,
  diasConcluidos = [],
  onSelectDia,
  onOpenPausaConsciente,
  onOpenReflexao,
}) => {
  const ciclos = [
    { nome: "EU PERMANEÇO", subtitulo: "Presença, chão e corpo", dias: [1, 2, 3] },
    { nome: "EU VOLTO A SENTIR", subtitulo: "Receptividade e autocuidado", dias: [4, 5, 6] },
    { nome: "EU VOLTO A ESCOLHER", subtitulo: "Padrões e novas escolhas", dias: [7, 8, 9] },
    { nome: "EU VOLTO PARA MIM", subtitulo: "Valor e identidade", dias: [10, 11, 12] },
    { nome: "EU VOLTO AO MUNDO", subtitulo: "Abertura e contato", dias: [13, 14, 15] },
    { nome: "EU MOVIMENTO MEUS CAMINHOS", subtitulo: "Direção e desbloqueio", dias: [16, 17, 18] },
    { nome: "EU REINTEGRO A VIDA", subtitulo: "Integração da travessia", dias: [19, 20, 21] },
  ];

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#2A2420] font-sans relative overflow-x-hidden selection:bg-[#EAD5A8] selection:text-[#2A2420] px-4 sm:px-6 py-8">
      <div className="absolute top-0 left-0 w-[550px] h-[550px] bg-gradient-to-br from-[#EBD9BF]/50 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#D8C7AA]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-l from-[#5E7153]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#E5DAC6] text-xs text-[#5C5248] shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5E7153]" />
            <span className="font-medium tracking-wide">Protocolo da Transformação</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif text-[#2A2420] tracking-tight">
            21 Dias para Voltar para Mim
          </h1>
          <p className="text-xs sm:text-sm font-serif italic text-[#B88736]">
            Reintegração da Vida — “Um lugar para voltar para si.”
          </p>

          <p className="text-xs text-[#5C5248] font-light max-w-lg mx-auto leading-relaxed">
            Uma travessia contínua de presença, escuta e retorno ao seu centro. Sem cobrança de desempenho, no seu próprio ritmo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onOpenPausaConsciente && (
              <button
                onClick={onOpenPausaConsciente}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/85 border border-[#E5DAC6] hover:border-[#B88736] text-xs text-[#52473D] transition-colors shadow-2xs cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-[#B88736]" />
                <span>Pausa Consciente (2, 5 e 10 min)</span>
              </button>
            )}

            {onOpenReflexao && (
              <button
                onClick={onOpenReflexao}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/85 border border-[#E5DAC6] hover:border-[#B88736] text-xs text-[#52473D] transition-colors shadow-2xs cursor-pointer"
              >
                <Feather className="w-3.5 h-3.5 text-[#5E7153]" />
                <span>Ainda Há Algo em Mim</span>
              </button>
            )}
          </div>
        </header>

        <div className="space-y-6">
          {ciclos.map((ciclo, idx) => {
            const diasDoCiclo = JORNADA_21_DIAS.filter(d => ciclo.dias.includes(d.dia));

            return (
              <div
                key={ciclo.nome}
                className="bg-white/80 backdrop-blur-md border border-[#E8DFC8] rounded-3xl p-5 sm:p-7 shadow-xs transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#E8DFC8]/70 gap-1">
                  <div>
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[#B88736]">
                      Ciclo {idx + 1}
                    </span>
                    <h2 className="text-lg font-serif text-[#2A2420]">
                      {ciclo.nome}
                    </h2>
                  </div>
                  <span className="text-xs text-[#7A6D5E] font-light">
                    {ciclo.subtitulo}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {diasDoCiclo.map((dia) => {
                    const isConcluido = diasConcluidos.includes(dia.dia);
                    const isAtivo = dia.dia === diaAtualAtivo;

                    return (
                      <div
                        key={dia.dia}
                        onClick={() => onSelectDia(dia.dia)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                          isAtivo
                            ? "bg-[#FAF4EB] border-[#B88736] shadow-sm shadow-[#B88736]/15 ring-1 ring-[#B88736]/40"
                            : isConcluido
                            ? "bg-[#F5EFE4]/80 border-[#DDD2BE] hover:border-[#B88736]/60"
                            : "bg-white/70 border-[#E8DFC8] hover:border-[#B88736]/50 hover:bg-white"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-[#B88736]">
                              Dia {dia.dia}
                            </span>
                            {isConcluido && (
                              <div className="w-4 h-4 rounded-full bg-[#B88736] text-white flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-3" />
                              </div>
                            )}
                            {isAtivo && !isConcluido && (
                              <span className="w-2 h-2 rounded-full bg-[#B88736] animate-pulse" />
                            )}
                          </div>

                          <h3 className="text-sm font-serif font-medium text-[#2A2420] group-hover:text-[#9E6E24] transition-colors leading-snug">
                            {dia.titulo}
                          </h3>

                          <p className="text-[11px] text-[#5C5248] font-light mt-1.5 line-clamp-2 leading-relaxed">
                            {dia.intencao}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-[#E8DFC8]/60 flex items-center justify-between text-[10px] text-[#85786C]">
                          <span>29:57</span>
                          <span className="inline-flex items-center gap-1 group-hover:text-[#2A2420] transition-colors">
                            <span className="font-medium">Vivenciar</span>
                            <ChevronRight className="w-3 h-3 text-[#B88736]" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <footer className="text-center pt-6 pb-2 border-t border-[#E8DFC8]/70 space-y-1 text-xs text-[#7A6D5E]">
          <p className="font-serif italic text-sm text-[#4A403A]">
            “Cuidar de si também é um ato de amor.”
          </p>
          <p className="text-[11px] text-[#8F8273] uppercase tracking-wider">
            Everton Piceni • Terapias Holísticas e Bem-Estar
          </p>
        </footer>
      </div>
    </div>
  );
};