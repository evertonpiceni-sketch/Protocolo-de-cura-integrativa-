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
    badge: 'Um lugar para voltar para si',
    title: 'Como você está, de verdade?',
    subtitle: 'Protocolo da Transformação',
    description: 'Um espaço de acolhimento, energia e práticas integrativas criado por Everton Piceni para acompanhar você no seu próprio tempo.',
    durationSeconds: 9,
    frequency: '396hz',
    frequencyLabel: '396 Hz • Frequência de Libertação de Culpa e Medo',
    icon: <Sparkles className="text-amber-300 animate-pulse" size={32} />,
    bgGradient: 'from-[#0a412d] via-[#FBF8F2] to-[#021b13]',
    highlights: [
      'Alinhamento dos 7 Chakras principais',
      'Meditações guiadas com voz humana',
      'Jornadas de 7 e 21 dias'
    ]
  },
  {
    id: 2,
    badge: 'Sua experiência',
    title: 'Voz, frequência e presença',
    subtitle: 'Uma meditação preparada para o seu momento',
    description: 'A voz conduz a experiência enquanto a frequência e o visual do chakra acompanham cada etapa da meditação.',
    durationSeconds: 9,
    frequency: '528hz',
    frequencyLabel: '528 Hz • Frequência do Milagre e Regeneração Celular',
    icon: <Radio className="text-emerald-400 animate-bounce" size={32} />,
    bgGradient: 'from-[#0c4a34] via-[#FBF8F2] to-[#021b13]',
    highlights: [
      'Solfeggio de 396Hz a 963Hz',
      'O chakra se ilumina durante a prática',
      'Áudio contínuo mesmo com a tela bloqueada'
    ]
  },
  {
    id: 3,
    badge: 'Caminhos de cuidado',
    title: 'Uma experiência que considera você por inteiro',
    subtitle: 'Energia, autoconhecimento e natureza',
    description: 'Anamnese, chakras, florais, aromas, numerologia, mapa astral e outras possibilidades organizadas sem retirar sua liberdade de escolha.',
    durationSeconds: 9,
    frequency: '432hz',
    frequencyLabel: '432 Hz • Harmonia Cósmica Universal',
    icon: <Compass className="text-purple-400 animate-spin" size={32} />,
    bgGradient: 'from-[#123f2f] via-[#FBF8F2] to-[#021b13]',
    highlights: [
      'Mapa Astral Compacto e Completo',
      'Florais, aromas e banhos energéticos',
      'Diário de Reconexão e perguntas sistêmicas'
    ]
  },
  {
    id: 4,
    badge: 'Sua jornada continua',
    title: 'Um passo de cada vez',
    subtitle: 'Progresso sem cobrança',
    description: 'Registre percepções, acompanhe seus dias e retorne quando puder. Aqui, alguns minutos também são cuidado.',
    durationSeconds: 9,
    frequency: '963hz',
    frequencyLabel: '963 Hz • Frequência de Deus & Conexão Divina',
    icon: <Shield className="text-amber-400 animate-pulse" size={32} />,
    bgGradient: 'from-[#174c38] via-[#062f21] to-[#021b13]',
    highlights: [
      'Proteção e Presença — São Miguel',
      'Acompanhamento dos sete chakras',
      'Acolhimento e integração ao final de cada dia'
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
    const shareText = `Conheça o Protocolo da Transformação — um lugar para voltar para si: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'Protocolo da Transformação',
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Link de divulgação copiado para a área de transferência!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#021b13]/96 p-3 backdrop-blur-xl sm:p-4" id="promo-video-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative my-4 flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[#e7ca76]/35 bg-[#FBF8F2] shadow-2xl"
      >
        {/* Top Video Player Bar */}
        <div className="z-20 flex items-center justify-between border-b border-[#e7ca76]/20 bg-[#F5EFE4]/92 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e7ca76]/15 text-[#e7ca76] shadow-md">
              <Sparkles size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B88736] font-bold block">
                Conheça o Protocolo
              </span>
              <h3 className="text-xs sm:text-sm font-display font-medium text-[#2A2420]">
                Protocolo da Transformação
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-[#F5EFE4]/80 hover:bg-[#F5EFE4] text-[#5C5248] hover:text-white transition cursor-pointer border border-[#E5DAC6]/60"
              title="Compartilhar Vídeo"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={() => {
                audioEngine.stopBG();
                onClose();
              }}
              className="p-2 rounded-xl bg-[#F5EFE4]/80 hover:bg-[#F5EFE4] text-[#5C5248] hover:text-white transition cursor-pointer border border-[#E5DAC6]/60"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scene Progress Bars */}
        <div className="grid grid-cols-4 gap-1.5 px-4 pt-3 bg-white/70 z-20">
          {PROMO_SCENES.map((sc, i) => (
            <button
              key={sc.id}
              onClick={() => {
                setCurrentSceneIndex(i);
                setSceneProgress(0);
              }}
              className="h-1.5 rounded-full overflow-hidden bg-[#F5EFE4] transition cursor-pointer"
            >
              <div
                className={`h-full transition-all duration-100 ${
                  i < currentSceneIndex
                    ? 'bg-[#B88736] w-full'
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
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#B88736]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Scene Top Badge */}
          <div className="flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full bg-white/75 border border-[#B88736]/30 text-[#B88736] text-[11px] font-mono font-bold flex items-center gap-2 backdrop-blur-md shadow-lg">
              <Sparkles size={12} className="text-amber-400" />
              <span>{scene.badge}</span>
            </span>

            <div className="flex items-center gap-2 bg-white/75 border border-[#E5DAC6] px-3 py-1 rounded-full text-xs font-mono text-[#5C5248] backdrop-blur-md">
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
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              className="my-auto py-6 space-y-4 z-10 max-w-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/80 border border-[#E5DAC6] shadow-xl">
                  {scene.icon}
                </div>
                <div>
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
                    {scene.subtitle}
                  </span>
                  <h2 className="text-xl sm:text-3xl font-display font-medium text-[#2A2420] leading-tight">
                    {scene.title}
                  </h2>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#2A2420] leading-relaxed font-sans bg-white/40 p-4 rounded-2xl border border-[#E5DAC6]/60 backdrop-blur-md">
                {scene.description}
              </p>

              {/* Highlights pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {scene.highlights.map((h, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/80 border border-[#B88736]/25 text-[11px] text-[#2A2420] font-medium flex items-center gap-2 shadow-sm">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Equalizer animation bar */}
          <div className="flex items-center justify-between z-10 pt-4 border-t border-[#E5DAC6]/60">
            <div className="flex items-center gap-2 text-xs font-mono text-[#5C5248]">
              <span className="flex items-end gap-0.5 h-4">
                <span className={`w-1 bg-indigo-400 rounded-full transition-all ${isPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
                <span className={`w-1 bg-purple-400 rounded-full transition-all ${isPlaying ? 'h-4 animate-bounce' : 'h-1'}`} />
                <span className={`w-1 bg-emerald-400 rounded-full transition-all ${isPlaying ? 'h-2 animate-pulse' : 'h-1'}`} />
                <span className={`w-1 bg-amber-400 rounded-full transition-all ${isPlaying ? 'h-3.5 animate-bounce' : 'h-1'}`} />
              </span>
              <span>{scene.frequencyLabel}</span>
            </div>

            <span className="text-xs font-mono text-[#5C5248]">
              Cena {currentSceneIndex + 1} de {PROMO_SCENES.length}
            </span>
          </div>
        </div>

        {/* Video Player Controls & Conversion Actions */}
        <div className="bg-white border-t border-[#E5DAC6] p-4 flex flex-wrap items-center justify-between gap-3 z-20">
          {/* Playback Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-[#FBF8F2] hover:bg-[#F5EFE4] text-[#5C5248] transition cursor-pointer border border-[#E5DAC6]"
              title="Cena Anterior"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2.5 rounded-xl bg-[#B88736] hover:bg-[#B88736] text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              <span>{isPlaying ? 'Pausar Vídeo' : 'Reproduzir Vídeo'}</span>
            </button>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-[#FBF8F2] hover:bg-[#F5EFE4] text-[#5C5248] transition cursor-pointer border border-[#E5DAC6]"
              title="Próxima Cena"
            >
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2.5 rounded-xl border transition cursor-pointer ${
                isMuted
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-[#FBF8F2] border-[#E5DAC6] text-[#5C5248]'
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
