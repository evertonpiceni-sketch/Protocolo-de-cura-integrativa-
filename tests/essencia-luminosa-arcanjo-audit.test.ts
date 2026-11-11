import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('o botão Sair do Arcanjo usa a assinatura clara da Essência Luminosa', () => {
  const component = read('src/components/ArcanjoProtocolView.tsx');
  const css = read('src/essencia-luminosa-approved-overrides.css');

  assert.ok(component.includes('bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-700'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #arcanjo-protocol-view > header button[class*="bg-rose-"] {'));
  assert.ok(css.includes('#arcanjo-protocol-view > header button[class*="bg-rose-"]:hover'));
  assert.ok(css.includes('#arcanjo-protocol-view > header button[class*="bg-rose-"] :is(svg, span)'));
  assert.ok(css.includes('#arcanjo-protocol-view > header button[class*="bg-rose-"]:focus-visible'));
  assert.ok(css.includes('var(--layout-accent-soft)'));
  assert.ok(css.includes('var(--layout-gold-dark)'));
});

test('as sete cores dos chakras do Arcanjo permanecem semânticas e os dias futuros usam sálvia', () => {
  const component = read('src/components/ArcanjoProtocolView.tsx');
  const css = read('src/essencia-luminosa-approved-overrides.css');
  const chakraColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#0ea5e9', '#4f46e5', '#a855f7'];

  for (const color of chakraColors) {
    assert.ok(component.includes(color), 'Cor semântica de chakra ausente: ' + color);
  }

  assert.ok(component.includes('data-day-state={done?\'completed\':diaAtual===day?\'current\':\'upcoming\'}'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #arcanjo-protocol-view [data-day-state="upcoming"]'));
  assert.ok(!css.includes('#arcanjo-protocol-view [data-day-state="current"]'));
  assert.ok(!css.includes('#arcanjo-protocol-view [data-day-state="completed"]'));
});

test('ownership de áudio reconhece a arte corporal neutra da Essência Luminosa', () => {
  const component = read('src/components/ArcanjoProtocolView.tsx');
  const ownership = read('src/lib/arcanjoAudioOwnershipPatch.ts');

  assert.ok(component.includes("alt={neutral ? 'Representação corporal neutra em meditação com sete centros de energia' : 'Pessoa em meditação com os sete chakras'}"));
  assert.ok(ownership.includes('img[alt="Pessoa em meditação com os sete chakras"]'));
  assert.ok(ownership.includes('img[alt="Representação corporal neutra em meditação com sete centros de energia"]'));
  assert.ok(ownership.includes('marker => !marker.closest(DASHBOARD_MARKER)'));
});
