import type { AnamnesisData, DayProgress, UserAccount, UserProfile } from '../types';

const CURRENT_LOGIN_KEY = 'cura_integrada_logged_in_user_v1';
const ACCOUNTS_KEY = 'cura_integrada_accounts_v1';
const WEEKLY_MILESTONES = [7, 14, 21] as const;

type EmotionRule = {
  id: string;
  label: string;
  terms: string[];
};

const EMOTION_RULES: EmotionRule[] = [
  { id: 'ansiedade', label: 'Ansiedade / preocupação', terms: ['ansios', 'preocup', 'apreens', 'angust', 'nervos', 'agitado', 'agitada'] },
  { id: 'medo', label: 'Medo / insegurança', terms: ['medo', 'insegur', 'receio', 'ameaça', 'ameaca', 'pânico', 'panico'] },
  { id: 'tristeza', label: 'Tristeza / desânimo', terms: ['triste', 'desanim', 'vazio', 'vazia', 'chor', 'saudade', 'abatid'] },
  { id: 'cansaco', label: 'Cansaço / sobrecarga', terms: ['cansad', 'exaust', 'esgot', 'sobrecarreg', 'sem energia', 'peso'] },
  { id: 'autocobranca', label: 'Autocobrança / culpa', terms: ['culpa', 'cobran', 'fracass', 'errei', 'erro', 'perfeito', 'perfeccion', 'insuficiente'] },
  { id: 'raiva', label: 'Irritação / raiva', terms: ['raiva', 'irritad', 'ódio', 'odio', 'revolt', 'bravo', 'brava'] },
  { id: 'calma', label: 'Calma / alívio', terms: ['calmo', 'calma', 'aliv', 'leve', 'tranquil', 'paz'] },
  { id: 'esperanca', label: 'Esperança / confiança', terms: ['esperan', 'confian', 'melhor', 'animad', 'motivad', 'seguro', 'segura'] },
  { id: 'alegria', label: 'Alegria / gratidão', terms: ['feliz', 'alegr', 'grat', 'contente', 'satisfeit'] }
];

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
}

function readCurrentAccount(): UserAccount | undefined {
  try {
    const login = localStorage.getItem(CURRENT_LOGIN_KEY);
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return undefined;
    const accounts = JSON.parse(raw) as UserAccount[];
    return login ? accounts.find(item => item.login === login) : accounts[0];
  } catch {
    return undefined;
  }
}

function extractInitialEmotions(anamnesis?: AnamnesisData) {
  if (!anamnesis) return [];
  return Array.from(new Set([
    ...(anamnesis.emotionalState || []),
    ...(anamnesis.mainComplaints || [])
  ].map(item => String(item).trim()).filter(Boolean)));
}

function collectPeriodText(progress: DayProgress[], startDay: number, endDay: number) {
  return progress
    .filter(item => item.dayNumber >= startDay && item.dayNumber <= endDay)
    .map(item => [
      item.journalText || '',
      item.beforeFeeling?.notes || '',
      item.afterFeeling?.notes || ''
    ].join(' '))
    .join(' ');
}

