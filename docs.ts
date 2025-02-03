import * as doc from "./doc.ts";
import type { Doc } from "./doc.ts";
import { pipe } from "@gordonb/pipe";
import { globPaths, isIndexPath, type Path } from "./utils/path.ts";
import {
  type AwaitableIterable,
  dedupeAsync,
  filterAsync,
  filterMapAsync,
  flattenAsync,
  mapAsync,
} from "./utils/generator.ts";
import { isErr, type Result } from "./utils/result.ts";
import { takeAsync } from "./utils/generator.ts";

export const read = (
  paths: AwaitableIterable<string>,
): AsyncGenerator<Result<Doc, Error>> =>
  mapAsync(paths, (path) => doc.read(path));

export const readMatching = (
  glob: string,
): AsyncGenerator<Result<Doc, Error>> => pipe(glob, globPaths, read);

/**
 * Dump errors to stderr
 * @returns a generator for just the docs that successfully loaded
 */
export const dumpErr = (
  docs: AwaitableIterable<Result<Doc, Error>>,
): AsyncGenerator<Doc> =>
  filterMapAsync(docs, (result) => {
    if (isErr(result)) {
      console.error(result.error);
      return null;
    }
    return result.ok;
  });

/**
 * Write all docs, logging results.
 * Supports passing more than one docs iterable.
 * @returns a promise for the completion of the build.
 */
export const write =
  (dir: Path) => async (docs: AwaitableIterable<Doc>): Promise<void> => {
    for await (const d of docs) {
      doc.logWriteResult(await doc.write(d, dir));
    }
    return;
  };

/**
 * Write all docs, logging results.
 * Supports passing more than one docs iterable.
 * Build supports passing multiple doc iterables as varargs.
 * @example
 * await build(docsA, docsB, docsC);
 * console.log("Built all three!");
 * @returns a promise for the completion of the build.
 */
export const build = (
  dir: Path,
): (...groups: AwaitableIterable<Doc>[]) => Promise<void> => {
  const writeToDir = write(dir);
  return (...groups: AwaitableIterable<Doc>[]): Promise<void> =>
    writeToDir(flattenAsync(groups));
};

/** Remove docs with given ID */
export const removeWithId =
  (id: Path) => (docs: AwaitableIterable<Doc>): AsyncGenerator<Doc> =>
    filterAsync(docs, (d) => d.id !== id);

/** Remove drafts */
export const removeDrafts = (
  docs: AwaitableIterable<Doc>,
): AsyncGenerator<Doc> => filterAsync(docs, (d) => d.meta.draft === false);

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
): AsyncGenerator<Result<Doc, Error>> => mapAsync(docs, doc.parseFrontmatter);

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
