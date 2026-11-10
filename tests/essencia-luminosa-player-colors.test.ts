import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

test('player da Essência Luminosa usa ouro suave sem alterar os outros estilos', () => {
  const player = fs.readFileSync('src/components/session/MinimalPlayerControls.tsx', 'utf8');
  const session = fs.readFileSync('src/components/MeditationSession.tsx', 'utf8');

  assert.ok(player.includes('isEssenciaLuminosa?: boolean'));
  assert.ok(player.includes("isEssenciaLuminosa = false"));
  assert.ok(player.includes("isEssenciaLuminosa ? '#C6A46A' : '#B88736'"));
  assert.ok(player.includes("isEssenciaLuminosa ? '#A87E37' : '#D4AF37'"));
  assert.ok(player.includes("isEssenciaLuminosa ? 'accent-[#C6A46A]' : 'accent-[#B88736]'"));
  assert.ok(player.includes("from-[#C6A46A]/15 via-[#A87E37]/40 to-[#C6A46A]/15"));
  assert.ok(player.includes("from-[#B88736]/15 via-[#D4AF37]/55 to-[#B88736]/15"));
  assert.ok(session.includes('isEssenciaLuminosa={isEssenciaLuminosa}'));
});
