import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'node:crypto';
import { ElevenLabsClient } from 'elevenlabs';
import { REINTEGRATION_DAYS } from '../src/data/reintegrationJourneyPublic.js';

// Voz oficial aprovada para a Jornada Reintegração da Vida.
// Manter estes parâmetros fixos evita variações entre os 21 dias.
const REINTEGRATION_VOICE = Object.freeze({
  voiceId: '21m00Tcm4TlvDq8ikWAM',
  modelId: 'eleven_multilingual_v2',
  stability: 0.46,
  similarityBoost: 0.8,
  style: 0.08,
  useSpeakerBoost: true,
});

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

const cacheKeyFor = (text: string) => {
  const voiceSignature = `${REINTEGRATION_VOICE.voiceId}:${REINTEGRATION_VOICE.modelId}:${REINTEGRATION_VOICE.stability}:${REINTEGRATION_VOICE.similarityBoost}:${REINTEGRATION_VOICE.style}:${REINTEGRATION_VOICE.useSpeakerBoost}`;
  return createHash('sha256').update(`${voiceSignature}\n${text}`).digest('hex');
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  try {
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    if (!text || !allowedCues.has(text)) return res.status(403).json({ error: 'Trecho não autorizado para esta jornada.' });

    const cacheKey = cacheKeyFor(text);
    const cached = cache.get(cacheKey);
    if (cached) {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
      res.setHeader('X-Reintegration-Voice', REINTEGRATION_VOICE.voiceId);
      res.setHeader('X-Reintegration-Audio-Cache', 'HIT');
      return res.send(cached);
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) return res.status(503).json({ error: 'Voz neural indisponível.' });

    const client = new ElevenLabsClient({ apiKey });
    const audioStream = await client.generate({
      voice: REINTEGRATION_VOICE.voiceId,
      model_id: REINTEGRATION_VOICE.modelId,
      text: prepareTherapeuticText(text),
      voice_settings: {
        stability: REINTEGRATION_VOICE.stability,
        similarity_boost: REINTEGRATION_VOICE.similarityBoost,
        style: REINTEGRATION_VOICE.style,
        use_speaker_boost: REINTEGRATION_VOICE.useSpeakerBoost,
      },
    });

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream as any) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    const buffer = Buffer.concat(chunks);
    if (!buffer.length) throw new Error('ElevenLabs retornou áudio vazio.');

    if (cache.size > 160) cache.delete(cache.keys().next().value as string);
    cache.set(cacheKey, buffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    // O CDN pode reutilizar o MP3 já sintetizado sem nova chamada ao TTS enquanto o texto e a voz forem idênticos.
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
    res.setHeader('X-Reintegration-Voice', REINTEGRATION_VOICE.voiceId);
    res.setHeader('X-Reintegration-Audio-Cache', 'MISS');
    return res.send(buffer);
  } catch (error: any) {
    console.error('Reintegração TTS:', error?.message || error);
    return res.status(500).json({ error: 'Não foi possível preparar a condução de voz.' });
  }
}
