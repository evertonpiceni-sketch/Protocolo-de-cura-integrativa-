/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, X, Sun, Moon, Compass, Heart, Award, Printer,
  Flame, Droplets, Wind, Mountain, MessageCircle, Shield, CheckCircle2,
  Clock, MapPin, Calendar, Edit3, Crown, Orbit, Gem, Flower2, Save,
  ChevronRight, Star
} from 'lucide-react';
import { UserProfile, AstralMapData } from '../types';
import { calculateAstralMap } from '../utils/astrology';

interface AstralMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile?: (updatedProfile: UserProfile) => void;
  onOpenProModal?: () => void;
}

export default function AstralMapModal({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onOpenProModal
}: AstralMapModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'trinity' | 'planets' | 'attitudes' | 'therapy' | 'edit'>('trinity');

  // Edit fields state
  const [editBirthDate, setEditBirthDate] = useState(userProfile.birthDate || '');
  const [editBirthTime, setEditBirthTime] = useState(userProfile.birthTime || '');
  const [editBirthCity, setEditBirthCity] = useState(userProfile.birthCity || '');
  const [saveFeedback, setSaveFeedback] = useState('');

  if (!isOpen) return null;

  const astral: AstralMapData = calculateAstralMap(
    userProfile.birthDate || editBirthDate,
    userProfile.birthTime || editBirthTime,
    userProfile.birthCity || editBirthCity
  );

  const handlePrint = () => {
    window.print();
  };

  const handleSaveBirthDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBirthDate) {
      setSaveFeedback('Por favor, informe ao menos a sua data de nascimento.');
      return;
    }

    const calculatedMap = calculateAstralMap(
      editBirthDate,
      editBirthTime.trim(),
      editBirthCity.trim()
    );

    const updated: UserProfile = {
      ...userProfile,
      birthDate: editBirthDate,
      birthTime: editBirthTime.trim() || undefined,
      birthCity: editBirthCity.trim() || undefined,
      astralMap: calculatedMap
    };

    if (onSaveProfile) {
      onSaveProfile(updated);
    }

    setSaveFeedback('Dados de nascimento e Mapa Astral atualizados com sucesso!');
    setTimeout(() => {
      setSaveFeedback('');
      setActiveTab('trinity');
    }, 1000);
  };

  const formattedBirthDate = userProfile.birthDate
    ? (() => {
        const parts = userProfile.birthDate.split('-');
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        return userProfile.birthDate;
      })()
    : 'Data não informada';

  const isPro = userProfile.plan === 'pro';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto" id="astral-map-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        className="w-full max-w-3xl bg-slate-900 border border-purple-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Divine Cosmic Background Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0 border border-purple-400/40">
              <Compass size={24} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  Astrologia Quântica Integrada
                </span>
                {isPro && (
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-500/15 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                    VIP PRO
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-display font-medium text-slate-100 mt-0.5">
                Mapa Astral de {userProfile.fullName || userProfile.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('edit')}
              className={`p-2 rounded-xl text-xs font-mono transition cursor-pointer border ${
                activeTab === 'edit'
                  ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Ajustar Data e Horário de Nascimento"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition cursor-pointer border border-slate-700/50"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Birth Meta Strip */}
        <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono shrink-0 my-3">
          <div className="flex items-center gap-3 text-slate-400 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Calendar size={13} className="text-indigo-400" /> {formattedBirthDate}
            </span>
            <span className="flex items-center gap-1.5 text-slate-200">
              <Clock size={13} className="text-indigo-400" /> {userProfile.birthTime ? `${userProfile.birthTime} (Ascendente Calculado)` : '12:00 (Aprox.)'}
            </span>
            {userProfile.birthCity && (
              <span className="flex items-center gap-1.5 text-slate-200">
                <MapPin size={13} className="text-indigo-400" /> {userProfile.birthCity}
              </span>
            )}
          </div>

          <button
            onClick={() => setActiveTab('edit')}
            className="text-[11px] text-purple-400 hover:text-purple-300 underline font-sans flex items-center gap-1 cursor-pointer ml-auto"
          >
            <span>Alterar dados</span>
            <ChevronRight size={12} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0 border-b border-slate-800 mb-3">
          <button
            onClick={() => setActiveTab('trinity')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition cursor-pointer border flex items-center gap-1.5 ${
              activeTab === 'trinity'
                ? 'bg-purple-600/25 border-purple-500 text-purple-200 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            <Sun size={13} className="text-amber-400" />
            <span>Versão Compacta (Trindade & Elementos)</span>
          </button>

          <button
            onClick={() => setActiveTab('planets')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition cursor-pointer border flex items-center gap-1.5 ${
              activeTab === 'planets'
                ? 'bg-purple-600/25 border-purple-500 text-purple-200 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            <Orbit size={13} className="text-indigo-400" />
            <span>Versão Completa (Planetas & Casas)</span>
            {!isPro && (
              <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[9px] font-bold">
                PRO
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('attitudes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition cursor-pointer border flex items-center gap-1.5 ${
              activeTab === 'attitudes'
                ? 'bg-purple-600/25 border-purple-500 text-purple-200 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            <Compass size={13} className="text-emerald-400" />
            <span>Atitudes & Práticas Sagradas</span>
          </button>

          <button
            onClick={() => setActiveTab('therapy')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition cursor-pointer border flex items-center gap-1.5 ${
              activeTab === 'therapy'
                ? 'bg-purple-600/25 border-purple-500 text-purple-200 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            <Gem size={13} className="text-rose-400" />
            <span>Terapia Quântica & Cristais</span>
          </button>
        </div>

        {/* Scrollable Main Content */}
        <div ref={printRef} className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* TAB 1: TRINITY & ELEMENTS */}
          {activeTab === 'trinity' && (
            <div className="space-y-4">
              {/* Top 3 Core Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Sol */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-950/30 to-slate-950 border border-amber-500/30 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                      <Sun size={14} /> Sol • Essência
                    </span>
                    <span className="text-xl">{astral.sunSignSymbol}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-amber-200">{astral.sunSign}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 inline-block mt-0.5">
                      Elemento {astral.sunSignElement} • {astral.sunSignModality}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    <strong>Virtude da Alma:</strong> {astral.sunSignVirtue}
                  </p>
                </div>

                {/* Ascendente */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-indigo-950/30 to-slate-950 border border-indigo-500/30 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold flex items-center gap-1.5">
                      <Sparkles size={14} /> Ascendente • Aura
                    </span>
                    <span className="text-xl">{astral.ascendantSignSymbol}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-indigo-200">{astral.ascendantSign}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 inline-block mt-0.5">
                      Elemento {astral.ascendantSignElement} • Regente: {astral.ascendantHouseLord || 'Cosmos'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {astral.ascendantSignMeaning}
                  </p>
                </div>

                {/* Lua */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-purple-950/30 to-slate-950 border border-purple-500/30 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-purple-400 font-bold flex items-center gap-1.5">
                      <Moon size={14} /> Lua • Emoções
                    </span>
                    <span className="text-xl">{astral.moonSignSymbol}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-purple-200">{astral.moonSign}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 inline-block mt-0.5">
                      Elemento {astral.moonSignElement}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {astral.moonSignMeaning}
                  </p>
                </div>
              </div>

              {/* Elements & Energy Alignment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* 4 Elements */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-1.5">
                      <Compass size={14} className="text-indigo-400" /> Balanço dos 4 Elementos
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">
                      Predomínio: {astral.dominantElement}
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-amber-400 flex items-center gap-1"><Flame size={12} /> Fogo (Vontade)</span>
                        <span className="text-slate-300 font-bold">{astral.elementBalance.fire}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-850 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${astral.elementBalance.fire}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-emerald-400 flex items-center gap-1"><Mountain size={12} /> Terra (Estrutura)</span>
                        <span className="text-slate-300 font-bold">{astral.elementBalance.earth}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-850 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${astral.elementBalance.earth}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-cyan-300 flex items-center gap-1"><Wind size={12} /> Ar (Intelecto)</span>
                        <span className="text-slate-300 font-bold">{astral.elementBalance.air}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-850 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400" style={{ width: `${astral.elementBalance.air}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-indigo-400 flex items-center gap-1"><Droplets size={12} /> Água (Sensibilidade)</span>
                        <span className="text-slate-300 font-bold">{astral.elementBalance.water}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-850 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${astral.elementBalance.water}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spiritual Direction Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-950 border border-indigo-500/30 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block mb-1">
                      Orientação do Terapeuta Éverton Piceni
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed italic">
                      "{astral.astralSpiritualGuidance}"
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 mt-2">
                    <span className="text-[10px] font-mono text-amber-400 block font-bold uppercase">
                      Mantra de Ativação Solar:
                    </span>
                    <p className="text-xs text-amber-200 font-semibold mt-0.5">
                      "{astral.sunSignMantra}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PLANETS & HOUSES */}
          {activeTab === 'planets' && (
            <div className="space-y-3.5">
              {!isPro && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-950 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                        <Sparkles size={11} /> Versão Completa do Mapa Astral
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Esta é uma prévia do seu Mapa Astral Completo. Assinantes do <strong>Plano PRO</strong> têm acesso irrestrito às casas astrológicas, planetas e impressão em PDF.
                    </p>
                  </div>
                  {onOpenProModal && (
                    <button
                      onClick={onOpenProModal}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow-md hover:from-amber-400 hover:to-amber-300"
                    >
                      Assinar Plano PRO
                    </button>
                  )}
                </div>
              )}

              {astral.midheavenMission && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-slate-950 border border-purple-500/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                      <Crown size={14} /> Meio do Céu (Casa 10) • Propósito Maior
                    </span>
                    <span className="text-xs font-bold text-purple-300">{astral.midheavenSign} {astral.midheavenSignSymbol}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {astral.midheavenMission}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {astral.planets?.map((pl, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <span className="text-amber-400 font-bold">{pl.planetSymbol}</span>
                        <span>{pl.planet}</span>
                      </span>
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        {pl.sign} ({pl.signSymbol}) • Casa {pl.house}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {pl.spiritualMeaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ATTITUDES & SACRED PRACTICES */}
          {activeTab === 'attitudes' && (
            <div className="space-y-4">
              {/* Soul Mission Header Card */}
              {astral.soulMissionSummary && (
                <div className="p-4.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-950 border border-purple-500/35 space-y-2">
                  <div className="flex items-center gap-2">
                    <Crown size={16} className="text-amber-400" />
                    <h4 className="text-xs font-mono font-bold text-amber-300 uppercase">
                      Missão de Alma e Propósito Cósmico
                    </h4>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {astral.soulMissionSummary}
                  </p>
                </div>
              )}

              {/* Practical Attitudes & Daily Rituals */}
              {astral.practicalAttitudes && (
                <div className="space-y-3.5">
                  {/* Práticas Diárias do Elemento */}
                  <div className="p-4.5 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Compass size={16} className="text-emerald-400" />
                      <h4 className="text-xs font-mono font-bold text-emerald-300 uppercase">
                        Atitudes Práticas Diárias (Elemento Predominante: {astral.dominantElement})
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {astral.practicalAttitudes.dailyPractices.map((practice, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span>{practice}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transmutação da Sombra & Raízes Lunares */}
                  <div className="p-4.5 rounded-2xl bg-slate-950/90 border border-indigo-500/30 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-indigo-400" />
                      <h4 className="text-xs font-mono font-bold text-indigo-300 uppercase">
                        Transmutação da Sombra Cósmica & Cura Emocional
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {astral.practicalAttitudes.shadowWork.map((shadow, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                          {shadow}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Diagnóstico dos 4 Elementos */}
                  <div className="p-4.5 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-amber-400" />
                      <h4 className="text-xs font-mono font-bold text-amber-300 uppercase">
                        Harmonização dos 4 Elementos Sagrados
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {astral.practicalAttitudes.elementHarmonization.map((elem, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                          {elem}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meditação Guiada Cósmica */}
                  <div className="p-4.5 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-purple-950/40 to-slate-950 border border-indigo-500/40 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 font-bold flex items-center gap-1.5">
                      <Sparkles size={12} className="text-indigo-400" /> Meditação Cósmica Personalizada
                    </span>
                    <p className="text-xs text-slate-200 italic font-serif leading-relaxed">
                      "{astral.practicalAttitudes.guidedMeditationPrompt}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: THERAPY & CRYSTALS */}
          {activeTab === 'therapy' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Cristais */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Gem size={16} className="text-purple-400" />
                    <h4 className="text-xs font-mono font-bold text-purple-300 uppercase">
                      Cristais de Ancoragem e Purificação
                    </h4>
                  </div>
                  <div className="space-y-1.5">
                    {astral.suggestedCrystals?.map((c, i) => (
                      <div key={i} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center justify-between">
                        <span>{c}</span>
                        <span className="text-[10px] font-mono text-purple-400">Harmonia Áurica</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ervas & Aromas */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Flower2 size={16} className="text-emerald-400" />
                    <h4 className="text-xs font-mono font-bold text-emerald-300 uppercase">
                      Ervas & Aromas de Harmonização
                    </h4>
                  </div>
                  <div className="space-y-1.5">
                    {astral.suggestedHerbsAromas?.map((h, i) => (
                      <div key={i} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center justify-between">
                        <span>{h}</span>
                        <span className="text-[10px] font-mono text-emerald-400">Proteção Vital</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Frequência Sagrada Recomendada */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-950 border border-indigo-500/30 space-y-1.5">
                <span className="text-xs font-mono font-bold text-indigo-300 uppercase flex items-center gap-1.5">
                  <Heart size={14} className="text-rose-400" /> Frequência de Cura Pessoal: {astral.suggestedFrequency}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Para o seu mapa astral com Sol em <strong>{astral.sunSign}</strong> e Chakra <strong>{astral.sunSignChakra}</strong>, esta frequência restaura o fluxo prânico e dissolve energias estagnadas.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: EDIT BIRTH DATA */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSaveBirthDetails} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
                  <Edit3 size={14} className="text-indigo-400" />
                  <span>Ajustar Data e Horário de Nascimento</span>
                </h4>
                <p className="text-xs text-slate-400">
                  O horário exato permite calcular com perfeição o seu Ascendente e todas as casas astrológicas.
                </p>
              </div>

              {saveFeedback && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 size={15} />
                  <span>{saveFeedback}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Data de Nascimento *</label>
                  <input
                    type="date"
                    value={editBirthDate}
                    onChange={(e) => setEditBirthDate(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Horário (HH:MM)</label>
                  <input
                    type="time"
                    value={editBirthTime}
                    onChange={(e) => setEditBirthTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Cidade / Estado</label>
                  <input
                    type="text"
                    value={editBirthCity}
                    onChange={(e) => setEditBirthCity(e.target.value)}
                    placeholder="Ex: Porto Alegre / RS"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('trinity')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  <Save size={14} />
                  <span>Salvar e Recalcular Mapa</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <a
            href={`https://wa.me/5551982215296?text=Ol%C3%A1%20%C3%89verton%2C%20visualizei%20meu%20Mapa%20Astral%20no%20app%20(Sol%20em%20${encodeURIComponent(astral.sunSign)}%20e%20Ascendente%20em%20${encodeURIComponent(astral.ascendantSign)})%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida!`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-600/20"
          >
            <MessageCircle size={15} />
            <span>Falar com Éverton Piceni</span>
          </a>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            <Printer size={15} />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
