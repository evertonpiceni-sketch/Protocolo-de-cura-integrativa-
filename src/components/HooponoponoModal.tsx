/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, Sparkles, Volume2, VolumeX, Play, Pause, RotateCcw,
  CheckCircle2, Copy, Share2, X, Star, ShieldCheck, Flame, Sun, Droplets, Info
} from 'lucide-react';
import { audioEngine } from '../lib/audio';

import { UserProfile } from '../types';

interface HooponoponoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userProfile?: UserProfile;
}

const HOOPONOPONO_THEMES = [
  {
    id: 'geral',
    title: 'Limpeza Quântica Geral',
    desc: 'Purificação de todas as memórias de dor, escassez e conflito acumuladas.',
    focusPhrase: 'Eu sinto muito. Por favor, me perdoe. Eu te amo. Sou grato(a).'
  },
  {
    id: 'autoperdao',
    title: 'Autoperdão & Paz Interior',
    desc: 'Libertação de culpas passadas, auto-julgamento e autocobrança excessiva.',
    focusPhrase: 'Querida Criança Interior, eu sinto muito por ter me cobrado tanto. Me perdoe. Eu te amo incondicionalmente. Sou grato(a) pela minha vida.'
  },
  {
    id: 'prosperidade',
    title: 'Desbloqueio Financeiro & Prosperidade',
    desc: 'Limpeza de crenças de escassez, dívidas cármicas e medo do futuro.',
    focusPhrase: 'Memórias de escassez e medo financeiro: eu sinto muito, me perdoem, eu amo a abundância divina, sou profundamente grato(a).'
  },
  {
    id: 'relacionamentos',
    title: 'Cura de Laços & Relacionamentos',
    desc: 'Harmonização de mágoas, ressentimentos familiares e laços afetivos.',
    focusPhrase: 'Divino Criador, limpe em mim qualquer memória compartilhada de dor neste relacionamento. Sinto muito. Me perdoe. Eu te amo. Sou grato(a).'
  }
];

const MORRNAH_PRAYER = `Divino Criador, Pai, Mãe, Filho, todos em Um...

Se eu, minha família, meus parentes e ancestrais lhe ofendemos em pensamentos, palavras, atos ou ações, desde o início da nossa criação até o presente, nós pedimos o Seu perdão...

Deixe que isto se limpe, purifique, libere e corte todas as memórias, bloqueios, energias e vibrações negativas, e transmute essas energias indesejáveis em pura luz...

E assim está feito.

Sinto muito.
Me perdoe.
Eu te amo.
Sou grato.`;

