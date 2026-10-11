import type { AnamnesisData, UserAccount, UserProfile } from '../types';

type CareRule = {
  id: string;
  label: string;
  terms: string[];
  system: string;
  crystal: string;
  frequency: string;
  practice: string;
};

type CareInsight = CareRule & {
  reason: string;
  anamnesisLine?: string;
};

const CURRENT_LOGIN_KEY = 'cura_integrada_logged_in_user_v1';
const ACCOUNTS_KEY = 'cura_integrada_accounts_v1';

const CARE_RULES: CareRule[] = [
  {
    id: 'seguranca',
    label: 'Segurança, medo e aterramento',
    terms: ['medo', 'insegur', 'ansios', 'angust', 'panico', 'pânico', 'ameaça', 'ameaca', 'apreens', 'preocup'],
    system: 'Karuna Ki — Zonar, Halu e Shanti',
    crystal: 'Turmalina Negra, Quartzo Fumê ou Jaspe Vermelho',
    frequency: '396 Hz',
    practice: 'Aterramento pelos pés, respiração lenta e aplicação breve na base do corpo e no centro do peito.'
  },
  {
    id: 'procrastinacao',
    label: 'Procrastinação, travamento e retomada de movimento',
    terms: ['procrast', 'travado', 'travada', 'adiando', 'adiar', 'sem vontade', 'desanim', 'paralis', 'não consigo começar', 'nao consigo comecar'],
    system: 'Karuna Ki — Kriya e Rama',
    crystal: 'Cornalina, Olho de Tigre ou Citrino',
    frequency: '417 Hz',
    practice: 'Escolha uma ação pequena e concreta para hoje e faça a aplicação antes de iniciá-la.'
  },
  {
    id: 'autocobranca',
    label: 'Autocobrança, culpa e excesso mental',
    terms: ['culpa', 'cobran', 'perfeito', 'perfeccion', 'fracass', 'erro', 'errei', 'insuficiente', 'não sou bom', 'nao sou bom'],
    system: 'Karuna Ki — Harth e Shanti',
    crystal: 'Quartzo Rosa, Ametista ou Rodonita',
    frequency: '528 Hz',
    practice: 'Aplicação no centro do peito com foco em gentileza, seguida de alguns minutos de silêncio.'
  },
  {
    id: 'cansaco',
    label: 'Cansaço, sobrecarga e necessidade de recuperação',
    terms: ['cansad', 'esgot', 'exaust', 'sem energia', 'sobrecarreg', 'peso', 'drenado', 'drenada'],
    system: 'Usui + Life Force Energy Cone',
    crystal: 'Cristal de Quartzo, Hematita ou Jaspe Vermelho',
    frequency: '432 Hz',
    practice: 'Aplicação curta e tranquila no corpo, priorizando descanso e recomposição em vez de intensidade.'
  },
  {
    id: 'emocional',
    label: 'Emoções intensas e necessidade de acolhimento',
    terms: ['triste', 'chor', 'saudade', 'abandono', 'rejei', 'solid', 'mágoa', 'magoa', 'dor emocional', 'coração', 'coracao'],
    system: 'Harth + Universal Love + Soul Healing',
    crystal: 'Quartzo Rosa, Rodonita ou Aventurina Verde',
    frequency: '639 Hz',
    practice: 'Aplicação suave no centro do peito, sem tentar apressar ou corrigir a emoção.'
  },
  {
    id: 'clareza',
    label: 'Confusão, excesso de pensamentos e busca de clareza',
    terms: ['confus', 'pensando demais', 'mente', 'indecis', 'dúvida', 'duvida', 'não sei', 'nao sei', 'clareza', 'rumin'],
    system: 'Gnosa + Mind Empowerment + Shanti',
    crystal: 'Sodalita, Lápis-Lazúli ou Ametista',
    frequency: '741 Hz',
    practice: 'Aplicação breve na região frontal e depois uma pergunta simples: qual é o próximo passo possível?' 
  },
  {
    id: 'protecao',
    label: 'Proteção, limites e sensação de campo carregado',
    terms: ['carregado', 'carregada', 'energia ruim', 'proteção', 'protecao', 'limite', 'invad', 'sugado', 'sugada', 'ambiente pesado'],
    system: 'São Miguel + Chama Violeta + Rama',
    crystal: 'Turmalina Negra, Obsidiana ou Ametista',
    frequency: '417 Hz',
    practice: 'Organize o ambiente, faça uma aplicação de proteção e encerre com aterramento pelos pés.'
  },
  {
    id: 'presenca',
    label: 'Presença e integração',
    terms: [],
    system: 'Usui + Shanti',
    crystal: 'Cristal de Quartzo',
    frequency: '432 Hz',
    practice: 'Respiração natural, mãos no corpo e alguns minutos apenas percebendo o que está presente.'
  }
];

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
}

