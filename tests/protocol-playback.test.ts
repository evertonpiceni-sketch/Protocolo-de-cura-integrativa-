import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { normalizeProtocolProgress, normalizeSpeechElapsedTime, protocolBreathPhaseAt, protocolBreathTransitionSeconds } from '../src/utils/protocolPlayback';
import { DAILY_INSIGHTS } from '../src/types';
import { DISTANCE_TREATMENT_SCRIPT } from '../src/data/protocol_scripts';

test('keeps modern Web Speech elapsedTime in seconds and protects legacy millisecond values', () => {
  assert.equal(normalizeSpeechElapsedTime(26.184), 26.184);
  assert.equal(normalizeSpeechElapsedTime(26_184), 26.184);
  assert.deepEqual(normalizeProtocolProgress(26.184, 0), { current: 26.184, duration: 0 });
  assert.deepEqual(normalizeProtocolProgress(26_184, 0), { current: 26.184, duration: 0 });
  assert.deepEqual(normalizeProtocolProgress(42.5, 180), { current: 42.5, duration: 180 });
});

test('keeps the canonical visual breathing cadence at 4 inhale, 3 hold and 5 exhale', () => {
  assert.equal(protocolBreathPhaseAt(0), 'inhale');
  assert.equal(protocolBreathPhaseAt(3.99), 'inhale');
  assert.equal(protocolBreathPhaseAt(4), 'hold');
  assert.equal(protocolBreathPhaseAt(6.99), 'hold');
  assert.equal(protocolBreathPhaseAt(7), 'exhale');
  assert.equal(protocolBreathPhaseAt(11.99), 'exhale');
  assert.equal(protocolBreathTransitionSeconds('inhale'), 4);
  assert.equal(protocolBreathTransitionSeconds('hold'), 3);
  assert.equal(protocolBreathTransitionSeconds('exhale'), 5);
});

test('production protocol player keeps 4-3-5 cadence and the startup audio integrity layer is loaded', () => {
  const session = fs.readFileSync('src/components/MeditationSession.tsx', 'utf8');
  const main = fs.readFileSync('src/main.tsx', 'utf8');
  const integrity = fs.readFileSync('src/lib/audioIntegrityPatch.ts', 'utf8');
  assert.ok(session.includes("position < 4 ? 'inhale' : position < 7 ? 'hold' : 'exhale'"), 'breathing phase boundaries must remain 4-3-5');
  assert.ok(session.includes("breathePhase === 'hold' ? 3 : 5"), 'visual transition must use a 3-second hold');
  assert.ok(main.includes("./lib/audioIntegrityPatch"), 'audio integrity patch must load before the app');
  assert.ok(integrity.includes('normalizeSpeechElapsedTime(current)'), 'native speech elapsed time must be normalized at the audio boundary');
});

test('the 21-day journey exposes a distinct daily title instead of one repeated day label', () => {
  assert.equal(DAILY_INSIGHTS.length, 21);
  const titles = DAILY_INSIGHTS.map(day => day.title.trim());
  assert.equal(new Set(titles).size, 21);
});

test('approved Miguel, Violet Flame and Rafael scripts remain available for playback', () => {
  assert.match(DISTANCE_TREATMENT_SCRIPT.MIGUEL.title, /São Miguel/i);
  assert.match(DISTANCE_TREATMENT_SCRIPT.VIOLETA.title, /Chama Violeta/i);
  assert.match(DISTANCE_TREATMENT_SCRIPT.RAFAEL.title, /São Rafael/i);
  assert.ok(DISTANCE_TREATMENT_SCRIPT.MIGUEL.ttsScript.length > 200);
  assert.ok(DISTANCE_TREATMENT_SCRIPT.VIOLETA.ttsScript.length > 200);
  assert.ok(DISTANCE_TREATMENT_SCRIPT.RAFAEL.ttsScript.length > 200);
});

test('sacred animation remains semantically mapped to the six narrated protocol stages', () => {
  const canvas = fs.readFileSync('src/components/session/SacredEnergyCanvas.tsx', 'utf8');
  const expectations = [
    ['ProtocolStage.ABERTURA', 'gold'],
    ['ProtocolStage.ATERRAMENTO', 'Roots'],
    ['ProtocolStage.VITALIDADE', 'Kundalini'],
    ['ProtocolStage.TRANSMUTACAO', 'Violet Flame'],
    ['ProtocolStage.BALSAMO', 'São Rafael'],
    ['ProtocolStage.SELAMENTO', 'Ganesha']
  ] as const;
  for (const [stage, visualCue] of expectations) {
    assert.ok(canvas.includes(stage), `missing visual branch for ${stage}`);
    assert.ok(canvas.toLowerCase().includes(visualCue.toLowerCase()), `missing visual cue ${visualCue}`);
  }
});

test('Arcanjo flow reads approved scripts and exact Solfeggio presets are enforced at the audio boundary', () => {
  const arcanjo = fs.readFileSync('src/components/ArcanjoProtocolView.tsx', 'utf8');
  const integrity = fs.readFileSync('src/lib/audioIntegrityPatch.ts', 'utf8');
  const tone = fs.readFileSync('src/lib/solfeggioTone.ts', 'utf8');
  assert.ok(arcanjo.includes('DISTANCE_TREATMENT_SCRIPT'));
  assert.ok(arcanjo.includes('audioEngine.startSynth(`${config.freq}hz`)'));
  assert.ok(arcanjo.includes('APPROVED_SECTIONS.map(section => section.ttsScript)'));
  assert.ok(integrity.includes('solfeggioTone.start(Number(match[1]))'));
  assert.ok(integrity.includes('solfeggioTone.stop()'));
  assert.ok(tone.includes('oscillator.frequency.setValueAtTime(frequency'));
});
