import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Anamnesis keeps keyboard focus inside its modal in every layout, including Místico Moderno', () => {
  const modal = read('src/components/AnamnesisModal.tsx');
  const focusHook = read('src/hooks/useDialogFocus.ts');

  assert.match(modal, /id="anamnesis-modal" role="dialog" aria-modal="true"/);
  assert.match(modal, /useDialogFocus\\(isOpen,\\s*dialogRef,\\s*\\(\\) => handleCloseModal\\(\\)\\)/);
  assert.doesNotMatch(modal, /useDialogFocus\\(isOpen && naturalSereno/);

  assert.match(focusHook, /if \\(!open \\|\\| !ref\\.current\\) return/);
  assert.match(focusHook, /event\\.key === 'Escape'/);
  assert.match(focusHook, /event\\.key !== 'Tab'/);
  assert.match(focusHook, /first\\.focus\\(\\)/);
  assert.match(focusHook, /last\\.focus\\(\\)/);
  assert.match(focusHook, /previous\\?\\.isConnected/);
});
