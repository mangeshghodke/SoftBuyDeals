import { scryptSync, randomBytes } from 'node:crypto';

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.mjs <password>');
  process.exit(1);
}

const salt = randomBytes(16).toString('hex');
const hash = scryptSync(password, salt, 64).toString('hex');
console.log(`\nAdd this to your .env file:\n`);
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt}:${hash}\n`);
console.log(`Remove ADMIN_PASSWORD from .env once set.\n`);
