import { createHmac, timingSafeEqual } from 'node:crypto';

const SESSION_TTL_SEC = 24 * 60 * 60;

function getSecret(): string {
  const secret = import.meta.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is required');
  }
  return secret;
}

function base64url(data: Buffer): string {
  return data.toString('base64url');
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createSession(email: string): string {
  const secret = getSecret();
  const payload = JSON.stringify({
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SEC,
    iat: Math.floor(Date.now() / 1000),
  });
  const encoded = base64url(Buffer.from(payload));
  return `${encoded}.${sign(encoded, secret)}`;
}

export function validateSession(token: string): { email: string } | null {
  try {
    const secret = getSecret();
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [encoded, signature] = parts;
    const expectedSig = sign(encoded, secret);

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length) return null;

    if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return { email: payload.email };
  } catch {
    return null;
  }
}

export function destroySession(_token: string): void {
}

export function getCsrfToken(sessionToken: string): string {
  const secret = getSecret();
  const payload = JSON.stringify({
    purpose: 'csrf',
    sessionToken: sessionToken.slice(0, 16),
    exp: Math.floor(Date.now() / 1000) + 3600,
  });
  const encoded = base64url(Buffer.from(payload));
  return `${encoded}.${sign(encoded, secret)}`;
}

export function validateCsrfToken(token: string, sessionToken: string): boolean {
  try {
    const secret = getSecret();
    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [encoded, signature] = parts;
    const expectedSig = sign(encoded, secret);

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length) return false;

    if (!timingSafeEqual(sigBuf, expectedBuf)) return false;

    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    if (payload.purpose !== 'csrf') return false;
    if (payload.sessionToken !== sessionToken.slice(0, 16)) return false;

    return true;
  } catch {
    return false;
  }
}
