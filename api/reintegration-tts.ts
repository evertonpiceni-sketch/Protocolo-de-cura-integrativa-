import { createHash } from 'node:crypto';
import { ElevenLabsClient } from 'elevenlabs';
import { REINTEGRATION_DAYS } from '../src/data/reintegrationJourneyPublic.js';

// A Essência Luminosa usa Marianne; os demais estilos preservam a voz aprovada anteriormente.
type ReintegrationVoiceConfig = {
  voiceId: string;
  modelId: string;
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
};

const DEFAULT_REINTEGRATION_VOICE: Readonly<ReintegrationVoiceConfig> = Object.freeze({
  voiceId: '21m00Tcm4TlvDq8ikWAM',
  modelId: 'eleven_multilingual_v2',
  stability: 0.46,
  similarityBoost: 0.8,
  style: 0.08,
  useSpeakerBoost: true,
});

const ESSENCIA_LUMINOSA_REINTEGRATION_VOICE: Readonly<ReintegrationVoiceConfig> = Object.freeze({
  voiceId: 'mJqP14JQFEK0PojR5lfV',
  modelId: 'eleven_multilingual_v2',
  stability: 0.46,
  similarityBoost: 0.8,
  style: 0.08,
  useSpeakerBoost: true,
});

export function getReintegrationVoice(layout: unknown): Readonly<ReintegrationVoiceConfig> {
  return layout === 'essencia-luminosa'
    ? ESSENCIA_LUMINOSA_REINTEGRATION_VOICE
    : DEFAULT_REINTEGRATION_VOICE;
}

const cache = new Map<string, Buffer>();
const requestAttempts = new Map<string, { count: number; resetAt: number }>();
const allowedCues = new Set(REINTEGRATION_DAYS.flatMap(day => day.audioCues.map(cue => cue.text.trim())));

function allowVoiceAttempt(req: any) {
  const key = String(req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const current = requestAttempts.get(key);
  if (!current || current.resetAt <= now) {
    requestAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (current.count >= 90) return false;
  current.count += 1;
  return true;
}

const prepareTherapeuticText = (text: string) => text
  .replace(/\r\n/g, '\n')
  .replace(/\n{2,}/g, ' <break time="1.25s" /> ')
  .replace(/([.!?])\s+/g, '$1 <break time="0.72s" /> ')
  .replace(/([;:])\s+/g, '$1 <break time="0.42s" /> ')
  .replace(/,\s+/g, ', <break time="0.22s" /> ')
  .replace(/\s{2,}/g, ' ')
  .trim();

const cacheKeyFor = (text: string, voice: Readonly<ReintegrationVoiceConfig>) => {
  const voiceSignature = `${voice.voiceId}:${voice.modelId}:${voice.stability}:${voice.similarityBoost}:${voice.style}:${voice.useSpeakerBoost}`;
  return createHash('sha256').update(`${voiceSignature}\n${text}`).digest('hex');
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  if (!allowVoiceAttempt(req)) return res.status(429).json({ error: 'Limite temporário de voz atingido.', fallbackToSpeechSynthesis: false });
  try {
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    if (!text || !allowedCues.has(text)) return res.status(403).json({ error: 'Trecho não autorizado para esta jornada.' });

    const voice = getReintegrationVoice(req.body?.layout);
    const cacheKey = cacheKeyFor(text, voice);
    const cached = cache.get(cacheKey);
    if (cached) {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
      res.setHeader('X-Reintegration-Voice', voice.voiceId);
      res.setHeader('X-Reintegration-Audio-Cache', 'HIT');
      return res.send(cached);
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) return res.status(503).json({ error: 'Voz neural indisponível.', fallbackToSpeechSynthesis: false });

    const client = new ElevenLabsClient({ apiKey });
    const audioStream = await client.generate({
      voice: voice.voiceId,
      model_id: voice.modelId,
      text: prepareTherapeuticText(text),
      voice_settings: {
        stability: voice.stability,
        similarity_boost: voice.similarityBoost,
        style: voice.style,
        use_speaker_boost: voice.useSpeakerBoost,
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
    res.setHeader('X-Reintegration-Voice', voice.voiceId);
    res.setHeader('X-Reintegration-Audio-Cache', 'MISS');
    return res.send(buffer);
  } catch (error: any) {
    const statusCode = Number(error?.statusCode || error?.status || error?.response?.status || 0);
    if (statusCode === 402 || statusCode === 429) {
      console.warn('Reintegração TTS temporariamente indisponível; fallback para voz do dispositivo permanece proibido.', statusCode);
      return res.status(503).json({
        error: 'Voz neural temporariamente indisponível.',
        fallbackToSpeechSynthesis: false
      });
    }
    console.error('Reintegração TTS:', error?.message || error);
    return res.status(500).json({
      error: 'Não foi possível preparar a condução de voz.',
      fallbackToSpeechSynthesis: false
    });
  }
}
