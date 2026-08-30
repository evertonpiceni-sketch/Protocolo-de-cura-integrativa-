import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the layout in App.tsx to make sure multiple treatments look distinctly separated
old_layout = """                {userProfile.specificTreatments && userProfile.specificTreatments.length > 0 && (
                  <div className="space-y-2 mt-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Tratamentos Registrados:</span>
                    {userProfile.specificTreatments.map((t) => (
                      <div key={t.id} className="p-3 bg-slate-950/80 border border-slate-850 rounded-xl space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-emerald-300">{t.category}</span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(t.requestedAt).toLocaleDateString('pt-BR')} • {t.prescribedFrequency.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] italic">"{t.userCaseDescription}"</p>
                        <div className="pt-1 border-t border-slate-900 flex justify-between items-center text-[10px] text-indigo-300">
                          <span>Decreto: {t.customDecree}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}"""

new_layout = """                {userProfile.specificTreatments && userProfile.specificTreatments.length > 0 && (
                  <div className="space-y-3 mt-4 pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block font-bold mb-2">Seus Tratamentos Específicos ({userProfile.specificTreatments.length}):</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {userProfile.specificTreatments.map((t, idx) => (
                        <div key={t.id || idx} className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/30 rounded-2xl flex flex-col justify-between space-y-2 text-xs transition shadow-sm">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[10px] uppercase">
                                {t.category.replace(/_/g, ' ')}
                              </span>
                              <span className="text-[9px] font-mono text-slate-500">
                                {new Date(t.requestedAt).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <h4 className="font-semibold text-slate-200 text-[13px] leading-tight mb-1">{t.title || 'Tratamento Pontual'}</h4>
                            <p className="text-slate-400 text-[11px] italic line-clamp-3 leading-relaxed">"{t.patientDescription || t.userCaseDescription}"</p>
                          </div>
                          <div className="pt-2 border-t border-slate-900/80 flex justify-between items-center text-[10px] text-indigo-300 font-mono mt-2">
                            <span>Decreto: Ativo</span>
                            <span className="font-bold">{t.assignedFrequency?.toUpperCase() || t.prescribedFrequency?.toUpperCase()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}"""

content = content.replace(old_layout, new_layout)

with open('src/App.tsx', 'w') as f:
    f.write(content)

