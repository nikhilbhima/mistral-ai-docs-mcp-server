export interface Page {
  path: string;
  title: string;
  sourceUrl: string;
  content: string;
  category: 'docs' | 'api';
}

export function parsePages(raw: string): Page[] {
  const chunks = raw.split(/(?=^# )/m).filter((c) => c.startsWith('# '));
  const pages: Page[] = [];

  for (const chunk of chunks) {
    const lines = chunk.split('\n');
    const title = lines[0].slice(2).trim();
    if (!title) continue;

    const sourceIdx = lines.findIndex((l) => l.startsWith('Source: '));
    if (sourceIdx === -1) continue;
    const sourceUrl = lines[sourceIdx].slice('Source: '.length).trim();
    if (!sourceUrl) continue;

    const body = lines.slice(sourceIdx + 1).join('\n').trim();
    const path = urlToPath(sourceUrl);
    const category: Page['category'] = path.startsWith('/api/') ? 'api' : 'docs';
    pages.push({ path, title, sourceUrl, content: body, category });
  }

  return pages;
}

function urlToPath(sourceUrl: string): string {
  let url: URL;
  try {
    url = new URL(sourceUrl);
  } catch {
    return sourceUrl;
  }
  let path = url.pathname.replace(/\/$/, '');
  if (url.hash) {
    const m = url.hash.match(/#tag\/(.+)$/);
    if (m) path = `${path}/${m[1]}`;
  }
  if (!path.endsWith('.md')) path = `${path}.md`;
  return path;
}
