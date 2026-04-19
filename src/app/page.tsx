export default function Page() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#fafafa',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
      <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
        <img
          src="/logo.png"
          alt=""
          width={96}
          height={96}
          style={{ imageRendering: 'pixelated' }}
        />
        <h1 style={{ fontSize: 32, margin: '20px 0 6px', fontWeight: 600 }}>
          Mistral Docs MCP
        </h1>
        <p style={{ color: '#a1a1aa', margin: '0 0 28px', fontSize: 14 }}>
          Unofficial. Not affiliated with Mistral AI.
        </p>

        <div
          style={{
            background: '#18181b',
            border: '1px solid #27272a',
            borderRadius: 10,
            padding: '14px 18px',
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace',
            fontSize: 14,
            color: '#e4e4e7',
            textAlign: 'left',
            wordBreak: 'break-all',
          }}
        >
          <div
            style={{
              color: '#71717a',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              marginBottom: 6,
            }}
          >
            Paste into your MCP client
          </div>
          https://mistral-docs-mcp.vercel.app/mcp
        </div>

        <div
          style={{
            marginTop: 24,
            display: 'flex',
            gap: 18,
            justifyContent: 'center',
            fontSize: 13,
          }}
        >
          <a
            href="https://github.com/nikhilbhima/mistral-ai-docs-mcp-server"
            style={{ color: '#60a5fa', textDecoration: 'none' }}
          >
            GitHub
          </a>
          <a
            href="/api/health"
            style={{ color: '#60a5fa', textDecoration: 'none' }}
          >
            Health
          </a>
          <a
            href="https://github.com/nikhilbhima/mistral-ai-docs-mcp-server/blob/main/docs/design.md"
            style={{ color: '#60a5fa', textDecoration: 'none' }}
          >
            Design
          </a>
        </div>
      </div>
      </main>

      <footer
        style={{
          borderTop: '1px solid #1c1c1f',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18,
          flexWrap: 'wrap',
          fontSize: 13,
          color: '#71717a',
        }}
      >
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <a
            href="https://x.com/nikhilbhima"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            style={{ color: '#a1a1aa', display: 'inline-flex' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://github.com/nikhilbhima/mistral-ai-docs-mcp-server"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            style={{ color: '#a1a1aa', display: 'inline-flex' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.26c-3.34.72-4.04-1.41-4.04-1.41-.55-1.38-1.34-1.75-1.34-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.81 1.3 3.5.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23.96-.27 1.99-.4 3.02-.4 1.03.01 2.06.14 3.02.4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.3c0 .32.22.7.83.58A12.03 12.03 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
            </svg>
          </a>
        </div>

        <div>
          Built by{' '}
          <a
            href="https://x.com/nikhilbhima"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#a1a1aa',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
              textDecorationColor: '#3f3f46',
            }}
          >
            @nikhilbhima
          </a>{' '}
          for the Mistral AI community{' '}
          <span aria-hidden="true">🧡</span>
        </div>

        <div>Unofficial. Not affiliated with Mistral AI.</div>
      </footer>
    </div>
  );
}
