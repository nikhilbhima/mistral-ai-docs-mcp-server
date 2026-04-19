import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

describe('cron refresh logic', () => {
  beforeEach(() => {
    process.env.CRON_SECRET = 'test-secret';
    process.env.VERCEL_DEPLOY_HOOK_URL = 'https://hook.example/deploy';
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    vi.restoreAllMocks();
  });

  it('rejects unauthorized requests', async () => {
    const { GET } = await import('@/app/api/cron/refresh/route');
    const res = await GET(new Request('http://x/api/cron/refresh'));
    expect(res.status).toBe(401);
  });

  it('returns unchanged when upstream returns 304', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 304 })));
    const { GET } = await import('@/app/api/cron/refresh/route');
    const res = await GET(
      new Request('http://x/api/cron/refresh', {
        headers: { authorization: 'Bearer test-secret' },
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('unchanged');
  });

  it('POSTs to deploy hook when upstream returns 200 with new etag', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 200, headers: { etag: 'new-etag' } }))
      .mockResolvedValueOnce(new Response(null, { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    const { GET } = await import('@/app/api/cron/refresh/route');
    const res = await GET(
      new Request('http://x/api/cron/refresh', {
        headers: { authorization: 'Bearer test-secret' },
      }),
    );
    const body = await res.json();
    expect(body.status).toBe('triggered');
    expect(body.newEtag).toBe('new-etag');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toBe('https://hook.example/deploy');
  });
});
