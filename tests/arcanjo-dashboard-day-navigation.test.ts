import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('the day selected in the progress dashboard opens that same Arcanjo day', () => {
  const dashboard = read('src/components/DashboardCura.tsx');
  const app = read('src/App.tsx');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');

  assert.match(dashboard, /new CustomEvent\('OPEN_PROTOCOL_DAY',\s*\{\s*detail:\s*\{\s*day\s*\}\s*\}\)/,
    'The dashboard must include the selected day in its navigation event.');
  assert.match(app, /const handleOpenProtocol = \(event: Event\) => \{/);
  assert.match(app, /\(event as CustomEvent<\{ day\?: number \}>\)\.detail\?\.day/);
  assert.match(app, /initialDay=\{requestedArcanjoDay \?\? undefined\}/);
  assert.match(app, /setRequestedArcanjoDay\(null\)/,
    'Closing the protocol must clear the one-time dashboard selection.');

  assert.match(arcanjo, /initialDay\?: number;/);
  assert.match(arcanjo, /if \(!Number\.isInteger\(initialDay\) \|\| initialDay! < 1 \|\| initialDay! > 7\) return;/);
  assert.match(arcanjo, /setDiaAtual\(initialDay!\)/);
  assert.match(arcanjo, /audioEngine\.stopSpeech\(\);\s*stopProtocolFrequency\(\);\s*audioEngine\.stopSynth\(\);/, 
    'Changing days must stop the previous Arcanjo-owned Solfeggio before loading the new day.');

  const progressHydration = arcanjo.indexOf('setDiaAtual([1,2,3,4,5,6,7].find');
  const explicitSelection = arcanjo.indexOf('setDiaAtual(initialDay!)');
  assert.ok(progressHydration >= 0 && explicitSelection > progressHydration,
    'The explicit selection effect must follow progress hydration on entry.');
});
