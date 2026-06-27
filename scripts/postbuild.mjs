import { readFileSync, writeFileSync } from 'node:fs';

const p = 'dist/server/wrangler.json';
const c = JSON.parse(readFileSync(p, 'utf-8'));
delete c.assets;
delete c.kv_namespaces;
delete c.images;
delete c.previews;
writeFileSync(p, JSON.stringify(c));
