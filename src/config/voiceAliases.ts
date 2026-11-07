export const MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS = 'mistico-moderno-oficial' as const;

// Legacy labels and the former Marianne voice ID are deliberately rejected.
// Style 4 must fail closed rather than silently revive a superseded voice.
const LEGACY_VOICE_ALIASES = new Set([
  'rachel', 'marcus', 'feminina', 'masculina', 'female', 'male', 'marianne', 'sofia',
  'mjqp14jqfek0pojr5lfv'
]);

export function resolveMisticoModernoOfficialVoiceId(configuredVoiceId?: string | null): string | null {
  const normalized = configuredVoiceId?.trim();
  if (!normalized || LEGACY_VOICE_ALIASES.has(normalized.toLowerCase())) return null;
  return normalized;
}
