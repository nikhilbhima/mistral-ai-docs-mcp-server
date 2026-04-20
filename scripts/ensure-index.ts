import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INDEX = resolve(__dirname, '../src/generated/docs-index.json');
const BUILD = resolve(__dirname, './build-index.ts');

if (existsSync(INDEX)) {
  process.exit(0);
}

console.log('[ensure-index] no index found, building (one-time, ~10s)...');
execFileSync('tsx', [BUILD], { stdio: 'inherit' });
