export function normalizeBrazilianNationalPhone(value: string | null | undefined): string {
  const rawDigits = String(value || '').replace(/\D/g, '');
  const withoutCountryCode =
    rawDigits.length > 11 && rawDigits.startsWith('55')
      ? rawDigits.slice(2)
      : rawDigits;

  return withoutCountryCode.slice(0, 11);
}

export function toBrazilianWhatsAppNumber(value: string | null | undefined): string {
  const rawDigits = String(value || '').replace(/\D/g, '');
  if (!rawDigits) return '';

  if (rawDigits.length > 11 && rawDigits.startsWith('55')) {
    return rawDigits.slice(0, 13);
  }

  const national = rawDigits.slice(0, 11);
  return national ? `55${national}` : '';
}
