import re

with open('src/components/AdminPanelModal.tsx', 'r') as f:
    content = f.read()

# Fix the user email and plan display
pattern = r'<span className=\{`text-\[9px\] font-mono px-2 py-0\.5 rounded-full font-bold uppercase \$\{\n                                    acc\.profile\?\.plan === \'pro\'\n                                      \? \'bg-amber-500/20 text-amber-300 border border-amber-500/30\'\n                                      : \'bg-slate-800 text-slate-400\'\n                                  \}`\}>\n                                    \{acc\.profile\?\.plan === \'pro\' \? \'★ PRO VIP\' : \'FREE\'\}\n                                  </span>\n                                </div>\n                                <span className="text-\[10px\] font-mono text-slate-500">\n                                  Login: @\{acc\.login\} • \{acc\.profile\?\.email \|\| \'Sem e-mail\'\} \{userPhone && `• WhatsApp: \$\{userPhone\}`\}\n                                </span>'

replacement = """<span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                                    (acc.profile?.plan === 'pro' || acc.plan === 'pro')
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                      : 'bg-slate-800 text-slate-400'
                                  }`}>
                                    {(acc.profile?.plan === 'pro' || acc.plan === 'pro') ? `★ PRO VIP${acc.profile?.subscriptionPlan ? ` (${acc.profile.subscriptionPlan.toUpperCase()})` : ''}` : 'FREE'}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-500">
                                  Login: @{acc.login} • {acc.email || acc.profile?.email || 'Sem e-mail'} {userPhone && `• WhatsApp: ${userPhone}`}
                                </span>"""

if "Login: @{acc.login} • {acc.profile?.email" in content:
    content = re.sub(pattern, replacement, content)
    with open('src/components/AdminPanelModal.tsx', 'w') as f:
        f.write(content)
    print("Fixed!")
else:
    print("Pattern not found!")

