import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno uses the approved indigo tone for inactive chakra markers', () => {
  const dashboard = read('src/components/DashboardCura.tsx');

  assert.match(
    dashboard,
    /background: isCompleted \|\| chakra\.day === nextAvailableDay\s*\? chakra\.color\s*:\s*isMisticoModerno\s*\? '#2E3B73'\s*:\s*'#365849'/,
    'Only the Místico Moderno inactive marker must use indigo; other layouts retain their existing treatment.'
  );
});
