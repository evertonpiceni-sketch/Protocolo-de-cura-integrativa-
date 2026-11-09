import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

const focusGuards: Array<[string, string[]]> = [
  ['src/components/AnamnesisModal.tsx', [
    'const managedDialogFocus = naturalSereno || isEssenciaLuminosa;',
    'useDialogFocus(isOpen && managedDialogFocus'
  ]],
  ['src/components/CoursesModal.tsx', [
    "useDialogFocus(isOpen && ['natural-sereno', 'essencia-luminosa']"
  ]],
  ['src/components/DashboardCura.tsx', [
    "useDialogFocus(['natural-sereno', 'essencia-luminosa']"
  ]],
  ['src/components/ContactModal.tsx', [
    "useDialogFocus(isOpen && ['natural-sereno', 'essencia-luminosa']"
  ]],
  ['src/components/PromoVideoModal.tsx', [
    "useDialogFocus(isOpen && ['natural-sereno', 'essencia-luminosa']"
  ]],
  ['src/components/ProReportCertificateModal.tsx', [
    "useDialogFocus(isOpen && ['natural-sereno', 'essencia-luminosa']"
  ]],
  ['src/components/AdminPanelModal.tsx', [
    "useDialogFocus(isOpen && ['natural-sereno', 'essencia-luminosa']"
  ]],
  ['src/components/DailyTipModal.tsx', [
    'useDialogFocus(isEssenciaLuminosa, dialogRef, onClose)',
    'ref={dialogRef}'
  ]],
  ['src/components/OnboardingFlow.tsx', [
    'useDialogFocus(true, dialogRef, null)',
    'useReducedMotion() ?? false',
    'initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}',
    'transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}'
  ]],
  ['src/components/MilestoneCelebrationModal.tsx', [
    'useDialogFocus(isOpen && isEssenciaLuminosa, dialogRef, onClose)',
    'ref={dialogRef}'
  ]],
  ['src/components/MeditationSession.tsx', [
    "useDialogFocus(isEssenciaLuminosa && userPlan === 'free' && dayNumber > 7",
    "useDialogFocus(isEssenciaLuminosa && sessionPhase === 'completed'",
    'ref={accessGateDialogRef}',
    'ref={completedDialogRef}'
  ]],
  ['src/App.tsx', [
    'useDialogFocus(selectedDayDetail !== null && isEssenciaLuminosa',
    'ref={dayDetailDialogRef}'
  ]]
];

test('todos os diálogos compartilhados mantêm foco gerenciado na Essência Luminosa', () => {
  for (const [path, markers] of focusGuards) {
    const source = read(path);
    assert.ok(source.includes('useDialogFocus('), `${path}: hook de foco ausente`);
    for (const marker of markers) {
      assert.ok(source.includes(marker), `${path}: marcador de foco ausente: ${marker}`);
    }
  }
});

test('o acolhimento ativo usa a marca oficial e mantém WelcomeModal fora do fluxo', () => {
  const app = read('src/App.tsx');
  const onboarding = read('src/components/OnboardingFlow.tsx');
  assert.ok(app.includes("const OnboardingFlow = React.lazy(() => import('./components/OnboardingFlow'))"));
  assert.ok(app.includes('<OnboardingFlow'));
  assert.ok(!app.includes("import('./components/WelcomeModal')"));
  assert.ok(onboarding.includes('APPROVED_LOGO_DATA_URI'));
  assert.ok(onboarding.includes('ep-brand-signature'));
});

