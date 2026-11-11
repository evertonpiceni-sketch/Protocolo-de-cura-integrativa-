import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno final palette guard loads after every Style 4 layer and before neutral preselection', () => {
  const main = read('src/main.tsx');
  const finalLayer = main.indexOf("import './mistico-moderno-final-palette-guard.css';");
  const onboarding = main.indexOf("import './mistico-moderno-onboarding-audit.css';");
  const neutral = main.indexOf("import './prestyle-neutral.css';");

  assert.ok(onboarding >= 0, 'Onboarding audit layer must remain imported.');
  assert.ok(finalLayer > onboarding, 'The final palette guard must follow all Style 4 audit layers.');
  assert.ok(neutral > finalLayer, 'The neutral preselection shell must remain after the confirmed-theme layers.');
});

test('Místico Moderno remaps shared green UI utilities to violet, indigo and gold without styling natural image assets', () => {
  const guard = read('src/mistico-moderno-final-palette-guard.css');
  const svg = read('public/brand/chakra-body.svg');

  assert.match(guard, /:root\[data-layout="mistico-moderno"\]/);
  assert.match(guard, /text-emerald-/);
  assert.match(guard, /text-green-/);
  assert.match(guard, /bg-emerald-50/);
  assert.match(guard, /bg-emerald-600/);
  assert.match(guard, /border-emerald-/);
  assert.match(guard, /shadow-emerald/);
  assert.match(guard, /ring-emerald/);
  assert.match(guard, /from-emerald-/);
  assert.match(guard, /#meditation-session/);
  assert.match(guard, /#arcanjo-protocol-backdrop/);
  assert.match(guard, /#achievements-modal > div/);
  assert.match(guard, /#specific-treatment-modal > div/);
  assert.match(guard, /#hooponopono-modal > div/);
  assert.match(guard, /#mobile-install-modal > div/);
  assert.match(guard, /aria-label="Celebração de progresso"/);
  assert.doesNotMatch(guard, /(^|\n)\s*(?:img|svg|picture)\b/i,
    'The palette guard must not recolor photographic or natural image assets.');
  assert.match(svg, /id="natural-foliage" fill="#123D39"/,
    'Natural foliage remains part of the approved neutral body illustration.');
});

test('the full-page Místico Moderno atmosphere no longer contains a detached green wash', () => {
  const theme = read('src/approved-theme.css');
  const style4 = theme.match(/:root\[data-layout="mistico-moderno"\]\{([\s\S]*?)\n\}/)?.[1] ?? '';

  assert.match(style4, /--layout-accent-soft:rgba\(108,63,160,\.16\)/,
    'The approved indigo-violet surface keeps its restrained violet accent.');
  assert.match(style4, /--layout-indigo:#2E3B73/);
  assert.match(style4, /--layout-gold:#D4AF37/);
  assert.match(style4, /--layout-text:#F4F1EB/);
  assert.doesNotMatch(style4, /rgba\(30,107,90/i,
    'Emerald must not become a detached atmospheric wash.');
});


test('Místico Moderno reserves green for natural image assets, not interface color declarations', () => {
  const cssFiles = [
    'src/mistico-moderno-approved-overrides.css',
    'src/mistico-moderno-modal-audit.css',
    'src/mistico-moderno-dashboard-audit.css',
    'src/mistico-moderno-header-audit.css',
    'src/mistico-moderno-guides-audit.css',
    'src/mistico-moderno-session-audit.css',
    'src/mistico-moderno-courses-audit.css',
    'src/mistico-moderno-maps-audit.css',
    'src/mistico-moderno-achievements-audit.css',
    'src/mistico-moderno-daily-diary-audit.css',
    'src/mistico-moderno-hooponopono-audit.css',
    'src/mistico-moderno-journal-audit.css',
    'src/mistico-moderno-milestone-audit.css',
    'src/mistico-moderno-report-certificate-audit.css',
    'src/mistico-moderno-herbal-baths-audit.css',
    'src/mistico-moderno-specific-treatment-audit.css',
    'src/mistico-moderno-promo-audit.css',
    'src/mistico-moderno-contact-audit.css',
    'src/mistico-moderno-video-studio-audit.css',
    'src/mistico-moderno-bottom-nav-audit.css',
    'src/mistico-moderno-mobile-install-audit.css',
    'src/mistico-moderno-audio-settings-audit.css',
    'src/mistico-moderno-welcome-audit.css',
    'src/mistico-moderno-arcanjo-audit.css',
    'src/mistico-moderno-final-audit.css',
    'src/mistico-moderno-onboarding-audit.css',
    'src/mistico-moderno-final-palette-guard.css',
  ];

  const greenDeclarations: string[] = [];
  const toHue = (r: number, g: number, b: number) => {
    const values = [r / 255, g / 255, b / 255];
    const max = Math.max(...values);
    const min = Math.min(...values);
    const delta = max - min;
    let hue = 0;
    if (delta !== 0) {
      if (max === values[0]) hue = 60 * (((values[1] - values[2]) / delta) % 6);
      else if (max === values[1]) hue = 60 * ((values[2] - values[0]) / delta + 2);
      else hue = 60 * ((values[0] - values[1]) / delta + 4);
    }
    if (hue < 0) hue += 360;
    return { hue, saturation: max === 0 ? 0 : delta / max, value: max };
  };

  for (const path of cssFiles) {
    const css = read(path).replace(/\\/\*[\\s\\S]*?\\*\\//g, '');
    for (const declaration of css.matchAll(/([-\\w]+)\\s*:\\s*([^;{}]+);/g)) {
      const property = declaration[1];
      const value = declaration[2];
      const colors = [
        ...[...value.matchAll(/#([0-9a-f]{6})\\b/gi)].map(match => {
          const hex = Number.parseInt(match[1], 16);
          return { label: match[0], rgb: [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255] };
        }),
        ...[...value.matchAll(/rgba?\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})/gi)].map(match => ({
          label: match[0],
          rgb: [Number(match[1]), Number(match[2]), Number(match[3])],
        })),
      ];
      for (const color of colors) {
        const { hue, saturation, value: brightness } = toHue(color.rgb[0], color.rgb[1], color.rgb[2]);
        if (hue >= 80 && hue <= 170 && saturation > .28 && brightness > .12) {
          greenDeclarations.push(path + ': ' + property + ' -> ' + color.label);
        }
      }
    }
    assert.doesNotMatch(css, /var\\(--layout-emerald\\)/,
      path + ' must not use the natural emerald token for interface surfaces.');
  }

  assert.deepEqual(greenDeclarations, [],
    'Green color declarations are reserved for natural image assets, not Style 4 interface surfaces.');
  const body = read('public/brand/chakra-body.svg');
  assert.match(body, /<g id="natural-foliage" fill="#123D39"/,
    'The approved natural foliage remains green inside the neutral body artwork.');
});
