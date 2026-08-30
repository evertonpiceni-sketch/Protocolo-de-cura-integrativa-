import React, { useState } from 'react';
import { UserAccount } from '../types';

interface ProfileSetupProps {
  onComplete: (account: UserAccount) => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: login.trim().toLowerCase(), password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao realizar login.');
        return;
      }
      const account: UserAccount = {
        login: data.user.login,
        email: data.user.email || '',
        password: '',
        fullName: data.user.fullName || '',
        profile: data.user.profile,
        progress: data.user.progress || []
      };
      onComplete(account);
    } catch {
      setError('Erro de conexão ao processar o login.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">Protocolo de Cura Integrada</h1>
        <p className="text-sm text-slate-400">Acesse sua conta para continuar.</p>
        {error && <div className="rounded-lg border border-rose-800 bg-rose-950/40 p-3 text-sm text-rose-300">{error}</div>}
        <input aria-label="Login" value={login} onChange={e => setLogin(e.target.value)} required className="w-full rounded-lg bg-slate-950 border border-slate-700 p-3" placeholder="Login" />
        <input aria-label="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full rounded-lg bg-slate-950 border border-slate-700 p-3" placeholder="Senha" />
        <button type="submit" className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 p-3 font-medium">Entrar</button>
      </form>
    </main>
  );
}
