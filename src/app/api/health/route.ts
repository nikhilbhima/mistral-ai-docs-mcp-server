import { meta } from '@/index/load';

export function GET(): Response {
  return Response.json({
    indexBuiltAt: meta.builtAt,
    pageCount: meta.pageCount,
    sourceEtag: meta.sourceEtag,
  });
}
