import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { shouldPlayProtocolSessionBackground } from '../src/lib/protocolSessionAudioPolicy';
import { specificTreatmentQuote } from '../src/lib/paymentCatalog';

test('Estilo 4 usa a prancha oficial no card e uma superfície noturna própria', () => {
  const modal = fs.readFileSync('src/components/LayoutChoiceModal.tsx', 'utf8');
  const board = ['mistico-moderno-prancha.b64', 'mistico-moderno-prancha-2.b64', 'mistico-moderno-prancha-3.b64', 'mistico-moderno-prancha-4.b64', 'mistico-moderno-prancha-5.b64'].map(file => fs.readFileSync(`src/assets/${file}`, 'utf8').trim()).join('');
  assert.ok(modal.includes("misticoBoardBase64 from '../assets/mistico-moderno-prancha.b64?raw'"));
  assert.ok(modal.includes("misticoBoardBase64Part2 from '../assets/mistico-moderno-prancha-2.b64?raw'"));
  assert.ok(modal.includes("misticoBoardBase64Part3 from '../assets/mistico-moderno-prancha-3.b64?raw'"));
  assert.ok(modal.includes("misticoBoardBase64Part4 from '../assets/mistico-moderno-prancha-4.b64?raw'"));
  assert.ok(modal.includes("misticoBoardBase64Part5 from '../assets/mistico-moderno-prancha-5.b64?raw'"));
  assert.ok(modal.includes("layout.id === 'mistico-moderno' ? '#EDDEC2'"));
  assert.ok(modal.includes('MISTICO_MODERNO_OFFICIAL_BOARD'));
  assert.ok(modal.includes('src={MISTICO_MODERNO_OFFICIAL_BOARD}'));
  assert.ok(modal.includes("backgroundColor: '#00142D'"));
  const theme = fs.readFileSync('src/approved-theme.css', 'utf8');
  const layouts = fs.readFileSync('src/config/layouts.ts', 'utf8');
  assert.ok(theme.includes('--layout-indigo:#0D0D3F;'));
  assert.ok(theme.includes('--layout-emerald:#003F2C;'));
  assert.ok(theme.includes('--layout-violet:#4D29B1;'));
  assert.ok(theme.includes('--layout-amber:#DB6C12;'));
  assert.ok(theme.includes('--layout-text:#EDDEC2;'));
  assert.ok(layouts.includes("swatches: ['#00142D', '#4D29B1', '#E8AA3B', '#003F2C']"));
  assert.ok(modal.includes("bg-[#00142D] text-[#EDDEC2]"));
  assert.ok(board.startsWith('UklGR'), 'a referência deve ser um WebP real, não um placeholder');
  assert.ok(board.length === 44388, 'a prancha oficial WebP 384×288 deve permanecer íntegra ao ser montada em partes');
});

test('os quatro estilos exigem escolha e confirmação explícitas nesta sessão', () => {
  const modal = fs.readFileSync('src/components/LayoutChoiceModal.tsx', 'utf8');
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(modal.includes('O estilo só será aplicado depois da sua confirmação.'));
  assert.ok(app.includes('const [layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false);'));
  assert.ok(app.includes('const selected = layoutConfirmedThisSession ? OFFICIAL_LAYOUTS.find'));
  assert.ok(app.includes('delete document.documentElement.dataset.layout'));
});

test('os módulos visuais do Místico estão carregados e isolados por data-layout', () => {
  const main = fs.readFileSync('src/main.tsx', 'utf8');
  const modules = [...main.matchAll(/import ['"]\.\/(mistico-moderno[^'"]+\.css)['"]/g)].map(match => match[1]);
  assert.ok(modules.length >= 23, 'a camada Arcanjo deve estar incluída junto aos módulos já aprovados');
  for (const module of modules) {
    const css = fs.readFileSync(`src/${module}`, 'utf8');
    assert.ok(css.includes('data-layout="mistico-moderno"'), `${module} precisa permanecer isolado no Estilo 4`);
  }
  const arcanjo = fs.readFileSync('src/mistico-moderno-arcanjo-audit.css', 'utf8');
  assert.ok(arcanjo.includes('#arcanjo-protocol-view'));
  assert.ok(arcanjo.includes('prefers-reduced-motion'));
});

