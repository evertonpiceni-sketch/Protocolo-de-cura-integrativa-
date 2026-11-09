import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');

test('Home Natural Sereno não injeta grandes chapas verdes nem CTA amarelo em pílula', () => {
  const model = read('src/lib/naturalSerenoHomeApprovedModel.ts');
  assert.doesNotMatch(model, /#073b2b|#052f22|rgba\(7,59,43|#fff9e8|#ead394|#c49b42|#aa7d25|#98701f|#d7b55e|border-radius:\s*999px/i);
  assert.ok(model.includes('background: #FAF7F2;'));
  assert.ok(model.includes('border-radius: 18px !important;'));
  assert.ok(model.includes('background: linear-gradient(180deg,#E2B96B 0%,#C89D52 100%) !important;'));
});

test('CTAs base do Natural Sereno usam dourado refinado, texto café e cantos de 18px', () => {
  const css = read('src/natural-sereno.css');
  const goldBlock = css.match(/:root\[data-layout="natural-sereno"\] \.ns-gold \{\s*border:[\s\S]*?\n\}/)?.[0] ?? '';
  assert.ok(goldBlock.includes('border-radius: 18px;'));
  assert.ok(goldBlock.includes('background: linear-gradient(180deg,#E2B96B 0%,#C89D52 100%);'));
  assert.ok(goldBlock.includes('color: #2A2421;'));
  assert.doesNotMatch(goldBlock, /999px|#ead394|#c49b42|#aa7d25|#98701f|#d7b55e/i);
});

test('a camada final e a Home mantêm CTA premium e paisagem responsiva', () => {
  const approved = read('src/natural-sereno-approved-overrides.css');
  const home = read('src/natural-sereno-home-surface-audit.css');
  assert.ok(approved.includes(':root[data-layout="natural-sereno"] .ns-app .ns-gold {'));
  assert.ok(approved.includes('border-radius: 18px !important;'));
  assert.ok(home.includes('color:#2A2421!important;'));
  assert.ok(home.includes('background-image:linear-gradient(180deg,#E2B96B 0%,#C89D52 100%)!important;'));
  assert.ok(home.includes('border-radius:18px!important;'));
  assert.ok(home.includes('min-height:clamp(480px,62vh,680px)!important;'));
  assert.ok(home.includes('min-height:clamp(520px,72vh,700px)!important;'));
});

test('modais e superfícies mobile não usam mais os antigos verdes e amarelos como tema', () => {
  const refinement = read('src/natural-sereno-refinement.css');
  const mobile = read('src/natural-sereno-mobile-fixes.css');
  assert.doesNotMatch(refinement, /#073b2b|#052f22|#dfc57f|#21563c|#26372a/i);
  assert.ok(mobile.includes('--ns-mobile-paper: #FAF7F2;'));
  assert.ok(mobile.includes('--ns-mobile-forest: #6F7B55;'));
  assert.ok(mobile.includes('--admin-forest: #6F7B55;'));
  assert.doesNotMatch(mobile, /--(?:ns-mobile|admin)-forest:\s*#073b2b/i);
  assert.doesNotMatch(mobile, /background:\s*#073b2b|color:\s*#073b2b/i);
});

test('a escolha dos quatro estilos permanece explícita e a prancha Natural Sereno é a referência do card', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const app = read('src/App.tsx');
  assert.ok(modal.includes("new URL('../../docs/visual-qa/natural-sereno/reference.jpg', import.meta.url).href"));
  assert.ok(modal.includes('src={NATURAL_SERENO_OFFICIAL_BOARD}'));
  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes("const confirmButtonRadius = !selectedLayout || selectedLayout === 'natural-sereno' ? 'rounded-[18px]' : 'rounded-full';"));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(app.includes('const [layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false);'));
  assert.ok(app.includes('{(!layoutConfirmedThisSession || layoutChoiceRequested) && ('));
  assert.ok(app.includes('layoutConfirmedThisSession ? OFFICIAL_LAYOUTS.find(layout => layout.id === userProfile?.visualLayout) : undefined'));
});

test('logo, voz neural, Solfeggio, Diário e respiração do player preservam os guardrails aprovados', () => {
  const approved = read('src/natural-sereno-approved-overrides.css');
  const voice = read('src/lib/naturalSerenoOfficialVoicePatch.ts');
  const audio = read('src/lib/audioIntegrityPatch.ts');
  const diary = read('src/components/DailyDiaryModal.tsx');
  const player = read('src/components/MeditationSession.tsx');
  assert.ok(approved.includes('opacity:.30!important'));
  assert.ok(voice.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(audio.includes('396|417|432|528|639|741|852|963'));
  assert.ok(audio.includes('isNeuralVoicePreviewActive()'));
  assert.ok(diary.includes('saveEntryHandler(activeDay, finalJournalText, editingMood)'));
  assert.ok(player.includes("const breathTransitionSeconds = breathePhase === 'inhale' ? 4 : breathePhase === 'hold' ? 3 : 5;"));
});


test('botão de feedback do Natural Sereno atende contraste WCAG AA', () => {
  const css = read('src/natural-sereno-refinement.css');
  const ruleStart = css.indexOf(':root[data-layout="natural-sereno"] #anamnesis-modal #anamnesis-feedback-area button[class*="bg-emerald"] {');
  const ruleEnd = ruleStart >= 0 ? css.indexOf('}', ruleStart) : -1;
  const buttonRule = ruleStart >= 0 && ruleEnd >= 0 ? css.slice(ruleStart, ruleEnd + 1) : '';
  const backgroundLine = css.split('\n').find(line => line.includes('--ns-modal-forest: #'));
  const background = backgroundLine?.split(':').at(-1)?.trim().slice(0, 7) ?? '';
  const foreground = buttonRule.split('color:')[1]?.trim().slice(0, 7) ?? '';

  assert.equal(foreground.toUpperCase(), '#FFFFFF');
  assert.match(background, /^#[0-9A-Fa-f]{6}$/);

  const luminance = (hex: string) => {
    const normalized = hex.replace('#', '');
    const channels = [0, 2, 4].map(index => parseInt(normalized.slice(index, index + 2), 16) / 255);
    const linear = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const first = luminance(foreground);
  const second = luminance(background);
  const contrast = (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);

  assert.ok(contrast >= 4.5, `Contraste do botão de feedback: ${contrast.toFixed(2)}:1 (mínimo 4.5:1).`);
});


test('Home Natural Sereno não mantém regras runtime antigas contraditórias', () => {
  const model = read('src/lib/naturalSerenoHomeApprovedModel.ts');
  const count = (selector: string) => model.split(selector).length - 1;

  assert.equal(count(':root[data-layout="natural-sereno"] .ns-home-scene::after {'), 1);
  assert.equal(count(':root[data-layout="natural-sereno"] .ns-home-menu {'), 1);
  assert.equal(count(':root[data-layout="natural-sereno"] .ns-greeting {'), 1);
  assert.equal(count(':root[data-layout="natural-sereno"] .ns-greeting h1 {'), 1);
  assert.equal(count(':root[data-layout="natural-sereno"] .ns-greeting p {'), 1);
  assert.equal(count(':root[data-layout="natural-sereno"] .ns-home-message {'), 1);
  assert.doesNotMatch(model, /margin-top:\s*-34px|max-width:\s*84%|min-height:\s*405px/);
  assert.match(model, /line-height:\s*1\.55 !important/);
  assert.match(model, /align-self:\s*center/);
});

test('salvar o Diário sem campos opcionais preserva sensações e gratidões existentes', () => {
  const app = read('src/App.tsx');
  const start = app.indexOf('const handleSaveDiaryDay');
  const end = app.indexOf('// Save treatment expectations', start);
  const handler = start >= 0 && end > start ? app.slice(start, end) : '';

  assert.ok(handler.includes('sensations: sensations !== undefined ? sensations : d.sensations'));
  assert.ok(handler.includes('gratitudes: gratitudes !== undefined ? gratitudes : d.gratitudes'));
});


test('Anamnese Natural Sereno mantém CTA de 18px, hover creme e sombra café', () => {
  const css = read('src/natural-sereno.css');
  const ctaStart = css.indexOf(':root[data-layout="natural-sereno"] #anamnesis-modal button[class*="from-emerald-600"] {');
  const ctaEnd = ctaStart >= 0 ? css.indexOf('}', ctaStart) : -1;
  const cta = ctaStart >= 0 && ctaEnd > ctaStart ? css.slice(ctaStart, ctaEnd + 1) : '';

  assert.ok(cta.includes('border-radius: 18px;'));
  assert.doesNotMatch(cta, /24px|#eee5c9/i);
  assert.ok(css.includes('box-shadow: 0 3px 12px rgba(67,52,39,.07);'));
  assert.equal(css.includes('rgba(7,59,43'), false);
});


test('salvamentos compostos usam o mesmo snapshot atualizado de progresso', () => {
  const app = read('src/App.tsx');
  const profileStart = app.indexOf('const saveProfile = (newProfile: UserProfile, progressOverride?: DayProgress[])');
  const progressStart = app.indexOf('const saveProgress', profileStart);
  const profileSaver = profileStart >= 0 && progressStart > profileStart ? app.slice(profileStart, progressStart) : '';

  assert.ok(profileSaver.includes('setProgress(progressOverride)'));
  assert.ok(profileSaver.includes('updateLocalAccountCache(newProfile, nextProgress)'));
  assert.ok(profileSaver.includes('progress: progressOverride'));

  const systemicStart = app.indexOf('const handleSaveSystemicAnswer');
  const diaryStart = app.indexOf('// Save detailed diary entry', systemicStart);
  const treatmentStart = app.indexOf('// Save treatment expectations', diaryStart);
  const systemic = systemicStart >= 0 && diaryStart > systemicStart ? app.slice(systemicStart, diaryStart) : '';
  const diary = diaryStart >= 0 && treatmentStart > diaryStart ? app.slice(diaryStart, treatmentStart) : '';

  assert.ok(systemic.includes('saveProfile(updatedProfile, updatedProgress)'));
  assert.ok(diary.includes('saveProfile(updatedProfile, updatedProgress)'));
  const systemicElse = systemic.indexOf('} else {');
  const systemicFallback = systemic.indexOf('saveProgress(updatedProgress);');
  assert.ok(systemicElse >= 0 && systemicFallback > systemicElse);
  const diaryElse = diary.indexOf('} else {');
  const diaryFallback = diary.indexOf('saveProgress(updatedProgress);');
  assert.ok(diaryElse >= 0 && diaryFallback > diaryElse);
});


test('Natural Sereno não reintroduz fallback verde-floresta nem amarelo saturado nas cenas', () => {
  const css = read('src/natural-sereno.css');
  for (const legacyColor of ['#063020', 'rgba(2, 31, 19, .15)', '#297241', '#edf1d8', '#e6c66e']) {
    assert.equal(css.includes(legacyColor), false, `Cor legada encontrada: ${legacyColor}`);
  }
  assert.ok(css.includes("presenca.webp') center / cover no-repeat #2A2421"));
  assert.ok(css.includes("acolhimento.webp') center / cover no-repeat #2A2421"));
  assert.ok(css.includes('var(--ns-waterfall) center / cover no-repeat #2A2421'));
  assert.ok(css.includes('#5E6948; background: rgba(111,123,85,.10)'));
  assert.ok(css.includes('background: #C89D52;'));
});

test('logo oficial do Natural Sereno permanece sutil em desktop e mobile', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  assert.ok(css.includes('.ns-welcome-brand'));
  assert.ok(css.includes('opacity:.30!important'));
  assert.ok(css.includes('#auth-loading-view .ep-brand-signature-wrap'));
  assert.ok(css.includes('@media(max-width:640px)'));
  assert.ok(css.includes('opacity:.26!important'));
});

test('Natural Sereno bloqueia frequências Solfeggio durante a prévia da voz neural', () => {
  const settings = read('src/components/AudioSettingsModal.tsx');
  assert.ok(settings.includes('const isStyle1SolfeggioBlocked = isNaturalSereno && isTestingVoice && isSolfeggioFrequency(track.id);'));
  assert.ok(settings.includes('const isTrackBlockedDuringVoicePreview = isStyle1SolfeggioBlocked || isStyle2SolfeggioBlocked || isStyle3SolfeggioBlocked;'));
});

test('Arcanjo no Natural Sereno exige voz neural e não permite fallback nativo', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  assert.ok(arcanjo.includes("const isNaturalSereno = typeof document !== 'undefined' && document.documentElement.dataset.layout === 'natural-sereno';"));
  assert.ok(arcanjo.includes('const requiresNeuralVoice = isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa;'));
  assert.ok(arcanjo.includes('const effectiveVoiceId = (isNaturalSereno || isEssenciaLuminosa)'));
  assert.ok(arcanjo.includes('voiceId: effectiveVoiceId,'));
  assert.ok(arcanjo.includes('requireExplicitVoiceId: requiresNeuralVoice,'));
  const fallbackStart = arcanjo.indexOf('const startNativeFallback');
  const startStart = arcanjo.indexOf('const start =', fallbackStart);
  const fallback = fallbackStart >= 0 && startStart > fallbackStart ? arcanjo.slice(fallbackStart, startStart) : '';
  assert.ok(fallback.includes('if (requiresNeuralVoice)'));
  assert.ok(fallback.indexOf('if (requiresNeuralVoice)') < fallback.indexOf('setIsPlaying(true)'));
});


test('Natural Sereno exige voz neural nos caminhos de Anamnese, Reflexão Sistêmica, Ho’oponopono e oração', () => {
  const anamnesis = read('src/components/AnamnesisModal.tsx');
  const systemic = read('src/components/SystemicQuestionsModal.tsx');
  const hooponopono = read('src/components/HooponoponoModal.tsx');
  const archangelPrayer = read('src/components/ArchangelMichaelPrayerModal.tsx');

  assert.ok(anamnesis.includes('const requiresNeuralVoice = naturalSereno || isEleganciaProfunda || isEssenciaLuminosa;'));
  assert.ok(anamnesis.includes('voiceId: neuralVoiceId,'));
  assert.ok(anamnesis.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(anamnesis.indexOf('if (requiresNeuralVoice)') < anamnesis.indexOf('window.speechSynthesis.speak(utterance)'));

  assert.ok(systemic.includes('const requiresNeuralVoice = isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa;'));
  assert.ok(systemic.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(systemic.indexOf('if (requiresNeuralVoice)') < systemic.indexOf('audioEngine.previewVoice({'));

  assert.ok(hooponopono.includes('const requiresNeuralVoice = isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa;'));
  assert.ok(hooponopono.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(hooponopono.includes('voiceId: requiresNeuralVoice'));

  assert.ok(archangelPrayer.includes('const requiresNeuralVoice = isNaturalSereno || isEleganciaProfunda || isEssenciaLuminosa;'));
  assert.ok(archangelPrayer.includes('fallbackToSpeechSynthesis: !requiresNeuralVoice'));
  assert.ok(archangelPrayer.includes('voiceId: effectiveVoiceId'));
});

test('CTA de entrada do player Natural Sereno mantém cantos premium de 18px', () => {
  const css = read('src/natural-sereno.css');
  const portal = read('src/components/session/ProtocolAcceptancePortal.tsx');
  assert.ok(css.includes('#meditation-session .ep-acceptance-portal button:last-child { border-radius: 18px;'));
  assert.ok(!css.includes('#meditation-session .ep-acceptance-portal button:last-child { border-radius: 24px;'));
  assert.ok(portal.includes('rounded-xl'));
});


test('Anamnese Natural Sereno mostra a voz neural real e usa apenas dourado refinado no player', () => {
  const anamnesis = read('src/components/AnamnesisModal.tsx');
  const refinement = read('src/natural-sereno-refinement.css');
  const lowerRefinement = refinement.toLowerCase();

  assert.ok(anamnesis.includes('const neuralVoiceLabel = isElevenLabsVoiceId(userProfile.voiceId)'));
  assert.ok(anamnesis.includes('{!requiresNeuralVoice ? ('));
  assert.ok(anamnesis.includes('{requiresNeuralVoice ? neuralVoiceLabel : selectedVoiceGender ==='));
  assert.ok(anamnesis.includes('Marianne — Meditação (voz oficial)'));

  for (const legacyGold of ['#d8bd6b', '#896923', '#e5c773', '#a8812e', '#efd896', '#fff0b3', '#c3a557']) {
    assert.ok(!lowerRefinement.includes(legacyGold), `cor antiga ${legacyGold} não deve voltar ao player da Anamnese`);
  }
  assert.ok(refinement.includes('linear-gradient(180deg, #E2B96B, #C89D52)'));
  assert.ok(refinement.includes('linear-gradient(to top, #5E6948, #C89D52)'));
});


test('o player mobile do Natural Sereno não mantém overlay verde-floresta ou dourado saturado legado', () => {
  const mobile = read('src/natural-sereno-mobile-fixes.css');
  for (const legacy of [
    'rgba(3,26,19',
    'rgba(5,38,28',
    'rgba(6,46,32',
    'rgba(38,80,58',
    'rgba(15,49,36',
    '#d7b45c',
    '#a67a28',
    '#d8bd7a',
    '#ead8a6',
    '#ebd7a0',
    '#fff4d8'
  ]) {
    assert.equal(mobile.includes(legacy), false, `Player mobile ainda contém ${legacy}`);
  }
  assert.ok(mobile.includes('var(--ns-waterfall) center top / cover no-repeat'));
  assert.ok(mobile.includes('rgba(250,247,242,.28) 36%'));
  assert.ok(mobile.includes('linear-gradient(180deg,#E2B96B 0%,#C89D52 100%) !important;'));
  assert.ok(mobile.includes('rgba(200,157,82,.24)'));
});

test('Anamnese e planos Natural Sereno usam creme, café e dourado refinado, sem painel amarelo legado', () => {
  const base = read('src/natural-sereno.css');
  const refinement = read('src/natural-sereno-refinement.css');
  assert.doesNotMatch(base, /#e9d296|#efefdf|#d8caa9/i);
  assert.doesNotMatch(refinement, /#315d3d|#fbf3dc|#dcc58b|#6e5620/i);
  assert.ok(refinement.includes('#FBF8F2'));
  assert.ok(refinement.includes('rgba(200,157,82,.30)'));
  assert.ok(base.includes('#plans-modal [class*="bg-violet"] { background: #FBF8F2;'));
});


test('planos, checkout e páginas secundárias respeitam a paleta Natural Sereno sem alterar a lógica financeira', () => {
  const approved = read('src/natural-sereno-approved-overrides.css');
  const plans = read('src/components/ProUpgradeModal.tsx');
  const baths = read('src/components/HerbalBathsModal.tsx');
  const astral = read('src/components/AstralMapModal.tsx');
  const numerology = read('src/components/NumerologyModal.tsx');

  assert.ok(plans.includes('id="plans-modal"'));
  assert.ok(approved.includes(':root[data-layout="natural-sereno"] #plans-modal > div {'));
  assert.ok(approved.includes('#plans-modal article button:last-child'));
  assert.ok(approved.includes('#plans-modal #checkout-planos button[data-benefit-choice][aria-pressed="true"]'));
  assert.ok(approved.includes('background:linear-gradient(180deg,#E2B96B 0%,#C89D52 100%)!important;'));

  assert.ok(baths.includes('id="herbal-baths-modal"'));
  assert.ok(approved.includes(':root[data-layout="natural-sereno"] #herbal-baths-modal'));
  assert.ok(approved.includes(':root[data-layout="natural-sereno"] #astral-map-modal'));
  assert.ok(approved.includes(':root[data-layout="natural-sereno"] #numerology-modal'));
  assert.ok(astral.includes('bg-amber-50/70'));
  assert.ok(numerology.includes('bg-amber-50'));

  assert.ok(plans.includes('requiresBenefitChoice ? benefitChoice || undefined : undefined'));
  assert.ok(plans.includes('onUpgradeSuccess(selectedPlan.id, paymentMethod, finalPrice'));
  assert.ok(plans.includes('INICIAR PAGAMENTO SEGURO'));
});


test('tokens compartilhados do Estilo 1 ficam na paleta Natural Sereno e não herdam a cena da Reintegração', () => {
  const approved = read('src/natural-sereno-approved-overrides.css');
  const main = read('src/main.tsx');
  const blocks = [...approved.matchAll(/:root\\[data-layout="natural-sereno"\\]\\s*\\{([\\s\\S]*?)\\}/g)];
  const finalBlock = blocks.at(-1)?.[1] ?? '';

  assert.ok(finalBlock.includes('--layout-canvas: #FAF7F2;'));
  assert.ok(finalBlock.includes('--layout-canvas-alt: #F5EFE5;'));
  assert.ok(finalBlock.includes('--layout-accent: #6F7B55;'));
  assert.ok(finalBlock.includes('--layout-gold: #C89D52;'));
  assert.ok(finalBlock.includes('--layout-gold-light: #E2B96B;'));
  assert.ok(finalBlock.includes('--layout-gold-dark: #A87E37;'));
  assert.ok(finalBlock.includes('--layout-text: #2A2421;'));
  assert.ok(finalBlock.includes('--layout-text-secondary: #6B625B;'));
  assert.ok(finalBlock.includes('--layout-border: #E8E0D5;'));
  assert.ok(finalBlock.includes('--ep-scene: var(--ns-valley);'));
  assert.ok(finalBlock.includes('--ep-panel-text: #2A2421;'));
  assert.doesNotMatch(finalBlock, /reintegracao-presenca-arte|rgba\\(6,42,31|rgba\\(5,35,26|#2D4A3E|#202D24/);

  assert.ok(main.indexOf("import './approved-theme.css';") < main.indexOf("import './natural-sereno-approved-overrides.css';"));
  assert.ok(main.indexOf("import './natural-sereno-approved-overrides.css';") > main.indexOf("import './natural-sereno.css';"));
});
