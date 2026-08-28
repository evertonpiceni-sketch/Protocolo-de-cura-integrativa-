/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play, Pause, Volume2, VolumeX, Sparkles, X, ChevronRight,
  ChevronLeft, Award, Crown, Heart, CheckCircle2, MessageSquare,
  Share2, Compass, Hash, Radio, Flame, Shield
} from 'lucide-react';
import { audioEngine } from '../lib/audio';

interface PromoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProModal?: () => void;
  onOpenContact?: () => void;
}

interface PromoScene {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  durationSeconds: number;
  frequency: '396hz' | '528hz' | '432hz' | '963hz';
  frequencyLabel: string;
  icon: React.ReactNode;
  bgGradient: string;
  highlights: string[];
}

const PROMO_SCENES: PromoScene[] = [
  {
    id: 1,
    badge: 'O Despertar da Consciência',
    title: 'Transforme sua Vida em 21 Dias',
    subtitle: 'Protocolo Quântico de Meditação & Reprogramação Subconsciente',
    description: 'Um método guiado e terapêutico desenvolvido pelo terapeuta holístico Éverton Piceni para dissolver couraças de ansiedade, medo e bloqueios ancestrais.',
    durationSeconds: 7,
    frequency: '396hz',
    frequencyLabel: '396 Hz • Frequência de Libertação de Culpa e Medo',
    icon: <Sparkles className="text-amber-300 animate-pulse" size={32} />,
    bgGradient: 'from-indigo-950 via-slate-900 to-purple-950',
    highlights: [
      'Alinhamento dos 7 Chakras principais',
      'Liberação de traumas e estresse crônico',
      'Reprogramação neural diária de 21 dias'
    ]
  },
  {
    id: 2,
    badge: 'Cura Sonora Sagrada',
    title: 'Frequências Solfeggio Puras & Ondas Cerebrais',
    subtitle: 'Ressonância Celular e Reprogramação Vibracional',
    description: 'Sons binaurais e frequências milenares geradas em tempo real para sincronizar os dois hemisférios cerebrais em estados Alpha e Theta profundos.',
    durationSeconds: 7,
    frequency: '528hz',
    frequencyLabel: '528 Hz • Frequência do Milagre e Regeneração Celular',
    icon: <Radio className="text-emerald-400 animate-bounce" size={32} />,
    bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    highlights: [
      'Solfeggio de 396Hz a 963Hz',
      'Trilhas da Floresta Zen, Chuva Serena e Ondas do Mar',
      'Vozes terapêuticas personalizadas em múltiplos idiomas'
    ]
  },
  {
    id: 3,
    badge: 'Sabedoria Ancestral Integrada',
    title: 'Astrologia Quântica & Numerologia Cabalística',
    subtitle: 'Seu Mapa Cósmico e Potencial de Prosperidade Revelados',
    description: 'Cálculo astronômico do seu Mapa Astral (Sol, Lua, Ascendente, Casas) e Mapa Numerológico Pitagórico com diagnóstico de otimização de nome e assinatura para atrair riqueza.',
    durationSeconds: 7,
    frequency: '432hz',
    frequencyLabel: '432 Hz • Harmonia Cósmica Universal',
    icon: <Compass className="text-purple-400 animate-spin" size={32} />,
    bgGradient: 'from-purple-950 via-slate-900 to-indigo-950',
    highlights: [
      'Mapa Astral Compacto e Completo',
      'Numerologia de Prosperidade & Assinatura Próspera',
      'Biblioteca Sagrada de Banhos de Ervas Fitoenergéticos'
    ]
  },
  {
    id: 4,
    badge: 'Proteção Espiritual & Resultados Reais',
    title: 'Oração dos 21 Dias do Arcanjo Miguel & Reiki',
    subtitle: 'Blindagem Áurica, Anamnese Personalizada e Comunidade',
    description: 'Acesse gratuitamente a Oração dos 21 Dias de São Miguel Arcanjo para limpeza espiritual profunda e receba anamnese com indicação do melhor sistema de Reiki para você.',
    durationSeconds: 7,
    frequency: '963hz',
    frequencyLabel: '963 Hz • Frequência de Deus & Conexão Divina',
    icon: <Shield className="text-amber-400 animate-pulse" size={32} />,
    bgGradient: 'from-amber-950 via-slate-900 to-rose-950',
    highlights: [
      'Oração dos 21 Dias do Arcanjo Miguel (100% Gratuita)',
      'Anamnese Sistêmica com diagnóstico de Reiki e Chakras',
      'Suporte direto e acolhedor via WhatsApp'
    ]
  }
];

