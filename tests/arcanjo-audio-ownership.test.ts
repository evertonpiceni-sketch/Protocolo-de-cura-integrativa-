import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('a posse do áudio do Arcanjo usa o contêiner estável, não a imagem antiga de chakras', () => {
  const ownership = read('src/lib/arcanjoAudioOwnershipPatch.ts');
  const component = read('src/components/ArcanjoProtocolView.tsx');

  assert.match(component, /id="arcanjo-protocol-view"/);
  assert.match(ownership, /const ARCANJO_VIEW_MARKER = '#arcanjo-protocol-view';/);
  assert.match(ownership, /document\.querySelector\(ARCANJO_VIEW_MARKER\)/);
  assert.match(ownership, /Boolean\(protocolRoot && !protocolRoot\.closest\(DASHBOARD_MARKER\)\)/);
  assert.doesNotMatch(ownership, /img\[alt="Pessoa em meditação com os sete chakras"\]/);
  assert.match(ownership, /if \(arcanjoOwnsAudio\(\)\) \{\s*audioEngine\.stopBG\(\);\s*return;/s);
  assert.match(ownership, /if \(isArcanjoViewMounted\(\)\) \{\s*releaseOpeningGuard\(\);\s*audioEngine\.stopBG\(\);/s);
});
