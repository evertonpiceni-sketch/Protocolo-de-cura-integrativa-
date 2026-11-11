import jwt from 'jsonwebtoken';

type RequestLike = {
  headers?: {
    cookie?: string;
  };
};

function readCookie(req: RequestLike, name: string): string | null {
  const raw = req.headers?.cookie;
  if (typeof raw !== 'string' || !raw) return null;

  for (const part of raw.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0) continue;
    const key = part.slice(0, separator).trim();
    if (key !== name) continue;

    const value = part.slice(separator + 1).trim();
    if (!value) return null;
    try {
      return decodeURIComponent(value);
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Reads the same signed HttpOnly session cookie used by server.ts.
 * Production refuses weak/missing JWT_SECRET, so fail closed here as well.
 */
export function getAuthenticatedUserId(req: RequestLike): string | null {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) return null;

  const token = readCookie(req, 'token');
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, secret);
    if (!decoded || typeof decoded === 'string') return null;
    const userId = decoded.userId;
    return typeof userId === 'string' && userId.trim() ? userId : null;
  } catch {
    return null;
  }
}
