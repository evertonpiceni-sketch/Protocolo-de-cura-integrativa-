import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('a cascata final não mantém opacidade de logo divergente da assinatura aprovada', () => {
  const css = read('src/natural-sereno-final-audit.css');
  const selector = ':root[data-layout="natural-sereno"] .approved-brand,';
  const start = css.indexOf(selector);
  assert.ok(start >= 0, 'Regra global da assinatura não encontrada');
  const end = css.indexOf('}', start);
  assert.ok(end > start, 'Bloco da assinatura está incompleto');
  const block = css.slice(start, end + 1);

  assert.match(block, /opacity:\s*\.30\s*!important/);
  assert.doesNotMatch(block, /opacity:\s*\.24\s*!important/);
});

test('a assinatura da Reintegração permanece a 30% e sem moldura', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const marker = '/* RUN 168 — Logo da Reintegração: assinatura discreta em cada estado';
  const start = css.lastIndexOf(marker);
  assert.ok(start >= 0, 'Regra aprovada do logo da Reintegração não encontrada');
  const block = css.slice(start, css.indexOf('}', start) + 1);

  assert.match(block, /opacity:\s*\.30\s*!important/);
  assert.match(block, /background:\s*transparent\s*!important/);
  assert.match(block, /border:\s*0\s*!important/);
  assert.match(block, /box-shadow:\s*none\s*!important/);
});

test('o card Natural Sereno mantém a prancha oficial inteira e só aplica o tema após confirmação', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const app = read('src/App.tsx');

  assert.ok(modal.includes("new URL('../../docs/visual-qa/natural-sereno/reference.jpg', import.meta.url)"));
  assert.match(modal, /className="h-14 w-16[^"]*object-contain"/);
  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(app.includes('const [layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false);'));
  assert.ok(app.includes('Never activate a visual theme before the user explicitly confirms a choice.'));
});
