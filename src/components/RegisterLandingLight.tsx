import React, { useState } from "react";
import { 
  Heart, 
  Compass,
  Calendar, 
  Lock, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  Eye,
  EyeOff,
  Sun
} from "lucide-react";
import { APPROVED_LOGO_DATA_URI } from './ApprovedBrand';

interface Props {
  onStartJourney?: () => void;
}

export const RegisterLandingLight: React.FC<Props> = ({ onStartJourney }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [lgpdAccepted, setLgpdAccepted] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onStartJourney) {
      onStartJourney();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#2A2420] font-sans relative overflow-x-hidden selection:bg-[#EAD5A8] selection:text-[#2A2420]">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#EBD9BF]/50 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#D8C7AA]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-l from-[#5E7153]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between border-b border-[#E8DFC8]/70 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-16 rounded-2xl border border-[#B88736]/20 flex items-center justify-center bg-white/70 p-1 shadow-xs">
            <img src={APPROVED_LOGO_DATA_URI} alt="Everton Piceni — Terapias Holísticas e Bem-Estar" className="h-full w-full object-contain opacity-80" />
          </div>
          <div>
            <h1 className="text-xs font-semibold tracking-widest text-[#2A2420] uppercase">Everton Piceni</h1>
            <p className="text-[10px] tracking-wider text-[#7A6D5E] uppercase">Terapias Holísticas e Bem-Estar</p>
          </div>
        </div>

        <div className="text-xs font-serif italic text-[#7A6D5E]">
          “Um lugar para voltar para si.”
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <section className="lg:col-span-6 flex flex-col justify-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#E5DAC6] text-xs text-[#5C5248] w-fit shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#5E7153]" />
            <span className="font-medium tracking-wide">Protocolo da Transformação</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#2A2420] leading-[1.15] tracking-tight">
              Um novo capítulo pode começar <span className="italic text-[#B88736]">hoje</span>.
            </h2>
            <p className="text-base sm:text-lg text-[#5C5248] font-light leading-relaxed max-w-lg">
              Um espaço seguro para respirar, acolher e voltar para si. Aqui, você não precisa estar bem para ser bem-vindo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-lg">
            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-[#E8DFC8] hover:border-[#B88736]/50 transition-all shadow-xs">
              <Heart className="w-5 h-5 text-[#B88736] mb-2" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2A2420]">Acolher</h3>
              <p className="text-[11px] text-[#7A6D5E] mt-1 leading-relaxed">Receber você exatamente como chega, sem cobrança ou julgamento.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-[#E8DFC8] hover:border-[#B88736]/50 transition-all shadow-xs">
              <Compass className="w-5 h-5 text-[#5E7153] mb-2" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2A2420]">Orientar</h3>
              <p className="text-[11px] text-[#7A6D5E] mt-1 leading-relaxed">Possibilidades responsáveis de pausa, presença e autocuidado.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-[#E8DFC8] hover:border-[#B88736]/50 transition-all shadow-xs">
              <Sun className="w-5 h-5 text-[#B88736] mb-2" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2A2420]">Reconectar</h3>
              <p className="text-[11px] text-[#7A6D5E] mt-1 leading-relaxed">Perceber seu corpo, limites, emoções e reencontrar seu centro.</p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E8DFC8]/70 max-w-lg">
            <p className="font-serif italic text-sm sm:text-base text-[#4A403A]">“Cuidar de si também é um ato de amor.”</p>
            <span className="text-xs text-[#8F8273] block mt-1 tracking-wider">— Everton Piceni</span>
          </div>
        </section>

        <section className="lg:col-span-6 flex justify-center lg:justify-end w-full">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-[#E8DFC8] rounded-3xl p-7 sm:p-9 shadow-xl shadow-[#B88736]/10 relative">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="h-[1px] w-5 bg-[#B88736]" />
              <span className="text-[11px] font-semibold tracking-widest text-[#B88736] uppercase">Criar sua conta</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif text-[#2A2420] leading-snug">Bem-vindo(a) ao seu momento.</h3>
            <p className="text-xs text-[#5C5248] mt-1.5 mb-6 font-light leading-relaxed">
              Inicie sua jornada de <span className="font-medium text-[#2A2420]">21 Dias para Voltar para Mim</span>. É simples, seguro e feito com cuidado.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium tracking-wider uppercase text-[#5C5248] mb-1.5">Nome Completo</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Seu nome completo" required className="w-full px-4 py-2.5 rounded-xl bg-[#F5EFE4] border border-[#E2D5BE] text-[#2A2420] placeholder-[#9E9080] text-sm focus:outline-none focus:border-[#B88736] focus:ring-2 focus:ring-[#B88736]/20 transition-all" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-medium tracking-wider uppercase text-[#5C5248] mb-1.5">Data de Nascimento</label>
                  <div className="relative">
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required className="w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-[#F5EFE4] border border-[#E2D5BE] text-[#2A2420] text-xs focus:outline-none focus:border-[#B88736] focus:ring-2 focus:ring-[#B88736]/20 transition-all" />
                    <Calendar className="w-4 h-4 text-[#8A7C6D] absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium tracking-wider uppercase text-[#5C5248] mb-1.5">E-mail</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" required className="w-full px-4 py-2.5 rounded-xl bg-[#F5EFE4] border border-[#E2D5BE] text-[#2A2420] placeholder-[#9E9080] text-sm focus:outline-none focus:border-[#B88736] focus:ring-2 focus:ring-[#B88736]/20 transition-all" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-medium tracking-wider uppercase text-[#5C5248]">Telefone / WhatsApp (Opcional)</label>
                  <span className="text-[10px] text-[#9E6E24]">Acolhimento e mensagens</span>
                </div>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="(11) 99999-9999" className="w-full px-4 py-2.5 rounded-xl bg-[#F5EFE4] border border-[#E2D5BE] text-[#2A2420] placeholder-[#9E9080] text-sm focus:outline-none focus:border-[#B88736] focus:ring-2 focus:ring-[#B88736]/20 transition-all" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-medium tracking-wider uppercase text-[#5C5248] mb-1.5">Nome de Usuário</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="ex: joaosilva" required className="w-full px-4 py-2.5 rounded-xl bg-[#F5EFE4] border border-[#E2D5BE] text-[#2A2420] placeholder-[#9E9080] text-sm focus:outline-none focus:border-[#B88736] focus:ring-2 focus:ring-[#B88736]/20 transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium tracking-wider uppercase text-[#5C5248] mb-1.5">Senha</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Mín. 6 caracteres" required className="w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-[#F5EFE4] border border-[#E2D5BE] text-[#2A2420] placeholder-[#9E9080] text-xs focus:outline-none focus:border-[#B88736] focus:ring-2 focus:ring-[#B88736]/20 transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[#8A7C6D] hover:text-[#2A2420] transition-colors cursor-pointer">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <button type="button" onClick={() => setLgpdAccepted(!lgpdAccepted)} className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${lgpdAccepted ? "bg-[#B88736] border-[#B88736] text-white" : "border-[#C5B7A0] bg-[#F5EFE4]"}`}>
                  {lgpdAccepted && <Check className="w-3 h-3 stroke-3" />}
                </button>
                <p className="text-[10.5px] text-[#695C50] leading-relaxed">
                  Declaro que li e concordo com os Termos de Uso e a Política de Privacidade. Autorizo o uso dos meus dados exclusivamente para a condução do meu autocuidado, conforme a LGPD.
                </p>
              </div>

              <button type="submit" disabled={!lgpdAccepted} className="w-full py-3.5 px-6 rounded-xl font-medium text-sm text-white flex items-center justify-center gap-2 bg-gradient-to-r from-[#D6A756] via-[#B88736] to-[#9E6E24] hover:brightness-105 active:scale-[0.99] transition-all shadow-md shadow-[#B88736]/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                <span>Criar conta e começar</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8A7C6D] pt-1">
                <Lock className="w-3.5 h-3.5 text-[#B88736]" />
                <span>Seus dados estão protegidos. Este é um ambiente seguro.</span>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-[#E8DFC8] grid grid-cols-4 gap-2 text-center text-[10px] text-[#695C50]">
              <div className="flex flex-col items-center gap-1"><ShieldCheck className="w-4 h-4 text-[#B88736]" /><span>Ambiente seguro</span></div>
              <div className="flex flex-col items-center gap-1"><Lock className="w-4 h-4 text-[#B88736]" /><span>100% sigiloso</span></div>
              <div className="flex flex-col items-center gap-1"><Heart className="w-4 h-4 text-[#B88736]" /><span>Sem julgamento</span></div>
              <div className="flex flex-col items-center gap-1"><Sun className="w-4 h-4 text-[#5E7153]" /><span>Voltar para si</span></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};