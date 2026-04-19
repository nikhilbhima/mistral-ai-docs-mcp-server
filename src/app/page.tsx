import { CopyButton } from './_components/CopyButton';
import { ClientTabs, type ClientTab } from './_components/ClientTabs';
import { GithubStarButton } from './_components/GithubStar';

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

const queries: string[] = [
  'Show me every API endpoint that accepts a response_format parameter.',
  'What is the exact request and response schema for Mistral\u2019s Document AI annotations endpoint?',
  'How do Agent Handoffs work? Give me a working code example where one agent delegates to another.',
  'For each currently available Mistral model, show me the model ID, whether it is open-weight or commercial, and a typical use case.',
  'Using Mistral\u2019s Python SDK, show me a complete streaming chat completion example with function calling enabled.',
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

export default function Page() {
  return (
    <div className="page">
      {/* ---------- Top bar ---------- */}
      <header className="topbar">
        <div className="wrap topbar-row">
          <a href="#top" className="brand" aria-label="Mistral Docs MCP home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" width="26" height="26" />
            <span>Mistral Docs MCP</span>
          </a>
          <nav className="topbar-links" aria-label="Primary">
            <a
              href="https://panel-de-chat.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-text hide-sm"
            >
              Panel de Chat
            </a>
            <GithubStarButton />
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
              <img
                src="/logo.png"
                alt=""
                width="96"
                height="96"
                className="hero-logo"
                fetchPriority="high"
              />
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
            </div>
          </div>
        </section>

        {/* ---------- Connect ---------- */}
        <section id="connect">
          <div className="wrap">
            <div className="kicker">Connect an MCP client</div>
            <h2 className="section-h">Paste the URL into any MCP client.</h2>
            <p className="lede">
              Exact snippet for each of the common ones.
            </p>
            <ClientTabs tabs={clientTabs} />
          </div>
        </section>

        {/* ---------- Example prompts ---------- */}
        <section id="try">
          <div className="wrap">
            <div className="two-col">
              <div>
                <h2 className="section-h">Your AI tools, meet the whole Mistral docs.</h2>
                <p className="lede">
                  Once wired up, your agent reaches for the MCP on its own for
                  anything Mistral-specific. No need to mention the tool by
                  name.
                </p>
              </div>
              <div>
                <p className="queries-intro">
                  Try asking your AI client:
                </p>
                <ul className="queries-plain">
                  {queries.map((q, i) => (
                    <li key={i}>&ldquo;{q}&rdquo;</li>
                  ))}
                </ul>
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
