import re

# Update App.tsx
with open('src/App.tsx', 'r') as f:
    app_content = f.read()

app_logo_replacement = """          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-[1.5px] border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.25)] shrink-0 bg-slate-900 flex items-center justify-center">
              <img src="image_fccef69.png" alt="Everton Piceni Logo" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
            </div>
            <div className="min-w-0">"""

app_content = re.sub(
    r'          <div className="flex items-center gap-2 sm:gap-2\.5 min-w-0">\n            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl shrink-0">\n              <Sparkles size=\{18\} className="animate-pulse" />\n            </div>\n            <div className="min-w-0">',
    app_logo_replacement,
    app_content
)

with open('src/App.tsx', 'w') as f:
    f.write(app_content)

# Update ProfileSetup.tsx
with open('src/components/ProfileSetup.tsx', 'r') as f:
    profile_content = f.read()

profile_logo_replacement = """        <div className="text-center space-y-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-[2px] border-indigo-500/40 shadow-[0_0_25px_rgba(99,102,241,0.25)] mx-auto mb-4 bg-slate-900 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
            <img src="image_fccef69.png" alt="Everton Piceni Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-semibold">Terapia Integrada</span>"""

profile_content = re.sub(
    r'        <div className="text-center space-y-2">\n          <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-inner">\n            <Sparkles size=\{24\} className="animate-pulse" />\n          </div>\n          <span className="text-\[10px\] font-mono tracking-widest text-indigo-400 uppercase font-semibold">Terapia Integrada</span>',
    profile_logo_replacement,
    profile_content
)

with open('src/components/ProfileSetup.tsx', 'w') as f:
    f.write(profile_content)
