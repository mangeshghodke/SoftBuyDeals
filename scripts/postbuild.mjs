import { readFileSync, writeFileSync } from 'node:fs';

const p = 'dist/server/wrangler.json';
const c = JSON.parse(readFileSync(p, 'utf-8'));
// Remove unused auto-detected bindings (we don't use Astro Sessions or Cloudflare Images)
delete c.kv_namespaces;
delete c.images;
delete c.previews;
delete c.pages_build_output_dir;
// Keep assets (ASSETS binding) — needed for Workers to serve static files
writeFileSync(p, JSON.stringify(c));
