import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'path';

const SESSION_DIR = join(process.cwd(), '.sessions');

function ensureDir() {
  if (!existsSync(SESSION_DIR)) {
    mkdirSync(SESSION_DIR, { recursive: true });
  }
}

export function createSession(email: string): string {
  ensureDir();
  const token = crypto.randomUUID();
  writeFileSync(join(SESSION_DIR, token), JSON.stringify({ email, createdAt: new Date().toISOString() }));
  return token;
}

export function validateSession(token: string): { email: string } | null {
  ensureDir();
  try {
    const filePath = join(SESSION_DIR, token);
    if (!existsSync(filePath)) return null;
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    return { email: data.email };
  } catch {
    return null;
  }
}

export function destroySession(token: string): void {
  ensureDir();
  const filePath = join(SESSION_DIR, token);
  try {
    if (existsSync(filePath)) {
      writeFileSync(filePath, '');
    }
  } catch {}
}
