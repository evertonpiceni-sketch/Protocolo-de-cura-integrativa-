export const INFINITEPAY_API = 'https://api.checkout.infinitepay.io';
export function normalizeInfiniteTag(value: string): string {
  const handle = value.trim().replace(/^\$/, '');
  if (!/^[a-zA-Z0-9._-]{2,80}$/.test(handle)) throw new Error('INFINITEPAY_HANDLE_INVALID');
  return handle;
}
export function infinitePayHandle() {
  return normalizeInfiniteTag(process.env.INFINITEPAY_HANDLE || 'evertonterapeutareiki');
}
export function paymentOrigin() {
  const url = new URL(process.env.PUBLIC_APP_URL || process.env.APP_URL || 'https://protocolo-de-cura-integrativa.vercel.app');
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('PUBLIC_APP_URL_INVALID');
  return url.origin;
}