function readCurrentProfile(): UserProfile | undefined {
  try {
    const login = localStorage.getItem(CURRENT_LOGIN_KEY);
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return undefined;
    const accounts = JSON.parse(raw) as UserAccount[];
    const account = login ? accounts.find(item => item.login === login) : accounts[0];
    return account?.profile;
  } catch {
    return undefined;
  }
}

function anamnesisText(anamnesis?: AnamnesisData) {
  if (!anamnesis) return '';
  return normalize([
    ...(anamnesis.mainComplaints || []),
    anamnesis.complaintNotes || '',
    ...(anamnesis.emotionalState || []),
    ...(anamnesis.physicalSymptoms || []),
    ...(anamnesis.chakraImbalance || []),
    anamnesis.primaryGoal || '',
    anamnesis.goalDetails || '',
    anamnesis.prescribedFocus || ''
  ].join(' '));
}

function buildInsight(text: string, anamnesis?: AnamnesisData): CareInsight {
  const journal = normalize(text);
  const base = anamnesisText(anamnesis);
  let best = CARE_RULES[CARE_RULES.length - 1];
  let bestScore = 0;

  for (const rule of CARE_RULES.slice(0, -1)) {
    let score = 0;
    for (const term of rule.terms) {
      const normalizedTerm = normalize(term);
      if (journal.includes(normalizedTerm)) score += 3;
      if (base.includes(normalizedTerm)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = rule;
    }
  }

  const anamnesisLine = anamnesis
    ? [
        anamnesis.prescribedFocus ? `foco da anamnese: ${anamnesis.prescribedFocus}` : '',
        anamnesis.chakraImbalance?.length ? `centros em atenção: ${anamnesis.chakraImbalance.join(', ')}` : '',
        anamnesis.recommendedFrequency ? `frequência já indicada: ${anamnesis.recommendedFrequency.replace('hz', ' Hz')}` : ''
      ].filter(Boolean).join(' · ')
    : undefined;

  return {
    ...best,
    reason: bestScore > 0
      ? `O registro de hoje aponta principalmente para ${best.label.toLocaleLowerCase('pt-BR')}.`
      : 'Seu registro de hoje não mostra um padrão dominante; por isso a sugestão permanece simples e voltada à presença.',
    anamnesisLine
  };
}

function ensureStyles() {
  if (document.getElementById('ep-personal-care-integration-styles')) return;
  const style = document.createElement('style');
  style.id = 'ep-personal-care-integration-styles';
  style.textContent = `
    #ep-diary-care-bridge{position:relative;border:1px solid rgba(184,135,54,.28);background:linear-gradient(180deg,rgba(255,253,247,.98),rgba(248,241,224,.96));border-radius:20px;padding:16px;box-shadow:0 10px 28px rgba(68,55,35,.08);color:#2A2420}
    #ep-diary-care-bridge .ep-care-kicker{font:700 10px/1.4 Inter,sans-serif;letter-spacing:.13em;text-transform:uppercase;color:#71511c;margin:0 0 5px}
    #ep-diary-care-bridge h3{font:600 20px/1.2 Georgia,serif;color:#26372a;margin:0 0 8px}
    #ep-diary-care-bridge p{font:400 12px/1.65 Inter,sans-serif;color:#5c5248;margin:0}
    #ep-diary-care-bridge .ep-care-context{margin-top:10px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.72);border:1px solid #e5dac6}
    #ep-diary-care-bridge .ep-care-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
    #ep-diary-care-bridge .ep-care-item{padding:11px;border-radius:14px;background:#fffaf0;border:1px solid #e5dac6}
    #ep-diary-care-bridge .ep-care-item span{display:block;font:700 9px/1.3 Inter,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#71511c;margin-bottom:4px}
    #ep-diary-care-bridge .ep-care-item strong{display:block;font:600 12px/1.45 Inter,sans-serif;color:#26372a}
    #ep-diary-care-bridge .ep-care-practice{margin-top:10px;padding:12px;border-radius:14px;background:#f1e7c8;border:1px solid #d9c58f}
    #ep-diary-care-bridge .ep-care-note{margin-top:10px;font-size:10px;color:#6b6d61}
    .ep-courses-locked{opacity:.66!important;cursor:not-allowed!important;position:relative!important}
    .ep-courses-locked::after{content:'Em preparação';margin-left:auto;padding:4px 8px;border-radius:999px;border:1px solid #d9c58f;background:#fffaf0;color:#71511c;font:700 9px/1 Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase}
    @media(max-width:520px){#ep-diary-care-bridge .ep-care-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
}

function journalTextFromModal(modal: HTMLElement) {
  const editor = modal.querySelector<HTMLTextAreaElement>('textarea[placeholder*="percepções"]');
  if (editor?.value.trim()) return editor.value.trim();
  const candidates = Array.from(modal.querySelectorAll<HTMLElement>('p.whitespace-pre-wrap'));
  const saved = candidates.map(item => item.textContent?.trim() || '').find(text => text && !text.startsWith('Nenhuma reflexão'));
  return saved || '';
}

function renderDiaryBridge() {
  const modal = document.getElementById('daily-diary-modal');
  if (!modal) return;
  const scroll = modal.querySelector<HTMLElement>('.flex-1.min-h-0.overflow-y-auto');
  if (!scroll) return;

  let card = document.getElementById('ep-diary-care-bridge');
  if (!card) {
    card = document.createElement('section');
    card.id = 'ep-diary-care-bridge';
    card.setAttribute('aria-live', 'polite');
    scroll.appendChild(card);
  }

  const profile = readCurrentProfile();
  const anamnesis = profile?.anamnesis;
  const journal = journalTextFromModal(modal);

  if (!journal) {
    const next = `
      <p class="ep-care-kicker">Diário + Anamnese Energética</p>
      <h3>Leitura integrada do seu momento</h3>
      <p>Escreva seu registro do dia primeiro. Depois de salvar, esta área cruza o que apareceu no diário com ${anamnesis ? 'a sua anamnese energética já preenchida' : 'a sua anamnese energética, quando estiver preenchida'} e organiza uma sugestão prática de cuidado.</p>
      <div class="ep-care-note">A escrita vem primeiro. A leitura só aparece depois, sem interromper o seu desabafo.</div>`;
    if (card.innerHTML !== next) card.innerHTML = next;
    return;
  }

  const insight = buildInsight(journal, anamnesis);
  const context = anamnesis
    ? `<div class="ep-care-context"><p><strong>Anamnese energética:</strong> ${insight.anamnesisLine || 'registro preenchido e considerado nesta leitura.'}</p></div>`
    : `<div class="ep-care-context"><p><strong>Anamnese energética:</strong> ainda não preenchida. A sugestão abaixo considera apenas o diário de hoje. Você pode completar a anamnese pelo menu do app.</p></div>`;

  const next = `
    <p class="ep-care-kicker">Diário + Anamnese Energética</p>
    <h3>Leitura integrada do seu momento</h3>
    <p>${insight.reason}</p>
    ${context}
    <div class="ep-care-grid">
      <div class="ep-care-item"><span>Sistema sugerido</span><strong>${insight.system}</strong></div>
      <div class="ep-care-item"><span>Cristais</span><strong>${insight.crystal}</strong></div>
      <div class="ep-care-item"><span>Frequência</span><strong>${insight.frequency}</strong></div>
      <div class="ep-care-item"><span>Foco de hoje</span><strong>${insight.label}</strong></div>
    </div>
    <div class="ep-care-practice"><p><strong>Como aplicar hoje:</strong> ${insight.practice}</p></div>
    <div class="ep-care-note">Sugestão de autocuidado baseada no seu próprio registro e, quando disponível, na anamnese energética. Não substitui avaliação médica ou psicológica.</div>`;
  if (card.innerHTML !== next) card.innerHTML = next;
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

function relabelEnergeticAnamnesis() {
  const root = document.querySelector<HTMLElement>('.ns-app');
  if (!root) return;
  const elements = Array.from(root.querySelectorAll<HTMLElement>('strong,h2,h3,span'));
  for (const element of elements) {
    const text = element.textContent?.trim();
    if (text === 'Anamnese / Teste' || text === 'Como estou?') element.textContent = 'Anamnese Energética';
    if (text === 'Olhar meu momento' && element.parentElement?.textContent?.includes('Anamnese Energética')) element.textContent = 'Mapear meu momento';
  }
}

export function installPersonalCareIntegration() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  ensureStyles();

  let timer = 0;
  const refresh = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      renderDiaryBridge();
      lockCoursesInNaturalSereno();
      relabelEnergeticAnamnesis();
    }, 60);
  };

  const observer = new MutationObserver(refresh);
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  document.addEventListener('input', refresh, true);
  document.addEventListener('change', refresh, true);
  document.addEventListener('click', refresh, true);
  refresh();
}

installPersonalCareIntegration();
