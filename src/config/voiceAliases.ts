export const MISTICO_MODERNO_OFFICIAL_VOICE_ALIAS = 'mistico-moderno-oficial';

const LEGACY_VOICE_IDS = new Set([
  'rachel',
  'marcus',
  'marianne',
  'sofia',
  '21m00tcm4tlvdq8ikwam',
  'npczcjzi2devnbz1zqrb',
  'mjqp14jqfek0pojr5lfv'
]);

export function resolveMisticoModernoOfficialVoiceId(configuredVoiceId?: string | null): string | null {
  const normalized = configuredVoiceId?.trim();
  if (!normalized || !/^[A-Za-z0-9_-]{8,128}$/.test(normalized)) return null;
  if (LEGACY_VOICE_IDS.has(normalized.toLowerCase())) return null;
  return normalized;
}
