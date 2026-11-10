import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

function hexToRgb(hex: string): [number, number, number] {
  const match = hex.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  assert.ok(match, `cor hexadecimal inválida: ${hex}`);
  return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
}

function mix(foreground: string, background: string, foregroundWeight: number): string {
  const a = hexToRgb(foreground);
  const b = hexToRgb(background);
  return '#' + a.map((value, index) =>
    Math.round(value * foregroundWeight + b[index] * (1 - foregroundWeight))
      .toString(16).padStart(2, '0')
  ).join('');
}

function luminance(hex: string): number {
  const channels = hexToRgb(hex).map(value => value / 255).map(value =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground: string, background: string): number {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test('Essência Luminosa uses AA-safe sage and gold text tones on ivory and champagne', () => {
  const theme = read('src/approved-theme.css');
  const css = read('src/essencia-luminosa-approved-overrides.css');

  for (const token of [
    '--layout-accent:#A6B49B;',
    '--layout-gold-dark:#A87E37;',
    '--layout-text:#2A2420;',
    '--layout-canvas:#FFFFF8;',
    '--layout-canvas-alt:#F7F3E8;'
  ]) assert.ok(theme.includes(token), `token aprovado ausente: ${token}`);

  assert.ok(css.includes('--layout-accent-text: color-mix(in srgb, var(--layout-accent) 50%, var(--layout-text));'));
  assert.ok(css.includes('--layout-gold-text: color-mix(in srgb, var(--layout-gold-dark) 60%, var(--layout-text));'));

  const sageText = mix('#A6B49B', '#2A2420', 0.5);
  const goldText = mix('#A87E37', '#2A2420', 0.6);
  for (const surface of ['#FFFFF8', '#F7F3E8']) {
    assert.ok(contrast(sageText, surface) >= 4.5, `sálvia abaixo de AA em ${surface}`);
    assert.ok(contrast(goldText, surface) >= 4.5, `ouro abaixo de AA em ${surface}`);
  }
});

test('final contrast guard keeps semantic text readable without recoloring decorative SVG icons', () => {
  const css = read('src/essencia-luminosa-approved-overrides.css');
  const guard = css.slice(css.indexOf('/* RUN 139 — contraste tipográfico final'));

  assert.ok(guard.includes('#settings-view'));
  assert.ok(guard.includes('#daily-diary-modal'));
  assert.ok(guard.includes('#numerology-modal'));
  assert.ok(guard.includes('#hooponopono-modal'));
  assert.ok(guard.includes('#mobile-install-modal'));
  assert.ok(guard.includes('#arcanjo-protocol-view'));
  assert.ok(guard.includes('[class*="text-emerald-"]'));
  assert.ok(guard.includes('[class*="text-amber-"]'));
  assert.ok(guard.includes('[class*="text-[#315C85]"]'));
  assert.ok(guard.includes('[class*="text-[#B88736]"]'));
  assert.ok(!guard.includes('svg[class*="text-emerald-"]'));
  assert.ok(guard.includes('#daily-tip-modal button:last-child'));
  assert.ok(guard.includes('color: var(--layout-text) !important;'));
  assert.ok(guard.includes('#hooponopono-modal [data-phrase-tone="0"] strong'));
  assert.ok(!guard.includes('data-layout="natural-sereno"'));
  assert.ok(!guard.includes('data-layout="elegancia-profunda"'));
  assert.ok(!guard.includes('data-layout="mistico-moderno"'));
});
