import MiniSearch from 'minisearch';
import rawIndex from '../generated/docs-index.json';
import { SEARCH_OPTIONS } from './build';
import { VirtualFS } from '../fs/virtual';
import type { Page } from './parse';

interface BundledIndex {
  pages: Page[];
  searchIndex: string;
  sourceEtag: string;
  builtAt: string;
}

const bundle = rawIndex as unknown as BundledIndex;

export const pages: Page[] = bundle.pages;
export const searchIndex: MiniSearch<Page> = MiniSearch.loadJSON<Page>(
  bundle.searchIndex,
  SEARCH_OPTIONS,
);
export const vfs = new VirtualFS(pages);
export const meta = {
  pageCount: pages.length,
  sourceEtag: bundle.sourceEtag,
  builtAt: bundle.builtAt,
};
