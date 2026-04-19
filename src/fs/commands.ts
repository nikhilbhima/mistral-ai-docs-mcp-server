import type { VirtualFS } from './virtual';

const MAX_OUTPUT = 30_000;
const MAX_PATTERN_LEN = 200;

export function runCommand(vfs: VirtualFS, raw: string): string {
  const tokens = tokenize(raw);
  if (tokens.length === 0) return '';
  const [cmd, ...args] = tokens;

  switch (cmd) {
    case 'rg':
    case 'grep':
      return truncate(rg(vfs, args));
    case 'find':
      return truncate(find(vfs, args));
    case 'cat':
      return truncate(cat(vfs, args));
    case 'ls':
      return truncate(ls(vfs, args));
    default:
      return `unknown command: ${cmd} (allowed: rg, find, cat, ls)`;
  }
}

function tokenize(raw: string): string[] {
  const out: string[] = [];
  for (const m of raw.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)) {
    out.push(m[1] ?? m[2] ?? m[3]);
  }
  return out;
}

function truncate(s: string): string {
  if (s.length <= MAX_OUTPUT) return s;
  return `${s.slice(0, MAX_OUTPUT)}\n... [truncated, output exceeded ${MAX_OUTPUT} bytes]`;
}

function rg(vfs: VirtualFS, args: string[]): string {
  if (args.length === 0) return 'usage: rg <pattern> [path-prefix]';
  const [pattern, pathPrefix = '/'] = args;
  if (pattern.length > MAX_PATTERN_LEN) {
    return `pattern too long (max ${MAX_PATTERN_LEN} chars)`;
  }
  let re: RegExp;
  try {
    re = new RegExp(pattern);
  } catch {
    return `invalid regex: ${pattern}`;
  }
  const prefix = pathPrefix === '/' ? '/' : pathPrefix.replace(/\/$/, '') + '/';
  const lines: string[] = [];
  for (const page of vfs.allPages()) {
    if (pathPrefix !== '/' && !page.path.startsWith(prefix)) continue;
    const content = page.content.split('\n');
    for (let i = 0; i < content.length; i++) {
      if (re.test(content[i])) lines.push(`${page.path}:${i + 1}:${content[i]}`);
    }
  }
  return lines.join('\n');
}

function find(vfs: VirtualFS, args: string[]): string {
  if (args.length === 0) return 'usage: find <glob>';
  const glob = args[0];
  const re = globToRegex(glob);
  return vfs.allPages()
    .map((p) => p.path)
    .filter((path) => re.test(path))
    .sort()
    .join('\n');
}

function cat(vfs: VirtualFS, args: string[]): string {
  if (args.length === 0) return 'usage: cat <path>';
  const page = vfs.readFile(args[0]);
  if (!page) return `no such file: ${args[0]}`;
  return `# ${page.title}\nSource: ${page.sourceUrl}\n\n${page.content}`;
}

function ls(vfs: VirtualFS, args: string[]): string {
  const path = args[0] ?? '/';
  return vfs.listDir(path).join('\n');
}

function globToRegex(glob: string): RegExp {
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  return new RegExp(escaped);
}
