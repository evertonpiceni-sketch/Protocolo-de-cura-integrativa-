import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { getReintegrationVoice } from '../api/reintegration-tts';

const journey = fs.readFileSync('src/components/PersonalJourney21.tsx', 'utf8');
const css = fs.readFileSync('src/essencia-luminosa-approved-overrides.css', 'utf8');
const reintegrationTts = fs.readFileSync('api/reintegration-tts.ts', 'utf8');
const activeApi = fs.readFileSync('api/index.ts', 'utf8');
const vercel = fs.readFileSync('vercel.json', 'utf8');
const run146 = css.slice(css.indexOf('/* RUN 146 — Essência Luminosa: Reintegração da Vida */'));

test('a jornada de 21 dias recebe superfícies claras apenas na Essência Luminosa', () => {
  assert.ok(journey.includes('data-ep-reintegration="true"'));
  assert.ok(journey.includes('data-journey-days="21"'));
  assert.ok(run146.includes(':root[data-layout="essencia-luminosa"] [data-ep-reintegration="true"] .ep-reintegration-panel'));
  assert.ok(run146.includes(':root[data-layout="essencia-luminosa"] [data-ep-reintegration="true"] .ep-reintegration-card'));
  assert.ok(run146.includes('var(--layout-card)'));
  assert.ok(run146.includes('var(--layout-canvas-alt)'));
  assert.ok(!run146.includes('var(--layout-accent-text)'));
});

test('o player da Reintegração preserva a fotografia natural e remove o azul-noturno no Estilo 3', () => {
  assert.ok(journey.includes('const isEssenciaLuminosa ='));
  assert.ok(journey.includes("isEssenciaLuminosa ? 'rgba(42,36,32,.20),rgba(42,36,32,.82)'"));
  assert.ok(journey.includes("url('${dayArtworkUrl}')"));
  assert.ok(run146.includes('[data-ep-reintegration-running="true"]'));
  assert.ok(run146.includes('linear-gradient(180deg, #2A2420, #39322B)'));
});

test('o logo da Reintegração permanece assinatura transparente em desktop e mobile', () => {
  assert.ok(run146.includes('.ep-reintegration-logo img'));
  assert.ok(run146.includes('opacity: .30 !important;'));
  assert.ok(run146.includes('opacity: .26 !important;'));
});

test('todas as regras novas ficam isoladas pelo layout da Essência Luminosa', () => {
  const selectors = run146.split('\n').map(line => line.trim()).filter(line => line.startsWith(':root[data-layout='));
  assert.ok(selectors.length >= 20);
  assert.ok(selectors.every(selector => selector.startsWith(':root[data-layout="essencia-luminosa"]')));
});


test('o fundo de reserva do corpo neutro usa grafite quente no player da Essência Luminosa', () => {
  assert.ok(run146.includes(':root[data-layout="essencia-luminosa"] [data-ep-reintegration-running="true"] .reintegration-presence-visual'));
  assert.ok(run146.includes('linear-gradient(180deg, #39322B, #2A2420)'));
});

test('a Reintegração usa Marianne na Essência Luminosa e preserva a voz dos demais estilos', () => {
  assert.equal(getReintegrationVoice('essencia-luminosa').voiceId, 'mJqP14JQFEK0PojR5lfV');
  // Only Style 3 changes voice; the other three approved styles retain their existing voice.
  assert.equal(getReintegrationVoice('natural-sereno').voiceId, '21m00Tcm4TlvDq8ikWAM');
  assert.equal(getReintegrationVoice('elegancia-profunda').voiceId, '21m00Tcm4TlvDq8ikWAM');
  assert.equal(getReintegrationVoice('mistico-moderno').voiceId, '21m00Tcm4TlvDq8ikWAM');
  assert.ok(journey.includes("layout: isEssenciaLuminosa ? 'essencia-luminosa' : 'default'"));
  assert.ok(reintegrationTts.includes('fallbackToSpeechSynthesis: false'));
});

