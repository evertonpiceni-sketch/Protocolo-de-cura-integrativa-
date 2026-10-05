import crypto from 'node:crypto';
export type CommunityPost = { id: string; authorId: string; initials: string; text: string; createdAt: string };
export function communityInitials(userId: string): string {
  const digest = crypto.createHash('sha256').update(`entre-nos:${userId}`).digest();
  return `${String.fromCharCode(65 + digest[0] % 26)}.${String.fromCharCode(65 + digest[1] % 26)}.`;
}
export function communityTextError(text: unknown): string | null {
  if (typeof text !== 'string' || text.trim().length < 3 || text.trim().length > 2000) return 'Escreva entre 3 e 2.000 caracteres.';
  if (/[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:https?:\/\/|www\.)\S+|@\w{2,}|(?:\d[\s().+-]*){7,}|\b(?:CPF|RG|CEP)\s*[:\d]/i.test(text)) return 'Retire contatos, documentos, links e dados pessoais antes de compartilhar.';
  return null;
}
