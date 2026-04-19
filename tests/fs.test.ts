import { describe, it, expect } from 'vitest';
import { VirtualFS } from '@/fs/virtual';
import { runCommand } from '@/fs/commands';
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

describe('runCommand', () => {
  const vfs = new VirtualFS(pages);

  it('rg: matches by regex and returns path:line:text', () => {
    const out = runCommand(vfs, 'rg websearch');
    expect(out).toMatch(/\/docs\/agents\/connectors\/websearch\.md:\d+:websearch body/);
  });

  it('rg: respects path prefix', () => {
    const out = runCommand(vfs, 'rg GET /api');
    expect(out).toContain('/api/list_models.md');
    expect(out).not.toContain('/docs/');
  });

  it('rg: rejects an invalid regex', () => {
    expect(runCommand(vfs, 'rg [unclosed')).toMatch(/invalid regex/);
  });

  it('find: matches by glob', () => {
    const out = runCommand(vfs, 'find *intro*');
    expect(out).toContain('/docs/agents/intro.md');
  });

  it('cat: returns page body with title and source header', () => {
    const out = runCommand(vfs, 'cat /docs/agents/intro.md');
    expect(out).toContain('# Intro');
    expect(out).toContain('Source: https://x/1');
    expect(out).toContain('Agents intro');
  });

  it('cat: reports missing file', () => {
    expect(runCommand(vfs, 'cat /nope.md')).toBe('no such file: /nope.md');
  });

  it('ls: lists virtual directories', () => {
    expect(runCommand(vfs, 'ls /')).toContain('docs/');
  });

  it('rejects unknown commands with a helpful message', () => {
    expect(runCommand(vfs, 'rm -rf /')).toMatch(/unknown command: rm/);
  });

  it('returns usage for commands missing required args', () => {
    expect(runCommand(vfs, 'rg')).toMatch(/usage: rg/);
    expect(runCommand(vfs, 'cat')).toMatch(/usage: cat/);
    expect(runCommand(vfs, 'find')).toMatch(/usage: find/);
  });

  it('truncates output above 30 KB', () => {
    const many: Page[] = Array.from({ length: 2000 }, (_, i) => ({
      path: `/docs/p${i}.md`,
      title: `P${i}`,
      sourceUrl: `https://x/p${i}`,
      content: 'needle'.repeat(20),
      category: 'docs',
    }));
    const big = new VirtualFS(many);
    const out = runCommand(big, 'rg needle');
    expect(out.length).toBeLessThanOrEqual(30_200);
    expect(out).toMatch(/truncated/);
  });

  it('tokenizer handles quoted arguments', () => {
    const out = runCommand(vfs, 'rg "Agents intro"');
    expect(out).toContain('/docs/agents/intro.md');
  });

  it('rejects patterns longer than 200 chars (ReDoS safeguard)', () => {
    const huge = 'a'.repeat(201);
    const out = runCommand(vfs, `rg ${huge}`);
    expect(out).toMatch(/pattern too long/);
  });
});
