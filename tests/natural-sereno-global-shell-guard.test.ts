import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('CTA flutuante global recebe acabamento Natural Sereno sem formato de pílula', () => {
  const app = read('src/App.tsx');
  const overrides = read('src/natural-sereno-approved-overrides.css');
  const entry = read('src/main.tsx');

  assert.ok(app.includes('id="floating-whatsapp-btn"'));
  assert.ok(app.includes('rounded-full'));

  const start = overrides.indexOf(':root[data-layout="natural-sereno"] #floating-whatsapp-btn {');
  const end = overrides.indexOf('}', start);
  const rule = start >= 0 && end > start ? overrides.slice(start, end) : '';
  assert.ok(rule.includes('background:rgba(251,248,242,.96)!important;'));
  assert.ok(rule.includes('color:#5C5248!important;'));
  assert.ok(rule.includes('border-color:rgba(184,135,54,.34)!important;'));
  assert.ok(rule.includes('border-radius:18px!important;'));
  assert.ok(!rule.includes('border-radius:999px'));

  const finalLayer = entry.indexOf("import './natural-sereno-approved-overrides.css';");
  assert.ok(finalLayer > entry.indexOf("import './natural-sereno-contact-audit.css';"));
  assert.ok(finalLayer > entry.indexOf("import './natural-sereno-legacy-green-audit.css';"));
  assert.ok(finalLayer > entry.indexOf("import './natural-sereno-home-surface-audit.css';"));
});

test('toast global perde a herança índigo/violeta somente no Natural Sereno', () => {
  const app = read('src/App.tsx');
  const overrides = read('src/natural-sereno-approved-overrides.css');

  assert.ok(app.includes('className="ep-app-toast'));
  assert.ok(app.includes('from-indigo-950'));
  assert.ok(app.includes('to-purple-950'));

  const start = overrides.indexOf(':root[data-layout="natural-sereno"] .ep-app-toast {');
  const end = overrides.indexOf('}', start);
  const rule = start >= 0 && end > start ? overrides.slice(start, end) : '';
  assert.ok(rule.includes('linear-gradient(145deg,#FFFDF8 0%,#F4EDE3 100%)'));
  assert.ok(rule.includes('color: #2A2421 !important;'));
  assert.ok(overrides.includes(':root[data-layout="natural-sereno"] .ep-app-toast h4'));
  assert.ok(overrides.includes(':root[data-layout="natural-sereno"] .ep-app-toast p'));
  assert.ok(overrides.includes(':root[data-layout="natural-sereno"] .ep-app-toast svg'));
});
