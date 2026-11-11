import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('logo oficial aparece como assinatura no cabeçalho da jornada, sem disputar espaço com os controles superiores', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  assert.ok(journey.includes('ep-reintegration-luminous'));
  assert.ok(journey.includes('ep-reintegration-brand-signature h-8 w-8 object-contain'));
  assert.doesNotMatch(journey, /ep-reintegration-logo[^\n]*fixed right-4 top-4/);
});

test('a assinatura permanece visível durante a sessão imersiva e no roteiro aberto', () => {
  const journey = read('src/components/PersonalJourney21.tsx');
  assert.ok(journey.includes('data-ep-reintegration-running="true"'));
  assert.ok(journey.includes('absolute left-4 top-[max(1rem,env(safe-area-inset-top))]'));
  assert.ok(journey.includes('ep-reintegration-script-close'));
  assert.ok((journey.match(/ep-reintegration-brand-signature/g) || []).length >= 3);
});

test('Pausa Consciente e Ainda Há Algo em Mim exibem o logo oficial sem criar selo ou moldura', () => {
  const pause = read('src/components/PausaConscienteLight.tsx');
  const reflection = read('src/components/AindaHaAlgoEmMimLight.tsx');
  for (const source of [pause, reflection]) {
    assert.ok(source.includes('APPROVED_LOGO_DATA_URI'));
    assert.ok(source.includes('ep-reintegration-brand-signature mx-auto mb-2 h-7 w-7 object-contain'));
    assert.ok(source.includes('alt="" aria-hidden="true"'));
  }
});

test('a cascata Natural Sereno mantém todas as assinaturas em 30% de opacidade e sem fundo ou moldura', () => {
  const css = read('src/natural-sereno-approved-overrides.css');
  const marker = css.lastIndexOf('/* RUN 168 — Logo da Reintegração');
  assert.ok(marker >= 0);
  const rule = css.slice(marker);
  assert.ok(rule.includes('opacity: .30 !important;'));
  assert.ok(rule.includes('background: transparent !important;'));
  assert.ok(rule.includes('border: 0 !important;'));
  assert.ok(rule.includes('box-shadow: none !important;'));
});
