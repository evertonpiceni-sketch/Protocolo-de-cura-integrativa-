export const MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS = 'mistico-moderno-oficial' as const;

const LEGACY_VOICE_ALIASES = new Set([
  'rachel',
  'marcus',
  'feminina',
  'masculina',
  'female',
  'male',
  'marianne',
  'sofia',
  'mjqp14jqfek0pojr5lfv',
  '21m00tcm4tlvdq8ikwam',
  'npczcjz2devnbz1zqrb'
]);

export function resolveMisticoModernoOfficialVoiceId(configuredVoiceId?: string | null): string | null {
  const normalized = configuredVoiceId?.trim();
  if (!normalized || LEGACY_VOICE_ALIASES.has(normalized.toLowerCase())) return null;
  return normalized;
}
