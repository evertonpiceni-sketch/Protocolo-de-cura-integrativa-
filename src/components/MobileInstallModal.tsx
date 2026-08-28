import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Smartphone, Download, CheckCircle2, ShieldCheck,
  Zap, Bell, Sparkles, ExternalLink, X, Play, Share2, Layers,
  Apple
} from 'lucide-react';

interface MobileInstallModalProps {
  onClose: () => void;
  deferredPrompt?: any;
}

export default function MobileInstallModal({ onClose, deferredPrompt }: MobileInstallModalProps) {
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [canDirectInstall, setCanDirectInstall] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android');

  useEffect(() => {
    if (deferredPrompt) {
      setCanDirectInstall(true);
    }
    
    // Detect iOS
    const isIos = /ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase()) && !(window as any).MSStream;
    if (isIos) {
      setActiveTab('ios');
    }
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallSuccess(true);
      }
      setIsInstalling(false);
    } else {
      // Show fallback instruction
      alert("Para instalar no Android: Abra o menu do navegador (três pontinhos) e toque em 'Instalar aplicativo' ou 'Adicionar à tela inicial'.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto" id="mobile-install-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden my-4"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition cursor-pointer border-none z-10"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 via-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <Smartphone size={28} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                App Oficial
              </span>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                PWA Ready
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-display font-medium text-slate-100 mt-1">
              Instalar no Celular
            </h3>
          </div>
        </div>

        {/* OS Tabs */}
        <div className="flex bg-slate-950 rounded-xl p-1 relative z-10">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors border-none cursor-pointer ${
              activeTab === 'android' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-slate-300 bg-transparent'
            }`}
          >
            <Play size={14} /> Android
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors border-none cursor-pointer ${
              activeTab === 'ios' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-300 bg-transparent'
            }`}
          >
            <Apple size={14} /> iOS (iPhone)
          </button>
        </div>

        {/* App Card Preview */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 shadow-md">
            <img src="/icon-192.svg" alt="Ícone do Aplicativo" className="w-12 h-12 object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-slate-200 truncate">
              Protocolo de Cura Integrada
            </h4>
            <p className="text-xs text-slate-400 truncate">
              Por Éverton Rodrigo Piceni
            </p>
            <div className="flex items-center gap-3 mt-1 text-[11px] text-emerald-400 font-mono">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={12} /> 100% Gratuito
              </span>
              <span>•</span>
              <span>Acesso Offline</span>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative z-10">
          {activeTab === 'android' ? (
            <div className="space-y-4">
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-850/40 border border-slate-800/60 text-slate-300">
                  <ShieldCheck size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-100 block">Instalação Direta sem Ocupar Memória</strong>
                    Funciona como app nativo no Android com ícone na tela inicial e abertura em tela cheia.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-850/40 border border-slate-800/60 text-slate-300">
                  <Zap size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-100 block">Frequências Sonoras e Áudio Contínuo</strong>
                    Ouça as frequências com o celular bloqueado ou em segundo plano.
                  </div>
                </div>
              </div>

              {/* Action Button: Install Now */}
              <div className="space-y-3 pt-1">
                {installSuccess ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-center text-xs font-medium">
                    ✨ Aplicativo instalado com sucesso! Verifique a tela inicial.
                  </div>
                ) : (
                  <button
                    onClick={handleInstallClick}
                    disabled={isInstalling}
                    className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-medium py-3.5 rounded-xl transition duration-200 shadow-lg shadow-emerald-600/15 text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer border-none font-sans font-bold"
                  >
                    <Download size={16} />
                    {isInstalling ? 'Instalando...' : 'Instalar no Android'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-850/40 border border-slate-800/60 text-sm text-slate-300 space-y-4">
                <p className="font-medium text-slate-200 text-xs">Siga os passos abaixo no Safari para instalar no iPhone/iPad:</p>
                
                <ol className="space-y-4 list-decimal pl-5 marker:text-indigo-400 text-xs">
                  <li className="pl-2">
                    Toque no ícone de <strong className="text-white">Compartilhar</strong> na barra inferior do Safari.
                    <div className="mt-2 flex justify-center p-2 bg-slate-900 rounded-lg">
                      <Share2 size={20} className="text-blue-400" />
                    </div>
                  </li>
                  <li className="pl-2">
                    Role o menu para baixo e selecione <strong className="text-white">Adicionar à Tela de Início</strong> (Add to Home Screen).
                  </li>
                  <li className="pl-2">
                    Confirme tocando em <strong className="text-white">Adicionar</strong> no canto superior direito.
                  </li>
                </ol>
                
                <div className="mt-4 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex gap-2">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <p>Após adicionar, o app funcionará em tela cheia, offline, com áudio em segundo plano e ícone na sua tela inicial!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
