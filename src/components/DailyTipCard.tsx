/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Droplets, Sparkles, CheckCircle2, Heart, Sun, Coffee, Footprints,
  Moon, Wind, Dumbbell, ShieldCheck, Flame, RefreshCw, Smile, ArrowRight,
  Leaf, AlertTriangle, BookOpen
} from 'lucide-react';

export interface DailyHealthTip {
  id: string;
  title: string;
  category: 'Hidratação & Vitalidade' | 'Aterramento & Corpo' | 'Calma Mental & Sono' | 'Energia Sutil & Banhos';
  icon: 'droplets' | 'footprints' | 'sun' | 'wind' | 'dumbbell' | 'coffee' | 'moon' | 'flame' | 'leaf';
  description: string;
  benefit: string;
  practicalAction: string;
  affirmation: string;
  bathRule?: string;
}

const HEALTH_TIPS: DailyHealthTip[] = [
  {
    id: 'agua-solarizada',
    title: 'Hidratação com Intenção Solar',
    category: 'Hidratação & Vitalidade',
    icon: 'droplets',
    description: 'Após a prática, faça uma pausa e beba água com calma, usando esse momento como um gesto simples de presença e cuidado consigo.',
    benefit: 'Ajuda a lembrar de hidratar o corpo e a encerrar a prática com atenção ao presente.',
    practicalAction: 'Beba 2 copos de água fresca agora, respirando devagar.',
    affirmation: 'Eu recebo este momento de cuidado com presença e gratidão.'
  },
  {
    id: 'banho-boldo-coronario',
    title: 'Banho de Boldo (Paz Mental & Coronário)',
    category: 'Energia Sutil & Banhos',
    icon: 'leaf',
    description: 'Em algumas tradições espirituais brasileiras, o boldo é usado simbolicamente em banhos de limpeza e serenidade. Respeite a tradição que você segue e evite usar qualquer erva se houver irritação ou sensibilidade.',
    benefit: 'Pode compor um ritual pessoal de pausa, silêncio e reconexão espiritual.',
    practicalAction: 'Macere 7 a 9 folhas de boldo em 1,5L de água morna. Despeje da cabeça aos pés após o banho higiênico.',
    affirmation: 'Minha mente está em profunda paz. Minha coroa se conecta à luz pura e divina.',
    bathRule: 'Uso tradicional: confirme a forma de aplicação dentro da sua prática.'
  },
  {
    id: 'aterramento-descalco',
    title: 'Aterramento (Earthing) de 5 Minutos',
    category: 'Aterramento & Corpo',
    icon: 'footprints',
    description: 'Se for confortável e seguro para você, caminhe alguns minutos descalço em uma superfície natural e observe as sensações dos pés e da respiração.',
    benefit: 'Pode funcionar como uma pausa de atenção ao corpo e ao ambiente ao redor.',
    practicalAction: 'Retire os sapatos e sinta a firmeza do solo por alguns minutos.',
    affirmation: 'Estou seguro(a), enraizado(a) e protegido(a) na Mãe Terra.'
  },
  {
    id: 'banho-alecrim-solar',
    title: 'Banho de Alecrim (Alegria & Prosperidade)',
    category: 'Energia Sutil & Banhos',
    icon: 'flame',
    description: 'O alecrim aparece em diferentes tradições como erva associada a vitalidade e renovação. Use o banho como um ritual simbólico de cuidado e respeite a forma de aplicação da tradição que você segue.',
    benefit: 'Pode acompanhar uma intenção pessoal de disposição, clareza e abertura para novos movimentos.',
    practicalAction: 'Faça infusão de 2 ramos de alecrim em água quente. Despeje do pescoço para baixo após o banho de higiene.',
    affirmation: 'Sou luz, força e vitalidade. Meus caminhos se abrem para a alegria.',
    bathRule: 'Uso tradicional: do pescoço para baixo.'
  },
  {
    id: 'respiracao-478',
    title: 'Pausa de Respiração 4-7-8',
    category: 'Calma Mental & Sono',
    icon: 'wind',
    description: 'Inspire pelo nariz em 4 segundos, retenha o ar por 7 segundos e solte lentamente pela boca em 8 segundos. Repita 4 ciclos durante o dia.',
    benefit: 'Pode ajudar a desacelerar o ritmo por alguns instantes e trazer atenção para a respiração.',
    practicalAction: 'Faça 3 ciclos da respiração 4-7-8 agora mesmo.',
    affirmation: 'Minha mente está em perfeita calma e serenidade.'
  },
  {
    id: 'banho-manjericao-amor',
    title: 'Banho de Manjericão (Harmonia & Paz)',
    category: 'Energia Sutil & Banhos',
    icon: 'leaf',
    description: 'O manjericão é associado, em algumas tradições, a harmonia e renovação. Você pode usá-lo simbolicamente em um ritual de cuidado e intenção.',
    benefit: 'Pode acompanhar uma intenção de gentileza, reconciliação e presença.',
    practicalAction: 'Macere folhas de manjericão fresco em água morna e despeje dos ombros para baixo.',
    affirmation: 'O amor divino flui em mim. Eu vivo em paz e perfeita harmonia.',
    bathRule: '⚠️ ESTRITAMENTE DO PESCOÇO PARA BAIXO.'
  },
  {
    id: 'banho-camomila-sono',
    title: 'Banho de Camomila & Melissa (Acalento)',
    category: 'Calma Mental & Sono',
    icon: 'coffee',
    description: 'Camomila e melissa podem compor um ritual noturno de desaceleração pelo aroma e pela associação com descanso.',
    benefit: 'Pode marcar uma transição mais tranquila entre o ritmo do dia e o momento de descanso.',
    practicalAction: 'Infusão morna de camomila jogada lentamente do pescoço para baixo à noite.',
    affirmation: 'Eu descanso seguro(a) no colo do Universo. Todo medo se dissolve em paz.',
    bathRule: '⚠️ ESTRITAMENTE DO PESCOÇO PARA BAIXO.'
  }
];

