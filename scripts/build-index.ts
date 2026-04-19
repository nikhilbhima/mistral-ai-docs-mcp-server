import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsePages } from '../src/index/parse';
import { buildSearchIndex } from '../src/index/build';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/generated/docs-index.json');
const UPSTREAM = process.env.UPSTREAM_URL ?? 'https://docs.mistral.ai/llms-full.txt';

async function main() {
  console.log(`[build-index] fetching ${UPSTREAM}`);
  const started = Date.now();
  const res = await fetch(UPSTREAM);
  if (!res.ok) throw new Error(`upstream ${res.status} ${res.statusText}`);
  const etag = res.headers.get('etag') ?? '';
  const text = await res.text();
  const pages = parsePages(text);
  if (pages.length < 50) {
    throw new Error(`suspiciously few pages: ${pages.length}`);
  }
  const idx = buildSearchIndex(pages);
  const payload = {
    pages,
    searchIndex: JSON.stringify(idx),
    sourceEtag: etag,
    builtAt: new Date().toISOString(),
  };
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(payload));
  console.log(`[build-index] wrote ${pages.length} pages to ${OUT} in ${Date.now() - started}ms`);
}

main().catch((err) => {
  console.error('[build-index] FAILED:', err);
  process.exit(1);
});
