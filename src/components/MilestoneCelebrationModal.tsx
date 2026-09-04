/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, Heart, Flame, Shield, CheckCircle2, MessageCircle, X, Send, Award, Share2 } from 'lucide-react';
import { UserProfile } from '../types';

interface MilestoneCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  userProfile: UserProfile;
  onOpenCertificate?: () => void;
}

export default function MilestoneCelebrationModal({
  isOpen,
  onClose,
  dayNumber,
  userProfile,
  onOpenCertificate
}: MilestoneCelebrationModalProps) {
  if (!isOpen) return null;

  const isDay21 = dayNumber === 21;
  const isDay15 = dayNumber === 15;
  const isDay8 = dayNumber === 8;

  const userName = userProfile.fullName || userProfile.name || 'Consulente';
  const userPhone = userProfile.phone ? String(userProfile.phone).replace(/\D/g, '') : '';

  let title = `✨ Celebração do Dia ${dayNumber}`;
  let subtitle = 'Sua dedicação está gerando frutos no seu campo energético.';
  let mainMessage = '';
  let badgeText = `Etapa ${dayNumber}/21`;
  let themeBg = 'from-indigo-950 via-slate-900 to-purple-950';
  let themeBorder = 'border-indigo-500/40';
  let icon = <Sparkles className="w-8 h-8 text-amber-400" />;

  if (isDay8) {
    title = '💜 Dia 8: Entrada no Karuna Ki';
    subtitle = 'Início da Transmutação Celular Profunda';
    badgeText = 'Portal Karuna Ki';
    themeBg = 'from-violet-950 via-slate-900 to-purple-950';
    themeBorder = 'border-violet-500/40';
    icon = <Flame className="w-8 h-8 text-violet-400 animate-pulse" />;
    mainMessage = `Querido(a) ${userName},\n\nHoje você inicia o 8º Dia da sua Jornada! Esta etapa ativa os símbolos sagrados do Karuna Ki (Zonar e Halu), permitindo que feridas celulares e dores antigas sejam dissolvidas na Chama Violeta.\n\nVocê não está sozinho. Respire fundo, celebre sua constância e continue firme no seu trono de poder pessoal.\n\nCom amor e bênçãos,\nÉverton Rodrigo Piceni`;
  } else if (isDay15) {
    title = '🌸 Dia 15: O Bálsamo do Raio Rosa';
    subtitle = 'Ancoramento no Amor Incondicional';
    badgeText = 'Portal do Raio Rosa';
    themeBg = 'from-rose-950 via-slate-900 to-indigo-950';
    themeBorder = 'border-rose-500/40';
    icon = <Heart className="w-8 h-8 text-rose-400 animate-pulse" />;
    mainMessage = `Querido(a) ${userName},\n\nParabéns por chegar ao 15º Dia! Você acaba de ancorar na fase do Raio Rosa e no amor incondicional da egrégora crística e dos mestres ascensos.\n\nDeixe o passado ir embora com ternura. Seu coração está sendo restaurado e preenchido de paz verdadeira.\n\nCom luz e acolhimento,\nÉverton Rodrigo Piceni`;
  } else if (isDay21) {
    title = '👑 Você assumiu o seu Trono!';
    subtitle = 'Parabéns pela conclusão do seu Protocolo de Cura Integrada!';
    badgeText = 'Jornada dos 21 Dias Concluída';
    themeBg = 'from-amber-950 via-slate-900 to-indigo-950';
    themeBorder = 'border-amber-500/60';
    icon = <Crown className="w-9 h-9 text-amber-400 animate-bounce" />;
    mainMessage = `👑 Você assumiu o seu Trono: Parabéns pela conclusão do seu Protocolo de Cura Integrada!\n\nQuerido(a) ${userName},\n\nHoje é o ápice da sua jornada de 21 Dias. Com a benção e o empoderamento de Ganesha, esse tratamento está totalmente selado e blindado no seu DNA cósmico.\n\nTodas as frequências, desprogramações celulares e ativações espirituais foram integradas com perfeição. Você é livre para ser feliz. Você é cura. Você é amor. Você está em paz.\n\nCom profunda gratidão,\nÉverton Rodrigo Piceni`;
  }

  const encodedMsg = encodeURIComponent(mainMessage);
  const whatsappUrl = userPhone
    ? `https://wa.me/55${userPhone.startsWith('55') ? userPhone.slice(2) : userPhone}?text=${encodedMsg}`
    : `https://wa.me/?text=${encodedMsg}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mainMessage);
    alert('Mensagem copiada para a área de transferência!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Protocolo de Cura Integrada',
          text: `Acabo de completar a ${badgeText} do meu Protocolo de Cura!\n\n${subtitle}`,
          url: window.location.origin
        });
      } catch (error) {
        console.warn('Share error:', error);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className={`w-full max-w-xl bg-gradient-to-b ${themeBg} border-2 ${themeBorder} rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden my-6`}
        >
          {/* Ambient light glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition cursor-pointer z-10"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-inner mb-1">
              {icon}
            </div>
            <div className="inline-block px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-widest block mx-auto">
              {badgeText}
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-medium text-slate-100">
              {title}
            </h2>
            <p className="text-xs text-slate-300">
              {subtitle}
            </p>
          </div>

          {/* Message Box */}
          <div className="mt-5 p-4 md:p-5 rounded-2xl bg-slate-950/75 border border-slate-800/90 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-850 pb-2">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Sparkles size={12} />
                <span>Mensagem do Canalizador Éverton Piceni</span>
              </span>
              <span className="text-[10px] text-emerald-400">✨ Transmitida com Amor</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
              {mainMessage}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {isDay21 && onOpenCertificate && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCertificate();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Award size={16} />
                <span>Ver Certificado de Conclusão</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/20 text-center"
            >
              <Share2 size={16} />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-600/20 text-center"
            >
              <MessageCircle size={16} />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={copyToClipboard}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-700"
            >
              <Send size={14} />
              <span className="hidden sm:inline">Copiar</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
