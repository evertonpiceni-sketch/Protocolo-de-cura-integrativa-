/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { User, Sparkles, Shield, Heart, Lock, Mail, Calendar as CalendarIcon, LogIn, UserPlus, KeyRound, CheckCircle2, ArrowLeft, Clock, MapPin, Tag, Phone, Volume2, Play, Square, Loader2 } from 'lucide-react';
import { UserAccount, UserProfile, DayProgress } from '../types';
import { calculateAstralMap } from '../utils/astrology';

interface ProfileSetupProps {
  onComplete: (account: UserAccount) => void;
}

const LOCAL_STORAGE_KEY_ACCOUNTS = 'cura_integrada_accounts_v1';

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('register');
  
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
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [loadingVoiceType, setLoadingVoiceType] = useState<'masculina' | 'feminina' | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopVoicePreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingPreview(false);
    setLoadingVoiceType(null);
  };

  const playVoicePreview = async (gender: 'masculina' | 'feminina') => {
    if (isPlayingPreview) {
      stopVoicePreview();
      return;
    }

    setLoadingVoiceType(gender);
    const sampleText = gender === 'masculina'
      ? "Olá, eu sou Éverton Rodrigo Piceni. Seja muito bem-vindo ao seu Protocolo de Cura Integrada e alinhamento do seu poder pessoal."
      : "Olá, seja bem-vinda ao seu espaço sagrado de paz profunda, amor incondicional e acolhimento da alma.";

    try {
      const response = await fetch('/api/elevenlabs/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sampleText,
          voiceId: gender === 'masculina' ? 'Marcus' : 'Rachel',
          stability: 0.45,
          similarityBoost: 0.75
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        previewAudioRef.current = audio;

        audio.onended = () => {
          setIsPlayingPreview(false);
          setLoadingVoiceType(null);
        };
        audio.onerror = () => {
          setIsPlayingPreview(false);
          setLoadingVoiceType(null);
        };

        await audio.play();
        setIsPlayingPreview(true);
        setLoadingVoiceType(null);
        return;
      }
    } catch (e) {
      console.warn("ElevenLabs preview fallback to native TTS", e);
    }

    // Fallback Web Speech
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(sampleText);
      utterance.lang = 'pt-BR';
      const voices = window.speechSynthesis.getVoices();
      
      const ptVoices = voices.filter(v => v.lang.startsWith('pt') || v.lang.includes('BR'));
      if (gender === 'feminina') {
        const femaleVoice = ptVoices.find(v => 
          v.name.toLowerCase().includes('female') || 
          v.name.toLowerCase().includes('maria') || 
          v.name.toLowerCase().includes('francisca') || 
          v.name.toLowerCase().includes('luciana') || 
          v.name.toLowerCase().includes('leticia') || 
          v.name.toLowerCase().includes('victoria') ||
          v.name.toLowerCase().includes('zira')
        ) || ptVoices[0];
        if (femaleVoice) utterance.voice = femaleVoice;
        utterance.pitch = 1.05;
        utterance.rate = 0.88;
      } else {
        const maleVoice = ptVoices.find(v => 
          v.name.toLowerCase().includes('male') || 
          v.name.toLowerCase().includes('antonio') || 
          v.name.toLowerCase().includes('felipe') || 
          v.name.toLowerCase().includes('daniel') || 
          v.name.toLowerCase().includes('ricardo') ||
          v.name.toLowerCase().includes('david')
        ) || ptVoices[0];
        if (maleVoice) utterance.voice = maleVoice;
        utterance.pitch = 0.92;
        utterance.rate = 0.86;
      }

      utterance.onend = () => {
        setIsPlayingPreview(false);
        setLoadingVoiceType(null);
      };
      utterance.onerror = () => {
        setIsPlayingPreview(false);
        setLoadingVoiceType(null);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlayingPreview(true);
      setLoadingVoiceType(null);
    } else {
      setLoadingVoiceType(null);
    }
  };

  // Login Fields
  const [logLogin, setLogLogin] = useState('');
  const [logPassword, setLogPassword] = useState('');

  // Forgot Password Fields
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotBirthDate, setForgotBirthDate] = useState('');
  const [matchedAccount, setMatchedAccount] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'verify' | 'reset' | 'done'>('verify');

  // General state
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Helper to load accounts
  const getAccounts = (): UserAccount[] => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ACCOUNTS);
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  };

  // Helper to save accounts
  const saveAccounts = (accounts: UserAccount[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setError('Por favor, insira seu nome completo.');
      return;
    }
    if (!birthDate) {
      setError('Por favor, informe sua data de nascimento.');
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }
    const cleanLogin = regLogin.trim().toLowerCase();
    if (!cleanLogin || cleanLogin.length < 3) {
      setError('O login deve ter pelo menos 3 caracteres.');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    const accounts = getAccounts();

    // 1. Check if login already exists
    const loginExists = accounts.some(acc => acc.login.toLowerCase() === cleanLogin);
    if (loginExists) {
      setError('Este login já está em uso por outro consulente. Por favor, escolha outro nome de usuário.');
      return;
    }

    // 2. Check if email already exists
    const emailExists = accounts.some(acc => acc.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      setError('Este e-mail já possui uma conta cadastrada. Por favor, clique na aba "Entrar / Acesso" ou recupere sua senha.');
      return;
    }

        // Check if free 7-day coupon was provided
    const cleanCoupon = regCoupon.trim().toUpperCase();
    const isFree7dCouponMatch = ['VIP7', 'GRATIS7', 'VIP', 'TESTEVIP', 'CURA7', '7DIAS', 'SETE7', 'PICENI7'].includes(cleanCoupon);
    
    let isFree7dCoupon = false;
    if (isFree7dCouponMatch) {
      const vipCount = accounts.filter(acc => acc.profile.subscriptionPlan === 'teste_vip_7d').length;
      if (vipCount >= 10) {
        setError('O limite de 10 vagas para o cupom VIP7 já foi preenchido. Você ainda pode usar o app gratuitamente no Dia 1, ou assinar o plano PRO para desbloquear a jornada completa.');
        return;
      }
      isFree7dCoupon = true;
    }

    // Calculate Astral Map
    const astralMap = calculateAstralMap(birthDate, birthTime.trim(), birthCity.trim());

    // Prepare default 21 days progress
    const defaultProgress: DayProgress[] = Array.from({ length: 21 }, (_, index) => ({
      dayNumber: index + 1,
      completed: false,
      journalText: '',
      mood: 5
    }));

    // Prepare profile
    const profile: UserProfile = {
      name: fullName.trim(),
      fullName: fullName.trim(),
      birthDate,
      birthTime: birthTime.trim() || undefined,
      birthCity: birthCity.trim() || undefined,
      email: cleanEmail,
      phone: phone.trim() || undefined,
      login: cleanLogin,
      startedAt: new Date().toISOString(),
      currentStreak: 0,
      longestStreak: 0,
      audioEnabled: true,
      bgMusicVolume: 0.5,
      voiceVolume: 0.8,
      bgMusicType: musicType,
      plan: isFree7dCoupon ? 'pro' : 'free',
      subscriptionPlan: isFree7dCoupon ? 'teste_vip_7d' : undefined,
      subscriptionExpiresAt: isFree7dCoupon ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      voiceRate: 0.82,
      voicePitch: 1.0,
      preferredVoiceGender: voiceChoice,
      preferredVoice: voiceChoice === 'masculina' ? 'Marcus' : 'Rachel',
      voiceId: voiceChoice === 'masculina' ? 'Marcus' : '21m00Tcm4TlvDq8ikWAM',
      astralMap
    };

    const newAccount: UserAccount = {
      fullName: fullName.trim(),
      birthDate,
      birthTime: birthTime.trim() || undefined,
      birthCity: birthCity.trim() || undefined,
      email: cleanEmail,
      phone: phone.trim() || undefined,
      login: cleanLogin,
      password: regPassword,
      plan: isFree7dCoupon ? 'pro' : 'free',
      profile,
      progress: defaultProgress
    };

    // Save account
    accounts.push(newAccount);
    saveAccounts(accounts);

    setSuccessMsg(
      isFree7dCoupon
        ? 'Conta criada com sucesso! 🌟 Cupom de 7 Dias Grátis ativado e seu Mapa Astral já foi calculado!'
        : 'Conta criada com sucesso! Seu Mapa Astral e Energético foi calculado de presente para você.'
    );

    setTimeout(() => {
      onComplete(newAccount);
    }, 1200);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanLogin = logLogin.trim().toLowerCase();
    if (!cleanLogin) {
      setError('Por favor, preencha o campo de login.');
      return;
    }
    if (!logPassword) {
      setError('Por favor, preencha sua senha.');
      return;
    }

    const accounts = getAccounts();
    const account = accounts.find(acc => (acc.login === cleanLogin || acc.email.toLowerCase() === cleanLogin) && acc.password === logPassword);

    if (!account) {
      setError('Login ou senha incorretos.');
      return;
    }

    setSuccessMsg(`Bem-vindo de volta, ${account.fullName}!`);
    setTimeout(() => {
      onComplete(account);
    }, 1000);
  };

  const handleVerifyForReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanId = forgotIdentifier.trim().toLowerCase();
    if (!cleanId) {
      setError('Por favor, informe seu login ou e-mail cadastrado.');
      return;
    }

    const accounts = getAccounts();
    const matched = accounts.find(acc => 
      acc.login === cleanId || acc.email.toLowerCase() === cleanId
    );

    if (!matched) {
      setError('Nenhuma conta encontrada com este login ou e-mail.');
      return;
    }

    // If birth date is provided, verify it (or allow if matched directly)
    if (forgotBirthDate && matched.birthDate && matched.birthDate !== forgotBirthDate) {
      setError('A data de nascimento informada não confere com o cadastro.');
      return;
    }

    setMatchedAccount(matched);
    setRecoveryStep('reset');
    setSuccessMsg(`Conta verificada para ${matched.fullName}! Defina sua nova senha.`);
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.length < 4) {
      setError('A nova senha deve ter no mínimo 4 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('As senhas digitadas não coincidem.');
      return;
    }
    if (!matchedAccount) {
      setError('Erro ao processar recuperação. Tente novamente.');
      return;
    }

    const accounts = getAccounts();
    const updatedAccounts = accounts.map(acc => {
      if (acc.login === matchedAccount.login) {
        return {
          ...acc,
          password: newPassword
        };
      }
      return acc;
    });

    saveAccounts(updatedAccounts);
    setRecoveryStep('done');
    setSuccessMsg('Senha alterada com sucesso! Você já pode entrar.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 md:p-8" id="profile-setup-view">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.08)_0,transparent_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(16,185,129,0.04)_0,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-xl bg-slate-900 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden" id="onboarding-card">
        {/* Decorative corner glow */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-inner">
            <Sparkles size={24} className="animate-pulse" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-semibold">Terapia Integrada</span>
          <h1 className="text-xl md:text-2xl font-display font-medium text-slate-100 leading-tight">
            Olá! Boas-vindas ao<br />Protocolo Éverton Piceni
          </h1>
          <p className="text-xs text-slate-400">
            Cura e Alinhamento Multidimensional de 21 Dias
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800/60" id="auth-tabs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setError('');
              setSuccessMsg('');
            }}
            className={`py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'register'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
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
            className={`py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'login' || activeTab === 'forgot'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn size={14} />
            <span>Entrar / Acesso</span>
          </button>
        </div>

        {/* Display feedback messages */}
        {error && (
          <div className="bg-rose-950/40 border border-rose-900/50 text-rose-300 text-xs p-3 rounded-xl text-center" id="auth-error">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-950/40 border border-emerald-900/50 text-emerald-300 text-xs p-3 rounded-xl text-center" id="auth-success">
            {successMsg}
          </div>
        )}

        {activeTab === 'register' ? (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegister} className="space-y-4" id="register-form">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="reg-fullname" className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User size={16} />
                </div>
                <input
                  id="reg-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo para o decreto"
                  className="w-full bg-slate-950 border border-slate-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs transition duration-150 outline-none placeholder-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label htmlFor="reg-birthdate" className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Data de Nascimento
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <CalendarIcon size={16} />
                  </div>
                  <input
                    id="reg-birthdate"
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs transition duration-150 outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="reg-email" className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail size={16} />
                  </div>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@email.com"
                    className="w-full bg-slate-950 border border-slate-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs transition duration-150 outline-none placeholder-slate-600"
                  />
                </div>
              </div>

              {/* WhatsApp / Phone */}
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="reg-phone" className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Telefone / WhatsApp (Opcional)</span>
                  <span className="text-[9px] text-emerald-400 font-sans">Acolhimento & Mensagens do Protocolo</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone size={16} className="text-emerald-400/80" />
                  </div>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-slate-950 border border-slate-800/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs transition duration-150 outline-none placeholder-slate-600"
                  />
                </div>
                <span className="text-[9px] text-slate-500 font-sans block">
                  Para envio de mensagens de acolhimento e confirmação do seu alinhamento energético.
                </span>
              </div>
            </div>

            {/* Astral Map Data Section (Hora e Cidade de Nascimento) */}
            <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-purple-300 font-bold flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-400" />
                  <span>Cálculo do seu Mapa Astral & Energético (Presente)</span>
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Gratuito
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Birth Time */}
                <div className="space-y-1">
                  <label htmlFor="reg-birthtime" className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Horário de Nascimento (Opcional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Clock size={15} />
                    </div>
                    <input
                      id="reg-birthtime"
                      type="time"
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800/80 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-100 rounded-xl py-2 pl-9 pr-3 text-xs transition duration-150 outline-none [color-scheme:dark]"
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 font-sans block">Para cálculo exato do Ascendente</span>
                </div>

                {/* Birth City */}
                <div className="space-y-1">
                  <label htmlFor="reg-birthcity" className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Cidade / Estado de Nascimento (Opcional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <MapPin size={15} />
                    </div>
                    <input
                      id="reg-birthcity"
                      type="text"
                      value={birthCity}
                      onChange={(e) => setBirthCity(e.target.value)}
                      placeholder="ex: Porto Alegre - RS"
                      className="w-full bg-slate-950 border border-slate-800/80 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-100 rounded-xl py-2 pl-9 pr-3 text-xs transition duration-150 outline-none placeholder-slate-600"
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 font-sans block">Para alinhamento das coordenadas celestes</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Login/Username */}
              <div className="space-y-1.5">
                <label htmlFor="reg-login" className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Nome de Usuário (Login)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User size={16} className="text-indigo-400/80" />
                  </div>
                  <input
                    id="reg-login"
                    type="text"
                    required
                    value={regLogin}
                    onChange={(e) => setRegLogin(e.target.value)}
                    placeholder="ex: joaosilva"
                    className="w-full bg-slate-950 border border-slate-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs transition duration-150 outline-none placeholder-slate-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="reg-password" className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock size={16} />
                  </div>
                  <input
                    id="reg-password"
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 4 caracteres"
                    className="w-full bg-slate-950 border border-slate-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs transition duration-150 outline-none placeholder-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Cupom Promocional no Cadastro (Opcional) */}
            <div className="space-y-1.5">
              <label htmlFor="reg-coupon" className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Possui Cupom do Terapeuta? (Opcional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-500/80">
                  <Tag size={16} />
                </div>
                <input
                  id="reg-coupon"
                  type="text"
                  value={regCoupon}
                  onChange={(e) => setRegCoupon(e.target.value.toUpperCase())}
                  placeholder="Digite seu código de cupom aqui..."
                  className="w-full bg-slate-950 border border-slate-800/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-amber-200 rounded-xl py-2.5 pl-10 pr-4 text-xs transition duration-150 outline-none uppercase font-mono placeholder-slate-600"
                />
              </div>
              <span className="text-[10px] text-slate-500 font-sans block">
                Se você recebeu um código de desconto ou cortesia exclusivo liberado pelo terapeuta, digite-o acima.
              </span>
            </div>

            {/* Seleção da Voz Terapêutica (Masculina / Feminina) */}
            <div className="space-y-2 pt-1" id="voice-gender-selector">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-mono text-indigo-300 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Volume2 size={13} className="text-indigo-400" />
                  <span>Voz do Terapeuta & Condução Guiada</span>
                </label>
                <span className="text-[10px] text-slate-400">Escolha a voz que mais acolhe seu coração</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Voz Masculina (Éverton Piceni) */}
                <div
                  onClick={() => setVoiceChoice('masculina')}
                  className={`p-3.5 rounded-2xl border transition duration-150 cursor-pointer flex flex-col justify-between ${
                    voiceChoice === 'masculina'
                      ? 'bg-gradient-to-br from-indigo-950/70 via-slate-900 to-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">👨</span>
                        <span className="text-xs font-bold text-slate-100">Voz de Éverton Piceni</span>
                      </div>
                      {voiceChoice === 'masculina' && (
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-300 leading-snug">
                      Voz masculina profunda, firme e serena para ancoramento, decretos quânticos e transmutação.
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-indigo-300 bg-indigo-950/50 px-2 py-0.5 rounded">
                      Tom Terapêutico Natural
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playVoicePreview('masculina');
                      }}
                      className="px-2 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-[10px] flex items-center gap-1 transition cursor-pointer"
                    >
                      {loadingVoiceType === 'masculina' ? (
                        <>
                          <Loader2 size={11} className="animate-spin" />
                          <span>Carregando...</span>
                        </>
                      ) : isPlayingPreview && voiceChoice === 'masculina' ? (
                        <>
                          <Square size={10} className="fill-amber-300 text-amber-300" />
                          <span>Pausar</span>
                        </>
                      ) : (
                        <>
                          <Play size={10} className="fill-emerald-300 text-emerald-300" />
                          <span>Ouvir Amostra</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Voz Feminina (Acolhimento Sereno) */}
                <div
                  onClick={() => setVoiceChoice('feminina')}
                  className={`p-3.5 rounded-2xl border transition duration-150 cursor-pointer flex flex-col justify-between ${
                    voiceChoice === 'feminina'
                      ? 'bg-gradient-to-br from-rose-950/60 via-slate-900 to-purple-950/40 border-rose-400 shadow-md ring-1 ring-rose-400/50'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">👩</span>
                        <span className="text-xs font-bold text-slate-100">Voz Feminina Suave</span>
                      </div>
                      {voiceChoice === 'feminina' && (
                        <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-300 leading-snug">
                      Voz feminina maternal, doce e pausada, ideal para relaxamento profundo, sono e Raio Rosa.
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-rose-300 bg-rose-950/50 px-2 py-0.5 rounded">
                      Acolhimento da Alma
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playVoicePreview('feminina');
                      }}
                      className="px-2 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 text-[10px] flex items-center gap-1 transition cursor-pointer"
                    >
                      {loadingVoiceType === 'feminina' ? (
                        <>
                          <Loader2 size={11} className="animate-spin" />
                          <span>Carregando...</span>
                        </>
                      ) : isPlayingPreview && voiceChoice === 'feminina' ? (
                        <>
                          <Square size={10} className="fill-amber-300 text-amber-300" />
                          <span>Pausar</span>
                        </>
                      ) : (
                        <>
                          <Play size={10} className="fill-emerald-300 text-emerald-300" />
                          <span>Ouvir Amostra</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Frequência Sonora Select */}
            <div className="space-y-2 pt-2">
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Frequência Sonora Inicial
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" id="soundscape-selector">
                {[
                  { id: '528hz', name: '528Hz Regeneração', desc: 'Alpha-Beta (12Hz)' },
                  { id: '432hz', name: '432Hz Paz Natural', desc: 'Ondas Theta (5Hz)' },
                  { id: '963hz', name: '963Hz Pineal Divina', desc: 'Conexão Superior' },
                  { id: '741hz', name: '741Hz Limpeza Celular', desc: 'Despertar Intuição' },
                  { id: 'waves', name: 'Brisa Oceânica', desc: 'Atmosfera Suave' },
                  { id: 'none', name: 'Apenas Voz', desc: 'Sem Fundo' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMusicType(opt.id as any)}
                    className={`p-2 rounded-xl border text-left transition duration-150 cursor-pointer ${
                      musicType === opt.id
                        ? 'bg-indigo-950/50 border-indigo-500 text-slate-100 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[11px] font-bold font-mono text-slate-200">{opt.name}</div>
                    <div className="text-[9px] text-slate-400">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 text-xs tracking-wider uppercase cursor-pointer border-none mt-4"
              id="btn-complete-setup"
            >
              Criar Conta e Iniciar Cura
            </button>
          </form>
        ) : activeTab === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4" id="login-form">
            {/* Login/Username or Email */}
            <div className="space-y-1.5">
              <label htmlFor="log-login" className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Nome de Usuário (Login) ou E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User size={16} />
                </div>
                <input
                  id="log-login"
                  type="text"
                  required
                  value={logLogin}
                  onChange={(e) => setLogLogin(e.target.value)}
                  placeholder="Insira seu login ou e-mail cadastrado"
                  className="w-full bg-slate-950 border border-slate-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 rounded-xl py-3 pl-10 pr-4 text-xs transition duration-150 outline-none placeholder-slate-600"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="log-password" className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('forgot');
                    setForgotIdentifier(logLogin);
                    setError('');
                    setSuccessMsg('');
                    setRecoveryStep('verify');
                  }}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition cursor-pointer underline underline-offset-2"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input
                  id="log-password"
                  type="password"
                  required
                  value={logPassword}
                  onChange={(e) => setLogPassword(e.target.value)}
                  placeholder="Insira sua senha de acesso"
                  className="w-full bg-slate-950 border border-slate-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 rounded-xl py-3 pl-10 pr-4 text-xs transition duration-150 outline-none placeholder-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 text-xs tracking-wider uppercase cursor-pointer border-none mt-4"
              id="btn-login-submit"
            >
              Acessar Minha Conta
            </button>
          </form>
        ) : (
          /* FORGOT PASSWORD FORM */
          <div className="space-y-4" id="forgot-password-panel">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setError('');
                  setSuccessMsg('');
                }}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Voltar ao Login</span>
              </button>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <KeyRound size={12} />
                Recuperação de Senha
              </span>
            </div>

            {recoveryStep === 'verify' && (
              <form onSubmit={handleVerifyForReset} className="space-y-4">
                <div className="p-3 bg-indigo-950/30 border border-indigo-900/40 rounded-xl text-xs text-slate-300">
                  Informe o seu login ou e-mail cadastrado e sua data de nascimento para recuperar o acesso à sua conta.
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Login ou E-mail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="Seu login ou e-mail de cadastro"
                      className="w-full bg-slate-950 border border-slate-800/80 focus:border-indigo-500 text-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Data de Nascimento (Verificação de Segurança)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <CalendarIcon size={16} />
                    </div>
                    <input
                      type="date"
                      value={forgotBirthDate}
                      onChange={(e) => setForgotBirthDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800/80 focus:border-indigo-500 text-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none [color-scheme:dark]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition text-xs tracking-wider uppercase cursor-pointer border-none"
                >
                  Verificar Identidade
                </button>
              </form>
            )}

            {recoveryStep === 'reset' && matchedAccount && (
              <form onSubmit={handleSaveNewPassword} className="space-y-4">
                <div className="p-3 bg-emerald-950/30 border border-emerald-900/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Identidade confirmada para <strong>{matchedAccount.fullName}</strong>. Digite sua nova senha abaixo.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 4 caracteres"
                      className="w-full bg-slate-950 border border-slate-800/80 focus:border-indigo-500 text-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a nova senha"
                      className="w-full bg-slate-950 border border-slate-800/80 focus:border-indigo-500 text-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition text-xs tracking-wider uppercase cursor-pointer border-none"
                >
                  Salvar Nova Senha
                </button>
              </form>
            )}

            {recoveryStep === 'done' && (
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-sm font-medium text-slate-100">Senha Redefinida com Sucesso!</h3>
                <p className="text-xs text-slate-400">Sua senha foi atualizada. Agora você pode entrar com seus novos dados.</p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    if (matchedAccount) {
                      setLogLogin(matchedAccount.login);
                      setLogPassword(newPassword);
                    }
                    setError('');
                    setSuccessMsg('Preenchemos seu login para facilitar o acesso!');
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition text-xs tracking-wider uppercase cursor-pointer border-none"
                >
                  Ir para Login e Entrar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Intro text */}
        <div className="bg-slate-950/50 border border-slate-850 p-4 rounded-xl text-center">
          <p className="text-[11px] text-slate-400 leading-normal flex items-center justify-center gap-1.5">
            <Shield size={12} className="text-emerald-400" />
            <span>Seus dados são salvos localmente com total segurança e privacidade.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
