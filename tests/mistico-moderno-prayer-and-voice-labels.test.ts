import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno gives the 21-day Archangel prayer its own night palette', () => {
  const modal = read('src/components/ArchangelMichaelPrayerModal.tsx');
  const styles = read('src/mistico-moderno-arcanjo-audit.css');

  assert.match(modal, /id="archangel-prayer-modal"/);
  assert.match(modal, /className="ep-archangel-prayer/);
  assert.match(styles, /:root\[data-layout="mistico-moderno"\] #archangel-prayer-modal/);
  assert.match(styles, /#archangel-prayer-modal > \.ep-archangel-prayer/);
  assert.match(styles, /linear-gradient\(180deg, #0A2742 0%, #101827 100%\)/);
  assert.match(styles, /rgba\(108, 63, 160/);
  assert.match(styles, /rgba\(212, 175, 55/);
  assert.match(styles, /text-emerald-/);
  assert.match(styles, /button:disabled/);
});

test('Místico Moderno labels the saved neural voice instead of the legacy gender preset', () => {
  const anamnesis = read('src/components/AnamnesisModal.tsx');

  assert.match(anamnesis, /isEssenciaLuminosa \|\| isMisticoModerno \? 'Voz neural escolhida em Ajustes de áudio'/);
  assert.match(anamnesis, /isMisticoModerno \? 'Voz neural escolhida em Ajustes de áudio' : selectedVoiceGender === 'masculina'/);
  assert.match(anamnesis, /fallbackToSpeechSynthesis: false/);
});
