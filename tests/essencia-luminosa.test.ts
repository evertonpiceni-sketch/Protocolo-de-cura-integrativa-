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
  const start = theme.indexOf(':root[data-layout="essencia-luminosa"]{');
  const end = start >= 0 ? theme.indexOf('\n}', start) : -1;
  const block = start >= 0 && end > start ? theme.slice(start, end) : '';
  assert.ok(block.includes('--layout-canvas:#FFFFF8;'));
  assert.ok(block.includes('--layout-canvas-alt:#F7F3E8;'));
  assert.ok(block.includes('--layout-accent:#A6B49B;'));
  assert.ok(block.includes('--layout-gold:#C6A46A;'));
  assert.ok(block.includes('--layout-gold-dark:#A87E37;'));
  assert.ok(block.includes('--layout-bg:#FFFFF8;'));
  assert.ok(block.includes('--layout-accent-soft:rgba(166,180,155,.18);'));
  assert.ok(block.includes('--layout-gold-soft:rgba(198,164,106,.18);'));
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


test('Anamnese e boas-vindas usam a paleta atual sem oliva escura ou dourado antigo', () => {
  const anamnesis = fs.readFileSync('src/essencia-luminosa-anamnesis-audit.css', 'utf8');
  const welcome = fs.readFileSync('src/essencia-luminosa-welcome-audit.css', 'utf8');
  assert.ok(anamnesis.includes('--el-ivory:var(--layout-canvas);'));
  assert.ok(anamnesis.includes('--el-gold:var(--layout-gold);'));
  assert.ok(anamnesis.includes('--el-sage:var(--layout-accent);'));
  assert.ok(anamnesis.includes('--el-olive:var(--layout-text-secondary);'));
  assert.ok(!anamnesis.includes('#B9914F'));
  assert.ok(!anamnesis.includes('#77836B'));
  assert.ok(welcome.includes('var(--layout-accent, #A6B49B)'));
  assert.ok(welcome.includes('var(--layout-text-secondary, #5C5248)'));
  assert.ok(!/#aab58c|#8f9b73|#c8a96a|#b89450|#fff7df/i.test(welcome));
});

test('as camadas CSS do Estilo 3 não deixam tokens de layout sem definição nem vazam para outros estilos', () => {
  const files = fs.readdirSync('src').filter(name => name.startsWith('essencia-luminosa') && name.endsWith('.css'));
  const styleCss = files.map(name => fs.readFileSync('src/' + name, 'utf8')).join('\n');
  const theme = fs.readFileSync('src/approved-theme.css', 'utf8');
  const themeBlock = theme.split(':root[data-layout="essencia-luminosa"]{')[1]?.split('}')[0] || '';
  const declarations = new Set([...(themeBlock + '\n' + styleCss).matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)].map(match => match[1]));
  const references = new Set([...styleCss.matchAll(/var\(\s*(--layout-[a-zA-Z0-9_-]+)/g)].map(match => match[1]));
  assert.deepEqual([...references].filter(name => !declarations.has(name)), []);
  for (const name of files) {
    const source = fs.readFileSync('src/' + name, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const selectors = [...source.matchAll(/([^{}]+)\{/g)].map(match => match[1].trim()).filter(selector => selector && !selector.startsWith('@'));
    assert.deepEqual(selectors.filter(selector => !selector.includes('data-layout="essencia-luminosa"')), [], name);
  }
});

test('o onboarding ativo do Estilo 3 usa superfície clara e logo como assinatura discreta', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  const flow = fs.readFileSync('src/components/OnboardingFlow.tsx', 'utf8');
  const css = fs.readFileSync('src/essencia-luminosa-onboarding-audit.css', 'utf8');
  assert.ok(app.includes('{showWelcomeModal && userProfile && ('));
  assert.ok(app.includes('<OnboardingFlow'));
  assert.ok(flow.includes("import '../essencia-luminosa-onboarding-audit.css';"));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] .ep-care-onboarding-card'));
  assert.ok(css.includes('var(--layout-canvas)'));
  assert.ok(css.includes('opacity: .30'));
  assert.ok(!css.includes('#073b2b'));
});

test('o Guia de Banhos do Estilo 3 usa sálvia clara e champagne sem verde escuro/amarelo saturado', () => {
  const component = fs.readFileSync('src/components/HerbalBathsModal.tsx', 'utf8');
  const css = fs.readFileSync('src/essencia-luminosa-herbal-baths-audit.css', 'utf8');
  assert.ok(component.includes("import '../essencia-luminosa-herbal-baths-audit.css';"));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #herbal-baths-modal'));
  assert.ok(css.includes('var(--layout-accent-soft)'));
  assert.ok(css.includes('var(--layout-gold-gradient)'));
  assert.ok(!/#63745a|#53634c|#877747|#917649|#ac945f|#a68b56|#a58c58/i.test(css));
});

test('a Home e o acolhimento do Estilo 3 neutralizam o overlay escuro compartilhado', () => {
  const css = fs.readFileSync('src/essencia-luminosa-final-audit.css', 'utf8');
  const onboardingCss = fs.readFileSync('src/essencia-luminosa-onboarding-audit.css', 'utf8');
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] .ep-welcome-audio.ep-home-hero'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #cura-main-layout'));
  assert.ok(css.includes('rgba(255,255,248,.76)'));
  assert.ok(css.includes('var(--ep-scene) center/cover no-repeat'));
  assert.ok(css.includes('position: relative !important'));
  assert.ok(css.includes('opacity: .30 !important'));
  assert.ok(onboardingCss.includes('opacity: 1 !important'));
});

test('as assinaturas do logo em Home, Contato e Cursos permanecem discretas no Estilo 3', () => {
  const finalCss = fs.readFileSync('src/essencia-luminosa-final-audit.css', 'utf8');
  const contactCss = fs.readFileSync('src/essencia-luminosa-contact-audit.css', 'utf8');
  const coursesCss = fs.readFileSync('src/essencia-luminosa-courses-audit.css', 'utf8');
  assert.ok(finalCss.includes('.ep-brand-signature {\n  opacity: .30 !important;'));
  assert.ok(contactCss.includes('opacity:.30'));
  assert.ok(coursesCss.includes('opacity:.30'));
});
