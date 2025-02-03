import * as doc from "./doc.ts";
import type { Doc } from "./doc.ts";
import { pipe } from "@gordonb/pipe";
import { globPaths, isIndexPath, type Path } from "./utils/path.ts";
import {
  type AwaitableIterable,
  dedupeAsync,
  filterAsync,
  flattenAsync,
  mapAsync,
  takeAsync,
} from "@gordonb/generator";

export const read = (
  paths: AwaitableIterable<string>,
): AsyncGenerator<Doc> => mapAsync(paths, (path) => doc.read(path));

export const readMatching = (
  glob: string,
): AsyncGenerator<Doc> => pipe(glob, globPaths, read);

/**
 * Create a build function that supports passing multiple doc iterables as varargs.
 * Returned build function allows passing multiple sync or async iterables of docs as varargs.
 * Logs receipts to stdout for each doc written to file system.
 * @example
 * const write = build("public");
 * await write(docsA, docsB, docsC);
 * console.log("Built everything!");
 */
export const build = (
  dir: Path,
): (...groups: AwaitableIterable<Doc>[]) => Promise<void> =>
async (...groups: AwaitableIterable<Doc>[]): Promise<void> => {
  for await (const d of flattenAsync(groups)) {
    try {
      const { id, output } = await doc.write(d, dir);
      console.log("Wrote", `${id} -> ${output}`);
    } catch (error) {
      throw new Error(`Failed to build doc ${d.id}`, { cause: error });
    }
  }
};

/** Remove docs with given ID */
export const removeWithId =
  (id: Path) => (docs: AwaitableIterable<Doc>): AsyncGenerator<Doc> =>
    filterAsync(docs, (d) => d.id !== id);

/** Remove drafts */
export const removeDrafts = (
  docs: AwaitableIterable<Doc>,
): AsyncGenerator<Doc> => filterAsync(docs, (d) => d.meta.draft !== true);

/** Remove index files */
export const removeIndex = (
  docs: AwaitableIterable<Doc>,
): AsyncGenerator<Doc> => filterAsync(docs, (d) => !isIndexPath(d.outputPath));

export const dedupeById = (docs: AwaitableIterable<Doc>): AsyncGenerator<Doc> =>
  dedupeAsync(docs, (d) => d.id);

export const autoSummary = (
  docs: AwaitableIterable<Doc>,
): AsyncGenerator<Doc> => mapAsync(docs, doc.autoSummary);

export const autoTemplate = (
  docs: AwaitableIterable<Doc>,
): AsyncGenerator<Doc> => mapAsync(docs, doc.autoTemplate);

export const setExtension =
  (ext: string) => (docs: AwaitableIterable<Doc>): AsyncGenerator<Doc> =>
    mapAsync(docs, (d) => doc.setExtension(d, ext));

export const parseFrontmatter = (
  docs: AwaitableIterable<Doc>,
): AsyncGenerator<Doc> => mapAsync(docs, doc.parseFrontmatter);

export const upliftMeta = (docs: AwaitableIterable<Doc>): AsyncGenerator<Doc> =>
  mapAsync(docs, doc.upliftMeta);

/**
 * Sort docs using a compare function.
 * Note: this function collects all items of iterable into memory for sorting.
 */
export async function* sortedBy(
  docs: AwaitableIterable<Doc>,
  compare: (a: Doc, b: Doc) => number,
): AsyncGenerator<Doc> {
  const collected = await Array.fromAsync(docs);
  collected.sort(compare);
  for (const doc of collected) {
    yield doc;
  }
}

/**
 * Sort docs by created date, reverse chronological (blog format).
 * Note: this function collects all items of iterable into memory for sorting.
 */
export const sortedReverseChron = (
  docs: AwaitableIterable<Doc>,
): AsyncGenerator<Doc> =>
  sortedBy(docs, (a, b) => a.created > b.created ? -1 : 1);

/**
 * Sort docs by created date, reverse chronological (blog format), and take up
 * to `max` items
 */
export const recent = (
  docs: AwaitableIterable<Doc>,
  max: number,
): AsyncGenerator<Doc> => takeAsync(sortedReverseChron(docs), max);
