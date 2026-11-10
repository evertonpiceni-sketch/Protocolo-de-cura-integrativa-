import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('a Essência Luminosa usa uma representação corporal neutra e clara nas superfícies ativas', () => {
  const illustration = read('public/brand/chakra-body-neutral.svg');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const dashboard = read('src/components/DashboardCura.tsx');
  const home = read('src/components/TransformationHome.tsx');
  const audio = read('src/lib/audio.ts');

  assert.ok(illustration.includes('Silhueta abstrata sem características de gênero'));
  assert.ok(illustration.includes('viewBox="0 0 800 1000"'));
  assert.ok(!/#(?:021b13|073326|174c38)/i.test(illustration), 'a nova ilustração não pode recuperar o fundo verde-escuro');
  assert.ok(!/anatomia feminina|anatomia masculina|corpo feminino|corpo masculino/i.test(illustration));

  assert.ok(arcanjo.includes("neutral ? '/brand/chakra-body-neutral.svg' : '/brand/human-chakra-model.jpg'"));
  assert.ok(arcanjo.includes('neutral={isEssenciaLuminosa}'));
  assert.ok(dashboard.includes("isEssenciaLuminosa ? '/brand/chakra-body-neutral.svg' : '/brand/human-chakra-model.jpg'"));
  assert.ok(home.includes("isEssenciaLuminosa ? '/brand/chakra-body-neutral.svg' : '/brand/chakra-body.svg'"));
  assert.ok(home.includes('Representação corporal neutra em meditação'));
  assert.ok(audio.includes("document.documentElement.dataset.layout === 'essencia-luminosa'"));
  assert.ok(audio.includes("? '/brand/chakra-body-neutral.svg'"));
  assert.ok(audio.includes(": '/brand/chakra-body.svg'"));
  assert.ok(audio.includes('src: getProtocolMediaArtwork()'));
  assert.ok(audio.includes('const getProtocolStageMediaArtwork = () => isEssenciaLuminosaLayout()'));
  assert.ok(audio.includes('artwork: getProtocolStageMediaArtwork()'));
  assert.ok(audio.includes("{ src: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' }"), 'outros estilos preservam o artwork genérico do aplicativo');

  const approvedOverrides = read('src/essencia-luminosa-approved-overrides.css');
  assert.ok(approvedOverrides.includes('#arcanjo-protocol-view [class*="aspect-[4/5]"]'));
  assert.ok(approvedOverrides.includes('background: var(--layout-card) !important;'), 'o quadro corporal não pode exibir o fundo verde herdado');
});

test('as imagens históricas continuam preservadas para os estilos que não são Essência Luminosa', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const dashboard = read('src/components/DashboardCura.tsx');
  const home = read('src/components/TransformationHome.tsx');

  assert.ok(arcanjo.includes("neutral ? '/brand/chakra-body-neutral.svg' : '/brand/human-chakra-model.jpg'"));
  assert.ok(dashboard.includes("isEssenciaLuminosa ? '/brand/chakra-body-neutral.svg' : '/brand/human-chakra-model.jpg'"));
  assert.ok(home.includes("isEssenciaLuminosa ? '/brand/chakra-body-neutral.svg' : '/brand/chakra-body.svg'"));
});
