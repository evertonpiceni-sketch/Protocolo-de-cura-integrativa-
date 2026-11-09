import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('modais compartilhados do Natural Sereno neutralizam ouro antigo, âmbar e azul sem afetar outros estilos', () => {
  const components = [
    ['src/components/AnamnesisModal.tsx', 'id="anamnesis-modal"'],
    ['src/components/SystemicQuestionsModal.tsx', 'id="systemic-questions-modal"'],
    ['src/components/DailyDiaryModal.tsx', 'id="daily-diary-modal"'],
    ['src/components/HooponoponoModal.tsx', 'id="hooponopono-modal"'],
    ['src/components/ArchangelMichaelPrayerModal.tsx', 'id="archangel-prayer-modal"']
  ];
  for (const [path, marker] of components) assert.ok(read(path).includes(marker), `${path} deve manter seu contêiner estável.`);

  const css = read('src/natural-sereno-approved-overrides.css');
  const run129 = css.slice(css.lastIndexOf('/* RUN 129 —'));
  assert.ok(run129.includes(':root[data-layout="natural-sereno"]'));
  assert.ok(run129.includes('#anamnesis-modal'));
  assert.ok(run129.includes('#systemic-questions-modal'));
  assert.ok(run129.includes('#daily-diary-modal'));
  assert.ok(run129.includes('#hooponopono-modal'));
  assert.ok(run129.includes('#archangel-prayer-modal'));
  assert.ok(run129.includes('[class~="bg-[#B88736]"]'));
  assert.ok(run129.includes('[class*="text-[#8F631E]"]'));
  assert.ok(run129.includes('[class*="bg-[#315C85]"]'));
  assert.ok(run129.includes('background-image: linear-gradient(180deg,#E2B96B,#C89D52) !important;'));
  assert.ok(run129.includes('color: #A87E37 !important;'));
  assert.ok(run129.includes('color: #2A2421 !important;'));
  assert.ok(run129.includes('outline: 2px solid #C89D52 !important;'));
  assert.ok(run129.includes('border-radius: 18px !important;'));

  const declarations = [...run129.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/\{([^{}]*)\}/g)]
    .map(match => match[1]).join('\n');
  assert.doesNotMatch(declarations, /#B88736|#8F631E|#315C85|#FACC15|#EAB308|#CA8A04/i);
  assert.doesNotMatch(run129, /data-layout="elegancia-profunda"|data-layout="essencia-luminosa"|data-layout="mistico-moderno"/);
});
