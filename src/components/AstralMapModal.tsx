/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles, X, Sun, Moon, Compass, Heart, Printer,
  Flame, Droplets, Wind, Mountain, MessageCircle, Shield, CheckCircle2,
  Clock, MapPin, Calendar, Edit3, Crown, Orbit, Gem, Flower2, Save,
  ChevronRight, Star, Lock
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

type AstralTab = 'trinity' | 'planets' | 'attitudes' | 'therapy' | 'edit';

export default function AstralMapModal({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onOpenProModal
}: AstralMapModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<AstralTab>('trinity');
  const [editBirthDate, setEditBirthDate] = useState(userProfile.birthDate || '');
  const [editBirthTime, setEditBirthTime] = useState(userProfile.birthTime || '');
  const [editBirthCity, setEditBirthCity] = useState(userProfile.birthCity || '');
  const [saveFeedback, setSaveFeedback] = useState('');

  if (!isOpen) return null;

  const isPro = userProfile.plan === 'pro';
  const astral: AstralMapData = calculateAstralMap(
    userProfile.birthDate || editBirthDate,
    userProfile.birthTime || editBirthTime,
    userProfile.birthCity || editBirthCity
  );

  const requestPro = () => {
    if (onOpenProModal) onOpenProModal();
  };

  const selectTab = (tab: AstralTab) => {
    if (tab === 'planets' && !isPro) {
      requestPro();
      return;
    }
    setActiveTab(tab);
  };

  const handlePrint = () => {
    if (!isPro) {
      requestPro();
      return;
    }
    window.print();
  };

  const handleSaveBirthDetails = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editBirthDate) {
      setSaveFeedback('Por favor, informe ao menos a sua data de nascimento.');
      return;
    }

    const calculatedMap = calculateAstralMap(editBirthDate, editBirthTime.trim(), editBirthCity.trim());
    const updated: UserProfile = {
      ...userProfile,
      birthDate: editBirthDate,
      birthTime: editBirthTime.trim() || undefined,
      birthCity: editBirthCity.trim() || undefined,
      astralMap: calculatedMap
    };
    onSaveProfile?.(updated);
    setSaveFeedback('Dados de nascimento e Mapa Astral atualizados com sucesso.');
    setTimeout(() => {
      setSaveFeedback('');
      setActiveTab('trinity');
    }, 1000);
  };

  const formattedBirthDate = userProfile.birthDate
    ? (() => {
        const parts = userProfile.birthDate.split('-');
        return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : userProfile.birthDate;
      })()
    : 'Data não informada';

  const tabClass = (tab: AstralTab) => `min-h-11 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition cursor-pointer border flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35 ${
    activeTab === tab
      ? 'bg-[#F5EFE4] border-[#B88736] text-[#2A2420] shadow-sm'
      : 'bg-white border-[#E5DAC6] text-[#5C5248] hover:border-[#B88736]/45 hover:text-[#2A2420]'
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-[#2A2420]/30 backdrop-blur-md overflow-y-auto overscroll-contain" id="astral-map-modal" role="dialog" aria-modal="true" aria-label="Mapa astral">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        className="w-full max-w-3xl bg-[#FBF8F2] border border-[#B88736]/25 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl relative overflow-hidden my-1 sm:my-4 max-h-[calc(100dvh-1rem)] sm:max-h-[92dvh] flex flex-col"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#B88736]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-700/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-[#E5DAC6] pb-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[#073b2b] flex items-center justify-center text-[#f2dda4] shadow-sm shrink-0 border border-[#B88736]/35">
              <Compass size={24} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8F631E] bg-[#B88736]/10 border border-[#B88736]/25 px-2.5 py-0.5 rounded-full font-bold">Astrologia Integrativa</span>
                {isPro && <span className="text-[10px] font-mono text-[#8F631E] bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full font-bold">VIP PRO</span>}
              </div>
              <h2 className="text-base sm:text-lg font-display font-medium text-[#2A2420] mt-0.5 truncate">Mapa Astral de {userProfile.fullName || userProfile.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => selectTab('edit')} aria-label="Ajustar data e horário de nascimento" aria-pressed={activeTab === 'edit'} className="w-11 h-11 rounded-xl text-[#5C5248] bg-[#F5EFE4] hover:bg-[#EFE4D3] border border-[#E5DAC6] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30" title="Ajustar Data e Horário de Nascimento">
              <Edit3 size={16} />
            </button>
            <button onClick={onClose} aria-label="Fechar mapa astral" className="w-11 h-11 text-[#5C5248] hover:text-[#2A2420] bg-[#F5EFE4]/70 hover:bg-[#EFE4D3] rounded-xl transition cursor-pointer border border-[#E5DAC6] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-2.5 bg-white/80 border border-[#E5DAC6] rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono shrink-0 my-3">
          <div className="flex items-center gap-3 text-[#5C5248] flex-wrap">
            <span className="flex items-center gap-1.5 text-[#2A2420]"><Calendar size={13} className="text-[#B88736]" /> {formattedBirthDate}</span>
            <span className="flex items-center gap-1.5 text-[#2A2420]"><Clock size={13} className="text-[#B88736]" /> {userProfile.birthTime ? `${userProfile.birthTime} (Ascendente calculado)` : '12:00 (aprox.)'}</span>
            {userProfile.birthCity && <span className="flex items-center gap-1.5 text-[#2A2420]"><MapPin size={13} className="text-[#B88736]" /> {userProfile.birthCity}</span>}
          </div>
          <button onClick={() => selectTab('edit')} className="min-h-11 px-2 text-[11px] text-[#8F631E] hover:text-[#5C5248] underline font-sans flex items-center gap-1 cursor-pointer ml-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30 rounded-lg">
            <span>Alterar dados</span><ChevronRight size={12} />
          </button>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0 border-b border-[#E5DAC6] mb-3" role="tablist" aria-label="Seções do mapa astral">
          <button role="tab" aria-selected={activeTab === 'trinity'} onClick={() => selectTab('trinity')} className={tabClass('trinity')}>
            <Sun size={13} className="text-[#B88736]" /><span>Versão Compacta (Trindade & Elementos)</span>
          </button>
          <button role="tab" aria-selected={activeTab === 'planets'} aria-label={`Versão Completa, Planetas e Casas${isPro ? '' : ', recurso PRO'}`} onClick={() => selectTab('planets')} className={tabClass('planets')}>
            <Orbit size={13} className="text-[#8F631E]" /><span>Versão Completa (Planetas & Casas)</span>
            {!isPro && <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[9px] font-bold border border-amber-300 flex items-center gap-1"><Lock size={9} /> PRO</span>}
          </button>
          <button role="tab" aria-selected={activeTab === 'attitudes'} onClick={() => selectTab('attitudes')} className={tabClass('attitudes')}>
            <Compass size={13} className="text-emerald-700" /><span>Atitudes & Práticas Sagradas</span>
          </button>
          <button role="tab" aria-selected={activeTab === 'therapy'} onClick={() => selectTab('therapy')} className={tabClass('therapy')}>
            <Gem size={13} className="text-[#8F631E]" /><span>Práticas & Cristais</span>
          </button>
        </div>

        <div ref={printRef} className="flex-1 overflow-y-auto overscroll-contain space-y-4 pr-1">
          {activeTab === 'trinity' && (
            <div className="space-y-4" role="tabpanel">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300/70 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between"><span className="text-[10px] font-mono uppercase text-amber-800 font-bold flex items-center gap-1.5"><Sun size={14} /> Sol • Essência</span><span className="text-xl">{astral.sunSignSymbol}</span></div>
                  <div><h3 className="text-lg font-display font-bold text-[#5C5248]">{astral.sunSign}</h3><span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 inline-block mt-0.5">Elemento {astral.sunSignElement} • {astral.sunSignModality}</span></div>
                  <p className="text-xs text-[#5C5248] leading-relaxed pt-1"><strong>Virtude da Alma:</strong> {astral.sunSignVirtue}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5EFE4] border border-[#B88736]/30 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between"><span className="text-[10px] font-mono uppercase text-[#8F631E] font-bold flex items-center gap-1.5"><Sparkles size={14} /> Ascendente • Aura</span><span className="text-xl">{astral.ascendantSignSymbol}</span></div>
                  <div><h3 className="text-lg font-display font-bold text-[#2A2420]">{astral.ascendantSign}</h3><span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#B88736]/10 border border-[#B88736]/20 text-[#8F631E] inline-block mt-0.5">Elemento {astral.ascendantSignElement} • Regente: {astral.ascendantHouseLord || 'Cosmos'}</span></div>
                  <p className="text-xs text-[#5C5248] leading-relaxed pt-1">{astral.ascendantSignMeaning}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5EFE4] border border-[#E5DAC6] space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between"><span className="text-[10px] font-mono uppercase text-[#8F631E] font-bold flex items-center gap-1.5"><Moon size={14} /> Lua • Emoções</span><span className="text-xl">{astral.moonSignSymbol}</span></div>
                  <div><h3 className="text-lg font-display font-bold text-[#2A2420]">{astral.moonSign}</h3><span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#E5DAC6] text-[#8F631E] inline-block mt-0.5">Elemento {astral.moonSignElement}</span></div>
                  <p className="text-xs text-[#5C5248] leading-relaxed pt-1">{astral.moonSignMeaning}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-white border border-[#E5DAC6] space-y-2.5">
                  <div className="flex items-center justify-between gap-2"><span className="text-xs font-mono font-bold text-[#2A2420] uppercase flex items-center gap-1.5"><Compass size={14} className="text-[#B88736]" /> Balanço dos 4 Elementos</span><span className="text-[10px] font-mono text-[#8F631E] font-bold">Predomínio: {astral.dominantElement}</span></div>
                  <div className="space-y-2 pt-1">
                    {[
                      ['Fogo (Vontade)', astral.elementBalance.fire, 'bg-amber-500', <Flame size={12} key="fire" />],
                      ['Terra (Estrutura)', astral.elementBalance.earth, 'bg-emerald-600', <Mountain size={12} key="earth" />],
                      ['Ar (Intelecto)', astral.elementBalance.air, 'bg-cyan-500', <Wind size={12} key="air" />],
                      ['Água (Sensibilidade)', astral.elementBalance.water, 'bg-[#B88736]', <Droplets size={12} key="water" />]
                    ].map(([label, value, color, icon]) => (
                      <div className="space-y-1" key={String(label)}>
                        <div className="flex justify-between text-[11px] font-mono"><span className="text-[#5C5248] flex items-center gap-1">{icon}{label}</span><span className="text-[#5C5248] font-bold">{String(value)}%</span></div>
                        <div className="h-1.5 bg-[#F5EFE4] rounded-full overflow-hidden"><div className={`h-full ${color}`} style={{ width: `${value}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5EFE4] border border-[#B88736]/30 space-y-2 flex flex-col justify-between">
                  <div><span className="text-[10px] font-mono uppercase text-[#8F631E] font-bold block mb-1">Orientação do Terapeuta Éverton Piceni</span><p className="text-xs text-[#2A2420] leading-relaxed italic">“{astral.astralSpiritualGuidance}”</p></div>
                  <div className="p-2.5 rounded-xl bg-white/80 border border-[#B88736]/20 mt-2"><span className="text-[10px] font-mono text-[#8F631E] block font-bold uppercase">Mantra de Ativação Solar:</span><p className="text-xs text-[#5C5248] font-semibold mt-0.5">“{astral.sunSignMantra}”</p></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'planets' && isPro && (
            <div className="space-y-3.5" role="tabpanel">
              {astral.midheavenMission && (
                <div className="p-4 rounded-2xl bg-[#F5EFE4] border border-[#B88736]/25 space-y-1.5">
                  <div className="flex items-center justify-between gap-2"><span className="text-xs font-mono font-bold text-[#8F631E] uppercase flex items-center gap-1.5"><Crown size={14} /> Meio do Céu (Casa 10) • Propósito Maior</span><span className="text-xs font-bold text-[#8F631E]">{astral.midheavenSign} {astral.midheavenSignSymbol}</span></div>
                  <p className="text-xs text-[#2A2420] leading-relaxed">{astral.midheavenMission}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {astral.planets?.map((planet, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-[#E5DAC6] space-y-1">
                    <div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-[#2A2420] flex items-center gap-1.5"><span className="text-[#B88736] font-bold">{planet.planetSymbol}</span><span>{planet.planet}</span></span><span className="text-[10px] font-mono text-[#8F631E] bg-[#F5EFE4] px-2 py-0.5 rounded border border-[#E5DAC6]">{planet.sign} ({planet.signSymbol}) • Casa {planet.house}</span></div>
                    <p className="text-[11px] text-[#5C5248] leading-relaxed">{planet.spiritualMeaning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attitudes' && (
            <div className="space-y-4" role="tabpanel">
              {astral.soulMissionSummary && (
                <div className="p-4 rounded-2xl bg-[#F5EFE4] border border-[#B88736]/30 space-y-2"><div className="flex items-center gap-2"><Crown size={16} className="text-[#B88736]" /><h4 className="text-xs font-mono font-bold text-[#8F631E] uppercase">Missão de Alma e Propósito Cósmico</h4></div><p className="text-xs text-[#2A2420] leading-relaxed font-medium">{astral.soulMissionSummary}</p></div>
              )}
              {astral.practicalAttitudes && (
                <div className="space-y-3.5">
                  <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-2.5"><div className="flex items-center gap-2"><Compass size={16} className="text-emerald-700" /><h4 className="text-xs font-mono font-bold text-emerald-800 uppercase">Atitudes Práticas Diárias (Elemento Predominante: {astral.dominantElement})</h4></div><div className="space-y-2">{astral.practicalAttitudes.dailyPractices.map((practice, idx) => <div key={idx} className="p-2.5 rounded-xl bg-[#FBF8F2] border border-[#E5DAC6] text-xs text-[#2A2420] flex items-start gap-2"><CheckCircle2 size={14} className="text-emerald-700 shrink-0 mt-0.5" /><span>{practice}</span></div>)}</div></div>
                  <div className="p-4 rounded-2xl bg-white border border-[#B88736]/30 space-y-2.5"><div className="flex items-center gap-2"><Shield size={16} className="text-[#B88736]" /><h4 className="text-xs font-mono font-bold text-[#8F631E] uppercase">Transmutação da Sombra Cósmica & Acolhimento Emocional</h4></div><div className="space-y-2">{astral.practicalAttitudes.shadowWork.map((shadow, idx) => <div key={idx} className="p-2.5 rounded-xl bg-[#FBF8F2] border border-[#E5DAC6] text-xs text-[#5C5248] leading-relaxed">{shadow}</div>)}</div></div>
                  <div className="p-4 rounded-2xl bg-white border border-amber-200 space-y-2.5"><div className="flex items-center gap-2"><Star size={16} className="text-amber-700" /><h4 className="text-xs font-mono font-bold text-amber-800 uppercase">Harmonização dos 4 Elementos Sagrados</h4></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{astral.practicalAttitudes.elementHarmonization.map((elem, idx) => <div key={idx} className="p-2.5 rounded-xl bg-[#FBF8F2] border border-[#E5DAC6] text-xs text-[#5C5248] leading-relaxed">{elem}</div>)}</div></div>
                  <div className="p-4 rounded-2xl bg-[#F5EFE4] border border-[#B88736]/40 space-y-2"><span className="text-[10px] font-mono uppercase tracking-widest text-[#8F631E] font-bold flex items-center gap-1.5"><Sparkles size={12} /> Meditação Cósmica Personalizada</span><p className="text-xs text-[#2A2420] italic font-serif leading-relaxed">“{astral.practicalAttitudes.guidedMeditationPrompt}”</p></div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'therapy' && (
            <div className="space-y-4" role="tabpanel">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-white border border-[#E5DAC6] space-y-2.5"><div className="flex items-center gap-2"><Gem size={16} className="text-[#8F631E]" /><h4 className="text-xs font-mono font-bold text-[#8F631E] uppercase">Cristais de Ancoragem e Purificação</h4></div><div className="space-y-1.5">{astral.suggestedCrystals?.map((crystal, idx) => <div key={idx} className="p-2 rounded-xl bg-[#FBF8F2] border border-[#E5DAC6] text-xs text-[#2A2420] flex items-center justify-between gap-2"><span>{crystal}</span><span className="text-[10px] font-mono text-[#8F631E]">Harmonia simbólica</span></div>)}</div></div>
                <div className="p-4 rounded-2xl bg-white border border-[#E5DAC6] space-y-2.5"><div className="flex items-center gap-2"><Flower2 size={16} className="text-emerald-700" /><h4 className="text-xs font-mono font-bold text-emerald-800 uppercase">Ervas & Aromas de Harmonização</h4></div><div className="space-y-1.5">{astral.suggestedHerbsAromas?.map((herb, idx) => <div key={idx} className="p-2 rounded-xl bg-[#FBF8F2] border border-[#E5DAC6] text-xs text-[#2A2420] flex items-center justify-between gap-2"><span>{herb}</span><span className="text-[10px] font-mono text-emerald-700">Uso tradicional</span></div>)}</div></div>
              </div>
              <div className="p-4 rounded-2xl bg-[#F5EFE4] border border-[#B88736]/30 space-y-1.5"><span className="text-xs font-mono font-bold text-[#8F631E] uppercase flex items-center gap-1.5"><Heart size={14} className="text-[#8F631E]" /> Frequência sugerida na leitura: {astral.suggestedFrequency}</span><p className="text-xs text-[#5C5248] leading-relaxed">Para esta leitura com Sol em <strong>{astral.sunSign}</strong> e foco simbólico no Chakra <strong>{astral.sunSignChakra}</strong>, a frequência é apresentada como prática contemplativa associada ao sistema.</p></div>
            </div>
          )}

          {activeTab === 'edit' && (
            <form onSubmit={handleSaveBirthDetails} className="p-5 rounded-2xl bg-white border border-[#E5DAC6] space-y-4" role="tabpanel">
              <div className="space-y-1"><h4 className="text-xs font-mono font-bold text-[#2A2420] uppercase flex items-center gap-2"><Edit3 size={14} className="text-[#B88736]" /><span>Ajustar Data e Horário de Nascimento</span></h4><p className="text-xs text-[#5C5248]">O horário informado permite refinar o cálculo usado pelo aplicativo para o Ascendente e as casas astrológicas.</p></div>
              {saveFeedback && <div role="status" aria-live="polite" className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2"><CheckCircle2 size={15} /><span>{saveFeedback}</span></div>}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="space-y-1"><span className="text-[10px] font-mono text-[#5C5248] uppercase">Data de Nascimento *</span><input type="date" value={editBirthDate} onChange={(event) => setEditBirthDate(event.target.value)} required className="w-full bg-[#FBF8F2] border border-[#E5DAC6] rounded-xl px-3 py-2.5 text-xs text-[#2A2420] focus:border-[#B88736] outline-none" /></label>
                <label className="space-y-1"><span className="text-[10px] font-mono text-[#5C5248] uppercase">Horário (HH:MM)</span><input type="time" value={editBirthTime} onChange={(event) => setEditBirthTime(event.target.value)} className="w-full bg-[#FBF8F2] border border-[#E5DAC6] rounded-xl px-3 py-2.5 text-xs text-[#2A2420] focus:border-[#B88736] outline-none" /></label>
                <label className="space-y-1"><span className="text-[10px] font-mono text-[#5C5248] uppercase">Cidade / Estado</span><input type="text" value={editBirthCity} onChange={(event) => setEditBirthCity(event.target.value)} placeholder="Ex.: Porto Alegre / RS" className="w-full bg-[#FBF8F2] border border-[#E5DAC6] rounded-xl px-3 py-2.5 text-xs text-[#2A2420] focus:border-[#B88736] outline-none" /></label>
              </div>
              <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => selectTab('trinity')} className="min-h-11 px-4 py-2 rounded-xl bg-[#FBF8F2] hover:bg-[#F5EFE4] text-[#5C5248] text-xs font-medium transition cursor-pointer">Cancelar</button><button type="submit" className="min-h-11 px-4 py-2 rounded-xl bg-[#B88736] hover:bg-[#8F631E] text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md"><Save size={14} /><span>Salvar e Recalcular Mapa</span></button></div>
            </form>
          )}
        </div>

        <div className="pt-3 border-t border-[#E5DAC6] flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <a href={`https://wa.me/5551982215296?text=Ol%C3%A1%20%C3%89verton%2C%20visualizei%20meu%20Mapa%20Astral%20no%20app%20(Sol%20em%20${encodeURIComponent(astral.sunSign)}%20e%20Ascendente%20em%20${encodeURIComponent(astral.ascendantSign)})%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida!`} target="_blank" rel="noopener noreferrer" className="min-h-11 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/30"><MessageCircle size={15} /><span>Falar com Éverton Piceni</span></a>
          <button type="button" onClick={handlePrint} aria-label={isPro ? 'Imprimir ou salvar o Mapa Astral em PDF' : 'Impressão em PDF, recurso PRO'} className="min-h-11 px-4 py-2.5 bg-[#B88736] hover:bg-[#8F631E] text-white font-medium rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35"><Printer size={15} /><span>{isPro ? 'Imprimir / Salvar PDF' : 'PDF • PRO'}</span>{!isPro && <Lock size={12} />}</button>
        </div>
      </motion.div>
    </div>
  );
}
