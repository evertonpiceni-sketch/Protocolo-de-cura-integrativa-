/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Volume2, VolumeX, Sliders, Mic, Play, Pause,
  Sparkles, Check, X, Shield, RefreshCw, Music,
  Headphones, Activity, Waves, Info
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

  // Sintonização Bioativa (Binaural Beats) State
  const [bioactiveBinauralEnabled, setBioactiveBinauralEnabled] = useState<boolean>(
    userProfile.bioactiveBinauralEnabled ?? false
  );
  const [binauralWaveType, setBinauralWaveType] = useState<'delta' | 'theta' | 'alpha' | 'beta' | 'gamma'>(
    userProfile.binauralWaveType ?? 'alpha'
  );
  const [binauralIntensity, setBinauralIntensity] = useState<number>(
    userProfile.binauralIntensity ?? 0.35
  );
  const [binauralCarrierMode, setBinauralCarrierMode] = useState<'sync' | 'subharmonic' | 'custom'>(
    userProfile.binauralCarrierMode ?? 'sync'
  );
  const [isPlayingBioactivePreview, setIsPlayingBioactivePreview] = useState<boolean>(false);

  if (!isOpen) return null;

  const rawVoices = availableVoices && availableVoices.length > 0 
    ? availableVoices 
    : audioEngine.getAvailableVoices();
  const voices = rawVoices.filter(v => v.lang.startsWith('pt') || v.lang.startsWith('en') || v.lang.startsWith('es'));

  // Live calculation of binaural frequencies for the panel monitor
  const getCarrierHz = () => {
    let base = 432;
    if (bgMusicType && bgMusicType.endsWith('hz')) {
      const parsed = parseInt(bgMusicType.replace('hz', ''), 10);
      if (!isNaN(parsed) && parsed > 0) base = parsed;
    }
    return binauralCarrierMode === 'subharmonic' ? base / 2 : base;
  };

  const getBeatHz = (wave: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma') => {
    switch (wave) {
      case 'delta': return 2.5;
      case 'theta': return 5.5;
      case 'alpha': return 10.0;
      case 'beta': return 15.0;
      case 'gamma': return 40.0;
    }
  };

  const currentCarrierHz = getCarrierHz();
  const currentBeatHz = getBeatHz(binauralWaveType);
  const leftEarHz = (currentCarrierHz - currentBeatHz / 2).toFixed(1);
  const rightEarHz = (currentCarrierHz + currentBeatHz / 2).toFixed(1);

  const updateBioactiveState = (
    enabled: boolean,
    wave: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma',
    intensity: number,
    carrierMode: 'sync' | 'subharmonic' | 'custom'
  ) => {
    audioEngine.setBioactiveConfig({
      enabled,
      waveType: wave,
      intensity,
      carrierMode
    });
  };

  const toggleBioactivePreview = () => {
    audioEngine.unlock();
    if (isPlayingBioactivePreview) {
      audioEngine.stopBG();
      setIsPlayingBioactivePreview(false);
    } else {
      setIsPlayingBioactivePreview(true);
      const effectiveType = bgMusicType !== 'none' ? bgMusicType : '528hz';
      if (bgMusicType === 'none') {
        setBgMusicType('528hz');
      }
      audioEngine.setBioactiveConfig({
        enabled: true,
        waveType: binauralWaveType,
        intensity: binauralIntensity,
        carrierMode: binauralCarrierMode
      });
      setBioactiveBinauralEnabled(true);
      audioEngine.startBG(effectiveType);
    }
  };

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
    if (isPlayingBioactivePreview) {
      setIsPlayingBioactivePreview(false);
    }

    const updated: UserProfile = {
      ...userProfile,
      bgMusicType,
      bgMusicVolume,
      voiceVolume,
      voiceRate,
      voicePitch,
      voiceId,
      audioEnabled,
      bioactiveBinauralEnabled,
      binauralWaveType,
      binauralIntensity,
      binauralCarrierMode
    };

    onSaveProfile(updated);
    
    // Apply immediate volume, bioactive config and bg track
    audioEngine.setBGVolume(bgMusicVolume);
    audioEngine.setBioactiveConfig({
      enabled: bioactiveBinauralEnabled,
      waveType: binauralWaveType,
      intensity: binauralIntensity,
      carrierMode: binauralCarrierMode
    });

    if (audioEnabled && bgMusicType !== 'none') {
      audioEngine.startBG(bgMusicType);
    } else {
      audioEngine.stopBG();
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2A2420]/30 backdrop-blur-md overflow-y-auto" id="audio-settings-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-xl bg-[#FBF8F2] border border-[#E5DAC6] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden my-4 max-h-[92vh] overflow-y-auto"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#B88736]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E5DAC6] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#B88736]/10 border border-[#B88736]/20 text-[#B88736] flex items-center justify-center shrink-0">
              <Sliders size={22} className="animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B88736] font-bold block">
                Acústica & Frequências
              </span>
              <h3 className="text-base sm:text-lg font-display font-medium text-[#2A2420]">
                Ajuste Completo do Som & Voz
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              audioEngine.stopSpeech();
              onClose();
            }}
            className="p-2 text-[#5C5248] hover:text-white bg-[#F5EFE4]/60 hover:bg-[#F5EFE4] rounded-xl transition cursor-pointer border-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section 1: Background Frequencies & Sounds */}
        <div className="space-y-3 bg-white/75 border border-[#E5DAC6] p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-[#B88736] font-semibold uppercase flex items-center gap-1.5">
              <Music size={14} /> Frequência de Fundo
            </label>
            <span className="text-[10px] font-mono text-[#5C5248]">
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
                      ? 'bg-[#B88736]/20 border-[#B88736] text-indigo-200'
                      : 'bg-[#FBF8F2] border-[#E5DAC6] text-[#5C5248] hover:text-[#2A2420] hover:border-[#E5DAC6]'
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
                  <span className="text-[10px] text-[#85786C] block truncate">{track.desc}</span>
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
                className="w-full h-1.5 bg-[#F5EFE4] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Painel de Sintonização Bioativa (Binaural Beats) */}
        <div className="space-y-4 bg-gradient-to-br from-[#FDFBF7] to-[#F7F2E7] border-2 border-[#B88736]/35 p-4 sm:p-5 rounded-2xl shadow-sm relative overflow-hidden" id="bioactive-tuning-panel">
          {/* Subtle warm glow background */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#B88736]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Panel Header & Switch */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                bioactiveBinauralEnabled
                  ? 'bg-[#B88736] text-white shadow-md shadow-[#B88736]/20'
                  : 'bg-[#E5DAC6]/40 text-[#85786C]'
              }`}>
                <Headphones size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#B88736] font-bold">
                    Bioacústica Integrativa
                  </span>
                  <span className="text-[9px] font-mono font-bold text-[#8F631E] bg-[#EAD5A8]/50 px-2 py-0.5 rounded-full border border-[#B88736]/30">
                    Estéreo Binaural
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-display font-medium text-[#2A2420]">
                  Sintonização Bioativa (Binaural Beats)
                </h4>
                <p className="text-[11px] text-[#5C5248] leading-tight mt-0.5">
                  Sobreponha ondas cerebrais sincronizadas acusticamente com a frequência de fundo escolhida.
                </p>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              type="button"
              onClick={() => {
                const nextVal = !bioactiveBinauralEnabled;
                setBioactiveBinauralEnabled(nextVal);
                updateBioactiveState(nextVal, binauralWaveType, binauralIntensity, binauralCarrierMode);
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                bioactiveBinauralEnabled ? 'bg-[#B88736]' : 'bg-[#DCD0BE]'
              }`}
              aria-label="Ativar Sintonização Bioativa"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  bioactiveBinauralEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {bioactiveBinauralEnabled ? (
            <div className="space-y-4 pt-1 border-t border-[#E5DAC6]/70">
              {/* Seletor de Tipo de Onda Cerebral Alvo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-[#8F631E] font-semibold uppercase flex items-center gap-1.5">
                    <Activity size={13} /> Onda Cerebral Alvo ({currentBeatHz.toFixed(1)} Hz)
                  </label>
                  <span className="text-[10px] text-[#8F631E] font-mono font-bold bg-[#EAD5A8]/40 px-2 py-0.5 rounded border border-[#B88736]/20">
                    {binauralWaveType.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'delta', name: 'Ondas Delta', hz: '2.5 Hz', title: 'Regeneração & Sono', desc: 'Restauração celular profunda, alívio de sobrecarga física e ancoramento.' },
                    { id: 'theta', name: 'Ondas Theta', hz: '5.5 Hz', title: 'Meditação & Intuição', desc: 'Acesso sutil ao subconsciente, transmutação energética e acolhimento.' },
                    { id: 'alpha', name: 'Ondas Alpha', hz: '10.0 Hz', title: 'Presença Lúcida (Recomendado)', desc: 'Calma alerta, relaxamento lúcido, harmonia emocional e foco sereno.' },
                    { id: 'beta', name: 'Ondas Beta', hz: '15.0 Hz', title: 'Vitalidade & Clareza', desc: 'Despertar de disposição consciente, clareza mental e ânimo para o agir.' },
                    { id: 'gamma', name: 'Ondas Gamma', hz: '40.0 Hz', title: 'Conexão Superior', desc: 'Transcendência sutil, expansão de consciência e integração espiritual.' },
                  ].map(wave => {
                    const isSelected = binauralWaveType === wave.id;
                    return (
                      <button
                        key={wave.id}
                        type="button"
                        onClick={() => {
                          const w = wave.id as any;
                          setBinauralWaveType(w);
                          updateBioactiveState(true, w, binauralIntensity, binauralCarrierMode);
                        }}
                        className={`p-2.5 rounded-xl text-left border transition cursor-pointer relative overflow-hidden ${
                          isSelected
                            ? 'bg-[#B88736]/15 border-[#B88736] shadow-sm text-[#2A2420]'
                            : 'bg-white/80 border-[#E5DAC6] text-[#5C5248] hover:border-[#B88736]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#2A2420]">{wave.name}</span>
                          <span className="text-[10px] font-mono font-semibold text-[#8F631E] bg-[#EAD5A8]/50 px-1.5 py-0.5 rounded">
                            {wave.hz}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-[#8F631E] block mt-0.5">{wave.title}</span>
                        <span className="text-[10px] text-[#5C5248] block leading-tight mt-0.5">{wave.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sintonização da Portadora Harmônica */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-[#8F631E] font-semibold uppercase flex items-center gap-1.5">
                  <Waves size={13} /> Sintonização da Portadora Harmônica
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBinauralCarrierMode('sync');
                      updateBioactiveState(true, binauralWaveType, binauralIntensity, 'sync');
                    }}
                    className={`p-2.5 rounded-xl text-left border text-xs transition cursor-pointer ${
                      binauralCarrierMode === 'sync'
                        ? 'bg-[#B88736]/15 border-[#B88736] font-semibold text-[#2A2420]'
                        : 'bg-white/70 border-[#E5DAC6] text-[#5C5248] hover:border-[#B88736]/40'
                    }`}
                  >
                    <span className="block font-semibold text-[#2A2420]">Sincronizar com Frequência</span>
                    <span className="text-[10px] text-[#5C5248] block mt-0.5">
                      Portadora em {bgMusicType && bgMusicType.endsWith('hz') ? bgMusicType.replace('hz', ' Hz') : '432 Hz'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBinauralCarrierMode('subharmonic');
                      updateBioactiveState(true, binauralWaveType, binauralIntensity, 'subharmonic');
                    }}
                    className={`p-2.5 rounded-xl text-left border text-xs transition cursor-pointer ${
                      binauralCarrierMode === 'subharmonic'
                        ? 'bg-[#B88736]/15 border-[#B88736] font-semibold text-[#2A2420]'
                        : 'bg-white/70 border-[#E5DAC6] text-[#5C5248] hover:border-[#B88736]/40'
                    }`}
                  >
                    <span className="block font-semibold text-[#2A2420]">Sub-Harmônica Aveludada</span>
                    <span className="text-[10px] text-[#5C5248] block mt-0.5">
                      Oitava inferior ({Math.round(currentCarrierHz)} Hz) para máximo conforto auricular
                    </span>
                  </button>
                </div>
              </div>

              {/* Controle de Intensidade de Mixagem */}
              <div className="space-y-1.5 bg-white/80 border border-[#E5DAC6] p-3.5 rounded-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-[#8F631E] font-semibold uppercase flex items-center gap-1.5">
                    <Sliders size={13} /> Intensidade de Mixagem da Batida
                  </span>
                  <span className="font-mono text-[#8F631E] text-xs font-bold">
                    {Math.round(binauralIntensity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={binauralIntensity}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setBinauralIntensity(val);
                    updateBioactiveState(true, binauralWaveType, val, binauralCarrierMode);
                  }}
                  className="w-full h-1.5 bg-[#E5DAC6] rounded-lg appearance-none cursor-pointer accent-[#B88736]"
                />
                <div className="flex items-center justify-between text-[10px] text-[#85786C] pt-0.5">
                  <span>Suave / Subliminar</span>
                  <span>Harmonia Equilibrada</span>
                  <span>Presença Marcada</span>
                </div>
              </div>

              {/* Monitor de Frequências em Tempo Real */}
              <div className="bg-[#FAF4E8] border border-[#E5DAC6] rounded-xl p-3 text-[11px] space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-[#8F631E] font-bold">
                  <span className="flex items-center gap-1">
                    <Activity size={12} /> Sintonia Estéreo em Tempo Real
                  </span>
                  <span>Batimento: {currentBeatHz.toFixed(1)} Hz ({binauralWaveType.toUpperCase()})</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[#5C5248] pt-1 border-t border-[#E5DAC6]/60">
                  <div className="bg-white/80 px-2.5 py-1.5 rounded-lg border border-[#E5DAC6]/50">
                    <span className="text-[9px] uppercase block text-[#85786C]">Ouvido Esquerdo (L)</span>
                    <span className="text-xs font-bold text-[#2A2420]">{leftEarHz} Hz</span>
                  </div>
                  <div className="bg-white/80 px-2.5 py-1.5 rounded-lg border border-[#E5DAC6]/50">
                    <span className="text-[9px] uppercase block text-[#85786C]">Ouvido Direito (R)</span>
                    <span className="text-xs font-bold text-[#2A2420]">{rightEarHz} Hz</span>
                  </div>
                </div>
                <p className="text-[10px] font-sans text-[#85786C] pt-1 leading-normal">
                  Diferença percebida no cérebro: <strong>{currentBeatHz.toFixed(1)} Hz</strong>. Fones de ouvido recomendados para o efeito bioativo completo.
                </p>
              </div>

              {/* Botão de Prévia da Sintonização Bioativa */}
              <button
                type="button"
                onClick={toggleBioactivePreview}
                className={`w-full py-2.5 rounded-xl border font-mono text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                  isPlayingBioactivePreview
                    ? 'bg-[#B88736] text-white border-[#B88736] shadow-sm'
                    : 'bg-white hover:bg-[#FAF4E8] border-[#E5DAC6] text-[#8F631E]'
                }`}
              >
                {isPlayingBioactivePreview ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                <span>
                  {isPlayingBioactivePreview ? 'Pausar Demonstração Bioativa' : 'Ouvir Prévia da Sintonização Bioativa'}
                </span>
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-[#85786C] bg-white/60 p-3 rounded-xl border border-[#E5DAC6]/60 flex items-center gap-2">
              <Info size={14} className="text-[#B88736] shrink-0" />
              <span>
                Ative para sobrepor batidas binaurais estéreo (Delta, Theta, Alpha, Beta ou Gamma) sincronizadas com sua frequência de fundo.
              </span>
            </div>
          )}
        </div>

        {/* Section 2: Guided Speech & Narration Parameters */}
        <div className="space-y-4 bg-white/75 border border-[#E5DAC6] p-4 rounded-2xl">
          <label className="text-xs font-mono text-[#B88736] font-semibold uppercase flex items-center gap-1.5">
            <Mic size={14} /> Voz da Meditação Guiada
          </label>

          {/* Voice Selector */}
          {voices.length > 0 && (
            <div className="space-y-1">
              <span className="text-[11px] text-[#5C5248] block">Timbre da Voz (Instaladas no Dispositivo)</span>
              <select
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
                className="w-full bg-[#FBF8F2] border border-[#E5DAC6] rounded-xl px-3 py-2 text-xs text-[#2A2420] focus:border-[#B88736] outline-none"
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
              <span className="text-[#5C5248] text-[11px]">Velocidade da Narração</span>
              <span className="font-mono text-[#B88736] text-[11px]">{voiceRate.toFixed(2)}x {voiceRate <= 0.8 ? '(Calma/Profunda)' : voiceRate <= 0.95 ? '(Equilibrada)' : '(Dinâmica)'}</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.2"
              step="0.02"
              value={voiceRate}
              onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#F5EFE4] rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Voice Volume */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#5C5248] text-[11px]">Volume da Voz</span>
              <span className="font-mono text-[#B88736] text-[11px]">{Math.round(voiceVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={voiceVolume}
              onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#F5EFE4] rounded-lg appearance-none cursor-pointer accent-indigo-500"
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
              : 'bg-[#FBF8F2] border-[#E5DAC6] text-[#5C5248] hover:border-[#B88736]/50'
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
            className="w-full bg-[#B88736] hover:bg-[#B88736] text-white font-medium py-3.5 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/20 text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer border-none font-sans font-bold"
          >
            <Check size={16} />
            Salvar e Aplicar Ajustes de Som
          </button>
        </div>
      </motion.div>
    </div>
  );
}
