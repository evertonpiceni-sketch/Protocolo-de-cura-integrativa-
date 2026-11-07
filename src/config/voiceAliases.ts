export const MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS = 'mistico-moderno-oficial' as const;

const LEGACY_VOICE_ALIASES = new Set([
  'rachel', 'marcus', 'feminina', 'masculina', 'female', 'male', 'marianne', 'sofia'
]);

export function resolveMisticoModernoOfficialVoiceId(configuredVoiceId?: string | null): string | null {
  const normalized = configuredVoiceId?.trim();
  if (!normalized || LEGACY_VOICE_ALIASES.has(normalized.toLowerCase())) return null;
  return normalized;
}
