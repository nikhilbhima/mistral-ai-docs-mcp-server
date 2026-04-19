import MiniSearch from 'minisearch';
import type { Page } from './parse';

export const SEARCH_OPTIONS = {
  fields: ['title', 'content', 'path'],
  storeFields: ['title', 'path', 'sourceUrl', 'category'],
  idField: 'path',
  searchOptions: {
    boost: { title: 3, path: 2 },
    fuzzy: 0.2,
    prefix: true,
    combineWith: 'OR' as const,
  },
};

export function buildSearchIndex(pages: Page[]): MiniSearch<Page> {
  const idx = new MiniSearch<Page>(SEARCH_OPTIONS);
  idx.addAll(pages);
  return idx;
}
