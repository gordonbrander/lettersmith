import * as doc from "./doc.ts";
import { type Doc } from "./doc.ts";
import { pipe } from "./pipe.ts";
import { globPaths, isIndexPath, type Path } from "./path.ts";
import {
  type AwaitableIterable,
  dedupeAsync,
  filterAsync,
  filterMapAsync,
  mapAsync,
} from "./generator.ts";
import type { Result } from "./result.ts";
import { isErr } from "./result.ts";

export const read = (
  paths: AwaitableIterable<string>,
): AsyncGenerator<Result<Doc, Error>> =>
  mapAsync(paths, (path) => doc.read(path));

export const readMatching = (glob: string) => pipe(glob, globPaths, read);

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
 * Write all docs, logging results
 * @returns a promise for the completion of the build.
 */
export const build =
  (dir: Path) => async (docs: AwaitableIterable<Doc>): Promise<void> => {
    for await (const d of docs) {
      doc.logWriteResult(await doc.write(d, dir));
    }
    return;
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
