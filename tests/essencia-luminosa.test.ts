import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { shouldPlayProtocolSessionBackground } from '../src/lib/protocolSessionAudioPolicy';

test('Estilo 3 usa a prancha oficial no card de prévia do seletor', () => {
  const modal = fs.readFileSync('src/components/LayoutChoiceModal.tsx', 'utf8');
  const boardPath = 'public/brand/essencia-luminosa/prancha-oficial.webp';
  assert.ok(modal.includes('src="/brand/essencia-luminosa/prancha-oficial.webp"'));
  assert.ok(modal.includes('A prévia do Estilo 3 usa a prancha oficial'));
  assert.ok(!modal.includes('A prévia do Estilo 2 usa a prancha oficial'));
  assert.ok(fs.existsSync(boardPath));
  assert.ok(fs.statSync(boardPath).size > 10000, 'a prévia deve conter a prancha visual, não um placeholder vazio');
});

test('uma preferência inválida não cai automaticamente no Natural Sereno', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  assert.ok(app.includes('layoutConfirmedThisSession && isLayoutId(userProfile.visualLayout) ? userProfile.visualLayout : undefined'));
  assert.ok(!app.includes('normalizeLayoutId(userProfile.visualLayout)'));
});

test('a escolha dos quatro estilos continua explícita antes da aplicação', () => {
  const modal = fs.readFileSync('src/components/LayoutChoiceModal.tsx', 'utf8');
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(modal.includes('O estilo só será aplicado depois da sua confirmação.'));
  assert.ok(app.includes('useState(false)'));
  assert.ok(app.includes('const selected = layoutConfirmedThisSession ? OFFICIAL_LAYOUTS.find'));
  assert.ok(app.includes('delete document.documentElement.dataset.layout'));
});

test('a Home da Essência Luminosa respeita a voz neural salva e não cai em Web Speech', () => {
  const home = fs.readFileSync('src/components/TransformationHome.tsx', 'utf8');
  assert.ok(home.includes('const requiresNeuralVoice = isEleganciaProfunda || isEssenciaLuminosa;'));
  assert.ok(home.includes('isElevenLabsVoiceId(savedVoiceId) ? savedVoiceId : OFFICIAL_PROTOCOL_VOICE_ID'));
  assert.ok(home.includes('const narrationVoiceId = usesSavedVoiceSettings'));
  assert.ok(home.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(home.includes('onError: requiresNeuralVoice'));
  assert.ok(home.includes('props.voiceVolume ?? 1'));
  assert.ok(home.includes('props.voiceRate ?? .82'));
  assert.ok(home.includes('props.voicePitch ?? .92'));
});

test('a Home do Estilo 3 neutraliza texto amarelo de baixo contraste e trilho escuro', () => {
  const css = fs.readFileSync('src/essencia-luminosa-final-audit.css', 'utf8');
  assert.ok(css.includes('[class*="text-[#f2e7c6]"]'));
  assert.ok(css.includes('.ep-progress-card [class*="bg-black/25"]'));
  assert.ok(css.includes('[class*="from-[#b78d32]"]'));
  assert.ok(css.includes('[class*="to-[#f0d98d]"]'));
});

test('o player do Estilo 3 preserva IDs neurais válidos e usa Marianne para valores legados', () => {
  const session = fs.readFileSync('src/components/MeditationSession.tsx', 'utf8');
  assert.ok(session.includes("activeLayout === 'essencia-luminosa'"));
  assert.ok(session.includes('isElevenLabsVoiceId(selectedVoiceId) ? selectedVoiceId : OFFICIAL_PROTOCOL_VOICE_ID'));
});

test('o protocolo não reinicia Solfeggio como trilha de fundo', () => {
  assert.equal(shouldPlayProtocolSessionBackground('playing', '528hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', '432hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', '963hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', 'waves'), true);
  assert.equal(shouldPlayProtocolSessionBackground('playing', 'none'), false);
  assert.equal(shouldPlayProtocolSessionBackground('portal', 'waves'), false);
});


test('o player usa ouro suave e sálvia nas animações da Essência Luminosa', () => {
  const session = fs.readFileSync('src/components/MeditationSession.tsx', 'utf8');
  const canvas = fs.readFileSync('src/components/session/SacredEnergyCanvas.tsx', 'utf8');
  assert.ok(session.includes("colorTheme={isEssenciaLuminosa ? ESSENCIA_LUMINOSA_CANVAS_THEME : undefined}"));
  assert.ok(session.includes("'essencia-luminosa'].includes(activeLayout || '')"));
  assert.ok(canvas.includes('const palette = colorTheme ?'));
  assert.ok(canvas.includes('rgba(198, 164, 106'));
  assert.ok(canvas.includes('rgba(166, 180, 155'));
  assert.ok(canvas.includes('rgba(255, 255, 248, 0)'));
});


test('os tokens ativos do Estilo 3 correspondem à paleta aprovada mais recente', () => {
  const theme = fs.readFileSync('src/approved-theme.css', 'utf8');
  const block = theme.match(/:root\\[data-layout="essencia-luminosa"\\]\\s*\\{([\\s\\S]*?)\\n\\}/)?.[1] || '';
  assert.ok(block.includes('--layout-canvas:#FFFFF8;'));
  assert.ok(block.includes('--layout-canvas-alt:#F7F3E8;'));
  assert.ok(block.includes('--layout-accent:#A6B49B;'));
  assert.ok(block.includes('--layout-gold:#C6A46A;'));
  assert.ok(block.includes('--layout-gold-dark:#A87E37;'));
  assert.ok(!block.includes('#C29648'));
  assert.ok(!block.includes('#7E9680'));
});

test('os Ajustes de Áudio do Estilo 3 oferecem vozes neurais e preservam Marianne como fallback oficial', () => {
  const settings = fs.readFileSync('src/components/AudioSettingsModal.tsx', 'utf8');
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  assert.ok(settings.includes("const isEssenciaLuminosa = typeof document !== 'undefined' && document.documentElement.dataset.layout === 'essencia-luminosa';"));
  assert.ok(settings.includes('const requiresNeuralVoice = isEleganciaProfunda || isEssenciaLuminosa;'));
  assert.ok(settings.includes('const initialVoiceId = isEssenciaLuminosa && !isElevenLabsVoiceId(savedVoiceId)'));
  assert.ok(settings.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(app.includes('const usesNeuralVoiceCatalog = isEleganciaProfunda || isEssenciaLuminosa;'));
  assert.ok(app.includes('!usesNeuralVoiceCatalog'));
});
