import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parsePages } from '@/index/parse';

const sample = readFileSync(resolve(__dirname, '../fixtures/llms-full.sample.txt'), 'utf8');

describe('parsePages', () => {
  it('returns one entry per H1 section', () => {
    const pages = parsePages(sample);
    expect(pages).toHaveLength(4);
  });

  it('extracts title, sourceUrl, category, content', () => {
    const [quickstart, listModels, vision, empty] = parsePages(sample);
    expect(quickstart.title).toBe('Quickstart');
    expect(quickstart.sourceUrl).toBe('https://docs.mistral.ai/docs/getting-started/quickstart');
    expect(quickstart.category).toBe('docs');
    expect(quickstart.content).toContain('five minutes');

    expect(listModels.title).toBe('List Models');
    expect(listModels.category).toBe('api');

    expect(vision.content).toContain('Multimodal');
    expect(empty.content).toBe('');
  });

  it('assigns a unique path to each API endpoint via its URL fragment', () => {
    const pages = parsePages(sample);
    const apiPages = pages.filter((p) => p.category === 'api');
    const paths = apiPages.map((p) => p.path);
    expect(new Set(paths).size).toBe(apiPages.length);
    expect(paths[0]).toMatch(/^\/api\//);
  });

  it('skips chunks with no Source line', () => {
    const garbage = '# Orphan\nno source here\n';
    expect(parsePages(garbage)).toHaveLength(0);
  });

  it('handles trailing whitespace and missing trailing newline', () => {
    const trimmed = sample.trimEnd();
    expect(parsePages(trimmed).length).toBeGreaterThan(0);
  });

  it('does not split pages at # comments inside code fences', () => {
    const withCodeFence = [
      '# Real Page',
      'Source: https://docs.mistral.ai/docs/real',
      '',
      'Intro paragraph.',
      '',
      '```bash',
      '# this is a shell comment, not a page title',
      'echo hello',
      '```',
      '',
      'Trailing paragraph.',
      '',
      '# Next Real Page',
      'Source: https://docs.mistral.ai/docs/next',
      '',
      'Next body.',
    ].join('\n');

    const pages = parsePages(withCodeFence);
    expect(pages).toHaveLength(2);
    expect(pages[0].title).toBe('Real Page');
    expect(pages[0].content).toContain('shell comment');
    expect(pages[0].content).toContain('Trailing paragraph');
    expect(pages[1].title).toBe('Next Real Page');
  });
});
