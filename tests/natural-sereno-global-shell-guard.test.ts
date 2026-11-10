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
  assert.ok(rule.includes('border-color:rgba(200,157,82,.34)!important;'));
  assert.ok(!rule.includes('rgba(184,135,54,.34)'));
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


test('a primeira escolha dos quatro estilos mantém o shell neutro até a confirmação explícita', () => {
  const app = read('src/App.tsx');
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const shell = read('src/layout-choice-neutral-shell.css');
  const entry = read('src/main.tsx');

  assert.ok(app.includes('const [layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false);'));
  assert.ok(app.includes('(!layoutConfirmedThisSession || layoutChoiceRequested)'));
  assert.ok(modal.includes('aria-labelledby="layout-choice-title"'));
  assert.ok(shell.includes(':root:not([data-layout]) #cura-main-layout'));
  assert.ok(shell.includes('linear-gradient(180deg,#FBF8F2 0%,#FAF7F2 58%,#F5EFE5 100%)'));
  assert.ok(shell.includes(':root:not([data-layout]) [role="dialog"][aria-labelledby="layout-choice-title"]'));
  assert.ok(shell.includes('background: rgba(250,247,242,.96) !important;'));
  assert.ok(!shell.includes(':root[data-layout='));

  const neutralLayer = entry.indexOf("import './layout-choice-neutral-shell.css';");
  const finalThemeLayer = entry.indexOf("import './essencia-luminosa-approved-overrides.css';");
  assert.ok(neutralLayer > finalThemeLayer, 'A camada neutra deve vencer o shell legado antes da confirmação.');
});


test('o canvas anterior à escolha neutraliza o radial sálvia e a scrollbar verde legada', () => {
  const shell = read('src/layout-choice-neutral-shell.css');

  assert.ok(shell.includes(':root:not([data-layout]) body,'));
  assert.ok(shell.includes('background: linear-gradient(180deg,#FBF8F2 0%,#FAF7F2 58%,#F5EFE5 100%) !important;'));
  assert.ok(shell.includes(':root:not([data-layout]) body::before'));
  assert.ok(shell.includes('rgba(200,157,82,.08)'));
  assert.ok(shell.includes('rgba(200,157,82,.04)'));
  assert.ok(shell.includes(':root:not([data-layout]) ::-webkit-scrollbar-track'));
  assert.ok(shell.includes('background: #F5EFE5 !important;'));
  assert.ok(shell.includes(':root:not([data-layout]) ::-webkit-scrollbar-thumb'));
  assert.ok(!shell.includes('rgba(94,113,83'));
  assert.ok(!shell.includes('rgba(2,17,13'));
  assert.ok(!shell.includes(':root[data-layout='));
});
