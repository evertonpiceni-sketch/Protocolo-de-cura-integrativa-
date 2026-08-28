/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Volume2, VolumeX, Sliders, Mic, Play, Pause,
  Sparkles, Check, X, Shield, RefreshCw, Music
} from 'lucide-react';
import { UserProfile } from '../types';
import { audioEngine } from '../lib/audio';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  availableVoices?: SpeechSynthesisVoice[];
  onOpenProModal?: () => void;
}

export default function AudioSettingsModal({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  availableVoices,
  onOpenProModal
}: AudioSettingsModalProps) {
  const [bgMusicType, setBgMusicType] = useState(userProfile.bgMusicType);
  const [bgMusicVolume, setBgMusicVolume] = useState(userProfile.bgMusicVolume ?? 0.5);
  const [voiceVolume, setVoiceVolume] = useState(userProfile.voiceVolume ?? 0.85);
  const [voiceRate, setVoiceRate] = useState(userProfile.voiceRate ?? 0.82);
  const [voicePitch, setVoicePitch] = useState(userProfile.voicePitch ?? 1.0);
  const [voiceId, setVoiceId] = useState(userProfile.voiceId || '');
  const [audioEnabled, setAudioEnabled] = useState(userProfile.audioEnabled !== false);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  if (!isOpen) return null;

  const rawVoices = availableVoices && availableVoices.length > 0 
    ? availableVoices 
    : audioEngine.getAvailableVoices();
  const voices = rawVoices.filter(v => v.lang.startsWith('pt') || v.lang.startsWith('en') || v.lang.startsWith('es'));

  const handleTestVoice = () => {
    audioEngine.unlock();
    if (isTestingVoice) {
      audioEngine.stopSpeech();
      setIsTestingVoice(false);
    } else {
      setIsTestingVoice(true);
      const testPhrase = `Paz e luz, ${userProfile.name}. O seu campo energético está sendo harmonizado na frequência sagrada de cura.`;
      
      // Also play the bg frequency briefly for test
      if (bgMusicType !== 'none' && audioEnabled) {
        audioEngine.startBG(bgMusicType);
      }

      audioEngine.speakWithElevenLabsOrFallback(
        testPhrase,
        voiceVolume,
        () => setIsTestingVoice(true),
        () => setIsTestingVoice(false),
        undefined,
        undefined,
        {
          voiceId,
          rate: voiceRate,
          pitch: voicePitch,
          lang: 'pt-BR',
          stability: 0.45,
          similarityBoost: 0.75,
          enableBreathingPauses: true,
          userName: userProfile.name
        }
      );
    }
  };

  const handleSave = () => {
    audioEngine.stopSpeech();
    setIsTestingVoice(false);

    const updated: UserProfile = {
      ...userProfile,
      bgMusicType,
      bgMusicVolume,
      voiceVolume,
      voiceRate,
      voicePitch,
      voiceId,
      audioEnabled
    };

    onSaveProfile(updated);
    
    // Apply immediate volume and bg track
    audioEngine.setBGVolume(bgMusicVolume);
    if (audioEnabled && bgMusicType !== 'none') {
      audioEngine.startBG(bgMusicType);
    } else {
      audioEngine.stopBG();
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto" id="audio-settings-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden my-4 max-h-[92vh] overflow-y-auto"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Sliders size={22} className="animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
                Acústica & Frequências
              </span>
              <h3 className="text-base sm:text-lg font-display font-medium text-slate-100">
                Ajuste Completo do Som & Voz
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              audioEngine.stopSpeech();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition cursor-pointer border-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section 1: Background Frequencies & Sounds */}
        <div className="space-y-3 bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-indigo-300 font-semibold uppercase flex items-center gap-1.5">
              <Music size={14} /> Frequência de Fundo
            </label>
            <span className="text-[10px] font-mono text-slate-400">
              {Math.round(bgMusicVolume * 100)}% Volume
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: '396hz', name: '396Hz', desc: 'Libertação de Medo & Culpa', pro: false },
              { id: '528hz', name: '528Hz', desc: 'Reparação e Vitalidade (c/ Binaural Alpha-Beta 12Hz)', pro: false },
              { id: '432hz', name: '432Hz', desc: 'Ressonância Harmônica (c/ Binaural Theta 5Hz)', pro: false },
              { id: '639hz', name: '639Hz', desc: 'Amor & Conexão', pro: false },
              { id: '417hz', name: '417Hz', desc: 'Limpeza de Traumas', pro: false },
              { id: '852hz', name: '852Hz', desc: 'Intuição Espiritual', pro: true },
              { id: '963hz', name: '963Hz', desc: 'Conexão Superior', pro: true },
              { id: '741hz', name: '741Hz', desc: 'Despertar Intuitivo', pro: true },
              { id: 'florestazen', name: 'Floresta Zen', desc: 'Pássaros & Vento', pro: false },
              { id: 'chuvaserena', name: 'Chuva Serena', desc: 'Água Calmante', pro: false },
              { id: 'waves', name: 'Sinos Zen', desc: 'Tigelas Tibetanas', pro: false },
              { id: 'none', name: 'Sem Trilha', desc: 'Silêncio Absoluto', pro: false }
            ].map(track => {
              const isLocked = track.pro && userProfile.plan !== 'pro';
              const isSelected = bgMusicType === track.id;

              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => {
                    if (isLocked && onOpenProModal) {
                      onOpenProModal();
                      return;
                    }
                    setBgMusicType(track.id as any);
                    if (track.id !== 'none') {
                      audioEngine.startBG(track.id as any);
                    } else {
                      audioEngine.stopBG();
                    }
                  }}
                  className={`p-2.5 rounded-xl text-left border transition cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold block">{track.name}</span>
                    {track.pro && (
                      <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded">
                        VIP
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate">{track.desc}</span>
                </button>
              );
            })}
          </div>

          {/* BG Volume Slider */}
          {bgMusicType !== 'none' && (
            <div className="pt-2 space-y-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={bgMusicVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setBgMusicVolume(val);
                  audioEngine.setBGVolume(val);
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Section 2: Guided Speech & Narration Parameters */}
        <div className="space-y-4 bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl">
          <label className="text-xs font-mono text-indigo-300 font-semibold uppercase flex items-center gap-1.5">
            <Mic size={14} /> Voz da Meditação Guiada
          </label>

          {/* Voice Selector */}
          {voices.length > 0 && (
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 block">Timbre da Voz (Instaladas no Dispositivo)</span>
              <select
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 outline-none"
              >
                <option value="">Voz Padrão do Sistema (Automática)</option>
                {voices.map(v => {
                  const voiceKey = (v as any).id || (v as any).name || (v as any).voiceURI;
                  const voiceVal = (v as any).id || (v as any).name;
                  const tag = (v as any).qualityTag ? ` - ${(v as any).qualityTag}` : '';
                  return (
                    <option key={voiceKey} value={voiceVal}>
                      {v.name} ({v.lang}){tag}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Rate / Speed Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Velocidade da Narração</span>
              <span className="font-mono text-indigo-400 text-[11px]">{voiceRate.toFixed(2)}x {voiceRate <= 0.8 ? '(Calma/Profunda)' : voiceRate <= 0.95 ? '(Equilibrada)' : '(Dinâmica)'}</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.2"
              step="0.02"
              value={voiceRate}
              onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Voice Volume */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Volume da Voz</span>
              <span className="font-mono text-indigo-400 text-[11px]">{Math.round(voiceVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={voiceVolume}
              onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        {/* Test Audio Button */}
        <button
          type="button"
          onClick={handleTestVoice}
          className={`w-full py-3 rounded-xl border font-mono text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
            isTestingVoice
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-indigo-500/50'
          }`}
        >
          {isTestingVoice ? <VolumeX size={15} /> : <Play size={15} fill="currentColor" />}
          <span>{isTestingVoice ? 'Pausar Demonstração da Voz' : 'Ouvir Teste de Áudio e Frequência'}</span>
        </button>

        {/* Save & Apply Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/20 text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer border-none font-sans font-bold"
          >
            <Check size={16} />
            Salvar e Aplicar Ajustes de Som
          </button>
        </div>
      </motion.div>
    </div>
  );
}
