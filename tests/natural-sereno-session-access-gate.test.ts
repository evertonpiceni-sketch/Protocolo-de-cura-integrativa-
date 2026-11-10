import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('CTA da barreira de acesso da sessão usa dourado refinado somente no Natural Sereno', () => {
  const component = read('src/components/MeditationSession.tsx');
  assert.ok(component.includes('className="ep-session-access-gate'));
  assert.ok(component.includes('bg-[#8F631E] text-white'));
  assert.ok(component.includes('hover:bg-[#7A5318]'));
  assert.ok(component.includes('from-[#D4AF37]/15'), 'O token legado do halo precisa continuar neutralizado pela camada final.');

  const css = read('src/natural-sereno-approved-overrides.css');
  const run135 = css.slice(css.lastIndexOf('/* RUN 135 —'));
  assert.ok(run135.includes(':root[data-layout="natural-sereno"] .ep-session-access-gate'));
  assert.ok(run135.includes('button[class*="bg-[#8F631E]"]'));
  assert.ok(run135.includes('background-image: linear-gradient(180deg,#E2B96B,#C89D52) !important;'));
  assert.ok(run135.includes('color: #2A2421 !important;'));
  assert.ok(run135.includes('border-radius: 18px !important;'));
  assert.ok(run135.includes('background-image: linear-gradient(180deg,#E8C47D,#A87E37) !important;'));
  assert.ok(run135.includes('#meditation-session .ep-breathing-guide > div'));
  assert.ok(run135.includes('radial-gradient(circle, rgba(200,157,82,.15), transparent 70%) !important;'));
  assert.doesNotMatch(run135, /data-layout="elegancia-profunda"|data-layout="essencia-luminosa"|data-layout="mistico-moderno"/);
});
