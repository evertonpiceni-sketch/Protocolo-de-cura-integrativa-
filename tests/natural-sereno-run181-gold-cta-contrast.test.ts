import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('CTAs dourados do Natural Sereno mantêm texto café apesar do branco global legado', () => {
  const theme = read('src/approved-theme.css');
  const overrides = read('src/natural-sereno-approved-overrides.css');
  const entry = read('src/main.tsx');

  assert.ok(theme.includes('.ep-gold-button *,.ep-gold-action *{color:white!important}'));
  assert.ok(overrides.includes(':root[data-layout="natural-sereno"] :is(.ep-gold-button,.ep-gold-action) * {\n  color:#2A2421!important;\n}'));
  assert.ok(overrides.includes(':root[data-layout="natural-sereno"] :is(.ep-gold-button,.ep-gold-action):hover * {\n  color:#FFFDF8!important;\n}'));

  assert.ok(
    entry.indexOf("import './approved-theme.css'") <
      entry.indexOf("import './natural-sereno-approved-overrides.css'"),
    'A camada Natural Sereno precisa prevalecer sobre a regra global.'
  );

  const naturalRule = overrides.slice(overrides.indexOf('/* RUN 181 — texto dos CTAs dourados'));
  assert.ok(naturalRule.startsWith('/* RUN 181 — texto dos CTAs dourados'));
  assert.ok(naturalRule.includes(':root[data-layout="natural-sereno"]'));
  assert.doesNotMatch(naturalRule, /data-layout="elegancia-profunda"|data-layout="essencia-luminosa"|data-layout="mistico-moderno"/);
});
