import { CopyButton } from './_components/CopyButton';

const MCP_URL = 'https://mistral-docs-mcp.vercel.app/mcp';
const REPO = 'nikhilbhima/mistral-ai-docs-mcp-server';
const REPO_URL = `https://github.com/${REPO}`;

const CURSOR_JSON = `{
  "mcpServers": {
    "mistral-docs": {
      "url": "${MCP_URL}"
    }
  }
}`;

const GEMINI_JSON = `{
  "mcpServers": {
    "mistral-docs": {
      "command": "npx",
      "args": ["mcp-remote", "${MCP_URL}"]
    }
  }
}`;

const ZED_JSON = `{
  "context_servers": {
    "mistral-docs": {
      "command": { "url": "${MCP_URL}" }
    }
  }
}`;

const VIBE_TOML = `[[mcp_servers]]
name = "mistral-docs"
transport = "http"
url = "${MCP_URL}"`;

const platforms: {
  name: string;
  tag: string;
  note: string;
  code: string;
  lang?: string;
}[] = [
  {
    name: 'Claude Code',
    tag: 'CLI',
    note: 'One command. Terminal.',
    code: `claude mcp add --transport http mistral-docs ${MCP_URL}`,
  },
  {
    name: 'Claude Desktop',
    tag: 'APP',
    note: 'Settings → Connectors → Add custom connector. Paste the URL.',
    code: MCP_URL,
  },
  {
    name: 'Cursor',
    tag: 'IDE',
    note: 'Add to .cursor/mcp.json, project or global.',
    code: CURSOR_JSON,
    lang: 'json',
  },
  {
    name: 'Windsurf',
    tag: 'IDE',
    note: 'Same shape as Cursor — add to mcp_config.json.',
    code: CURSOR_JSON,
    lang: 'json',
  },
  {
    name: 'VS Code + Copilot',
    tag: 'IDE',
    note: 'Command palette → MCP: Add Server → HTTP → paste.',
    code: MCP_URL,
  },
  {
    name: 'Codex CLI',
    tag: 'CLI',
    note: "OpenAI's local coding agent.",
    code: `codex mcp add mistral-docs --url ${MCP_URL}`,
  },
  {
    name: 'Gemini CLI',
    tag: 'CLI',
    note: 'Add to ~/.gemini/settings.json. Uses mcp-remote bridge.',
    code: GEMINI_JSON,
    lang: 'json',
  },
  {
    name: 'Zed',
    tag: 'IDE',
    note: 'Add to settings.json under context_servers.',
    code: ZED_JSON,
    lang: 'json',
  },
  {
    name: 'Mistral Le Chat',
    tag: 'WEB',
    note: 'Settings → Custom connectors. Paste the URL.',
    code: MCP_URL,
  },
  {
    name: 'Mistral Vibe',
    tag: 'CLI',
    note: 'Edit ~/.vibe/config.toml. Restart with `vibe`.',
    code: VIBE_TOML,
    lang: 'toml',
  },
  {
    name: 'ChatGPT',
    tag: 'WEB',
    note: 'Developer mode → Connectors → Create. URL only, auth none.',
    code: MCP_URL,
  },
];

const queries: { q: string; note: string; tool: string }[] = [
  {
    q: 'How do I call the Mistral API to do OCR on a PDF? Show me a working Python snippet.',
    note: 'Pulls the exact code block from the Basic OCR docs, mistral-ocr-latest model and all.',
    tool: 'search_mistral_docs',
  },
  {
    q: 'Which Mistral models support vision, and what is each one\u2019s context window?',
    note: 'Returns a grounded table straight from the models overview page.',
    tool: 'search_mistral_docs',
  },
  {
    q: 'Show me every endpoint that accepts a response_format parameter.',
    note: 'Exact-match grep across all 139 pages via the filesystem tool.',
    tool: 'query_mistral_docs_filesystem',
  },
  {
    q: 'What is Voxtral and which audio formats does it accept?',
    note: 'Newer model, weak in base training data. Forces a retrieval.',
    tool: 'search_mistral_docs',
  },
  {
    q: 'How do I prepare a dataset to fine-tune a classifier on La Plateforme?',
    note: 'JSONL format, schema, and the exact API call.',
    tool: 'search_mistral_docs',
  },
];

