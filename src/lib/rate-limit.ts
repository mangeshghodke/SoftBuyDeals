let _tableEnsured = false;

async function ensureTable(db: any): Promise<void> {
  if (!_tableEnsured) {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS rate_limits (
        key TEXT PRIMARY KEY,
        count INTEGER NOT NULL DEFAULT 0,
        window_end INTEGER NOT NULL,
        expires_at INTEGER NOT NULL
      )
    `).run();
    _tableEnsured = true;
  }
}

export async function checkRateLimit(
  db: any,
  key: string,
  maxAttempts: number,
  windowMs: number
): Promise<boolean> {
  await ensureTable(db);

  const now = Date.now();
  const row = await db.prepare('SELECT count, window_end FROM rate_limits WHERE key = ?').bind(key).first() as any;

  if (!row || now > row.window_end) {
    const windowEnd = now + windowMs;
    await db.prepare(`
      INSERT INTO rate_limits (key, count, window_end, expires_at)
      VALUES (?, 1, ?, ?)
      ON CONFLICT(key) DO UPDATE SET count = 1, window_end = ?, expires_at = ?
    `).bind(key, windowEnd, now + 86400000, windowEnd, now + 86400000).run();
    return false;
  }

  const newCount = row.count + 1;
  await db.prepare('UPDATE rate_limits SET count = ? WHERE key = ?').bind(newCount, key).run();

  return newCount > maxAttempts;
}

export async function getAccountLockout(
  db: any,
  email: string
): Promise<{ locked: boolean; count: number }> {
  await ensureTable(db);

  const now = Date.now();
  const row = await db.prepare('SELECT count, window_end FROM rate_limits WHERE key = ?').bind(`lockout:${email}`).first() as any;

  if (!row || now > row.window_end) {
    return { locked: false, count: 0 };
  }

  return { locked: true, count: row.count };
}

export async function recordFailedAttempt(
  db: any,
  email: string,
  lockoutThreshold: number,
  lockoutDurationMs: number
): Promise<void> {
  await ensureTable(db);

  const now = Date.now();
  const key = `lockout:${email}`;
  const row = await db.prepare('SELECT count, window_end FROM rate_limits WHERE key = ?').bind(key).first() as any;

  if (!row || now > row.window_end) {
    const windowEnd = now + lockoutDurationMs;
    await db.prepare(`
      INSERT INTO rate_limits (key, count, window_end, expires_at)
      VALUES (?, 1, ?, ?)
      ON CONFLICT(key) DO UPDATE SET count = 1, window_end = ?, expires_at = ?
    `).bind(key, windowEnd, now + 86400000, windowEnd, now + 86400000).run();
  } else {
    const newCount = row.count + 1;
    const windowEnd = newCount >= lockoutThreshold ? now + lockoutDurationMs : row.window_end;
    await db.prepare('UPDATE rate_limits SET count = ?, window_end = ? WHERE key = ?')
      .bind(newCount, windowEnd, key).run();
  }
}

export async function clearAccountLockout(db: any, email: string): Promise<void> {
  await db.prepare('DELETE FROM rate_limits WHERE key = ?').bind(`lockout:${email}`).run();
}
