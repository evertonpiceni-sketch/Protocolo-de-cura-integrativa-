/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, Sparkles, X, Activity, Shield, Check, Flame,
  Sun, Moon, Brain, Compass, Printer, Edit3, ArrowRight,
  ArrowLeft, CheckCircle2, AlertCircle, FileText, Zap, Radio, MessageSquare, Award, Volume2, VolumeX, Crown,
  Loader2, Lock, Leaf, Play, Square, Send, ThumbsUp, Star
} from 'lucide-react';
import { UserProfile, AnamnesisData } from '../types';
import { evaluateBestTreatmentFromAnamnesis } from '../lib/anamnesisTreatmentEngine';
import { audioEngine } from '../lib/audio';

interface AnamnesisModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveAnamnesis: (anamnesis: AnamnesisData) => void;
  onOpenSpecificTreatment?: (category?: string) => void;
  onOpenContact?: () => void;
  onApplyFrequency?: (freq: '396hz' | '528hz' | '432hz' | '639hz' | '741hz' | '852hz' | '963hz' | '417hz' | 'waves' | 'florestazen' | 'chuvaserena' | 'none') => void;
}

const COMPLAINTS_OPTIONS = [
  { id: 'ansiedade', label: 'Ansiedade & Agitação Mental', icon: Brain },
  { id: 'insonia', label: 'Insônia ou Sono Interrompido', icon: Moon },
  { id: 'dores_fisicas', label: 'Tensão Muscular / Dores Corporais', icon: Activity },
  { id: 'esgotamento', label: 'Esgotamento & Cansaço Crônico', icon: Zap },
  { id: 'bloqueio_prosperidade', label: 'Bloqueio Financeiro / Prosperidade', icon: Sun },
  { id: 'magoas_passado', label: 'Mágoas / Dificuldade em Perdoar', icon: Heart },
  { id: 'inseguranca_medo', label: 'Insegurança & Medo do Futuro', icon: Shield },
  { id: 'sobrecarga_estresse', label: 'Sobrecarga Emocional & Estresse', icon: Flame },
  { id: 'vazio_existencial', label: 'Vazio Existencial / Falta de Sentido', icon: Compass }
];

const EMOTIONAL_STATES = [
  'Angústia no peito', 'Irritabilidade fácil', 'Sentimento de culpa',
  'Medo constante', 'Tristeza profunda', 'Autocobrança excessiva',
  'Sensação de solidão', 'Desmotivação diária', 'Dificuldade de concentração'
];

const PHYSICAL_SYMPTOMS = [
  'Tensão no pescoço e ombros', 'Aperto ou peso no peito', 'Dores de cabeça / enxaqueca',
  'Desconforto gástrico / estômago', 'Cansaço ao acordar', 'Bruxismo ou travamento maxilar',
  'Respiração curta e superficial', 'Peso nas pernas e articulações'
];

