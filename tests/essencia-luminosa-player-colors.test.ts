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
  assert.ok(player.includes("const focusRingClass = isEssenciaLuminosa"));
  assert.ok(player.includes("'focus-visible:ring-[#C6A46A]/45'"));
  assert.ok(player.includes("const playButtonClass = isEssenciaLuminosa"));
  assert.ok(player.includes("from-[#F7F3E8] via-[#C6A46A] to-[#A87E37] text-[#2A2420]"));
  assert.ok(player.includes("focus-visible:ring-[#C6A46A]/45"));
  assert.ok(player.includes("'text-[#8F631E] bg-[#F7F3E8] border border-[#E5DAC6]'"));
  assert.ok(player.includes("isEssenciaLuminosa ? 'fill-[#2A2420]' : 'fill-white'"));
  assert.ok(player.includes("'text-rose-500 bg-rose-50'"), 'o estado dos outros estilos deve permanecer inalterado');
  assert.ok(session.includes('isEssenciaLuminosa={isEssenciaLuminosa}'));
});
