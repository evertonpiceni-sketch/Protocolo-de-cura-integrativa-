/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert, KeyRound, Plus, Trash2, CheckCircle2,
  UploadCloud, Music, Tag, Users, Play, Pause, Save,
  X, Lock, Unlock, Eye, Sparkles, FileAudio, RefreshCw,
  MessageSquare, Copy, Check, Award, Activity, Heart, Brain, Download
} from 'lucide-react';
import { audioEngine } from '../lib/audio';
import { evaluateBestTreatmentFromAnamnesis } from '../lib/anamnesisTreatmentEngine';

interface CustomAudioItem {
  id: string;
  targetUserLogin?: string; // empty means all or specific user
  targetDayNumber?: number; // 1 to 21
  title: string;
  audioUrl: string;
  notes?: string;
  createdAt: string;
}

export interface CouponItem {
  code: string;
  discountPercentage: number; // e.g. 100 for free, 50 for half price
  description: string;
  active: boolean;
  createdAt: string;
}

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ADMIN_STORAGE_KEY_AUDIOS = 'cura_integrada_admin_custom_audios_v1';
export const ADMIN_STORAGE_KEY_COUPONS = 'cura_integrada_admin_coupons_v1';

export default function AdminPanelModal({ isOpen, onClose }: AdminPanelModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Tabs inside admin panel
  const [activeTab, setActiveTab] = useState<'audios' | 'coupons' | 'users'>('audios');

  // Custom Audio State
  const [customAudios, setCustomAudios] = useState<CustomAudioItem[]>([]);
  const [newAudioTitle, setNewAudioTitle] = useState('');
  const [newAudioUrl, setNewAudioUrl] = useState('');
  const [newAudioDay, setNewAudioDay] = useState<number>(1);
  const [newAudioUser, setNewAudioUser] = useState('');
  const [newAudioNotes, setNewAudioNotes] = useState('');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Coupons State
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState<number>(100);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // All Users / Accounts
  const [allAccounts, setAllAccounts] = useState<any[]>([]);
  const [copiedLogin, setCopiedLogin] = useState<string | null>(null);

  // The server is the sole source of administrative authorization and user data.
  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/admin/users')
      .then(async (response) => {
        if (!response.ok) throw new Error('Admin authorization required');
        const data = await response.json();
        setAllAccounts(data.users || []);
        setIsAuthenticated(true);
        setAuthError('');
      })
      .catch(() => {
        setIsAuthenticated(false);
        setAllAccounts([]);
        setAuthError('A sua sessão não possui acesso administrativo.');
      });
  }, [isOpen]);

  if (!isOpen) return null;


  // Add custom audio
  const handleAddAudio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAudioTitle.trim() || !newAudioUrl.trim()) return;

    const newItem: CustomAudioItem = {
      id: `audio_${Date.now()}`,
      title: newAudioTitle.trim(),
      audioUrl: newAudioUrl.trim(),
      targetDayNumber: newAudioDay,
      targetUserLogin: newAudioUser.trim().toLowerCase() || undefined,
      notes: newAudioNotes.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = [newItem, ...customAudios];
    setCustomAudios(updated);

    // Reset form
    setNewAudioTitle('');
    setNewAudioUrl('');
    setNewAudioNotes('');
    setNewAudioUser('');
  };

  const handleDeleteAudio = (id: string) => {
    const updated = customAudios.filter(a => a.id !== id);
    setCustomAudios(updated);
  };

  // Add Coupon
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const newCoupon: CouponItem = {
      code: newCouponCode.trim().toUpperCase(),
      discountPercentage: newCouponDiscount,
      description: newCouponDesc.trim() || 'Cupom Promocional Liberado pelo Terapeuta Éverton Piceni',
      active: true,
      createdAt: new Date().toISOString()
    };

    const updated = [newCoupon, ...coupons.filter(c => c.code !== newCoupon.code)];
    setCoupons(updated);

    setNewCouponCode('');
    setNewCouponDesc('');
    setNewCouponDiscount(100);
  };

  const handleToggleCoupon = (code: string) => {
    const updated = coupons.map(c => c.code === code ? { ...c, active: !c.active } : c);
    setCoupons(updated);
  };

  const handleDeleteCoupon = (code: string) => {
    const updated = coupons.filter(c => c.code !== code);
    setCoupons(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto" id="admin-panel-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden my-4 max-h-[92vh] overflow-y-auto"
      >
        {/* Amber admin atmospheric aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldAlert size={24} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold">
                  Área do Terapeuta
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Éverton Rodrigo Piceni
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-display font-medium text-slate-100 mt-0.5">
                Painel Administrativo & Gestão
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition cursor-pointer border-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Authentication Gate */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto space-y-4 py-6 text-center">
            <Lock size={32} className="mx-auto text-amber-400 mb-2" />
            <h3 className="text-base font-semibold text-slate-100">Acesso Restrito ao Administrador</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Entre pela conta principal. O servidor verifica a sua sessão e função antes de liberar esta área.</p>
            {authError && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-mono">{authError}</div>}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('audios')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition cursor-pointer border ${
                  activeTab === 'audios'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileAudio size={14} />
                <span>Áudios Personalizados ({customAudios.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('coupons')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition cursor-pointer border ${
                  activeTab === 'coupons'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Tag size={14} />
                <span>Gestor de Cupons ({coupons.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition cursor-pointer border ${
                  activeTab === 'users'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users size={14} />
                <span>Consulentes & Anamneses ({allAccounts.length})</span>
              </button>
            </div>

            {/* TAB 1: CUSTOM AUDIOS */}
            {activeTab === 'audios' && (
              <div className="space-y-6">
                {/* Form to insert custom audio */}
                <form onSubmit={handleAddAudio} className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <UploadCloud size={16} className="text-amber-400" />
                    <h4 className="text-xs font-mono font-bold text-slate-200 uppercase">
                      Inserir Novo Áudio Personalizado Canalizado
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase block">Título do Áudio / Foco</label>
                      <input
                        type="text"
                        placeholder="Ex: Meditação Especial de Quebra de Amarras"
                        value={newAudioTitle}
                        onChange={(e) => setNewAudioTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase block">Link / URL do Áudio MP3</label>
                      <input
                        type="url"
                        placeholder="https://exemplo.com/audio.mp3"
                        value={newAudioUrl}
                        onChange={(e) => setNewAudioUrl(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase block">Vincular ao Dia (1 a 21)</label>
                      <select
                        value={newAudioDay}
                        onChange={(e) => setNewAudioDay(parseInt(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none font-mono"
                      >
                        {Array.from({ length: 21 }, (_, i) => i + 1).map(day => (
                          <option key={day} value={day}>Dia {day.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase block">Login do Consulente (Opcional - Vazio = Todos)</label>
                      <input
                        type="text"
                        placeholder="Deixe em branco para todos ou digite o login..."
                        value={newAudioUser}
                        onChange={(e) => setNewAudioUser(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase block">Orientações Terapêuticas do Áudio</label>
                    <input
                      type="text"
                      placeholder="Instruções para o consulente ao ouvir este áudio..."
                      value={newAudioNotes}
                      onChange={(e) => setNewAudioNotes(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl transition text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer border-none font-sans"
                  >
                    <Plus size={15} />
                    <span>Salvar e Disponibilizar Áudio no App</span>
                  </button>
                </form>

                {/* List of uploaded audios */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                    Áudios Ativos no Sistema ({customAudios.length})
                  </h4>

                  {customAudios.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-slate-950/50 border border-slate-850 text-center text-xs text-slate-500">
                      Nenhum áudio personalizado adicionado ainda. Preencha o formulário acima para inserir.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {customAudios.map(audio => (
                        <div key={audio.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                                Dia {audio.targetDayNumber || 1}
                              </span>
                              {audio.targetUserLogin && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  @{audio.targetUserLogin}
                                </span>
                              )}
                            </div>
                            <h5 className="text-xs font-semibold text-slate-200 mt-1 truncate">{audio.title}</h5>
                            <p className="text-[11px] text-slate-400 font-mono truncate">{audio.audioUrl}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => window.open(audio.audioUrl, '_blank')}
                              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-slate-800 transition"
                              title="Testar áudio"
                            >
                              <Play size={14} fill="currentColor" />
                            </button>
                            <button
                              onClick={() => handleDeleteAudio(audio.id)}
                              className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-900/40 transition"
                              title="Excluir áudio"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: COUPONS MANAGER */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <form onSubmit={handleAddCoupon} className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-amber-400" />
                    <h4 className="text-xs font-mono font-bold text-slate-200 uppercase">
                      Criar Novo Cupom de Desconto / Liberação VIP
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase block">Código do Cupom</label>
                      <input
                        type="text"
                        placeholder="Ex: PRO2026, GRATIS21"
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono font-bold focus:border-amber-500 outline-none uppercase"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase block">Desconto (%)</label>
                      <select
                        value={newCouponDiscount}
                        onChange={(e) => setNewCouponDiscount(parseInt(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none font-mono"
                      >
                        <option value={100}>100% (Acesso Total Gratuito VIP)</option>
                        <option value={70}>70% de Desconto</option>
                        <option value={50}>50% de Desconto</option>
                        <option value={30}>30% de Desconto</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase block">Descrição Interna</label>
                      <input
                        type="text"
                        placeholder="Ex: Cupom para alunos do curso"
                        value={newCouponDesc}
                        onChange={(e) => setNewCouponDesc(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl transition text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer border-none font-sans"
                  >
                    <Plus size={15} />
                    <span>Cadastrar Cupom no Sistema</span>
                  </button>
                </form>

                {/* List of active coupons */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                    Cupons Cadastrados ({coupons.length})
                  </h4>

                  {coupons.map(coupon => (
                    <div key={coupon.code} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-amber-300 tracking-wider">
                            {coupon.code}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                            {coupon.discountPercentage}% OFF
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            coupon.active ? 'bg-indigo-500/10 text-indigo-300' : 'bg-slate-800 text-slate-500'
                          }`}>
                            {coupon.active ? 'ATIVO' : 'DESATIVADO'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{coupon.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleCoupon(coupon.code)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition"
                        >
                          {coupon.active ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon.code)}
                          className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-900/40 transition"
                          title="Excluir cupom"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: USERS & ANAMNESIS */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                    Consulentes & Fichas de Anamnese ({allAccounts.length})
                  </h4>
                  {allAccounts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allAccounts, null, 2));
                        const downloadAnchor = document.createElement('a');
                        downloadAnchor.setAttribute("href", dataStr);
                        downloadAnchor.setAttribute("download", `consulentes_cura_integrada_${new Date().toISOString().split('T')[0]}.json`);
                        document.body.appendChild(downloadAnchor);
                        downloadAnchor.click();
                        downloadAnchor.remove();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Download size={13} className="text-indigo-400" />
                      <span>Exportar Backup (JSON)</span>
                    </button>
                  )}
                </div>

                {allAccounts.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-950/50 border border-slate-850 text-center text-xs text-slate-500 space-y-2">
                    <Users size={28} className="mx-auto text-slate-600 mb-1" />
                    <p>Nenhuma conta de consulente cadastrada neste navegador até o momento.</p>
                    <p className="text-[11px] text-slate-600">
                      As novas contas criadas pelos usuários e suas anamneses ficam salvas e sincronizadas diretamente aqui.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allAccounts.map((acc, idx) => {
                      const userAnamnesis = acc.profile?.anamnesis;
                      const userRec = userAnamnesis ? evaluateBestTreatmentFromAnamnesis(userAnamnesis, acc.profile) : null;
                      const userPhone = acc.phone || acc.profile?.phone || '';
                      const isCopied = copiedLogin === acc.login;

                      return (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-md">
                          {/* User Header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white uppercase shadow-sm">
                                {(acc.profile?.name || acc.login)[0]}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-slate-100">
                                    {acc.profile?.fullName || acc.profile?.name || acc.login}
                                  </span>
                                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                                    (acc.profile?.plan === 'pro' || acc.plan === 'pro')
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                      : 'bg-slate-800 text-slate-400'
                                  }`}>
                                    {(acc.profile?.plan === 'pro' || acc.plan === 'pro') ? `★ PRO VIP${acc.profile?.subscriptionPlan ? ` (${acc.profile.subscriptionPlan.replace(/_/g, ' ').toUpperCase()})` : ''}` : 'FREE'}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-500">
                                  Login: @{acc.login} • {acc.email || acc.profile?.email || 'Sem e-mail'} {userPhone && `• WhatsApp: ${userPhone}`}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab('audios');
                                  setNewAudioUser(acc.login);
                                  setNewAudioTitle(`Áudio Direcionado para ${acc.profile?.name || acc.login}`);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/30 text-[11px] text-indigo-300 font-medium flex items-center gap-1 transition cursor-pointer"
                                title="Gravar / Enviar áudio exclusivo para este consulente"
                              >
                                <FileAudio size={12} />
                                <span>Criar Áudio Exclusivo</span>
                              </button>
                            </div>
                          </div>

                          {/* Anamnesis Evaluation & Treatment Suggestion */}
                          {userAnamnesis && userRec ? (
                            <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/30 via-slate-900 to-amber-950/20 border border-indigo-500/30 space-y-2.5">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Award size={11} className="text-amber-400" />
                                    <span>Tratamento Sugerido pelo Sistema</span>
                                  </span>
                                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                                    userRec.severityLevel === 'urgente'
                                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                      : userRec.severityLevel === 'alto'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  }`}>
                                    Nível {userRec.severityLevel}
                                  </span>
                                </div>
                                <span className="text-[11px] font-mono text-indigo-300 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
                                  {userRec.frequencyLabel}
                                </span>
                              </div>

                              <div>
                                <h5 className="text-xs font-bold text-slate-100">
                                  {userRec.treatmentTitle}
                                </h5>
                                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                                  {userRec.summaryDiagnosis}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono">
                                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                                  <span className="text-slate-500 block uppercase">Estresse / Sono</span>
                                  <strong className="text-amber-400">{userAnamnesis.stressLevel}/10 • {userAnamnesis.sleepQuality}</strong>
                                </div>
                                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                                  <span className="text-slate-500 block uppercase">Chakra Alvo</span>
                                  <strong className="text-indigo-300">{userRec.primaryChakraFocus}</strong>
                                </div>
                                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                                  <span className="text-slate-500 block uppercase">Plano Sugerido</span>
                                  <strong className="text-emerald-400">{userRec.planName}</strong>
                                </div>
                              </div>

                              {/* Action buttons: WhatsApp & Copy */}
                              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-850">
                                <a
                                  href={`https://wa.me/${userPhone ? userPhone.replace(/\D/g, '') : '5519997096799'}?text=${encodeURIComponent(
                                    `Olá ${acc.profile?.name || ''}, aqui é o Terapeuta Éverton Piceni! Recebi sua Ficha de Anamnese no Protocolo de Cura Integrada. Avaliei seu quadro (${userRec.treatmentTitle}) e gostaria de te orientar nos seus 21 dias!`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1.5 transition"
                                >
                                  <MessageSquare size={13} />
                                  <span>Conversar no WhatsApp</span>
                                </a>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const summaryText = `📋 PRONTUÁRIO CLÍNICO • CURA INTEGRADA\nConsulente: ${acc.profile?.fullName || acc.profile?.name || acc.login} (@${acc.login})\nContato: ${acc.profile?.email || 'N/A'} • ${userPhone || 'N/A'}\nTratamento Sugerido: ${userRec.treatmentTitle}\nFrequência Prescrita: ${userRec.frequencyLabel}\nChakra Foco: ${userRec.primaryChakraFocus}\nEstresse: ${userAnamnesis.stressLevel}/10 | Sono: ${userAnamnesis.sleepQuality}\nQueixas: ${(userAnamnesis.mainComplaints || []).join(', ')}\nDiagnóstico: ${userRec.therapeuticRationale}\nDecreto: "${userAnamnesis.customDecree || ''}"`;
                                    navigator.clipboard.writeText(summaryText);
                                    setCopiedLogin(acc.login);
                                    setTimeout(() => setCopiedLogin(null), 2000);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-300 text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer"
                                >
                                  {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                                  <span>{isCopied ? 'Copiado!' : 'Copiar Prontuário'}</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-850 text-xs text-slate-500">
                              Ficha de Anamnese ainda não preenchida por este consulente.
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
