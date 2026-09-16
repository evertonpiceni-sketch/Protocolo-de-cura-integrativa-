import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'node:crypto';
import { ElevenLabsClient } from 'elevenlabs';
import { ORIGINAL_PROTOCOL_SCRIPTS } from '../src/data/protocol_scripts.js';

const PROTOCOL_VOICE = Object.freeze({
  voiceId: 'mJqP14JQFEK0PojR5lfV',
  modelId: 'eleven_multilingual_v2',
  stability: 0.46,
  similarityBoost: 0.8,
  style: 0.06,
  speed: 0.9,
  useSpeakerBoost: true,
});

const cache = new Map<string, Buffer>();
const BREAK_RE = /<break\s+time=["']([\d.]+)s["']\s*\/>/gi;

const getSegments = (script: string) => {
  const segments: Array<{ text: string; pauseMs: number }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  BREAK_RE.lastIndex = 0;
  while ((match = BREAK_RE.exec(script)) !== null) {
    const text = script.slice(lastIndex, match.index).trim();
    if (text) segments.push({ text, pauseMs: Math.round(Number(match[1]) * 1000) });
    lastIndex = BREAK_RE.lastIndex;
  }
  const tail = script.slice(lastIndex).trim();
  if (tail) segments.push({ text: tail, pauseMs: 0 });
  return segments;
};

const cacheKeyFor = (stageId: string, segmentIndex: number, text: string) =>
  createHash('sha256')
    .update(`${PROTOCOL_VOICE.voiceId}:${PROTOCOL_VOICE.modelId}:${stageId}:${segmentIndex}:\n${text}`)
    .digest('hex');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });

  try {
    const stageId = typeof req.body?.stageId === 'string' ? req.body.stageId : '';
    const segmentIndex = Number(req.body?.segmentIndex);
    const userName = typeof req.body?.userName === 'string'
      ? req.body.userName.trim().slice(0, 100)
      : '';

    const stage = ORIGINAL_PROTOCOL_SCRIPTS[stageId];
    if (!stage?.ttsScript || !Number.isInteger(segmentIndex) || segmentIndex < 0) {
      return res.status(400).json({ error: 'Trecho inválido.' });
    }

    const segments = getSegments(stage.ttsScript);
    const selected = segments[segmentIndex];
    if (!selected) return res.status(404).json({ error: 'Trecho não encontrado.' });

    const text = selected.text
      .replace(/\[NOME\]/g, userName || 'você')
      .replace(/<[^>]+>/g, '')
      .trim();

    const cacheKey = cacheKeyFor(stageId, segmentIndex, text);
    const cached = cache.get(cacheKey);
    if (cached) {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
      res.setHeader('X-Protocol-Voice', PROTOCOL_VOICE.voiceId);
      res.setHeader('X-Pause-After-Ms', String(selected.pauseMs));
      res.setHeader('X-Protocol-Audio-Cache', 'HIT');
      return res.send(cached);
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) return res.status(503).json({ error: 'Voz neural indisponível.' });

    const client = new ElevenLabsClient({ apiKey });
    const audioStream = await client.generate({
      voice: PROTOCOL_VOICE.voiceId,
      model_id: PROTOCOL_VOICE.modelId,
      text,
      voice_settings: {
        stability: PROTOCOL_VOICE.stability,
        similarity_boost: PROTOCOL_VOICE.similarityBoost,
        style: PROTOCOL_VOICE.style,
        speed: PROTOCOL_VOICE.speed,
        use_speaker_boost: PROTOCOL_VOICE.useSpeakerBoost,
      },
    } as any);

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream as any) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);
    if (!buffer.length) throw new Error('ElevenLabs retornou áudio vazio.');

    if (cache.size > 240) cache.delete(cache.keys().next().value as string);
    cache.set(cacheKey, buffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
    res.setHeader('X-Protocol-Voice', PROTOCOL_VOICE.voiceId);
    res.setHeader('X-Pause-After-Ms', String(selected.pauseMs));
    res.setHeader('X-Protocol-Audio-Cache', 'MISS');
    return res.send(buffer);
  } catch (error: any) {
    console.error('Protocol TTS:', error?.message || error);
    return res.status(500).json({ error: 'Não foi possível preparar a condução de voz.' });
  }
}
