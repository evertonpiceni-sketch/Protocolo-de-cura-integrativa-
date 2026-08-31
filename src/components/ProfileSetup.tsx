import React, { useState } from 'react';
import { UserPlus, LogIn, Sparkles, Shield, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { UserAccount } from '../types';

interface ProfileSetupProps {
  onComplete: (account: UserAccount) => void;
}

const buildAccount = (data: any, extra: { fullName?: string; birthDate?: string; birthTime?: string; birthCity?: string; phone?: string }): UserAccount => {
  const user = data.user;
  const profile = {
    ...user.profile,
    name: user.profile?.name || extra.fullName || user.fullName || user.login,
    fullName: user.profile?.fullName || extra.fullName || user.fullName || user.login,
    birthDate: user.profile?.birthDate || extra.birthDate || '',
    birthTime: user.profile?.birthTime || extra.birthTime || '',
    birthCity: user.profile?.birthCity || extra.birthCity || '',
    email: user.profile?.email || user.email || '',
    phone: user.profile?.phone || extra.phone || '',
    login: user.profile?.login || user.login,
    currentStreak: user.profile?.currentStreak ?? 0,
    longestStreak: user.profile?.longestStreak ?? 0,
    audioEnabled: user.profile?.audioEnabled ?? true,
    bgMusicVolume: user.profile?.bgMusicVolume ?? 0.5,
    voiceVolume: user.profile?.voiceVolume ?? 0.8,
    bgMusicType: user.profile?.bgMusicType ?? '528hz',
    plan: user.plan || user.profile?.plan || 'free'
  };

  return {
    fullName: user.fullName || extra.fullName || user.login,
    birthDate: extra.birthDate || profile.birthDate,
    birthTime: extra.birthTime || profile.birthTime,
    birthCity: extra.birthCity || profile.birthCity,
    email: user.email || profile.email || '',
    phone: extra.phone,
    login: user.login,
    password: '',
    plan: user.plan || 'free',
    profile,
    progress: user.progress || []
  };
};

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regLogin, setRegLogin] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const selectTab = (tab: 'register' | 'login') => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanLogin = regLogin.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    if (!fullName.trim()) return setError('Por favor, informe seu nome completo.');
    if (!birthDate) return setError('Por favor, informe sua data de nascimento.');
    if (!cleanEmail || !cleanEmail.includes('@')) return setError('Por favor, informe um e-mail válido.');
    if (cleanLogin.length < 3) return setError('O login deve ter pelo menos 3 caracteres.');
    if (regPassword.length < 6) return setError('A senha deve ter pelo menos 6 caracteres.');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: cleanLogin, password: regPassword, fullName: fullName.trim(), email: cleanEmail })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Não foi possível concluir o cadastro.');
        return;
      }

      const account = buildAccount(data, { fullName: fullName.trim(), birthDate, birthTime, birthCity, phone });

      // Persist registration-only profile fields immediately after the auth cookie is issued.
      // This prevents birth data/phone from disappearing after a refresh.
      const syncRes = await fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: account.profile, progress: account.progress })
      });

      if (!syncRes.ok) {
        setError('A conta foi criada, mas não foi possível salvar todos os dados do perfil. Tente novamente.');
        return;
      }

      setSuccess('Cadastro realizado com sucesso. Preparando seu espaço...');
      setTimeout(() => onComplete(account), 500);
    } catch {
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const cleanLogin = login.trim().toLowerCase();
    if (!cleanLogin || !password) return setError('Informe seu login e sua senha.');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: cleanLogin, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Credenciais inválidas.');
        return;
      }
      onComplete(buildAccount(data, {}));
    } catch {
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 md:p-8" id="profile-setup-view">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.10)_0,transparent_60%)] pointer-events-none" />
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="mx-auto w-20 h-20 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles size={34} />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-semibold">Terapia Integrada</span>
          <h1 className="text-xl md:text-2xl font-medium">Olá! Boas-vindas ao Protocolo Éverton Piceni</h1>
          <p className="text-xs text-slate-400">Cura e Alinhamento Multidimensional de 21 Dias</p>
        </div>

        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800" id="auth-tabs">
          <button type="button" onClick={() => selectTab('register')} className={`py-3 text-sm rounded-lg flex items-center justify-center gap-2 transition ${activeTab === 'register' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            <UserPlus size={16} /> Criar Conta
          </button>
          <button type="button" onClick={() => selectTab('login')} className={`py-3 text-sm rounded-lg flex items-center justify-center gap-2 transition ${activeTab === 'login' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            <LogIn size={16} /> Entrar
          </button>
        </div>

        {error && <div className="rounded-xl border border-rose-800 bg-rose-950/40 p-3 text-sm text-rose-300">{error}</div>}
        {success && <div className="rounded-xl border border-emerald-800 bg-emerald-950/40 p-3 text-sm text-emerald-300">{success}</div>}

        {activeTab === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <label className="space-y-1.5"><span className="text-xs text-slate-400">Nome completo *</span><div className="relative"><User size={16} className="absolute left-3 top-3.5 text-slate-500" /><input required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3 pl-9" placeholder="Seu nome" /></div></label>
              <label className="space-y-1.5"><span className="text-xs text-slate-400">E-mail *</span><div className="relative"><Mail size={16} className="absolute left-3 top-3.5 text-slate-500" /><input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3 pl-9" placeholder="voce@email.com" /></div></label>
              <label className="space-y-1.5"><span className="text-xs text-slate-400">Data de nascimento *</span><input required type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3" /></label>
              <label className="space-y-1.5"><span className="text-xs text-slate-400">Hora de nascimento</span><input type="time" value={birthTime} onChange={e => setBirthTime(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3" /></label>
              <label className="space-y-1.5"><span className="text-xs text-slate-400">Cidade de nascimento</span><input value={birthCity} onChange={e => setBirthCity(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3" placeholder="Cidade" /></label>
              <label className="space-y-1.5"><span className="text-xs text-slate-400">WhatsApp</span><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3" placeholder="(00) 00000-0000" /></label>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="space-y-1.5"><span className="text-xs text-slate-400">Crie seu login *</span><input required autoComplete="username" value={regLogin} onChange={e => setRegLogin(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3" placeholder="seu_login" /></label>
              <label className="space-y-1.5"><span className="text-xs text-slate-400">Crie sua senha *</span><div className="relative"><Lock size={16} className="absolute left-3 top-3.5 text-slate-500" /><input required minLength={6} type="password" autoComplete="new-password" value={regPassword} onChange={e => setRegPassword(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3 pl-9" placeholder="mínimo 6 caracteres" /></div></label>
            </div>
            <div className="flex items-start gap-2 text-[11px] text-slate-500"><Shield size={15} className="text-emerald-400 shrink-0 mt-0.5" /> Seus dados de acesso são enviados ao servidor por uma rota de autenticação protegida.</div>
            <button disabled={loading} type="submit" className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 p-3.5 font-medium flex items-center justify-center gap-2">{loading ? 'Criando sua conta...' : 'Criar minha conta'} {!loading && <ArrowRight size={17} />}</button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="space-y-1.5 block"><span className="text-xs text-slate-400">Login</span><input required autoComplete="username" value={login} onChange={e => setLogin(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3" placeholder="seu_login" /></label>
            <label className="space-y-1.5 block"><span className="text-xs text-slate-400">Senha</span><input required type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3" placeholder="Sua senha" /></label>
            <button disabled={loading} type="submit" className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 p-3.5 font-medium">{loading ? 'Entrando...' : 'Entrar no meu espaço'}</button>
          </form>
        )}
      </div>
    </main>
  );
}
