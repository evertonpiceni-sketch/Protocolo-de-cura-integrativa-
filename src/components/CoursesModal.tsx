/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap, Sparkles, CheckCircle2, MessageCircle,
  Calendar, Award, BookOpen, Layers, Star, X, ArrowRight, Shield, Heart, Flame, Sun
} from 'lucide-react';
import { UserProfile } from '../types';
import brandEmblemImg from '../assets/images/cura_integrada_sacred_emblem_1787104270641.jpg';

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
    description: 'Despertar seguro e harmonioso do canal energético principal (Sushumna) e da chama Kundalini. Acelera a purificação dos chakras, a autocura e a capacidade de canalizar altas frequências vibracionais.',
    modules: [
      'Despertar da Serpente Kundalini e Abertura dos Canais Sushumna, Ida e Pingala',
      'Limpeza Kármica Profunda dos 7 Chakras e Corpos Sutis',
      'Técnicas de Autoaplicação Expressa e Tratamento à Distância',
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
    description: 'A linhagem clássica de Mikao Usui, Dr. Chujiro Hayashi e Hawayo Takata. Domine os 4 símbolos sagrados, as posições de cura milenares, a filosofia dos 5 princípios (Gokai) e a transmissão transdimensional de Reiki.',
    modules: [
      'Os 5 Princípios Sagrados do Reiki (Gokai) e Filosofia de Vida',
      'Anatomia dos Corpos Sutis, Byosen Reikan-ho e Técnicas de Escaneamento',
      'Os 4 Símbolos Sagrados: Cho Ku Rei, Sei He Ki, Hon Sha Ze Sho Nen e Dai Koo Myo',
      'Cirurgia Psíquica Kahuna, Cura à Distância além do Tempo/Espaço e Mestrado Docente'
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
    description: 'Sintonização no Raio Rosa do Amor Incondicional sob a emanação da Mestra Ascensionada Rowena e do Arcanjo Chamuel. Promove a cura profunda da criança interior, dissolução de traumas afetivos, mágoas e ativação da Chama Trina no coração.',
    modules: [
      'O 3º Raio Cósmico e a Conexão com a Mestra Rowena & Arcanjo Chamuel',
      'Ativação e Expansão da Chama Trina no Chakra Cardíaco',
      'Cura de Mágoas, Votos de Solidão, Rejeição e Bloqueios Afetivos',
      'Emissão da Frequência Rosa para Ambientes, Relacionamentos e Autocuidado'
    ],
    duration: 'Praticante e Mestre da Chama Rosa • Vivencial',
    badge: 'Amor Incondicional & Cura Cardíaca',
    status: 'Inscrições Abertas',
    accentColor: 'rose'
  },
  {
    id: 'violet-flame-reiki',
    title: 'Violet Flame Reiki (Chama Violeta de Saint Germain)',
    category: '7º Raio Cósmico • Alquimia & Transmutação',
    description: 'A poderosa frequência de transmutação cármica do Fogo Sagrado Violeta de Saint Germain e Arcanjo Zadkiel combinada com os 40 símbolos sagrados de Kwan Yin. Transmuta carmas pesados, miasmas astrais e eleva a frequência celular para a 5ª Dimensão.',
    modules: [
      'Alquimia Espiritual e o Poder Libertador da Chama Violeta',
      'Os 40 Símbolos Sagrados de Kwan Yin e Mestres da Chama Violeta',
      'Transmutação de Dívidas Cármicas e Limpeza de Memórias Celulares Hereditárias',
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
    category: 'Cura Compassiva Avançada • Deusa Guan Yin',
    description: 'O caminho sagrado da Ação Compassiva (Karuna) ancorado na amorosa presença de Guan Yin. Atua na cura do inconsciente profundo, desprogramação de somatizações graves, liberação de memórias de vidas passadas e reconexão com os Guias Espirituais.',
    modules: [
      'Fundamentos do Karuna Ki e o Coração de Guan Yin',
      'Os 8 Símbolos Sagrados de Cura: Zonar, Halu, Harth, Rama, Gnosa, Kriya, Iava e Shanti',
      'Cura de Traumas Ancestrais, Somatizações e Desbloqueio da Sombra',
      'Meditação da Fraternidade Branca, Alinhamento de Frequência e Mestrado Karuna Ki'
    ],
    duration: 'Praticante 1, 2 e Mestrado Karuna Ki • Certificado',
    badge: 'Compaixão & Cura da Alma',
    status: 'Inscrições Abertas',
    accentColor: 'teal'
  }
];

export default function CoursesModal({ isOpen, onClose, userName, userProfile, onOpenContact }: CoursesModalProps) {
  const [selectedCourse, setSelectedCourse] = useState<EnergyCourse>(COURSES_DATA[0]);
  const [interestRegistered, setInterestRegistered] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const clientName = userProfile?.name || userName || 'Consulente';

  const handleRegisterInterest = (course: EnergyCourse) => {
    setInterestRegistered(prev => ({ ...prev, [course.id]: true }));
    const msg = encodeURIComponent(`Olá Éverton! Meu nome é ${clientName} e tenho muito interesse na formação e iniciação de: "${course.title}". Gostaria de receber mais informações sobre turmas, sintonização e valores!`);
    window.open(`https://wa.me/5551982215296?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto" id="courses-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden my-4 max-h-[92vh] overflow-y-auto"
      >
        {/* Ambient violet-amber background flare */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-purple-500/30 shrink-0 shadow-md">
              <img
                src={brandEmblemImg}
                alt="Emblema Sagrado Cura Integrada"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold">
                  Escola de Sabedoria Quântica & Reiki
                </span>
                <span className="text-[10px] font-mono text-purple-300">
                  Por Éverton Rodrigo Piceni
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-display font-medium text-slate-100 mt-0.5">
                Cursos & Iniciações de Reiki
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition cursor-pointer border-none"
            title="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Introduction Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 via-indigo-950/20 to-slate-950/50 border border-purple-500/30 flex items-start gap-3.5">
          <Sparkles size={20} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300">
                ✨ Formações & Sintonizações Energéticas
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                Turmas & Iniciações Individuais
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Desenvolva sua sensibilidade canalizadora, torne-se um canal puro de luz e aprenda os sistemas sagrados de <strong>Reiki Kundalini</strong>, <strong>Reiki Usui Tradicional</strong>, <strong>Chama Rosa Vibrante</strong>, <strong>Violet Flame</strong> e <strong>Reiki Karuna Ki</strong> com o Mestre e Terapeuta <strong>Éverton Rodrigo Piceni</strong>.
            </p>
          </div>
        </div>

        {/* Courses Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {COURSES_DATA.map(course => {
            const isSelected = selectedCourse.id === course.id;
            const isRegistered = interestRegistered[course.id];

            return (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer space-y-3 relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-950/50 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-semibold">
                      {course.category}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-display font-medium text-slate-100 leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-400 truncate">
                    {course.badge}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRegisterInterest(course);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition cursor-pointer border shrink-0 ${
                      isRegistered
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow-sm'
                    }`}
                  >
                    {isRegistered ? <CheckCircle2 size={13} /> : <MessageCircle size={13} />}
                    <span>{isRegistered ? 'Interesse Enviado' : 'Fale Conosco'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Course Deep Dive Details */}
        {selectedCourse && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">
                  CONTEÚDO PROGRAMÁTICO & INICIAÇÃO
                </span>
                <h4 className="text-base sm:text-lg font-display font-medium text-slate-100 mt-0.5">
                  {selectedCourse.title}
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-mono border border-emerald-500/30 font-semibold self-start sm:self-auto">
                {selectedCourse.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedCourse.description}
            </p>

            {/* Modules list */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase block font-bold">Módulos & Transmissões Sagradas:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedCourse.modules.map((mod, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-850 text-xs text-slate-300">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{mod}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-850">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Shield size={14} className="text-amber-400 shrink-0" />
                <span>{selectedCourse.duration}</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleRegisterInterest(selectedCourse)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition cursor-pointer border-none shadow-lg shadow-emerald-600/20 font-bold"
                >
                  <MessageCircle size={15} />
                  <span>Fale Conosco para Matrícula & Iniciação</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
