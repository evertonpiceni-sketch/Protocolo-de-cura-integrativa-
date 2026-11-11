import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Anamnese só toca o micro-chime após opt-in de áudio nesta sessão', () => {
  const source = read('src/components/AnamnesisModal.tsx');
  const helperStart = source.indexOf('const playSelectionChime = () => {');
  const helperEnd = source.indexOf('\n  };', helperStart);
  assert.ok(helperStart >= 0 && helperEnd > helperStart, 'helper de chime protegido não encontrado');

  const helper = source.slice(helperStart, helperEnd);
  assert.ok(helper.includes('if (!backgroundPlaybackRequested || userProfile.audioEnabled === false) return;'));
  assert.equal(source.split('audioEngine.playHeartSelectionChime()').length - 1, 1,
    'a chamada direta ao chime deve existir somente dentro do helper protegido');
  assert.equal(source.split('playSelectionChime();').length - 1, 5,
    'todos os cinco controles de seleção devem usar o helper protegido');
});

test('salvar a anamnese não reativa a trilha apenas porque a preferência ficou salva', () => {
  const source = read('src/components/AnamnesisModal.tsx');
  const restoreStart = source.indexOf('const restoreUserBackground = () => {');
  const restoreEnd = source.indexOf('\n  };', restoreStart);
  assert.ok(restoreStart >= 0 && restoreEnd > restoreStart);
  const restore = source.slice(restoreStart, restoreEnd);

  assert.ok(restore.includes('backgroundPlaybackRequested && userProfile.audioEnabled !== false'));
  assert.ok(restore.includes('audioEngine.startBG(userProfile.bgMusicType)'));
  assert.equal(source.split('audioEngine.startBG(userProfile.bgMusicType)').length - 1, 1,
    'a restauração da trilha deve existir somente no helper que exige consentimento da sessão');
  assert.equal(source.includes('if (userProfile.audioEnabled && userProfile.bgMusicType'), false);
  assert.ok(source.split('restoreUserBackground();').length - 1 >= 2,
    'os fluxos de salvamento devem reutilizar a restauração protegida');
});

test('Solfeggio da Anamnese e das Perguntas Sistêmicas continua opt-in e cede à narração', () => {
  const anamnesis = read('src/components/AnamnesisModal.tsx');
  const systemic = read('src/components/SystemicQuestionsModal.tsx');
  const policy = read('src/lib/protocolSessionAudioPolicy.ts');

  const optInState = 'const [is639HzActive, setIs639HzActive] = useState<boolean>(false);';
  assert.ok(anamnesis.includes(optInState));
  assert.ok(systemic.includes(optInState));
  for (const source of [anamnesis, systemic]) {
    assert.ok(source.includes('shouldPlayInlineSolfeggio'));
    assert.ok(source.includes('voiceLoading:'));
    assert.ok(source.includes('voicePlaying:'));
  }
  assert.ok(policy.includes('input.isOpen && input.enabled && input.audioEnabled !== false'));
  assert.ok(policy.includes('!input.voiceLoading && !input.voicePlaying'));
});

test('prévia de voz e trilha de fundo respeitam opt-in explícito da sessão', () => {
  const app = read('src/App.tsx');
  const settings = read('src/components/AudioSettingsModal.tsx');

  assert.ok(app.includes('const [audioPlaybackRequested, setAudioPlaybackRequested] = useState(false);'));
  assert.ok(settings.includes("const shouldPlayVoiceBackground = playbackRequested && audioEnabled && bgMusicType !== 'none' &&"));
  assert.ok(settings.includes("const keepExplicitPlayback = allowBackgroundPlayback && playbackRequested && audioEnabled && bgMusicType !== 'none';"));
});

test('Reintegração continua exigindo aceite e comando explícito de início', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  assert.ok(journey.includes('const [accepted, setAccepted] = useState(false);'));
  assert.ok(journey.includes('const [playing, setPlaying] = useState(false);'));
  assert.ok(journey.includes('if (!accepted) return;'));
  assert.ok(journey.includes('const startGuidedMeditation = async () => {'));
});
