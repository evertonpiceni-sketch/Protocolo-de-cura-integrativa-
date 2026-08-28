/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MessageCircle, Mail, Send, Check, Copy, Sparkles,
  Heart, X, Shield, Clock, HelpCircle, User
} from 'lucide-react';
import { UserProfile } from '../types';
import brandEmblemImg from '../assets/images/cura_integrada_sacred_emblem_1787104270641.jpg';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userProfile?: UserProfile;
}

export default function ContactModal({
  isOpen,
  onClose,
  userName,
  userProfile
}: ContactModalProps) {
  const defaultName = userProfile?.fullName || userProfile?.name || userName || '';
  const defaultEmail = userProfile?.email || '';

  const [senderName, setSenderName] = useState(defaultName);
  const [senderEmail, setSenderEmail] = useState(defaultEmail);
  const [topic, setTopic] = useState<'duvida_protocolo' | 'tratamento_especifico' | 'cursos_reiki' | 'planos_cupons' | 'outro'>('duvida_protocolo');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const topicLabels: Record<string, string> = {
    duvida_protocolo: 'Dúvidas sobre o Protocolo de 21 Dias',
    tratamento_especifico: 'Tratamento Específico Personalizado',
    cursos_reiki: 'Cursos & Iniciações de Reiki',
    planos_cupons: 'Planos Pro, Valores & Cupons',
    outro: 'Outro Assunto / Acolhimento'
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('evertonpiceni@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Open mailto link cleanly with pre-filled content
    const subject = encodeURIComponent(`[Fale Conosco - Cura Integrada] ${topicLabels[topic]} - ${senderName || 'Consulente'}`);
    const body = encodeURIComponent(
      `Olá Éverton Rodrigo Piceni,\n\n` +
      `Estou entrando em contato através do aplicativo Protocolo de Cura Integrada.\n\n` +
      `👤 Nome: ${senderName || 'Consulente'}\n` +
      `📧 E-mail: ${senderEmail || 'Não informado'}\n` +
      `🎯 Assunto: ${topicLabels[topic]}\n\n` +
      `📝 Mensagem:\n${message}\n\n` +
      `Paz e Luz!`
    );

    window.open(`mailto:evertonpiceni@gmail.com?subject=${subject}&body=${body}`, '_blank');
    setIsSent(true);
  };

  const handleOpenWhatsAppChat = () => {
    const text = encodeURIComponent(
      `Olá! Estou no aplicativo do Protocolo de Cura Integrada e gostaria de conversar com o suporte / Éverton Piceni sobre: ${topicLabels[topic]}.\n\n` +
      `Nome: ${senderName || 'Consulente'}\n` +
      (message ? `Mensagem: ${message}` : '')
    );
    window.open(`https://wa.me/5551982215296?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto" id="contact-us-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden my-4 max-h-[92vh] overflow-y-auto"
      >
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-emerald-500/30 shrink-0 shadow-md">
              <img
                src={brandEmblemImg}
                alt="Emblema Sagrado Cura Integrada"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
                  Canal de Atendimento
                </span>
                <span className="text-[10px] font-mono text-indigo-300">
                  Éverton Rodrigo Piceni
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-display font-medium text-slate-100 mt-0.5">
                Fale Conosco
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition cursor-pointer border-none"
            title="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {isSent ? (
          /* Sent Confirmation */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Check size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-100">
                Mensagem Preparada com Sucesso!
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Sua mensagem foi direcionada para o e-mail oficial do terapeuta. Responderemos o mais breve possível com todo o carinho e atenção.
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsSent(false);
                  setMessage('');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Enviar Outra Mensagem
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                Concluir & Voltar
              </button>
            </div>
          </div>
        ) : (
          /* Form & Quick Contacts */
          <div className="space-y-5">
            {/* Quick direct contact card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">E-mail Oficial de Atendimento:</span>
                  <strong className="text-slate-200 font-mono text-xs select-all">evertonpiceni@gmail.com</strong>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-700"
                >
                  {copiedEmail ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedEmail ? 'E-mail Copiado!' : 'Copiar E-mail'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenWhatsAppChat}
                  className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-600/20"
                  title="Falar no Fale Conosco"
                >
                  <MessageCircle size={14} />
                  <span>Fale Conosco</span>
                </button>
              </div>
            </div>

            {/* In-App Message Form */}
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Como prefere ser chamado(a)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                    Seu E-mail para Resposta
                  </label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  Assunto / Tema do Contato
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500 cursor-pointer font-sans"
                >
                  <option value="duvida_protocolo">Dúvidas sobre o Protocolo de 21 Dias</option>
                  <option value="tratamento_especifico">Tratamento Específico Personalizado</option>
                  <option value="cursos_reiki">Cursos & Iniciações de Reiki (Kundalini, Usui, Chama Rosa, etc.)</option>
                  <option value="planos_cupons">Planos Pro, Valores & Cupons de Desconto</option>
                  <option value="outro">Outro Assunto / Acolhimento</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  Sua Mensagem ou Dúvida
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva aqui como podemos te ajudar, suas percepções durante as sessões ou perguntas..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 placeholder:text-slate-600 outline-none focus:border-emerald-500 resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Shield size={13} className="text-emerald-400 shrink-0" />
                  <span>Sigilo e acolhimento terapêutico garantidos.</span>
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                      message.trim()
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <Send size={13} />
                    <span>Enviar Mensagem</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