test('o seletor mantém escolha explícita e a prancha oficial do Estilo 3', () => {
  const modal = read('src/components/LayoutChoiceModal.tsx');
  const app = read('src/App.tsx');
  assert.ok(modal.includes('useState<LayoutId | null>(null)'));
  assert.ok(modal.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(modal.includes('/brand/essencia-luminosa/prancha-oficial.webp'));
  assert.ok(app.includes('const [layoutConfirmedThisSession, setLayoutConfirmedThisSession] = useState(false);'));
  assert.ok(app.includes('A persisted preference is not consent to apply a theme in this session.'));
});

test('o detalhe do dia usa superfícies marfim, champagne e sálvia no Estilo 3', () => {
  const app = read('src/App.tsx');
  const css = read('src/essencia-luminosa-approved-overrides.css');
  assert.ok(app.includes('id="day-detail-modal"'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #day-detail-modal'));
  assert.ok(css.includes('#day-detail-modal [class*="bg-indigo-"]'));
  assert.ok(css.includes('#day-detail-modal [class*="bg-emerald-"]'));
  assert.ok(css.includes('#day-detail-modal [class*="text-emerald-"]'));
  assert.ok(css.includes('#day-detail-modal [class*="text-amber-"]'));
  assert.ok(css.includes('#day-detail-modal button[class*="bg-[#B88736]"]'));
});

test('a celebração neutraliza o rosa residual e mantém o CTA externo em sálvia', () => {
  const component = read('src/components/MilestoneCelebrationModal.tsx');
  const css = read('src/essencia-luminosa-milestone-audit.css');
  assert.ok(component.includes('a.bg-emerald-600') || component.includes('bg-emerald-600'));
  assert.ok(css.includes('[aria-label="Celebração de progresso"] a.bg-emerald-600'));
  assert.ok(css.includes('[aria-label="Celebração de progresso"] a.bg-emerald-600:hover'));
  assert.ok(css.includes('[aria-label="Celebração de progresso"] [class*="text-rose-"]'));
  assert.ok(css.includes('color: var(--layout-accent)'));
});

test('player, sessão e diálogos respeitam prefers-reduced-motion', () => {
  const player = read('src/components/session/MinimalPlayerControls.tsx');
  const session = read('src/components/MeditationSession.tsx');
  const dailyTip = read('src/components/DailyTipModal.tsx');
  const milestone = read('src/components/MilestoneCelebrationModal.tsx');
  const onboarding = read('src/components/OnboardingFlow.tsx');
  assert.ok(player.includes('motion-reduce:animate-none'));
  assert.ok(session.includes('motion-reduce:animate-none'));
  assert.ok(dailyTip.includes('motion-reduce:animate-none'));
  assert.ok((milestone.match(/motion-reduce:animate-none/g) || []).length >= 3);
  assert.ok(onboarding.includes('useReducedMotion()'));
  assert.ok(onboarding.includes('transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}'));
});

test('a voz oficial e a propriedade do áudio do Arcanjo permanecem protegidas no Estilo 3', () => {
  const main = read('src/main.tsx');
  const voicePatch = read('src/lib/essenciaLuminosaOfficialVoicePatch.ts');
  const arcanjoOwnership = read('src/lib/arcanjoAudioOwnershipPatch.ts');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  assert.ok(main.includes("import './lib/essenciaLuminosaOfficialVoicePatch'"));
  assert.ok(main.includes("import './lib/arcanjoAudioOwnershipPatch'"));
  assert.ok(voicePatch.includes('OFFICIAL_PROTOCOL_VOICE_ID'));
  assert.ok(voicePatch.includes('preferElevenLabs: true'));
  assert.ok(voicePatch.includes('fallbackToSpeechSynthesis: false'));
  assert.ok(arcanjoOwnership.includes("window.addEventListener('OPEN_PROTOCOL_DAY'"));
  assert.ok(arcanjoOwnership.includes('audioEngine.stopBG()'));
  assert.ok(arcanjo.includes('requireExplicitVoiceId: isEleganciaProfunda || isEssenciaLuminosa'));
});

test('as oito frequências Solfeggio e o bloqueio durante prévia neural continuam ativos', () => {
  const policy = read('src/lib/protocolSessionAudioPolicy.ts');
  const settings = read('src/components/AudioSettingsModal.tsx');
  for (const hz of ['396', '417', '432', '528', '639', '741', '852', '963']) {
    assert.ok(policy.includes(hz), `frequência ${hz} Hz ausente da política`);
    assert.ok(settings.includes(`'${hz}hz'`) || settings.includes(`"${hz}hz"`), `frequência ${hz} Hz ausente dos ajustes`);
  }
  assert.ok(settings.includes('shouldBlockTrackDuringNeuralVoicePreview'));
  assert.ok(policy.includes('!isSolfeggioFrequency(type)'));
});

test('Diário e histórico continuam ligados às camadas semânticas do Estilo 3', () => {
  const main = read('src/main.tsx');
  const diary = read('src/components/DailyDiaryModal.tsx');
  assert.ok(main.includes('essencia-luminosa-daily-diary-semantic-audit.css'));
  assert.ok(main.includes('essencia-luminosa-journal-dashboard-audit.css'));
  assert.ok(diary.includes('useDialogFocus'));
});

test('InfinitePay exige confirmação do valor exato e preserva as escolhas comerciais vigentes', () => {
  const routes = read('src/lib/paymentRoutes.ts');
  const catalog = read('src/lib/paymentCatalog.ts');
  const tests = read('tests/payment.test.ts');
  assert.ok(routes.includes('verified.amount !== order.cents'));
  assert.ok(routes.includes("['astral_map', 'numerology'].includes(benefitChoice)"));
  assert.ok(routes.includes("req.body?.couponCode !== 'VIP7'"));
  assert.ok(catalog.includes('PROMO15'));
  assert.ok(catalog.includes('PROMO20'));
  assert.ok(catalog.includes('7: 5990'));
  assert.ok(catalog.includes('21: 9990'));
  assert.ok(tests.includes("call('webhooks/payment'"));
  assert.ok(tests.includes("call('payment/confirm'"));
});


test('o logo do onboarding ativo permanece transparente e discreto em desktop e celular', () => {
  const css = read('src/essencia-luminosa-onboarding-audit.css');
  assert.ok(css.includes('.ep-care-onboarding-card .ep-brand-signature-wrap'));
  assert.ok(css.includes('.ep-care-onboarding-card .ep-brand-signature'));
  assert.ok(css.includes('opacity: .30'));
  assert.ok(css.includes('opacity: .26'));
  assert.ok(css.includes('background: transparent'));
});

test('o inventário das 24 folhas CSS mantém a âncora de escopo do Estilo 3', () => {
  const files = fs.readdirSync('src').filter(name =>
    name.startsWith('essencia-luminosa-') && name.endsWith('.css')
  );
  assert.equal(files.length, 24, 'inventário de folhas CSS do Estilo 3 mudou; revisar a cobertura');
  for (const file of files) {
    const css = read('src/' + file);
    assert.ok(
      css.includes('data-layout="essencia-luminosa"') || css.includes("data-layout='essencia-luminosa'"),
      file + ': âncora de escopo do Estilo 3 ausente'
    );
  }
});



function splitCssSelectorGroups(value: string): string[] {
  const groups: string[] = [];
  let current = '';
  let parentheses = 0;
  let brackets = 0;
  let quote: string | null = null;
  let escaped = false;

  for (const char of value) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === '\\') {
      current += char;
      escaped = true;
      continue;
    }
    if (quote) {
      current += char;
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      current += char;
      continue;
    }
    if (char === '(') parentheses++;
    else if (char === ')') parentheses = Math.max(0, parentheses - 1);
    else if (char === '[') brackets++;
    else if (char === ']') brackets = Math.max(0, brackets - 1);

    if (char === ',' && parentheses === 0 && brackets === 0) {
      if (current.trim()) groups.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) groups.push(current.trim());
  return groups;
}

function extractStyle3Selectors(css: string): string[] {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const preludes = [...source.matchAll(/([^{}]+)\{/g)].map(match => match[1].trim());
  return preludes
    .filter(prelude =>
      prelude &&
      !prelude.startsWith('@') &&
      !/^(from|to|\d+(?:\.\d+)?%)$/i.test(prelude)
    )
    .flatMap(splitCssSelectorGroups);
}

test('cada seletor das 24 folhas CSS permanece isolado à Essência Luminosa', () => {
  const files = fs.readdirSync('src').filter(name =>
    name.startsWith('essencia-luminosa-') && name.endsWith('.css')
  );
  assert.equal(files.length, 24, 'inventário de folhas CSS do Estilo 3 mudou; revisar a cobertura');

  let selectorCount = 0;
  for (const file of files) {
    const selectors = extractStyle3Selectors(read('src/' + file));
    assert.ok(selectors.length > 0, file + ': nenhum seletor CSS foi auditado');
    selectorCount += selectors.length;

    for (const selector of selectors) {
      assert.match(
        selector,
        /(?:html|:root)\[data-layout=(["'])essencia-luminosa\1\]/,
        file + ': seletor sem escopo exclusivo da Essência Luminosa: ' + selector
      );
    }
  }

  assert.ok(selectorCount >= 500, 'a cobertura de seletores caiu inesperadamente: ' + selectorCount);
});

test('a moldura da Celebração usa tokens suaves mesmo quando a etapa-base declara rosa', () => {
  const component = read('src/components/MilestoneCelebrationModal.tsx');
  const css = read('src/essencia-luminosa-milestone-audit.css');
  assert.ok(component.includes('border-rose-500/40'));
  const parentRule = css.match(
    /:root\[data-layout="essencia-luminosa"\] \[aria-label="Celebração de progresso"\] > div\s*\{([^}]*)\}/
  );
  assert.ok(parentRule, 'A superfície principal da celebração precisa de regra própria no Estilo 3.');
  assert.ok(parentRule[1].includes('border-color: color-mix(in srgb, var(--layout-gold-soft) 42%, var(--layout-border)) !important;'));
});

test('o tema só é aplicado após a confirmação persistida e antes de montar o acolhimento', () => {
  const app = read('src/App.tsx');
  const start = app.indexOf('onSelect={async (layout) => {');
  assert.ok(start >= 0, 'O seletor React deve ser o único ponto de confirmação.');
  const end = app.indexOf('        />', start);
  assert.ok(end > start, 'O bloco de confirmação do seletor deve estar completo.');
  const selection = app.slice(start, end);
  const persistenceGuard = selection.indexOf('if (!response.ok) throw new Error');
  const applyConfirmedTheme = selection.indexOf('document.documentElement.dataset.layout = layout;');
  const updateProfile = selection.indexOf('setUserProfile(updatedProfile);');
  assert.ok(persistenceGuard >= 0, 'Falha de persistência deve impedir a aplicação do estilo.');
  assert.ok(applyConfirmedTheme > persistenceGuard, 'O tema só pode ser aplicado depois da persistência bem-sucedida.');
  assert.ok(updateProfile > applyConfirmedTheme, 'O atributo visual deve estar pronto antes do render do acolhimento.');
});


test('as cores semânticas dos sete chakras são preservadas na Essência Luminosa', () => {
  const component = read('src/components/AnamnesisModal.tsx');
  const css = read('src/essencia-luminosa-anamnesis-audit.css');
  assert.ok(component.includes('ep-chakra-option p-3 rounded-2xl'));
  assert.ok(css.includes('.bg-emerald-50):not(.ep-chakra-option)'));
  assert.ok(css.includes('.text-emerald-400):not(.ep-chakra-option)'));
  assert.ok(css.includes('#anamnesis-modal .ep-chakra-option'));
});

test('as opções de chakra da Anamnese são acessíveis por teclado e expõem o estado selecionado', () => {
  const component = read('src/components/AnamnesisModal.tsx');
  assert.ok(component.includes('role="button"'));
  assert.ok(component.includes('tabIndex={0}'));
  assert.ok(component.includes('aria-pressed={isSel}'));
  assert.ok(component.includes("event.key !== 'Enter' && event.key !== ' '"));
  assert.ok(component.includes('event.repeat'));
  assert.ok(component.includes('focus-visible:ring-2 focus-visible:ring-[#C6A46A]/55'));
});

test('o logout remove o tema anterior antes de exigir uma nova escolha explícita', () => {
  const app = read('src/App.tsx');
  const start = app.indexOf('const handleLogout = async () => {');
  const end = app.indexOf('\n  };', start);
  assert.ok(start >= 0 && end > start, 'O fluxo de logout deve existir.');
  const logout = app.slice(start, end);
  const clearDomTheme = logout.indexOf('delete document.documentElement.dataset.layout;');
  const resetSessionConsent = logout.indexOf('setLayoutConfirmedThisSession(false);');
  const clearProfile = logout.indexOf('setUserProfile(null);');
  assert.ok(clearDomTheme >= 0, 'O tema anterior precisa ser removido do DOM no logout.');
  assert.ok(clearDomTheme < resetSessionConsent, 'Remover o tema deve preceder a limpeza da confirmação da sessão.');
  assert.ok(resetSessionConsent < clearProfile, 'A confirmação deve ser resetada antes de limpar o perfil.');
});

test('as folhas específicas das superfícies ativas do Estilo 3 estão carregadas sem reativar WelcomeModal', () => {
  const main = read('src/main.tsx');
  const activeSheets = [
    "import './essencia-luminosa-achievements-audit.css';",
    "import './essencia-luminosa-chakras-guide-audit.css';",
    "import './essencia-luminosa-contact-audit.css';",
    "import './essencia-luminosa-courses-audit.css';",
    "import './essencia-luminosa-herbal-baths-audit.css';",
    "import './essencia-luminosa-onboarding-audit.css'"
  ];
  for (const marker of activeSheets) {
    assert.ok(main.includes(marker), 'Folha ativa do Estilo 3 não carregada: ' + marker);
  }
  assert.ok(!main.includes("import './essencia-luminosa-welcome-audit.css'"), 'A folha do WelcomeModal legado não deve ser reativada.');
  const finalApproved = main.indexOf("import './essencia-luminosa-approved-overrides.css';");
  const lastActiveSheet = main.indexOf(activeSheets[activeSheets.length - 1]);
  assert.ok(finalApproved > lastActiveSheet, 'A camada final aprovada deve continuar depois das folhas específicas.');
  const onboarding = read('src/components/OnboardingFlow.tsx');
  const onboardingCss = read('src/essencia-luminosa-onboarding-audit.css');
  assert.ok(onboarding.includes('ep-care-onboarding-card'));
  assert.ok(onboardingCss.includes('.ep-care-onboarding-card'));
});