const CHAKRAS_LIST = [
  { id: 'basico', name: '1. Básico (Raiz)', theme: 'Segurança, sobrevivência, firmeza terrena e finanças', color: 'text-red-400 border-red-500/30 bg-red-950/20' },
  { id: 'sacral', name: '2. Sacral (Umbilical)', theme: 'Criatividade, prazer, emoções e relacionamentos', color: 'text-orange-400 border-orange-500/30 bg-orange-950/20' },
  { id: 'plexo', name: '3. Plexo Solar', theme: 'Autoestima, poder pessoal, coragem e digestão emocional', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-950/20' },
  { id: 'cardiaco', name: '4. Cardíaco', theme: 'Amor incondicional, perdão, paz e compaixão', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20' },
  { id: 'laringeo', name: '5. Laríngeo', theme: 'Expressão da verdade, comunicação e desbloqueio vocal', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20' },
  { id: 'frontal', name: '6. Frontal (3º Olho)', theme: 'Intuição, clareza mental, discernimento e foco', color: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/20' },
  { id: 'coronario', name: '7. Coronário', theme: 'Conexão com a Fonte Divina, espiritualidade e plenitude', color: 'text-violet-400 border-violet-500/30 bg-violet-950/20' }
];

export default function AnamnesisModal({
  isOpen,
  onClose,
  userProfile,
  onSaveAnamnesis,
  onOpenSpecificTreatment,
  onOpenContact,
  onApplyFrequency
}: AnamnesisModalProps) {
  const existingAnamnesis = userProfile.anamnesis;
  const [isEditing, setIsEditing] = useState<boolean>(!existingAnamnesis);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Computed recommendation if anamnesis exists
  const recommendation = existingAnamnesis
    ? evaluateBestTreatmentFromAnamnesis(existingAnamnesis, userProfile)
    : null;

  const daysSinceLastAnamnesis = existingAnamnesis 
    ? Math.floor((new Date().getTime() - new Date(existingAnamnesis.filledAt).getTime()) / (1000 * 3600 * 24))
    : 0;

  // Form State
  const [mainComplaints, setMainComplaints] = useState<string[]>(existingAnamnesis?.mainComplaints || []);
  const [complaintNotes, setComplaintNotes] = useState<string>(existingAnamnesis?.complaintNotes || '');
  const [stressLevel, setStressLevel] = useState<number>(existingAnamnesis?.stressLevel ?? 7);
  const [sleepQuality, setSleepQuality] = useState<'pessimo' | 'ruim' | 'regular' | 'bom' | 'excelente'>(existingAnamnesis?.sleepQuality || 'regular');
  const [physicalSymptoms, setPhysicalSymptoms] = useState<string[]>(existingAnamnesis?.physicalSymptoms || []);
  const [emotionalState, setEmotionalState] = useState<string[]>(existingAnamnesis?.emotionalState || []);
  const [chakraImbalance, setChakraImbalance] = useState<string[]>(existingAnamnesis?.chakraImbalance || []);
  const [primaryGoal, setPrimaryGoal] = useState<string>(existingAnamnesis?.primaryGoal || 'Paz interior e alívio da ansiedade');
  const [goalDetails, setGoalDetails] = useState<string>(existingAnamnesis?.goalDetails || '');
  const [dailyTimeAvailable, setDailyTimeAvailable] = useState<'10min' | '20min' | '30min+'>(existingAnamnesis?.dailyTimeAvailable || '20min');
  const [isProcessingAi, setIsProcessingAi] = useState<boolean>(false);
  const [isPlayingTherapeuticVoice, setIsPlayingTherapeuticVoice] = useState<boolean>(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState<boolean>(false);
  const [selectedVoiceGender, setSelectedVoiceGender] = useState<'masculina' | 'feminina'>(
    userProfile.preferredVoiceGender || (userProfile.preferredVoice === 'Rachel' ? 'feminina' : 'masculina')
  );
  const [feedbackReaction, setFeedbackReaction] = useState<string | null>(null);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [is639HzActive, setIs639HzActive] = useState<boolean>(true);
  const audioPlayerRef = React.useRef<HTMLAudioElement | null>(null);

  // Manage 639Hz Solfeggio frequency: melhora a compreensão, tolerância e relações interpessoais enquanto o usuário escolhe as respostas
  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (isEditing && is639HzActive) {
      audioEngine.unlock();
      audioEngine.setBGVolume(0.40);
      audioEngine.startBG('639hz');
    } else {
      if (audioEngine.getCurrentSynthType() === '639hz') {
        audioEngine.stopBG();
      }
    }

    return () => {
      if (audioEngine.getCurrentSynthType() === '639hz') {
        audioEngine.stopBG();
        if (userProfile.audioEnabled && userProfile.bgMusicType && userProfile.bgMusicType !== 'none' && userProfile.bgMusicType !== '639hz') {
          audioEngine.startBG(userProfile.bgMusicType);
        }
      }
    };
  }, [isOpen, isEditing, is639HzActive, userProfile.audioEnabled, userProfile.bgMusicType]);

  const handleToggle639Hz = () => {
    if (is639HzActive) {
      audioEngine.stopBG();
      setIs639HzActive(false);
    } else {
      audioEngine.unlock();
      audioEngine.setBGVolume(0.40);
      audioEngine.startBG('639hz');
      setIs639HzActive(true);
    }
  };

  const handleCloseModal = () => {
    stopTherapeuticVoice();
    if (audioEngine.getCurrentSynthType() === '639hz') {
      audioEngine.stopBG();
      if (userProfile.audioEnabled && userProfile.bgMusicType && userProfile.bgMusicType !== 'none' && userProfile.bgMusicType !== '639hz') {
        audioEngine.startBG(userProfile.bgMusicType);
      }
    }
    onClose();
  };

  const stopTherapeuticVoice = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingTherapeuticVoice(false);
    setIsLoadingVoice(false);
  };

  const playTherapeuticVoice = async (text: string, overrideGender?: 'masculina' | 'feminina') => {
    const gender = overrideGender || selectedVoiceGender;
    if (isPlayingTherapeuticVoice) {
      stopTherapeuticVoice();
      return;
    }

    setIsLoadingVoice(true);
    try {
      // 1. Try ElevenLabs API endpoint with chosen voice
      const chosenVoiceId = gender === 'masculina' ? (userProfile.preferredVoice || 'Marcus') : 'Rachel';
      const response = await fetch('/api/elevenlabs/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId: chosenVoiceId,
          stability: 0.45,
          similarityBoost: 0.75,
          style: 0.15,
          enableBreathingPauses: true
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioPlayerRef.current = audio;

        audio.onended = () => {
          setIsPlayingTherapeuticVoice(false);
          setIsLoadingVoice(false);
        };
        audio.onerror = () => {
          setIsPlayingTherapeuticVoice(false);
          setIsLoadingVoice(false);
        };

        await audio.play();
        setIsPlayingTherapeuticVoice(true);
        setIsLoadingVoice(false);
        return;
      }
    } catch (e) {
      console.warn("ElevenLabs TTS unavailable, falling back to natural Web Speech", e);
    }

    // 2. Fallback to High-Definition Natural Web Speech API with matched gender
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      const voices = window.speechSynthesis.getVoices();
      const ptVoices = voices.filter(v => v.lang.startsWith('pt') || v.lang.includes('BR'));

      if (gender === 'feminina') {
        const femaleVoice = ptVoices.find(v => 
          v.name.toLowerCase().includes('female') || 
          v.name.toLowerCase().includes('francisca') || 
          v.name.toLowerCase().includes('maria') || 
          v.name.toLowerCase().includes('luciana') || 
          v.name.toLowerCase().includes('leticia') || 
          v.name.toLowerCase().includes('victoria') ||
          v.name.toLowerCase().includes('zira')
        ) || ptVoices[0];
        if (femaleVoice) utterance.voice = femaleVoice;
        utterance.pitch = 1.05;
        utterance.rate = 0.86;
      } else {
        const maleVoice = ptVoices.find(v => 
          v.name.toLowerCase().includes('male') || 
          v.name.toLowerCase().includes('antonio') || 
          v.name.toLowerCase().includes('felipe') || 
          v.name.toLowerCase().includes('daniel') || 
          v.name.toLowerCase().includes('ricardo') ||
          v.name.toLowerCase().includes('david')
        ) || ptVoices[0];
        if (maleVoice) utterance.voice = maleVoice;
        utterance.pitch = 0.92;
        utterance.rate = 0.86;
      }

      utterance.onend = () => {
        setIsPlayingTherapeuticVoice(false);
        setIsLoadingVoice(false);
      };
      utterance.onerror = () => {
        setIsPlayingTherapeuticVoice(false);
        setIsLoadingVoice(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlayingTherapeuticVoice(true);
      setIsLoadingVoice(false);
    } else {
      setIsLoadingVoice(false);
      alert("Reprodução de áudio não suportada neste navegador.");
    }
  };

  if (!isOpen) return null;

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    audioEngine.unlock();
    audioEngine.playHeartSelectionChime();
    if (is639HzActive && audioEngine.getCurrentSynthType() !== '639hz') {
      audioEngine.startBG('639hz');
    }
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Helper generator for personalized prescription
  const generatePrescription = (): { recommendedFreq: '528hz' | '432hz' | '963hz' | '741hz' | 'waves'; focusText: string; customDecreeText: string } => {
    let recommendedFreq: '528hz' | '432hz' | '963hz' | '741hz' | 'waves' = '528hz';
    let focusText = 'Alinhamento integral do campo áurico e ancoramento de serenidade no agora.';
    let customDecreeText = `Eu, ${userProfile.fullName || userProfile.name}, acolho a paz em minhas células e permito que todo padrão de tensão seja dissolvido na Luz.`;

    if (mainComplaints.includes('ansiedade') || mainComplaints.includes('insonia') || stressLevel >= 8) {
      recommendedFreq = '528hz';
      focusText = 'Acalmar o sistema nervoso central, desacelerar ondas cerebrais e restabelecer o campo magnético do coração.';
      customDecreeText = `Eu, ${userProfile.fullName || userProfile.name}, declaro que a minha mente repousa em paz soberana. Entrego toda a ansiedade e recebo a harmonia divina em cada respiração.`;
    } else if (mainComplaints.includes('dores_fisicas') || mainComplaints.includes('esgotamento')) {
      recommendedFreq = '432hz';
      focusText = 'Regeneração celular profunda, desbloqueio de canais meridianos e sintonia harmônica com a ressonância natural da Terra.';
      customDecreeText = `Eu, ${userProfile.fullName || userProfile.name}, ativo a cura celular em meu corpo físico. Minhas energias são restauradas e meu templo se fortalece a cada dia.`;
    } else if (mainComplaints.includes('magoas_passado') || mainComplaints.includes('sobrecarga_estresse')) {
      recommendedFreq = '741hz';
      focusText = 'Desintoxicação emocional, transmutação pela Chama Violeta e dissolução de mágoas e energias densas estagnadas.';
      customDecreeText = `Eu, ${userProfile.fullName || userProfile.name}, liberto todo o passado com gratidão. Perdoo, abençoo e me abro para viver a leveza e a pureza do presente.`;
    } else if (mainComplaints.includes('vazio_existencial') || chakraImbalance.includes('coronario') || chakraImbalance.includes('frontal')) {
      recommendedFreq = '963hz';
      focusText = 'Despertar da glândula pineal, ativação da intuição superior e religação consciente com a Sabedoria Cósmica.';
      customDecreeText = `Eu, ${userProfile.fullName || userProfile.name}, estou conectado(a) com a Fonte Suprema de Toda a Criação. Sou guiado(a) pela Luz e nada me falta.`;
    }

    return { recommendedFreq, focusText, customDecreeText };
  };

  const handleFinish = async () => {
    setIsProcessingAi(true);
    const { recommendedFreq, focusText, customDecreeText } = generatePrescription();

    try {
      const response = await fetch('/api/anamnese', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: userProfile.fullName || userProfile.name,
          queixas_principais: mainComplaints,
          relato_livre: complaintNotes,
          nivel_estresse: stressLevel,
          qualidade_sono: sleepQuality,
          sintomas_fisicos: physicalSymptoms,
          estados_emocionais: emotionalState,
          chakras_desalinhados: chakraImbalance,
        })
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const aiData = await response.json();
      
      const newAnamnesis: AnamnesisData = {
        filledAt: new Date().toISOString(),
        mainComplaints,
        complaintNotes,
        stressLevel,
        sleepQuality,
        physicalSymptoms,
        emotionalState,
        chakraImbalance,
        primaryGoal,
        goalDetails,
        dailyTimeAvailable,
        recommendedFrequency: aiData.ciclo_recomendado?.includes('528Hz') ? '528hz' : '432hz',
        prescribedFocus: aiData.justificativa_terapeutica || focusText,
        recommendedFloral: aiData.receita_integrativa?.floral_bach,
        recommendedAromatherapy: aiData.receita_integrativa?.aromaterapia_oleo,
        customDecree: customDecreeText,
        aiAnalysis: aiData
      };

      onSaveAnamnesis(newAnamnesis);
      if (audioEngine.getCurrentSynthType() === '639hz') {
        audioEngine.stopBG();
        if (userProfile.audioEnabled && userProfile.bgMusicType && userProfile.bgMusicType !== 'none' && userProfile.bgMusicType !== '639hz') {
          audioEngine.startBG(userProfile.bgMusicType);
        }
      }
      setIsEditing(false);
    } catch (err) {
      console.warn("Anamnese via API fallback para engine local:", err);
      const newAnamnesis: AnamnesisData = {
        filledAt: new Date().toISOString(),
        mainComplaints,
        complaintNotes,
        stressLevel,
        sleepQuality,
        physicalSymptoms,
        emotionalState,
        chakraImbalance,
        primaryGoal,
        goalDetails,
        dailyTimeAvailable,
        recommendedFrequency: recommendedFreq,
        prescribedFocus: focusText,
        customDecree: customDecreeText
      };
      onSaveAnamnesis(newAnamnesis);
      if (audioEngine.getCurrentSynthType() === '639hz') {
        audioEngine.stopBG();
        if (userProfile.audioEnabled && userProfile.bgMusicType && userProfile.bgMusicType !== 'none' && userProfile.bgMusicType !== '639hz') {
          audioEngine.startBG(userProfile.bgMusicType);
        }
      }
      setIsEditing(false);
    } finally {
      setIsProcessingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto" id="anamnesis-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden my-6"
      >
        {/* Glow effects */}
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition cursor-pointer z-10 print:hidden"
        >
          <X size={16} />
        </button>

        {!isEditing && existingAnamnesis ? (
          /* ========================================================================= */
          /*                       COMPLETED ANAMNESIS VIEW / REPORT                   */
          /* ========================================================================= */
          <div className="space-y-6">
            {daysSinceLastAnamnesis >= 7 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <h4 className="text-sm font-semibold text-amber-200">
                    Ciclo de 7 Dias Concluído
                  </h4>
                  <p className="text-xs text-amber-100/70 leading-relaxed">
                    Já se passaram {daysSinceLastAnamnesis} dias desde sua última análise. Suas necessidades energéticas podem ter mudado! Recomendamos preencher uma nova anamnese para atualizar seu protocolo de Aromaterapia e Floral.
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-lg transition-colors cursor-pointer border-none"
                  >
                    Refazer Anamnese
                  </button>
                </div>
              </div>
            )}

            {/* 1. TOP GREETING BANNER - FIRST THING THE PATIENT SEES */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/90 via-purple-950/70 to-slate-900 border-2 border-indigo-500/50 shadow-2xl relative overflow-hidden text-left" id="anamnesis-top-greeting">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Sparkles size={16} className="animate-pulse" />
                </div>
                <span className="text-[11px] font-mono tracking-widest text-indigo-300 uppercase font-bold">
                  Diagnóstico Vibracional & Ficha Terapêutica
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-semibold text-slate-100 leading-tight">
                Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-amber-200">{userProfile.fullName || userProfile.name}</span>!
              </h1>
              <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                Seu diagnóstico energético foi acolhido na egrégora. Ouça abaixo o áudio com as orientações do seu campo vibracional e a justificativa terapêutica personalizada.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-mono">
                  <CheckCircle2 size={13} />
                  <span>Status: Purificado na Chama Violeta</span>
                </span>
                <span>•</span>
                <span>Preenchido em {new Date(existingAnamnesis.filledAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            {/* 2. REALISTIC AUDIO PLAYER & FEEDBACK CARD */}
            <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-purple-950/40 border-2 border-indigo-500/60 shadow-2xl space-y-5" id="anamnesis-audio-player-card">
              {/* Header + Voice Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shadow-inner">
                    <Volume2 size={20} className={isPlayingTherapeuticVoice ? "animate-pulse text-indigo-400" : ""} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                      <span>Acolhimento Terapêutico em Áudio</span>
                      <span className="text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full">
                        Voz Realista IA
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Ouça as revelações e orientações do seu campo vibracional
                    </p>
                  </div>
                </div>

                {/* Voice Gender Switcher */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (isPlayingTherapeuticVoice) stopTherapeuticVoice();
                      setSelectedVoiceGender('masculina');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                      selectedVoiceGender === 'masculina'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>👨</span>
                    <span>Voz de Éverton</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (isPlayingTherapeuticVoice) stopTherapeuticVoice();
                      setSelectedVoiceGender('feminina');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                      selectedVoiceGender === 'feminina'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>👩</span>
                    <span>Voz Suave</span>
                  </button>
                </div>
              </div>

              {/* Player Controls & Waveform */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        const textToSpeak = existingAnamnesis.aiAnalysis?.justificativa_terapeutica || existingAnamnesis.prescribedFocus || "Identificamos uma sobrecarga com necessidade de acolhimento e paz profunda.";
                        const fullGreetingSpeech = `Olá ${userProfile.fullName || userProfile.name}. Seja muito bem-vindo ao seu diagnóstico personalizado. ${textToSpeak} ${existingAnamnesis.customDecree ? `Seu decreto sagrado é: ${existingAnamnesis.customDecree}` : ''}`;
                        playTherapeuticVoice(fullGreetingSpeech);
                      }}
                      disabled={isLoadingVoice}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-lg cursor-pointer shrink-0 ${
                        isPlayingTherapeuticVoice
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                      }`}
                      id="btn-play-diagnosis-audio"
                    >
                      {isLoadingVoice ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : isPlayingTherapeuticVoice ? (
                        <Square size={18} className="fill-current" />
                      ) : (
                        <Play size={20} className="fill-current ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200">
                          {isLoadingVoice
                            ? "Sintetizando áudio em alta definição..."
                            : isPlayingTherapeuticVoice
                            ? "Reproduzindo Acolhimento..."
                            : "Ouvir Diagnóstico Personalizado"}
                        </span>
                        <span className="text-[11px] font-mono text-indigo-300">
                          {selectedVoiceGender === 'masculina' ? 'Voz Masculina (Éverton Piceni)' : 'Voz Feminina (Acolhimento da Alma)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        "{existingAnamnesis.aiAnalysis?.justificativa_terapeutica || existingAnamnesis.prescribedFocus}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Animated Waveform Bars */}
                <div className="flex items-center gap-1.5 h-7 pt-1 px-1">
                  {Array.from({ length: 32 }).map((_, idx) => {
                    const height = isPlayingTherapeuticVoice
                      ? Math.max(25, Math.abs(Math.sin((idx * 0.45) + (Date.now() / 300))) * 95)
                      : (idx % 3 === 0 ? 30 : idx % 2 === 0 ? 45 : 20);
                    return (
                      <div
                        key={idx}
                        className={`flex-1 rounded-full transition-all duration-150 ${
                          isPlayingTherapeuticVoice
                            ? 'bg-gradient-to-t from-indigo-500 to-purple-400'
                            : 'bg-slate-800'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Diagnostic Text Excerpt */}
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold">
                    Justificativa Terapêutica & Acolhimento
                  </span>
                  {existingAnamnesis.aiAnalysis?.padrao_emocional_detectado && (
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                      Padrão: {existingAnamnesis.aiAnalysis.padrao_emocional_detectado}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {existingAnamnesis.aiAnalysis?.justificativa_terapeutica || existingAnamnesis.prescribedFocus}
                </p>
              </div>

              {/* Feedback Form / Area */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3" id="anamnesis-feedback-area">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-indigo-400" />
                    <span>Como você se sente ao ouvir este acolhimento?</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Feedback do Consulente</span>
                </div>

                {/* Quick Reaction Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'coracao', label: 'Tocou meu coração', emoji: '❤️' },
                    { id: 'paz', label: 'Senti profunda paz', emoji: '💜' },
                    { id: 'assertivo', label: 'Muito assertivo', emoji: '✨' },
                    { id: 'revigorado', label: 'Revigorado(a)', emoji: '🌿' }
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setFeedbackReaction(r.id)}
                      className={`p-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        feedbackReaction === r.id
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                      }`}
                    >
                      <span>{r.emoji}</span>
                      <span className="truncate">{r.label}</span>
                    </button>
                  ))}
                </div>

                {/* Optional comment + submit */}
                <div className="space-y-2 pt-1">
                  <textarea
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Compartilhe suas sensações sobre o diagnóstico (opcional)..."
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none placeholder-slate-500"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {feedbackSubmitted ? "✓ Gratidão! Seu relato foi acolhido e salvo com sucesso." : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFeedbackSubmitted(true);
                        setTimeout(() => setFeedbackSubmitted(false), 4000);
                      }}
                      disabled={!feedbackReaction && !feedbackComment.trim()}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border-none ${
                        feedbackReaction || feedbackComment.trim()
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Send size={12} />
                      <span>Enviar Feedback</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {recommendation && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-indigo-950/40 border-2 border-amber-500/40 space-y-4 shadow-2xl relative overflow-hidden" id="anamnesis-recommended-treatment">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Award size={20} className="animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                          Indicação Terapêutica Personalizada
                        </span>
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                          recommendation.severityLevel === 'urgente'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : recommendation.severityLevel === 'alto'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          Nível {recommendation.severityLevel}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-slate-100 mt-0.5">
                        {recommendation.treatmentTitle}
                      </h3>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-xl shrink-0">
                    {recommendation.frequencyLabel}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Por que este é o tratamento ideal para você:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                    {recommendation.therapeuticRationale}
                  </p>
                </div>

                {/* Key Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
                      <Sparkles size={11} className="text-amber-400" />
                      <span>Chakra Foco Primário</span>
                    </span>
                    <p className="text-xs text-slate-200 font-medium">{recommendation.primaryChakraFocus}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold flex items-center gap-1">
                      <Activity size={11} className="text-indigo-400" />
                      <span>Plano Sugerido</span>
                    </span>
                    <p className="text-xs text-slate-200 font-medium">
                      {recommendation.planName} • <strong className="text-emerald-400">{recommendation.planPriceFormatted}</strong>
                    </p>
                  </div>
                </div>

                {/* Prescribed Reiki Modalities */}
                {recommendation.prescribedReikis && recommendation.prescribedReikis.length > 0 && (
                  <div className="space-y-3 bg-gradient-to-br from-indigo-950/50 via-purple-950/30 to-slate-950 p-4 rounded-2xl border border-indigo-500/30 shadow-lg">
                    <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          <Sparkles size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                            Diagnóstico Bioenergético
                          </span>
                          <h5 className="text-xs sm:text-sm font-display font-medium text-slate-100">
                            Melhor Sistema de Reiki Indicado para seu Tratamento
                          </h5>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                        Recomendação Principal
                      </span>
                    </div>

                    {/* Destaque do Reiki Principal */}
                    {recommendation.prescribedReikis[0] && (
                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                            <Crown size={13} className="text-amber-400" />
                            <span>{recommendation.prescribedReikis[0].name}</span>
                          </span>
                          <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                            {recommendation.prescribedReikis[0].badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium">
                          <strong>Foco de Atuação:</strong> {recommendation.prescribedReikis[0].focus}
                        </p>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {recommendation.prescribedReikis[0].description}
                        </p>
                        <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-[10px] text-indigo-300/90 flex items-center gap-1.5">
                          <Heart size={12} className="text-rose-400 shrink-0" />
                          <span><strong>Como receber:</strong> Mãos abertas sobre o chakra {recommendation.primaryChakraFocus}, respirando profundamente durante a meditação.</span>
                        </div>
                      </div>
                    )}

                    {/* Outros Sistemas de Suporte */}
                    {recommendation.prescribedReikis.length > 1 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                          Sistemas Complementares Ativados no Protocolo:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {recommendation.prescribedReikis.slice(1).map((rk, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] space-y-1">
                              <div className="flex items-center justify-between gap-1">
                                <strong className="text-slate-200 font-semibold text-xs">{rk.name}</strong>
                                <span className="text-[9px] font-mono text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-1.5 py-0.2 rounded font-semibold shrink-0">
                                  {rk.badge}
                                </span>
                              </div>
                              <p className="text-slate-400 text-[10px] leading-relaxed">
                                {rk.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Practical Complementary Suggestions */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Práticas Integrativas Complementares Recomendadas:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {userProfile.plan === 'pro' ? (
                      <>
                        {recommendation.recommendedFloral && (
                          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 text-[11px] space-y-0.5">
                            <div className="flex items-center justify-between">
                              <strong className="text-slate-200 text-emerald-400">Floral Recomendado</strong>
                              <span className="text-[9px] font-mono text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                Terapia Floral
                              </span>
                            </div>
                            <p className="text-slate-300 font-medium text-[10px] leading-tight mt-1">{recommendation.recommendedFloral}</p>
                          </div>
                        )}
                        {recommendation.recommendedAromatherapy && (
                          <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 text-[11px] space-y-0.5">
                            <div className="flex items-center justify-between">
                              <strong className="text-slate-200 text-purple-400">Aromaterapia (Óleo Essencial)</strong>
                              <span className="text-[9px] font-mono text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded">
                                Óleos Essenciais
                              </span>
                            </div>
                            <p className="text-slate-300 font-medium text-[10px] leading-tight mt-1">{recommendation.recommendedAromatherapy}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="col-span-1 sm:col-span-2 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-[11px] flex gap-2">
                        <Award size={18} className="text-indigo-400 mt-0.5 shrink-0" />
                        <p className="text-slate-300 leading-relaxed">
                          <strong className="text-slate-100 block mb-1">Receita Holística Premium Bloqueada</strong>
                          Para liberar a sua receita personalizada de Florais e Aromaterapia que vai atuar diretamente na raiz desse sintoma, além de destravar os 21 dias do protocolo com todas as frequências do Karuna Ki e Imara Reiki, faça o upgrade para a jornada completa na tela inicial.
                        </p>
                      </div>
                    )}
                    {recommendation.complementaryPractices.slice(0, 2).map((prac, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 text-[11px] space-y-0.5">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-200">{prac.title}</strong>
                          <span className="text-[9px] font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                            {prac.badge}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[10px] leading-tight">{prac.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-slate-800/80">
                  {onOpenSpecificTreatment && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSpecificTreatment(recommendation.category);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-amber-500/20"
                    >
                      <Sparkles size={14} />
                      <span>Iniciar Tratamento Sugerido (21 Dias)</span>
                    </button>
                  )}

                  {onOpenContact ? (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenContact();
                      }}
                      className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-emerald-600/20 cursor-pointer text-center"
                    >
                      <MessageSquare size={14} />
                      <span>Fale Conosco</span>
                    </button>
                  ) : (
                    <a
                      href={recommendation.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-emerald-600/20 text-center"
                    >
                      <MessageSquare size={14} />
                      <span>Fale Conosco</span>
                    </a>
                  )}

                  {onApplyFrequency && (
                    <button
                      type="button"
                      onClick={() => {
                        onApplyFrequency(recommendation.recommendedFrequency);
                        alert(`Frequência do app definida para ${recommendation.recommendedFrequency.toUpperCase()}!`);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-700"
                      title="Sintonizar o áudio de fundo do app nesta frequência recomendada"
                    >
                      <Volume2 size={14} className="text-indigo-400" />
                      <span>Sintonizar {recommendation.recommendedFrequency.toUpperCase()}</span>
                    </button>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <p className="text-[9px] text-slate-500 leading-relaxed text-justify italic">
                    <strong>Nota Terapêutica:</strong> O Protocolo de Cura Integrada e as sugestões de Florais de Bach e Óleos Essenciais atuam como práticas integrativas e tratamentos complementares. Eles não substituem, sob nenhuma hipótese, o diagnóstico, tratamento ou acompanhamento médico, psiquiátrico ou psicológico tradicional. Mantenha seus tratamentos de saúde ativos.
                  </p>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 print:hidden">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setCurrentStep(1);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              >
                <Edit3 size={14} />
                <span>Atualizar / Refazer Ficha</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Imprimir Ficha</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  <Check size={14} />
                  <span>Concluir</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /*                          STEP-BY-STEP QUESTIONNAIRE                       */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-medium">
                  <Activity size={14} className="text-indigo-400" />
                  <span>ANAMNESE TERAPÊUTICA INTEGRADA</span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Etapa {currentStep} de 4
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-display font-medium text-slate-100">
                {currentStep === 1 && '1. Suas Queixas e Sintomas Principais'}
                {currentStep === 2 && '2. Mapeamento Emocional e Corporal'}
                {currentStep === 3 && '3. Centros de Força & Chakras a Equilibrar'}
                {currentStep === 4 && '4. Sua Meta Sagrada para os 21 Dias'}
              </h2>
              <p className="text-xs text-slate-400">
                {currentStep === 1 && 'Selecione tudo o que você tem vivenciado nos últimos dias.'}
                {currentStep === 2 && 'Avalie o seu nível de estresse, padrão de sono e sensações corporais.'}
                {currentStep === 3 && 'Escolha as áreas vitais que você sente que mais necessitam de alinhamento.'}
                {currentStep === 4 && 'Defina a sua intenção principal para ajustarmos os decretos e frequências.'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>

            {/* 639 Hz Frequency Banner: Melhora a compreensão, tolerância e relações interpessoais */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
                  <Heart size={16} className={is639HzActive ? 'scale-110 text-emerald-400 animate-pulse' : 'opacity-60'} />
                  {is639HzActive && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-300">Frequência Solfeggio 639 Hz Ativa</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono">Chakra Cardíaco</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    639 Hz: Melhora a compreensão, tolerância e relações interpessoais enquanto você responde a esta anamnese.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggle639Hz}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border shrink-0 self-end sm:self-center ${
                  is639HzActive
                    ? 'bg-emerald-600/30 border-emerald-500/50 text-emerald-200 hover:bg-emerald-600/50'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {is639HzActive ? <Volume2 size={13} className="text-emerald-400 animate-pulse" /> : <VolumeX size={13} />}
                <span>{is639HzActive ? '639 Hz Ativo' : 'Ativar 639 Hz'}</span>
              </button>
            </div>

            {/* STEP 1: Main Complaints */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {COMPLAINTS_OPTIONS.map((item) => {
                    const isSelected = mainComplaints.includes(item.id);
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleItem(mainComplaints, setMainComplaints, item.id)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-500/10'
                            : 'bg-slate-950/50 border-slate-850 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-900 text-slate-500'}`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-xs font-medium flex-1">{item.label}</span>
                        {isSelected && <Check size={14} className="text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Quer detalhar mais o que você está sentindo? (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={complaintNotes}
                    onChange={(e) => setComplaintNotes(e.target.value)}
                    placeholder="Descreva em poucas palavras o que mais tem pesado no seu coração ou na sua rotina..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Emotional & Physical Mapping */}
            {currentStep === 2 && (
              <div className="space-y-5">
                {/* Stress Slider */}
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400 uppercase text-[10px]">
                      Nível de Estresse / Tensão Atual
                    </span>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {stressLevel} de 10 {stressLevel >= 8 ? '(Elevado)' : stressLevel >= 5 ? '(Moderado)' : '(Leve)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={stressLevel}
                    onChange={(e) => {
                      audioEngine.unlock();
                      audioEngine.playHeartSelectionChime();
                      if (is639HzActive && audioEngine.getCurrentSynthType() !== '639hz') {
                        audioEngine.startBG('639hz');
                      }
                      setStressLevel(parseInt(e.target.value));
                    }}
                    className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>1 • Tranquilo(a)</span>
                    <span>5 • Moderado</span>
                    <span>10 • Limite / Esgotado</span>
                  </div>
                </div>

                {/* Sleep Quality */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">Qualidade do seu Sono</label>
                  <div className="grid grid-cols-5 gap-2">
                    {(['pessimo', 'ruim', 'regular', 'bom', 'excelente'] as const).map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => {
                          audioEngine.unlock();
                          audioEngine.playHeartSelectionChime();
                          if (is639HzActive && audioEngine.getCurrentSynthType() !== '639hz') {
                            audioEngine.startBG('639hz');
                          }
                          setSleepQuality(q);
                        }}
                        className={`py-2 px-1 rounded-xl text-xs font-medium capitalize border text-center transition cursor-pointer ${
                          sleepQuality === q
                            ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Physical Sensations */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Sensações Corporais Recorrentes (Marque as que sentir)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PHYSICAL_SYMPTOMS.map((sym) => {
                      const isSel = physicalSymptoms.includes(sym);
                      return (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => toggleItem(physicalSymptoms, setPhysicalSymptoms, sym)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${
                            isSel
                              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                              : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span>{sym}</span>
                          {isSel && <Check size={12} className="text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Chakras & Energetic Centers */}
            {currentStep === 3 && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Marque os centros de força que você intui que precisam de desbloqueio ou equilíbrio:
                </p>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {CHAKRAS_LIST.map((chakra) => {
                    const isSel = chakraImbalance.includes(chakra.id);
                    return (
                      <div
                        key={chakra.id}
                        onClick={() => toggleItem(chakraImbalance, setChakraImbalance, chakra.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                          isSel
                            ? `${chakra.color} shadow-sm`
                            : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSel ? 'border-current bg-current/20' : 'border-slate-700'
                        }`}>
                          {isSel && <Check size={12} className="text-current" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-semibold text-slate-200">{chakra.name}</h4>
                          <p className="text-[11px] opacity-80 leading-tight mt-0.5">{chakra.theme}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: Goals & Time Commitment */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Qual o seu Maior Objetivo com este Protocolo de 21 Dias?
                  </label>
                  <div className="space-y-2">
                    {[
                      'Paz interior e alívio profundo da ansiedade',
                      'Cura de feridas emocionais e liberação de mágoas',
                      'Blindagem energética e proteção contra negatividade',
                      'Destravamento de prosperidade e clareza mental',
                      'Recuperação de vitalidade física e bom sono',
                      'Reconexão espiritual e expansão da consciência'
                    ].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          audioEngine.unlock();
                          audioEngine.playHeartSelectionChime();
                          if (is639HzActive && audioEngine.getCurrentSynthType() !== '639hz') {
                            audioEngine.startBG('639hz');
                          }
                          setPrimaryGoal(g);
                        }}
                        className={`w-full p-3 rounded-2xl border text-left text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                          primaryGoal === g
                            ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                            : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span>{g}</span>
                        {primaryGoal === g && <Check size={14} className="text-indigo-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">
                    Tempo Diário que você pretende dedicar:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '10min', label: '10 Minutos', desc: 'Sessão Expressa' },
                      { id: '20min', label: '20 Minutos', desc: 'Tempo Ideal' },
                      { id: '30min+', label: '30+ Minutos', desc: 'Imersão Completa' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          audioEngine.unlock();
                          audioEngine.playHeartSelectionChime();
                          if (is639HzActive && audioEngine.getCurrentSynthType() !== '639hz') {
                            audioEngine.startBG('639hz');
                          }
                          setDailyTimeAvailable(t.id as any);
                        }}
                        className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                          dailyTimeAvailable === t.id
                            ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <strong className="text-xs block text-slate-200">{t.label}</strong>
                        <span className="text-[10px] text-slate-500">{t.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Voltar</span>
                </button>
              ) : <div />}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  <span>Avançar</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isProcessingAi}
                  onClick={handleFinish}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  {isProcessingAi ? (
                    <>
                      <Loader2 size={15} className="animate-spin text-emerald-300" />
                      <span>Sintonizando IA Quântica...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      <span>Gerar Diagnóstico & Concluir Ficha</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
