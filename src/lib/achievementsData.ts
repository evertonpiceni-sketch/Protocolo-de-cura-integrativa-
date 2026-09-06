/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AchievementItem, DayProgress, UserProfile } from '../types';

export const ALL_ACHIEVEMENTS: AchievementItem[] = [
  { id: 'primeiro_passo', title: 'Primeiro Passo', description: 'Concluiu o primeiro momento do Protocolo da Transformação.', category: 'jornada', icon: 'Sparkles', points: 50, requirementText: 'Completar o Dia 01 da Jornada' },
  { id: 'foco_sagrado', title: 'Presença', description: 'Reservou 3 dias para práticas de presença e conexão interior.', category: 'constancia', icon: 'Flame', points: 100, requirementText: 'Registrar 3 dias de prática' },
  { id: 'meditador_constante', title: 'Sete Momentos', description: 'Reservou sete momentos para meditação e autocuidado.', category: 'constancia', icon: 'Calendar', points: 200, requirementText: 'Completar 7 dias na jornada' },
  { id: 'mestre_dos_chakras', title: 'Jornada dos 7 Chakras', description: 'Concluiu a experiência de atenção aos 7 centros energéticos da jornada.', category: 'jornada', icon: 'Sun', points: 250, requirementText: 'Completar a Jornada dos 7 Chakras' },
  { id: 'guarda_de_miguel', title: 'Momento com Miguel', description: 'Reservou um momento para a prática espiritual dedicada ao Arcanjo Miguel.', category: 'espiritual', icon: 'Shield', points: 150, requirementText: 'Realizar a prática do Arcanjo Miguel' },
  { id: 'coracao_puro', title: 'Ho’oponopono', description: 'Reservou um momento para a prática contemplativa do Ho’oponopono.', category: 'espiritual', icon: 'Heart', points: 150, requirementText: 'Realizar a sessão de Ho’oponopono de 108 repetições' },
  { id: 'auto_observador', title: 'Olhar para Mim', description: 'Registrou sentimentos, sensações ou reflexões no Diário de Reconexão.', category: 'autoconhecimento', icon: 'BookOpen', points: 100, requirementText: 'Preencher pelo menos uma anotação no diário' },
  { id: 'consciencia_sistemica', title: 'Minhas Raízes', description: 'Reservou um momento para refletir sobre sua história, vínculos e raízes.', category: 'autoconhecimento', icon: 'GitBranch', points: 150, requirementText: 'Responder a uma pergunta de reflexão' },
  { id: 'diagnostico_quantico', title: 'Um Olhar para o Meu Momento', description: 'Concluiu a escuta inicial e registrou aspectos importantes do seu momento atual.', category: 'autoconhecimento', icon: 'Activity', points: 120, requirementText: 'Completar a escuta inicial' },
  { id: 'mapa_estelar', title: 'Mapa Astral', description: 'Acessou seu Mapa Astral como recurso de reflexão e autoconhecimento.', category: 'espiritual', icon: 'Compass', points: 120, requirementText: 'Visualizar o Mapa Astral' },
  { id: 'soberania_espiritual', title: 'Meu Caminho Continua', description: 'Reservou 14 momentos para olhar para si e dar continuidade à sua jornada.', category: 'constancia', icon: 'ShieldCheck', points: 350, requirementText: 'Completar 14 momentos da jornada' },
  { id: 'mestre_frequencia', title: '21 Momentos para Mim', description: 'Concluiu os 21 momentos do Protocolo da Transformação.', category: 'jornada', icon: 'Crown', points: 500, requirementText: 'Concluir os 21 momentos do Protocolo da Transformação' }
];

export interface AchievementEvaluation { unlocked: AchievementItem[]; locked: AchievementItem[]; unlockedIds: string[]; totalPoints: number; maxPoints: number; percentage: number; }

export function evaluateUserAchievements(profile: UserProfile | null | undefined, progress: DayProgress[]): AchievementEvaluation {
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
  if (completedCount >= 1) unlockedIds.add('primeiro_passo');
  if (maxStreak >= 3 || completedCount >= 3) unlockedIds.add('foco_sagrado');
  if (completedCount >= 7 || maxStreak >= 7) unlockedIds.add('meditador_constante');
  if (completedCount >= 7) unlockedIds.add('mestre_dos_chakras');
  if (hasArchangel) unlockedIds.add('guarda_de_miguel');
  if (hasHooponopono) unlockedIds.add('coracao_puro');
  if (hasJournalEntry) unlockedIds.add('auto_observador');
  if (hasSystemicAnswer) unlockedIds.add('consciencia_sistemica');
  if (hasAnamnesis) unlockedIds.add('diagnostico_quantico');
  if (hasAstralMap) unlockedIds.add('mapa_estelar');
  if (completedCount >= 14) unlockedIds.add('soberania_espiritual');
  if (completedCount >= 21) unlockedIds.add('mestre_frequencia');
  const unlocked: AchievementItem[] = []; const locked: AchievementItem[] = []; let totalPoints = 0;
  const maxPoints = ALL_ACHIEVEMENTS.reduce((acc, curr) => acc + curr.points, 0);
  ALL_ACHIEVEMENTS.forEach(ach => { if (unlockedIds.has(ach.id)) { unlocked.push(ach); totalPoints += ach.points; } else locked.push(ach); });
  return { unlocked, locked, unlockedIds: Array.from(unlockedIds), totalPoints, maxPoints, percentage: Math.round((unlocked.length / ALL_ACHIEVEMENTS.length) * 100) };
}

export const evaluateAchievements = evaluateUserAchievements;
