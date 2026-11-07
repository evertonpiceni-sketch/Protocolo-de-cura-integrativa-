import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('Essência Luminosa keeps the latest approved ivory, champagne, soft-gold and sage palette', () => {
  const theme = read('src/approved-theme.css');
  const block = theme.match(/:root\[data-layout="essencia-luminosa"\]\s*\{([\s\S]*?)\n\}/)?.[1];
  assert.ok(block, 'Style 3 token block must exist');

  for (const token of [
    '--layout-canvas:#FFFFF8;',
    '--layout-canvas-alt:#F7F3E8;',
    '--layout-accent:#A6B49B;',
    '--layout-gold:#C6A46A;',
    '--layout-gold-dark:#A87E37;',
    '--layout-bg:var(--layout-canvas);',
    '--layout-accent-soft:#E9EEE6;',
    '--layout-gold-soft:#F3E9D8;',
    '--layout-sage:var(--layout-accent);',
    '--layout-muted:var(--layout-text-muted);'
  ]) {
    assert.ok(block.includes(token), `missing approved Style 3 token: ${token}`);
  }
});

test('the four-style chooser displays the official Style 3 board and requires explicit confirmation', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const app = read('src/App.tsx');
  const board = read('public/brand/essencia-luminosa/prancha-oficial.svg');

  assert.ok(board.includes('data:image/webp;base64,'), 'official board preview asset must be embedded');
  assert.ok(modal.includes('/brand/essencia-luminosa/prancha-oficial.svg'));
  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(modal.includes('bg-[#F7F3E8]'), 'chooser must not reveal a default theme behind it');
  assert.ok(app.includes('Never activate a visual theme before the user explicitly confirms a choice.'));
  assert.ok(app.includes('delete document.documentElement.dataset.layout'));
  assert.ok(app.includes('setLayoutConfirmedThisSession(true)'));
  const brand = read('src/essencia-luminosa-approved-overrides.css');
  const finalAudit = read('src/essencia-luminosa-final-audit.css');
  assert.ok(brand.includes('opacity:.30!important') || finalAudit.includes('opacity:.30!important'));
  assert.ok(finalAudit.includes('opacity:.26!important'));
});

test('Style 3 welcome and result narration honor the saved installed device voice', () => {
  const home = read('src/components/TransformationHome.tsx');
  const audio = read('src/lib/audio.ts');

  assert.ok(home.includes("const isEssenciaLuminosa = props.visualLayout === 'essencia-luminosa';"));
  assert.ok(home.includes('isLegacyVoiceAlias ? undefined : savedVoiceId'));
  assert.ok(home.includes('const preferElevenLabs = !isEssenciaLuminosa;'));
  assert.equal(home.split('preferElevenLabs, lang: \'pt-BR\'').length - 1, 2);
  assert.ok(audio.includes('const customVoice = voices.find(v => v.name === options.voiceId);'));
  assert.ok(audio.includes('const preferElevenLabs = options?.preferElevenLabs !== false;'));
});
