import { describe, it, expect } from 'vitest';
import { VirtualFS } from '@/fs/virtual';
import type { Page } from '@/index/parse';

const pages: Page[] = [
  { path: '/docs/agents/intro.md', title: 'Intro', sourceUrl: 'https://x/1', content: 'Agents intro', category: 'docs' },
  { path: '/docs/agents/connectors/websearch.md', title: 'Websearch', sourceUrl: 'https://x/2', content: 'websearch body', category: 'docs' },
  { path: '/api/list_models.md', title: 'List Models', sourceUrl: 'https://x/3', content: 'GET /v1/models', category: 'api' },
];

describe('VirtualFS', () => {
  it('reads a page by exact path', () => {
    const vfs = new VirtualFS(pages);
    expect(vfs.readFile('/docs/agents/intro.md')?.title).toBe('Intro');
  });

  it('returns null for unknown paths', () => {
    const vfs = new VirtualFS(pages);
    expect(vfs.readFile('/nope')).toBeNull();
  });

  it('normalizes paths with .. segments and no leading slash', () => {
    const vfs = new VirtualFS(pages);
    expect(vfs.readFile('docs/agents/intro.md')?.title).toBe('Intro');
    expect(vfs.readFile('/docs/agents/../agents/intro.md')?.title).toBe('Intro');
  });

  it('lists top-level directories', () => {
    const vfs = new VirtualFS(pages);
    const entries = vfs.listDir('/');
    expect(entries).toContain('docs/');
    expect(entries).toContain('api/');
  });

  it('lists a nested directory', () => {
    const vfs = new VirtualFS(pages);
    expect(vfs.listDir('/docs/agents')).toEqual(
      expect.arrayContaining(['intro.md', 'connectors/']),
    );
  });

  it('returns all pages', () => {
    const vfs = new VirtualFS(pages);
    expect(vfs.allPages()).toHaveLength(3);
  });
});
