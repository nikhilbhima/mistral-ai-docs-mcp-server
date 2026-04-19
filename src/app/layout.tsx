import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mistral Docs MCP',
  description:
    'Unofficial MCP server for Mistral AI developer documentation and full API reference. One public URL, no auth, works in every MCP client.',
  openGraph: {
    title: 'Mistral Docs MCP',
    description:
      'Unofficial MCP server for Mistral AI developer documentation and full API reference.',
    url: 'https://mistral-docs-mcp.vercel.app',
    siteName: 'Mistral Docs MCP',
    images: [{ url: '/logo.png', width: 128, height: 128 }],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Mistral Docs MCP',
    description:
      'Unofficial MCP server for Mistral AI developer documentation and full API reference.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0a0a0a' }}>{children}</body>
    </html>
  );
}
