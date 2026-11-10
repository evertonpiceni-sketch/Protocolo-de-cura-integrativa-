import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('Estúdio de Vídeos da Essência Luminosa neutraliza a herança verde sem alterar o mapa visual', () => {
  const css = read('src/essencia-luminosa-shared-modals-audit.css');
  const studio = read('src/components/VideoStudioLightModal.tsx');
  const main = read('src/main.tsx');

  assert.ok(main.includes("import './essencia-luminosa-shared-modals-audit.css';"));
  assert.ok(studio.includes('id="video-studio-modal"'));
  assert.ok(studio.includes('ReintegrationPresenceVisual'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #video-studio-modal'));
  assert.ok(css.includes('[class*="bg-[#174B37]"]'));
  assert.ok(css.includes('[class*="bg-[#5E7153]"]'));
  assert.ok(css.includes('[class*="text-[#41503A]"]'));
  assert.ok(css.includes('button[aria-pressed="true"]'));
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'));
  assert.ok(!css.includes('data-layout="natural-sereno"'));
  assert.ok(!css.includes('data-layout="elegancia-profunda"'));
  assert.ok(!css.includes('data-layout="mistico-moderno"'));
});

test('Certificado e relatório usam ouro suave e sálvia clara, sem o verde escuro herdado', () => {
  const css = read('src/essencia-luminosa-shared-modals-audit.css');
  const certificate = read('src/components/ProReportCertificateModal.tsx');

  assert.ok(certificate.includes('id="pro-certificate-modal"'));
  assert.ok(certificate.includes('text-[#2D4A3E]'));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #pro-certificate-modal > div'));
  assert.ok(css.includes('[class*="text-[#2D4A3E]"]'));
  assert.ok(css.includes('var(--layout-accent)'));
  assert.ok(css.includes('button[class~="bg-[#B88736]"]'));
  assert.ok(css.includes('var(--layout-gold-gradient)'));
});

test('Diário permanece fechado por padrão e abre somente por ação explícita', () => {
  const app = read('src/App.tsx');
  const diary = read('src/components/DailyDiaryModal.tsx');

  assert.ok(app.includes('const [showDailyDiaryModal, setShowDailyDiaryModal] = useState<boolean>(false);'));
  const openCalls = [...app.matchAll(/setShowDailyDiaryModal\(true\)/g)];
  assert.equal(openCalls.length, 1, 'o Diário só deve ter um ponto explícito de abertura');
  const openContext = app.slice(Math.max(0, openCalls[0].index! - 280), openCalls[0].index! + 100);
  assert.ok(openContext.includes('onClick={() =>'));
  assert.ok(openContext.includes('setDailyDiaryModalDay(currentDay)'));
  assert.ok(diary.includes('if (!isOpen) return null;'));
});

test('Ajustes > Aparência usa somente o seletor React oficial, sem a confirmação legada duplicada', () => {
  const main = read('src/main.tsx');
  const app = read('src/App.tsx');

  assert.ok(app.includes('onClick={() => setLayoutChoiceRequested(true)}'));
  assert.ok(app.includes('layoutConfirmedThisSession && userProfile.visualLayout === layout.id'));
  assert.ok(!main.includes('layoutSettingsExplicitConfirmationPatch'));
  assert.ok(!app.includes('layoutSettingsExplicitConfirmationPatch'));
});


test('assinatura do cabeçalho não recebe moldura dominante no Estilo 3', () => {
  const app = read('src/App.tsx');
  const css = read('src/essencia-luminosa-header-semantic-audit.css');
  const approved = read('src/essencia-luminosa-approved-overrides.css');

  assert.ok(app.includes('id="header-profile-avatar"'));
  assert.ok(app.includes('className="ep-brand-signature'));
  assert.ok(css.includes('#header-profile-avatar'));
  assert.ok(css.includes('background:transparent!important'));
  assert.ok(css.includes('border-color:transparent!important'));
  assert.ok(css.includes('box-shadow:none!important'));
  assert.ok(approved.includes('opacity:.30!important'));
  assert.ok(approved.includes('opacity:.26!important'));
});

test('logout do cabeçalho mantém a ação acessível sem rosa/vermelho na Essência Luminosa', () => {
  const app = read('src/App.tsx');
  const css = read('src/essencia-luminosa-header-semantic-audit.css');

  assert.ok(app.includes('id="header-btn-logout"'));
  assert.ok(app.includes('aria-label="Sair da conta"'));
  assert.ok(css.includes('#header-btn-logout{'));
  assert.ok(css.includes('#header-btn-logout:hover'));
  assert.ok(css.includes('#header-btn-logout:active'));
  assert.ok(css.includes('var(--layout-gold-soft)'));
  assert.ok(css.includes('var(--layout-text-secondary)'));
  assert.ok(css.includes('#header-btn-logout svg'));
});
