import crypto from 'node:crypto';

export function prepareTherapeuticSSML(text: string): string {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  // Canonical scripts already specify their pauses. Do not add a second cadence.
  if (/<break\s+time=["'][\d.]+s["']\s*\/>/i.test(normalized)) return normalized;
  return normalized
    .replace(/\n{2,}/g, ' <break time="1.5s" /> ')
    .replace(/([.!?])\s+/g, '$1 <break time="0.9s" /> ')
    .replace(/([;:])\s+/g, '$1 <break time="0.5s" /> ')
    .replace(/,\s+/g, ', <break time="0.3s" /> ')
    .replace(/\s{2,}/g, ' ').trim();
}
export function protocolAudioCacheKey(voice: string, speed: number, text: string): string {
  return `stream_${crypto.createHash('sha256').update(JSON.stringify([voice, speed, text])).digest('hex')}`;
}