function countEmotionPatterns(text: string) {
  const source = normalize(text);
  return EMOTION_RULES
    .map(rule => ({
      ...rule,
      count: rule.terms.reduce((total, term) => {
        const normalizedTerm = normalize(term);
        if (!normalizedTerm) return total;
        const matches = source.match(new RegExp(normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
        return total + (matches?.length || 0);
      }, 0)
    }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count);
}

function averageMood(progress: DayProgress[], startDay: number, endDay: number) {
  const values = progress
    .filter(item => item.dayNumber >= startDay && item.dayNumber <= endDay)
    .map(item => item.afterFeeling?.mood || item.mood || item.beforeFeeling?.mood)
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function ensureStyles() {
  if (document.getElementById('ep-weekly-diary-analysis-styles')) return;
  const style = document.createElement('style');
  style.id = 'ep-weekly-diary-analysis-styles';
  style.textContent = `
    #ep-weekly-diary-analysis{position:relative;border:1px solid rgba(184,135,54,.28);background:linear-gradient(180deg,rgba(255,253,247,.98),rgba(248,241,224,.96));border-radius:20px;padding:16px;box-shadow:0 10px 28px rgba(68,55,35,.08);color:#2A2420}
    #ep-weekly-diary-analysis .ep-week-kicker{font:700 10px/1.4 Inter,sans-serif;letter-spacing:.13em;text-transform:uppercase;color:#71511c;margin:0 0 5px}
    #ep-weekly-diary-analysis h3{font:600 20px/1.2 Georgia,serif;color:#26372a;margin:0 0 8px}
    #ep-weekly-diary-analysis p{font:400 12px/1.65 Inter,sans-serif;color:#5c5248;margin:0}
    #ep-weekly-diary-analysis .ep-week-box{margin-top:10px;padding:11px 12px;border-radius:14px;background:rgba(255,255,255,.78);border:1px solid #e5dac6}
    #ep-weekly-diary-analysis .ep-week-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
    #ep-weekly-diary-analysis .ep-week-item{padding:11px;border-radius:14px;background:#fffaf0;border:1px solid #e5dac6}
    #ep-weekly-diary-analysis .ep-week-item span{display:block;font:700 9px/1.3 Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#71511c;margin-bottom:4px}
    #ep-weekly-diary-analysis .ep-week-item strong{display:block;font:600 12px/1.45 Inter,sans-serif;color:#26372a}
    #ep-weekly-diary-analysis .ep-week-note{margin-top:10px;font-size:10px;color:#6b6d61}
    .ep-courses-locked{opacity:.66!important;cursor:not-allowed!important;position:relative!important}
    .ep-courses-locked::after{content:'Em preparação';margin-left:auto;padding:4px 8px;border-radius:999px;border:1px solid #d9c58f;background:#fffaf0;color:#71511c;font:700 9px/1 Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase}
    #daily-diary-modal [data-ep-diary-hide="true"]{display:none!important}
    :root[data-layout="natural-sereno"] .ep-home-anamnesis-card > small{font-size:0!important}
    :root[data-layout="natural-sereno"] .ep-home-anamnesis-card > small::after{content:'Anamnese Compacta';font-size:10px!important}
    @media(max-width:520px){#ep-weekly-diary-analysis .ep-week-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
}

function getActiveDiaryDay(modal: HTMLElement) {
  const explicit = modal.textContent?.match(/DIA\s+(\d{1,2})/i);
  if (!explicit) return null;
  const day = Number(explicit[1]);
  return Number.isFinite(day) ? day : null;
}

function simplifyDailyDiary() {
  const modal = document.getElementById('daily-diary-modal') as HTMLElement | null;
  if (!modal) return;

  const texts = Array.from(modal.querySelectorAll<HTMLElement>('span,p,strong,h3'));
  for (const element of texts) {
    const text = (element.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) continue;

    if (
      text.startsWith('[1] COMO ESTAVA ANTES') ||
      text.startsWith('[2] COMO ESTOU DEPOIS') ||
      text.startsWith('Resposta à Pergunta Sistêmica do Dia') ||
      text.startsWith('O QUE OBSERVAR DURANTE OS 21 DIAS')
    ) {
      const card = element.closest<HTMLElement>('.rounded-2xl') || element.parentElement;
      card?.setAttribute('data-ep-diary-hide', 'true');
    }

    if (text.startsWith('Reflexão & Diário do Dia')) {
      element.textContent = text.replace('Reflexão & Diário do Dia', 'Meu espaço de escrita — Dia');
    }

    if (text === 'Humor Geral:') {
      const row = element.closest<HTMLElement>('.flex.items-center.gap-2');
      row?.setAttribute('data-ep-diary-hide', 'true');
    }
  }

  const textarea = modal.querySelector<HTMLTextAreaElement>('textarea[placeholder*="percepções"], textarea[placeholder*="transformações"]');
  if (textarea) textarea.placeholder = 'Escreva livremente o que quiser colocar para fora hoje. Este espaço é privado e não recebe análise imediata.';

  const title = Array.from(modal.querySelectorAll<HTMLElement>('h2')).find(item => (item.textContent || '').includes('Diário de Reconexão'));
  if (title) title.textContent = 'Meu Diário';

  const badge = Array.from(modal.querySelectorAll<HTMLElement>('span')).find(item => (item.textContent || '').trim() === 'REGISTRO DIÁRIO DO CLIENTE');
  if (badge) badge.textContent = 'ESPAÇO PRIVADO DE ESCRITA';
}

function renderWeeklyDiaryAnalysis() {
  const modal = document.getElementById('daily-diary-modal') as HTMLElement | null;
  if (!modal) return;

  const scroll = modal.querySelector<HTMLElement>('.flex-1.min-h-0.overflow-y-auto');
  if (!scroll) return;

  const activeDay = getActiveDiaryDay(modal);
  let card = document.getElementById('ep-weekly-diary-analysis');

  if (!activeDay || !WEEKLY_MILESTONES.includes(activeDay as 7 | 14 | 21)) {
    card?.remove();
    return;
  }

  const account = readCurrentAccount();
  const profile: UserProfile | undefined = account?.profile;
  const progress = account?.progress || [];
  const startDay = activeDay - 6;
  const periodText = collectPeriodText(progress, startDay, activeDay);
  const patterns = countEmotionPatterns(periodText);
  const initialEmotions = extractInitialEmotions(profile?.anamnesis);
  const avgMood = averageMood(progress, startDay, activeDay);
  const recordsInPeriod = progress.filter(item => item.dayNumber >= startDay && item.dayNumber <= activeDay && (item.journalText || item.beforeFeeling?.notes || item.afterFeeling?.notes)).length;

  if (!card) {
    card = document.createElement('section');
    card.id = 'ep-weekly-diary-analysis';
    card.setAttribute('aria-live', 'polite');
    scroll.appendChild(card);
  }

  const topPatterns = patterns.slice(0, 4);
  const patternMarkup = topPatterns.length
    ? topPatterns.map(item => `<div class="ep-week-item"><span>Apareceu nos registros</span><strong>${item.label}</strong></div>`).join('')
    : '<div class="ep-week-item"><span>Leitura da semana</span><strong>Sem padrão emocional dominante nos registros disponíveis.</strong></div>';

  const initialText = initialEmotions.length
    ? initialEmotions.slice(0, 6).join(', ')
    : 'Não há emoções iniciais registradas na anamnese.';

  const moodText = avgMood == null
    ? 'Sem dados suficientes para calcular a média de humor.'
    : `${avgMood.toFixed(1).replace('.', ',')} / 5`;

  card.innerHTML = `
    <p class="ep-week-kicker">Fechamento dos dias ${startDay}–${activeDay}</p>
    <h3>Minha semana emocional</h3>
    <p>Seu diário continua sendo um espaço livre para desabafar. A leitura abaixo só acontece neste marco de 7 dias e compara o que apareceu nos seus registros com o estado emocional inicial informado na anamnese.</p>
    <div class="ep-week-box"><p><strong>Estado emocional inicial:</strong> ${initialText}</p></div>
    <div class="ep-week-grid">${patternMarkup}</div>
    <div class="ep-week-grid">
      <div class="ep-week-item"><span>Registros considerados</span><strong>${recordsInPeriod} de 7 dias</strong></div>
      <div class="ep-week-item"><span>Humor médio registrado</span><strong>${moodText}</strong></div>
    </div>
    <div class="ep-week-note">Esta leitura resume palavras e emoções registradas por você. Não é diagnóstico e não interpreta cada desabafo individualmente.</div>
  `;
}

function lockCoursesInNaturalSereno() {
  const root = document.querySelector<HTMLElement>('.ns-app');
  if (!root) return;
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('button'));
  for (const button of buttons) {
    const text = button.textContent || '';
    if (text.includes('Cursos e conteúdos') || text.includes('Cursos & Formações')) {
      button.disabled = true;
      button.setAttribute('aria-disabled', 'true');
      button.setAttribute('title', 'Cursos em preparação');
      button.classList.add('ep-courses-locked');
    }
  }
}

function apply() {
  ensureStyles();
  simplifyDailyDiary();
  renderWeeklyDiaryAnalysis();
  lockCoursesInNaturalSereno();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const start = () => {
    apply();
    const observer = new MutationObserver(() => apply());
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}

export const PERSONAL_CARE_INTEGRATION = Object.freeze({
  diaryPurpose: 'desabafo',
  weeklyAnalysisDays: WEEKLY_MILESTONES,
  anamnesisUniversal: true,
  libraryVisibleToUsers: false
});