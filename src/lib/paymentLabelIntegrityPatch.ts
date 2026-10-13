import { UI_TRANSLATIONS } from './i18n';

// O valor da prática individual varia conforme o ciclo selecionado. Rótulos antigos
// com preço fixo induziam o usuário a um valor diferente do checkout real.
const labels = {
  pt: 'Prática Individual',
  en: 'Individual Practice',
  es: 'Práctica Individual',
  fr: 'Pratique Individuelle',
  it: 'Pratica Individuale',
  de: 'Individuelle Praxis',
} as const;

for (const [language, label] of Object.entries(labels)) {
  if (UI_TRANSLATIONS[language as keyof typeof UI_TRANSLATIONS]) {
    UI_TRANSLATIONS[language as keyof typeof UI_TRANSLATIONS].specificTreatment = label;
  }
}