test('a tela inicial da Reintegração usa fundo claro e a luz transiciona sem alterar o player imersivo', () => {
  const frameCss = fs.readFileSync('src/index.css', 'utf8');
  const visual = fs.readFileSync('src/components/ReintegrationPresenceVisual.tsx', 'utf8');
  const initialScreenSelector = ':root[data-layout="essencia-luminosa"] [data-ep-reintegration="true"] > main .reintegration-presence-visual';
  const frameSelector = ':root[data-layout="essencia-luminosa"] [data-ep-reintegration="true"] .reintegration-presence-frame';

  assert.ok(frameCss.includes('background: #132b2a'), 'o teste documenta a herança global que precisa ser neutralizada no Estilo 3');
  assert.ok(css.includes(initialScreenSelector));
  assert.ok(css.includes('background: linear-gradient(180deg, var(--layout-canvas-alt), var(--layout-card)) !important;'));
  assert.ok(css.includes(frameSelector));
  assert.ok(css.includes('transition: opacity 650ms ease, filter 650ms ease, mask-image 650ms ease, -webkit-mask-image 650ms ease;'));
  assert.ok(visual.includes('reintegrationPresenceWeights(elapsedSeconds)'));
  assert.ok(visual.includes('maskImage:masks'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] [data-ep-reintegration-running="true"] .reintegration-presence-visual'));
  assert.ok(css.includes('linear-gradient(180deg, #39322B, #2A2420)'));

  const reducedMotionStart = css.lastIndexOf('@media (prefers-reduced-motion: reduce)');
  const reducedMotion = css.slice(reducedMotionStart);
  assert.ok(reducedMotion.includes(frameSelector));
  assert.ok(reducedMotion.includes('transition: none !important;'));
});


test('o preview humano do Estúdio de Vídeos não herda o fundo verde global no Estilo 3', () => {
  const videoStudio = fs.readFileSync('src/components/VideoStudioLightModal.tsx', 'utf8');
  const baseCss = fs.readFileSync('src/index.css', 'utf8');
  const frameSelector = ':root[data-layout="essencia-luminosa"] #video-studio-modal .visual-studio-human-frame';
  const visualSelector = ':root[data-layout="essencia-luminosa"] #video-studio-modal .visual-studio-human-frame .reintegration-presence-visual';

  assert.ok(videoStudio.includes('<div className="visual-studio-human-frame"'));
  assert.ok(videoStudio.includes('<ReintegrationPresenceVisual day={day} elapsedSeconds={0}/>'));
  assert.ok(baseCss.includes('background: #132b2a'), 'documenta o fundo global legado neutralizado no preview');
  assert.ok(css.includes(frameSelector));
  assert.ok(css.includes(visualSelector));
  assert.ok(css.includes('background: linear-gradient(180deg, var(--layout-canvas-alt), var(--layout-card)) !important;'));
});


test('a rota ativa da Reintegração usa Marianne na Essência Luminosa sem alterar os demais estilos', () => {
  const start = activeApi.indexOf('async function serveReintegrationVoice');
  const end = activeApi.indexOf('export default async function handler', start);
  const activeRoute = activeApi.slice(start, end);

  assert.ok(activeApi.includes('import { getReintegrationVoice } from "./reintegration-tts.js";'));
  assert.ok(activeRoute.includes('const voice = getReintegrationVoice(req.body?.layout);'));
  assert.ok(activeRoute.includes('reintegration_v6_\u0024{day}_\u0024{voice.voiceId}'));
  assert.ok(activeRoute.includes('voice: voice.voiceId'));
  assert.ok(activeRoute.includes('X-Reintegration-Voice", voice.voiceId'));
  assert.ok(!activeRoute.includes('REINTEGRATION_VOICE_ID'));
  assert.ok(journey.includes("layout: isEssenciaLuminosa ? 'essencia-luminosa' : 'default'"));
  assert.ok(vercel.includes('"source": "/api/:path*"'));
  assert.ok(vercel.includes('"destination": "/api?path=:path*"'));
  assert.equal(getReintegrationVoice('essencia-luminosa').voiceId, 'mJqP14JQFEK0PojR5lfV');
  assert.equal(getReintegrationVoice('natural-sereno').voiceId, '21m00Tcm4TlvDq8ikWAM');
});
