import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('Mapa Astral do Estilo 3 remove verde profundo e amarelo herdados sem vazar para outros estilos', () => {
  const css = read('src/essencia-luminosa-shared-modals-audit.css');
  const main = read('src/main.tsx');

  assert.ok(main.indexOf("import './essencia-luminosa-shared-modals-audit.css';") >
    main.indexOf("import './essencia-luminosa-journal-dashboard-audit.css';"));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #astral-map-modal'));
  assert.ok(css.includes('[class*="bg-[#073b2b]"]'));
  assert.ok(css.includes('[class*="text-[#f2dda4]"]'));
  assert.ok(css.includes('[class*="bg-amber-"]'));
  assert.ok(css.includes('[class*="text-amber-"]'));
  assert.ok(css.includes('[class*="bg-emerald-"]'));
  assert.ok(css.includes('a[class*="bg-emerald-700"]'));
  assert.ok(css.includes('var(--layout-gold-gradient)'));
  assert.ok(!/data-layout="(natural-sereno|elegancia-profunda|mistico-moderno)"/.test(css));
});

test('Ajustes de Áudio do Estilo 3 usam tokens atuais em vez do ouro antigo', () => {
  const css = read('src/essencia-luminosa-shared-modals-audit.css');
  const settings = read('src/components/AudioSettingsModal.tsx');

  assert.ok(css.includes('#audio-settings-modal > div'));
  assert.ok(css.includes('#bioactive-tuning-panel'));
  assert.ok(css.includes('var(--layout-gold-soft)'));
  assert.ok(css.includes('var(--layout-gold-gradient)'));
  assert.ok(settings.includes('id="audio-settings-modal"'));
  assert.ok(settings.includes('const isEssenciaLuminosa ='));
});

test('A seleção de frequências fica bloqueada durante a prévia neural da Essência Luminosa', () => {
  const settings = read('src/components/AudioSettingsModal.tsx');

  assert.ok(settings.includes('const isTrackBlockedDuringVoicePreview = (isEssenciaLuminosa && isTestingVoice) || isStyle2SolfeggioBlocked;'));
  assert.ok(settings.includes('disabled={isTrackBlockedDuringVoicePreview}'));
  assert.ok(settings.includes('aria-disabled={isTrackBlockedDuringVoicePreview}'));
  assert.ok(settings.includes('if (isTrackBlockedDuringVoicePreview) return;'));
  assert.ok(settings.includes('Aguarde a prévia da voz terminar para alterar a frequência.'));
});
