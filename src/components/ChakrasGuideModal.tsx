/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Heart, Activity, Flame, Shield, Sun, Eye, Crown, ChevronRight, CheckCircle2, MessageCircle } from 'lucide-react';

interface ChakrasGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProModal?: () => void;
}

interface ChakraInfo {
  id: string;
  number: number;
  sanskritName: string;
  name: string;
  colorName: string;
  colorClass: string;
  borderClass: string;
  bgGradient: string;
  badgeBg: string;
  location: string;
  element: string;
  bijaMantra: string;
  solfeggioFreq: string;
  icon: any;
  symbolizes: string;
  inBalance: string;
  whenBlocked: string;
  protocolAction: string;
  affirmation: string;
}

export const CHAKRAS_DATA: ChakraInfo[] = [
  {
    id: 'muladhara',
    number: 1,
    sanskritName: 'Muladhara',
    name: 'Chakra Básico (Raiz)',
    colorName: 'Vermelho Rubi',
    colorClass: 'text-rose-400',
    borderClass: 'border-rose-500/40',
    bgGradient: 'from-rose-950/40 via-slate-900 to-slate-950',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    location: 'Base da coluna vertebral e períneo',
    element: 'Terra 🌍',
    bijaMantra: 'LAM',
    solfeggioFreq: '432Hz / 396Hz',
    icon: Shield,
    symbolizes: 'Sobrevivência física, estabilidade financeira, segurança existencial, senso de pertencimento e enraizamento na matéria.',
    inBalance: 'Sensação de profunda segurança, coragem inabalável, vitalidade física, pés no chão e confiança no suprimento da vida.',
    whenBlocked: 'Medos irracionais, crises de ansiedade, insegurança financeira constante, cansaço extremo crônico e dores nas pernas/lombar.',
    protocolAction: 'Fase de Aterramento e Raízes Sagradas: desce raízes de luz da coluna ao núcleo da Terra, limpando memórias de escassez.',
    affirmation: 'Eu estou seguro, protegido e perfeitamente ancorado na abundância da Terra.'
  },
  {
    id: 'svadhisthana',
    number: 2,
    sanskritName: 'Svadhisthana',
    name: 'Chakra Sacral (Sexual & Criativo)',
    colorName: 'Laranja Solar',
    colorClass: 'text-amber-400',
    borderClass: 'border-amber-500/40',
    bgGradient: 'from-amber-950/40 via-slate-900 to-slate-950',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    location: 'Baixo ventre (quatro dedos abaixo do umbigo)',
    element: 'Água 💧',
    bijaMantra: 'VAM',
    solfeggioFreq: '417Hz (Transmutação)',
    icon: Flame,
    symbolizes: 'Criatividade, prazer sagrado, sexualidade equilibrada, emoções fluidas, entusiasmo e capacidade de desapego.',
    inBalance: 'Fluidez emocional, alegria de viver, relacionamentos harmoniosos, imaginação fértil e expressão artística sem culpas.',
    whenBlocked: 'Sentimentos de culpa, repressão ou excessos sexuais, bloqueios criativos, dependência emocional e problemas nos rins/bexiga.',
    protocolAction: 'Purificação das Águas & Vitalidade: liberação de apegos e traumas do passado através do sopro sutil de ervas sagradas.',
    affirmation: 'Eu permito que a vida flua através de mim com prazer, criatividade e doçura.'
  },
  {
    id: 'manipura',
    number: 3,
    sanskritName: 'Manipura',
    name: 'Chakra do Plexo Solar',
    colorName: 'Amarelo Dourado',
    colorClass: 'text-yellow-400',
    borderClass: 'border-yellow-500/40',
    bgGradient: 'from-yellow-950/30 via-slate-900 to-slate-950',
    badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    location: 'Região do estômago / boca do estômago',
    element: 'Fogo 🔥',
    bijaMantra: 'RAM',
    solfeggioFreq: '528Hz (Transformação & DNA)',
    icon: Sun,
    symbolizes: 'Poder pessoal, autoconfiança, determinação, foco mental, capacidade de realização e digestão das experiências.',
    inBalance: 'Forte determinação, liderança compassiva, boa digestão física e emocional, limites saudáveis e autoestima elevada.',
    whenBlocked: 'Sensação de fraqueza, complexo de inferioridade, raiva reprimida, perfeccionismo doentio, azia e gastrite nervosa.',
    protocolAction: 'Fogo da Transmutação & Calor Vital: acende a chama interior que queima a apatia e restabelece o comando da própria vida.',
    affirmation: 'Eu sou forte, capaz e honro o meu poder pessoal com sabedoria e dignidade.'
  },
  {
    id: 'anahata',
    number: 4,
    sanskritName: 'Anahata',
    name: 'Chakra Cardíaco',
    colorName: 'Verde Esmeralda & Rosa Quartzo',
    colorClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/40',
    bgGradient: 'from-emerald-950/40 via-slate-900 to-slate-950',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    location: 'Centro do peito / coração espiritual',
    element: 'Ar 🍃',
    bijaMantra: 'YAM',
    solfeggioFreq: '639Hz (Amor & Conexão)',
    icon: Heart,
    symbolizes: 'Amor incondicional, compaixão, capacidade de perdoar, cura de dores afetivas e ponte entre os chakras físicos e espirituais.',
    inBalance: 'Amor próprio profundo, empatia, facilidade para perdoar e reconciliar, generosidade e paz interior radiante.',
    whenBlocked: 'Mágoas crônicas, rancor, fechamento para o amor, medo de abandono ou rejeição, dores no peito e problemas respiratórios.',
    protocolAction: 'O Bálsamo do Amor & Névoa Verde-Oliva: expansão da luz rosa-quartzo que preenche os vazios e regenera o campo afetivo.',
    affirmation: 'Eu sou puro amor. Eu me perdoo, eu me acolho e abro meu coração para a vida.'
  },
  {
    id: 'vishuddha',
    number: 5,
    sanskritName: 'Vishuddha',
    name: 'Chakra Laríngeo',
    colorName: 'Azul Turquesa & Celeste',
    colorClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/40',
    bgGradient: 'from-cyan-950/40 via-slate-900 to-slate-950',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    location: 'Garganta e cordas vocais',
    element: 'Éter / Espaço 🌌',
    bijaMantra: 'HAM',
    solfeggioFreq: '741Hz (Expressão & Limpeza Celular)',
    icon: Activity,
    symbolizes: 'Comunicação autêntica, poder da palavra falada, expressão da verdade interior e verbalização de limites saudáveis.',
    inBalance: 'Voz firme e serena, clareza ao expressar sentimentos, capacidade de escutar o outro e canalizar decretos poderosos.',
    whenBlocked: 'Engolir sapos, nó na garganta, timidez excessiva, mentiras, fofocas ou problemas na tireoide e cordas vocais.',
    protocolAction: 'Decreto de Aceitação & Mantras Ho\'oponopono: liberação do canal vocal para declarar sua cura e verdade divina.',
    affirmation: 'Minha voz é um instrumento sagrado de cura, verdade e amor.'
  },
  {
    id: 'ajna',
    number: 6,
    sanskritName: 'Ajna',
    name: 'Chakra Frontal (Terceiro Olho)',
    colorName: 'Azul Índigo & Safira',
    colorClass: 'text-indigo-400',
    borderClass: 'border-indigo-500/40',
    bgGradient: 'from-indigo-950/40 via-slate-900 to-slate-950',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    location: 'Entre as sobrancelhas (glândula pineal e hipófise)',
    element: 'Luz Pura 👁️',
    bijaMantra: 'OM',
    solfeggioFreq: '852Hz (Despertar da Intuição)',
    icon: Eye,
    symbolizes: 'Intuição aguçada, discernimento espiritual, clareza mental, sabedoria interior e visão além das ilusões materiais.',
    inBalance: 'Forte intuição, sonhos lúcidos e inspiradores, mente focada e pacífica, facilidade para encontrar soluções sábias.',
    whenBlocked: 'Confusão mental, excesso de pensamentos, dores de cabeça constantes, ceticismo extremo ou ilusões espirituais.',
    protocolAction: 'Armadura Safira & Alinhamento Cerebral: pontos de luz dourada e azul organizam os impulsos neurais e silenciam o caos.',
    affirmation: 'Eu enxergo a verdade com clareza e confio plenamente na minha intuição.'
  },
  {
    id: 'sahasrara',
    number: 7,
    sanskritName: 'Sahasrara',
    name: 'Chakra Coronário',
    colorName: 'Violeta & Dourado Cósmico',
    colorClass: 'text-purple-400',
    borderClass: 'border-purple-500/40',
    bgGradient: 'from-purple-950/40 via-slate-900 to-slate-950',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    location: 'Topo da cabeça (coroa)',
    element: 'Consciência Pura ✨',
    bijaMantra: 'AUM / Silêncio',
    solfeggioFreq: '963Hz (Glândula Pineal & Conexão Divina)',
    icon: Crown,
    symbolizes: 'Conexão direta com a Fonte Criadora, unidade cósmica, iluminação, transcendência e soberania espiritual.',
    inBalance: 'Sensação de comunhão com o Todo, paz incondicional, propósito de vida claro e alinhamento com a Providência Divina.',
    whenBlocked: 'Sensação de vazio existencial, abandono divino, ceticismo fechado ou desconexão da realidade física.',
    protocolAction: 'Cascata de Luz Ouro & Trono Cósmico: banho de luz líquida dourada que sela o DNA original e conclui o protocolo.',
    affirmation: 'Eu sou um com a Fonte Criadora. Eu sou luz, eu sou paz, eu sou cura.'
  }
];

