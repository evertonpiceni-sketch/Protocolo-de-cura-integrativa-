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
  assert.match(start, /if \(isMisticoModerno\) stopProtocolFrequency\(\)/);
  assert.match(start, /onStart: \(\) => \{[\s\S]*?prepareFrequencyForNarration/);
  assert.match(start, /onPause: \(\) => \{[\s\S]*?audioEngine\.stopSynth/);
  assert.match(start, /if \(isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno\)[\s\S]*?audioEngine\.stopSynth/);
  assert.match(arcanjo, /const resetPlayback = \(restoreFrequency = false\) => \{[\s\S]*?audioEngine\.stopSynth/);
  assert.match(arcanjo, /const playProtocolFrequency = \(\) => \{[\s\S]*?startArcanjoOwnedSolfeggio/);
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
  const audio = read('src/lib/audio.ts');
  const start = arcanjo.slice(arcanjo.indexOf('const start ='), arcanjo.indexOf('const togglePlayback'));
  const resume = arcanjo.slice(arcanjo.indexOf('const togglePlayback'), arcanjo.indexOf('const selectDay'));
  assert.match(start, /onStart: \(\) => \{[\s\S]*?prepareFrequencyForNarration[\s\S]*?setIsPlaying\(true\)/);
  assert.match(arcanjo, /const prepareFrequencyForNarration = \(\) => \{[\s\S]*?else playProtocolFrequency\(\)/);
  assert.match(arcanjo, /const playProtocolFrequency = \(\) => \{[\s\S]*?startArcanjoOwnedSolfeggio/);
  assert.match(audio, /audio\.onplay = \(\) => \{[\s\S]*?options\.onStart\?\.\(\)/);
  assert.match(resume, /audioEngine\.resumeSpeech\(\)/);
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
  assert.match(modal, /cardBackgroundClass = isMysticCard \? 'bg-\[#0A2742\]'/);
  for (const color of ['#0A2742', '#2E3B73', '#1E6B5A', '#6C3FA0', '#D4AF37', '#E2B96B', '#F4F1EB', '#141F30']) {
    assert.ok(modal.includes(color), 'Missing Místico Moderno board color ' + color);
  }
  assert.match(layouts, /swatches: \['#0A2742', '#6C3FA0', '#D4AF37', '#141F30'\]/);
  assert.match(layouts, /A prancha orienta apenas a atmosfera e a paleta; a jornada vigente permanece com 21 dias e corpo neutro\./);
});


test('Style 4 selector displays the verified official 4:3 board preview without cropping', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const image = read('public/brand/mistico-moderno/prancha-oficial-card.svg');
  assert.match(modal, /MISTICO_MODERNO_OFFICIAL_BOARD = '\/brand\/mistico-moderno\/prancha-oficial-card\.svg'/);
  assert.match(modal, /src=\{MISTICO_MODERNO_OFFICIAL_BOARD\}/);
  assert.match(modal, /src=\{MISTICO_MODERNO_OFFICIAL_BOARD\}[\s\S]*?className="h-full w-full object-contain p-1"/);
  assert.match(image, /width="384" height="288" viewBox="0 0 384 288"/);
  assert.match(image, /preserveAspectRatio="xMidYMid meet"/);
  const embeddedWebp = image.match(/href="data:image\/webp;base64,([^"]+)"/)?.[1] ?? '';
  assert.ok(embeddedWebp.length > 10000, 'The verified official Style 4 board preview must be present.');
  assert.equal(embeddedWebp.length % 4, 0, 'The embedded WebP data URI must contain valid base64.');
  const decodedWebp = Buffer.from(embeddedWebp, 'base64');
  assert.equal(decodedWebp.toString('ascii', 0, 4), 'RIFF', 'The preview payload must be a WebP container.');
  assert.equal(decodedWebp.toString('ascii', 8, 12), 'WEBP', 'The preview payload must be a WebP image.');
});

test('Style 4 home actions and dock stay within the night palette', () => {
  const home = read('src/components/TransformationHome.tsx');
  const css = read('src/mistico-moderno-final-audit.css');
  assert.match(home, /id="journey-choices"/);
  assert.match(home, /className="ep-home-dock[\s\S]*?bg-white\/88/);
  assert.match(css, /:root\[data-layout="mistico-moderno"\] \.ep-home #journey-choices > button/);
  assert.match(css, /:root\[data-layout="mistico-moderno"\] \.ep-home \.ep-home-dock/);
  assert.match(css, /background: linear-gradient\(145deg, rgba\(20,31,48/);
  assert.match(css, /color: var\(--text-primary\) !important/);
});

test('Arcanjo opens only after explicit navigation or successful 7-day checkout', () => {
  const app = read('src/App.tsx');
  const globalAudioSection = app.slice(
    app.indexOf('// Synchronize global audio player'),
    app.indexOf('// Reintegração da Vida owns its audio')
  );
  const gestureSection = app.slice(
    app.indexOf('// Handle autoplay block browser policy unlock on first interaction'),
    app.indexOf('  // ', app.indexOf('// Handle autoplay block browser policy unlock on first interaction') + 5)
  );

  assert.match(app, /const \[showArcanjoView, setShowArcanjoView\] = useState<boolean>\(false\)/);
  assert.match(app, /const isArcanjoViewActive = showArcanjoView;/);
  assert.match(app, /if \(plan === 'arcanjo_7d'\) setShowArcanjoView\(true\);/);
  assert.match(app, /onOpenArcanjo=\{\(\) => \(userProfile\.plan === 'pro' \|\| userProfile\.subscriptionPlan === 'arcanjo_7d'\) \? setShowArcanjoView\(true\) : setShowProModal\(true\)\}/);
  assert.match(globalAudioSection, /!isArcanjoViewActive/);
  assert.match(globalAudioSection, /else if \(!isArcanjoViewActive\)/);
  assert.match(globalAudioSection, /isArcanjoViewActive/);
  assert.match(gestureSection, /!isArcanjoViewActive/);
  assert.match(gestureSection, /isArcanjoViewActive/);
  assert.match(app, /\) : isArcanjoViewActive \? \(\s*<ArcanjoProtocolView/);
  assert.equal((app.match(/allowBackgroundPlayback=\{activeSessionDay === null && !showPersonalJourney && !isArcanjoViewActive\}/g) || []).length, 2);
  assert.doesNotMatch(globalAudioSection, /subscriptionPlan.*arcanjo_7d/);
  assert.doesNotMatch(gestureSection, /subscriptionPlan.*arcanjo_7d/);
});

test('Anamnesis never restarts Solfeggio or selection chimes over Style 4 neural narration', () => {
  const anamnesis = read('src/components/AnamnesisModal.tsx');
  assert.match(anamnesis, /if \(isStyle4VoiceActive \|\| isStyle4AudioDisabled\) return;/);
  assert.match(anamnesis, /const isStyle4VoiceActive = isMisticoModerno && \(isPlayingTherapeuticVoice \|\| isLoadingVoice\)/);
  assert.match(anamnesis, /const playAnamnesisSelectionSound = \(\) =>/);
  assert.equal((anamnesis.match(/audioEngine\.playHeartSelectionChime\(\)/g) || []).length, 1);
  assert.ok((anamnesis.match(/playAnamnesisSelectionSound\(\)/g) || []).length >= 5);
  assert.match(anamnesis, /isOpenRef\.current && isEditingRef\.current && is639HzActiveRef\.current/);
  assert.match(anamnesis, /disabled=\{isStyle4AudioDisabled \|\| isStyle4VoiceActive\}/);
  assert.match(anamnesis, /else if \(isMisticoModerno && userProfile\.audioEnabled/);
});

test('Systemic reflections lock Solfeggio for the full neural voice request and resume only while open', () => {
  const systemic = read('src/components/SystemicQuestionsModal.tsx');
  assert.match(systemic, /if \(\(isMisticoModerno && isReadingVoice\) \|\| isStyle4AudioDisabled\) return;/);
  assert.match(systemic, /setIsReadingVoice\(true\);\s+void audioEngine\.speakWithElevenLabsOrFallback/);
  assert.match(systemic, /isOpenRef\.current && is639HzActiveRef\.current/);
  assert.match(systemic, /disabled=\{isStyle4AudioDisabled \|\| \(isMisticoModerno && isReadingVoice\)\}/);
});

test('Style 4 Anamnesis and Systemic frequency accents stay in the night-and-gold palette', () => {
  const css = read('src/mistico-moderno-guides-audit.css');
  assert.match(css, /:root\[data-layout="mistico-moderno"\] #anamnesis-modal \.ep-anamnesis-frequency/);
  assert.match(css, /linear-gradient\(145deg,rgba\(20,31,48/);
  assert.match(css, /:root\[data-layout="mistico-moderno"\] #systemic-questions-modal \[class\*="bg-emerald-50"\]/);
});

test('Arcanjo ownership blocks global audio without stopping its own Solfeggio', () => {
  const guard = read('src/lib/arcanjoAudioOwnershipPatch.ts');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const wrapperStart = guard.indexOf('audioEngine.startBG =');
  const wrapperEnd = guard.indexOf('const releaseOpeningGuard', wrapperStart);
  const globalStartGuard = guard.slice(wrapperStart, wrapperEnd);

  assert.match(guard, /const ARCANJO_VIEW_MARKER = '#arcanjo-protocol-view'/);
  assert.match(guard, /document\.querySelector\(ARCANJO_VIEW_MARKER\) !== null/);
  assert.doesNotMatch(guard, /img\[alt=/);
  assert.match(arcanjo, /id="arcanjo-protocol-view"/);
  assert.match(guard, /export const startArcanjoOwnedSolfeggio/);
  assert.match(guard, /originalStartBG\(type\)/);
  assert.match(globalStartGuard, /if \(arcanjoOwnsAudio\(\)\) return;/);
  assert.doesNotMatch(globalStartGuard, /audioEngine\.stopBG\(\)/);
  assert.match(guard, /if \(mounted && !arcanjoWasMounted\)/);
  assert.match(arcanjo, /startArcanjoOwnedSolfeggio/);
  assert.doesNotMatch(arcanjo, /audioEngine\.startSynth/);
});

test('Místico Moderno uses only the saved valid neural voice and never substitutes a legacy alias', () => {
  const main = read('src/main.tsx');
  const settings = read('src/components/AudioSettingsModal.tsx');
  assert.doesNotMatch(main, /misticoModernoOfficialVoicePatch/);
  assert.match(settings, /const savedVoiceId = userProfile\.voiceId\?\.trim\(\) \|\| ''/);
  assert.match(settings, /const initialVoiceId = \(isNaturalSereno \|\| isEssenciaLuminosa\) && !isElevenLabsVoiceId\(savedVoiceId\)/);
  assert.match(settings, /if \(requiresNeuralVoice && !isElevenLabsVoiceId\(voiceId\)\)/);
  assert.doesNotMatch(settings, /isMisticoModerno[^\n]*OFFICIAL_PROTOCOL_VOICE_ID/);
});


test('every session requires explicit style confirmation and Appearance never persists a card click', () => {
  const app = read('src/App.tsx');
  const logoutStart = app.indexOf('const handleLogout = async () =>');
  const logoutEnd = app.indexOf('// Retrieve mood description text', logoutStart);
  const appearanceStart = app.indexOf('/* Settings view */');
  const appearanceEnd = app.indexOf('/* PRO VIP Status Card */', appearanceStart);
  const themeStart = app.indexOf('// Never activate a visual theme before the user explicitly confirms a choice.');
  const themeEnd = app.indexOf('// Initialize and load saved state from backend on mount', themeStart);
  const logout = app.slice(logoutStart, logoutEnd);
  const appearance = app.slice(appearanceStart, appearanceEnd);
  const themeEffect = app.slice(themeStart, themeEnd);

  assert.match(app, /const \[layoutConfirmedThisSession, setLayoutConfirmedThisSession\] = useState\(false\)/);
  assert.match(app, /\(!layoutConfirmedThisSession \|\| layoutChoiceRequested\)/);
  assert.match(logout, /setLayoutConfirmedThisSession\(false\)/);
  assert.match(appearance, /onClick=\{\(\) => setLayoutChoiceRequested\(true\)\}/);
  assert.doesNotMatch(appearance, /saveProfile\(\{[\s\S]*?visualLayout/);
  assert.match(themeEffect, /layoutConfirmedThisSession \? OFFICIAL_LAYOUTS\.find/);
});

test('Místico Moderno exposes only the saved ElevenLabs voice and never offers device speech as fallback', () => {
  const settings = read('src/components/AudioSettingsModal.tsx');
  const neuralBranchStart = settings.indexOf('{requiresNeuralVoice ? (');
  const neuralBranchEnd = settings.indexOf(') : voices.length > 0 && (', neuralBranchStart);
  assert.ok(neuralBranchStart >= 0 && neuralBranchEnd > neuralBranchStart, 'Neural voice selector branch must exist.');

  const neuralBranch = settings.slice(neuralBranchStart, neuralBranchEnd);
  assert.match(settings, /const requiresNeuralVoice = isNaturalSereno \|\| isEleganciaProfunda \|\| isEssenciaLuminosa \|\| isMisticoModerno/);
  assert.match(neuralBranch, /Voz neural \(ElevenLabs\)/);
  assert.doesNotMatch(neuralBranch, /Timbre da Voz|Voz Padrão do Sistema|Automática/);
  assert.match(settings, /fallbackToSpeechSynthesis: !requiresNeuralVoice/);
  assert.match(settings, /if \(requiresNeuralVoice && !isElevenLabsVoiceId\(voiceId\)\)/);
});

test('Style 4 preserves the 4:3 official board preview, premium CTA and reduced-motion preference', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const finalCss = read('src/mistico-moderno-final-audit.css');
  assert.match(modal, /aspect-\[4\/3\]/);
  assert.match(modal, /max-w-sm rounded-xl/);
  const confirmButton = modal.split('\n').find(line => line.includes('className={`min-h-12 w-full max-w-sm'));
  assert.ok(confirmButton?.includes('rounded-xl'));
  assert.ok(!confirmButton?.includes('rounded-full'), 'O CTA compartilhado não deve recuperar o formato de pílula.');
  assert.match(finalCss, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(finalCss, /animation-duration: 0\.01ms !important/);
  assert.match(finalCss, /transition-duration: 0\.01ms !important/);
});

test('Style 4 remaps shared semantic theme tokens and cannot inherit Natural Sereno sage values', () => {
  const theme = read('src/approved-theme.css');
  const start = theme.indexOf(':root[data-layout="mistico-moderno"]{');
  const end = theme.indexOf('\n}\n\n:root[data-layout]{', start);
  assert.ok(start >= 0 && end > start, 'The Style 4 token block must exist.');

  const style4Tokens = theme.slice(start, end);
  assert.match(style4Tokens, /--layout-bg:#0A2742/);
  assert.match(style4Tokens, /--layout-accent-soft:rgba\(108,63,160,.16\)/);
  assert.match(style4Tokens, /--layout-gold-soft:rgba\(212,175,55,.16\)/);
  assert.match(style4Tokens, /--layout-text-soft:var\(--layout-text-secondary\)/);
  assert.match(style4Tokens, /--sage-subtle:var\(--layout-accent-soft\)/);
  assert.match(style4Tokens, /--sage-border:var\(--layout-border\)/);
  assert.match(style4Tokens, /--journey-sage:var\(--layout-accent\)/);
  assert.match(style4Tokens, /--journey-gold:var\(--layout-gold\)/);
  assert.match(style4Tokens, /--journey-bg-canvas:var\(--layout-canvas\)/);
  assert.doesNotMatch(style4Tokens, /#5E7153|#7E9473|#D5DDD1|#8F631E/);
});


test('Místico Moderno keeps Arcanjo progress markers in the night palette', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const css = read('src/mistico-moderno-arcanjo-audit.css');

  assert.match(arcanjo, /data-arcanjo-day-marker/);
  assert.match(arcanjo, /data-current=\{diaAtual===day \? 'true' : 'false'\}/);
  assert.match(arcanjo, /data-completed=\{done \? 'true' : 'false'\}/);
  assert.match(css, /arcanjo-chakra-caption[\s\S]*?text-\[#c8d9cd\][\s\S]*?color: #BAC3D1/);
  assert.match(css, /button\[aria-label\^="Abrir dia"\][\s\S]*?background: #2E3B73/);
  assert.match(css, /button\[data-completed="true"\][\s\S]*?background: #6C3FA0/);
  assert.match(css, /button\[data-current="true"\][\s\S]*?background: #D4AF37/);
});


test('Místico Moderno mantém as duas superfícies do Diário na paleta noturna sem gradiente dourado em badges', () => {
  const css = read('src/mistico-moderno-daily-diary-audit.css');
  const main = read('src/main.tsx');
  const diary = read('src/components/DailyDiaryModal.tsx');

  assert.match(main, /import '\.\/mistico-moderno-daily-diary-audit\.css';/);
  assert.match(main, /import '\.\/mistico-moderno-journal-audit\.css';/);
  assert.match(diary, /id="daily-diary-modal"/);

  for (const selector of [
    'html[data-layout="mistico-moderno"] #daily-diary-modal [class~="bg-emerald-50"]',
    'html[data-layout="mistico-moderno"] #daily-diary-modal [class~="border-emerald-200"]',
    'html[data-layout="mistico-moderno"] #daily-diary-modal [class~="text-emerald-700"]',
    'html[data-layout="mistico-moderno"] #daily-diary-modal [class~="bg-amber-50"]',
    'html[data-layout="mistico-moderno"] #daily-diary-modal [class~="border-amber-200"]',
    'html[data-layout="mistico-moderno"] #daily-diary-modal [class~="text-amber-700"]',
    'html[data-layout="mistico-moderno"] #daily-diary-modal [class~="border-purple-500/20"]',
    'html[data-layout="mistico-moderno"] #daily-diary-modal [class~="text-purple-400"]',
    'html[data-layout="mistico-moderno"] #daily-diary-modal button[class~="hover:bg-slate-700"]:hover',
    'html[data-layout="mistico-moderno"] #daily-diary-modal textarea:focus'
  ]) {
    assert.ok(css.includes(selector), 'Missing scoped Diário treatment: ' + selector);
  }

  assert.ok(css.includes('button[class*="bg-[#B88736]"]'), 'Gold gradient must be limited to CTA buttons.');
  assert.ok(css.includes('#daily-diary-modal [class*="bg-[#B88736]/"]'), 'Translucent gold badges must use a subtle surface.');
  assert.ok(!css.includes('#daily-diary-modal [class*="bg-[#B88736]"] {'), 'Broad gold selector would overpaint non-button badges.');
});


test('Místico Moderno applies premium styling and readable contrast to global floating actions', () => {
  const app = read('src/App.tsx');
  const css = read('src/mistico-moderno-final-audit.css');
  const main = read('src/main.tsx');

  assert.ok(main.includes("import './mistico-moderno-final-audit.css';"));
  assert.ok(app.includes('id="floating-whatsapp-btn"\n        aria-label="Fale Conosco"'));
  assert.ok(css.includes(':root[data-layout="mistico-moderno"] #floating-whatsapp-btn'));
  assert.ok(css.includes('border-radius: 1rem !important'));
  assert.ok(css.includes('background: linear-gradient(145deg, #141F30 0%, #0A2742 100%) !important'));
  assert.ok(css.includes('#floating-whatsapp-btn svg'));
  assert.ok(css.includes('color: #E2B96B !important'));
  assert.ok(css.includes(':root[data-layout="mistico-moderno"] .ep-app-toast h4'));
  assert.ok(css.includes(':root[data-layout="mistico-moderno"] .ep-app-toast p'));
  assert.ok(css.includes('color: #CBD5E1 !important'));
});


test('Místico Moderno neutraliza a névoa sálvia global sem remover o esmeralda integrado à natureza', () => {
  const css = read('src/mistico-moderno-final-audit.css');
  const theme = read('src/approved-theme.css');
  const start = css.indexOf(':root[data-layout="mistico-moderno"] body::before');
  const end = css.indexOf('}', start);
  assert.ok(start >= 0 && end > start, 'O override de atmosfera do Estilo 4 deve existir.');
  const rule = css.slice(start, end);
  assert.match(rule, /rgba\(108,63,160,\.10\)/);
  assert.match(rule, /rgba\(212,175,55,\.06\)/);
  assert.doesNotMatch(rule, /94,\s*113,\s*83/, 'A névoa sálvia global não pode reaparecer no Estilo 4.');
  const style4Start = theme.lastIndexOf(':root[data-layout="mistico-moderno"]{');
  const style4End = theme.indexOf('\n}', style4Start);
  const style4Theme = theme.slice(style4Start, style4End);
  assert.match(style4Theme, /--ep-scene-overlay:[\s\S]*rgba\(30,107,90,\.07\)/, 'O esmeralda permanece apenas como acento integrado à composição natural.');
});


test('Místico Moderno Arcanjo status identifies neural narration with concurrent Solfeggio', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const statusStart = arcanjo.indexOf('role="status" aria-live="polite"');
  const statusEnd = arcanjo.indexOf('</span>', statusStart);
  const status = arcanjo.slice(statusStart, statusEnd);
  const style4Start = status.indexOf(': isMisticoModerno');
  const style4End = status.indexOf(': suspendsSolfeggioDuringNeuralNarration', style4Start);
  const style4Status = status.slice(style4Start, style4End);

  assert.match(arcanjo, /const suspendsSolfeggioDuringNeuralNarration = isEleganciaProfunda \|\| isEssenciaLuminosa/);
  assert.ok(style4Start >= 0 && style4End > style4Start, 'O ramo de status do Místico Moderno deve ser isolado.');
  assert.match(style4Status, /Preparando narração neural — Solfeggio/);
  assert.match(style4Status, /Narração neural \+ Solfeggio/);
  assert.match(style4Status, /Narração pausada — Solfeggio/);
  assert.match(style4Status, /será ativado somente quando a narração neural começar/);
  assert.doesNotMatch(style4Status, /Voz humana \+ Solfeggio/);
});


test('Místico Moderno aplica paleta noturna própria à animação da sessão e remove o véu marfim herdado', () => {
  const session = read('src/components/MeditationSession.tsx');
  const canvas = read('src/components/session/SacredEnergyCanvas.tsx');
  const css = read('src/mistico-moderno-session-audit.css');

  assert.match(session, /const MISTICO_MODERNO_CANVAS_THEME = \{/);
  assert.match(session, /isMisticoModerno \? MISTICO_MODERNO_CANVAS_THEME : undefined/);
  assert.match(canvas, /colorTheme\?\.violetGlow \?\? palette\?\.goldGlow/);
  assert.match(canvas, /colorTheme\?\.indigoGlow \?\? palette\?\.sageGlow/);
  assert.match(canvas, /colorTheme\?\.emeraldLine \?\? palette\?\.goldLine/);
  assert.match(css, /:root\[data-layout="mistico-moderno"\] #meditation-session \.ep-session-light-overlay/);
  assert.match(css, /rgba\(108,63,160,\.14\)/);
  const overlayStart = css.indexOf(':root[data-layout="mistico-moderno"] #meditation-session .ep-session-light-overlay');
  const overlayEnd = css.indexOf('}', overlayStart);
  assert.ok(overlayStart >= 0 && overlayEnd > overlayStart, 'O override do véu da sessão deve existir.');
  assert.doesNotMatch(css.slice(overlayStart, overlayEnd), /#FAF7F2|#F4EFE6/, 'O véu claro do player compartilhado não pode reaparecer no Estilo 4.');
});


test('Místico Moderno mantém a sessão noturna em check-in, aceite, roteiro, player e conclusão', () => {
  const css = read('src/mistico-moderno-session-audit.css');
  for (const selector of [
    '#meditation-session footer',
    '.ep-session-checkin > div',
    '.ep-acceptance-portal > div',
    '[role="dialog"][aria-label="Roteiro da sessão"] > div:last-child',
    '[role="dialog"][aria-label="Sessão concluída"] > div',
    '.ns-play-toggle',
    '.ep-protocol-progress',
    'button[aria-pressed="true"]'
  ]) {
    assert.ok(css.includes(selector), `Missing Style 4 session treatment: ${selector}`);
  }
  assert.match(css, /linear-gradient\(135deg,#B88736,#E2B96B\)/);
  assert.match(css, /rgba\(108,63,160,.20\)/);
  assert.match(css, /\[class\*="bg-rose-50"\]/);
  assert.match(css, /div\[role="dialog"\]\[aria-label="Acesso à jornada completa"\] \[class\*="bg-\[#FAF4E8\]"\]/);
  assert.doesNotMatch(css, /background:\s*(?:#FAF7F2|#F4EFE6|white)/i);
});

test('Anamnesis excludes every Solfeggio frequency when restoring background audio', () => {
  const anamnesis = read('src/components/AnamnesisModal.tsx');
  assert.ok(anamnesis.includes("!/^\\d+hz$/i.test(userProfile.bgMusicType)"));
  assert.equal(anamnesis.includes("!/^\\\\d+hz$/i.test(userProfile.bgMusicType)"), false);
});

test('Místico Moderno passes the current day to the session canvas for its Day 1 opening', () => {
  const session = read('src/components/MeditationSession.tsx');
  const canvas = read('src/components/session/SacredEnergyCanvas.tsx');
  assert.ok(session.includes("dayNumber={['natural-sereno', 'elegancia-profunda', 'essencia-luminosa', 'mistico-moderno'].includes(activeLayout || '') ? dayNumber : undefined}"));
  assert.ok(canvas.includes('dayNumber === 1 ? 0 : 8'));
});


test('Style 4 respects the global audio-disabled setting in Anamnesis and Systemic Solfeggio', () => {
  const anamnesis = read('src/components/AnamnesisModal.tsx');
  const systemic = read('src/components/SystemicQuestionsModal.tsx');

  assert.match(anamnesis, /isStyle4AudioDisabled = isMisticoModerno && userProfile\.audioEnabled === false/);
  assert.match(anamnesis, /isEditing && is639HzActive && !isStyle4AudioDisabled/);
  assert.match(anamnesis, /if \(isStyle4VoiceActive \|\| isStyle4AudioDisabled\) return/);
  assert.match(anamnesis, /!isStyle4AudioDisabled && isOpenRef\.current && isEditingRef\.current/);
  assert.match(anamnesis, /disabled=\{isStyle4AudioDisabled \|\| isStyle4VoiceActive\}/);
  assert.match(anamnesis, /Áudio desativado nas configurações/);
  assert.match(anamnesis, /audioEnabledRef\.current/);
  assert.match(anamnesis, /bgMusicTypeRef\.current/);

  assert.match(systemic, /isStyle4AudioDisabled = isMisticoModerno && userProfile\?\.audioEnabled === false/);
  assert.match(systemic, /is639HzActive && !isStyle4AudioDisabled/);
  assert.match(systemic, /\(\(isMisticoModerno && isReadingVoice\) \|\| isStyle4AudioDisabled\) return/);
  assert.match(systemic, /!isStyle4AudioDisabled && isOpenRef\.current/);
  assert.match(systemic, /disabled=\{isStyle4AudioDisabled \|\| \(isMisticoModerno && isReadingVoice\)\}/);
  assert.match(systemic, /Áudio desativado nas configurações/);
  assert.match(systemic, /audioEnabledRef\.current/);
  assert.match(systemic, /bgMusicTypeRef\.current/);
});


test('Style 4 never restarts 639 Hz over neural narration or after audio is disabled mid-request', () => {
  const anamnesis = read('src/components/AnamnesisModal.tsx');
  const systemic = read('src/components/SystemicQuestionsModal.tsx');

  assert.match(anamnesis, /isEditing && is639HzActive && !isStyle4AudioDisabled && !isStyle4VoiceActive/);
  assert.match(anamnesis, /\[isOpen, isEditing, is639HzActive, isStyle4VoiceActive, userProfile\.audioEnabled, userProfile\.bgMusicType\]/);
  const anamnesisResumeStart = anamnesis.indexOf('const resumeStyle4AnamnesisSolfeggio');
  const anamnesisResumeEnd = anamnesis.indexOf('const stopTherapeuticVoice', anamnesisResumeStart);
  assert.ok(anamnesisResumeStart >= 0 && anamnesisResumeEnd > anamnesisResumeStart);
  assert.match(anamnesis.slice(anamnesisResumeStart, anamnesisResumeEnd), /audioEnabledRef\.current !== false/);

  assert.match(systemic, /is639HzActive && !isStyle4AudioDisabled && !\(isMisticoModerno && isReadingVoice\)/);
  assert.match(systemic, /\[isOpen, is639HzActive, isReadingVoice, userProfile\?\.audioEnabled, userProfile\?\.bgMusicType\]/);
  const systemicResumeStart = systemic.indexOf('const resumeStyle4SystemicSolfeggio');
  const systemicResumeEnd = systemic.indexOf('const handleCloseModal', systemicResumeStart);
  assert.ok(systemicResumeStart >= 0 && systemicResumeEnd > systemicResumeStart);
  assert.match(systemic.slice(systemicResumeStart, systemicResumeEnd), /audioEnabledRef\.current !== false/);
});


test('o player do Místico Moderno respeita áudio global desligado e não carrega o mute para a próxima tela', () => {
  const app = read('src/App.tsx');
  const session = read('src/components/MeditationSession.tsx');
  const policy = read('src/lib/protocolSessionAudioPolicy.ts');

  const sessionStart = app.indexOf('<MeditationSession');
  const sessionEnd = app.indexOf('/>', sessionStart);
  assert.ok(sessionStart >= 0 && sessionEnd > sessionStart);
  assert.ok(app.slice(sessionStart, sessionEnd).includes('audioEnabled={userProfile.audioEnabled !== false}'));
  assert.ok(session.includes('audioEnabled?: boolean'));
  assert.ok(session.includes('audioEnabled = true'));
  assert.ok(session.includes('shouldPlayProtocolSessionBackground(sessionPhase, bgMusicType, audioEnabled)'));
  assert.ok(session.includes('audioEngine.setMasterVolume(1.0)'));
  assert.ok(policy.includes('audioEnabled = true'));
  assert.ok(policy.includes("return audioEnabled && sessionPhase === 'playing'"));
});

test('Místico Moderno preserves the global audio-off preference when Anamnesis is saved', () => {
  const app = read('src/App.tsx');
  const start = app.indexOf('const handleSaveAnamnesis');
  const end = app.indexOf('// Save purchased / requested specific individual treatment', start);
  assert.ok(start >= 0 && end > start, 'Expected the Anamnesis save handler to be present.');
  const handler = app.slice(start, end);
  assert.match(handler, /audioEnabled:\s*isMisticoModerno\s*\?\s*userProfile\.audioEnabled !== false\s*:\s*true/);
});
