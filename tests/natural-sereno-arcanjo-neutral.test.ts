import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('protocolo Arcanjo mantém sete dias, sem usar chakras como estrutura diária', () => {
  const days = read('src/data/arcanjoProtocolDays.ts');
  const entries = days.match(/dia: [1-7],/g) || [];

  assert.equal(entries.length, 7);
  const dataOnly = days.slice(days.indexOf('export const ARCANJO_PROTOCOL_DAYS'));
  assert.doesNotMatch(dataOnly, /chakra|muladhara|svadhisthana|manipura|anahata|vishuddha|ajna|sahasrara/i);
  assert.match(days, /nome: 'Segurança'/);
  assert.match(days, /nome: 'Integração'/);
  assert.match(days, /freq: 396/);
  assert.match(days, /freq: 963/);
});

test('player Arcanjo usa silhueta neutra e mantém foco corporal, voz e Solfeggio', () => {
  const player = read('src/components/ArcanjoProtocolView.tsx');

  assert.ok(player.includes('NeutralBodyLightProgress'));
  assert.ok(player.includes('focusPosition={config.posicaoLuz}'));
  assert.ok(player.includes('focusLabel={config.local}'));
  assert.ok(player.includes('audioEngine.startSynth(`${config.freq}hz`)'));
  assert.ok(player.includes('requireExplicitVoiceId: requiresNeuralVoice'));
  assert.doesNotMatch(player, /human-chakra-model|ChakraBody|Chakra Básico|Chakra Coronário/i);
  assert.ok(player.includes('ep-arcanjo-natural'));
  assert.ok(player.includes('A voz do dispositivo não será usada.'));
});

test('dashboard ativo remove imagem chakra e preserva o progresso separado do Arcanjo', () => {
  const dashboard = read('src/components/DashboardCura.tsx');

  assert.ok(dashboard.includes('NeutralBodyLightProgress'));
  assert.ok(dashboard.includes('arcanjo7CompletedDays'));
  assert.ok(dashboard.includes('OPEN_PROTOCOL_DAY'));
  assert.doesNotMatch(dashboard, /human-chakra-model|CHAKRAS_DATA|Chakra Básico|Chakra Coronário/i);
  assert.ok(dashboard.includes('var(--layout-gold-gradient'));
});

test('conquista mantém ID persistido, mas remove o título antigo dos sete chakras', () => {
  const achievements = read('src/lib/achievementsData.ts');

  assert.ok(achievements.includes("id: 'mestre_dos_chakras'"));
  assert.ok(achievements.includes('Sete Dias de Presença'));
  assert.ok(achievements.includes('Completar os 7 dias do protocolo Arcanjo'));
  assert.doesNotMatch(achievements, /Jornada dos 7 Chakras|hasSevenChakraJourney|sevenChakraDays/);
});

test('Natural Sereno substitui chapas verdes do player Arcanjo por superfícies creme e respeita movimento reduzido', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const baseCss = read('src/index.css');
  const main = read('src/main.tsx');

  assert.ok(css.includes('#arcanjo-protocol-view.ep-arcanjo-natural .ep-forest-panel'));
  assert.ok(css.includes('linear-gradient(145deg,#FFFDF8 0%,#F5EFE5 100%) !important;'));
  assert.ok(css.includes('.ep-arcanjo-play-toggle'));
  assert.ok(baseCss.includes('.ep-neutral-body-progress__light-path'));
  assert.ok(baseCss.includes('@media (prefers-reduced-motion: reduce)'));
  assert.ok(main.indexOf("import './natural-sereno-approved-overrides.css';") > main.indexOf("import './natural-sereno.css';"));
});


