export const FEATURES = {
  // Etapa 2: infraestrutura pode ser preparada, mas nenhuma UI/rota pública
  // deve ser exposta enquanto esta flag estiver desativada.
  academy: false,

  // Questionário autoral de autoconhecimento. Deve permanecer desativado até
  // conteúdo, UX, revisão de segurança e testes estarem concluídos.
  originalReflectionJourney: false,
} as const;

export type FeatureName = keyof typeof FEATURES;

export function isFeatureEnabled(feature: FeatureName): boolean {
  return FEATURES[feature];
}
