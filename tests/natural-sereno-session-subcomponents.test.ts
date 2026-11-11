import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('Natural Sereno harmoniza os subcomponentes internos da sessão sem tocar nos outros estilos', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const blockStart = css.lastIndexOf('/* RUN 144 —');
  assert.ok(blockStart >= 0, 'o bloco RUN 144 precisa estar presente');
  const block = css.slice(blockStart);

  const selectors = block.split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.endsWith('{') && !line.startsWith('@'));
  assert.ok(selectors.length >= 30, 'o bloco precisa cobrir as superfícies auditadas');
  for (const selector of selectors) {
    assert.ok(
      selector.trim().startsWith(':root[data-layout="natural-sereno"]'),
      `regra fora do escopo Natural Sereno: ${selector}`
    );
  }

  for (const selector of [
    '#meditation-session .ep-acceptance-portal',
    '#meditation-session .ep-session-checkin',
    '.ep-secondary-script-drawer__panel',
    '#meditation-session .ep-stage-badge',
    '#meditation-session footer .ns-play-toggle svg',
    '.ep-session-access-card',
    '#meditation-session [role="dialog"][aria-label="Sessão concluída"]'
  ]) {
    assert.ok(block.includes(selector), `faltou cobertura para ${selector}`);
  }

  assert.match(block, /linear-gradient\(180deg,#E2B96B,#C89D52\)/);
  assert.match(block, /border-radius:\s*18px/);
  assert.match(block, /color:\s*#2A2421/);
  assert.match(block, /rgba\(200,157,82/);
  assert.doesNotMatch(block, /:\s*#8F631E\b|:\s*#B88736\b|:\s*#D4AF37\b/i);
});

test('o drawer do roteiro tem ganchos próprios para o override escopado', () => {
  const drawer = read('src/components/session/SecondaryScriptDrawer.tsx');
  assert.ok(drawer.includes('className="ep-secondary-script-drawer fixed inset-0'));
  assert.ok(drawer.includes('className="ep-secondary-script-drawer__panel relative z-10'));
});
