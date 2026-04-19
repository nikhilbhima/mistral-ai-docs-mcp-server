# Mistral Docs MCP Server, Design

Unofficial, community-maintained MCP server for Mistral AI's developer documentation.
Not endorsed by or affiliated with Mistral AI.

## 1. Overview

A public MCP server that exposes Mistral AI's developer documentation and full API
reference to coding agents (Claude Code, Cursor, Codex, ChatGPT, VS Code, Windsurf,
Gemini CLI, and any other MCP-compliant client). Users add one URL to their client
and get two tools: a search tool and a filesystem-style query tool.

Content comes from Mistral's own published
`https://docs.mistral.ai/llms-full.txt` (~1 MB, 290 pages covering every docs
page and every API endpoint). The server re-fetches this file every 6 hours so
updates Mistral ships land automatically, with no redeploy.

## 2. Goals

- One public URL, no auth, no install, works in every mainstream MCP client.
- Most queries return in under 500 ms.
- Content tracks `docs.mistral.ai` within 6 hours, no human action required.
- Returns Mistral's own doc text verbatim, never paraphrased by an LLM.
- Runs on Vercel Pro alone. No database, no external services, no paid APIs.

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
+-------------+      +-------------------------+      +----------------+
| MCP client  |----->| Vercel Function         |<-----| Vercel Blob    |
| (Claude,    | HTTP | Next.js App Router      | read | parsed-index   |
|  Cursor,    |      | @vercel/mcp-adapter     |      |   .json        |
|  Codex,     |      | MiniSearch in memory    |      +----------------+
|  etc.)      |      | Virtual FS in memory    |              ^
+-------------+      +-------------------------+              |
                                                              | write
                     +-------------------------+              |
                     | Vercel Cron (every 6h)  |--------------+
                     | Fetch llms-full.txt     |
                     | Parse + build index     |
                     | Upload to Blob          |
                     +-------------------------+
                              ^
                              | fetch
                     https://docs.mistral.ai/llms-full.txt
```

Components:

1. **MCP endpoint** (`/mcp`): handles incoming MCP requests over Streamable HTTP
   using `@vercel/mcp-adapter`. Stateless per request; reads the parsed index
   from Blob on cold start, keeps it in memory.
2. **Refresh job** (`/api/cron/refresh`): triggered by Vercel Cron every 6 hours.
   Fetches `llms-full.txt` with an `If-None-Match` ETag header, parses pages,
   builds a MiniSearch index, uploads the combined payload to Blob.
3. **Parsed index**: one JSON file in Vercel Blob containing
   `{ pages: Page[], searchIndex: string, etag: string, builtAt: string }`.

Runtime: Next.js 15 (App Router), TypeScript, Node 20. `@vercel/mcp-adapter`
handles MCP transport correctness (Streamable HTTP plus SSE fallback).

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
matching on partial words. Good for concept questions ("how does RAG work",
"what models support vision").

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
execution, no eval, no process spawn.

Good for exact-match questions: "which endpoints take `response_format`",
"which pages mention `structured outputs`".

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

## 8. Refresh pipeline

Vercel Cron schedule: `0 */6 * * *` (every 6 hours).

Cron endpoint logic:

1. Fetch `llms-full.txt` with `If-None-Match: <previous-etag>`.
2. On 304 Not Modified, exit early. Log "unchanged".
3. On 200, parse into `Page[]`, build a MiniSearch index, serialize the payload,
   upload to Blob under a fixed key.
4. Return `{ ok: true, pages: N, etag, ms }` for observability.

Failure modes:

- Upstream 5xx or timeout: log, skip, keep the previous index. No data loss.
- Parse error on a single page: skip that page, log, continue.
- Blob write failure: surface in the response; next cron tick retries.

The cron endpoint is gated by the `CRON_SECRET` header that Vercel Cron sets
automatically. Unauthenticated callers get 401.

Cold-start fallback: the deployment ships with a pre-parsed index baked at
build time by `scripts/build-fallback.ts`. If Blob is empty or unreachable,
the MCP endpoint falls back to the baked index. This means the server returns
useful results immediately after deploy, before the first cron run.

## 9. Error handling

- `search_mistral_docs("")`: return an empty array. No error.
- `search_mistral_docs` with a very long query: truncate to 500 chars silently.
- `query_mistral_docs_filesystem("rm -rf /")`: return
  `"unknown command: rm (allowed: rg, find, cat, ls)"`.
- `cat` on a missing path: return `"no such file: <path>"`.
- Upstream fetch failure during cron: log, preserve previous index, return 200.
  (Cron endpoint does not page on transient upstream issues.)

## 10. Testing

- **Parser**: five hand-crafted `llms-full.txt` fixtures covering edge cases
  (missing Source line, code fences spanning pages, non-ASCII titles, trailing
  newline absence, empty body). Assert page count and field correctness.
- **Search**: fixture corpus of 20 pages plus a table of 10 query/expected-top-1
  pairs covering concept, exact-phrase, typo, and partial-word patterns.
- **Filesystem commands**: per-command tests including rejection of unknown
  commands, oversized output, path traversal, and empty-result cases.
- **Integration**: spin up the endpoint locally, connect with an MCP client,
  round-trip `tools/list`, `search_mistral_docs`, and every filesystem command.
- **CI smoke**: fetch live `llms-full.txt`, build index, assert page count > 200
  and that four known pages are indexed.

No HTTP mocking against Mistral. If upstream shape changes, CI breaks loudly.

## 11. Repository layout

```
.
├── README.md
├── LICENSE                      # MIT
├── package.json
├── tsconfig.json
├── next.config.ts
├── vercel.json                  # cron schedule, function config
├── docs/
│   └── design.md                # this document
├── src/
│   ├── app/
│   │   ├── mcp/route.ts                     # MCP endpoint
│   │   └── api/cron/refresh/route.ts        # cron target
│   ├── index/
│   │   ├── parse.ts             # llms-full.txt -> Page[]
│   │   ├── build.ts             # Page[] -> MiniSearch + blob payload
│   │   └── load.ts              # blob -> in-memory index on cold start
│   ├── fs/
│   │   ├── virtual.ts           # Page[] -> virtual fs
│   │   └── commands.ts          # rg, find, cat, ls
│   └── mcp/
│       └── tools.ts             # tool definitions + handlers
├── tests/
│   ├── parse.test.ts
│   ├── search.test.ts
│   ├── fs.test.ts
│   └── integration.test.ts
├── scripts/
│   └── build-fallback.ts        # pre-builds index at deploy time
└── fixtures/
    └── llms-full.sample.txt     # committed for parser tests
