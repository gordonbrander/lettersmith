import * as doc from "./doc.ts";
import { type Doc, logWriteResult, write as writeDoc } from "./doc.ts";
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
    for await (const doc of docs) {
      logWriteResult(await writeDoc(doc, dir));
    }
    return;
  };

/** Remove docs with given ID */
export const removeWithId = (id: Path) => (docs: AwaitableIterable<Doc>) =>
  filterAsync(docs, (doc) => doc.id !== id);

/** Remove drafts */
export const removeDrafts = (docs: AwaitableIterable<Doc>) =>
  filterAsync(docs, (doc) => doc.meta.draft === false);

/** Remove index files */
export const removeIndex = (docs: AwaitableIterable<Doc>) =>
  filterAsync(docs, (doc) => !isIndexPath(doc.outputPath));

export const dedupeById = (docs: AwaitableIterable<Doc>) =>
  dedupeAsync(docs, (doc) => doc.id);
