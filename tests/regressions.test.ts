import assert from 'node:assert/strict';
import test from 'node:test';
import { getLocalDateString } from '../src/utils/date';
import { normalizeBrazilianNationalPhone, toBrazilianWhatsAppNumber } from '../src/utils/phone';

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