test('player Natural Sereno usa paisagem real e microanimação neutra; os demais estilos mantêm seu canvas', () => {
  const session = read('src/components/MeditationSession.tsx');
  const conditionalStart = session.indexOf('{isNaturalSereno ? (');
  const otherStylesStart = session.indexOf(') : (', conditionalStart);
  const naturalBranch = session.slice(conditionalStart, otherStylesStart);
  const insights = read('src/types.ts');
  const sevenDayInsights = insights.slice(insights.indexOf('export const JOURNEY_7D_INSIGHTS'));

  assert.ok(conditionalStart >= 0 && otherStylesStart > conditionalStart);
  assert.ok(naturalBranch.includes('NeutralBodyLightProgress'));
  assert.ok(naturalBranch.includes('/brand/natural-sereno/cachoeira.webp'));
  assert.ok(session.includes("const NATURAL_SERENO_BODY_GLOW = 'rgba(200,157,82,.16)'"));
  assert.ok(naturalBranch.includes('lightSoft={NATURAL_SERENO_BODY_GLOW}'));
  assert.doesNotMatch(naturalBranch, /currentStage\\.colorTheme\\.glow/);
  assert.ok(naturalBranch.includes('breathePhase={breathePhase}'));
  assert.ok(!naturalBranch.includes('SacredEnergyCanvas'));
  assert.ok(session.includes('<SacredEnergyCanvas'));
  assert.ok(session.includes('getNaturalSerenoVisualFocus'));
  assert.ok(session.includes('ep-session-natural-sereno-overlay'));
  assert.doesNotMatch(sevenDayInsights, /title:\s*"Chakra/i);
  assert.doesNotMatch(sevenDayInsights, /jornada dos 7 chakras/i);
  assert.match(sevenDayInsights, /title:\s*"Segurança e Aterramento"/);
});


test('seletor dos quatro estilos continua obrigatório e o modal promocional legado não é montado', () => {
  const app = read('src/App.tsx');
  const selector = read('src/components/LayoutChoiceModal.tsx');

  assert.ok(app.includes('{(!layoutConfirmedThisSession || layoutChoiceRequested) && ('));
  assert.ok(app.includes('{showWelcomeModal && userProfile && layoutConfirmedThisSession && !layoutChoiceRequested && ('));
  assert.ok(selector.includes('const [selectedLayout, setSelectedLayout] = useState<LayoutId | null>(null)'));
  assert.ok(selector.includes('await onSelect(selectedLayout)'));
  assert.ok(selector.includes('disabled={!selectedLayout || isSaving}'));
  assert.ok(selector.includes('O estilo só será aplicado depois da sua confirmação.'));
  assert.ok(selector.includes('NATURAL_SERENO_OFFICIAL_BOARD'));
  assert.ok(selector.includes('src={NATURAL_SERENO_OFFICIAL_BOARD}'));
  assert.ok(existsSync(new URL('../docs/visual-qa/natural-sereno/reference.jpg', import.meta.url)));
  assert.doesNotMatch(app, /PromoVideoModal|showPromoVideoModal|bottom-btn-promo-video/);
});


test('cabeçalho do Arcanjo Natural Sereno usa marfim e dourado refinado, sem o token antigo', () => {
  const player = read('src/components/ArcanjoProtocolView.tsx');
  const css = read('src/natural-sereno-approved-overrides.css');
  const main = read('src/main.tsx');

  assert.ok(player.includes('id="arcanjo-protocol-view"'));
  assert.ok(player.includes('text-[#B88736]'), 'O teste deve proteger a classe antiga compartilhada contra vazamento visual.');
  const run125 = css.slice(css.lastIndexOf('/* RUN 125 — Arcanjo:'));
  assert.ok(run125.includes('#arcanjo-protocol-view.ep-arcanjo-natural > header'));
  assert.ok(run125.includes('background: rgba(250,247,242,.96) !important;'));
  assert.ok(run125.includes('border-bottom-color: rgba(200,157,82,.20) !important;'));
  assert.ok(run125.includes('color: #A87E37 !important;'));
  assert.ok(run125.includes('rgba(200,157,82,.08)'));
  assert.ok(main.indexOf("import './natural-sereno-approved-overrides.css';") > main.indexOf("import './natural-sereno.css';"));
});


test('ao retomar a narração neural do Arcanjo, Solfeggio é interrompido antes do áudio', () => {
  const player = read('src/components/ArcanjoProtocolView.tsx');
  const toggleStart = player.indexOf('const togglePlayback = () => {');
  const resumeIndex = player.indexOf('audioEngine.resumeSpeech();', toggleStart);
  const stopIndex = player.lastIndexOf('stopSolfeggio();', resumeIndex);
  assert.ok(toggleStart >= 0 && resumeIndex > toggleStart, 'Retomada do player não encontrada');
  assert.ok(stopIndex > toggleStart && stopIndex < resumeIndex, 'Solfeggio deve parar antes da retomada da narração');
  const pauseStart = player.indexOf('onPause: () => {');
  const pauseEnd = player.indexOf('onTimeUpdate:', pauseStart);
  assert.ok(pauseStart >= 0 && pauseEnd > pauseStart);
  assert.ok(player.slice(pauseStart, pauseEnd).includes('startSolfeggio();'), 'A frequência pode retornar durante a pausa');
  const frequencyStart = player.indexOf('const startSolfeggio = () => {');
  const audioGuard = player.indexOf('if (userProfile.audioEnabled === false)', frequencyStart);
  assert.ok(frequencyStart >= 0 && audioGuard > frequencyStart, 'A frequência deve respeitar a configuração global de áudio');
});


test('o brilho de carregamento do Arcanjo usa dourado refinado no Natural Sereno', () => {
  const player = read('src/components/ArcanjoProtocolView.tsx');
  const css = read('src/natural-sereno-approved-overrides.css');
  assert.ok(player.includes('via-[#d4af37]'), 'O teste protege a classe legada compartilhada');
  const run136 = css.slice(css.lastIndexOf('/* RUN 136 —'));
  assert.ok(run136.includes('#arcanjo-protocol-view.ep-arcanjo-natural .ep-forest-panel [class*="via-[#d4af37]"]'));
  assert.ok(run136.includes('linear-gradient(90deg, transparent, rgba(200,157,82,.72), transparent) !important;'));
});
