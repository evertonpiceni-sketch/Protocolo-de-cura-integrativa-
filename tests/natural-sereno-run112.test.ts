import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const chooser = readFileSync(new URL('../src/components/LayoutChoiceModal.tsx', import.meta.url), 'utf8');
const layouts = readFileSync(new URL('../src/config/layouts.ts', import.meta.url), 'utf8');

function section(source: string, startMarker: string, endMarker: string) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  return start >= 0 && end > start ? source.slice(start, end) : '';
}

test('conclusão de sessão grava o mesmo snapshot no cache local antes da sincronização remota', () => {
  const handler = section(app, 'const handleCompleteSession', '// Factory reset utility');
  assert.ok(handler.includes('updateLocalAccountCache(updatedProfile, updatedProgress)'));
  assert.ok(handler.indexOf('updateLocalAccountCache(updatedProfile, updatedProgress)') < handler.indexOf('syncUserState('));
});

test('reinício da jornada atualiza o cache local com o perfil e os 21 dias zerados', () => {
  const handler = section(app, 'const handleResetProgram', '// Log out the current user');
  assert.ok(handler.includes('updateLocalAccountCache(updatedProfile, defaultProgress)'));
  assert.ok(handler.indexOf('updateLocalAccountCache(updatedProfile, defaultProgress)') < handler.indexOf('syncUserState('));
});

test('prévia Natural Sereno mostra a paisagem e paleta atuais, mantendo a prancha como referência subordinada', () => {
  const start = chooser.indexOf('if (isNaturalSereno) {');
  const end = chooser.indexOf("if (layout.id === 'elegancia-profunda') {", start);
  const preview = start >= 0 && end > start ? chooser.slice(start, end) : '';

  assert.ok(preview.includes('/brand/natural-sereno/vale-amanhecer.webp'));
  assert.ok(preview.includes('NATURAL_SERENO_OFFICIAL_BOARD'));
  assert.ok(preview.includes('Prancha oficial de referência. Decisões posteriores prevalecem.'));
  const actionStart = preview.indexOf('className="shrink-0 rounded-[18px]');
  const actionEnd = preview.indexOf('Iniciar jornada', actionStart);
  const action = actionStart >= 0 && actionEnd > actionStart ? preview.slice(actionStart, actionEnd) : '';
  assert.ok(action, 'O CTA da prévia deve manter cantos premium de 18px.');
  assert.doesNotMatch(action, /rounded-full/);
  for (const color of ['#FAF7F2', '#F5EFE5', '#2A2421', '#C89D52', '#6F7B55']) {
    assert.ok(preview.includes(color), `A prévia deve exibir o token aprovado ${color}.`);
  }
});

test('swatches do seletor coincidem com o acento sálvia aprovado do Natural Sereno', () => {
  assert.ok(layouts.includes("swatches: ['#FAF7F2', '#2A2421', '#C89D52', '#6F7B55']"));
});

test('o seletor continua sem pré-seleção e só confirma após escolha explícita', () => {
  assert.ok(chooser.includes('useState<LayoutId | null>(null)'));
  assert.ok(chooser.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(chooser.includes('O estilo só será aplicado depois da sua confirmação.'));
});

test('Arcanjo interrompe a sequência e expõe erro quando um bloco neural falha', () => {
  const arcanjo = readFileSync(new URL('../src/components/ArcanjoProtocolView.tsx', import.meta.url), 'utf8');
  const start = arcanjo.indexOf('const playChunk');
  const end = arcanjo.indexOf('const start = () =>', start);
  const handler = start >= 0 && end > start ? arcanjo.slice(start, end) : '';
  assert.ok(handler.includes('onError: () =>'));
  assert.ok(handler.includes('setVoiceError(true)'));
  assert.ok(handler.includes('setIsPlaying(false)'));
});

test('cross-tab account changes invalidate a stale private view', () => {
  const authSession = readFileSync(new URL('../src/lib/authSession.ts', import.meta.url), 'utf8');
  assert.match(authSession, /shouldReloadForAccountChange/);
  assert.match(authSession, /changedStorageKey !== null && changedStorageKey !== CURRENT_LOGIN_STORAGE_KEY/);
  assert.match(authSession, /currentLogin !== normalizeAccountLogin\(nextStoredLogin\)/);
  assert.match(app, /window\.addEventListener\('storage', handleAccountStorageChange\)/);
  assert.match(app, /window\.location\.reload\(\)/);
  assert.match(app, /audioEngine\.stopSpeech\(\)[\s\S]*audioEngine\.stopBG\(\)[\s\S]*setNeuralVoicePreviewActive\(false\)/);
});
