import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Instrument_Serif } from 'next/font/google';
import './globals.css';

const serif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://mistral-docs-mcp.vercel.app'),
  title: 'Mistral Docs MCP',
  description:
    'Unofficial MCP server for Mistral AI developer documentation and full API reference. One public URL, no auth, works in every MCP client.',
  openGraph: {
    title: 'Mistral Docs MCP',
    description:
      'Unofficial MCP server for Mistral AI developer documentation and full API reference.',
    url: 'https://mistral-docs-mcp.vercel.app',
    siteName: 'Mistral Docs MCP',
    images: [{ url: '/logo.png', width: 512, height: 512 }],
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
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${serif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
