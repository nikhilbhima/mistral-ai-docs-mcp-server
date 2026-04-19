import { CopyButton } from './_components/CopyButton';
import { ClientTabs, type ClientTab } from './_components/ClientTabs';

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

const clientTabs: ClientTab[] = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    note: 'One command in your terminal:',
    code: `claude mcp add --transport http mistral-docs ${MCP_URL}`,
  },
  {
    id: 'claude-desktop',
    label: 'Claude Desktop',
    note: 'Settings → Connectors → Add custom connector. Paste the URL:',
    code: MCP_URL,
  },
  {
    id: 'cursor',
    label: 'Cursor',
    note: 'Add to .cursor/mcp.json (project or global):',
    code: CURSOR_JSON,
    lang: 'json',
  },
  {
    id: 'windsurf',
    label: 'Windsurf',
    note: 'Same shape as Cursor. Add to mcp_config.json:',
    code: CURSOR_JSON,
    lang: 'json',
  },
  {
    id: 'vscode',
    label: 'VS Code',
    note: 'Command palette → MCP: Add Server → HTTP → paste the URL:',
    code: MCP_URL,
  },
  {
    id: 'codex',
    label: 'Codex CLI',
    note: "OpenAI's local coding agent:",
    code: `codex mcp add mistral-docs --url ${MCP_URL}`,
  },
  {
    id: 'gemini',
    label: 'Gemini CLI',
    note: 'Add to ~/.gemini/settings.json (uses mcp-remote bridge):',
    code: GEMINI_JSON,
    lang: 'json',
  },
  {
    id: 'zed',
    label: 'Zed',
    note: 'Add to settings.json under context_servers:',
    code: ZED_JSON,
    lang: 'json',
  },
  {
    id: 'le-chat',
    label: 'Le Chat',
    note: 'Settings → Custom connectors. Paste the URL:',
    code: MCP_URL,
  },
  {
    id: 'vibe',
    label: 'Mistral Vibe',
    note: 'Edit ~/.vibe/config.toml, then restart with `vibe`:',
    code: VIBE_TOML,
    lang: 'toml',
  },
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    note: 'Developer mode → Connectors → Create. URL only, auth none:',
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
    q: 'Show me every endpoint that accepts a response_format parameter.',
    note: 'Exact-match grep across all 139 pages via the filesystem tool.',
    tool: 'query_mistral_docs_filesystem',
  },
  {
    q: 'What is Voxtral and which audio formats does it accept?',
    note: 'Newer model, weak in base training data. Forces a retrieval.',
    tool: 'search_mistral_docs',
  },
];

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

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" />
            <span>Mistral Docs MCP</span>
          </a>
          <nav className="topbar-links" aria-label="Primary">
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
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="github-btn"
            >
              <GithubIcon /> GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="main" id="top">
        {/* ---------- Hero ---------- */}
        <section className="hero">
          <div className="wrap">
            <div className="hero-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="hero-logo" />
              <h1>Mistral AI Docs MCP</h1>
              <p className="hero-sub">
                Unofficial. Not affiliated with Mistral AI.
              </p>

              <div className="url-card">
                <div className="url-card-body">
                  <div className="url-card-label">Paste into your MCP client</div>
                  <div className="url-card-value">{MCP_URL}</div>
                </div>
                <CopyButton value={MCP_URL} label="Copy" />
              </div>

              <div className="hero-meta">
                <span><b>139</b> pages</span>
                <span className="sep">·</span>
                <span>refreshed every <b>6h</b></span>
                <span className="sep">·</span>
                <span><b>MIT</b></span>
                <span className="sep">·</span>
                <span>zero analytics</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Connect (two-col) ---------- */}
        <section id="connect">
          <div className="wrap">
            <div className="two-col">
              <div>
                <div className="kicker">Connect</div>
                <h2 className="section-h">
                  Your AI tools, meet{' '}
                  <span className="serif">the whole Mistral docs.</span>
                </h2>
                <p className="lede">
                  Paste the URL into any MCP-compatible client. Your agent gets
                  instant access to every page Mistral publishes in{' '}
                  <code style={{ fontFamily: 'var(--mono)', fontSize: 13.5, color: 'var(--ink)' }}>
                    llms-full.txt
                  </code>
                  , verbatim. No key, no install, no glue code.
                </p>

                <ul className="feature-list">
                  <li>
                    <span className="mark"><CheckIcon /></span>
                    <div>
                      <b>Accurate.</b>
                      <p>Mistral&rsquo;s own docs text, never paraphrased.</p>
                    </div>
                  </li>
                  <li>
                    <span className="mark"><CheckIcon /></span>
                    <div>
                      <b>Fast.</b>
                      <p>Index baked into the deploy, loaded in memory. Sub-second responses.</p>
                    </div>
                  </li>
                  <li>
                    <span className="mark"><CheckIcon /></span>
                    <div>
                      <b>Fresh.</b>
                      <p>Cron checks the upstream ETag every six hours and rebuilds on change.</p>
                    </div>
                  </li>
                  <li>
                    <span className="mark"><CheckIcon /></span>
                    <div>
                      <b>Two tools.</b>
                      <p>
                        <code style={{ fontFamily: 'var(--mono)', fontSize: 12.5, color: 'var(--ink-soft)' }}>search_mistral_docs</code>{' '}
                        for concepts,{' '}
                        <code style={{ fontFamily: 'var(--mono)', fontSize: 12.5, color: 'var(--ink-soft)' }}>query_mistral_docs_filesystem</code>{' '}
                        for exact-match grep.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <ClientTabs tabs={clientTabs} />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Try it ---------- */}
        <section id="try">
          <div className="wrap">
            <div className="kicker">Try it</div>
            <h2 className="section-h">
              Good prompts{' '}
              <span className="serif">that force a retrieval.</span>
            </h2>
            <p className="lede">
              Ask these verbatim in any wired-up client. Don&rsquo;t mention the
              MCP, a well-configured agent reaches for it on its own.
            </p>

            <ul className="queries">
              {queries.map((q, i) => (
                <li key={i} className="query">
                  <p className="q-body">{q.q}</p>
                  <div className="q-note">
                    <span className="tool">{q.tool}</span> · {q.note}
                  </div>
                </li>
              ))}
            </ul>

            <div className="video-wrap">
              <div className="video-head">
                <span>demo.mp4</span>
                <span>01:00</span>
              </div>
              <div className="video-frame">
                <div className="video-placeholder">
                  <span className="soon">Video · Soon</span>
                  <span>
                    A walkthrough lands here when the recording&rsquo;s up.
                  </span>
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
