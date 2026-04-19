import type { Page } from '../index/parse';

export class VirtualFS {
  private files = new Map<string, Page>();
  private dirs = new Map<string, Set<string>>();

  constructor(pages: Page[]) {
    for (const page of pages) {
      this.files.set(page.path, page);
      this.registerInTree(page.path);
    }
  }

  readFile(path: string): Page | null {
    return this.files.get(this.normalize(path)) ?? null;
  }

  listDir(path: string): string[] {
    const norm = this.normalize(path);
    const key = norm === '' ? '/' : norm;
    const entries = this.dirs.get(key);
    return entries ? Array.from(entries).sort() : [];
  }

  allPages(): Page[] {
    return Array.from(this.files.values());
  }

  private registerInTree(path: string): void {
    const parts = path.split('/').filter(Boolean);
    for (let i = 0; i < parts.length; i++) {
      const dir = parts.slice(0, i).join('/');
      const parent = dir === '' ? '/' : `/${dir}`;
      const isLeaf = i === parts.length - 1;
      const entry = isLeaf ? parts[i] : `${parts[i]}/`;
      if (!this.dirs.has(parent)) this.dirs.set(parent, new Set());
      this.dirs.get(parent)!.add(entry);
    }
  }

  private normalize(raw: string): string {
    let p = raw.trim();
    if (!p.startsWith('/')) p = `/${p}`;
    const parts = p.split('/');
    const out: string[] = [];
    for (const part of parts) {
      if (part === '..') out.pop();
      else if (part !== '.' && part !== '') out.push(part);
    }
    return out.length === 0 ? '/' : `/${out.join('/')}`;
  }
}
