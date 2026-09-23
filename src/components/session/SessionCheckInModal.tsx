import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

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
      <div className="relative rounded-3xl p-6 sm:p-8 border border-[#E5DAC6] bg-[#FAF7F2]/98 shadow-[0_20px_50px_rgba(143,99,30,0.08)] backdrop-blur-xl text-left">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#FAF4E8] border border-[#B88736]/25 flex items-center justify-center text-[#8F631E]">
            {isBefore ? <Sparkles size={20} /> : <Heart size={20} />}
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#8F631E] font-semibold font-serif">
              {isBefore ? 'Acolhimento Inicial' : 'Integração & Selamento'} • Dia {dayNumber.toString().padStart(2, '0')}
            </p>
            <h3 className="text-xl sm:text-2xl font-serif text-[#2A2420] font-normal">
              {isBefore ? 'Como você chega para este momento?' : 'O que você percebe agora em seu ser?'}
            </h3>
          </div>
        </div>

        <p className="text-xs text-[#5C5248] mb-5 leading-relaxed">
          {isBefore
            ? 'Observe o seu campo sem julgamento. Não é necessário estar bem para ser acolhido aqui.'
            : 'Reconheça a sutileza da transformação. Cada respiração ancorou cura nas suas células.'}
        </p>

        {/* 1 to 5 Mood Scale */}
        <div className="mb-6 p-4 rounded-2xl bg-[#F4EFE6] border border-[#E5DAC6]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-serif text-[#8F631E] uppercase tracking-wider font-semibold">
              Escala de Disposição Energética
            </span>
            <span className="text-xs font-medium text-[#2A2420]">
              {moodDesc?.label || `Nível ${mood}`}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 my-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => onMoodChange(val)}
                className={`py-3 rounded-xl border text-sm font-serif font-medium transition-all duration-200 ${
                  mood === val
                    ? 'bg-[#8F631E] text-white border-[#8F631E] shadow-[0_2px_10px_rgba(143,99,30,0.3)] scale-105'
                    : 'bg-white/80 text-[#5C5248] border-[#E5DAC6] hover:border-[#8F631E]/40'
                }`}
              >
                {val}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-[#5C5248] italic text-center mt-2">
            {moodDesc?.sub}
          </p>
        </div>

        {/* Sensations Selection */}
        <div className="mb-6">
          <p className="text-xs font-serif text-[#8F631E] uppercase tracking-wider mb-2.5 font-semibold">
            {isBefore ? 'Sensações Presentes (Escolha as que ressoam)' : 'Efeitos Percebidos da Prática'}
          </p>
          <div className="flex flex-wrap gap-2">
            {availableSensations.map((sens) => {
              const isSelected = selectedSensations.includes(sens);
              return (
                <button
                  key={sens}
                  type="button"
                  onClick={() => onToggleSensation(sens)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-sans transition-all duration-150 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#8F631E] text-white border-[#8F631E] shadow-sm'
                      : 'bg-white/80 border-[#E5DAC6] text-[#5C5248] hover:text-[#2A2420] hover:border-[#8F631E]/40'
                  }`}
                >
                  {isSelected && <CheckCircle2 size={13} className="text-white" />}
                  <span>{sens}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Reflection Notes */}
        <div className="mb-6">
          <p className="text-xs font-serif text-[#8F631E] uppercase tracking-wider mb-2 font-semibold">
            {isBefore ? 'Intenção do Momento (Opcional)' : 'Anotação no Diário de Reconexão (Privado)'}
          </p>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder={
              isBefore
                ? 'Se desejar, expresse com poucas palavras o que busca liberar hoje...'
                : 'Como eu estava? O que percebi? Como estou agora? (Fica salvo no seu Diário)'
            }
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-white/90 border border-[#E5DAC6] text-sm text-[#2A2420] placeholder-[#85786C]/60 focus:outline-none focus:border-[#8F631E] transition-colors resize-none font-sans"
          />
        </div>

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B88736] via-[#D4AF37] to-[#C5A059] text-white text-sm font-semibold tracking-wide shadow-[0_4px_20px_rgba(184,135,54,0.25)] hover:shadow-[0_6px_25px_rgba(184,135,54,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>{isBefore ? 'Iniciar a Harmonização' : 'Concluir Dia e Selar o Cuidado'}</span>
          <ArrowRight size={16} />
        </button>

      </div>
    </motion.div>
  );
};