export function ChakrasGuideModal({ isOpen, onClose }: ChakrasGuideModalProps) {
  const [selectedChakraId, setSelectedChakraId] = useState<string>('muladhara');

  if (!isOpen) return null;

  const currentChakra = CHAKRAS_DATA.find((c) => c.id === selectedChakraId) || CHAKRAS_DATA[0];
  const Icon = currentChakra.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto" id="chakras-guide-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden my-6"
      >
        {/* Ambient background glows */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition cursor-pointer z-10"
        >
          <X size={16} />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-medium">
              <Sparkles size={13} className="text-indigo-400" />
              <span>GUIA ANATÔMICO & ENERGÉTICO</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-medium text-slate-100">
              O Significado Sagrado dos 7 Chakras
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto">
              Descubra o que cada centro de força simboliza no seu corpo, os sintomas de desequilíbrio e como o Protocolo de 21 Dias age restaurando cada frequência.
            </p>
          </div>

          {/* Quick Selectors Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {CHAKRAS_DATA.map((chakra) => {
              const isSelected = chakra.id === selectedChakraId;
              const CIcon = chakra.icon;
              return (
                <button
                  key={chakra.id}
                  onClick={() => setSelectedChakraId(chakra.id)}
                  className={`p-2.5 rounded-2xl border text-left flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                    isSelected
                      ? `${chakra.bgGradient} ${chakra.borderClass} ring-1 ring-white/20 shadow-lg scale-105`
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className={`p-1.5 rounded-xl ${isSelected ? chakra.badgeBg : 'bg-slate-900 text-slate-500'}`}>
                    <CIcon size={16} />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-center">
                    {chakra.number}º {chakra.sanskritName}
                  </span>
                  <span className="text-[9px] text-slate-500 text-center line-clamp-1 font-sans">
                    {chakra.colorName.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Chakra Card */}
          <div className={`p-6 rounded-3xl border bg-gradient-to-b ${currentChakra.bgGradient} ${currentChakra.borderClass} space-y-5 shadow-xl transition-all duration-300`}>
            {/* Top Bar of Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${currentChakra.badgeBg} shadow-md`}>
                  <Icon size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase font-bold tracking-widest text-slate-300">
                      {currentChakra.number}º CENTRO ENERGÉTICO
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${currentChakra.badgeBg}`}>
                      {currentChakra.colorName}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-100 mt-0.5">
                    {currentChakra.name} ({currentChakra.sanskritName})
                  </h3>
                </div>
              </div>

              {/* Solfeggio frequency & Mantra */}
              <div className="flex items-center gap-2 sm:self-center">
                <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-white/10 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Som Sagrado</span>
                  <strong className="text-xs font-mono text-amber-300">{currentChakra.bijaMantra}</strong>
                </div>
                <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-white/10 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Ressonância</span>
                  <strong className="text-xs font-mono text-emerald-300">{currentChakra.solfeggioFreq}</strong>
                </div>
              </div>
            </div>

            {/* Content Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* O que simboliza */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                  <Sparkles size={12} className={currentChakra.colorClass} />
                  <span>O que este Chakra Simboliza:</span>
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {currentChakra.symbolizes}
                </p>
                <div className="pt-2 text-[10px] text-slate-400 font-mono">
                  📍 <strong>Localização:</strong> {currentChakra.location} • 🍃 <strong>Elemento:</strong> {currentChakra.element}
                </div>
              </div>

              {/* Em Equilíbrio */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/20 space-y-1.5">
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 size={12} />
                  <span>Sinais de Equilíbrio & Alinhamento:</span>
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {currentChakra.inBalance}
                </p>
              </div>

              {/* Quando Bloqueado */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-rose-500/20 space-y-1.5">
                <span className="text-[11px] font-mono text-rose-400 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                  <Activity size={12} />
                  <span>Sintomas de Bloqueio ou Desalinhamento:</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {currentChakra.whenBlocked}
                </p>
              </div>

              {/* Atuação no Protocolo de 21 Dias */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-1.5">
                <span className="text-[11px] font-mono text-indigo-300 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                  <Crown size={12} />
                  <span>Atuação no Protocolo de 21 Dias:</span>
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {currentChakra.protocolAction}
                </p>
              </div>
            </div>

            {/* Decree / Affirmation Box */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-400/30 space-y-1 text-center">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-bold">
                Decreto Sagrado de Alinhamento Instantâneo:
              </span>
              <p className="text-sm font-serif italic text-amber-200 font-medium">
                "{currentChakra.affirmation}"
              </p>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              Cada dia dos 21 dias trabalha harmonizando a totalidade dos seus 7 centros de força.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              Fechar Guia dos Chakras
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ChakrasGuideModal;
