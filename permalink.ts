import { create as createDoc, type Doc } from "./doc.ts";
import { type AwaitableIterable, mapAsync } from "./generator.ts";
import type { Path } from "./path.ts";

/** Render permalink on a doc, using a closure to generate the permalink */
export const permalinkDoc = (
  doc: Doc,
  readPermalink: (doc: Doc) => Path,
): Doc =>
  createDoc({
    ...doc,
    outputPath: readPermalink(doc),
  });

/** Render permalinks on docs, using a closure to generate the permalink */
export const permalinkDocs = (
  docs: AwaitableIterable<Doc>,
  readPermalink: (doc: Doc) => Path,
): AsyncGenerator<Doc> =>
  mapAsync(docs, (doc) => permalinkDoc(doc, readPermalink));
