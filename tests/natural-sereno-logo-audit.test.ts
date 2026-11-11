import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('o logo do acolhimento Natural Sereno permanece assinatura discreta em desktop e mobile', () => {
  const base = read('src/natural-sereno.css');
  const overrides = read('src/natural-sereno-approved-overrides.css');
  const entry = read('src/main.tsx');

  // A regra-base e o override final já partem da assinatura discreta aprovada.
  assert.match(base, /\.ep-care-onboarding-card \.ep-brand-signature \{ opacity: \.30; mix-blend-mode: normal; filter: none; \}/);
  assert.match(base, /\.ns-welcome-brand \{ width: 104px; height: 104px; margin-bottom: 24px; opacity: \.30 !important; \}/);
  assert.match(
    overrides,
    /:root\[data-layout="natural-sereno"\] \.ep-care-onboarding-card \.ep-brand-signature \{\s*opacity:\.30!important;\s*mix-blend-mode:normal!important;\s*filter:none!important;\s*\}/
  );
  assert.match(
    overrides,
    /@media \(max-width:640px\) \{\s*:root\[data-layout="natural-sereno"\] \.ep-care-onboarding-card \.ep-brand-signature \{\s*opacity:\.26!important;\s*\}/
  );
  assert.match(
    overrides,
    /:root\[data-layout="natural-sereno"\] \.ep-care-onboarding-card \.ep-brand-signature-wrap \{\s*background:transparent!important;\s*border:0!important;\s*box-shadow:none!important;\s*\}/
  );

  assert.ok(
    entry.indexOf("import './natural-sereno.css'") <
    entry.indexOf("import './natural-sereno-approved-overrides.css'"),
    'Os overrides aprovados precisam carregar depois da folha legada.'
  );
});


test('o logo da tela de carregamento respeita 30% em desktop e mobile apesar da regra legada com ID', () => {
  const base = read('src/natural-sereno.css');
  const overrides = read('src/natural-sereno-approved-overrides.css');

  assert.ok(base.includes(':root[data-layout="natural-sereno"] #auth-loading-view img { opacity: .30 !important; mix-blend-mode: normal !important; }'));
  assert.ok(overrides.includes(':root[data-layout="natural-sereno"] #auth-loading-view img {\n  opacity:.30!important;\n  mix-blend-mode:normal!important;\n  filter:none!important;\n}'));
  assert.ok(overrides.includes('@media(max-width:640px) {\n  :root[data-layout="natural-sereno"] #auth-loading-view img {\n    opacity:.30!important;\n  }\n}'));
});
