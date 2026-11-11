import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { REGUA_VISUAL_MUDANCA_5, VISUAL_MAP_21_DIAS } from '../src/data/visualMap21Dias';

test('the 21 approved poster paths resolve to the existing day artwork assets', () => {
  assert.equal(VISUAL_MAP_21_DIAS.length, 21);

  for (const day of VISUAL_MAP_21_DIAS) {
    const expectedPoster = `/brand/days/dia-${String(day.dia).padStart(2, '0')}.png`;
    const diskPath = resolve(process.cwd(), 'public', expectedPoster.slice(1));

    assert.equal(day.posterEsperado, expectedPoster, `posterEsperado for day ${day.dia}`);
    assert.equal(day.posterPath, expectedPoster, `posterPath for day ${day.dia}`);
    assert.ok(existsSync(diskPath), `missing approved poster asset for day ${day.dia}: ${expectedPoster}`);
  }

  assert.ok(
    REGUA_VISUAL_MUDANCA_5.tresEstadosObrigatorios[1].includes('/brand/days/dia-XX.png'),
    'the documented no-video fallback must point to the current approved day-art directory'
  );
});
