/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles, CheckCircle2, MessageCircle,
  X, Shield
} from 'lucide-react';
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

const COURSES_DATA: EnergyCourse[] = [
  {
    id: 'reiki-kundalini',
    title: 'Reiki Kundalini & Despertar Prânico',
    category: 'Energia Vital & Coluna de Luz',
    description: 'Despertar seguro e harmonioso do canal energético principal (Sushumna) e da chama Kundalini. Na tradição do sistema, é estudado como prática de harmonização dos chakras, autocuidado energético e desenvolvimento da canalização.',
    modules: [
      'Despertar da Serpente Kundalini e Abertura dos Canais Sushumna, Ida e Pingala',
      'Limpeza Kármica Profunda dos 7 Chakras e Corpos Sutis',
      'Técnicas de Autoaplicação e Prática Energética à Distância',
      'Iniciações, Sintonizações e Boosters de Potência Kundalini (Níveis 1, 2 e Mestrado)'
    ],
    duration: 'Níveis 1, 2 e 3 (Mestrado) • Certificado Registrado',
    badge: 'Despertar & Kundalini',
    status: 'Inscrições Abertas',
    accentColor: 'amber'
  },
  {
    id: 'reiki-usui',
    title: 'Reiki Usui Tradicional (Usui Shiki Ryoho)',
    category: 'Linhagem Tradicional Japonesa',
    description: 'A linhagem clássica de Mikao Usui, Dr. Chujiro Hayashi e Hawayo Takata. Estudo dos 4 símbolos sagrados, das posições tradicionais de aplicação, da filosofia dos 5 princípios (Gokai) e da transmissão de Reiki segundo a linhagem apresentada no curso.',
    modules: [
      'Os 5 Princípios Sagrados do Reiki (Gokai) e Filosofia de Vida',
      'Anatomia dos Corpos Sutis, Byosen Reikan-ho e Técnicas de Escaneamento',
      'Os 4 Símbolos Sagrados: Cho Ku Rei, Sei He Ki, Hon Sha Ze Sho Nen e Dai Koo Myo',
      'Cirurgia Psíquica Kahuna como prática tradicional, aplicação à distância e Mestrado Docente'
    ],
    duration: 'Níveis 1 (Shoden), 2 (Okuden), 3A (Shinpiden) e Mestrado (Gokui Kaiden)',
    badge: 'Linhagem Tradicional',
    status: 'Inscrições Abertas',
    accentColor: 'indigo'
  },
  {
    id: 'reiki-chama-rosa',
    title: 'Reiki Chama Rosa Vibrante & Amor Divino',
    category: '3º Raio Cósmico • Mestres da Fraternidade Branca',
    description: 'Sintonização no Raio Rosa do Amor Incondicional sob a emanação da Mestra Ascensionada Rowena e do Arcanjo Chamuel. É apresentado na tradição como caminho de acolhimento da criança interior, ressignificação de mágoas e contemplação da Chama Trina no coração.',
    modules: [
      'O 3º Raio Cósmico e a Conexão com a Mestra Rowena & Arcanjo Chamuel',
      'Ativação e Expansão da Chama Trina no Chakra Cardíaco',
      'Acolhimento de Mágoas, Votos de Solidão, Rejeição e Bloqueios Afetivos',
      'Emissão da Frequência Rosa para Ambientes, Relacionamentos e Autocuidado'
    ],
    duration: 'Praticante e Mestre da Chama Rosa • Vivencial',
    badge: 'Amor Incondicional & Acolhimento Cardíaco',
    status: 'Inscrições Abertas',
    accentColor: 'rose'
  },
  {
    id: 'violet-flame-reiki',
    title: 'Violet Flame Reiki (Chama Violeta de Saint Germain)',
    category: '7º Raio Cósmico • Alquimia & Transmutação',
    description: 'A frequência simbólica de transmutação cármica do Fogo Sagrado Violeta de Saint Germain e Arcanjo Zadkiel combinada com os 40 símbolos sagrados de Kwan Yin. Na linguagem tradicional do sistema, trabalha transmutação cármica, miasmas astrais e elevação vibracional.',
    modules: [
      'Alquimia Espiritual e o Poder Libertador da Chama Violeta',
      'Os 40 Símbolos Sagrados de Kwan Yin e Mestres da Chama Violeta',
      'Transmutação de Dívidas Cármicas e Memórias Ancestrais na linguagem do sistema',
      'Criação do Escudo Protetor e Cálice de Fogo Violeta para Selamento Áurico'
    ],
    duration: 'Níveis 1 ao 4 • Iniciação Completa & Apostila',
    badge: 'Transmutação Alquímica',
    status: 'Inscrições Abertas',
    accentColor: 'purple'
  },
  {
    id: 'reiki-karuna-ki',
    title: 'Reiki Karuna Ki & Compaixão Iluminada',
    category: 'Compaixão Avançada • Deusa Guan Yin',
    description: 'O caminho sagrado da Ação Compassiva (Karuna) ancorado na amorosa presença de Guan Yin. Na tradição Karuna, é estudado como prática compassiva para conteúdos profundos, memórias simbólicas, padrões recorrentes e conexão espiritual com Guan Yin e Guias.',
    modules: [
      'Fundamentos do Karuna Ki e o Coração de Guan Yin',
      'Os 8 Símbolos Sagrados: Zonar, Halu, Harth, Rama, Gnosa, Kriya, Iava e Shanti',
      'Trabalho simbólico com Memórias Ancestrais, Padrões e Sombra',
      'Meditação da Fraternidade Branca, Alinhamento de Frequência e Mestrado Karuna Ki'
    ],
    duration: 'Praticante 1, 2 e Mestrado Karuna Ki • Certificado',
    badge: 'Compaixão & Presença',
    status: 'Inscrições Abertas',
    accentColor: 'teal'
  }
];

