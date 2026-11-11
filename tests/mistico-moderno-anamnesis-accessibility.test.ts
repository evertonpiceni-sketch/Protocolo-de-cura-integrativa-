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

  assert.ok(modal.includes('id="anamnesis-modal" role="dialog" aria-modal="true"'));
  assert.ok(modal.includes('useDialogFocus(isOpen, dialogRef, () => handleCloseModal());'));
  assert.ok(!modal.includes('useDialogFocus(isOpen && naturalSereno'));

  assert.ok(focusHook.includes('if (!open || !ref.current) return'));
  assert.ok(focusHook.includes("if (event.key === 'Escape'"));
  assert.ok(focusHook.includes("if (event.key !== 'Tab') return"));
  assert.ok(focusHook.includes('first.focus()'));
  assert.ok(focusHook.includes('last.focus()'));
  assert.ok(focusHook.includes('previous?.isConnected'));
});