test('o Místico respeita a voz neural salva sem forçar Marianne, Rachel, Marcus ou Web Speech', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  const main = fs.readFileSync('src/main.tsx', 'utf8');
  const home = fs.readFileSync('src/components/TransformationHome.tsx', 'utf8');
  const settings = fs.readFileSync('src/components/AudioSettingsModal.tsx', 'utf8');
  const session = fs.readFileSync('src/components/MeditationSession.tsx', 'utf8');
  const arcanjo = fs.readFileSync('src/components/ArcanjoProtocolView.tsx', 'utf8');
  const systemic = fs.readFileSync('src/components/SystemicQuestionsModal.tsx', 'utf8');
  const anamnesis = fs.readFileSync('src/components/AnamnesisModal.tsx', 'utf8');
  const hooponopono = fs.readFileSync('src/components/HooponoponoModal.tsx', 'utf8');
  const prayer = fs.readFileSync('src/components/ArchangelMichaelPrayerModal.tsx', 'utf8');
  const guard = fs.readFileSync('src/lib/misticoModernoOfficialVoicePatch.ts', 'utf8');

  assert.ok(app.includes('usesNeuralVoiceCatalog = isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa || isMisticoModerno'));
  assert.ok(home.includes("isMisticoModerno\n        ? (isElevenLabsVoiceId(savedVoiceId) ? savedVoiceId : '')"));
  assert.ok(home.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(settings.includes('requiresNeuralVoice = isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa || isMisticoModerno'));
  assert.ok(settings.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(session.includes('isMisticoModerno && !misticoVoiceId'));
  assert.ok(session.includes('MISTICO_MODERNO_CANVAS_THEME'));
  assert.ok(arcanjo.includes('requireExplicitVoiceId: requiresNeuralVoice'));
  assert.ok(arcanjo.includes('if (requiresNeuralVoice)'));
  assert.ok(systemic.includes('isEleganciaProfunda || isEssenciaLuminosa || isMisticoModerno'));
  assert.ok(anamnesis.includes('const requiresNeuralVoice = isEleganciaProfunda || isEssenciaLuminosa || isMisticoModerno'));
  assert.ok(hooponopono.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(prayer.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(guard.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(guard.includes('requireExplicitVoiceId: true'));
  assert.ok(main.includes("import './lib/misticoModernoOfficialVoicePatch';"));
  assert.ok(!guard.includes('OFFICIAL_PROTOCOL_VOICE_ID'));
  assert.ok(!guard.includes("voiceId === 'Rachel'"));
});

test('o player aplica a paleta violeta/dourado e respeita movimento reduzido', () => {
  const session = fs.readFileSync('src/components/MeditationSession.tsx', 'utf8');
  const css = fs.readFileSync('src/mistico-moderno-session-audit.css', 'utf8');
  const brand = fs.readFileSync('src/mistico-moderno-approved-overrides.css', 'utf8');
  assert.ok(session.includes("accent: '#6C3FA0'"));
  assert.ok(session.includes('useReducedMotion'));
  assert.ok(session.includes('shouldReduceMotion'));
  assert.ok(css.includes('.ep-session-light-overlay'));
  assert.ok(css.includes('prefers-reduced-motion'));
  assert.ok(brand.includes('.ep-brand-signature{opacity:.30'));
  assert.ok(brand.includes('opacity:.26'));
});

test('o Diário permanece persistente e a identidade visual fica restrita ao Místico', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  const modal = fs.readFileSync('src/components/DailyDiaryModal.tsx', 'utf8');
  const css = fs.readFileSync('src/mistico-moderno-daily-diary-audit.css', 'utf8');
  const start = app.indexOf('const handleSaveDiaryDay');
  const end = app.indexOf('const handleSaveTreatmentExpectations', start);
  const saveHandler = app.slice(start, end);
  assert.ok(saveHandler.includes('saveProgress(updatedProgress)'));
  assert.ok(saveHandler.includes('saveProfile(updatedProfile)'));
  assert.ok(modal.includes('saveEntryHandler(activeDay, finalJournalText, editingMood)'));
  assert.ok(modal.includes('useReducedMotion'));
  assert.ok(modal.includes('shouldReduceMotion'));
  assert.ok(css.includes('data-layout="mistico-moderno"'));
  assert.ok(css.includes('#daily-diary-modal'));
});

test('Solfeggio tonal não acompanha a prévia neural nem o player principal', () => {
  const settings = fs.readFileSync('src/components/AudioSettingsModal.tsx', 'utf8');
  assert.ok(settings.includes('const avoidsTonalVoiceOverlap = isEssenciaLuminosa || isMisticoModerno'));
  assert.ok(settings.includes("shouldPlayProtocolSessionBackground('playing', bgMusicType)"));
  assert.equal(shouldPlayProtocolSessionBackground('playing', '528hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', '432hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', '963hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', 'waves'), true);
  assert.equal(shouldPlayProtocolSessionBackground('portal', 'waves'), false);
});

test('os preços aprovados de tratamentos e cupons permanecem inalterados', () => {
  assert.equal(specificTreatmentQuote(7).cents, 5990);
  assert.equal(specificTreatmentQuote(21).cents, 9990);
  assert.equal(specificTreatmentQuote(7, 'PROMO15').cents, 5092);
  assert.equal(specificTreatmentQuote(21, 'PROMO20').cents, 7992);
});
