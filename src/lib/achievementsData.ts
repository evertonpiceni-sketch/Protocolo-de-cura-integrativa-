/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AchievementItem, DayProgress, UserProfile } from '../types';

export const ALL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'primeiro_passo',
    title: 'Primeiro Salto Quântico',
    description: 'Concluiu o primeiro dia do Protocolo de Cura Integrada.',
    category: 'jornada',
    icon: 'Sparkles',
    points: 50,
    requirementText: 'Completar o Dia 01 da Jornada'
  },
  {
    id: 'foco_sagrado',
    title: 'Foco Sagrado',
    description: 'Manteve 3 dias consecutivos de prática meditativa e conexão interior.',
    category: 'constancia',
    icon: 'Flame',
    points: 100,
    requirementText: 'Alcançar um streak de 3 dias seguidos'
  },
  {
    id: 'meditador_constante',
    title: 'Meditador Constante',
    description: 'Alcançou 7 dias de meditações concluídas, consolidando a rotina de autocura.',
    category: 'constancia',
    icon: 'Calendar',
    points: 200,
    requirementText: 'Completar 7 dias na jornada ou atingir 7 dias seguidos'
  },
  {
    id: 'mestre_dos_chakras',
    title: 'Mestre dos 7 Chakras',
    description: 'Alinhou com perfeição os 7 centros de força sutis da jornada de 7 dias.',
    category: 'jornada',
    icon: 'Sun',
    points: 250,
    requirementText: 'Completar a Jornada dos 7 Chakras'
  },
  {
    id: 'guarda_de_miguel',
    title: 'Escudo de Miguel',
    description: 'Ancorou a proteção espiritual através da Sagrada Oração de 21 Dias do Arcanjo Miguel.',
    category: 'espiritual',
    icon: 'Shield',
    points: 150,
    requirementText: 'Recitar a Oração de Libertação do Arcanjo Miguel'
  },
  {
    id: 'coracao_puro',
    title: 'Coração Puro (Ho\'oponopono)',
    description: 'Praticou a purificação e reconciliação com o Japamala 108x do Ho\'oponopono.',
    category: 'espiritual',
    icon: 'Heart',
    points: 150,
    requirementText: 'Realizar a sessão de Ho\'oponopono de 108 repetições'
  },
  {
    id: 'auto_observador',
    title: 'Auto-Observador Cósmico',
    description: 'Registrou sentimentos, sensações e relatos profundos no Diário de Bordo.',
    category: 'autoconhecimento',
    icon: 'BookOpen',
    points: 100,
    requirementText: 'Preencher pelo menos uma anotação no Diário Quântico'
  },
  {
    id: 'consciencia_sistemica',
    title: 'Consciência Sistêmica',
    description: 'Respondeu às perguntas sistêmicas do dia, honrando sua linhagem e raízes ancestrais.',
    category: 'autoconhecimento',
    icon: 'GitBranch',
    points: 150,
    requirementText: 'Responder a uma Pergunta Sistêmica do Dia'
  },
  {
    id: 'diagnostico_quantico',
    title: 'Diagnóstico Quântico',
    description: 'Preencheu a Ficha de Anamnese Terapêutica e mapeou suas dores e chakras.',
    category: 'autoconhecimento',
    icon: 'Activity',
    points: 120,
    requirementText: 'Completar a Ficha de Anamnese Holística'
  },
  {
    id: 'mapa_estelar',
    title: 'Mapeamento Cósmico',
    description: 'Desbloqueou e contemplou a sabedoria do seu Mapa Astral & Energético.',
    category: 'espiritual',
    icon: 'Compass',
    points: 120,
    requirementText: 'Visualizar o Mapa Astral com horóscopo e elementos'
  },
  {
    id: 'soberania_espiritual',
    title: 'Soberania Espiritual',
    description: 'Ultrapassou 14 dias de protocolo, desfazendo traumas e bloqueios emocionais.',
    category: 'constancia',
    icon: 'ShieldCheck',
    points: 350,
    requirementText: 'Completar 14 dias de tratamento'
  },
  {
    id: 'mestre_frequencia',
    title: 'Mestre da Frequência',
    description: 'Completou com louvor e honra os 21 dias do Protocolo de Cura Integrada!',
    category: 'jornada',
    icon: 'Crown',
    points: 500,
    requirementText: 'Concluir todos os 21 dias do Protocolo de Cura'
  }
];

