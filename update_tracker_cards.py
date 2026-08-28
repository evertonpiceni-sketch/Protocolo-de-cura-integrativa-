import re

with open('src/components/TrackerGrid.tsx', 'r') as f:
    content = f.read()

replacement = """          const renderCycle = (startDay: number, endDay: number, title: string, description: string, energeticGoal: string, icon: React.ReactNode, bgClass: string, borderClass: string) => (
            <div className="space-y-4 mb-6">
              {/* Transition / Cycle Intro Card */}
              <div className={`p-4 rounded-2xl border ${bgClass.replace('20', '10')} ${borderClass} relative overflow-hidden group`}>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl ${bgClass}`}>
                      {icon}
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-slate-200">{title}</h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 mb-3 leading-relaxed max-w-2xl">
                    {description}
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/50 border border-slate-700/50 text-[10px] sm:text-[11px] font-medium text-slate-300">
                    <Compass size={12} className="text-slate-400" />
                    <span>Objetivo: {energeticGoal}</span>
                  </div>
                </div>
              </div>

              {/* Days Grid */}
              <div className={`grid gap-3 grid-cols-2 sm:grid-cols-4 md:grid-cols-7`}>
                {Array.from({ length: endDay - startDay + 1 }, (_, index) => {"""

pattern = r'const renderCycle = \(startDay: number, endDay: number, title: string, icon: React\.ReactNode, bgClass: string\) => \(\n\s*<div className="space-y-3">\n\s*<div className="flex items-center gap-2 text-slate-300 font-medium font-display px-2 border-b border-slate-800/50 pb-2">\n\s*<div className={`p-1\.5 rounded-lg \$\{bgClass\}`}>\n\s*\{icon\}\n\s*<\/div>\n\s*<h3 className="text-sm md:text-base">\{title\}<\/h3>\n\s*<\/div>\n\s*<div className={`grid gap-3 grid-cols-2 sm:grid-cols-4 md:grid-cols-7`}>\n\s*\{Array\.from\(\{ length: endDay - startDay \+ 1 \}, \(_, index\) => \{'

content = re.sub(pattern, replacement, content, flags=re.DOTALL)


calls_replacement = """          if (activeJourney === '21d') {
            return (
              <>
                {renderCycle(1, 7, "Ciclo 1: Proteção & Limpeza (São Miguel)", "Nesta fase inicial, o foco é a remoção de amarras, proteção espiritual e limpeza de energias densas, preparando seu campo para a cura profunda.", "Limpeza Profunda e Aterramento", <Shield size={16} className="text-indigo-400" />, "bg-indigo-500/20", "border-indigo-500/20")}
                {renderCycle(8, 14, "Ciclo 2: Transmutação de Padrões (Chama Violeta)", "Aprofundamento na queima kármica, liberando traumas do passado, perdoando feridas profundas e ressignificando crenças limitantes.", "Liberação Emocional e Perdão", <Flame size={16} className="text-violet-400" />, "bg-violet-500/20", "border-violet-500/20")}
                {renderCycle(15, 21, "Ciclo 3: Regeneração & Cura (São Rafael)", "O último ciclo atua na regeneração do seu DNA cósmico, selando o tratamento com frequências de saúde perfeita, paz e harmonia.", "Integração Celular e Saúde", <Sparkles size={16} className="text-emerald-400" />, "bg-emerald-500/20", "border-emerald-500/20")}
              </>
            );
          } else {
            return renderCycle(1, 7, "Alinhamento dos 7 Chakras", "Uma jornada intensiva de 7 dias focada na ativação, purificação e alinhamento sequencial dos seus centros magnéticos de energia.", "Equilíbrio Energético", <Sun size={16} className="text-amber-400" />, "bg-amber-500/20", "border-amber-500/20");
          }"""

calls_pattern = r"if \(activeJourney === '21d'\) \{\n\s*return \(\n\s*<>\n\s*\{renderCycle\(1, 7, \"Ciclo 1: Proteção & Limpeza \(São Miguel\)\", <Shield size=\{16\} className=\"text-indigo-400\" \/>, \"bg-indigo-500/20\"\)\}\n\s*\{renderCycle\(8, 14, \"Ciclo 2: Transmutação de Padrões \(Chama Violeta\)\", <Flame size=\{16\} className=\"text-violet-400\" \/>, \"bg-violet-500/20\"\)\}\n\s*\{renderCycle\(15, 21, \"Ciclo 3: Regeneração & Cura \(São Rafael\)\", <Sparkles size=\{16\} className=\"text-emerald-400\" \/>, \"bg-emerald-500/20\"\)\}\n\s*<\/>\n\s*\);\n\s*\} else \{\n\s*return renderCycle\(1, 7, \"Alinhamento dos 7 Chakras\", <Sun size=\{16\} className=\"text-amber-400\" \/>, \"bg-amber-500/20\"\);\n\s*\}"

content = re.sub(calls_pattern, calls_replacement, content, flags=re.DOTALL)

with open('src/components/TrackerGrid.tsx', 'w') as f:
    f.write(content)
