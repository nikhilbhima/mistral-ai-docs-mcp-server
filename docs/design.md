# Mistral Docs MCP Server, Design

Unofficial, community-maintained MCP server for Mistral AI's developer documentation.
Not endorsed by or affiliated with Mistral AI. MIT licensed.

## 1. Overview

A public MCP server that exposes Mistral AI's developer documentation and full API
reference to coding agents (Claude Code, Claude Desktop, Cursor, Codex, ChatGPT,
VS Code, Windsurf, Gemini CLI, Zed, and any other MCP-compliant client). Users add
one URL to their client and get two tools: a search tool and a filesystem-style
query tool.

Content comes from Mistral's own published
`https://docs.mistral.ai/llms-full.txt` (~1 MB, 290 pages covering every docs
page and every API endpoint). A cron job re-fetches this file every 6 hours.
When it changes, a Vercel Deploy Hook rebuilds the server with the new content
baked in. No database, no external storage.

## 2. Goals

- One public URL, no auth, no install, works in every mainstream MCP client.
- Most queries return in under 500 ms.
- Content tracks `docs.mistral.ai` within 6 hours, no human action required.
- Returns Mistral's own doc text verbatim, never paraphrased by an LLM.
- Runs on Vercel Pro alone. No database, no blob storage, no paid APIs.
- Trivial to fork and self-host (single repo, one env var).

## 3. Non-goals for v1

- Cookbook notebooks from `github.com/mistralai/cookbook`.
- Authenticated or user-scoped features.
- Any write capability.
- Landing page or marketing site.
- SDK source browsing beyond what Mistral includes in `llms-full.txt`.

## 4. Content source

Primary: `https://docs.mistral.ai/llms-full.txt`

- ~1 MB, 290 pages, UTF-8 markdown.
- Each page delimited by a `# <Title>` H1, followed by a `Source: <canonical_url>`
  line, followed by the body.
- Covers `docs.mistral.ai/docs/...` (docs) and `docs.mistral.ai/api/...` (API
  reference).

Pages NOT in this file, and therefore out of scope for v1:

- Products (Le Chat, Studio, Vibe) end-user pages.
- Admin (org, billing, security) pages.
- Cookbook notebooks.
- SDK READMEs on GitHub.

## 5. Architecture

```
+-------------+      +-----------------------------------+
| MCP client  |----->| Vercel Function                   |
| (Claude,    | HTTP | Next.js App Router                |
|  Cursor,    |      | @vercel/mcp-adapter               |
|  Codex,     |      | MiniSearch + virtual FS in memory |
|  etc.)      |      | Bundled docs-index.json (1 MB)    |
+-------------+      +-----------------------------------+
                              ^
                              | built from at deploy time
                              |
                     +-------------------------+
                     | scripts/build-index.ts  |
                     | (runs in `next build`)  |
                     +-------------------------+
                              ^
                              | fetch
                     https://docs.mistral.ai/llms-full.txt

 Auto-refresh path:

 +-------------------------+     +----------------------+
 | Vercel Cron (every 6h)  |---->| Vercel Deploy Hook   |
 | /api/cron/refresh       | on  | (triggers new build) |
 | ETag-compares upstream  | 200 +----------------------+
 +-------------------------+
```

Components:

1. **MCP endpoint** (`/mcp`): handles incoming MCP requests over Streamable HTTP
   using `@vercel/mcp-adapter`. Imports the bundled `docs-index.json` directly,
   loads the MiniSearch index and virtual FS into module-scope memory on cold
   start.
2. **Build step** (`scripts/build-index.ts`, run by `next build`): fetches
   `llms-full.txt`, parses pages, builds a MiniSearch index, serializes
   everything into `src/generated/docs-index.json`. This file is imported by
   the MCP endpoint so it ships inside the deploy artifact.
3. **Refresh cron** (`/api/cron/refresh`): triggered by Vercel Cron every 6
   hours. Fetches `llms-full.txt` with an `If-None-Match` header. On 304, exits
   silently. On 200 with a new ETag, POSTs to a Vercel Deploy Hook URL, which
   starts a fresh build (which re-runs `build-index.ts`). The refreshed deploy
   replaces the previous one under the stable public URL.

Runtime: Next.js 15 (App Router), TypeScript, Node 20 (Vercel Functions).

Why this shape over Vercel Blob or a DB: the corpus is 1 MB, updates are
infrequent, and baking the index into the deploy removes a dependency, speeds
cold starts (no network read), and lets anyone fork-and-deploy without
provisioning a blob store.

