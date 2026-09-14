import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ElevenLabsClient } from 'elevenlabs';
import { REINTEGRATION_DAYS } from '../src/data/reintegrationJourneyPublic.js';

const cache = new Map<string, Buffer>();
const allowedCues = new Set(REINTEGRATION_DAYS.flatMap(day => day.audioCues.map(cue => cue.text.trim())));

const prepareTherapeuticText = (text: string) => text
  .replace(/\r\n/g, '\n')
  .replace(/\n{2,}/g, ' <break time="1.25s" /> ')
  .replace(/([.!?])\s+/g, '$1 <break time="0.72s" /> ')
  .replace(/([;:])\s+/g, '$1 <break time="0.42s" /> ')
  .replace(/,\s+/g, ', <break time="0.22s" /> ')
  .replace(/\s{2,}/g, ' ')
  .trim();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  try {
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    if (!text || !allowedCues.has(text)) return res.status(403).json({ error: 'Trecho não autorizado para esta jornada.' });
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) return res.status(503).json({ error: 'Voz neural indisponível.' });
    const cacheKey = `reintegration_${text.length}_${text.slice(0, 80)}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800');
      return res.send(cached);
    }
    const client = new ElevenLabsClient({ apiKey });
    const audioStream = await client.generate({
      voice: '21m00Tcm4TlvDq8ikWAM',
      model_id: 'eleven_multilingual_v2',
      text: prepareTherapeuticText(text),
      voice_settings: { stability: 0.46, similarity_boost: 0.8, style: 0.08, use_speaker_boost: true }
    });
    const chunks: Buffer[] = [];
    for await (const chunk of audioStream as any) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    const buffer = Buffer.concat(chunks);
    if (!buffer.length) throw new Error('ElevenLabs retornou áudio vazio.');
    if (cache.size > 80) cache.delete(cache.keys().next().value as string);
    cache.set(cacheKey, buffer);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800');
    return res.send(buffer);
  } catch (error: any) {
    console.error('Reintegração TTS:', error?.message || error);
    return res.status(500).json({ error: 'Não foi possível preparar a condução de voz.' });
  }
}