export default function PromoVideoModal({
  isOpen,
  onClose,
  onOpenProModal,
  onOpenContact
}: PromoVideoModalProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scene = PROMO_SCENES[currentSceneIndex];

  // Manage auto-play scene timer
  useEffect(() => {
    if (!isOpen || !isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 100;
    const totalMs = scene.durationSeconds * 1000;

    timerRef.current = setInterval(() => {
      setSceneProgress((prev) => {
        const next = prev + (intervalMs / totalMs) * 100;
        if (next >= 100) {
          // Go to next scene
          setCurrentSceneIndex((curr) => (curr + 1) % PROMO_SCENES.length);
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPlaying, currentSceneIndex, scene.durationSeconds]);

  // Audio tone generation for promo
  useEffect(() => {
    if (!isOpen || isMuted) {
      audioEngine.stopBG();
      return;
    }

    if (isPlaying) {
      audioEngine.startBG(scene.frequency);
    } else {
      audioEngine.stopBG();
    }

    return () => {
      audioEngine.stopBG();
    };
  }, [isOpen, isPlaying, isMuted, scene.frequency]);

  if (!isOpen) return null;

  const handleNext = () => {
    setSceneProgress(0);
    setCurrentSceneIndex((curr) => (curr + 1) % PROMO_SCENES.length);
  };

  const handlePrev = () => {
    setSceneProgress(0);
    setCurrentSceneIndex((curr) => (curr - 1 + PROMO_SCENES.length) % PROMO_SCENES.length);
  };

  const handleShare = () => {
    const shareText = `🌟 Conheça o Aplicativo Oficial Protocolo Éverton Piceni - 21 Dias de Meditação & Terapia Quântica: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'Protocolo Éverton Piceni - Vídeo Apresentação',
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Link de divulgação copiado para a área de transferência!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/95 backdrop-blur-xl overflow-y-auto" id="promo-video-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl bg-slate-900 border border-indigo-500/40 rounded-3xl overflow-hidden shadow-2xl relative my-4 flex flex-col"
      >
        {/* Top Video Player Bar */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Sparkles size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
                Vídeo Propaganda Oficial
              </span>
              <h3 className="text-xs sm:text-sm font-display font-medium text-slate-200">
                Apresentação do Protocolo Éverton Piceni
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700/60"
              title="Compartilhar Vídeo"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={() => {
                audioEngine.stopBG();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer border border-slate-700/60"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scene Progress Bars */}
        <div className="grid grid-cols-4 gap-1.5 px-4 pt-3 bg-slate-950/60 z-20">
          {PROMO_SCENES.map((sc, i) => (
            <button
              key={sc.id}
              onClick={() => {
                setCurrentSceneIndex(i);
                setSceneProgress(0);
              }}
              className="h-1.5 rounded-full overflow-hidden bg-slate-800 transition cursor-pointer"
            >
              <div
                className={`h-full transition-all duration-100 ${
                  i < currentSceneIndex
                    ? 'bg-indigo-500 w-full'
                    : i === currentSceneIndex
                    ? 'bg-gradient-to-r from-indigo-500 to-amber-400'
                    : 'w-0'
                }`}
                style={{ width: i === currentSceneIndex ? `${sceneProgress}%` : undefined }}
              />
            </button>
          ))}
        </div>

        {/* Cinematic Stage / Video Canvas */}
        <div className={`relative min-h-[380px] sm:min-h-[440px] p-6 sm:p-10 flex flex-col justify-between overflow-hidden bg-gradient-to-br ${scene.bgGradient} transition-colors duration-700`}>
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Scene Top Badge */}
          <div className="flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full bg-slate-950/70 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono font-bold flex items-center gap-2 backdrop-blur-md shadow-lg">
              <Sparkles size={12} className="text-amber-400" />
              <span>{scene.badge}</span>
            </span>

            <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-800 px-3 py-1 rounded-full text-xs font-mono text-slate-300 backdrop-blur-md">
              <Radio size={13} className="text-emerald-400 animate-pulse" />
              <span>{scene.frequencyLabel.split('•')[0]}</span>
            </div>
          </div>

          {/* Center Dynamic Content with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="my-auto py-6 space-y-4 z-10 max-w-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl">
                  {scene.icon}
                </div>
                <div>
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
                    {scene.subtitle}
                  </span>
                  <h2 className="text-xl sm:text-3xl font-display font-medium text-slate-100 leading-tight">
                    {scene.title}
                  </h2>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 backdrop-blur-md">
                {scene.description}
              </p>

              {/* Highlights pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {scene.highlights.map((h, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/25 text-[11px] text-slate-200 font-medium flex items-center gap-2 shadow-sm">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Equalizer animation bar */}
          <div className="flex items-center justify-between z-10 pt-4 border-t border-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="flex items-end gap-0.5 h-4">
                <span className={`w-1 bg-indigo-400 rounded-full transition-all ${isPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
                <span className={`w-1 bg-purple-400 rounded-full transition-all ${isPlaying ? 'h-4 animate-bounce' : 'h-1'}`} />
                <span className={`w-1 bg-emerald-400 rounded-full transition-all ${isPlaying ? 'h-2 animate-pulse' : 'h-1'}`} />
                <span className={`w-1 bg-amber-400 rounded-full transition-all ${isPlaying ? 'h-3.5 animate-bounce' : 'h-1'}`} />
              </span>
              <span>{scene.frequencyLabel}</span>
            </div>

            <span className="text-xs font-mono text-slate-400">
              Cena {currentSceneIndex + 1} de {PROMO_SCENES.length}
            </span>
          </div>
        </div>

        {/* Video Player Controls & Conversion Actions */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3 z-20">
          {/* Playback Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 transition cursor-pointer border border-slate-800"
              title="Cena Anterior"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              <span>{isPlaying ? 'Pausar Vídeo' : 'Reproduzir Vídeo'}</span>
            </button>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 transition cursor-pointer border border-slate-800"
              title="Próxima Cena"
            >
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2.5 rounded-xl border transition cursor-pointer ${
                isMuted
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
              title={isMuted ? 'Ativar Áudio de Cura' : 'Silenciar'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-emerald-400 animate-pulse" />}
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {onOpenContact && (
              <button
                onClick={() => {
                  audioEngine.stopBG();
                  onClose();
                  onOpenContact();
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <MessageSquare size={14} />
                <span>Falar com Terapeuta</span>
              </button>
            )}

            {onOpenProModal && (
              <button
                onClick={() => {
                  audioEngine.stopBG();
                  onClose();
                  onOpenProModal();
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Crown size={14} />
                <span>Desbloquear Acesso VIP</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
