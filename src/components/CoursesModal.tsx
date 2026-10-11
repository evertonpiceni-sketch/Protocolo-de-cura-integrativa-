/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Lock, X } from 'lucide-react';
import { UserProfile } from '../types';
import { APPROVED_LOGO_DATA_URI } from './ApprovedBrand';

interface CoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userProfile?: UserProfile;
  onOpenContact?: () => void;
}

export interface EnergyCourse {
  id: string;
  title: string;
  category: string;
  description: string;
  modules: string[];
  duration: string;
  badge: string;
  status: 'Lista de Espera VIP' | 'Em Breve' | 'Inscrições Abertas';
  accentColor: string;
}

export default function CoursesModal({ isOpen, onClose }: CoursesModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2A2420]/30 backdrop-blur-md overflow-y-auto overscroll-contain"
      id="courses-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Cursos em preparação"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        className="w-full max-w-xl bg-[#FBF8F2] border border-[#E5DAC6] rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#B88736]/6 blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          aria-label="Fechar cursos"
          className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/80 border border-[#E5DAC6] text-[#5C5248] hover:text-[#2A2420] flex items-center justify-center transition cursor-pointer z-10"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 pr-12 pb-5 border-b border-[#E5DAC6]">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#B88736]/25 bg-white/70 shrink-0">
            <img src={APPROVED_LOGO_DATA_URI} alt="Everton Piceni" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[.16em] text-[#71511c] font-semibold">Biblioteca Integrativa</p>
            <h2 className="font-display text-2xl text-[#26372a] mt-1">Cursos em preparação</h2>
          </div>
        </div>

        <div className="py-7 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D9C58F] bg-[#FFF9EA] text-[#71511c]">
            <Lock size={26} strokeWidth={1.7} />
          </div>
          <h3 className="font-display text-[1.65rem] leading-tight text-[#26372a]">Esta área ainda não está liberada</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5C5248]">
            Os cursos e formações ainda estão sendo organizados e auditados. Enquanto esse conteúdo não estiver completo, esta aba permanece bloqueada para não apresentar material incompleto.
          </p>

          <div className="mt-6 rounded-2xl border border-[#E5DAC6] bg-white/75 p-4 text-left">
            <div className="flex items-start gap-3">
              <BookOpen size={20} className="mt-0.5 shrink-0 text-[#B88736]" />
              <div>
                <strong className="block text-sm text-[#26372a]">O restante do app continua disponível</strong>
                <p className="mt-1 text-xs leading-5 text-[#5C5248]">Jornadas, anamnese energética, diário, biblioteca de práticas e demais recursos aprovados continuam funcionando normalmente.</p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full min-h-12 rounded-2xl border border-[#B88736]/35 bg-[#F1E7C8] px-5 py-3 text-sm font-semibold text-[#26372a] transition hover:bg-[#EADAAE]"
        >
          Voltar ao app
        </button>
      </motion.div>
    </div>
  );
}
