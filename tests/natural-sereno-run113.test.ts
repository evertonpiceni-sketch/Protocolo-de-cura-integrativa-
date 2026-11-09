import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Anamnese Natural Sereno não exibe mais progresso índigo/verde nem waveform púrpura', () => {
  const component = read('src/components/AnamnesisModal.tsx');
  const css = read('src/natural-sereno-approved-overrides.css');
  const main = read('src/main.tsx');

  assert.ok(component.includes('ep-anamnesis-waveform flex items-center gap-1.5 h-7 pt-1 px-1'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] #anamnesis-modal .ep-anamnesis-progress-fill {'));
  assert.ok(css.includes('linear-gradient(90deg,#A87E37 0%,#C89D52 58%,#E2B96B 100%) !important;'));
  assert.ok(css.includes('#anamnesis-modal .ep-anamnesis-waveform > div[class*="from-indigo-500"]'));
  assert.ok(css.includes('linear-gradient(to top,#A87E37,#E2B96B) !important;'));

  const baseImport = main.indexOf("import './natural-sereno.css';");
  const approvedImport = main.indexOf("import './natural-sereno-approved-overrides.css';");
  assert.ok(baseImport >= 0 && approvedImport > baseImport, 'A camada aprovada deve vencer as utilidades antigas.');
});

test('CTAs da recomendação da Anamnese usam ouro refinado e ação secundária marfim', () => {
  const css = read('src/natural-sereno-approved-overrides.css');

  assert.ok(css.includes('.ep-assessment-actions :is(button,a)[class*="from-amber-500"]'));
  assert.ok(css.includes('background-image: linear-gradient(180deg,#E2B96B,#C89D52) !important;'));
  assert.ok(css.includes('.ep-assessment-actions :is(button,a)[class*="bg-emerald-600"]'));
  assert.ok(css.includes('background-image: linear-gradient(180deg,#FBF8F2,#F3E8D5) !important;'));
  assert.ok(css.includes('border-radius: 18px !important;'));
  assert.ok(css.includes('.ep-assessment-actions :is(button,a):focus-visible'));
});
