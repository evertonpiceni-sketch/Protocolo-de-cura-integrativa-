import re

with open('src/components/ProfileSetup.tsx', 'r') as f:
    content = f.read()

checkbox_html = """
            <div className="flex items-start gap-2 mt-4 mb-2">
              <input 
                type="checkbox" 
                id="lgpd-consent" 
                required 
                className="mt-0.5 shrink-0 bg-slate-900 border-slate-700 rounded text-indigo-600 focus:ring-indigo-500" 
              />
              <label htmlFor="lgpd-consent" className="text-[10px] text-slate-400 leading-tight">
                Declaro que li e concordo com os Termos de Uso e a Política de Privacidade. 
                Autorizo o tratamento dos meus dados (incluindo anamnese) estritamente para 
                a formulação de práticas integrativas, conforme a LGPD.
              </label>
            </div>
            
            <button"""

content = content.replace('            <button\n              type="submit"\n              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 text-xs tracking-wider uppercase cursor-pointer border-none mt-4"\n              id="btn-complete-setup"', checkbox_html + '\n              type="submit"\n              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 text-xs tracking-wider uppercase cursor-pointer border-none"\n              id="btn-complete-setup"')

with open('src/components/ProfileSetup.tsx', 'w') as f:
    f.write(content)