## 6. MCP tools

Two tools are exposed to agents.

### `search_mistral_docs`

Natural-language or keyword search across all 290 pages.

```ts
search_mistral_docs(
  query: string,
  limit?: number, // default 8, max 20
): Array<{
  title: string;
  source_url: string;
  doc_path: string;       // feed this back into the filesystem tool
  snippet: string;        // ~200 chars around the match
  score: number;
}>
```

Backed by MiniSearch with BM25 scoring, fuzzy matching on typos, and prefix
matching on partial words. Good for concept questions ("how does RAG work?",
"what models support vision?").

### `query_mistral_docs_filesystem`

Read-only command execution against a virtualized filesystem of the parsed docs.

```ts
query_mistral_docs_filesystem(command: string): string
```

Supported commands:

- `rg <pattern> [path]` regex search, ripgrep-style.
- `find <name-glob>` locate pages by filename glob.
- `cat <path>` read a full page.
- `ls [path]` list a virtual directory.

Output capped at 30 KB per call. Anything beyond the whitelist is rejected with
a clear error. Commands are parsed with a dedicated tokenizer; no shell
execution, no eval, no process spawn. Paths are normalized before lookup so
`..` and absolute paths resolve inside the virtual root.

Good for exact-match questions: "which endpoints take `response_format`?",
"which pages mention `structured outputs`?".

Why two tools, not one: search is strong for concepts, weak for exact strings.
Filesystem is the opposite. Together they cover both patterns without needing
a vector database or an embedding model.

## 7. Data shape

```ts
interface Page {
  path: string;        // /docs/agents/agents_introduction
  title: string;       // "Agents Introduction"
  sourceUrl: string;   // https://docs.mistral.ai/docs/agents/agents_introduction
  content: string;     // full markdown body
  category: 'docs' | 'api';
}
```

Parser splits `llms-full.txt` on `/^# /m`. For each chunk: line 1 yields title,
a `Source:` line yields the canonical URL, the rest is body. Path and category
are derived from the URL.

The bundled `docs-index.json` contains:

```ts
{
  pages: Page[],
  searchIndex: string,   // MiniSearch.toJSON()
  sourceEtag: string,
  builtAt: string,       // ISO 8601
}
```

## 8. Refresh pipeline

Vercel Cron schedule: `0 */6 * * *` (every 6 hours).

Cron endpoint (`/api/cron/refresh`) logic:

1. Read the currently-deployed `sourceEtag` from the bundled `docs-index.json`.
2. `HEAD` or `GET` `llms-full.txt` with `If-None-Match: <etag>`.
3. On 304 Not Modified: log `{ status: "unchanged" }`, exit.
4. On 200: POST to `VERCEL_DEPLOY_HOOK_URL` (env var). Log
   `{ status: "triggered", newEtag, ms }`.

The deploy hook triggers a fresh Vercel build. The build runs
`scripts/build-index.ts`, which:

1. Fetches `llms-full.txt`.
2. Parses into `Page[]`, skipping malformed pages with a logged warning.
3. Builds a MiniSearch index.
4. Writes `src/generated/docs-index.json`.

Failure modes:

- Upstream 5xx or timeout during cron: log, no deploy triggered, next cron
  tick retries. Previous deploy continues serving the last known index.
- Build-time fetch failure: build fails, previous deploy stays live. Cron
  will retry in 6 hours.
- Parse error on a single page: skip that page, log, continue. Build does
  not fail for individual-page issues.

The cron endpoint is gated by Vercel's `CRON_SECRET` automatic header.
Unauthenticated callers get 401.

## 9. Error handling

- `search_mistral_docs("")`: return an empty array. No error.
- `search_mistral_docs` with a query over 500 chars: truncate silently.
- `query_mistral_docs_filesystem("rm -rf /")`: return
  `"unknown command: rm (allowed: rg, find, cat, ls)"`.
- `cat` on a missing path: return `"no such file: <path>"`.
- `rg` matching nothing: return `""`. No error.
- Upstream fetch failure during cron: log, preserve previous deploy, return 200.

## 10. Testing

- **Parser**: five hand-crafted `llms-full.txt` fixtures covering edge cases
  (missing Source line, code fences spanning pages, non-ASCII titles, trailing
  newline absence, empty body). Assert page count and field correctness.
