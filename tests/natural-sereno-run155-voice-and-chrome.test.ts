import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('a Reintegração usa a voz oficial Marianne e nunca a voz Rachel legada', () => {
  const audio = read('src/lib/audio.ts');
  const server = read('server.ts');
  const endpoint = read('api/reintegration-tts.ts');
  const player = read('src/components/PersonalJourney21.tsx');

  const officialVoiceId = 'mJqP14JQFEK0PojR5lfV';
  assert.ok(audio.includes(`OFFICIAL_PROTOCOL_VOICE_ID = '${officialVoiceId}'`));
  assert.ok(server.includes(`OFFICIAL_PROTOCOL_VOICE_ID = "${officialVoiceId}"`));
  assert.ok(endpoint.includes(`voiceId: '${officialVoiceId}'`));
  assert.doesNotMatch(endpoint, /21m00Tcm4TlvDq8ikWAM/);
  assert.ok(endpoint.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(player.includes("fetch('/api/reintegration-tts'"));
  assert.doesNotMatch(player, /SpeechSynthesisUtterance|window\.speechSynthesis/);
});

test('o shell de carregamento mantém creme e dourado refinado, sem o ocre antigo', () => {
  const app = read('src/App.tsx');
  const start = app.indexOf('const loadingScreen =');
  const end = app.indexOf('if (isLoadingAuth) return loadingScreen;', start);
  assert.ok(start >= 0 && end > start);
  const shell = app.slice(start, end);
  assert.ok(shell.includes('bg-[#FAF7F2]'));
  assert.ok(shell.includes('text-[#A87E37]'));
  assert.doesNotMatch(shell, /#F8F4EC|#8F631E/);
});

test('toast do Natural Sereno usa superfície clara e contraste café/dourado', () => {
  const app = read('src/App.tsx');
  const css = read('src/natural-sereno-approved-overrides.css');
  assert.ok(app.includes('className="ep-app-toast'));
  const start = css.indexOf('/* RUN 155 — Toast do Natural Sereno');
  assert.ok(start >= 0);
  const block = css.slice(start);
  assert.ok(block.includes(':root[data-layout="natural-sereno"] .ep-app-toast'));
  assert.ok(block.includes('background: linear-gradient(145deg,#FFFDF8 0%,#FAF7F2 62%,#F3EBDD 100%) !important;'));
  assert.ok(block.includes('color: #2A2421 !important;'));
  assert.ok(block.includes('color: #6B625B !important;'));
  assert.doesNotMatch(block, /from-indigo|purple|bg-amber-950/);
});

test('seletor continua sem pré-seleção e exige confirmação explícita dos quatro estilos', () => {
  const chooser = read('src/components/LayoutChoiceModal.tsx');
  const app = read('src/App.tsx');
  assert.ok(chooser.includes('useState<LayoutId | null>(null)'));
  assert.ok(chooser.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(chooser.includes('await onSelect(selectedLayout)'));
  assert.ok(chooser.includes('OFFICIAL_LAYOUTS.map(layout'));
  assert.ok(app.includes('!layoutConfirmedThisSession || layoutChoiceRequested'));
});
