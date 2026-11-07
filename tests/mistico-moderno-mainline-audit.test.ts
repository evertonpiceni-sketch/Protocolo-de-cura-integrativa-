import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('Místico Moderno uses its own official board in the four-style selector', () => {
  assert.equal(existsSync(resolve(root, 'public/brand/mistico-moderno/prancha-oficial.webp')), true);
  const modal = readFileSync(resolve(root, 'src/components/LayoutChoiceModal.tsx'), 'utf8');
  assert.match(modal, /\/brand\/mistico-moderno\/prancha-oficial\.webp/);
  assert.match(modal, /const isMysticCard = layout\.id === 'mistico-moderno'/);
  assert.match(modal, /bg-\[#0A0F18\]/);
  assert.match(modal, /useState<LayoutId \| null>\(null\)/);
  assert.match(modal, /disabled=\{!selectedLayout \|\| isSaving\}/);
  const app = readFileSync(resolve(root, 'src/App.tsx'), 'utf8');
  assert.match(app, /onClick=\{\(\) => setLayoutChoiceRequested\(true\)\}/);
  assert.match(app, /const selected = layoutConfirmedThisSession \? OFFICIAL_LAYOUTS\.find/);
});

test('logout discards the previous account layout confirmation', () => {
  const app = readFileSync(resolve(root, 'src/App.tsx'), 'utf8');
  const start = app.indexOf('const handleLogout');
  const end = app.indexOf('// Retrieve mood description text', start);
  assert.ok(start >= 0 && end > start);
  const logout = app.slice(start, end);
  assert.match(logout, /setLayoutConfirmedThisSession\(false\)/);
  assert.match(logout, /setLayoutChoiceRequested\(false\)/);
  assert.match(logout, /delete document\.documentElement\.dataset\.layout/);
});

test('Arcanjo receives an isolated night treatment only when Style 4 is active', () => {
  const main = readFileSync(resolve(root, 'src/main.tsx'), 'utf8');
  const view = readFileSync(resolve(root, 'src/components/ArcanjoProtocolView.tsx'), 'utf8');
  const css = readFileSync(resolve(root, 'src/mistico-moderno-arcanjo-audit.css'), 'utf8');
  assert.match(main, /import '\.\/mistico-moderno-arcanjo-audit\.css';/);
  assert.match(view, /id="arcanjo-protocol-view"/);
  assert.match(view, /id="arcanjo-protocol-backdrop"/);
  assert.match(view, /id="arcanjo-chakra-stage"/);
  assert.match(view, /id="arcanjo-chakra-caption"/);
  assert.match(css, /:root\[data-layout="mistico-moderno"\]/);
  assert.doesNotMatch(css, /^\s*(?:body|html|#root)\s*\{/m);
});

test('all imported Místico Moderno CSS modules remain scoped to the active layout', () => {
  const main = readFileSync(resolve(root, 'src/main.tsx'), 'utf8');
  const imports = [...main.matchAll(/import '\.\/(mistico-moderno-[^']+\.css)';/g)].map(match => match[1]);
  assert.ok(imports.length >= 23, `Expected the existing 22 modules plus Arcanjo; found ${imports.length}.`);
  for (const filename of imports) {
    const css = readFileSync(resolve(root, 'src', filename), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const blocks = [...css.matchAll(/([^{}]+)\{/g)].map(match => match[1].trim().replace(/\s+/g, ' '));
    const selectors = blocks.filter(selector => selector && !selector.startsWith('@') && !/^(from|to|\d+%)/.test(selector));
    const unscoped = selectors.filter(selector => !selector.includes('data-layout="mistico-moderno"'));
    assert.deepEqual(unscoped, [], `${filename} contains a selector outside the Místico Moderno scope.`);
  }
});


test('Style 4 honors the saved neural voice selection and blocks browser speech fallback', () => {
  const app = readFileSync(resolve(root, 'src/App.tsx'), 'utf8');
  const home = readFileSync(resolve(root, 'src/components/TransformationHome.tsx'), 'utf8');
  const settings = readFileSync(resolve(root, 'src/components/AudioSettingsModal.tsx'), 'utf8');
  const session = readFileSync(resolve(root, 'src/components/MeditationSession.tsx'), 'utf8');
  const arcanjo = readFileSync(resolve(root, 'src/components/ArcanjoProtocolView.tsx'), 'utf8');
  const patch = readFileSync(resolve(root, 'src/lib/misticoModernoOfficialVoicePatch.ts'), 'utf8');
  const main = readFileSync(resolve(root, 'src/main.tsx'), 'utf8');

  assert.match(app, /const isMisticoModerno = layoutConfirmedThisSession && userProfile\?\.visualLayout === 'mistico-moderno'/);
  assert.match(app, /usesNeuralVoiceCatalog = isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno/);
  assert.match(app, /if \(isEleganciaProfunda \|\| isMisticoModerno\)/);
  assert.match(app, /voiceId: userProfile\.voiceId/);
  assert.match(app, /fallbackToSpeechSynthesis: false/);

  assert.match(home, /requiresNeuralVoice = isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno/);
  assert.match(home, /const approvedVoiceId = isEleganciaProfunda \|\| isMisticoModerno/);
  assert.match(home, /const narrationVoiceId = usesSavedVoiceSettings \? approvedVoiceId : 'Marcus'/);
  assert.match(home, /fallbackToSpeechSynthesis: !requiresNeuralVoice/);

  assert.match(settings, /const requiresNeuralVoice = isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno/);
  assert.match(settings, /const initialVoiceId = isEssenciaLuminosa && !isElevenLabsVoiceId\(savedVoiceId\)/);
  assert.match(settings, /value=\{voiceId\}/);
  assert.doesNotMatch(settings, /Voz oficial aprovada|Esta voz permanece fixa neste estilo/);
  assert.doesNotMatch(settings, /voiceId: isMisticoModerno \? OFFICIAL_PROTOCOL_VOICE_ID/);

  assert.match(session, /const style4VoiceId = isElevenLabsVoiceId\(selectedVoiceId\) \? selectedVoiceId : ''/);
  assert.match(session, /activeLayout === 'mistico-moderno' && !style4VoiceId/);
  assert.match(session, /isMisticoModerno\s*\?\s*style4VoiceId/);
  assert.match(session, /MISTICO_MODERNO_CANVAS_THEME/);

  assert.match(arcanjo, /if \(\(isEleganciaProfunda \|\| isMisticoModerno\) && !isElevenLabsVoiceId\(userProfile\.voiceId\)\)/);
  assert.match(arcanjo, /voiceId: isEleganciaProfunda \|\| isMisticoModerno\s*\? userProfile\.voiceId/);
  assert.match(arcanjo, /requireExplicitVoiceId: isEleganciaProfunda \|\| isMisticoModerno/);
  assert.match(arcanjo, /if \(isEleganciaProfunda \|\| isMisticoModerno\)/);

  assert.match(patch, /isElevenLabsVoiceId/);
  assert.match(patch, /fallbackToSpeechSynthesis: false/);
  assert.match(patch, /requireExplicitVoiceId: true/);
  assert.doesNotMatch(patch, /OFFICIAL_PROTOCOL_VOICE_ID/);
  assert.match(main, /import '\.\/lib\/misticoModernoOfficialVoicePatch';/);
});


test('Solfeggio stays stopped during spoken protocol playback and the Diary stays closed by default', () => {
  const policy = readFileSync(resolve(root, 'src/lib/protocolSessionAudioPolicy.ts'), 'utf8');
  const app = readFileSync(resolve(root, 'src/App.tsx'), 'utf8');
  const canvas = readFileSync(resolve(root, 'src/components/session/SacredEnergyCanvas.tsx'), 'utf8');

  assert.match(policy, /sessionPhase === 'playing' && type !== 'none' && !isSolfeggioFrequency/);
  assert.match(app, /const \[isJournalOpen, setIsJournalOpen\] = useState<boolean>\(false\)/);
  assert.match(app, /const \[showDailyDiaryModal, setShowDailyDiaryModal\] = useState<boolean>\(false\)/);
  assert.match(canvas, /prefers-reduced-motion/);
  assert.match(canvas, /particleGold/);
  assert.match(canvas, /particleAccent/);
});

test('Style 4 board is the recovered official 4:3 reference and its palette remains complete', () => {
  const boardPath = resolve(root, 'public/brand/mistico-moderno/prancha-oficial.webp');
  assert.equal(existsSync(boardPath), true);
  const board = readFileSync(boardPath);
  assert.equal(board.toString('ascii', 0, 4), 'RIFF');
  assert.equal(board.toString('ascii', 8, 12), 'WEBP');
  assert.equal(board.toString('ascii', 12, 16), 'VP8 ');
  const boardWidth = board.readUInt16LE(26) & 0x3fff;
  const boardHeight = board.readUInt16LE(28) & 0x3fff;
  assert.equal(boardWidth, 256);
  assert.equal(boardHeight, 192);
  assert.equal(boardWidth / boardHeight, 4 / 3);

  const modal = readFileSync(resolve(root, 'src/components/LayoutChoiceModal.tsx'), 'utf8');
  for (const color of ['#0A2742', '#2E3B73', '#1E6B5A', '#6C3FA0', '#D4AF37', '#E2B96B', '#F4F1EB', '#6F8F55']) {
    assert.ok(modal.includes(color), `Missing official Style 4 swatch ${color}`);
  }
  assert.match(modal, /object-contain/);
  assert.match(modal, /\/brand\/mistico-moderno\/prancha-oficial\.webp/);
});

test('the official logo remains a transparent signature and Style 4 header has no rose logout treatment', () => {
  const approved = readFileSync(resolve(root, 'src/mistico-moderno-approved-overrides.css'), 'utf8');
  const dashboard = readFileSync(resolve(root, 'src/mistico-moderno-dashboard-audit.css'), 'utf8');
  const header = readFileSync(resolve(root, 'src/mistico-moderno-header-audit.css'), 'utf8');
  const courses = readFileSync(resolve(root, 'src/mistico-moderno-courses-audit.css'), 'utf8');
  const contact = readFileSync(resolve(root, 'src/components/ContactModal.tsx'), 'utf8');
  const coursesModal = readFileSync(resolve(root, 'src/components/CoursesModal.tsx'), 'utf8');

  assert.match(approved, /\.ep-brand-signature-wrap[\s\S]*?background:\s*transparent/);
  assert.match(approved, /\.ep-brand-signature[\s\S]*?opacity:\s*\.30/);
  assert.doesNotMatch(dashboard, /\.ep-brand-signature\s*\{[^}]*opacity:\s*\.34/);
  assert.match(header, /#header-btn-logout/);
  assert.doesNotMatch(header, /rose-/);
  assert.match(courses, /\.ep-brand-signature/);
  assert.match(contact, /ep-brand-signature-wrap/);
  assert.match(contact, /ep-brand-signature/);
  assert.match(coursesModal, /ep-brand-signature-wrap/);
  assert.match(coursesModal, /ep-brand-signature/);
});
