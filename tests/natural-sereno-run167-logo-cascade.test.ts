import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

function cssRule(source: string, selector: string, useLast = false) {
  const start = useLast ? source.lastIndexOf(selector) : source.indexOf(selector);
  assert.ok(start >= 0, `Regra não encontrada: ${selector}`);
  const open = source.indexOf('{', start);
  const close = source.indexOf('}', open + 1);
  assert.ok(open > start && close > open, `Bloco CSS inválido: ${selector}`);
  return source.slice(open + 1, close);
}

test('logo do cabeçalho permanece como assinatura de baixa opacidade em toda a cascata Natural Sereno', () => {
  const refinement = read('src/natural-sereno-refinement.css');
  const approved = read('src/natural-sereno-approved-overrides.css');
  const selector = ':root[data-layout="natural-sereno"] #main-header .ep-brand-signature';

  const refinementRule = cssRule(refinement, selector);
  const finalRule = cssRule(approved, selector, true);

  assert.ok(refinementRule.includes('opacity: .30 !important;'));
  assert.ok(!refinementRule.includes('opacity: 1 !important;'));
  assert.ok(finalRule.includes('opacity: .30 !important;'));
  assert.ok(finalRule.includes('mix-blend-mode: normal !important;'));
});

test('a camada final Natural Sereno é carregada depois da regra de refinamento', () => {
  const main = read('src/main.tsx');
  const refinementImport = main.indexOf("import './natural-sereno-refinement.css';");
  const approvedImport = main.indexOf("import './natural-sereno-approved-overrides.css';");

  assert.ok(refinementImport >= 0);
  assert.ok(approvedImport > refinementImport);
});

test('o seletor dos quatro estilos exige escolha e confirmação explícitas antes de aplicar o layout', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const app = read('src/App.tsx');

  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(modal.includes('await onSelect(selectedLayout)'));
  assert.ok(app.includes('const [layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false);'));
  assert.ok(app.includes('const selected = layoutConfirmedThisSession ? OFFICIAL_LAYOUTS.find(layout => layout.id === userProfile?.visualLayout) : undefined;'));
});
