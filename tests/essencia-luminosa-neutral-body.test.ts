import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('a Essência Luminosa usa uma representação corporal neutra e clara nas superfícies ativas', () => {
  const illustration = read('public/brand/chakra-body-neutral.svg');
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const dashboard = read('src/components/DashboardCura.tsx');
  const home = read('src/components/TransformationHome.tsx');

  assert.ok(illustration.includes('Silhueta abstrata sem características de gênero'));
  assert.ok(illustration.includes('viewBox="0 0 800 1000"'));
  assert.ok(!/#(?:021b13|073326|174c38)/i.test(illustration), 'a nova ilustração não pode recuperar o fundo verde-escuro');
  assert.ok(!/anatomia feminina|anatomia masculina|corpo feminino|corpo masculino/i.test(illustration));

  assert.ok(arcanjo.includes("neutral ? '/brand/chakra-body-neutral.svg' : '/brand/human-chakra-model.jpg'"));
  assert.ok(arcanjo.includes('neutral={isEssenciaLuminosa}'));
  assert.ok(dashboard.includes("isEssenciaLuminosa ? '/brand/chakra-body-neutral.svg' : '/brand/human-chakra-model.jpg'"));
  assert.ok(home.includes("isEssenciaLuminosa ? '/brand/chakra-body-neutral.svg' : '/brand/chakra-body.svg'"));
  assert.ok(home.includes('Representação corporal neutra em meditação'));
});

test('as imagens históricas continuam preservadas para os estilos que não são Essência Luminosa', () => {
  const arcanjo = read('src/components/ArcanjoProtocolView.tsx');
  const dashboard = read('src/components/DashboardCura.tsx');
  const home = read('src/components/TransformationHome.tsx');

  assert.ok(arcanjo.includes("neutral ? '/brand/chakra-body-neutral.svg' : '/brand/human-chakra-model.jpg'"));
  assert.ok(dashboard.includes("isEssenciaLuminosa ? '/brand/chakra-body-neutral.svg' : '/brand/human-chakra-model.jpg'"));
  assert.ok(home.includes("isEssenciaLuminosa ? '/brand/chakra-body-neutral.svg' : '/brand/chakra-body.svg'"));
});
