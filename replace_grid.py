import re

with open('src/components/TrackerGrid.tsx', 'r') as f:
    content = f.read()

# Make sure Shield is imported
if 'Shield' not in content:
    content = content.replace("import { Sun, Moon, Compass } from 'lucide-react';", "import { Sun, Moon, Compass, Shield } from 'lucide-react';")

replacement = """      {/* Grid Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3" id="grid-header-section">
        <h2 className="text-lg font-display font-medium text-slate-300 flex items-center gap-2">
          <Calendar size={18} className="text-indigo-400 shrink-0" />
          <span>{activeJourney === '7d' ? 'Alinhamento dos 7 Chakras' : 'Calendário de Alinhamento (21 Dias)'}</span>
        </h2>
        <span className="text-xs text-slate-500 font-mono hidden sm:inline">
          SELECIONE UM DIA PARA VER DETALHES
        </span>
      </div>

      {/* Days Grid (7 or 21 days) */}
      <div className="space-y-8" id="calendar-days-grid">
        {(() => {
          const renderCycle = (startDay: number, endDay: number, title: string, icon: React.ReactNode, bgClass: string) => (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-300 font-medium font-display px-2 border-b border-slate-800/50 pb-2">
                <div className={`p-1.5 rounded-lg ${bgClass}`}>
                  {icon}
                </div>
                <h3 className="text-sm md:text-base">{title}</h3>
              </div>
              <div className={`grid gap-3 grid-cols-2 sm:grid-cols-4 md:grid-cols-7`}>
                {Array.from({ length: endDay - startDay + 1 }, (_, index) => {
                  const dayNum = startDay + index;
                  const status = getDayStatus(dayNum);
                  const insight = currentInsights[dayNum - 1];

                  let cardClass = "";
                  let iconElement = null;

                  if (status === 'completed') {
                    cardClass = "bg-emerald-950/15 border-emerald-500/30 hover:border-emerald-500/50 text-slate-300";
                    iconElement = <CheckCircle2 size={16} className="text-emerald-400" />;
                  } else if (status === 'ready') {
                    cardClass = "bg-indigo-950/40 border-indigo-500/50 hover:border-indigo-500 text-slate-100 ring-1 ring-indigo-500/30 animate-pulse-slow";
                    iconElement = <Play size={12} fill="currentColor" className="text-indigo-400" />;
                  } else if (status === 'missed') {
                    cardClass = "bg-slate-900/40 border-slate-700 hover:border-indigo-500/40 text-slate-400";
                    iconElement = <Clock size={16} className="text-amber-500/60" />;
                  } else if (status === 'trial_locked') {
                    cardClass = "bg-slate-950/80 border-amber-500/20 text-slate-500 hover:border-amber-500/40 hover:text-slate-300";
                    iconElement = <Lock size={14} className="text-amber-400/80" />;
                  } else {
                    cardClass = "bg-slate-950/40 border-slate-800/80 text-slate-600 cursor-not-allowed opacity-60";
                    iconElement = <Lock size={14} className="text-slate-700" />;
                  }

                  return (
                    <div
                      key={dayNum}
                      id={`day-card-${dayNum}`}
                      onClick={() => handleDayCardClick(dayNum, status)}
                      className={`p-3 rounded-2xl border flex flex-col justify-between min-h-[110px] transition-all duration-300 relative overflow-hidden group ${
                        status !== 'locked' ? 'cursor-pointer hover:-translate-y-0.5' : ''
                      } ${cardClass}`}
                    >
                      {/* Day Number badge */}
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-[11px] font-semibold">
                          {activeJourney === '7d' ? `CHAKRA ${dayNum}` : `DIA ${dayNum.toString().padStart(2, '0')}`}
                        </span>
                        {iconElement}
                      </div>

                      {/* Day focus insight title */}
                      <div className="mt-2">
                        <p className="text-[10px] sm:text-[11px] font-sans font-medium line-clamp-2 leading-snug group-hover:text-slate-200">
                          {insight?.title || `Sessão de Alinhamento`}
                        </p>
                      </div>

                      {/* Status micro label */}
                      <div className="mt-2 flex items-center justify-between text-[9px] font-mono tracking-wider opacity-60 uppercase">
                        <span className="truncate">
                          {status === 'completed' && "Concluído"}
                          {status === 'ready' && "Disponível"}
                          {status === 'missed' && "Pendente"}
                          {status === 'trial_locked' && "Bloqueio PRO"}
                          {status === 'locked' && "Bloqueado"}
                        </span>
                        {status === 'ready' && (
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping shrink-0" />
                        )}
                        {status === 'trial_locked' && (
                          <span className="text-amber-400 text-[9px] font-bold shrink-0 ml-1">Abrir</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );

          if (activeJourney === '21d') {
            return (
              <>
                {renderCycle(1, 7, "Ciclo 1: Proteção & Limpeza (São Miguel)", <Shield size={16} className="text-indigo-400" />, "bg-indigo-500/20")}
                {renderCycle(8, 14, "Ciclo 2: Transmutação de Padrões (Chama Violeta)", <Flame size={16} className="text-violet-400" />, "bg-violet-500/20")}
                {renderCycle(15, 21, "Ciclo 3: Regeneração & Cura (São Rafael)", <Sparkles size={16} className="text-emerald-400" />, "bg-emerald-500/20")}
              </>
            );
          } else {
            return renderCycle(1, 7, "Alinhamento dos 7 Chakras", <Sun size={16} className="text-amber-400" />, "bg-amber-500/20");
          }
        })()}
      </div>
    </div>
  );
}"""

pattern = r'\{\/\* Grid Header \*\/\}.*?id="calendar-days-grid">.*?\}\)\}\n\s*<\/div>\n\s*<\/div>\n\s*\);\n\}'
new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/components/TrackerGrid.tsx', 'w') as f:
    f.write(new_content)
