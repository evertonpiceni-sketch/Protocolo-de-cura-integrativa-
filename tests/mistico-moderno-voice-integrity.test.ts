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
  assert.match(home, /approvedVoiceId = isEleganciaProfunda[\s\S]*?: isMisticoModerno/);
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


test('Místico Moderno blocks Solfeggio changes during neural voice preview and uses its saved voice in the player', () => {
  const settings = read('src/components/AudioSettingsModal.tsx');
  const player = read('src/components/MeditationSession.tsx');
  assert.match(settings, /isStyle4SolfeggioBlocked = isMisticoModerno && isTestingVoice && isSolfeggioFrequency\(track\.id\)/);
  assert.match(settings, /isTrackBlockedDuringVoicePreview = isStyle3SolfeggioBlocked \|\| isStyle2SolfeggioBlocked \|\| isStyle4SolfeggioBlocked/);
  assert.match(player, /const style4VoiceId = isElevenLabsVoiceId\(selectedVoiceId\) \? selectedVoiceId : ''/);
  assert.match(player, /isMisticoModerno && !style4VoiceId/);
  assert.match(player, /isMisticoModerno\s*\?\s*style4VoiceId/);
});


test('Místico Moderno mantém a voz neural nas práticas legadas e suspende 639 Hz durante a fala', () => {
  const anamnesis = read('src/components/AnamnesisModal.tsx');
  const systemic = read('src/components/SystemicQuestionsModal.tsx');
  const hooponopono = read('src/components/HooponoponoModal.tsx');
  const archangelPrayer = read('src/components/ArchangelMichaelPrayerModal.tsx');

  assert.match(anamnesis, /if \(isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno\)/);
  assert.match(anamnesis, /resumeStyle4AnamnesisSolfeggio/);
  assert.match(anamnesis, /isMisticoModerno && audioEngine\.getCurrentSynthType\(\) === '639hz'/);
  assert.match(anamnesis, /!isEleganciaProfunda && !isEssenciaLuminosa && !isMisticoModerno/);
  assert.match(anamnesis, /fallbackToSpeechSynthesis: false/);

  assert.match(systemic, /if \(isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno\)/);
  assert.match(systemic, /resumeStyle4SystemicSolfeggio/);
  assert.match(systemic, /isMisticoModerno && audioEngine\.getCurrentSynthType\(\) === '639hz'/);
  assert.match(systemic, /fallbackToSpeechSynthesis: false/);

  assert.match(hooponopono, /if \(\(isEleganciaProfunda \|\| isMisticoModerno\) && !isElevenLabsVoiceId/);
  assert.match(hooponopono, /fallbackToSpeechSynthesis: !\(isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno\)/);
  assert.match(archangelPrayer, /if \(\(isEleganciaProfunda \|\| isMisticoModerno\) && !isElevenLabsVoiceId/);
  assert.match(archangelPrayer, /fallbackToSpeechSynthesis: !\(isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno\)/);
});



test('Style 4 resumes Arcanjo Solfeggio only after the neural audio actually plays', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const start = arcanjo.slice(arcanjo.indexOf('const start ='), arcanjo.indexOf('const togglePlayback'));
  const resume = arcanjo.slice(arcanjo.indexOf('const togglePlayback'), arcanjo.indexOf('const selectDay'));
  assert.match(start, /onStart: \(\) => \{[\s\S]*?audioEngine\.startSynth[\s\S]*?setIsPlaying\(true\)/);
  assert.match(resume, /audioEngine\.resumeSpeech\(\);\s*if \(!isMisticoModerno\)/);
  assert.doesNotMatch(resume, /audioEngine\.resumeSpeech\(\);\s*audioEngine\.startSynth/);
});

test('closing Anamnesis does not restart 639 Hz during teardown', () => {
  const anamnesis = read('src/components/AnamnesisModal.tsx');
  assert.match(anamnesis, /stopTherapeuticVoice\(false\)/);
  assert.match(anamnesis, /const stopTherapeuticVoice = \(resumeSolfeggio = true\)/);
  assert.match(anamnesis, /if \(resumeSolfeggio\) resumeStyle4AnamnesisSolfeggio\(\)/);
});

test('Style 4 selector uses the complete night palette from the official reference', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const layouts = read('src/config/layouts.ts');
  assert.match(modal, /const isMysticCard = layout\.id === 'mistico-moderno'/);
  assert.match(modal, /cardBackgroundClass = isMysticCard \? 'bg-\[#0A0F18\]'/);
  for (const color of ['#0A2742', '#2E3B73', '#1E6B5A', '#6C3FA0', '#D4AF37', '#E2B96B', '#F4F1EB', '#6F8F55']) {
    assert.ok(modal.includes(color), 'Missing Místico Moderno board color ' + color);
  }
  assert.match(layouts, /swatches: \['#0A2742', '#6C3FA0', '#D4AF37', '#141F30'\]/);
});


test('Style 4 selector displays the official board thumbnail from the exact reference', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const image = readFileSync(resolve(root, 'public/brand/mistico-moderno/prancha-oficial-card.webp'));
  assert.match(modal, /MISTICO_MODERNO_OFFICIAL_BOARD = '\/brand\/mistico-moderno\/prancha-oficial-card\.webp'/);
  assert.match(modal, /src=\{MISTICO_MODERNO_OFFICIAL_BOARD\}/);
  assert.ok(image.byteLength > 10000, 'The official Style 4 board thumbnail must be present.');
});

test('Arcanjo subscription keeps global background audio from starting outside its own player', () => {
  const app = read('src/App.tsx');
  assert.equal((app.match(/userProfile\.subscriptionPlan !== 'arcanjo_7d'/g) || []).length, 2);
});
