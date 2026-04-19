import { z } from 'zod';
import { searchIndex, vfs } from '@/index/load';
import { runCommand } from '@/fs/commands';

const MAX_QUERY_LEN = 500;
const SNIPPET_LEN = 200;

export const searchSchema = {
  query: z.string().describe('Search query. Natural language or keywords.'),
  limit: z.number().min(1).max(20).optional().describe('Max results. Default 8, max 20.'),
};

export async function searchMistralDocs({
  query,
  limit = 8,
}: {
  query: string;
  limit?: number;
}): Promise<string> {
  const q = query.slice(0, MAX_QUERY_LEN).trim();
  if (!q) return JSON.stringify([]);
  const hits = searchIndex.search(q).slice(0, limit);
  const out = hits.map((r) => {
    const page = vfs.readFile(String(r.id));
    return {
      title: r.title,
      source_url: r.sourceUrl,
      doc_path: r.path,
      snippet: snippetAround(page?.content ?? '', q),
      score: Math.round(r.score * 1000) / 1000,
    };
  });
  return JSON.stringify(out, null, 2);
}

export const filesystemSchema = {
  command: z
    .string()
    .describe(
      'Command to run. Supported: rg <pattern> [path], find <glob>, cat <path>, ls [path]. Example: rg response_format /api',
    ),
};

export async function queryMistralDocsFilesystem({
  command,
}: {
  command: string;
}): Promise<string> {
  return runCommand(vfs, command);
}

function snippetAround(content: string, query: string): string {
  if (!content) return '';
  const term = query.split(/\s+/).find((w) => w.length > 2) ?? query;
  const idx = content.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return content.slice(0, SNIPPET_LEN);
  const start = Math.max(0, idx - Math.floor(SNIPPET_LEN / 3));
  const end = Math.min(content.length, start + SNIPPET_LEN);
  return (start > 0 ? '...' : '') + content.slice(start, end) + (end < content.length ? '...' : '');
}
