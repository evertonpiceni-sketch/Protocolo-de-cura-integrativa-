import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { shouldPlayProtocolSessionBackground } from '../src/lib/protocolSessionAudioPolicy';

test('Estilo 3 usa a prancha oficial no card de prévia do seletor', () => {
  const modal = fs.readFileSync('src/components/LayoutChoiceModal.tsx', 'utf8');
  const boardPath = 'public/brand/essencia-luminosa/prancha-oficial.webp';
  assert.ok(modal.includes('src="/brand/essencia-luminosa/prancha-oficial.webp"'));
  assert.ok(fs.existsSync(boardPath));
  assert.ok(fs.statSync(boardPath).size > 10000, 'a prévia deve conter a prancha visual, não um placeholder vazio');
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

test('a Home da Essência Luminosa respeita a voz salva e seus controles', () => {
  const home = fs.readFileSync('src/components/TransformationHome.tsx', 'utf8');
  assert.ok(home.includes("props.visualLayout === 'elegancia-profunda' || props.visualLayout === 'essencia-luminosa'"));
  assert.ok(home.includes('const narrationVoiceId = usesSavedVoiceSettings'));
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

test('o player do Estilo 3 respeita a voz salva no perfil', () => {
  const session = fs.readFileSync('src/components/MeditationSession.tsx', 'utf8');
  assert.ok(session.includes("activeLayout === 'elegancia-profunda' || activeLayout === 'essencia-luminosa'"));
  assert.ok(session.includes('? savedVoiceId'));
});

test('o protocolo não reinicia Solfeggio como trilha de fundo', () => {
  assert.equal(shouldPlayProtocolSessionBackground('playing', '528hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', '432hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', '963hz'), false);
  assert.equal(shouldPlayProtocolSessionBackground('playing', 'waves'), true);
  assert.equal(shouldPlayProtocolSessionBackground('playing', 'none'), false);
  assert.equal(shouldPlayProtocolSessionBackground('portal', 'waves'), false);
});
