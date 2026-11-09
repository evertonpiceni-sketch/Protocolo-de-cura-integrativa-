import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('Mapa Astral do Estilo 3 remove verde profundo e amarelo herdados sem vazar para outros estilos', () => {
  const css = read('src/essencia-luminosa-shared-modals-audit.css');
  const main = read('src/main.tsx');

  assert.ok(main.indexOf("import './essencia-luminosa-shared-modals-audit.css';") >
    main.indexOf("import './essencia-luminosa-journal-dashboard-audit.css';"));
  assert.ok(css.includes(':root[data-layout="essencia-luminosa"] #astral-map-modal'));
  assert.ok(css.includes('[class*="bg-[#073b2b]"]'));
  assert.ok(css.includes('[class*="text-[#f2dda4]"]'));
  assert.ok(css.includes('[class*="bg-amber-"]'));
  assert.ok(css.includes('[class*="text-amber-"]'));
  assert.ok(css.includes('[class*="bg-emerald-"]'));
  assert.ok(css.includes('a[class*="bg-emerald-700"]'));
  assert.ok(css.includes('var(--layout-gold-gradient)'));
  assert.ok(!/data-layout="(natural-sereno|elegancia-profunda|mistico-moderno)"/.test(css));
});

test('Ajustes de Áudio do Estilo 3 usam tokens atuais em vez do ouro antigo', () => {
  const css = read('src/essencia-luminosa-shared-modals-audit.css');
  const settings = read('src/components/AudioSettingsModal.tsx');

  assert.ok(css.includes('#audio-settings-modal > div'));
  assert.ok(css.includes('#bioactive-tuning-panel'));
  assert.ok(css.includes('var(--layout-gold-soft)'));
  assert.ok(css.includes('var(--layout-gold-gradient)'));
  assert.ok(settings.includes('id="audio-settings-modal"'));
  assert.ok(settings.includes('const isEssenciaLuminosa ='));
});

test('A seleção de frequências fica bloqueada durante a prévia neural da Essência Luminosa', () => {
  const settings = read('src/components/AudioSettingsModal.tsx');

  assert.ok(settings.includes('const isStyle3SolfeggioBlocked = shouldBlockTrackDuringNeuralVoicePreview(isEssenciaLuminosa, isTestingVoice, track.id);'));
  assert.ok(settings.includes('const isStyle2SolfeggioBlocked = isEleganciaProfunda && isTestingVoice && isSolfeggioFrequency(track.id);'));
  assert.ok(settings.includes('const isTrackBlockedDuringVoicePreview = isStyle3SolfeggioBlocked || isStyle2SolfeggioBlocked;'));
  assert.ok(settings.includes('disabled={isTrackBlockedDuringVoicePreview}'));
  assert.ok(settings.includes('aria-disabled={isTrackBlockedDuringVoicePreview}'));
  assert.ok(settings.includes('if (isTrackBlockedDuringVoicePreview) return;'));
  assert.ok(settings.includes('Aguarde a prévia da voz terminar para alterar a frequência Solfeggio.'));
});


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
