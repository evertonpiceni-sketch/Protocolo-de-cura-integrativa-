import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

const splitSelectorList = (value: string): string[] => {
  const selectors: string[] = [];
  let start = 0;
  let parentheses = 0;
  let brackets = 0;
  let quote = '';

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (quote) {
      if (character === quote && value[index - 1] !== '\\') quote = '';
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === '(') parentheses += 1;
    else if (character === ')') parentheses -= 1;
    else if (character === '[') brackets += 1;
    else if (character === ']') brackets -= 1;
    else if (character === ',' && parentheses === 0 && brackets === 0) {
      selectors.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }

  selectors.push(value.slice(start).trim());
  return selectors.filter(Boolean);
};

const extractCssSelectors = (css: string): string[] => {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const selectors: string[] = [];
  let start = 0;
  let depth = 0;
  let quote = '';

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (character === quote && source[index - 1] !== '\\') quote = '';
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === '{') {
      const prelude = source.slice(start, index).trim();
      if (prelude && !prelude.startsWith('@')) selectors.push(...splitSelectorList(prelude));
      depth += 1;
      start = index + 1;
    } else if (character === '}') {
      depth = Math.max(0, depth - 1);
      start = index + 1;
    } else if (character === ';' && depth === 0) {
      start = index + 1;
    }
  }

  return selectors;
};


