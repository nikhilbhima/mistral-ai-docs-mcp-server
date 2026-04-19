import { meta } from '@/index/load';

const UPSTREAM = 'https://docs.mistral.ai/llms-full.txt';

export async function GET(req: Request): Promise<Response> {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('unauthorized', { status: 401 });
  }

  const started = Date.now();
  const currentEtag = meta.sourceEtag;
  const res = await fetch(UPSTREAM, {
    method: 'HEAD',
    headers: currentEtag ? { 'If-None-Match': currentEtag } : {},
  });

  if (res.status === 304) {
    return Response.json({
      status: 'unchanged',
      etag: currentEtag,
      ms: Date.now() - started,
    });
  }

  const newEtag = res.headers.get('etag') ?? '';
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hookUrl) {
    return Response.json(
      { status: 'error', reason: 'VERCEL_DEPLOY_HOOK_URL not set' },
      { status: 500 },
    );
  }

  const hookRes = await fetch(hookUrl, { method: 'POST' });
  return Response.json({
    status: 'triggered',
    oldEtag: currentEtag,
    newEtag,
    hookStatus: hookRes.status,
    ms: Date.now() - started,
  });
}