interface DailyTipCardProps {
  currentDay: number;
  userName?: string;
  isSessionCompletedToday?: boolean;
  isSessionCompleted?: boolean;
  onOpenMeditation?: () => void;
  onOpenHerbalBaths?: () => void;
}

export default function DailyTipCard({
  currentDay,
  userName,
  isSessionCompletedToday = false,
  isSessionCompleted = false,
  onOpenMeditation,
  onOpenHerbalBaths
}: DailyTipCardProps) {
  const sessionDone = isSessionCompletedToday || isSessionCompleted;
  // Deterministic daily tip index based on currentDay or date
  const tipIndex = (currentDay - 1) % HEALTH_TIPS.length;
  const todayTip = HEALTH_TIPS[tipIndex] || HEALTH_TIPS[0];

  const storageKey = `cura_integrada_tip_done_day_${currentDay}`;
  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(storageKey) === 'true';
    } catch {
      return false;
    }
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleToggleCompleted = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    try {
      if (nextState) {
        localStorage.setItem(storageKey, 'true');
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (e) {
      console.warn("Storage write error", e);
    }
  };

  const getIcon = (type: DailyHealthTip['icon']) => {
    switch (type) {
      case 'droplets':
        return <Droplets className="text-cyan-400" size={20} />;
      case 'footprints':
        return <Footprints className="text-emerald-400" size={20} />;
      case 'sun':
        return <Sun className="text-amber-400" size={20} />;
      case 'wind':
        return <Wind className="text-teal-400" size={20} />;
      case 'dumbbell':
        return <Dumbbell className="text-[#B88736]" size={20} />;
      case 'coffee':
        return <Coffee className="text-amber-300" size={20} />;
      case 'leaf':
        return <Leaf className="text-emerald-400" size={20} />;
      case 'flame':
        return <Flame className="text-amber-400" size={20} />;
      default:
        return <Sparkles className="text-amber-400" size={20} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-3xl border transition-all duration-300 p-5 md:p-6 relative overflow-hidden shadow-sm ${
        isCompleted
          ? 'bg-emerald-50/70 border-emerald-200 ring-1 ring-emerald-100'
          : 'bg-[#FBF8F2] border-[#E5DAC6]'
      }`}
      id="daily-health-tip-card"
    >
      {/* Background Subtle Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left icon & texts */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl border shrink-0 transition-colors ${
            isCompleted 
              ? 'bg-emerald-500/20 border-emerald-500/40' 
              : 'bg-[#B88736]/15 border-[#B88736]/30'
          }`}>
            {getIcon(todayTip.icon)}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#B88736]/20 text-[#B88736] border border-[#B88736]/30">
                Hábito de Sustentação • Dia {currentDay}
              </span>
              <span className="text-[11px] text-[#5C5248] font-medium">
                {todayTip.category}
              </span>
              {todayTip.bathRule && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  todayTip.id === 'banho-boldo-coronario'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-[#B88736]/20 text-[#B88736] border-[#B88736]/30'
                }`}>
                  {todayTip.bathRule}
                </span>
              )}
            </div>

            <h3 className="text-base md:text-lg font-bold text-[#2A2420] flex items-center gap-2">
              {todayTip.title}
              {isCompleted && (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 size={12} /> Praticado Hoje
                </span>
              )}
            </h3>

            <p className="text-xs md:text-sm text-[#5C5248] leading-relaxed max-w-2xl">
              {todayTip.description}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-end md:self-center">
          {onOpenHerbalBaths && (
            <button
              type="button"
              onClick={onOpenHerbalBaths}
              className="px-3 py-2.5 min-h-[44px] rounded-xl bg-white hover:bg-[#F5EFE4] border border-[#E5DAC6] text-[#5C5248] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
              title="Abrir Guia Sagrado de Banhos de Ervas"
            >
              <Leaf size={13} className="text-emerald-400" />
              <span>Guia de Banhos</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-2.5 min-h-[44px] rounded-xl bg-[#F5EFE4]/80 hover:bg-[#EFE4D3] border border-[#E5DAC6] text-[#5C5248] hover:text-[#2A2420] text-xs font-semibold transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30"
          >
            {isExpanded ? 'Ver Menos' : 'Ver Detalhes'}
          </button>

          <button
            type="button"
            onClick={handleToggleCompleted}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md ${
              isCompleted
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                : 'bg-[#B88736] hover:bg-[#8F631E] text-white shadow-sm'
            }`}
          >
            <CheckCircle2 size={14} className={isCompleted ? 'text-white' : 'text-cyan-200'} />
            <span>{isCompleted ? 'Hábito Concluído!' : 'Marcar como Praticado'}</span>
          </button>
        </div>
      </div>

      {/* Expanded Details Accordion */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-[#E5DAC6] grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"
          >
            {/* Practical Action */}
            <div className="p-3 rounded-2xl bg-white/70 border border-[#E5DAC6] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#B88736] font-bold block">
                Ação prática
              </span>
              <p className="text-[#2A2420] leading-snug">
                {todayTip.practicalAction}
              </p>
            </div>

            {/* Holistic Benefit */}
            <div className="p-3 rounded-2xl bg-white/70 border border-[#E5DAC6] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#8F631E] font-bold block">
                Possível apoio
              </span>
              <p className="text-[#5C5248] leading-snug">
                {todayTip.benefit}
              </p>
            </div>

            {/* Affirmation */}
            <div className="p-3 rounded-2xl bg-white/70 border border-[#E5DAC6] space-y-1">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                Frase do dia
              </span>
              <p className="text-[#5C5248] italic leading-snug font-serif">
                "{todayTip.affirmation}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