test('a tipografia da Elegância Profunda segue a prancha oficial', () => {
  const index = read('src/index.css');
  const css = read('src/elegancia-profunda-approved-overrides.css');

  assert.ok(index.includes('family=Montserrat:'));
  assert.ok(index.includes('family=Playfair+Display:'));
  assert.ok(css.includes('--font-display:"Playfair Display"'));
  assert.ok(css.includes('--font-sans:"Montserrat"'));
  assert.ok(css.includes('font-family:"Montserrat",ui-sans-serif,system-ui,sans-serif!important'));
  assert.ok(css.includes('font-family:"Playfair Display",Georgia,serif!important'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] :is(h1,h2,h3,.font-display,.font-serif)'));
});

test('o cadastro pré-seleção não reutiliza o antigo shell do Natural Sereno', () => {
  const profile = read('src/components/ProfileSetup.tsx');
  const legacyFiles = [
    'src/natural-sereno.css',
    'src/natural-sereno-refinement.css',
    'src/natural-sereno-approved-overrides.css',
    'src/approved-theme.css'
  ];

  assert.ok(profile.includes('ep-auth-prestyle'));
  assert.ok(!profile.includes('ep-auth-style-one'));
  for (const path of legacyFiles) {
    assert.ok(!read(path).includes('ep-auth-style-one'), `O shell antigo não deve permanecer em ${path}.`);
  }
  assert.ok(!read('src/natural-sereno.css').includes('auth shell fixed to Natural Sereno'));
});


test('o seletor usa a prancha oficial do Estilo 2 e exige confirmação explícita', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const board = read('public/brand/elegancia-profunda/prancha-oficial.svg');
  const app = read('src/App.tsx');
  assert.ok(modal.includes('/brand/elegancia-profunda/prancha-oficial.svg'));
  assert.ok(board.includes('width="240" height="180" viewBox="0 0 240 180"'));
  assert.ok(board.includes('data:image/webp;base64,'));
  const payload = board.match(/data:image\/webp;base64,([A-Za-z0-9+/=]+)"/)?.[1] ?? '';
  assert.ok(payload.length > 0 && payload.length % 4 === 0, 'A prévia oficial deve conter base64 completo.');
  const webp = Buffer.from(payload, 'base64');
  assert.equal(webp.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(webp.subarray(8, 12).toString('ascii'), 'WEBP');
  assert.equal(webp.subarray(12, 16).toString('ascii'), 'VP8 ');
  assert.equal(webp.readUInt32LE(4) + 8, webp.length, 'O RIFF deve corresponder ao tamanho integral do arquivo.');
  assert.equal(webp.readUInt16LE(26) & 0x3fff, 240, 'A prévia deve ter 240 px de largura real.');
  assert.equal(webp.readUInt16LE(28) & 0x3fff, 180, 'A prévia deve ter 180 px de altura real.');
  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(app.includes('const [layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false)'));
  assert.ok(app.includes('{(!layoutConfirmedThisSession || layoutChoiceRequested) && ('));
});

test('erros ao copiar banho de ervas mantêm semântica sem superfície rosa-clara no Estilo 2', () => {
  const component = read('src/components/HerbalBathsModal.tsx');
  const css = read('src/elegancia-profunda-herbal-baths-audit.css');

  assert.ok(component.includes('role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700"'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] #herbal-baths-modal [role="alert"]'));
  assert.ok(css.includes('background: rgba(91, 32, 40, .28) !important;'));
  assert.ok(css.includes('border-color: rgba(169, 93, 102, .48) !important;'));
  assert.ok(css.includes('color: #f1d9d8 !important;'));
});

test('o modal de prática individual mantém foco acessível também no Estilo 2', () => {
  const modal = read('src/components/SpecificTreatmentModal.tsx');
  assert.ok(modal.includes('useDialogFocus(isOpen, dialogRef, onClose)'));
  assert.ok(!modal.includes("dataset.layout === 'natural-sereno'"));
});

test('a entrada ativa usa OnboardingFlow e recebe tratamento visual isolado do Estilo 2', () => {
  const app = read('src/App.tsx');
  const onboarding = read('src/components/OnboardingFlow.tsx');
  const css = read('src/elegancia-profunda-approved-overrides.css');
  assert.ok(app.includes("import('./components/OnboardingFlow')"));
  assert.ok(app.includes('<OnboardingFlow'));
  assert.ok(onboarding.includes('ep-care-onboarding'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] .ep-care-onboarding'));
  assert.ok(css.includes('--ep-scene:none'));
  assert.ok(!css.includes('var(--ep-scene)'));
});

test('o logo permanece assinatura transparente e o hero não herda opacidade de 72%', () => {
  const css = read('src/elegancia-profunda-approved-overrides.css');
  const sharedTheme = read('src/approved-theme.css');
  const main = read('src/main.tsx');
  assert.ok(main.indexOf("import './approved-theme.css'") < main.indexOf("import './elegancia-profunda-approved-overrides.css'"));
  assert.match(css, /\.ep-brand-signature-wrap \{\s*opacity:1!important;\s*background:transparent!important;/);
  assert.match(css, /\.ep-brand-signature\s*,[\s\S]*?opacity:\.30\s*!important/);
  const heroLogoRuleStart = css.indexOf(':root[data-layout="elegancia-profunda"] .ep-home-hero .ep-brand-signature,');
  assert.ok(heroLogoRuleStart >= 0, 'O hero do Estilo 2 precisa neutralizar a opacidade compartilhada.');
  const heroLogoRule = css.slice(heroLogoRuleStart, heroLogoRuleStart + 300);
  assert.ok(heroLogoRule.includes(':root[data-layout="elegancia-profunda"] .ep-welcome-audio .ep-brand-signature'));
  assert.ok(heroLogoRule.includes('opacity:.30!important;'));
  assert.ok(sharedTheme.includes('opacity:.72!important'), 'A camada compartilhada contém a regra mais forte que precisa ser neutralizada no Estilo 2.');
  assert.match(css, /#main-header div:has\(> \.ep-brand-signature\)[^\n]*background:transparent!important/);
});

test('os presets Solfeggio continuam usando o oscilador exato e não dependem de mapas MP3 legados', () => {
  const app = read('src/App.tsx');
  const integrity = read('src/lib/audioIntegrityPatch.ts');
  const tone = read('src/lib/solfeggioTone.ts');
  assert.ok(!app.includes('BG_TRACKS'));
  assert.ok(integrity.includes('solfeggioTone.start(Number(match[1])'));
  assert.ok(tone.includes('oscillator.frequency.setValueAtTime(frequency'));
});

test('o pagamento continua no checkout InfinitePay sem cópia manual de PIX', () => {
  const routes = read('src/lib/paymentRoutes.ts');
  const specific = read('src/components/SpecificTreatmentModal.tsx');
  const numerology = read('src/components/NumerologyModal.tsx');
  assert.ok(routes.includes('https://api.infinitepay.io/invoices/public/checkout'));
  assert.ok(routes.includes("router.post('/payment/create-checkout'"));
  assert.ok(routes.includes("provider('/payment_check'"));
  assert.ok(!specific.includes('handleCopyPix'));
  assert.ok(!specific.includes('navigator.clipboard.writeText'));
  assert.ok(!numerology.includes('handleCopyPix'));
  assert.ok(!numerology.includes('navigator.clipboard.writeText'));
});

test('o player respeita o contexto de dia do Estilo 2 sem herdar a cena da Reintegração', () => {
  const session = read('src/components/MeditationSession.tsx');
  const css = read('src/elegancia-profunda-approved-overrides.css');
  assert.ok(session.includes("['natural-sereno', 'elegancia-profunda', 'essencia-luminosa'].includes(activeLayout || '') ? dayNumber : undefined"));
  assert.ok(css.includes('--ep-scene:none'));
  assert.ok(!css.includes('var(--ep-scene)'));
  assert.ok(css.includes('#meditation-session .ep-session-backdrop > div:last-child'));
});

test('o Dia 1 do Estilo 2 mostra a descida da luz e as raízes sem geometria circular', () => {
  const session = read('src/components/MeditationSession.tsx');
  const canvas = read('src/components/session/SacredEnergyCanvas.tsx');
  assert.ok(session.includes('dayOneOpening={isEleganciaProfunda && dayNumber === 1}'));
  const start = canvas.indexOf('if (dayOneOpening) {');
  const end = canvas.indexOf('} else {', start);
  assert.ok(start >= 0 && end > start, 'A cena aprovada do Dia 1 deve estar isolada dos demais estágios.');
  const dayOneScene = canvas.slice(start, end);
  assert.ok(dayOneScene.includes('channelProgress'));
  assert.ok(dayOneScene.includes('rootProgress'));
  assert.ok(!dayOneScene.includes('ctx.arc('), 'A cena do Dia 1 não deve desenhar anéis ou círculos.');
  assert.ok(!dayOneScene.includes('ctx.strokeRect('));
  assert.ok(!dayOneScene.includes('for (let p = 0'));
});

test('a narração do Estilo 2 usa IDs ElevenLabs válidos e não cai na voz do dispositivo', () => {
  const voiceSelection = read('src/lib/voiceSelection.ts');
  const audio = read('src/lib/audio.ts');
  const app = read('src/App.tsx');
  const settings = read('src/components/AudioSettingsModal.tsx');
  const home = read('src/components/TransformationHome.tsx');
  const session = read('src/components/MeditationSession.tsx');
  const anamnesis = read('src/components/AnamnesisModal.tsx');
  const hooponopono = read('src/components/HooponoponoModal.tsx');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const systemic = read('src/components/SystemicQuestionsModal.tsx');
  const archangelPrayer = read('src/components/ArchangelMichaelPrayerModal.tsx');
  assert.ok(voiceSelection.includes('/^[A-Za-z0-9]{20}$/'));
  assert.ok(audio.includes('fallbackToSpeechSynthesis?: boolean'));
  assert.ok(audio.includes('failWithoutNativeVoice'));
  assert.ok(app.includes('Voz neural (ElevenLabs)'));
  assert.ok(settings.includes('Voz neural (ElevenLabs)'));
  assert.ok(home.includes('const requiresNeuralVoice = isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa;'));
  assert.ok(home.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(session.includes("activeLayout === 'elegancia-profunda' && !style2VoiceId"));
  assert.ok(anamnesis.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(hooponopono.includes('fallbackToSpeechSynthesis: !(isEleganciaProfunda || isEssenciaLuminosa)'));
  assert.ok(arcanjo.includes('requireExplicitVoiceId: isEleganciaProfunda || isEssenciaLuminosa'));
  assert.ok(audio.includes('requireExplicitVoiceId?: boolean'));
  assert.ok(audio.includes('if (options.requireExplicitVoiceId && !isElevenLabsVoiceId(options.voiceId))'));
  assert.ok(systemic.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(archangelPrayer.includes('fallbackToSpeechSynthesis: !(isEleganciaProfunda || isEssenciaLuminosa)'));
  assert.ok(app.includes('userProfile={userProfile || undefined}'));
  assert.ok(app.includes('voiceId={userProfile?.voiceId}'));
});

test('o acolhimento inicial do Estilo 2 mantém contraste marfim sobre verde profundo', () => {
  const css = read('src/elegancia-profunda-approved-overrides.css');
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] .ep-welcome-audio.ep-home-hero'));
  assert.ok(css.includes('color:var(--layout-text)!important'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] .ep-voice-error'));
});
test('as telas de Anamnese e oração usam a paleta específica do Estilo 2', () => {
  const anamnesisCss = read('src/elegancia-profunda-anamnesis-audit.css');
  const prayerCss = read('src/elegancia-profunda-prayer-audit.css');
  const headerCss = read('src/elegancia-profunda-header-final-audit.css');
  const main = read('src/main.tsx');
  assert.ok(anamnesisCss.includes('.ep-anamnesis-progress-fill'));
  assert.ok(anamnesisCss.includes('linear-gradient(90deg,#A87E37'));
  assert.ok(prayerCss.includes('.ep-archangel-prayer'));
  assert.ok(prayerCss.includes('315C85'));
  assert.ok(headerCss.includes('#header-profile-avatar'));
  assert.ok(main.includes("import './elegancia-profunda-anamnesis-audit.css'"));
  assert.ok(main.includes("import './elegancia-profunda-prayer-audit.css'"));
});



test('o Estilo 2 não substitui silenciosamente a voz neural escolhida por uma voz padrão', () => {
  const home = read('src/components/TransformationHome.tsx');
  const settings = read('src/components/AudioSettingsModal.tsx');
  assert.ok(home.includes("const approvedVoiceId = isEleganciaProfunda\n    ? (isElevenLabsVoiceId(savedVoiceId) ? savedVoiceId : '')"));
  assert.ok(home.includes("(isNaturalSereno || isEssenciaLuminosa)\n      ? (isElevenLabsVoiceId(savedVoiceId) ? savedVoiceId : OFFICIAL_PROTOCOL_VOICE_ID)"));
  assert.ok(settings.includes('if (requiresNeuralVoice && !isElevenLabsVoiceId(voiceId))'));
});

test('a Reintegração mantém o áudio neural dedicado aprovado e não recupera voz nativa', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  const api = read('api/index.ts');
  assert.ok(journey.includes("fetch('/api/reintegration-tts'"));
  assert.ok(api.includes('const REINTEGRATION_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";'));
  assert.ok(!journey.includes('speechSynthesis'));
  assert.ok(journey.includes('Voz neural dedicada'));
});

test('a Reintegração recebe o tratamento isolado do Estilo 2 e mantém a assinatura transparente', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  const css = read('src/elegancia-profunda-approved-overrides.css');
  const visual = read('src/components/ReintegrationPresenceVisual.tsx');
  assert.ok(journey.includes('data-ep-reintegration="true"'));
  assert.ok(journey.includes('ep-reintegration-logo'));
  assert.ok(journey.includes('opacity-30'));
  assert.ok(!journey.includes('bg-[#F8F4EC]/35 opacity-30 shadow-'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] [data-ep-reintegration="true"]'));
  assert.ok(css.includes('.ep-reintegration-running-glow'));
  assert.ok(css.includes('rgba(3,20,14'));
  assert.ok(visual.includes('data-visual-fallback="approved-human"'));
  assert.ok(journey.includes('data-journey-days="21"'));
});


test('o canvas do Estilo 2 usa verde profundo e dourado, sem herdar a paleta da Essência Luminosa', () => {
  const session = read('src/components/MeditationSession.tsx');
  const canvas = read('src/components/session/SacredEnergyCanvas.tsx');
  assert.ok(session.includes("const ELEGANCIA_PROFUNDA_CANVAS_THEME = {"));
  assert.ok(session.includes("glow: '#D4AF37'"));
  assert.ok(session.includes("accent: '#2E6B4F'"));
  assert.ok(session.includes("colorTheme={isEleganciaProfunda ? ELEGANCIA_PROFUNDA_CANVAS_THEME"));
  assert.ok(canvas.includes('goldSoft?: string;'));
  assert.ok(canvas.includes('sageSoft?: string;'));
  assert.ok(canvas.includes('goldSoft: colorTheme.goldSoft ||'));
  assert.ok(canvas.includes('sageSoft: colorTheme.sageSoft ||'));
});

test('a Reintegração libera e readquire o Wake Lock ao pausar, concluir ou voltar à aba', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  assert.ok(journey.includes('const releaseWakeLock = () =>'));
  assert.ok(journey.includes("lock?.addEventListener?.('release'"));
  assert.match(journey, /onEnded=\{\(\) => \{[\s\S]*?releaseWakeLock\(\);[\s\S]*?playbackState='none'/);
  assert.match(journey, /setActionHandler\('pause',[\s\S]*?releaseWakeLock\(\);/);
  assert.match(journey, /setActionHandler\('play',[\s\S]*?requestWakeLock\(\);/);
  assert.match(journey, /if \(playing\) \{[\s\S]*?releaseWakeLock\(\);/);
});

test('o onboarding antigo permanece inativo e o fluxo ativo continua sendo OnboardingFlow', () => {
  const app = read('src/App.tsx');
  const main = read('src/main.tsx');
  assert.ok(app.includes("import('./components/OnboardingFlow')"));
  assert.ok(!app.includes("import('./components/WelcomeModal')"));
  assert.ok(!main.includes("elegancia-profunda-welcome-audit.css"));
});

test('o Media Session não volta para pausado depois que a trilha termina', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  assert.ok(journey.includes('const endedRef = useRef(false);'));
  assert.ok(journey.includes("navigator.mediaSession.playbackState = endedRef.current ? 'none' : playing ? 'playing' : 'paused';"));
  assert.match(journey, /onEnded=\{\(\) => \{ endedRef\.current=true;[\s\S]*?playbackState='none'/);
});


test('o player do Estilo 2 mantém todas as fases em verde profundo, champagne e marfim', () => {
  const theme = read('src/approved-theme.css');
  const main = read('src/main.tsx');
  const playerCss = read('src/elegancia-profunda-player-audit.css');
  const session = read('src/components/MeditationSession.tsx');
  const checkin = read('src/components/session/SessionCheckInModal.tsx');
  const drawer = read('src/components/session/SecondaryScriptDrawer.tsx');
  assert.ok(theme.includes('--layout-text-soft:var(--layout-text-secondary)'));
  assert.ok(main.includes("import './elegancia-profunda-player-audit.css'"));
  assert.ok(main.indexOf('elegancia-profunda-player-audit.css') > main.indexOf('elegancia-profunda-dashboard-audit.css'));
  assert.ok(playerCss.includes('#meditation-session > header'));
  assert.ok(playerCss.includes('.ep-acceptance-portal'));
  assert.ok(playerCss.includes('.ep-session-checkin'));
  assert.ok(playerCss.includes('[aria-label="Roteiro da sessão"]'));
  assert.ok(playerCss.includes('[aria-label="Sessão concluída"]'));
  assert.ok(playerCss.includes('.ep-session-access-gate'));
  assert.ok(session.includes('ep-session-access-gate'));
  assert.ok(checkin.includes('ep-session-checkin'));
  assert.ok(checkin.includes('aria-pressed={mood === val}'));
  assert.ok(checkin.includes('aria-pressed={isSelected}'));
  assert.ok(drawer.includes('aria-label="Roteiro da sessão"'));
});


test('o toast global não herda indigo/roxo no Estilo 2 e mantém contraste legível', () => {
  const app = read('src/App.tsx');
  const css = read('src/elegancia-profunda-approved-overrides.css');
  assert.ok(app.includes('className="ep-app-toast fixed'));
  assert.ok(app.includes('role="status"'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] .ep-app-toast'));
  assert.ok(css.includes('background:linear-gradient(145deg,#132A1F 0%,#0B1712 100%)!important'));
  assert.ok(css.includes('color:#F4F1EB!important'));
  assert.ok(css.includes('color:#C8D6CD!important'));
});

test('a Reintegração carrega as 21 artes diárias com nomes zero-padded', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  assert.match(journey, /const dayArtworkUrl = `\/brand\/days\/dia-\$\{String\(day\)\.padStart\(2,\s*'0'\)\}\.png`;/);
  assert.ok(journey.includes("url('${dayArtworkUrl}')"));
  for (let day = 1; day <= 21; day += 1) {
    const asset = `public/brand/days/dia-${String(day).padStart(2, '0')}.png`;
    assert.ok(fs.existsSync(asset), `Arte diária ausente: ${asset}`);
  }
});


test('o player do Estilo 2 substitui o véu claro herdado por vinheta verde profunda', () => {
  const session = read('src/components/MeditationSession.tsx');
  const playerCss = read('src/elegancia-profunda-player-audit.css');
  assert.ok(session.includes('ep-session-light-overlay'));
  assert.ok(playerCss.includes(':root[data-layout="elegancia-profunda"] #meditation-session .ep-session-light-overlay'));
  assert.ok(playerCss.includes('rgba(7,19,14,.72)'));
});


test('a Prática Individual não deixa cards brancos nem texto índigo no Estilo 2', () => {
  const modalCss = read('src/elegancia-profunda-modal-audit.css');
  assert.ok(modalCss.includes('#specific-treatment-modal :is([class*="bg-white"]'));
  assert.ok(modalCss.includes('[class*="bg-[#F8F4EC]"]'));
  assert.ok(modalCss.includes('#specific-treatment-modal :is(strong,[class*="text-[#2A2420]"])'));
  assert.ok(modalCss.includes('#specific-treatment-modal [class*="text-indigo-"]'));
});

test('o destaque de ciclo recomendado usa champagne e bronze no Estilo 2', () => {
  const treatmentModal = read('src/components/SpecificTreatmentModal.tsx');
  const modalCss = read('src/elegancia-profunda-modal-audit.css');
  assert.ok(treatmentModal.includes('ep-treatment-recommended-badge'));
  assert.ok(modalCss.includes(':root[data-layout="elegancia-profunda"] #specific-treatment-modal .ep-treatment-recommended-badge'));
  assert.ok(modalCss.includes('#E5CFA0'));
  assert.ok(modalCss.includes('#9B7446'));
});


test('o Estilo 2 não herda a imagem de fundo da Reintegração no tema compartilhado', () => {
  const theme = read('src/approved-theme.css');
  const style2SceneBlock = theme.match(/:root\[data-layout="elegancia-profunda"\]\s*\{[^}]*--ep-scene:[^}]*\}/)?.[0] ?? '';
  assert.ok(style2SceneBlock, 'O bloco de cena do Estilo 2 deve existir.');
  assert.ok(style2SceneBlock.includes('--ep-scene:none;'));
  assert.ok(!style2SceneBlock.includes('reintegracao-presenca-arte.png'));
});

test('o logout limpa a confirmação do estilo para exigir nova escolha na próxima conta', () => {
  const app = read('src/App.tsx');
  const start = app.indexOf('const handleLogout = async () => {');
  const end = app.indexOf('\n  };', start);
  assert.ok(start >= 0 && end > start, 'O handler de logout deve existir.');
  const logout = app.slice(start, end);
  assert.ok(logout.includes('setLayoutConfirmedThisSession(false)'));
  assert.ok(logout.includes('setLayoutChoiceRequested(false)'));
  assert.ok(app.includes('{(!layoutConfirmedThisSession || layoutChoiceRequested) && ('));
});


test('todas as folhas CSS do Estilo 2 permanecem isoladas do restante do sistema', () => {
  const main = read('src/main.tsx');
  const styleSheets = [...main.matchAll(/import\s+['"]\.\/(elegancia-profunda[^'"]+\.css)['"];/g)]
    .map(match => match[1]);
  assert.equal(styleSheets.length, 21, 'A auditoria deve cobrir todas as folhas CSS ativas do Estilo 2.');

  for (const file of styleSheets) {
    const css = read('src/' + file);
    const selectors = extractCssSelectors(css);

    for (const selector of selectors) {
      if (/^(from|to|\d+%)(\s*,\s*(from|to|\d+%))*$/.test(selector)) continue;
      assert.ok(
        selector.includes('data-layout="elegancia-profunda"'),
        file + ' contém seletor fora do escopo Elegância Profunda: ' + selector
      );
    }
  }
});

test('o Wake Lock do player existe somente durante a reprodução e é liberado ao pausar ou concluir', () => {
  const session = read('src/components/MeditationSession.tsx');
  assert.ok(session.includes("if (sessionPhase !== 'playing' || !isPlaying) return;"));
  assert.ok(session.includes('}, [isPlaying, sessionPhase]);'));
  const wakeEffectStart = session.indexOf("if (sessionPhase !== 'playing' || !isPlaying) return;");
  const wakeEffectEnd = session.indexOf('}, [isPlaying, sessionPhase]);', wakeEffectStart);
  assert.ok(wakeEffectStart >= 0 && wakeEffectEnd > wakeEffectStart);
  const wakeEffect = session.slice(wakeEffectStart, wakeEffectEnd);
  assert.ok(wakeEffect.includes('if (releaseWakeLock) releaseWakeLock();'));
  assert.ok(!wakeEffect.includes('audioEngine.stopSpeech()'), 'A limpeza do áudio não deve rodar a cada pausa/retomada.');
});

test('os títulos dos atalhos de cuidado mantêm contraste marfim no Estilo 2', () => {
  const home = read('src/components/TransformationHome.tsx');
  const css = read('src/elegancia-profunda-approved-overrides.css');
  assert.ok(home.includes('careCards.map'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] #journey-choices .grid.grid-cols-2 > button strong'));
  assert.ok(css.includes('color:var(--ep-panel-text)!important'));
});


test('os modais de contato e cursos mantêm o logo como assinatura discreta no Estilo 2', () => {
  const contact = read('src/components/ContactModal.tsx');
  const courses = read('src/components/CoursesModal.tsx');
  const css = read('src/elegancia-profunda-approved-overrides.css');
  assert.ok(contact.includes('ep-brand-signature-wrap w-12 h-12'));
  assert.ok(contact.includes('ep-brand-signature w-full h-full object-contain'));
  assert.ok(!contact.includes('opacity-75'));
  assert.ok(courses.includes('ep-brand-signature-wrap w-14 h-14'));
  assert.ok(courses.includes('ep-brand-signature w-full h-full object-contain'));
  assert.match(css, /:root\[data-layout="elegancia-profunda"\] \.ep-brand-signature,[\s\S]*?opacity:\.30\s*!important/);
});

test('a narração do Estilo 2 não recorre à voz nativa e preserva os caminhos de áudio, diário e pagamento', () => {
  const home = read('src/components/TransformationHome.tsx');
  const settings = read('src/components/AudioSettingsModal.tsx');
  const api = read('api/index.ts');
  const reintegrationEndpoint = read('api/reintegration-tts.ts');
  const vercel = read('vercel.json');
  const audio = read('src/lib/audio.ts');
  const app = read('src/App.tsx');
  const payments = read('src/lib/paymentRoutes.ts');
  assert.ok(home.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(settings.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(api.includes('REINTEGRATION_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"'));
  const legacyReintegrationRoute = api.slice(api.indexOf('async function serveReintegrationVoice'), api.indexOf('export default async function handler'));
  assert.ok(legacyReintegrationRoute.includes('voice: REINTEGRATION_VOICE_ID'));
  assert.ok(!legacyReintegrationRoute.includes('fallbackToNativeTTS: true'));
  assert.ok(!legacyReintegrationRoute.includes('window.speechSynthesis'));
  assert.ok(reintegrationEndpoint.includes("voiceId: '21m00Tcm4TlvDq8ikWAM'"));
  assert.ok(reintegrationEndpoint.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(!reintegrationEndpoint.includes('speechSynthesis'));
  assert.ok(vercel.includes('"/api/reintegration-tts"'));
  assert.ok(audio.includes('fundamental.frequency.setValueAtTime(Number.parseFloat(type), now)'));
  assert.ok(app.includes('onSaveEntry={handleSaveDiaryDay}'));
  assert.ok(payments.includes('verified.amount !== order.cents'));
  assert.ok(payments.includes('o.transaction === transaction_nsu'));
});


test('splash e cadastro mantêm o logo oficial como assinatura, sem moldura ou pulsação dominante', () => {
  const app = read('src/App.tsx');
  const profile = read('src/components/ProfileSetup.tsx');
  const loading = app.slice(app.indexOf('const loadingScreen = ('), app.indexOf('if (isLoadingAuth) return loadingScreen;'));
  assert.ok(loading.includes('ep-brand-signature-wrap'));
  assert.ok(loading.includes('ep-brand-signature h-full w-full object-contain'));
  assert.ok(loading.includes('style={{ opacity: 0.3 }}'));
  assert.ok(!loading.includes('animate-pulse'));
  assert.ok(!loading.includes('shadow-md'));
  assert.ok(profile.includes('ep-brand-signature-wrap w-16 h-16'));
  assert.ok(profile.includes('ep-brand-signature w-full h-full object-contain'));
  assert.ok(profile.includes('style={{ opacity: 0.3 }}'));
});


test('o seletor permanece neutro até a escolha explícita e só então revela o CTA do estilo', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const profile = read('src/components/ProfileSetup.tsx');
  const app = read('src/App.tsx');
  const preselectionTone = modal.match(/const confirmButtonTone = !selectedLayout\s*\?\s*'([^']+)'/)?.[1] ?? '';

  assert.ok(preselectionTone.includes('from-[#A99B84]'));
  assert.ok(preselectionTone.includes('to-[#817460]'));
  assert.ok(!/#(?:B88736|C89D52|D9B66D|A87E37|D4AF37|E2B96B|C6A46A)/i.test(preselectionTone));
  assert.ok(modal.includes("selectedLayout === 'essencia-luminosa'"));
  assert.ok(modal.includes('from-[#C89D52] via-[#D9B66D] to-[#A87E37]'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(profile.includes('bg-[#A99B84]'));
  assert.ok(!/#(?:B88736|8F631E|e5c66f)/i.test(profile));
  assert.ok(app.includes('const selected = layoutConfirmedThisSession ? OFFICIAL_LAYOUTS.find(layout => layout.id === userProfile?.visualLayout) : undefined;'));
  assert.ok(app.includes('if (!selected) {\n      delete document.documentElement.dataset.layout;'));
});

test('os Ajustes de Áudio do Estilo 2 usam verde profundo, champagne e marfim', () => {
  const css = read('src/elegancia-profunda-settings-final-audit.css');
  const settings = read('src/components/AudioSettingsModal.tsx');
  const main = read('src/main.tsx');

  assert.ok(main.includes("import './elegancia-profunda-settings-final-audit.css';"));
  assert.ok(settings.includes('id="audio-settings-modal"'));
  assert.ok(settings.includes('id="bioactive-tuning-panel"'));
  assert.ok(settings.includes('disabled={isTrackBlockedDuringVoicePreview}'));
  assert.ok(css.includes(':root[data-layout="elegancia-profunda"] #audio-settings-modal > div'));
  assert.ok(css.includes('#audio-settings-modal #bioactive-tuning-panel'));
  assert.ok(css.includes('[class*="bg-[#FBF8F2]"]'));
  assert.ok(css.includes('button[class~="bg-[#B88736]"]'));
  assert.ok(css.includes('accent-color: #e2b96b !important;'));
  assert.ok(!css.includes('data-layout="essencia-luminosa"'));
  assert.ok(!css.includes('data-layout="natural-sereno"'));
  assert.ok(!css.includes('data-layout="mistico-moderno"'));
});


test('a camada aprovada da Elegância Profunda vence a cascata de todas as folhas de tema', () => {
  const main = read('src/main.tsx');
  const approvedImportLine = "import './elegancia-profunda-approved-overrides.css';";
  const approvedImport = main.indexOf(approvedImportLine);
  const style2AuditImports = main
    .split('\n')
    .filter(line => line.startsWith("import './elegancia-profunda-") && !line.includes('approved-overrides'));
  const lastStyle2AuditImport = Math.max(...style2AuditImports.map(line => main.indexOf(line)));
  const naturalApproved = main.indexOf("import './natural-sereno-approved-overrides.css';");
  const luminousApproved = main.indexOf("import './essencia-luminosa-approved-overrides.css';");
  const errorBoundary = main.indexOf("import { ErrorBoundary");

  assert.ok(approvedImport > lastStyle2AuditImport, 'A camada aprovada do Estilo 2 precisa vir depois de todas as suas folhas de auditoria.');
  assert.ok(approvedImport > naturalApproved && approvedImport > luminousApproved, 'A camada aprovada do Estilo 2 deve ser a última folha CSS de tema.');
  assert.ok(errorBoundary > approvedImport, 'Nenhuma folha CSS deve ser importada depois da camada aprovada.');
  assert.equal(main.split(approvedImportLine).length - 1, 1);
});
