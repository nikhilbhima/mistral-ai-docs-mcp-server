export interface Page {
  path: string;
  title: string;
  sourceUrl: string;
  content: string;
  category: 'docs' | 'api';
}

export function parsePages(raw: string): Page[] {
  const lines = raw.split('\n');
  const pages: Page[] = [];

  const isPageBoundary = (i: number): boolean => {
    if (!lines[i]?.startsWith('# ')) return false;
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === '') j++;
    return j < lines.length && lines[j].startsWith('Source: ');
  };

  for (let i = 0; i < lines.length; i++) {
    if (!isPageBoundary(i)) continue;

    const title = lines[i].slice(2).trim();
    if (!title) continue;

    let j = i + 1;
    while (lines[j].trim() === '') j++;
    const sourceUrl = lines[j].slice('Source: '.length).trim();
    if (!sourceUrl) continue;

    let k = j + 1;
    const bodyLines: string[] = [];
    while (k < lines.length && !isPageBoundary(k)) {
      bodyLines.push(lines[k]);
      k++;
    }
    const content = bodyLines.join('\n').trim();
    const path = urlToPath(sourceUrl);
    const category: Page['category'] = path.startsWith('/api/') ? 'api' : 'docs';
    pages.push({ path, title, sourceUrl, content, category });
    i = k - 1;
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