function MonospaceDiagram() {
  return (
    <div className="diagram">
      <div className="diagram-head">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span>pipeline.txt</span>
        <span />
      </div>
      <pre>
{`  `}<span className="label">docs.mistral.ai/llms-full.txt</span>{`
     │
     │  `}<span className="muted">HEAD every 6h · ETag check · deploy hook on change</span>{`
     ▼
  `}<span className="label">build step</span>{`  parse → MiniSearch BM25 → virtual filesystem
     │
     │  `}<span className="muted">baked into the deploy · loaded at module scope on cold start</span>{`
     ▼
  `}<span className="label">/mcp</span>{` ──►  `}<span className="accent">search_mistral_docs</span>{`  +  `}<span className="accent">query_mistral_docs_filesystem</span>{`
           │
           └─ `}<span className="muted">JSON-RPC over Streamable HTTP · any MCP client</span>{`
`}
      </pre>
    </div>
  );
}

function PlatformCard({ name, tag, note, code, lang }: (typeof platforms)[number]) {
  return (
    <article className="platform">
      <div className="platform-head">
        <span className="platform-name">
          {name}
          <span className="tag">{tag}</span>
        </span>
        {lang ? <span className="tag" style={{ color: 'var(--ink-dim)' }}>{lang}</span> : null}
      </div>
      <div className="platform-body">
        <p className="platform-note">{note}</p>
        <div className="code">
          <pre>{code}</pre>
          <CopyButton value={code} />
        </div>
      </div>
    </article>
  );
}

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.26c-3.34.72-4.04-1.41-4.04-1.41-.55-1.38-1.34-1.75-1.34-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.81 1.3 3.5.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23.96-.27 1.99-.4 3.02-.4 1.03.01 2.06.14 3.02.4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.3c0 .32.22.7.83.58A12.03 12.03 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Page() {
  const starBadge = `https://img.shields.io/github/stars/${REPO}?style=flat-square&logo=github&logoColor=a1a1aa&label=&color=1f1f23&labelColor=111113`;

  return (
    <div className="page">
      {/* ---------- Top bar ---------- */}
      <header className="topbar">
        <div className="wrap topbar-row">
          <a href="#top" className="brand" aria-label="Mistral Docs MCP home">
            <img src="/logo.png" alt="" />
            <span>Mistral Docs MCP</span>
          </a>
          <nav className="topbar-links">
            <a
              href={`${REPO_URL}/blob/main/docs/design.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="hide-sm"
            >
              Design
            </a>
            <a
              href="/api/health"
              target="_blank"
              rel="noopener noreferrer"
              className="hide-sm"
            >
              Health
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <GithubIcon /> GitHub
            </a>
            <a
              href={`${REPO_URL}/stargazers`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub stars"
              className="star-badge"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={starBadge} alt="GitHub stars" style={{ display: 'block' }} />
            </a>
          </nav>
        </div>
      </header>

      <main className="main" id="top">
        {/* ---------- Hero ---------- */}
        <section className="hero">
          <div className="wrap">
            <div className="hero-top">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="hero-logo" />
              <span className="hero-pill">
                <span className="dot" /> Unofficial · MIT
              </span>
            </div>
            <h1>
              Mistral docs, <span className="serif">in every agent.</span>
            </h1>
            <p className="lede">
              An MCP server that gives coding agents instant, authoritative
              access to Mistral AI&rsquo;s developer documentation and full API
              reference. <b>One public URL. No auth. No install.</b> 139 pages
              baked into the deploy, refreshed every six hours.
            </p>

            <div className="url-card">
              <div className="url-card-body">
                <div className="url-card-label">Paste into your MCP client</div>
                <div className="url-card-value">{MCP_URL}</div>
              </div>
              <CopyButton value={MCP_URL} label="Copy" />
            </div>

            <div className="meta-row" role="list">
              <span className="meta-item" role="listitem">
                <b>139</b> pages
              </span>
              <span className="sep">·</span>
              <span className="meta-item" role="listitem">
                refreshed every <b>6h</b>
              </span>
              <span className="sep">·</span>
              <span className="meta-item" role="listitem">
                <b>MIT</b> licensed
              </span>
              <span className="sep">·</span>
              <span className="meta-item" role="listitem">
                zero analytics
              </span>
            </div>
          </div>
        </section>

        {/* ---------- What it does ---------- */}
        <section id="about">
          <div className="wrap">
            <div className="kicker">The idea</div>
            <h2 className="section-h">
              Your agent, grounded in{' '}
              <span className="serif">real Mistral docs.</span>
            </h2>
            <p className="lede">
              Coding agents guess when you ask about recent flags, endpoints, or
              models. This server gives them a tool that returns Mistral&rsquo;s
              own text, verbatim, so the agent cites rather than fabricates.
              Content comes from{' '}
              <a
                href="https://docs.mistral.ai/llms-full.txt"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3, textDecorationColor: 'var(--border-strong)' }}
              >
                docs.mistral.ai/llms-full.txt
              </a>{' '}
              — the bundle Mistral publishes for exactly this purpose.
            </p>

            <div className="tool-grid">
              <div className="tool-card">
                <div className="tool-name">search_mistral_docs(query, limit?)</div>
                <p>
                  BM25 lexical search with fuzzy matching across every page.
                  Strong on concept queries (&ldquo;how does RAG work&rdquo;),
                  forgiving on typos, returns snippets plus canonical URLs.
                </p>
                <div className="tool-hint">
                  › How do I use Mistral&rsquo;s vision models?
                </div>
              </div>
              <div className="tool-card">
                <div className="tool-name">query_mistral_docs_filesystem(command)</div>
                <p>
                  Read-only shell over a virtualized filesystem of the parsed
                  docs. Supports <code>rg</code>, <code>find</code>,{' '}
                  <code>cat</code>, <code>ls</code>. Strong for exact strings —
                  flag names, field keys, endpoint paths.
                </p>
                <div className="tool-hint">
                  › rg response_format /api
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- How it works ---------- */}
        <section id="how">
          <div className="wrap">
            <div className="kicker">How it works</div>
            <h2 className="section-h">
              One endpoint. <span className="serif">One fresh build.</span>
            </h2>
            <p className="lede">
              A cron job checks Mistral&rsquo;s ETag every six hours. On change,
              it POSTs a Vercel Deploy Hook. The new build fetches{' '}
              <code style={{ fontFamily: 'var(--mono)', fontSize: 13.5 }}>
                llms-full.txt
              </code>
              , parses it, builds a MiniSearch index, and bakes the whole thing
              into the deploy artifact. No blob store. No database. No stale
              content.
            </p>
            <MonospaceDiagram />
          </div>
        </section>

        {/* ---------- Connect ---------- */}
        <section id="connect">
          <div className="wrap">
            <div className="kicker">Connect</div>
            <h2 className="section-h">
              Paste the URL into{' '}
              <span className="serif">any MCP-capable client.</span>
            </h2>
            <p className="lede">
              Zero API key. Zero install. Here&rsquo;s the exact snippet for the
              common ones.
            </p>

            <div className="platforms">
              {platforms.map((p) => (
                <PlatformCard key={p.name} {...p} />
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Test drive ---------- */}
        <section id="test">
          <div className="wrap">
            <div className="kicker">Test drive</div>
            <h2 className="section-h">
              Good prompts <span className="serif">that force a retrieval.</span>
            </h2>
            <p className="lede">
              Ask these verbatim. Don&rsquo;t mention the MCP — a well-wired
              client will reach for it on its own. If the model answers without
              touching a tool, the question probably wasn&rsquo;t
              Mistral-specific enough.
            </p>

            <ul className="queries">
              {queries.map((q, i) => (
                <li key={i} className="query">
                  <p className="q-body">&ldquo;{q.q}&rdquo;</p>
                  <div className="q-note">
                    <span className="tool">{q.tool}</span> — {q.note}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Demo ---------- */}
        <section id="demo">
          <div className="wrap">
            <div className="kicker">Demo</div>
            <h2 className="section-h">
              A minute <span className="serif">with the MCP in action.</span>
            </h2>
            <div className="video-wrap">
              <div className="video-head">
                <span>demo.mp4</span>
                <span>01:00</span>
              </div>
              <div className="video-frame">
                <div className="video-placeholder">
                  <span className="soon">Video · Soon</span>
                  <span>A walkthrough lands here when the recording&rsquo;s up.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="site-footer">
        <div className="wrap foot-row">
          <div className="icons">
            <a
              href="https://x.com/nikhilbhima"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
            >
              <XIcon />
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
            >
              <GithubIcon />
            </a>
          </div>
          <div className="attr">
            Built by{' '}
            <a
              href="https://x.com/nikhilbhima"
              target="_blank"
              rel="noopener noreferrer"
            >
              @nikhilbhima
            </a>{' '}
            for the Mistral AI community{' '}
            <span aria-hidden="true">🧡</span>
          </div>
          <div className="disclaimer">
            Unofficial. Not affiliated with Mistral AI.
          </div>
        </div>
      </footer>
    </div>
  );
}
