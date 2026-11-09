import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Natural Sereno Arcanjo uses neutral media-session artwork instead of the retired chakra illustration', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const audio = read('src/lib/audio.ts');
  const transformation = read('src/components/TransformationHome.tsx');

  assert.ok(arcanjo.includes('artwork: isNaturalSereno'));
  assert.ok(arcanjo.includes("{ src: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' }"));
  assert.ok(arcanjo.includes("{ src: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' }"));
  assert.ok(audio.includes('artwork?: Array<{ src: string; sizes?: string; type?: string }>'));
  assert.ok(audio.includes('artwork: options.artwork ?? [{ src: \'/brand/chakra-body.svg\''));

  // The legacy chakra result view remains isolated behind the non-Natural-Sereno route.
  assert.ok(transformation.includes("if (props.visualLayout === 'natural-sereno')"));
  assert.ok(transformation.includes('return <NaturalSerenoHome'));
});
