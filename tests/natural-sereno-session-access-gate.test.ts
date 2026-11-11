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
  const gateStart = css.indexOf(':root[data-layout="natural-sereno"] .ep-session-access-gate button[class*="bg-[#8F631E]"] {');
  const gateEnd = css.indexOf('}', gateStart);
  const gate = gateStart >= 0 && gateEnd > gateStart ? css.slice(gateStart, gateEnd + 1) : '';
  assert.ok(gate, 'regra do CTA de acesso ausente');
  assert.ok(gate.includes('background-image: linear-gradient(180deg,#E2B96B,#C89D52) !important;'));
  assert.ok(gate.includes('color: #2A2421 !important;'));
  assert.ok(gate.includes('border-radius: 18px !important;'));
  assert.ok(css.includes(':root[data-layout="natural-sereno"] .ep-session-access-gate button[class*="bg-[#8F631E]"]:not(:disabled):hover'));
  assert.ok(css.includes('background-image: linear-gradient(180deg,#E2B96B,#A87E37) !important;'));
  assert.ok(css.includes('#meditation-session .ep-breathing-guide > div'));
  assert.ok(css.includes('radial-gradient(circle, rgba(200,157,82,.15), transparent 70%) !important;'));
  assert.doesNotMatch(gate, /data-layout="elegancia-profunda"|data-layout="essencia-luminosa"|data-layout="mistico-moderno"/);
});
