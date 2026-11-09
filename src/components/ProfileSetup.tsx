import { ACCESS_SUPPORT_URL } from '../lib/accessRecoveryPatch';
import { syncUserState } from '../lib/userSync';
import { clearPendingProfileSync, queuePendingProfileSync } from '../lib/pendingProfileSync';
import React, { useState } from 'react';
import { User, Sparkles, Shield, Heart, Lock, Mail, Calendar as CalendarIcon, LogIn, UserPlus, KeyRound, CheckCircle2, ArrowLeft, Clock, MapPin, Tag, Phone, Volume2, Loader2 } from 'lucide-react';
import { UserAccount } from '../types';
import { APPROVED_LOGO_DATA_URI } from './ApprovedBrand';
import { normalizeBrazilianNationalPhone } from '../utils/phone';
import { getLocalDateString } from '../utils/date';

const formatBrazilianPhone = (value: string) => {
  const digits = normalizeBrazilianNationalPhone(value);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

interface ProfileSetupProps {
  onComplete: (account: UserAccount) => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>(() => {
    try {
      const hasAccounts = localStorage.getItem('cura_accounts') || localStorage.getItem('cura_integrada_login');
      return hasAccounts ? 'login' : 'register';
    } catch (e) {
      return 'register';
    }
  });
  
  // Register Fields
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regLogin, setRegLogin] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCoupon, setRegCoupon] = useState('');
  const [musicType, setMusicType] = useState<'528hz' | '432hz' | '963hz' | '741hz' | 'waves' | 'none'>('528hz');
  const [voiceChoice, setVoiceChoice] = useState<'masculina' | 'feminina'>('masculina');
  // Login Fields
  const [logLogin, setLogLogin] = useState('');
  const [logPassword, setLogPassword] = useState('');

  // General state
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceUnavailable, setServiceUnavailable] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');
    setSuccessMsg('');
    setServiceUnavailable(false);

    if (!fullName.trim()) return setError('Por favor, insira seu nome completo.');
    if (!birthDate) return setError('Por favor, informe sua data de nascimento.');
    if (birthDate > getLocalDateString()) return setError('A data de nascimento não pode estar no futuro.');
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) return setError('Por favor, insira um e-mail válido.');
    const cleanLogin = regLogin.trim().toLowerCase();
    if (!cleanLogin || cleanLogin.length < 3) return setError('O login deve ter pelo menos 3 caracteres.');
    if (!regPassword || regPassword.length < 6) return setError('A senha deve ter pelo menos 6 caracteres.');

    let registrationSucceeded = false;
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: cleanLogin, password: regPassword, fullName, email: cleanEmail })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServiceUnavailable(res.status >= 500);
        setError(data.error || (res.status >= 500 ? 'O cadastro está temporariamente indisponível. Tente novamente em alguns instantes.' : 'Não foi possível criar sua conta. Confira os dados informados.'));
        return;
      }
      
      const profilePatch = {
        birthDate,
        birthTime,
        birthCity,
        phone,
        bgMusicType: musicType,
        voiceType: voiceChoice,
        preferredVoiceGender: voiceChoice,
        coupon: regCoupon
      };
      const profileData = { ...data.user.profile, ...profilePatch };
      
      const newAccount = {
        login: data.user.login,
        email: data.user.email,
        profile: profileData,
        progress: data.user.progress,
        role: data.user.role,
        specificTreatments: []
      } as any;
      
      // The account already exists at this point. A transient profile-sync
      // failure must not force the user to register again with the same login.
      let profileSynced = false;
      let pendingProfileQueued = false;
      try {
        await syncUserState(
          { profile: profileData, progress: data.user.progress },
          { maxAttempts: 3 },
        );
        clearPendingProfileSync(data.user.login);
        profileSynced = true;
      } catch (syncError) {
        console.warn('Profile sync failed after registration retries', syncError);
        pendingProfileQueued = queuePendingProfileSync(data.user.login, profilePatch);
      }

      if (profileSynced) {
        setSuccessMsg('Conta criada com sucesso! Iniciando seu portal...');
      } else if (pendingProfileQueued) {
        setSuccessMsg('Conta criada. Os dados complementares ficaram salvos neste dispositivo e serão reenviados quando a conexão permitir.');
      } else {
        console.warn('Account created, but pending profile data could not be queued locally.');
        setSuccessMsg('Conta criada, mas os dados complementares ainda não foram confirmados no servidor. Mantenha esta sessão aberta até recuperar a conexão.');
      }
      registrationSucceeded = true;
      setTimeout(() => { onComplete(newAccount); setIsSubmitting(false); }, 1500);
      return;
    } catch (err) {
      console.error(err);
      setServiceUnavailable(true);
      setError('Não conseguimos conectar ao serviço agora. Verifique sua internet e tente novamente.');
    } finally {
      // Keep the form locked during the successful transition into the app.
      // Failures release it so the person can retry without losing their fields.
      if (!registrationSucceeded) setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');
    setSuccessMsg('');
    setServiceUnavailable(false);

    const cleanLogin = logLogin.trim().toLowerCase();
    if (!cleanLogin) {
      setError('Por favor, preencha o campo de login.');
      return;
    }
    if (!logPassword) {
      setError('Por favor, preencha sua senha.');
      return;
    }

    let loginSucceeded = false;
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: cleanLogin, password: logPassword })
      });
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        setServiceUnavailable(res.status >= 500);
        setError(data.error || (res.status >= 500 ? 'O acesso está temporariamente indisponível. Tente novamente em alguns instantes.' : 'Não foi possível entrar. Confira seu login e senha.'));
        return;
      }
      
      const account: UserAccount = {
        login: data.user.login,
        email: data.user.email || '',
        password: '',
        fullName: data.user.fullName || '',
        birthDate: data.user.profile?.birthDate || '',
        profile: data.user.profile,
        progress: data.user.progress || [],
        isAdmin: data.user.role === 'admin'
      };
      
      setSuccessMsg(`Que bom ter você de volta, ${account.fullName || account.login}!`);
      loginSucceeded = true;
      setTimeout(() => {
        onComplete(account);
        setIsSubmitting(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setServiceUnavailable(true);
      setError('Não conseguimos conectar ao serviço agora. Verifique sua internet e tente novamente.');
    } finally {
      if (!loginSucceeded) setIsSubmitting(false);
    }
  };

  return (
    <div className="ep-auth-prestyle min-h-dvh text-[#302E2A] flex items-start md:items-center justify-center px-3 sm:px-4 md:px-8 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] md:py-8" id="profile-setup-view">
      <div className="ep-auth-nature-bg fixed inset-0 pointer-events-none" />
      <div className="ep-auth-light-vignette absolute inset-0 pointer-events-none" />

      <div className="ep-auth-card w-full max-w-xl rounded-[1.9rem] p-5 sm:p-7 md:p-8 space-y-6 relative overflow-hidden" id="onboarding-card">
        {/* Decorative corner glow */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#A99B84]/10 rounded-full blur-xl pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="ep-brand-signature-wrap w-16 h-16 rounded-full overflow-hidden mx-auto mb-5 flex items-center justify-center">
            <img src={APPROVED_LOGO_DATA_URI} alt="Everton Piceni — Terapias Holísticas e Bem-Estar" className="ep-brand-signature w-full h-full object-contain" style={{ opacity: 0.3 }} />
          </div>
          <span className="text-xs font-sans tracking-widest text-[#817460] uppercase font-semibold">Terapias Holísticas e Bem-Estar</span>
          <h1 className="text-xl md:text-2xl font-display font-medium text-[#2A2420] leading-tight">
            Que bom ter você aqui.<br />Este é o seu momento de transformação
          </h1>
          <p className="text-sm text-[#5C5248]">
            Um espaço seguro para se reconectar, equilibrar sua energia e voltar para si.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1 bg-white rounded-xl border border-[#E5DAC6]/60" id="auth-tabs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setError('');
              setSuccessMsg('');
            }}
            className={`min-h-11 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'register'
                ? 'bg-[#A99B84] text-white shadow'
                : 'text-[#5C5248] hover:text-[#2A2420]'
            }`}
          >
            <UserPlus size={14} />
            <span>Criar Conta</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setError('');
              setSuccessMsg('');
            }}
            className={`min-h-11 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'login' || activeTab === 'forgot'
                ? 'bg-[#A99B84] text-white shadow'
                : 'text-[#5C5248] hover:text-[#2A2420]'
            }`}
          >
            <LogIn size={14} />
            <span>Entrar / Acesso</span>
          </button>
        </div>

        {/* Display feedback messages */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-4 rounded-xl text-center" id="auth-error" role="alert">
            <p>{error}</p>
            {serviceUnavailable && (
              <button type="button" onClick={() => window.location.reload()} className="mt-3 min-h-11 rounded-lg border border-rose-300 bg-white px-4 font-semibold text-rose-700 hover:bg-rose-100 transition">
                Tentar novamente
              </button>
            )}
          </div>
        )}
        {successMsg && (
          <div className="bg-[#F7F3E8] border border-[#E5DAC6] text-[#5C5248] text-xs p-3 rounded-xl text-center" id="auth-success">
            {successMsg}
          </div>
        )}

        {activeTab === 'register' ? (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegister} className="space-y-4" id="register-form">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="reg-fullname" className="block text-[11px] font-sans text-[#5C5248] uppercase tracking-wider">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#85786C]">
                  <User size={16} />
                </div>
                <input
                  id="reg-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo para o decreto"
                  className="w-full bg-white border border-[#E5DAC6]/80 focus:border-[#A99B84] focus:ring-1 focus:ring-[#A99B84]/30 text-[#2A2420] rounded-xl py-2.5 pl-10 pr-4 text-xs transition duration-150 outline-none placeholder-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label htmlFor="reg-birthdate" className="block text-[11px] font-sans text-[#5C5248] uppercase tracking-wider">
                  Data de Nascimento
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#85786C]">
                    <CalendarIcon size={16} />
                  </div>
                  <input
                    id="reg-birthdate"
                    type="date"
                    required
                    max={getLocalDateString()}
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-white border border-[#E5DAC6]/80 focus:border-[#A99B84] focus:ring-1 focus:ring-[#A99B84]/30 text-[#2A2420] rounded-xl py-2.5 pl-10 pr-4 text-xs transition duration-150 outline-none [color-scheme:light]"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="reg-email" className="block text-[11px] font-sans text-[#5C5248] uppercase tracking-wider">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#85786C]">
                    <Mail size={16} />
                  </div>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@email.com"
                    className="w-full bg-white border border-[#E5DAC6]/80 focus:border-[#A99B84] focus:ring-1 focus:ring-[#A99B84]/30 text-[#2A2420] rounded-xl py-2.5 pl-10 pr-4 text-xs transition duration-150 outline-none placeholder-slate-600"
                  />
                </div>
              </div>

              {/* WhatsApp / Phone */}
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="reg-phone" className="block text-[10px] font-sans text-[#5C5248] uppercase tracking-wider flex items-center justify-between">
                  <span>Telefone / WhatsApp (Opcional)</span>
                  <span className="text-[10px] text-[#756B5D] font-sans">Acolhimento & Mensagens</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#85786C]">
                    <Phone size={16} className="text-[#817460]" />
                  </div>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatBrazilianPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-white border border-[#E5DAC6]/80 focus:border-[#A99B84] focus:ring-1 focus:ring-[#A99B84]/25 text-[#2A2420] rounded-xl py-2.5 pl-10 pr-4 text-xs transition duration-150 outline-none placeholder-slate-600"
                  />
                </div>
                <span className="text-[10px] text-[#85786C] font-sans block">
                  Para envio de mensagens de acolhimento e confirmação.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="reg-login" className="block text-xs font-sans text-[#5C5248] uppercase tracking-wider">Nome de usuário</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#817460]/80"><User size={16} /></div>
                  <input id="reg-login" type="text" required autoComplete="username" value={regLogin} onChange={(e) => setRegLogin(e.target.value)} placeholder="ex: joaosilva" className="w-full min-h-12 bg-white border border-[#E5DAC6] focus:border-[#A99B84] focus:ring-1 focus:ring-[#A99B84]/30 text-[#2A2420] rounded-xl pl-10 pr-4 text-base transition outline-none placeholder-slate-600" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="reg-password" className="block text-xs font-sans text-[#5C5248] uppercase tracking-wider">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#85786C]"><Lock size={16} /></div>
                  <input id="reg-password" type="password" required minLength={6} autoComplete="new-password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className="w-full min-h-12 bg-white border border-[#E5DAC6] focus:border-[#A99B84] focus:ring-1 focus:ring-[#A99B84]/30 text-[#2A2420] rounded-xl pl-10 pr-4 text-base transition outline-none placeholder-slate-600" />
                </div>
              </div>
            </div>

            <details className="group rounded-2xl border border-[#E5DAC6] bg-white/70">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-semibold text-[#5C5248]">
                <span className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#A99B84]" />
                  Personalizar mapa, voz e frequência
                </span>
                <span className="text-xs text-[#817460] group-open:hidden">Opcional</span>
                <span className="hidden text-xs text-[#817460] group-open:inline">Fechar</span>
              </summary>
              <div className="space-y-4 border-t border-[#E5DAC6] p-4">
            {/* Astral Map Data Section */}
            <div className="p-3.5 rounded-2xl bg-white/75 border border-[#E5DAC6] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-sans uppercase tracking-wider text-[#817460] font-bold flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#A99B84]" />
                  <span>Cálculo do seu Mapa Astral (Presente)</span>
                </span>
                <span className="text-[9px] font-sans px-2 py-0.5 rounded-full bg-[#A99B84]/10 text-[#817460] border border-[#A99B84]/25">
                  Gratuito
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="reg-birthtime" className="block text-[11px] font-sans text-[#5C5248] uppercase tracking-wider">
                    Horário (Opcional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#85786C]">
                      <Clock size={15} />
                    </div>
                    <input
                      id="reg-birthtime"
                      type="time"
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="w-full bg-white border border-[#E5DAC6]/80 focus:border-[#A99B84] focus:ring-1 focus:ring-[#A99B84]/30 text-[#2A2420] rounded-xl py-2 pl-9 pr-3 text-xs transition duration-150 outline-none [color-scheme:light]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="reg-birthcity" className="block text-[11px] font-sans text-[#5C5248] uppercase tracking-wider">
                    Cidade de Nascimento (Opcional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#85786C]">
                      <MapPin size={15} />
                    </div>
                    <input
                      id="reg-birthcity"
                      type="text"
                      value={birthCity}
                      onChange={(e) => setBirthCity(e.target.value)}
                      placeholder="ex: Porto Alegre - RS"
                      className="w-full bg-white border border-[#E5DAC6]/80 focus:border-[#A99B84] focus:ring-1 focus:ring-[#A99B84]/30 text-[#2A2420] rounded-xl py-2 pl-9 pr-3 text-xs transition duration-150 outline-none placeholder-slate-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-coupon" className="block text-[11px] font-sans text-[#5C5248] uppercase tracking-wider">
                Possui Cupom do Terapeuta? (Opcional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#817460]">
                  <Tag size={16} />
                </div>
                <input
                  id="reg-coupon"
                  type="text"
                  value={regCoupon}
                  onChange={(e) => setRegCoupon(e.target.value.toUpperCase())}
                  placeholder="Digite seu código de cupom aqui..."
                  className="w-full bg-white border border-[#E5DAC6]/80 focus:border-[#A99B84] focus:ring-1 focus:ring-[#A99B84] text-[#302E2A] rounded-xl py-2.5 pl-10 pr-4 text-xs transition duration-150 outline-none uppercase font-sans placeholder-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2 pt-1" id="voice-gender-selector">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <label className="block text-[10px] font-sans text-[#817460] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Volume2 size={13} className="text-[#817460]" />
                  <span>Preferência de timbre</span>
                </label>
                <span className="text-[10px] text-[#5C5248]">A voz neural será escolhida em Ajustes de áudio após a entrada.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Preferência de timbre">
                <div
                  onClick={() => setVoiceChoice('masculina')}
                  className={`p-3.5 rounded-2xl border transition duration-150 cursor-pointer flex flex-col justify-between ${
                    voiceChoice === 'masculina'
                      ? 'bg-[#F1EFE9] border-[#A99B84] shadow-sm ring-1 ring-[#A99B84]/25'
                      : 'bg-white/70 border-[#E3DFD6] hover:border-[#A99B84]/50 text-[#5C5248]'
                  }`}
                >
                  <input className="sr-only" type="radio" name="guided-voice" aria-label="Voz masculina" checked={voiceChoice === 'masculina'} onChange={() => setVoiceChoice('masculina')} onClick={event => event.stopPropagation()} />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 size={16} className="text-[#817460]" />
                        <span className="text-xs font-bold text-[#2A2420]">Voz masculina</span>
                      </div>
                      {voiceChoice === 'masculina' && <span className="w-2 h-2 rounded-full bg-[#A99B84]" />}
                    </div>
                    <p className="text-[10px] text-[#5C5248] leading-snug">
                      Voz masculina profunda, firme e serena para ancoramento, decretos quânticos e transmutação.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-[#E3DFD6]/80">
                    <span className="text-[9px] font-sans text-[#625E56] bg-[#F1EFE9] px-2 py-0.5 rounded">
                      Tom Terapêutico Natural
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setVoiceChoice('feminina')}
                  className={`p-3.5 rounded-2xl border transition duration-150 cursor-pointer flex flex-col justify-between ${
                    voiceChoice === 'feminina'
                      ? 'bg-[#F1EFE9] border-[#A99B84] shadow-sm ring-1 ring-[#A99B84]/25'
                      : 'bg-white/70 border-[#E3DFD6] hover:border-[#A99B84]/50 text-[#5C5248]'
                  }`}
                >
                  <input className="sr-only" type="radio" name="guided-voice" aria-label="Voz feminina" checked={voiceChoice === 'feminina'} onChange={() => setVoiceChoice('feminina')} onClick={event => event.stopPropagation()} />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 size={16} className="text-[#817460]" />
                        <span className="text-xs font-bold text-[#2A2420]">Voz Feminina Suave</span>
                      </div>
                      {voiceChoice === 'feminina' && <span className="w-2 h-2 rounded-full bg-[#A99B84]" />}
                    </div>
                    <p className="text-[10px] text-[#5C5248] leading-snug">
                      Voz feminina maternal, doce e pausada, ideal para relaxamento profundo, sono e Raio Rosa.
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-[#E3DFD6]/80">
                    <span className="text-[9px] font-sans text-[#625E56] bg-[#F1EFE9] px-2 py-0.5 rounded">
                      Acolhimento da Alma
                    </span>
                  </div>
                </div>
              </div>
              <p id="voice-preview-note" className="text-[10px] leading-relaxed text-[#625E56]">
                Esta escolha registra sua preferência de timbre. A voz neural e a amostra correspondente serão escolhidas em Ajustes de áudio depois que você entrar e confirmar um dos quatro estilos.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <label className="block text-[11px] font-sans text-[#5C5248] uppercase tracking-wider">
                Frequência Sonora Inicial
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" id="soundscape-selector">
                {[
                  { id: '528hz', name: '528Hz Harmonia', desc: 'Alpha-Beta (12Hz)' },
                  { id: '432hz', name: '432Hz Paz Natural', desc: 'Ondas Theta (5Hz)' },
                  { id: '963hz', name: '963Hz Conexão Contemplativa', desc: 'Conexão Superior' },
                  { id: '741hz', name: '741Hz Clareza', desc: 'Despertar Intuição' },
                  { id: 'waves', name: 'Brisa Oceânica', desc: 'Atmosfera Suave' },
                  { id: 'none', name: 'Apenas Voz', desc: 'Sem Fundo' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMusicType(opt.id as any)}
                    className={`p-2 rounded-xl border text-left transition duration-150 cursor-pointer ${
                      musicType === opt.id
                        ? 'bg-[#A99B84]/10 border-[#A99B84] text-[#2A2420] shadow-sm'
                        : 'bg-white border-[#E5DAC6] text-[#5C5248] hover:border-[#E5DAC6]'
                    }`}
                  >
                    <div className="text-[11px] font-bold font-sans text-[#2A2420]">{opt.name}</div>
                    <div className="text-[9px] text-[#5C5248]">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
              </div>
            </details>

            <div className="flex items-start gap-2 mt-4 mb-2">
              <input 
                type="checkbox" 
                id="lgpd-consent" 
                required 
                className="mt-0.5 shrink-0 bg-[#FBF8F2] border-[#E5DAC6] rounded text-[#817460] focus:ring-[#A99B84]" 
              />
              <label htmlFor="lgpd-consent" className="text-xs text-[#5C5248] leading-relaxed">
                Declaro que li e concordo com os <a href="/termos.html" target="_blank" rel="noreferrer" className="text-[#817460] underline underline-offset-2">Termos de Uso</a> e a <a href="/privacidade.html" target="_blank" rel="noreferrer" className="text-[#817460] underline underline-offset-2">Política de Privacidade</a>.
                Autorizo o tratamento dos meus dados (incluindo anamnese) estritamente para 
                a formulação de práticas integrativas, conforme a LGPD.
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-12 bg-[#A99B84] hover:bg-[#817460] disabled:cursor-wait disabled:opacity-70 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md text-sm tracking-wide cursor-pointer border-none mt-4"
              id="btn-complete-setup"
            >
              {isSubmitting ? <span className="flex items-center justify-center gap-2"><Loader2 size={18} className="animate-spin" /> Criando sua conta...</span> : 'Criar conta e começar'}
            </button>

          </form>
        ) : activeTab === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4" id="login-form">
            <div className="space-y-1.5">
              <label htmlFor="log-login" className="block text-[11px] font-sans text-[#5C5248] uppercase tracking-wider">
                Nome de Usuário (Login) ou E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#85786C]">
                  <User size={16} />
                </div>
                <input
                  id="log-login"
                  type="text"
                  required
                  value={logLogin}
                  onChange={(e) => setLogLogin(e.target.value)}
                  placeholder="Insira seu login ou e-mail cadastrado"
                  className="w-full bg-white border border-[#E5DAC6]/80 focus:border-[#A99B84] focus:ring-1 focus:ring-[#A99B84]/30 text-[#2A2420] rounded-xl py-3 pl-10 pr-4 text-xs transition duration-150 outline-none placeholder-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="log-password" className="block text-[11px] font-sans text-[#5C5248] uppercase tracking-wider">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('forgot');
                    setError('');
                    setSuccessMsg('');
                  }}
                  id="auth-forgot-password" className="text-[11px] text-[#71511C] hover:text-[#756B5D] transition cursor-pointer underline underline-offset-2"
                >
                  Ajuda para acessar
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#85786C]">
                  <Lock size={16} />
                </div>
                <input
                  id="log-password"
                  type="password"
                  required
                  value={logPassword}
                  onChange={(e) => setLogPassword(e.target.value)}
                  placeholder="Insira sua senha"
                  className="w-full bg-white border border-[#E5DAC6]/80 focus:border-[#A99B84] focus:ring-1 focus:ring-[#A99B84]/30 text-[#2A2420] rounded-xl py-3 pl-10 pr-4 text-xs transition duration-150 outline-none placeholder-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-12 bg-[#A99B84] hover:bg-[#817460] disabled:cursor-wait disabled:opacity-70 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md text-sm tracking-wide cursor-pointer border-none mt-4"
              id="btn-login-submit"
            >
              {isSubmitting ? <span className="flex items-center justify-center gap-2"><Loader2 size={18} className="animate-spin" /> Entrando...</span> : 'Entrar'}
            </button>

          </form>
        ) : (
          /* FORGOT PASSWORD FORM */
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError('');
                setSuccessMsg('');
              }}
              className="text-xs text-[#5C5248] hover:text-[#2A2420] flex items-center gap-1.5 transition mb-2 cursor-pointer"
            >
              <ArrowLeft size={14} /> Voltar ao Login
            </button>
            <div className="text-center p-6 bg-white rounded-xl border border-[#E5DAC6]/80 space-y-3">
              <Shield size={32} className="text-[#817460] mx-auto" />
              <h3 className="text-sm font-semibold text-[#2A2420]">Ajuda para acessar</h3>
              <p className="text-xs text-[#5C5248] leading-relaxed">
                A recuperação automática de senha ainda não está disponível. Para recuperar o acesso, fale diretamente com o suporte.
              </p>
              <a href={ACCESS_SUPPORT_URL} target="_blank" rel="noopener noreferrer" data-access-support-link="true" className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#C9C2B7] bg-[#E4E0D7] px-4 py-3 text-sm font-semibold text-[#302E2A] hover:bg-[#CFC8BC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A99B84]">Falar com o suporte no WhatsApp</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
