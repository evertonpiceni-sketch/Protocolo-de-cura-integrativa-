import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, CheckCircle2, ArrowRight } from 'lucide-react';
import { SessionCheckIn } from '../../types';

interface SessionCheckInModalProps {
  type: 'before' | 'after';
  mood: number;
  onMoodChange: (mood: number) => void;
  selectedSensations: string[];
  onToggleSensation: (sensation: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  onConfirm: () => void;
  dayNumber: number;
  journeyType?: '7d' | '21d';
}

const BEFORE_APPROVED_SENSATIONS = [
  'Agitação / Inquietação',
  'Cansaço / Sobrecarga',
  'Mente acelerada / Dificuldade de foco',
  'Angústia / Desânimo',
  'Apatia',
  'Instabilidade / Oscilação'
];

const AFTER_APPROVED_SENSATIONS = [
  'Paz profunda',
  'Leveza no peito',
  'Clareza mental e foco',
  'Alívio e acolhimento',
  'Mente serena',
  'Calor suave no peito ou cabeça',
  'Relaxamento muscular profundo',
  'Respiração livre e espaçosa',
  'Estabilidade interior'
];

const MOOD_DESCRIPTIONS_BEFORE: Record<number, { label: string; sub: string }> = {
  1: { label: 'Sobrecarga Intensa', sub: 'Mente esgotada ou corpo cansado' },
  2: { label: 'Tensão ou Inquietação', sub: 'Agitação ou oscilação interna' },
  3: { label: 'Neutro / Em Transição', sub: 'Buscando ancoramento e calma' },
  4: { label: 'Presença e Serenidade', sub: 'Aberto à harmonização sutil' },
  5: { label: 'Plena Harmonia', sub: 'Coração receptivo e em paz' }
};

const MOOD_DESCRIPTIONS_AFTER: Record<number, { label: string; sub: string }> = {
  1: { label: 'Ainda em Processamento', sub: 'Liberações densas em andamento' },
  2: { label: 'Leve Alívio', sub: 'Primeiras tensões desfeitas' },
  3: { label: 'Centrado e Aterrado', sub: 'Mente tranquila e corpo solto' },
  4: { label: 'Serenidade e Vitalidade', sub: 'Coração aquecido e protegido' },
  5: { label: 'Cura e Empoderamento', sub: 'No trono de paz, livre e selado' }
};

export const SessionCheckInModal: React.FC<SessionCheckInModalProps> = ({
  type,
  mood,
  onMoodChange,
  selectedSensations,
  onToggleSensation,
  notes,
  onNotesChange,
  onConfirm,
  dayNumber,
  journeyType = '21d'
}) => {
  const isBefore = type === 'before';
  const availableSensations = isBefore ? BEFORE_APPROVED_SENSATIONS : AFTER_APPROVED_SENSATIONS;
  const moodDesc = isBefore ? MOOD_DESCRIPTIONS_BEFORE[mood] : MOOD_DESCRIPTIONS_AFTER[mood];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -12 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 max-w-xl mx-auto w-full px-4 py-6 my-auto"
    >
      <div className="relative rounded-3xl p-6 sm:p-8 border border-[#d4af37]/30 bg-gradient-to-b from-[#0a261c]/95 via-[#061410]/98 to-[#04100c] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.08)] backdrop-blur-xl text-left">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#e6ca65]">
            {isBefore ? <Sparkles size={20} /> : <Heart size={20} />}
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#d4af37] font-medium font-serif">
              {isBefore ? 'Acolhimento Inicial' : 'Integração & Selamento'} • Dia {dayNumber.toString().padStart(2, '0')}
            </p>
            <h3 className="text-xl sm:text-2xl font-serif text-[#f4f1ea] font-normal">
              {isBefore ? 'Como você chega a este momento?' : 'Como você se sente após o tratamento?'}
            </h3>
          </div>
        </div>

        <p className="text-xs text-[#8ca89a] leading-relaxed mb-6 font-sans">
          {isBefore
            ? 'Reconheça com honestidade e afeto o seu estado atual. Nenhuma emoção é julgada; tudo é acolhido para transmutação.'
            : 'Observe as sensações de alívio e reconexão. O seu relato é blindado energeticamente na Chama Violeta.'}
        </p>

        {/* Mood Slider */}
        <div className="mb-6 p-4 rounded-2xl bg-[#061410]/70 border border-[#8ca89a]/15">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#8ca89a]">Nível de bem-estar interior</span>
            <span className="font-serif font-semibold text-[#e6ca65]">{moodDesc?.label}</span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((level) => {
              const isSelected = level === mood;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => onMoodChange(level)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-serif font-medium transition-all ${
                    isSelected
                      ? 'bg-[#d4af37] text-[#061410] border-[#e6ca65] shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105'
                      : 'bg-[#04100c] text-[#8ca89a] border-[#8ca89a]/20 hover:border-[#8ca89a]/40'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-[#8ca89a] italic text-center font-sans">
            {moodDesc?.sub}
          </p>
        </div>

        {/* Sensations Selection */}
        <div className="mb-6">
          <label className="block text-xs font-serif text-[#e8e3d5] mb-2.5">
            {isBefore ? 'Selecione o que melhor descreve o seu padrão agora:' : 'Quais sensações foram despertadas em você:'}
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSensations.map((sens) => {
              const isSelected = selectedSensations.includes(sens);
              return (
                <button
                  key={sens}
                  type="button"
                  onClick={() => onToggleSensation(sens)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all border ${
                    isSelected
                      ? 'bg-[#d4af37]/20 border-[#d4af37]/60 text-[#f4f1ea] shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                      : 'bg-[#061410]/60 border-[#8ca89a]/20 text-[#8ca89a] hover:text-[#e8e3d5] hover:border-[#8ca89a]/40'
                  }`}
                >
                  {sens}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes Input */}
        <div className="mb-6">
          <label className="block text-xs font-serif text-[#e8e3d5] mb-2">
            {isBefore ? 'Algum pensamento ou intenção para esta sessão? (Opcional)' : 'Diário de Sensações — deixe seu registro de cura:'}
          </label>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={3}
            placeholder={
              isBefore
                ? 'Ex: Peço clareza e relaxamento para os meus ombros e pensamentos...'
                : 'Ex: Senti um calor gostoso no peito e uma paz profunda ao final do selamento...'
            }
            className="w-full px-4 py-3 rounded-xl bg-[#04100c]/80 border border-[#8ca89a]/20 text-sm text-[#f4f1ea] placeholder-[#8ca89a]/40 focus:outline-none focus:border-[#d4af37]/60 transition-colors resize-none font-sans"
          />
        </div>

        {/* Confirm Action */}
        <button
          onClick={onConfirm}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c5a059] via-[#d4af37] to-[#e6ca65] text-[#061410] text-sm font-semibold tracking-wide shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>{isBefore ? 'Continuar para o Portal de Abertura' : 'Concluir Tratamento e Salvar'}</span>
          <ArrowRight size={16} />
        </button>

      </div>
    </motion.div>
  );
};
