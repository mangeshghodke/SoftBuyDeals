const sessions = new Map<string, { email: string; createdAt: Date }>();

export function createSession(email: string): string {
  const token = crypto.randomUUID();
  sessions.set(token, { email, createdAt: new Date() });
  return token;
}

export function validateSession(token: string): { email: string } | null {
  const session = sessions.get(token);
  if (!session) return null;
  return { email: session.email };
}

export function destroySession(token: string): void {
  sessions.delete(token);
}
