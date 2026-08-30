import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

btn_code = """
          <button
            onClick={() => setShowDashboardCura(true)}
            className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border bg-slate-900/90 border-slate-800 text-sky-400 hover:text-white hover:border-sky-500/50 shrink-0 shadow-sm"
            id="bottom-btn-dashboard"
            title="Dashboard Analítico de Evolução"
          >
            <Activity size={14} className="shrink-0" />
            <span className="hidden sm:inline">Progresso Analítico</span>
            <span className="sm:hidden">KPIs</span>
          </button>
"""

content = content.replace(
    '<BookOpen size={14} className="shrink-0" />',
    '<BookOpen size={14} className="shrink-0" />'
)

# Insert after Diário de Bordo closing tag
split_parts = content.split('<span>Diário</span>\n          </button>')
if len(split_parts) == 2:
    content = split_parts[0] + '<span>Diário</span>\n          </button>\n' + btn_code + split_parts[1]

with open('src/App.tsx', 'w') as f:
    f.write(content)
