import { describe, it, expect, vi } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { VirtualFS } from '@/fs/virtual';

vi.mock('@/index/load', () => ({
  pages: [],
  searchIndex: { search: () => [] },
  vfs: new VirtualFS([]),
  meta: { pageCount: 0, sourceEtag: '', builtAt: '' },
}));

async function connectLinkedPair() {
  const { buildServer } = await import('@/mcp/server');
  const server = buildServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'test-client', version: '0.0.0' });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return { client, server };
}

describe('MCP server metadata', () => {
  it('exposes triggering instructions that override model confidence', async () => {
    const { client } = await connectLinkedPair();

    const instructions = client.getInstructions();
    expect(instructions).toBeDefined();
    expect(instructions).toMatch(/Mistral/);
    expect(instructions).toMatch(/fine-tuning/);
    expect(instructions).toMatch(/Use even when you think you know the answer/);
    expect(instructions).toMatch(/Do not use for:/);

    await client.close();
  });

  it('registers both tools with Mistral-specific descriptions', async () => {
    const { client } = await connectLinkedPair();

    const { tools } = await client.listTools();
    expect(tools).toHaveLength(2);

    const search = tools.find((t) => t.name === 'search_mistral_docs');
    expect(search).toBeDefined();
    expect(search?.description).toMatch(/Mistral/);
    expect(search?.description).toMatch(/fine-tuning/);
    expect(search?.description).toMatch(/query_mistral_docs_filesystem/);

    const filesystem = tools.find((t) => t.name === 'query_mistral_docs_filesystem');
    expect(filesystem).toBeDefined();
    expect(filesystem?.description).toMatch(/rg/);
    expect(filesystem?.description).toMatch(/cat/);
    expect(filesystem?.description).toMatch(/30 KB/);

    await client.close();
  });
});