export default function HooponoponoModal({
  isOpen,
  onClose,
  userName = 'Buscador de Luz'
}: HooponoponoModalProps) {
  const [selectedTab, setSelectedTab] = useState<'oracao' | 'japamala' | 'chaves'>('oracao');
  const [selectedTheme, setSelectedTheme] = useState(HOOPONOPONO_THEMES[0]);
  const [targetCount, setTargetCount] = useState<number>(108); // 108 or 21
  const [count, setCount] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [activePhraseIndex, setActivePhraseIndex] = useState<number>(0);

  // Load completed days from local storage
  const [prayedToday, setPrayedToday] = useState<boolean>(() => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      return localStorage.getItem(`cura_integrada_hooponopono_${todayStr}`) === 'true';
    } catch {
      return false;
    }
  });

  const PHRASES = [
    { text: 'Sinto Muito', desc: 'Reconheço que algo em mim atraiu essa memória ou situação.', color: 'text-amber-300' },
    { text: 'Me Perdoe', desc: 'Peço à Divindade que me liberte e limpe essa impressão celular.', color: 'text-cyan-300' },
    { text: 'Eu Te Amo', desc: 'Envolvo o problema, a mim e aos outros na luz da pura compaixão.', color: 'text-rose-300' },
    { text: 'Sou Grato(a)', desc: 'Agradeço pela transmutação imediata e pela paz restaurada.', color: 'text-emerald-300' }
  ];

  // Increment counter with visual pulse
  const handleIncrement = () => {
    audioEngine.unlock();
    setCount(prev => {
      const next = prev + 1;
      if (next >= targetCount) {
        handleMarkDone();
      }
      return next > targetCount ? targetCount : next;
    });
    setActivePhraseIndex(prev => (prev + 1) % PHRASES.length);
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleMarkDone = () => {
    setPrayedToday(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      localStorage.setItem(`cura_integrada_hooponopono_${todayStr}`, 'true');
    } catch (e) {
      console.warn("Storage write error", e);
    }
  };

  const handleToggleAudio = () => {
    audioEngine.unlock();
    if (isPlayingAudio) {
      audioEngine.stopSpeech();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToSpeak = selectedTab === 'oracao'
        ? MORRNAH_PRAYER.replace(/\[NOME\]/g, userName)
        : `${selectedTheme.title}. ${selectedTheme.desc}. ${selectedTheme.focusPhrase}. Sinto muito. Me perdoe. Eu te amo. Sou grato.`;

      audioEngine.speak(
        textToSpeak,
        0.9,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false),
        undefined,
        undefined,
        { rate: 0.82, pitch: 0.98 }
      );
    }
  };

  const handleCopyPrayer = () => {
    navigator.clipboard.writeText(MORRNAH_PRAYER);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  useEffect(() => {
    return () => {
      if (isPlayingAudio) {
        audioEngine.stopSpeech();
      }
    };
  }, [isPlayingAudio]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto" id="hooponopono-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-slate-900 border border-rose-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 relative overflow-hidden my-4 max-h-[92vh] overflow-y-auto"
      >
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            if (isPlayingAudio) audioEngine.stopSpeech();
            onClose();
          }}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition cursor-pointer z-10"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold">
            <Heart size={14} className="fill-rose-400 text-rose-400" />
            <span>ORAÇÃO SAGRADA • 100% GRATUITA</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-medium text-slate-100">
            Ho'oponopono de Cura e Purificação
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto">
            A antiga arte havaiana de reconciliação, limpeza de memórias dolorosas e restauração da paz interior.
          </p>
        </div>

        {/* Top Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setSelectedTab('oracao')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition cursor-pointer text-center ${
              selectedTab === 'oracao'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Oração Original
          </button>
          <button
            onClick={() => setSelectedTab('japamala')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition cursor-pointer text-center ${
              selectedTab === 'japamala'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Japamala ({targetCount}x)
          </button>
          <button
            onClick={() => setSelectedTab('chaves')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition cursor-pointer text-center ${
              selectedTab === 'chaves'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            As 4 Chaves
          </button>
        </div>

        {/* Tab 1: Oração Original de Morrnah Simeona */}
        {selectedTab === 'oracao' && (
          <div className="space-y-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/70 border border-rose-500/20 relative shadow-inner text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-serif italic text-center">
              <div className="absolute top-3 left-3 text-rose-500/30">
                <Sparkles size={20} />
              </div>
              <div className="absolute bottom-3 right-3 text-rose-500/30">
                <Heart size={20} />
              </div>
              {MORRNAH_PRAYER}
            </div>

            {/* 4 Pillars Highlight */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              {PHRASES.map((p, idx) => (
                <div key={idx} className="p-2.5 rounded-2xl bg-slate-950/50 border border-slate-800">
                  <span className={`text-xs font-bold block ${p.color}`}>{p.text}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block leading-tight">{p.desc.substring(0, 32)}...</span>
                </div>
              ))}
            </div>

            {/* Audio & Copy Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleToggleAudio}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md ${
                  isPlayingAudio
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                }`}
              >
                {isPlayingAudio ? <Pause size={15} /> : <Play size={15} />}
                <span>{isPlayingAudio ? 'Pausar Áudio Guiado' : 'Ouvir Oração Guiada'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyPrayer}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy size={14} />
                  <span>{copiedText ? 'Copiada!' : 'Copiar Texto'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleMarkDone}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    prayedToday
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <CheckCircle2 size={14} className={prayedToday ? 'text-emerald-400' : 'text-slate-400'} />
                  <span>{prayedToday ? 'Praticado Hoje!' : 'Marcar como Feito'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Japamala Interativo (108 ou 21 Repetições) */}
        {selectedTab === 'japamala' && (
          <div className="space-y-4">
            {/* Theme Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Escolha o Foco da Limpeza Quântica:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {HOOPONOPONO_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setSelectedTheme(theme);
                      setCount(0);
                    }}
                    className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                      selectedTheme.id === theme.id
                        ? 'bg-rose-950/40 border-rose-500/60 ring-1 ring-rose-500/30'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-100 block">{theme.title}</span>
                    <span className="text-[10px] text-slate-400 leading-tight block mt-0.5 line-clamp-1">{theme.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target repetition toggle: 21x vs 108x */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Meta de Repetições:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => { setTargetCount(21); setCount(0); }}
                  className={`px-3 py-1 rounded-lg font-mono font-bold transition cursor-pointer text-xs ${
                    targetCount === 21 ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  21x (Rápido)
                </button>
                <button
                  type="button"
                  onClick={() => { setTargetCount(108); setCount(0); }}
                  className={`px-3 py-1 rounded-lg font-mono font-bold transition cursor-pointer text-xs ${
                    targetCount === 108 ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  108x (Japamala Sagrado)
                </button>
              </div>
            </div>

            {/* Interactive Pulse Center */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-rose-500/30 text-center space-y-4 relative overflow-hidden shadow-2xl">
              <div className="space-y-1">
                <div className="text-4xl md:text-5xl font-mono font-bold text-rose-400 tracking-tight">
                  {count} <span className="text-base text-slate-500">/ {targetCount}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden max-w-xs mx-auto">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-amber-400 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (count / targetCount) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Central Trigger Button */}
              <div className="flex justify-center">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={handleIncrement}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-400 text-white shadow-2xl shadow-rose-600/40 flex flex-col items-center justify-center p-2 cursor-pointer border-4 border-rose-300/30 select-none"
                >
                  <Heart size={28} className="fill-white drop-shadow animate-pulse" />
                  <span className="text-[11px] font-bold mt-1 tracking-wider uppercase font-mono">
                    {count >= targetCount ? 'Concluído!' : 'Pulsar'}
                  </span>
                </motion.button>
              </div>

              {/* Dynamic Affirmation Text */}
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-lg mx-auto">
                <p className="text-xs sm:text-sm font-serif italic text-rose-200 leading-relaxed">
                  "{selectedTheme.focusPhrase}"
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-slate-200 transition flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Reiniciar Contador</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: As 4 Chaves Sagradas Explicadas */}
        {selectedTab === 'chaves' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200 leading-relaxed flex items-start gap-2">
              <Info size={16} className="text-rose-400 shrink-0 mt-0.5" />
              <span>
                No Ho'oponopono quântico, assumimos 100% de autorresponsabilidade por tudo o que experienciamos. Não se trata de culpa, mas de <strong>poder consciente de transmutação</strong>.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PHRASES.map((phrase, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-bold ${phrase.color}`}>
                      {phrase.text}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">Chave #{idx + 1}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {phrase.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
