export default function Page() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#fafafa',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
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
  );
}
