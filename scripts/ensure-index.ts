import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildIndex } from './build-index';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INDEX = resolve(__dirname, '../src/generated/docs-index.json');

async function main(): Promise<void> {
  if (existsSync(INDEX)) return;
  console.log('[ensure-index] no index found, building (one-time, ~10s)...');
  await buildIndex();
}

main().catch((err) => {
  console.error('[ensure-index] FAILED:', err);
  process.exit(1);
});
