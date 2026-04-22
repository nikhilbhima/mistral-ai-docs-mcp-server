import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  searchMistralDocs,
  searchSchema,
  queryMistralDocsFilesystem,
  filesystemSchema,
} from '@/mcp/tools';

export const SERVER_INSTRUCTIONS = `Use these tools whenever the user asks about Mistral AI: Mistral models, La Plateforme, the Mistral API, fine-tuning, agents, function calling, structured outputs, embeddings, OCR, moderation, vision, code models, pricing, rate limits, SDKs, or any other Mistral-specific feature. Use even when you think you know the answer. Training data lags the docs, and Mistral ships new models and API changes frequently.

Prefer search_mistral_docs for concept-level questions and discovery. Prefer query_mistral_docs_filesystem for exact-string lookups, listing pages, or reading a specific page after a search.

Do not use for: generic ML concepts, questions about other LLM providers, or general programming questions.`;

export const SEARCH_TOOL_DESCRIPTION =
  "Search Mistral AI's docs and API reference. Use for any Mistral question: models, the API, fine-tuning, agents, embeddings, OCR, pricing, SDKs. BM25 with fuzzy matching. Returns ranked pages with title, source URL, doc_path (feed into query_mistral_docs_filesystem), and a snippet. Start here; fall back to query_mistral_docs_filesystem for exact strings or full-page reads.";

export const FILESYSTEM_TOOL_DESCRIPTION =
  "Read-only shell over a virtualized filesystem of Mistral's docs. Supports rg (regex), find (glob), cat (read page), ls (list directory). Good for exact-string lookups the search index misses, reading a full page after search_mistral_docs, or exploring the doc tree. Output capped at 30 KB.";

export function buildServer(): McpServer {
  const server = new McpServer(
    { name: 'mistral-docs', version: '0.1.0' },
    { instructions: SERVER_INSTRUCTIONS },
  );

  server.tool(
    'search_mistral_docs',
    SEARCH_TOOL_DESCRIPTION,
    searchSchema,
    async (args) => ({
      content: [{ type: 'text', text: await searchMistralDocs(args) }],
    }),
  );

  server.tool(
    'query_mistral_docs_filesystem',
    FILESYSTEM_TOOL_DESCRIPTION,
    filesystemSchema,
    async (args) => ({
      content: [{ type: 'text', text: await queryMistralDocsFilesystem(args) }],
    }),
  );

  return server;
}