export default function CoursesModal({ isOpen, onClose, userName, userProfile }: CoursesModalProps) {
  const [selectedCourse, setSelectedCourse] = useState<EnergyCourse>(COURSES_DATA[0]);
  const [interestRegistered, setInterestRegistered] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const clientName = userProfile?.name || userName || 'Consulente';

  const handleRegisterInterest = (course: EnergyCourse) => {
    setInterestRegistered(prev => ({ ...prev, [course.id]: true }));
    const msg = encodeURIComponent(`Olá Éverton! Meu nome é ${clientName} e tenho muito interesse na formação e iniciação de: "${course.title}". Gostaria de receber mais informações sobre turmas, sintonização e valores!`);
    window.open(`https://wa.me/5551982215296?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  const activateCourse = (course: EnergyCourse) => setSelectedCourse(course);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#2A2420]/30 backdrop-blur-md overflow-y-auto overscroll-contain" id="courses-modal" role="dialog" aria-modal="true" aria-label="Cursos e formações">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-4xl bg-[#FBF8F2] border border-[#E5DAC6] rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden my-1 sm:my-4 max-h-[calc(100dvh-1rem)] sm:max-h-[92dvh] overflow-y-auto overscroll-contain"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#B88736]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-[#E5DAC6] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#B88736]/25 shrink-0 shadow-md">
              <img src={APPROVED_LOGO_DATA_URI} alt="Emblema oficial Everton Piceni" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8F631E] bg-[#B88736]/10 border border-[#B88736]/20 px-2.5 py-0.5 rounded-full font-bold">Escola de Sabedoria & Reiki</span>
                <span className="text-[10px] font-mono text-[#B88736]">Por Éverton Rodrigo Piceni</span>
              </div>
              <h2 className="text-base sm:text-xl font-display font-medium text-[#2A2420] mt-0.5">Cursos & Iniciações de Reiki</h2>
            </div>
          </div>

          <button onClick={onClose} aria-label="Fechar cursos e formações" className="w-11 h-11 text-[#5C5248] hover:text-[#2A2420] bg-[#F5EFE4]/70 hover:bg-[#EFE4D3] rounded-xl transition cursor-pointer border border-[#E5DAC6] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/30" title="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-white via-[#FBF8F2] to-[#F3EBDD] border border-[#E5DAC6] flex items-start gap-3.5">
          <Sparkles size={20} className="text-[#B88736] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#8F631E]">Formações & Sintonizações Energéticas</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#B88736]/10 text-[#8F631E] border border-[#B88736]/25 uppercase">Turmas & Iniciações Individuais</span>
            </div>
            <p className="text-xs text-[#5C5248] leading-relaxed">
              {userProfile?.plan === 'pro' ? (
                <><strong>BÔNUS VIP / PRO:</strong> seu perfil indica acesso PRO. Para qualquer benefício de curso, confirme a disponibilidade diretamente com Éverton Rodrigo Piceni em <strong>Fale Conosco</strong>.</>
              ) : (
                <>Conheça os sistemas de <strong>Reiki Kundalini</strong>, <strong>Reiki Usui Tradicional</strong>, <strong>Chama Rosa Vibrante</strong>, <strong>Violet Flame</strong> e <strong>Reiki Karuna Ki</strong> apresentados por Éverton Rodrigo Piceni.</>
              )}
            </p>
          </div>
        </div>

        <div className="ep-courses-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5" role="list" aria-label="Cursos disponíveis">
          {COURSES_DATA.map(course => {
            const isSelected = selectedCourse.id === course.id;
            const isRegistered = interestRegistered[course.id];

            return (
              <div
                key={course.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${course.title}. ${isSelected ? 'Selecionado' : 'Selecionar curso'}`}
                onClick={() => activateCourse(course)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    activateCourse(course);
                  }
                }}
                className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer space-y-3 relative overflow-hidden flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/40 ${
                  isSelected
                    ? 'bg-[#F5EFE4] border-[#B88736] shadow-md ring-1 ring-[#B88736]/25'
                    : 'bg-white/70 border-[#E5DAC6] hover:border-[#B88736]/45 hover:bg-[#FBF8F2]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#8F631E] uppercase tracking-wider font-semibold">{course.category}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-display font-medium text-[#2A2420] leading-snug">{course.title}</h3>
                  <p className="text-xs text-[#5C5248] leading-relaxed line-clamp-3">{course.description}</p>
                </div>

                <div className="ep-course-actions pt-3 border-t border-[#E5DAC6] flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-[#5C5248] truncate">{course.badge}</span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleRegisterInterest(course);
                    }}
                    onKeyDown={(event) => event.stopPropagation()}
                    className={`min-h-11 px-3 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition cursor-pointer border shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35 ${
                      isRegistered
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-[#B88736] hover:bg-[#8F631E] border-[#B88736] text-white shadow-sm'
                    }`}
                    aria-label={`${isRegistered ? 'Interesse enviado para' : 'Falar com Éverton sobre'} ${course.title}`}
                  >
                    {isRegistered ? <CheckCircle2 size={13} /> : <MessageCircle size={13} />}
                    <span>{isRegistered ? 'Contato aberto' : 'Fale Conosco'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {selectedCourse && (
          <div className="p-5 rounded-2xl bg-white border border-[#B88736]/30 space-y-4" aria-live="polite">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-[#B88736] uppercase tracking-widest block font-bold">Conteúdo programático & iniciação</span>
                <h4 className="text-base sm:text-lg font-display font-medium text-[#2A2420] mt-0.5">{selectedCourse.title}</h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono border border-emerald-300 font-semibold self-start sm:self-auto">{selectedCourse.status}</span>
            </div>

            <p className="text-xs text-[#5C5248] leading-relaxed">{selectedCourse.description}</p>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-[#5C5248] uppercase block font-bold">Módulos & transmissões:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedCourse.modules.map((mod, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-[#FBF8F2] border border-[#E5DAC6] text-xs text-[#5C5248]">
                    <CheckCircle2 size={13} className="text-emerald-700 shrink-0 mt-0.5" />
                    <span className="leading-snug">{mod}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E5DAC6]">
              <div className="flex items-center gap-2 text-xs text-[#5C5248]">
                <Shield size={14} className="text-[#B88736] shrink-0" />
                <span>{selectedCourse.duration}</span>
              </div>

              <button
                type="button"
                onClick={() => handleRegisterInterest(selectedCourse)}
                className="w-full sm:w-auto min-h-11 px-5 py-2.5 rounded-xl bg-[#B88736] hover:bg-[#8F631E] text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition cursor-pointer border-none shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88736]/35"
              >
                <MessageCircle size={15} />
                <span>Fale Conosco para Matrícula & Iniciação</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
