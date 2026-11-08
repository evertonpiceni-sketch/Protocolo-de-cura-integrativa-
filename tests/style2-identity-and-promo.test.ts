import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('o seletor exige escolha explícita antes de aplicar qualquer estilo', () => {
  const app = read('src/App.tsx');
  const modal = read('src/components/LayoutChoiceModal.tsx');

  assert.ok(app.includes('const [layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false);'));
  assert.ok(app.includes('const selected = layoutConfirmedThisSession ? OFFICIAL_LAYOUTS.find(layout => layout.id === userProfile?.visualLayout) : undefined;'));
  assert.ok(app.includes('delete document.documentElement.dataset.layout;'));
  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(modal.includes('O estilo só será aplicado depois da sua confirmação.'));
  assert.ok(modal.includes('/brand/elegancia-profunda/prancha-oficial.svg'));
  assert.ok(modal.includes('21 dias, corpo neutro e logo discreto como assinatura'));
});

test('a assinatura oficial permanece em 30% e sem fundo, moldura ou sombra no Estilo 2', () => {
  const css = read('src/elegancia-profunda-approved-overrides.css');
  const logoRule = css.match(/:root\[data-layout="elegancia-profunda"\] \.ep-brand-signature,[\s\S]*?\{([^}]+)\}/)?.[1] ?? '';
  const wrapperRule = css.match(/:root\[data-layout="elegancia-profunda"\] \.ep-brand-signature-wrap\s*\{([^}]+)\}/)?.[1] ?? '';

  assert.ok(logoRule.includes('opacity:.30 !important;'));
  assert.ok(wrapperRule.includes('background:transparent!important;'));
  assert.ok(wrapperRule.includes('border-color:transparent!important;'));
  assert.ok(wrapperRule.includes('box-shadow:none!important;'));
});

test('o CTA estrutural do vídeo usa ouro e o estado mudo não herda rosa no Estilo 2', () => {
  const component = read('src/components/PromoVideoModal.tsx');
  const css = read('src/elegancia-profunda-promo-audit.css');

  assert.ok(component.includes('bg-emerald-600 hover:bg-emerald-500 text-white'));
  assert.ok(component.includes('bg-rose-500/10 border-rose-500/30 text-rose-400'));

  const goldCtaRule = css.match(/:root\[data-layout="elegancia-profunda"\] #promo-video-modal button\[class\*="bg-emerald-600"\]\s*\{([^}]+)\}/)?.[1] ?? '';
  assert.ok(goldCtaRule.includes('linear-gradient'));
  assert.ok(goldCtaRule.includes('var(--layout-gold)'));
  assert.ok(!/emerald|rose/i.test(goldCtaRule));
  assert.ok(css.includes('button[class*="bg-emerald-600"]:hover'));

  const mutedRule = css.match(/:root\[data-layout="elegancia-profunda"\] #promo-video-modal button\[class\*="bg-rose-500"\]\s*\{([^}]+)\}/)?.[1] ?? '';
  assert.ok(mutedRule.includes('var(--layout-card)'));
  assert.ok(mutedRule.includes('var(--layout-gold)'));
  assert.ok(!/rose|pink/i.test(mutedRule));
  assert.ok(css.includes('button[class*="bg-rose-500"] svg'));
});

test('as 21 folhas CSS ativas do Estilo 2 permanecem isoladas e a folha legada não é importada', () => {
  const main = read('src/main.tsx');
  const imports = main.match(/import '\.\/elegancia-profunda-[^']+\.css';/g) ?? [];

  assert.equal(imports.length, 21);
  assert.ok(!imports.some(entry => entry.includes('welcome-audit')));

  for (const entry of imports) {
    const file = entry.match(/'\.\/(.+)'/)?.[1];
    assert.ok(file);
    const css = read(`src/${file}`);
    const selectors = [...css.matchAll(/([^{}]+)\{/g)]
      .map(match => match[1].trim())
      .filter(selector => selector && !selector.startsWith('@') && !selector.startsWith('/*'));
    const unscoped = selectors.filter(selector => !selector.includes('data-layout="elegancia-profunda"'));
    assert.deepEqual(unscoped, [], `${file} deve permanecer restrito à Elegância Profunda.`);
  }
});
