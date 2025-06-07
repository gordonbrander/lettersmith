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
import { join as joinPath } from "@std/path/join";

/** Read documents from paths */
export const read = (
  paths: AwaitableIterable<string>,
): AsyncGenerator<Doc> => mapAsync(paths, (path) => doc.read(path));

/** Read documents matching glob pattern */
export const readMatching = (
  glob: string,
): AsyncGenerator<Doc> => pipe(glob, globPaths, read);

/**
 * Write documents to file system.
 * Logs to stdout for each doc written to file system.
 * @example
 * await build("public", docsA, docsB, docsC);
 * console.log("Built everything!");
 */
export const build = async (
  dir: Path,
  ...groups: AwaitableIterable<Doc>[]
): Promise<void> => {
  for await (const d of flattenAsync(groups)) {
    try {
      const { id, output } = await doc.write(d, dir);
      const fullOutputPath = joinPath(dir, output);
      console.log(`${fullOutputPath} <- ${id}`);
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

/** Auto-generate a title from filename if title is empty */
export const autoTitle = (
  docs: AwaitableIterable<Doc>,
): AsyncGenerator<Doc> => mapAsync(docs, doc.autoTitle);

/** Auto-generate a summary property if summary is empty */
export const autoSummary = (
  docs: AwaitableIterable<Doc>,
): AsyncGenerator<Doc> => mapAsync(docs, doc.autoSummary);

export const autoTemplate = (
  docs: AwaitableIterable<Doc>,
): AsyncGenerator<Doc> => mapAsync(docs, doc.autoTemplate);

export const setExtension =
  (ext: string) => (docs: AwaitableIterable<Doc>): AsyncGenerator<Doc> =>
    mapAsync(docs, (d) => doc.setExtension(d, ext));

/** Parse YAML frontmatter */
export const parseFrontmatter = (
  docs: AwaitableIterable<Doc>,
): AsyncGenerator<Doc> => mapAsync(docs, doc.parseFrontmatter);

/** Uplift metadata, copying properties from the frontmatter onto blessed fields of the doc. */
export const upliftMeta = (docs: AwaitableIterable<Doc>): AsyncGenerator<Doc> =>
  mapAsync(docs, doc.upliftMeta);

/** Parse and set up doc metadata:
 * - Parse YAML frontmatter
 * - Uplift "blessed" frontmatter fields, such as summary to corresponding fields on the doc
 * - Auto-generate a summary property if summary is empty
 * - Auto-assign a template property if template is empty
 */
export const meta = (docs: AwaitableIterable<Doc>): AsyncGenerator<Doc> =>
  pipe(
    docs,
    parseFrontmatter,
    upliftMeta,
    autoTemplate,
  );

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
