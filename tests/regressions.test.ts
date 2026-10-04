import assert from 'node:assert/strict';
import test from 'node:test';
import { getLocalDateString } from '../src/utils/date';
import { normalizeBrazilianNationalPhone, toBrazilianWhatsAppNumber } from '../src/utils/phone';
import { DEFAULT_LAYOUT, OFFICIAL_LAYOUTS, normalizeLayoutId } from '../src/config/layouts';

test('preserves a Brazilian local number whose DDD is 55', () => {
  assert.equal(normalizeBrazilianNationalPhone('(55) 99999-9999'), '55999999999');
  assert.equal(toBrazilianWhatsAppNumber('(55) 99999-9999'), '5555999999999');
});

test('removes country code 55 only when the input has extra country-code length', () => {
  assert.equal(normalizeBrazilianNationalPhone('+55 (55) 99999-9999'), '55999999999');
  assert.equal(toBrazilianWhatsAppNumber('+55 (55) 99999-9999'), '5555999999999');
});

test('formats the supplied date using its local calendar fields', () => {
  const localDate = new Date(2026, 9, 4, 23, 30, 0);
  assert.equal(getLocalDateString(localDate), '2026-10-04');
});

test('keeps the four official visual layouts registered', () => {
  assert.deepEqual(
    OFFICIAL_LAYOUTS.map(layout => layout.id),
    ['natural-sereno', 'elegancia-profunda', 'essencia-luminosa', 'mistico-moderno']
  );
});

test('falls back to Natural Sereno for an invalid or missing layout', () => {
  assert.equal(DEFAULT_LAYOUT, 'natural-sereno');
  assert.equal(normalizeLayoutId(undefined), 'natural-sereno');
  assert.equal(normalizeLayoutId('layout-inexistente'), 'natural-sereno');
  assert.equal(normalizeLayoutId('mistico-moderno'), 'mistico-moderno');
});