- **Search**: fixture corpus of 20 pages plus a table of 10 query/expected-top-1
  pairs covering concept, exact-phrase, typo, and partial-word patterns.
- **Filesystem commands**: per-command tests including rejection of unknown
  commands, oversized output truncation, path normalization, and empty-result
  cases.
- **Integration**: spin up the endpoint locally, connect with an MCP client,
  round-trip `tools/list`, `search_mistral_docs`, and every filesystem command.
- **CI smoke**: fetch live `llms-full.txt`, build index, assert page count > 200
  and that four known pages are indexed.

No HTTP mocking against Mistral. If upstream shape changes, CI breaks loudly.

## 11. Repository layout

```
.
├── README.md
├── LICENSE                         # MIT
├── package.json
├── tsconfig.json
├── next.config.ts
├── vercel.json                     # cron schedule
├── docs/
│   └── design.md                   # this document
├── src/
│   ├── app/
│   │   ├── mcp/route.ts                   # MCP endpoint
│   │   ├── api/cron/refresh/route.ts      # cron target
│   │   └── api/health/route.ts            # health check
│   ├── index/
│   │   ├── parse.ts                # llms-full.txt -> Page[]
│   │   ├── build.ts                # Page[] -> MiniSearch
│   │   └── load.ts                 # bundled json -> in-memory index
│   ├── fs/
│   │   ├── virtual.ts              # Page[] -> virtual fs
│   │   └── commands.ts             # rg, find, cat, ls
│   ├── mcp/
│   │   └── tools.ts                # tool definitions + handlers
│   └── generated/
│       └── docs-index.json         # produced by build-index.ts (gitignored)
├── scripts/
│   └── build-index.ts              # fetches + parses + writes generated json
├── tests/
│   ├── parse.test.ts
│   ├── search.test.ts
│   ├── fs.test.ts
│   └── integration.test.ts
└── fixtures/
    └── llms-full.sample.txt        # committed for parser tests
```

The `src/generated/` directory is gitignored. It is produced fresh on every
deploy by the build step, so the repo never carries stale indexed content.

## 12. Distribution

Default public URL: `https://mistral-docs-mcp.vercel.app/mcp`.

A custom domain can be aliased to the same deployment later without breaking
existing clients (Vercel maintains both the default subdomain and any aliases
simultaneously).

Install snippets in the README:

- **Claude Code**:
  `claude mcp add --transport http mistral-docs https://mistral-docs-mcp.vercel.app/mcp`
- **Claude Desktop**: Settings → Connectors → Add custom connector, URL only,
  no auth.
- **Cursor / Windsurf** (`.cursor/mcp.json` or `mcp_config.json`):
  ```json
  { "mcpServers": { "mistral-docs": { "url": "https://mistral-docs-mcp.vercel.app/mcp" } } }
  ```
- **VS Code + Copilot**: `MCP: Add Server` → HTTP → paste URL.
- **Codex CLI**: `codex mcp add mistral-docs --url https://mistral-docs-mcp.vercel.app/mcp`
- **Gemini CLI / Gemini Code Assist** (`~/.gemini/settings.json`):
  ```json
  { "mcpServers": { "mistral-docs": { "command": "npx", "args": ["mcp-remote", "https://mistral-docs-mcp.vercel.app/mcp"] } } }
  ```
- **Zed** (`settings.json`): `"context_servers": { "mistral-docs": { "command": { "url": "https://mistral-docs-mcp.vercel.app/mcp" } } }`
- **ChatGPT**: Custom connector, URL only, no auth.

Zero install, zero auth, zero API key on the user side.

## 13. Observability

- Cron runs write a structured JSON log line per refresh:
  `{ pages, etag, ms, status }`. Viewable in Vercel logs.
- MCP endpoint logs one line per tool call with tool name, argument size, and
  response size. Query contents are not logged (privacy).
- `/api/health` returns `{ indexBuiltAt, pageCount, sourceEtag }` for manual
  checks.
- No third-party analytics. No user tracking. No telemetry beyond Vercel's
  built-in request logs.

## 14. Future work

- Cookbook ingestion from `github.com/mistralai/cookbook` as an optional
  second content source, exposed via a separate pair of tools to keep search
  results unambiguous.
- Hybrid retrieval: add Mistral-generated embeddings alongside BM25 for better
  concept recall. Only if v1 search quality proves insufficient.
- Upstream handoff: if Mistral adopts this, the repository can be transferred
  and the deployment aliased to `mcp.mistral.ai` or similar, with no client
  breakage.
