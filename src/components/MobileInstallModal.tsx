import React, { useEffect, useRef, useState } from 'react';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { motion } from 'motion/react';
import { Smartphone, Download, CheckCircle2, ShieldCheck, Zap, X, Play, Share2, Apple, Info } from 'lucide-react';

interface MobileInstallModalProps {
  onClose: () => void;
  deferredPrompt?: any;
}

export default function MobileInstallModal({ onClose, deferredPrompt }: MobileInstallModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(true, dialogRef, onClose);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [installFeedback, setInstallFeedback] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android');

  useEffect(() => {
    const isIos = /ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase()) && !(window as any).MSStream;
    if (isIos) setActiveTab('ios');
  }, []);

  const handleInstallClick = async () => {
    setInstallFeedback(null);
    if (!deferredPrompt) {
      setInstallFeedback("Seu navegador não disponibilizou o botão automático. Abra o menu do navegador e escolha 'Instalar aplicativo' ou 'Adicionar à tela inicial'.");
      return;
    }

    try {
      setIsInstalling(true);
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallSuccess(true);
        setInstallFeedback('Solicitação de instalação aceita. Verifique a tela inicial do aparelho.');
      } else {
        setInstallFeedback('A instalação foi cancelada. Você pode tentar novamente quando quiser.');
      }
    } catch (error) {
      console.warn('Não foi possível iniciar a instalação automática.', error);
      setInstallFeedback("Não foi possível abrir a instalação automática. Use o menu do navegador e escolha 'Adicionar à tela inicial'.");
    } finally {
      setIsInstalling(false);
    }
  };

  const tabClass = (selected: boolean) => `min-h-11 flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35 ${
    selected
      ? 'border border-[#B88736]/35 bg-[#B88736]/12 text-[#8F631E]'
      : 'border border-transparent bg-transparent text-[#5C5248] hover:bg-[#F5EFE4]'
  }`;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-[#2A2420]/30 p-2 sm:p-4 backdrop-blur-md"
      id="mobile-install-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-install-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative my-1 w-full max-w-lg max-h-[calc(100dvh-1rem)] space-y-5 overflow-y-auto overscroll-contain rounded-2xl border border-[#E5DAC6] bg-[#FBF8F2] p-4 shadow-2xl sm:my-4 sm:rounded-3xl sm:p-6 md:p-8"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#B88736]/8 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#5E7153]/8 blur-3xl" aria-hidden="true" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar instalação do aplicativo"
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5DAC6] bg-[#F5EFE4] text-[#5C5248] transition hover:bg-[#EFE4D3] hover:text-[#2A2420] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
        >
          <X size={18} />
        </button>

        <header className="relative z-10 flex items-center gap-3.5 pr-12">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#B88736]/25 bg-[#B88736]/10 text-[#8F631E]">
            <Smartphone size={28} />
          </div>
          <div>
            <span className="rounded-full border border-[#B88736]/20 bg-[#B88736]/8 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8F631E]">
              Atalho do aplicativo
            </span>
            <h2 id="mobile-install-title" className="mt-1 font-display text-lg font-medium text-[#2A2420] md:text-xl">Instalar no celular</h2>
            <p className="mt-1 text-[11px] leading-relaxed text-[#85786C]">Adicione o Protocolo da Transformação à tela inicial para abrir com mais facilidade.</p>
          </div>
        </header>

        <div className="relative z-10 flex rounded-2xl border border-[#E5DAC6] bg-white/75 p-1" role="tablist" aria-label="Sistema do aparelho">
          <button type="button" role="tab" aria-selected={activeTab === 'android'} onClick={() => { setActiveTab('android'); setInstallFeedback(null); }} className={tabClass(activeTab === 'android')}>
            <Play size={14} className="mr-1.5 inline" /> Android
          </button>
          <button type="button" role="tab" aria-selected={activeTab === 'ios'} onClick={() => { setActiveTab('ios'); setInstallFeedback(null); }} className={tabClass(activeTab === 'ios')}>
            <Apple size={14} className="mr-1.5 inline" /> iOS
          </button>
        </div>

        <section className="relative z-10 flex items-center gap-4 rounded-2xl border border-[#E5DAC6] bg-white/80 p-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#E5DAC6] bg-[#FBF8F2]">
            <img src="/icon-192.svg" alt="Ícone do Protocolo da Transformação" className="h-12 w-12 object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-[#2A2420]">Protocolo da Transformação</h3>
            <p className="truncate text-xs text-[#5C5248]">Por Éverton Rodrigo Piceni</p>
            <p className="mt-1 text-[11px] text-[#8F631E]">Um lugar para voltar para si.</p>
          </div>
        </section>

        {activeTab === 'android' ? (
          <section className="relative z-10 space-y-4" role="tabpanel">
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-3 rounded-xl border border-[#E5DAC6] bg-white/70 p-3 text-[#5C5248]">
                <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#5E7153]" />
                <div><strong className="block text-[#2A2420]">Acesso pela tela inicial</strong>Abra o projeto como aplicativo, sem precisar procurar o endereço novamente.</div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-[#E5DAC6] bg-white/70 p-3 text-[#5C5248]">
                <Zap size={17} className="mt-0.5 shrink-0 text-[#B88736]" />
                <div><strong className="block text-[#2A2420]">Sua jornada por perto</strong>Acesse jornadas, diário e recursos com poucos toques.</div>
              </div>
            </div>

            {installSuccess ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-xs font-medium text-emerald-700" role="status" aria-live="polite">
                Solicitação de instalação aceita. Verifique a tela inicial.
              </div>
            ) : (
              <button
                type="button"
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#B88736] py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#8F631E] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35"
              >
                <Download size={16} />{isInstalling ? 'Abrindo instalação...' : 'Instalar no Android'}
              </button>
            )}
          </section>
        ) : (
          <section className="relative z-10 space-y-4 rounded-2xl border border-[#E5DAC6] bg-white/75 p-4 text-sm text-[#5C5248]" role="tabpanel">
            <p className="text-xs font-semibold text-[#2A2420]">No Safari:</p>
            <ol className="space-y-4 pl-5 text-xs list-decimal">
              <li className="pl-2">Toque em <strong className="text-[#2A2420]">Compartilhar</strong>.<div className="mt-2 flex justify-center text-[#8F631E]"><Share2 size={20} /></div></li>
              <li className="pl-2">Selecione <strong className="text-[#2A2420]">Adicionar à Tela de Início</strong>.</li>
              <li className="pl-2">Confirme em <strong className="text-[#2A2420]">Adicionar</strong>.</li>
            </ol>
            <div className="flex gap-2 rounded-xl border border-[#B88736]/20 bg-[#B88736]/7 p-3 text-xs text-[#5C5248]">
              <CheckCircle2 size={16} className="shrink-0 text-[#8F631E]" />
              <p>Depois disso, o Protocolo da Transformação ficará disponível na sua tela inicial.</p>
            </div>
          </section>
        )}

        {installFeedback && (
          <div className="relative z-10 flex gap-2 rounded-xl border border-[#E5DAC6] bg-[#F5EFE4] p-3 text-xs leading-relaxed text-[#5C5248]" role="status" aria-live="polite">
            <Info size={16} className="mt-0.5 shrink-0 text-[#8F631E]" />
            <span>{installFeedback}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
