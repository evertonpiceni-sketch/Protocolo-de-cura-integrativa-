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
  assert.ok(home.includes('const requiresNeuralVoice = isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa;'));
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
  assert.ok(session.includes("colorTheme={isNaturalSereno ? NATURAL_SERENO_CANVAS_THEME : isEleganciaProfunda ? ELEGANCIA_PROFUNDA_CANVAS_THEME : isEssenciaLuminosa ? ESSENCIA_LUMINOSA_CANVAS_THEME : undefined}"));
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
  assert.ok(settings.includes('const requiresNeuralVoice = isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa;'));
  assert.ok(settings.includes('const initialVoiceId = (isNaturalSereno || isEssenciaLuminosa) && !isElevenLabsVoiceId(savedVoiceId)'));
  assert.ok(settings.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(app.includes('const usesNeuralVoiceCatalog = isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa;'));
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
  assert.ok(/opacity:\s*\.30/.test(contactCss));
  assert.ok(/opacity:\s*\.30/.test(coursesCss));
});

test('a pré-seleção da Essência Luminosa usa ouro suave sem alterar o CTA dos outros estilos', () => {
  const modal = fs.readFileSync('src/components/LayoutChoiceModal.tsx', 'utf8');
  assert.ok(modal.includes("const isEssenciaCard = layout.id === 'essencia-luminosa';"));
  assert.ok(modal.includes('border-[#C6A46A] ring-2 ring-[#C6A46A]/20'));
  assert.ok(modal.includes('bg-[#C6A46A] text-white opacity-100'));
  assert.ok(modal.includes('from-[#D8C59B] via-[#C6A46A] to-[#E9DCC4]'));
  assert.ok(modal.includes('focus-visible:ring-[#C6A46A]/40'));
  assert.ok(modal.includes('from-[#C89D52] via-[#D9B66D] to-[#A87E37]'));
});


test('os overlays compartilhados do Estilo 3 não herdam índigo, verde escuro ou amarelo antigo', () => {
  const finalCss = fs.readFileSync('src/essencia-luminosa-final-audit.css', 'utf8');
  const milestoneCss = fs.readFileSync('src/essencia-luminosa-milestone-audit.css', 'utf8');
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  const plans = fs.readFileSync('src/components/ProUpgradeModal.tsx', 'utf8');
  assert.ok(finalCss.includes(':root[data-layout="essencia-luminosa"] .ep-app-toast'));
  assert.ok(finalCss.includes(':root[data-layout="essencia-luminosa"] #plans-modal'));
  assert.ok(finalCss.includes(':root[data-layout="essencia-luminosa"] #audio-settings-modal'));
  assert.ok(finalCss.includes('button[class~="bg-[#B88736]"]'));
  assert.ok(finalCss.includes('var(--layout-gold-gradient)'));
  assert.ok(milestoneCss.includes('[class*="from-amber-"]'));
  assert.ok(milestoneCss.includes('[class*="text-amber-"]'));
  assert.ok(milestoneCss.includes('button[class*="bg-[#B88736]"]'));
  assert.ok(app.includes("fetch('/api/payment/create-checkout'"));
  assert.ok(app.includes('data.checkoutUrl'));
  assert.ok(plans.includes('onUpgradeSuccess(selectedPlan.id, paymentMethod, finalPrice, appliedCoupon || undefined)'));
  assert.ok(!/chave PIX manual|copiar chave PIX/i.test(plans));
});


