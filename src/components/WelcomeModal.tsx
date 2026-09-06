/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Headphones, Compass, Shield, ArrowRight, X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onStartFirstSession?: () => void;
  onStartJourney?: () => void;
  onOpenArchangelPrayer?: () => void;
  onOpenAstralMap?: () => void;
}

export default function WelcomeModal({ isOpen, onClose, userName, onStartFirstSession, onStartJourney }: WelcomeModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  if (!isOpen) return null;

  const handleClose = () => {
    if (dontShowAgain) localStorage.setItem('cura_integrada_welcome_seen_v1', 'true');
    onClose();
  };

  const handleStart = () => {
    if (dontShowAgain) localStorage.setItem('cura_integrada_welcome_seen_v1', 'true');
    if (onStartFirstSession) onStartFirstSession();
    else if (onStartJourney) onStartJourney();
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto" id="welcome-modal">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden my-4 max-h-[92vh] overflow-y-auto">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <button onClick={handleClose} aria-label="Fechar" className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition cursor-pointer border-none"><X size={18} /></button>

        <div className="text-center space-y-3 pt-1">
          <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl group">
            <img src="/cura_integrada_brand_portal.png" alt="Identidade visual Everton Piceni" referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent flex items-end justify-center pb-2">
              <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest font-bold bg-slate-950/80 px-3 py-1 rounded-full border border-amber-500/40 backdrop-blur-sm shadow-md">PROTOCOLO DA TRANSFORMAÇÃO</span>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-medium text-slate-100">Olá, {userName || 'seja bem-vindo'}.</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-medium">Aqui, ninguém precisa estar bem para ser bem-vindo.</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">Este é o <strong>Protocolo da Transformação</strong>, um lugar para voltar para si, criado por <strong>Éverton Rodrigo Piceni</strong> para acolher, compreender e oferecer caminhos de presença, autocuidado e reconexão.</p>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3.5"><div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/20"><Headphones size={18} /></div><div><h4 className="text-xs font-semibold text-slate-200">1. Seu momento</h4><p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">Respiração, meditação e recursos sonoros para você reservar alguns minutos de presença e cuidado.</p></div></div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3.5"><div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/20"><Compass size={18} /></div><div><h4 className="text-xs font-semibold text-slate-200">2. Seu caminho</h4><p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">Práticas e jornadas são possibilidades de cuidado. Você escolhe o que faz sentido para o seu momento.</p></div></div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3.5"><div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5 border border-amber-500/20"><Shield size={18} /></div><div><h4 className="text-xs font-semibold text-slate-200">3. Cuidado responsável</h4><p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">Este espaço apoia reflexão e autocuidado e não substitui acompanhamento médico, psicológico ou outros cuidados profissionais quando necessários.</p></div></div>
        </div>

        <div className="space-y-3 pt-2">
          <button onClick={handleStart} className="w-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-500 hover:from-emerald-600 hover:to-amber-400 text-white font-medium py-3.5 rounded-xl transition duration-200 shadow-lg text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer border-none font-sans font-bold"><span>Iniciar meu momento</span><ArrowRight size={16} /></button>
          <div className="flex items-center justify-between px-1 text-xs text-slate-400"><label className="flex items-center gap-2 cursor-pointer select-none"><input type="checkbox" checked={dontShowAgain} onChange={(e) => setDontShowAgain(e.target.checked)} className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0 cursor-pointer" /><span className="text-[11px] text-slate-400">Não mostrar esta introdução novamente</span></label><button onClick={handleClose} className="text-[11px] text-slate-500 hover:text-slate-300 transition cursor-pointer border-none bg-transparent">Explorar painel</button></div>
        </div>
      </motion.div>
    </div>
  );
}
