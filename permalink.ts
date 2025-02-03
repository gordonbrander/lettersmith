import { create as createDoc, type Doc } from "./doc.ts";
import { type AwaitableIterable, mapAsync } from "@gordonb/generator";
import { type Path, stem } from "./utils/path.ts";
import { dirname } from "@std/path/dirname";
import { toSlug } from "./utils/slug.ts";
import { dd, mm, yyyy } from "./utils/date.ts";

export type PermalinkProps = {
  title: string;
  outputPath: string;
  slug: string;
  yyyy: string;
  mm: string;
  dd: string;
  parent: string;
};

const readPermalinkProps = (doc: Doc): PermalinkProps => ({
  title: doc.title,
  outputPath: doc.outputPath,
  slug: toSlug(stem(doc.outputPath)),
  yyyy: yyyy(doc.created),
  mm: mm(doc.created),
  dd: dd(doc.created),
  parent: dirname(doc.outputPath),
});

/** Render permalink on a doc, using a closure to generate the permalink */
export const permalinkDoc = (
  doc: Doc,
  readPermalink: (props: PermalinkProps) => Path,
): Doc =>
  createDoc({
    ...doc,
    outputPath: readPermalink(readPermalinkProps(doc)),
  });

/** Render permalinks on docs, using a closure to generate the permalink */
export const permalinkDocs = (
  docs: AwaitableIterable<Doc>,
  readPermalink: (props: PermalinkProps) => Path,
): AsyncGenerator<Doc> =>
  mapAsync(docs, (doc) => permalinkDoc(doc, readPermalink));
