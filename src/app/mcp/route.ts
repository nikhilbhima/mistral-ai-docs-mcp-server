import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import {
  searchMistralDocs,
  searchSchema,
  queryMistralDocsFilesystem,
  filesystemSchema,
} from '@/mcp/tools';

function buildServer(): McpServer {
  const server = new McpServer({ name: 'mistral-docs', version: '0.1.0' });

  server.tool(
    'search_mistral_docs',
    'Search Mistral AI documentation and API reference by keyword or natural-language query. Returns a ranked list of pages with title, source URL, doc_path (for use with query_mistral_docs_filesystem), and a short snippet.',
    searchSchema,
    async (args) => ({
      content: [{ type: 'text', text: await searchMistralDocs(args) }],
    }),
  );

  server.tool(
    'query_mistral_docs_filesystem',
    'Run safe read-only commands (rg, find, cat, ls) against a virtualized filesystem of Mistral docs. Use rg for exact-match searches, cat to read a full page, find to list pages by glob, ls to explore directories. Output capped at 30 KB.',
    filesystemSchema,
    async (args) => ({
      content: [{ type: 'text', text: await queryMistralDocsFilesystem(args) }],
    }),
  );

  return server;
}

async function handler(req: Request): Promise<Response> {
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  const server = buildServer();
  await server.connect(transport);
  return transport.handleRequest(req);
}

export { handler as GET, handler as POST, handler as DELETE };
