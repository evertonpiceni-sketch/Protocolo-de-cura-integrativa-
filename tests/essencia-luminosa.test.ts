import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

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
  assert.ok(home.includes("const usesSavedVoiceSettings = isEssenciaLuminosa || props.visualLayout === 'elegancia-profunda';"));
  assert.ok(home.includes("const isEssenciaLuminosa = props.visualLayout === 'essencia-luminosa';"));
  assert.ok(home.includes('isLegacyVoiceAlias ? undefined : savedVoiceId'));
  assert.ok(home.includes('const preferElevenLabs = !isEssenciaLuminosa;'));
  const audio = read('src/lib/audio.ts');
  assert.ok(audio.includes('const customVoice = voices.find(v => v.name === options.voiceId);'));
  assert.ok(audio.includes('const preferElevenLabs = options?.preferElevenLabs !== false;'));
  assert.equal(home.split("preferElevenLabs, lang: 'pt-BR'").length - 1, 2);
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


test('os diálogos da Essência Luminosa mantêm foco, Tab e Escape dentro do diálogo', () => {
  const focusFiles = [
    'src/components/CoursesModal.tsx',
    'src/components/ContactModal.tsx',
    'src/components/PromoVideoModal.tsx',
    'src/components/AstralMapModal.tsx',
    'src/components/ProReportCertificateModal.tsx',
    'src/components/NumerologyModal.tsx',
    'src/components/SpecificTreatmentModal.tsx',
    'src/components/AdminPanelModal.tsx',
    'src/components/DashboardCura.tsx'
  ];
  for (const path of focusFiles) {
    assert.ok(read(path).includes("'essencia-luminosa'"), `${path} must enable the Style 3 focus trap`);
  }
  const anamnesis = read('src/components/AnamnesisModal.tsx');
  assert.ok(anamnesis.includes('const managedDialogFocus = naturalSereno || document.documentElement.dataset.layout === \'essencia-luminosa\';'));
  assert.ok(anamnesis.includes('if (isOpen && managedDialogFocus)'));
});

test('componentes compartilhados preservam assinatura sutil e acentos claros no Estilo 3', () => {
  const contact = read('src/essencia-luminosa-contact-audit.css');
  const courses = read('src/essencia-luminosa-courses-audit.css');
  const baths = read('src/essencia-luminosa-herbal-baths-audit.css');
  const welcome = read('src/essencia-luminosa-welcome-audit.css');
  const specific = read('src/components/SpecificTreatmentModal.tsx');
  const specificCss = read('src/essencia-luminosa-specific-treatment-audit.css');
  assert.ok(contact.includes('opacity:.4!important'));
  assert.ok(courses.includes('opacity:.30!important'));
  assert.ok(baths.includes('background:#E9EEE6; border-color:#A6B49B; color:#46523F;'));
  assert.ok(!baths.includes('#63745a'));
  assert.ok(welcome.includes('color: #2A2420 !important;'));
  assert.ok(specific.includes("import '../essencia-luminosa-specific-treatment-audit.css';"));
  assert.ok(specificCss.includes('html[data-layout="essencia-luminosa"] #specific-treatment-modal'));
});
