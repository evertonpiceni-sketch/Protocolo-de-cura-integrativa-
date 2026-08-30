import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

btn_code = """
                  <button
                    type="button"
                    onClick={() => {
                      setShowSettings(false);
                      setShowDashboardCura(true);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800 transition flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-sm text-slate-300 group-hover:text-white">
                      <Activity size={16} className="text-indigo-400 group-hover:text-indigo-300" />
                      <span>Dashboard de Progresso Analítico</span>
                    </div>
                  </button>
"""

content = content.replace(
    '<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">',
    '<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">\n' + btn_code
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
