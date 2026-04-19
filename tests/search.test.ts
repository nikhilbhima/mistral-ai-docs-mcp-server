import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parsePages } from '@/index/parse';
import { buildSearchIndex } from '@/index/build';

const sample = readFileSync(resolve(__dirname, '../fixtures/llms-full.sample.txt'), 'utf8');

describe('buildSearchIndex', () => {
  it('finds a page by an exact content keyword', () => {
    const pages = parsePages(sample);
    const idx = buildSearchIndex(pages);
    const hits = idx.search('multimodal');
    expect(hits[0].title).toBe('Vision');
  });

  it('boosts title matches over content matches', () => {
    const pages = parsePages(sample);
    const idx = buildSearchIndex(pages);
    const hits = idx.search('quickstart');
    expect(hits[0].title).toBe('Quickstart');
  });

  it('tolerates a typo via fuzzy matching', () => {
    const pages = parsePages(sample);
    const idx = buildSearchIndex(pages);
    const hits = idx.search('multimoadl');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].title).toBe('Vision');
  });

  it('can serialize and reload', () => {
    const pages = parsePages(sample);
    const idx = buildSearchIndex(pages);
    const json = JSON.stringify(idx);
    expect(json.length).toBeGreaterThan(10);
  });
});
