<p align="center">
  <img src="public/logo.png" width="96" alt="" />
</p>

<h1 align="center">Mistral Docs MCP</h1>

<p align="center">
  Unofficial, community-maintained MCP server for Mistral AI's developer
  documentation and full API reference. Not endorsed by or affiliated with
  Mistral AI.
</p>

Content source: [`docs.mistral.ai/llms-full.txt`](https://docs.mistral.ai/llms-full.txt).
Refreshed every 6 hours.

**Endpoint:** `https://mistral-docs-mcp.vercel.app/mcp`

## What you get

Two MCP tools:

- `search_mistral_docs(query, limit?)` BM25 search with fuzzy matching across
  every Mistral docs and API reference page.
- `query_mistral_docs_filesystem(command)` read-only shell over a virtualized
  filesystem of the docs. Supports `rg`, `find`, `cat`, `ls`.

## Install

No API key. No auth. Paste the URL.

### Claude Code

```bash
claude mcp add --transport http mistral-docs https://mistral-docs-mcp.vercel.app/mcp
```

### Claude Desktop

Settings → Connectors → Add custom connector. URL: `https://mistral-docs-mcp.vercel.app/mcp`.

### Cursor

Add to `.cursor/mcp.json` (project or global):

```json
{
  "mcpServers": {
    "mistral-docs": {
      "url": "https://mistral-docs-mcp.vercel.app/mcp"
    }
  }
}
```

### Windsurf

Add to `mcp_config.json`:

```json
{
  "mcpServers": {
    "mistral-docs": {
      "url": "https://mistral-docs-mcp.vercel.app/mcp"
    }
  }
}
```

### VS Code with Copilot

Command palette: `MCP: Add Server` → HTTP → `https://mistral-docs-mcp.vercel.app/mcp`.

### Codex CLI

```bash
codex mcp add mistral-docs --url https://mistral-docs-mcp.vercel.app/mcp
```

### Gemini CLI / Gemini Code Assist

Add to `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "mistral-docs": {
      "command": "npx",
      "args": ["mcp-remote", "https://mistral-docs-mcp.vercel.app/mcp"]
    }
  }
}
```

### Zed

Add to `settings.json` under `context_servers`:

```json
{
  "context_servers": {
    "mistral-docs": {
      "command": { "url": "https://mistral-docs-mcp.vercel.app/mcp" }
    }
  }
}
```

### Mistral Le Chat

Settings → Custom connectors → Add. URL: `https://mistral-docs-mcp.vercel.app/mcp`, auth: none.

### Mistral Vibe

Edit `~/.vibe/config.toml`:

```toml
[[mcp_servers]]
name = "mistral-docs"
transport = "http"
url = "https://mistral-docs-mcp.vercel.app/mcp"
```

Restart with `vibe`.

### ChatGPT

Developer mode → Connectors → Create → URL `https://mistral-docs-mcp.vercel.app/mcp`, auth none.

## Privacy

No analytics. No query logging. Vercel's built-in request logs only.

## Self-host

Fork this repo and deploy to Vercel. Set two environment variables:

- `CRON_SECRET` (any random string, used to authenticate the cron endpoint)
- `VERCEL_DEPLOY_HOOK_URL` (create a Deploy Hook in your Vercel project settings)

## Development

```bash
npm install
npm run dev
npm test
```

## Design doc

See [`docs/design.md`](docs/design.md).

## License

MIT
