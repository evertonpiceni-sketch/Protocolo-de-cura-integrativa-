import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('auth prestyle stays neutral until the user explicitly confirms a layout', () => {
  const css = read('src/index.css');
  const start = css.indexOf('/* AUTH PRESTYLE — NEUTRAL UNTIL EXPLICIT LAYOUT CONFIRMATION */');
  const end = css.indexOf('/* Reintegração: presentation correction', start);

  assert.ok(start >= 0 && end > start, 'The neutral prestyle block must exist.');
  const block = css.slice(start, end);
  const scopedSelectors = block.split('\n').filter(line => line.includes('#profile-setup-view'));

  assert.ok(scopedSelectors.length > 0, 'The prestyle rules must target the onboarding view.');
  assert.ok(
    scopedSelectors.every(line => line.includes(':root:not([data-layout])')),
    'Every prestyle rule must apply only before a layout is selected.'
  );
  assert.doesNotMatch(
    block,
    /rgba\(7,50,36|#173323|#c9d9ce|opacity:\s*\.76!important/,
    'The prestyle view must not inherit the former deep-green theme or a dominant logo.'
  );
  assert.match(
    block,
    /\.ep-brand-signature\{\s*opacity:\s*\.30!important;/s,
    'The official logo must remain a subtle 30% signature.'
  );
  assert.match(
    block,
    /\.ep-brand-signature-wrap\{\s*opacity:1!important;\s*background:transparent!important;\s*border-color:transparent!important;\s*box-shadow:none!important;/s,
    'The logo wrapper must stay transparent and visually quiet.'
  );

  const approvedTheme = read('src/approved-theme.css');
  assert.ok(
    !approvedTheme.includes('#profile-setup-view{') && !approvedTheme.includes('#profile-setup-view {'),
    'The onboarding view must not override neutral tokens with a style-specific palette.'
  );
  const neutralRootStart = approvedTheme.indexOf(':root:not([data-layout]){');
  const neutralRootEnd = approvedTheme.indexOf('\\n}', neutralRootStart);
  assert.ok(neutralRootStart >= 0 && neutralRootEnd > neutralRootStart, 'The neutral root token block must exist.');
  const neutralRoot = approvedTheme.slice(neutralRootStart, neutralRootEnd);
  assert.ok(
    neutralRoot.includes('--layout-accent:#85847B;') && neutralRoot.includes('--layout-gold:#A99B84;'),
    'The preselection state must inherit the dedicated neutral palette.'
  );

  const modal = read('src/components/LayoutChoiceModal.tsx');
  assert.match(modal, /const \[selectedLayout, setSelectedLayout\] = useState<LayoutId \| null>\(null\)/);
  assert.match(modal, /disabled=\{!selectedLayout \|\| isSaving\}/);
  assert.match(modal, /src="\/brand\/elegancia-profunda\/prancha-oficial\.svg"/);
});