test('as telas secundárias da Essência Luminosa usam tokens atuais sem paleta verde/ouro legada', () => {
  const files = [
    'src/essencia-luminosa-journal-dashboard-audit.css',
    'src/essencia-luminosa-achievements-audit.css',
    'src/essencia-luminosa-chakras-guide-audit.css',
    'src/essencia-luminosa-contact-audit.css',
    'src/essencia-luminosa-courses-audit.css',
    'src/essencia-luminosa-bottom-nav-audit.css',
    'src/essencia-luminosa-promo-audit.css',
    'src/essencia-luminosa-daily-diary-semantic-audit.css'
  ];
  const sources = files.map(path => fs.readFileSync(path, 'utf8'));
  for (const source of sources) {
    assert.ok(source.includes('var(--layout-'), 'cada tela deve consumir os tokens atuais do Estilo 3');
  }
  const declarations = sources.join('\\n');
  assert.ok(!/(?:color|background(?:-color)?|border-color|outline):[^;]*#(?:a4874f|687451|657b57|a68c57|c3aa78|9b8354|877747|8b9a74|a98a4d|66704f|8d7549|98845c|776745|a9ad8b|7f875f|a7aa7d|b7a26a|d4b76d|b79a60|9f8755)/i.test(declarations));
});

test('a Home da Essência Luminosa não herda fotografia de outro estilo ou da Reintegração', () => {
  const css = fs.readFileSync('src/essencia-luminosa-final-audit.css', 'utf8');
  assert.ok(css.includes('--ep-scene: none;'));
  assert.ok(css.includes('var(--ep-scene) center top/cover fixed no-repeat'));
  assert.ok(!css.includes('/brand/natural-sereno/'));
  assert.ok(!css.includes('/brand/reintegracao-presenca-arte.png'));
});


test('a Prática Individual não mantém gradientes verde-escuro ou índigo no Estilo 3', () => {
  const css = fs.readFileSync('src/essencia-luminosa-final-audit.css', 'utf8');
  const modal = fs.readFileSync('src/components/SpecificTreatmentModal.tsx', 'utf8');
  assert.ok(modal.includes('from-indigo-950/40'));
  assert.ok(modal.includes('from-emerald-950/80'));
  assert.ok(modal.includes('to-slate-900'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #specific-treatment-modal [class*="from-indigo-950/40"]'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #specific-treatment-modal [class*="from-emerald-950/80"]'));
});


test('a prévia do Estilo 3 usa o WebP versionado da prancha oficial, sem alegar acesso ao PNG original', () => {
  const modal = fs.readFileSync('src/components/LayoutChoiceModal.tsx', 'utf8');
  assert.ok(modal.includes('/brand/essencia-luminosa/prancha-oficial.webp'));
  assert.ok(!modal.includes('/brand/essencia-luminosa/prancha-oficial.png'));
});


test('o botão Tratamento do dock principal não herda o gradiente verde no Estilo 3', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  const css = fs.readFileSync('src/essencia-luminosa-final-audit.css', 'utf8');
  assert.ok(app.includes('id="bottom-btn-specific-treatment"'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #bottom-btn-specific-treatment'));
  assert.ok(css.includes('#bottom-btn-specific-treatment:hover'));
  assert.ok(css.includes('#bottom-btn-specific-treatment [class*="text-emerald-"]'));
});

test('nenhum tema oficial é aplicado antes da confirmação explícita', () => {
  const theme = fs.readFileSync('src/approved-theme.css', 'utf8');
  const profile = fs.readFileSync('src/components/ProfileSetup.tsx', 'utf8');
  const app = fs.readFileSync('src/App.tsx', 'utf8');

  assert.ok(theme.includes(':root[data-layout="natural-sereno"]{'));
  assert.ok(!/:root,\s*:root\[data-layout="natural-sereno"\]\{/.test(theme));
  assert.ok(theme.includes(':root:not([data-layout]){'));
  assert.ok(theme.includes('--layout-accent:#85847B;'));
  assert.ok(profile.includes('ep-auth-prestyle'));
  assert.ok(!profile.includes('ep-auth-style-one'));
  assert.ok(theme.includes('#profile-setup-view.ep-auth-prestyle'));
  assert.ok(!theme.includes('#profile-setup-view.ep-auth-prestyle .ep-auth-nature-bg{background-image:url'));
  assert.ok(app.includes('const [layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false);'));
  assert.ok(app.includes('delete document.documentElement.dataset.layout;'));
  assert.ok(app.includes('setLayoutConfirmedThisSession(true);'));
});


test('os CTAs claros do Estilo 3 usam texto escuro e legível sobre champagne, sálvia e ouro suave', () => {
  const anamnesis = fs.readFileSync('src/essencia-luminosa-anamnesis-audit.css', 'utf8');
  const mobileInstall = fs.readFileSync('src/essencia-luminosa-mobile-install-audit.css', 'utf8');
  const numerology = fs.readFileSync('src/essencia-luminosa-numerology-audit.css', 'utf8');
  const session = fs.readFileSync('src/essencia-luminosa-session-audit.css', 'utf8');

  assert.ok(anamnesis.includes('color:#221D17!important;'));
  assert.ok(mobileInstall.includes('color:var(--layout-text)!important;'));
  assert.ok(numerology.includes('color: var(--layout-text) !important;'));
  const assertRuleContains = (source: string, selector: string, declaration: string) => {
    const start = source.indexOf(selector);
    const end = start >= 0 ? source.indexOf('}', start) : -1;
    assert.ok(start >= 0 && end > start, `selector not found: ${selector}`);
    assert.ok(source.slice(start, end).includes(declaration), `missing contrast declaration in: ${selector}`);
  };

  assertRuleContains(anamnesis, '#anamnesis-modal :is(.bg-indigo-600', 'color:#221D17!important;');
  assertRuleContains(mobileInstall, '#mobile-install-modal button[class*="bg-[#B88736]"]', 'color:var(--layout-text)!important;');
  assertRuleContains(numerology, '#numerology-modal :is(button,a)[class*="bg-emerald-"]', 'color: var(--layout-text) !important;');
  assertRuleContains(session, '#meditation-session button[class*="bg-[#8F631E]"]', 'color: var(--layout-text) !important;');
  assertRuleContains(session, '#meditation-session button[class*="from-[#B88736]"]', 'color: var(--layout-text) !important;');

  for (const source of [anamnesis, mobileInstall, numerology, session]) {
    assert.doesNotMatch(source, /color\s*:\s*#fff(?:fff)?\s*!important/i);
  }
});

test('a escolha de estilo usa somente o fluxo React ativo e mantém seletores DOM legados inativos', () => {
  const main = fs.readFileSync('src/main.tsx', 'utf8');
  const app = fs.readFileSync('src/App.tsx', 'utf8');

  assert.ok(app.includes("import LayoutChoiceModal from './components/LayoutChoiceModal';"));
  assert.ok(app.includes('<OnboardingFlow'));
  assert.doesNotMatch(app, /import WelcomeModal/);
  assert.doesNotMatch(main, /requiredLayoutChoiceEntryPatch|layoutSettingsExplicitConfirmationPatch/);
});


test('a página de Configurações usa ElevenLabs também na Essência Luminosa', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  const start = app.indexOf('{/* Voice Select */}');
  const end = app.indexOf('{/* Solfeggio soundscape toggle', start);
  assert.ok(start >= 0 && end > start, 'voice settings block must exist');
  const block = app.slice(start, end);

  assert.ok(app.includes('const usesNeuralVoiceCatalog = isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa;'));
  assert.ok(block.includes('{usesNeuralVoiceCatalog ? ('));
  assert.ok(block.includes('if (usesNeuralVoiceCatalog) {'));
  assert.ok(block.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(block.includes('id="settings-voice-preview"'));
  assert.ok(block.includes('Natural Sereno, Elegância Profunda e Essência Luminosa não usam a voz do dispositivo.'));
  assert.doesNotMatch(block, /if \(isEleganciaProfunda\)/);
});

test('o botão de teste de voz do Estilo 3 usa acabamento champagne e texto de alto contraste', () => {
  const css = fs.readFileSync('src/essencia-luminosa-approved-overrides.css', 'utf8');
  assert.ok(css.includes('#settings-view #settings-voice-preview'));
  assert.ok(css.includes('background:var(--layout-gold-gradient)!important;'));
  assert.ok(css.includes('#settings-view #settings-voice-preview :is(svg,span)'));
  assert.ok(css.includes('color:var(--layout-text)!important;'));
});

test('o logout limpa a confirmação de estilo também para a próxima conta na Essência Luminosa', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  const start = app.indexOf('const handleLogout = async () => {');
  const end = app.indexOf('\n  };', start);
  assert.ok(start >= 0 && end > start, 'O handler de logout deve existir.');
  const logout = app.slice(start, end);

  assert.ok(logout.includes('setLayoutConfirmedThisSession(false)'));
  assert.ok(logout.includes('setLayoutChoiceRequested(false)'));
  assert.ok(app.includes('const [layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false);'));
  assert.ok(app.includes('{(!layoutConfirmedThisSession || layoutChoiceRequested) && ('));
  assert.ok(app.includes('delete document.documentElement.dataset.layout'));
});


test('o acesso neutro antes da escolha não mantém CTA, ícones ou foco verdes herdados', () => {
  const profile = fs.readFileSync('src/components/ProfileSetup.tsx', 'utf8');
  const theme = fs.readFileSync('src/approved-theme.css', 'utf8');
  const supportStart = profile.indexOf('data-access-support-link="true"');
  assert.ok(supportStart >= 0, 'O link de suporte deve continuar identificado para acessibilidade e estilo.');
  const supportBlock = profile.slice(Math.max(0, supportStart - 320), supportStart + 220);
  assert.ok(supportBlock.includes('bg-[#E4E0D7]'));
  assert.ok(supportBlock.includes('text-[#302E2A]'));
  assert.ok(!supportBlock.includes('#174B37'));
  assert.ok(!supportBlock.includes('#FFFAE7'));
  assert.ok(profile.includes('text-[#817460]'));
  assert.ok(profile.includes('focus:border-[#A99B84]'));
  assert.ok(theme.includes('a:not([data-access-support-link="true"])'));
  assert.ok(profile.includes('ep-auth-prestyle min-h-dvh text-[#302E2A]'));
  assert.ok(profile.includes('bg-[#F7F3E8] border border-[#E5DAC6] text-[#5C5248]'), 'O aviso de sucesso deve permanecer neutro antes da escolha.');
  const voiceStart = profile.indexOf('id="voice-gender-selector"');
  const voiceEnd = profile.indexOf('<div className="space-y-2 pt-2">', voiceStart);
  const voiceSelector = profile.slice(voiceStart, voiceEnd);
  assert.ok(voiceSelector.includes('Preferência de timbre'));
  assert.ok(voiceSelector.includes('id="voice-preview-note"'));
  assert.ok(!/(?:rose-|emerald-|amber-|#B88736|#d9bd69)/i.test(voiceSelector), 'A preferência de timbre deve permanecer neutra antes da escolha do estilo.');
  assert.ok(!profile.includes('/brand/natural-sereno/voz-masculina-amostra.mp3'));
  assert.ok(!profile.includes("voiceId: 'Rachel'"));
  assert.ok(!profile.includes('SpeechSynthesisUtterance') && !profile.includes('speechSynthesis.speak'), 'O acesso não pode reproduzir amostras de outros estilos nem voz robótica do navegador.');
  assert.ok(profile.includes('voiceType: voiceChoice') && profile.includes('preferredVoiceGender: voiceChoice'), 'A preferência de timbre continua salva sem escolher uma voz neural por antecipação.');
  assert.ok(!/emerald-|amber-(?:300|400|500)|text-amber-200/.test(profile), 'O acesso neutro não deve carregar classes cromáticas antigas.');
});


test('o Diário da Essência Luminosa usa champagne e ouro suave nos CTAs e na seleção do dia', () => {
  const css = fs.readFileSync('src/essencia-luminosa-daily-diary-semantic-audit.css', 'utf8');
  const main = fs.readFileSync('src/main.tsx', 'utf8');
  assert.ok(main.includes("import './essencia-luminosa-daily-diary-semantic-audit.css';"));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #daily-diary-modal button:not([aria-label^="Abrir dia "])[class~="bg-[#B88736]"]'));
  assert.ok(css.includes('background: var(--layout-gold-gradient) !important;'));
  assert.ok(css.includes('color: var(--layout-text) !important;'));
  assert.ok(css.includes('#daily-diary-modal button[aria-label^="Abrir dia "][class~="bg-[#B88736]"]'));
  assert.ok(css.includes('var(--layout-gold-soft)'));
  assert.ok(css.includes('#daily-diary-modal button[class*="hover:bg-slate-700"]:hover'));
  assert.ok(css.includes('#daily-diary-modal [class*="text-[#B88736]"]'));
  assert.ok(!css.includes(':root[data-layout="natural-sereno"]'));
  assert.ok(!css.includes(':root[data-layout="elegancia-profunda"]'));
  assert.ok(!css.includes(':root[data-layout="mistico-moderno"]'));
});


test('todos os fluxos de voz da Essência Luminosa preservam a voz neural e falham sem voz robótica', () => {
  const voicePatch = fs.readFileSync('src/lib/essenciaLuminosaOfficialVoicePatch.ts', 'utf8');
  const anamnesis = fs.readFileSync('src/components/AnamnesisModal.tsx', 'utf8');
  const systemic = fs.readFileSync('src/components/SystemicQuestionsModal.tsx', 'utf8');
  const arcanjo = fs.readFileSync('src/components/ArcanjoProtocolView.tsx', 'utf8');
  const hooponopono = fs.readFileSync('src/components/HooponoponoModal.tsx', 'utf8');
  const archangelPrayer = fs.readFileSync('src/components/ArchangelMichaelPrayerModal.tsx', 'utf8');

  assert.ok(voicePatch.includes('originalPlayGuidedMeditation'));
  assert.ok(voicePatch.includes('originalSpeakWithElevenLabsOrFallback'));
  assert.ok(voicePatch.includes('isElevenLabsVoiceId(voiceId)'));
  assert.ok(voicePatch.includes('preferElevenLabs: true'));
  assert.ok(voicePatch.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(voicePatch.includes('requireExplicitVoiceId: true'));

  assert.ok(anamnesis.includes('isEleganciaProfunda || isEssenciaLuminosa'));
  assert.ok(anamnesis.includes('isEssenciaLuminosa ? OFFICIAL_PROTOCOL_VOICE_ID'));
  assert.ok(anamnesis.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(anamnesis.includes('!isEleganciaProfunda && !isEssenciaLuminosa ? ('));

  assert.ok(systemic.includes('isEleganciaProfunda || isEssenciaLuminosa'));
  assert.ok(systemic.includes('voiceId: neuralVoiceId'));
  assert.ok(systemic.includes('audioEngine.speakWithElevenLabsOrFallback'));
  assert.ok(systemic.includes('audioEngine.previewVoice({'), 'A prévia nativa continua reservada aos estilos que não exigem voz neural.');

  assert.ok(arcanjo.includes('requireExplicitVoiceId: isEleganciaProfunda || isEssenciaLuminosa'));
  assert.ok(arcanjo.includes('if (isEleganciaProfunda || isEssenciaLuminosa)'));
  assert.ok(arcanjo.includes('OFFICIAL_PROTOCOL_VOICE_ID'));

  assert.ok(hooponopono.includes('fallbackToSpeechSynthesis: !(isEleganciaProfunda || isEssenciaLuminosa)'));
  assert.ok(archangelPrayer.includes('fallbackToSpeechSynthesis: !(isEleganciaProfunda || isEssenciaLuminosa)'));
});

test('as páginas de reflexão e oração usam superfícies próprias da Essência Luminosa', () => {
  const css = fs.readFileSync('src/essencia-luminosa-final-audit.css', 'utf8');
  const arcanjo = fs.readFileSync('src/components/ArcanjoProtocolView.tsx', 'utf8');
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #systemic-questions-modal>div'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #archangel-prayer-modal .ep-archangel-prayer'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #arcanjo-protocol-view'));
  assert.ok(arcanjo.includes('id="arcanjo-protocol-view"'));
});

test('as telas de pagamento não reintroduzem PIX manual e usam o checkout InfinitePay', () => {
  const specificTreatment = fs.readFileSync('src/components/SpecificTreatmentModal.tsx', 'utf8');
  const numerology = fs.readFileSync('src/components/NumerologyModal.tsx', 'utf8');
  const paymentRoutes = fs.readFileSync('src/lib/paymentRoutes.ts', 'utf8');

  assert.ok(specificTreatment.includes('/api/payment/create-checkout'));
  assert.ok(numerology.includes('/api/payment/create-checkout'));
  assert.ok(!/handleCopyPix|evertonpiceni@gmail\.com/.test(specificTreatment));
  assert.ok(!/handleCopyPix|evertonpiceni@gmail\.com/.test(numerology));
  assert.ok(paymentRoutes.includes('confirm'));
  assert.ok(paymentRoutes.includes('signature') || paymentRoutes.includes('webhook'));
});

test('o Estilo 3 não herda a cena da Reintegração e suaviza o selo recomendado', () => {
  const theme = fs.readFileSync('src/approved-theme.css', 'utf8');
  const finalCss = fs.readFileSync('src/essencia-luminosa-final-audit.css', 'utf8');
  const style3Blocks = theme
    .split(':root[data-layout="essencia-luminosa"]')
    .slice(1)
    .map(block => block.slice(0, block.indexOf('}')));
  assert.ok(
    style3Blocks.length > 0 && style3Blocks.every(block => !block.includes('--ep-scene:url(')),
    'A Essência Luminosa não pode herdar a imagem da Reintegração da Vida.'
  );
  assert.ok(finalCss.includes('--ep-scene: none;'));
  assert.ok(finalCss.includes(':root[data-layout="essencia-luminosa"] #specific-treatment-modal .ep-treatment-recommended-badge'));
  assert.ok(finalCss.includes('var(--layout-gold-soft)'));
  assert.ok(finalCss.includes('var(--layout-gold-dark)'));
});


test('o Mapa Astral da Essência Luminosa não mantém verde profundo nem dourado legado', () => {
  const component = fs.readFileSync('src/components/AstralMapModal.tsx', 'utf8');
  const css = fs.readFileSync('src/essencia-luminosa-final-audit.css', 'utf8');
  const main = fs.readFileSync('src/main.tsx', 'utf8');

  assert.ok(component.includes('bg-[#073b2b]'), 'A auditoria deve cobrir o fundo verde profundo real do ícone.');
  assert.ok(component.includes('text-[#f2dda4]'), 'A auditoria deve cobrir o texto amarelo claro sobre o ícone.');
  assert.ok(component.includes('bg-[#B88736]'), 'A auditoria deve cobrir os CTAs dourados legados do Mapa Astral.');
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #astral-map-modal [class*="bg-[#073b2b]"]'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #astral-map-modal [class*="text-[#f2dda4]"]'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #astral-map-modal [class~="bg-[#B88736]"]'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #astral-map-modal [class*="bg-amber-"]'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #astral-map-modal [class*="text-amber-"]'));
  assert.ok(main.includes("import './essencia-luminosa-final-audit.css';"));
});


test('o logo da Essência Luminosa neutraliza o destaque compartilhado no hero e no acolhimento', () => {
  const shared = fs.readFileSync('src/approved-theme.css', 'utf8');
  const css = fs.readFileSync('src/essencia-luminosa-final-audit.css', 'utf8');
  const main = fs.readFileSync('src/main.tsx', 'utf8');
  const home = fs.readFileSync('src/components/TransformationHome.tsx', 'utf8');

  const sharedRuleStart = shared.indexOf(':root[data-layout] .ep-home-hero .ep-brand-signature,');
  assert.ok(sharedRuleStart >= 0, 'A regra compartilhada do hero precisa continuar identificável.');
  const sharedRule = shared.slice(sharedRuleStart, sharedRuleStart + 260);
  assert.ok(sharedRule.includes(':root[data-layout] .ep-welcome-audio .ep-brand-signature'));
  assert.ok(sharedRule.includes('opacity:.72!important'));

  const style3RuleStart = css.indexOf(':root[data-layout="essencia-luminosa"] .ep-home-hero .ep-brand-signature-wrap,');
  assert.ok(style3RuleStart >= 0, 'O override do Estilo 3 precisa cobrir o wrapper do hero.');
  const style3Rule = css.slice(style3RuleStart, style3RuleStart + 1100);
  assert.ok(style3Rule.includes(':root[data-layout="essencia-luminosa"] .ep-welcome-audio .ep-brand-signature-wrap'));
  assert.ok(style3Rule.includes(':root[data-layout="essencia-luminosa"] .ep-welcome-audio .ep-brand-signature'));
  assert.ok(style3Rule.includes('opacity: .30 !important;'));

  const mobileRuleStart = css.indexOf('@media (max-width: 640px)');
  assert.ok(mobileRuleStart >= 0, 'O override mobile do logo precisa existir.');
  const mobileRule = css.slice(mobileRuleStart, mobileRuleStart + 700);
  assert.ok(mobileRule.includes(':root[data-layout="essencia-luminosa"] .ep-welcome-audio .ep-brand-signature'));
  assert.ok(mobileRule.includes('opacity: .26 !important;'));

  assert.ok(main.indexOf("import './approved-theme.css'") < main.indexOf("import './essencia-luminosa-final-audit.css'"));
  assert.ok(home.includes('ep-welcome-audio ep-home-hero'));
});

test('a prévia de voz da Essência Luminosa não toca Solfeggio durante a narração', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  const settings = fs.readFileSync('src/components/AudioSettingsModal.tsx', 'utf8');

  for (const frequency of ['396hz', '417hz', '432hz', '528hz', '639hz', '741hz', '852hz', '963hz']) {
    assert.equal(shouldPlayProtocolSessionBackground('playing', frequency), false, frequency);
  }
  assert.equal(shouldPlayProtocolSessionBackground('playing', 'waves'), true);
  assert.equal(shouldPlayProtocolSessionBackground('playing', 'chuvaserena'), true);

  assert.equal(
    (app.match(/shouldPlayProtocolSessionBackground\('playing', userProfile\.bgMusicType\)/g) || []).length,
    2,
    'a reprodução global e o desbloqueio por gesto devem respeitar a prévia de voz'
  );
  assert.ok(app.includes('!isEssenciaLuminosa || !isPlayingVoiceTest'));
  assert.ok(app.includes('layoutConfirmedThisSession,\n    isPlayingVoiceTest\n  ]);'));
  assert.ok(app.includes('layoutConfirmedThisSession, isPlayingVoiceTest]);'));

  assert.ok(settings.includes('const shouldPlayVoiceBackground = !isEssenciaLuminosa'));
  assert.ok(settings.includes("audioEnabled && shouldPlayProtocolSessionBackground('playing', bgMusicType)"));
  assert.ok(settings.includes('else if (allowBackgroundPlayback && isEssenciaLuminosa)'));
  assert.ok(settings.includes('setIsPlayingBioactivePreview(false)'));
  assert.ok(settings.includes('const restoreBackgroundAfterVoiceTest = () =>'));
  assert.ok(settings.includes("if (isEssenciaLuminosa && audioEnabled && bgMusicType !== 'none')"));
  assert.ok(settings.includes('restoreBackgroundAfterVoiceTest();'));
});
