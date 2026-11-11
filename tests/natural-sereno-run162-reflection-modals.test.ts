import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Pausa Consciente e Ainda Há Algo em Mim usam o canvas marfim no Natural Sereno', () => {
  const pause = read('src/components/PausaConscienteLight.tsx');
  const reflection = read('src/components/AindaHaAlgoEmMimLight.tsx');
  const css = read('src/natural-sereno-approved-overrides.css');
  const start = css.lastIndexOf('/* RUN 162 — Harmonizar Pausa Consciente e Ainda Há Algo em Mim no Natural Sereno.');
  const block = css.slice(start);

  assert.ok(start >= 0);
  assert.ok(pause.includes('aria-label="Filtrar pela duração"'));
  assert.ok(reflection.includes('Ainda Há Algo em Mim'));
  assert.ok(block.includes('[data-ep-reintegration-modal="true"] > div[class*="bg-[#F8F4EC]"]'));
  assert.ok(block.includes('background: #FAF7F2 !important;'));
  assert.ok(block.includes('color: #8A642E !important;'));
});

test('filtros e CTAs da Reintegração deixam o ocre antigo, texto branco e formato de pílula', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const block = css.slice(css.lastIndexOf('/* RUN 162 — Harmonizar Pausa Consciente e Ainda Há Algo em Mim no Natural Sereno.'));

  assert.ok(block.includes('[aria-label="Filtrar pela duração"] button[aria-pressed="true"]'));
  assert.ok(block.includes('button[class*="from-[#D6A756]"]'));
  assert.ok(block.includes('border-radius: 12px !important;'));
  assert.ok(block.includes('color: #2A2421 !important;'));
  assert.ok(block.includes('background: linear-gradient(180deg,#E2B96B,#C89D52) !important;'));
});

test('RUN 162 só afeta Natural Sereno e não altera os outros estilos', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const block = css.slice(css.lastIndexOf('/* RUN 162 — Harmonizar Pausa Consciente e Ainda Há Algo em Mim no Natural Sereno.'));

  assert.ok(block.length > 0);
  assert.doesNotMatch(block, /:root(?!\\[data-layout="natural-sereno"\\])/);
  assert.doesNotMatch(block, /data-layout="(?:elegancia-profunda|essencia-luminosa|mistico-moderno)"/);
});
