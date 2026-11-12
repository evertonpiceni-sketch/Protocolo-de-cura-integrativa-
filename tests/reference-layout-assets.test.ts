import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

test('all four recovered original boards have intact source bytes and full-resolution metadata', () => {
  const manifest = JSON.parse(readFileSync('public/brand/reference-layouts.json', 'utf8'));
  assert.equal(new Set(manifest.boards.map((board: {layout: string}) => board.layout)).size, 4);
  for (const board of manifest.boards) {
    const bytes = readFileSync(board.path);
    assert.equal(bytes.subarray(0, 3).toString('hex'), 'ffd8ff', board.layout);
    assert.equal(board.format, 'JPEG');
    assert(board.height >= 1152);
    assert.equal(board.width, 1536, `${board.layout}: preserve the full source, not a degraded thumbnail`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), board.sha256, board.layout);
  }
});
