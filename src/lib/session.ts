import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { join } from 'path';

const SESSION_DIR = join(process.cwd(), '.sessions');
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function ensureDir() {
  if (!existsSync(SESSION_DIR)) {
    mkdirSync(SESSION_DIR, { recursive: true });
  }
}

export function createSession(email: string): string {
  ensureDir();
  const token = crypto.randomUUID();
  const session = { email, createdAt: new Date().toISOString() };
  writeFileSync(join(SESSION_DIR, token), JSON.stringify(session));
  return token;
}

export function validateSession(token: string): { email: string } | null {
  ensureDir();
  try {
    const filePath = join(SESSION_DIR, token);
    if (!existsSync(filePath)) return null;
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));

    const age = Date.now() - new Date(data.createdAt).getTime();
    if (age > SESSION_TTL_MS) {
      unlinkSync(filePath);
      return null;
    }

    return { email: data.email };
  } catch {
    return null;
  }
}

export function destroySession(token: string): void {
  ensureDir();
  try {
    const filePath = join(SESSION_DIR, token);
    if (existsSync(filePath)) unlinkSync(filePath);
  } catch {}
}


