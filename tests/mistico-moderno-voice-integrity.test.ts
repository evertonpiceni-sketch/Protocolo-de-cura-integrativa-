import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

test('Místico Moderno uses the saved neural voice in every narration entry point', () => {
  const app = read('src/App.tsx');
  const settings = read('src/components/AudioSettingsModal.tsx');
  const home = read('src/components/TransformationHome.tsx');
  const player = read('src/components/MeditationSession.tsx');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');

  assert.match(app, /const isMisticoModerno = layoutConfirmedThisSession && userProfile\?\.visualLayout === 'mistico-moderno'/);
  assert.match(app, /usesNeuralVoiceCatalog = isNaturalSereno \|\| isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno/);
  assert.match(app, /fallbackToSpeechSynthesis: false/);
  assert.match(app, /Essência Luminosa e Místico Moderno não usam a voz do dispositivo/);
  assert.match(app, /effectiveNeuralVoiceId = \(isNaturalSereno \|\| isEssenciaLuminosa\)/);

  assert.match(settings, /requiresNeuralVoice = isNaturalSereno \|\| isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno/);
  assert.match(settings, /fallbackToSpeechSynthesis: !requiresNeuralVoice/);
  assert.match(settings, /if \(requiresNeuralVoice && !isElevenLabsVoiceId\(voiceId\)\)/);

  assert.match(home, /requiresNeuralVoice = isNaturalSereno \|\| isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno/);
  assert.match(home, /approvedVoiceId = isEleganciaProfunda \|\| isMisticoModerno/);
  assert.match(home, /fallbackToSpeechSynthesis: !requiresNeuralVoice/);

  assert.match(player, /const style4VoiceId = isElevenLabsVoiceId\(selectedVoiceId\) \? selectedVoiceId : ''/);
  assert.match(player, /isMisticoModerno && !style4VoiceId/);
  assert.match(player, /isMisticoModerno\s*\?\s*style4VoiceId/);

  assert.match(arcanjo, /const isMisticoModerno = typeof document !== 'undefined' && document\.documentElement\.dataset\.layout === 'mistico-moderno'/);
  assert.match(arcanjo, /voiceId: \(isEleganciaProfunda \|\| isMisticoModerno\)\s*\? userProfile\.voiceId/);
  assert.match(arcanjo, /requireExplicitVoiceId: isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno/);
  assert.match(arcanjo, /if \(isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno\)/);
  assert.match(arcanjo, /if \(\(isEleganciaProfunda \|\| isMisticoModerno\) && !isElevenLabsVoiceId\(userProfile\.voiceId\)\)/);
});

test('Style 4 never starts Arcanjo Solfeggio before the neural narration begins', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const start = arcanjo.slice(arcanjo.indexOf('const start ='), arcanjo.indexOf('const togglePlayback'));
  assert.match(start, /if \(!isMisticoModerno\) audioEngine\.startSynth/);
  assert.match(start, /onStart: \(\) => \{[\s\S]*?audioEngine\.startSynth/);
  assert.match(start, /onPause: \(\) => \{[\s\S]*?audioEngine\.stopSynth/);
  assert.match(start, /if \(isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno\)[\s\S]*?audioEngine\.stopSynth/);
  assert.match(arcanjo, /const resetPlayback = \(\) => \{[\s\S]*?audioEngine\.stopSynth/);
});

test('the four-style selector requires explicit confirmation before applying a theme', () => {
  const app = read('src/App.tsx');
  const modal = read('src/components/LayoutChoiceModal.tsx');
  assert.match(app, /layoutConfirmedThisSession, setLayoutConfirmedThisSession\] = useState\(false\)/);
  assert.match(app, /const selected = layoutConfirmedThisSession \? OFFICIAL_LAYOUTS\.find/);
  assert.match(app, /\(!layoutConfirmedThisSession \|\| layoutChoiceRequested\)/);
  assert.match(app, /setLayoutConfirmedThisSession\(false\)/);
  assert.match(modal, /useState<LayoutId \| null>\(null\)/);
  assert.match(modal, /disabled=\{!selectedLayout \|\| isSaving\}/);
});

test('Style 4 Arcanjo and welcome visual layers are loaded and scoped', () => {
  const main = read('src/main.tsx');
  assert.match(main, /import '\.\/mistico-moderno-welcome-audit\.css';/);
  assert.match(main, /import '\.\/mistico-moderno-arcanjo-audit\.css';/);

  const imports = [...main.matchAll(/import '\.\/(mistico-moderno-[^']+\.css)';/g)].map(match => match[1]);
  assert.ok(imports.length >= 24, `Expected all page-level Style 4 layers; found ${imports.length}.`);
  for (const filename of imports) {
    const css = read(`src/${filename}`).replace(/\/\*[\s\S]*?\*\//g, '');
    const blocks = [...css.matchAll(/([^{}]+)\{/g)].map(match => match[1].trim().replace(/\s+/g, ' '));
    const selectors = blocks.filter(selector => selector && !selector.startsWith('@') && !/^(from|to|\d+%)/.test(selector));
    const unscoped = selectors.filter(selector => !selector.includes('data-layout="mistico-moderno"'));
    assert.deepEqual(unscoped, [], `${filename} has a selector outside the Místico Moderno scope.`);
  }

  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const arcanjoCss = read('src/mistico-moderno-arcanjo-audit.css');
  assert.match(arcanjo, /id="arcanjo-protocol-backdrop"/);
  assert.match(arcanjo, /id="arcanjo-chakra-stage"/);
  assert.match(arcanjo, /id="arcanjo-chakra-caption"/);
  assert.match(arcanjoCss, /button\[title="Encerrar sessão e sair da conta"\]/);
});

test('Diary defaults closed and motion respects the reduced-motion preference', () => {
  const app = read('src/App.tsx');
  const canvas = read('src/components/session/SacredEnergyCanvas.tsx');
  assert.match(app, /const \[isJournalOpen, setIsJournalOpen\] = useState<boolean>\(false\)/);
  assert.match(app, /const \[showDailyDiaryModal, setShowDailyDiaryModal\] = useState<boolean>\(false\)/);
  assert.match(canvas, /prefers-reduced-motion/);
});