```

## 12. Distribution

Default public URL: `https://mistral-docs-mcp.vercel.app/mcp`
(custom domain can be pointed at the same deployment later without breaking
existing clients, via an alias).

Install snippets in the README:

- **Claude Code**:
  `claude mcp add --transport http mistral-docs https://mistral-docs-mcp.vercel.app/mcp`
- **Cursor / Windsurf** (`.cursor/mcp.json`):
  ```json
  { "mcpServers": { "mistral-docs": { "url": "https://mistral-docs-mcp.vercel.app/mcp" } } }
  ```
- **VS Code + Copilot**: `MCP: Add Server` → HTTP → paste URL.
- **Codex CLI**: `codex mcp add mistral-docs --url https://mistral-docs-mcp.vercel.app/mcp`
- **ChatGPT**: Custom connector, URL only, no auth.

Zero install, zero auth, zero API key on the user side.

## 13. Observability

- Cron runs write a structured JSON log line per refresh: `{ pages, etag, ms,
  status }`. Viewable in Vercel logs.
- MCP endpoint logs one line per tool call with tool name, argument size, and
  response size. No query contents logged (privacy).
- `/api/health` endpoint returns `{ indexBuiltAt, pageCount, etag }` for manual
  checks.

## 14. Open questions

- Custom domain choice. Default Vercel subdomain works indefinitely, but a
  memorable apex helps adoption. Deferred to launch.
- Whether to expose a lightweight `list_mistral_doc_categories` convenience tool
  in v2. Not needed for v1 given the filesystem tool.
- Analytics: deferred. Any telemetry beyond Vercel's built-in logs would
  require an explicit opt-in and a privacy note in the README.

## 15. Future work

- Cookbook ingestion from `github.com/mistralai/cookbook` as an optional
  second content source, exposed via a separate pair of tools to keep search
  results unambiguous.
- Hybrid retrieval: add Mistral-generated embeddings alongside BM25 for better
  concept recall. Only if v1 search quality proves insufficient.
- Upstream: if Mistral wants to adopt this, the repository can be handed off
  and the deployment aliased to `mcp.mistral.ai` or similar, with no client
  breakage.
