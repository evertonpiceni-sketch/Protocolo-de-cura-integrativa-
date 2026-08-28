/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles, Heart, Headphones, Sun, CheckCircle2,
  ArrowRight, X, Shield, Award, Compass, Volume2
} from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onStartFirstSession?: () => void;
  onStartJourney?: () => void;
  onOpenArchangelPrayer?: () => void;
  onOpenAstralMap?: () => void;
}

export default function WelcomeModal({
  isOpen,
  onClose,
  userName,
  onStartFirstSession,
  onStartJourney,
  onOpenArchangelPrayer,
  onOpenAstralMap
}: WelcomeModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('cura_integrada_welcome_seen_v1', 'true');
    }
    onClose();
  };

  const handleStart = () => {
    if (dontShowAgain) {
      localStorage.setItem('cura_integrada_welcome_seen_v1', 'true');
    }
    if (onStartFirstSession) {
      onStartFirstSession();
    } else if (onStartJourney) {
      onStartJourney();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto" id="welcome-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden my-4 max-h-[92vh] overflow-y-auto"
      >
        {/* Golden & Violet Sacred Aura Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition cursor-pointer border-none"
        >
          <X size={18} />
        </button>

        {/* Header Branding & Exclusive Portal Visual */}
        <div className="text-center space-y-3 pt-1">
          <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl group">
            <img
              src="/cura_integrada_brand_portal.png"
              alt="Portal Sagrado de Cura Integrada"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent flex items-end justify-center pb-2">
              <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest font-bold bg-slate-950/80 px-3 py-1 rounded-full border border-amber-500/40 backdrop-blur-sm shadow-md">
                PORTAL SAGRADO DE CURA INTEGRADA
              </span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-display font-medium text-slate-100">
            Paz e Luz, {userName || 'Praticante'}!
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Seja bem-vindo ao <strong>Protocolo de Cura Integrada</strong>, canalizado e desenvolvido por <strong>Éverton Rodrigo Piceni</strong> para alinhar seus centros energéticos, acalmar a mente e regenerar o seu campo vital.
          </p>
        </div>

        {/* 3 Pillars of Practice */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/20">
              <Headphones size={18} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200">1. Prática com Fones & Frequências Sagradas</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                Utilize fones de ouvido para absorver as frequências quânticas binaurais (528Hz, 432Hz, 963Hz) e a narração guiada imersiva.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5 border border-indigo-500/20">
              <Compass size={18} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200">2. As 6 Etapas Fidedignas</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                Abertura, Aterramento, Vitalidade Cerebral, Transmutação Violeta, Bálsamo Celular e Selamento com Ho'oponopono.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5 border border-amber-500/20">
              <Shield size={18} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200">3. Oração de São Miguel & Diário Integrado</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                Acesse a Oração de 21 dias do Arcanjo Miguel gratuitamente e anote suas sensações diárias no Diário Quântico.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-medium py-3.5 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/20 text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer border-none font-sans font-bold"
          >
            <span>Iniciar Minha Sessão de Hoje</span>
            <ArrowRight size={16} />
          </button>

          <div className="flex items-center justify-between px-1 text-xs text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-500 focus:ring-0 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400">Não mostrar esta introdução novamente</span>
            </label>

            <button
              onClick={handleClose}
              className="text-[11px] text-slate-500 hover:text-slate-300 transition cursor-pointer border-none bg-transparent"
            >
              Explorar Painel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