export interface AchievementEvaluation {
  unlocked: AchievementItem[];
  locked: AchievementItem[];
  unlockedIds: string[];
  totalPoints: number;
  maxPoints: number;
  percentage: number;
}

export function evaluateUserAchievements(
  profile: UserProfile | null | undefined,
  progress: DayProgress[]
): AchievementEvaluation {
  const completedCount = progress.filter(p => p.completed).length;
  const currentStreak = profile?.currentStreak || 0;
  const longestStreak = profile?.longestStreak || 0;
  const maxStreak = Math.max(currentStreak, longestStreak);
  
  const hasJournalEntry = progress.some(p => (p.journalText && p.journalText.trim().length > 0) || p.beforeFeeling?.notes || p.afterFeeling?.notes);
  const hasSystemicAnswer = progress.some(p => p.systemicAnswer && p.systemicAnswer.trim().length > 0);
  const hasAnamnesis = Boolean(profile?.anamnesis && profile.anamnesis.mainComplaints && profile.anamnesis.mainComplaints.length > 0);
  const hasAstralMap = Boolean(profile?.astralMap || profile?.birthDate);
  const hasArchangel = Boolean(profile?.archangelPrayerCompletedDays && profile.archangelPrayerCompletedDays.length > 0);
  const hasHooponopono = Boolean((profile?.hooponoponoPracticedCount || 0) > 0);

  const unlockedIds = new Set<string>(profile?.unlockedAchievements || []);

  // Check automated rules
  if (completedCount >= 1) unlockedIds.add('primeiro_passo');
  if (maxStreak >= 3 || completedCount >= 3) unlockedIds.add('foco_sagrado');
  if (completedCount >= 7 || maxStreak >= 7) unlockedIds.add('meditador_constante');
  if (completedCount >= 7 && profile?.selectedJourney === '7d') unlockedIds.add('mestre_dos_chakras');
  if (completedCount >= 7) unlockedIds.add('mestre_dos_chakras'); // also valid if 7 days done
  if (hasArchangel) unlockedIds.add('guarda_de_miguel');
  if (hasHooponopono) unlockedIds.add('coracao_puro');
  if (hasJournalEntry) unlockedIds.add('auto_observador');
  if (hasSystemicAnswer) unlockedIds.add('consciencia_sistemica');
  if (hasAnamnesis) unlockedIds.add('diagnostico_quantico');
  if (hasAstralMap) unlockedIds.add('mapa_estelar');
  if (completedCount >= 14) unlockedIds.add('soberania_espiritual');
  if (completedCount >= 21) unlockedIds.add('mestre_frequencia');

  const unlocked: AchievementItem[] = [];
  const locked: AchievementItem[] = [];
  let totalPoints = 0;
  const maxPoints = ALL_ACHIEVEMENTS.reduce((acc, curr) => acc + curr.points, 0);

  ALL_ACHIEVEMENTS.forEach(ach => {
    if (unlockedIds.has(ach.id)) {
      unlocked.push(ach);
      totalPoints += ach.points;
    } else {
      locked.push(ach);
    }
  });

  const percentage = Math.round((unlocked.length / ALL_ACHIEVEMENTS.length) * 100);

  return {
    unlocked,
    locked,
    unlockedIds: Array.from(unlockedIds),
    totalPoints,
    maxPoints,
    percentage
  };
}

export const evaluateAchievements = evaluateUserAchievements;

