import { toSlug } from "./utils/slug.ts";
import { type AwaitableIterable, map, mapAsync } from "@gordonb/generator";
import { groupsAsync, indexByAsync } from "./utils/generator-extra.ts";
import { create as createDoc, type Doc } from "./doc.ts";
import { stem } from "./utils/path.ts";
import * as Stub from "./stub.ts";

const WIKILINK_REGEXP = /\[\[([^\]]+)\]\]/g;

export type Wikilink = {
  slug: string;
  text: string;
};

const parseWikilinkBody = (body: string): Wikilink => {
  const parts = body.split("|");
  // No pipe
  if (parts.length === 1) {
    const slug = toSlug(body);
    return { slug, text: body };
  }
  return { slug: toSlug(parts[0]), text: parts[1] };
};

/** Render wikilinks in a markup string */
export const renderWikilinks = (
  markup: string,
  replace: (wikilink: Wikilink) => string,
): string =>
  markup.replace(WIKILINK_REGEXP, (_, text) => {
    return replace(parseWikilinkBody(text));
  });

/** Render wikilinks in doc content */
export const renderWikilinkDoc = (
  doc: Doc,
  replace: (wikilink: Wikilink) => string,
): Doc =>
  createDoc({
    ...doc,
    content: renderWikilinks(doc.content, replace),
  });

/** Render wikilinks for an iterator of docs. */
export const renderWikilinkDocs = (
  replace: (wikilink: Wikilink) => string,
) =>
(
  docs: AwaitableIterable<Doc>,
): AsyncGenerator<Doc> =>
  mapAsync(docs, (doc: Doc) => renderWikilinkDoc(doc, replace));

/** Find all wikilinks in a string, returning them as an array of `Wikilink` */
export const findWikilinks = (content: string): Wikilink[] =>
  Array.from(
    map(
      content.matchAll(WIKILINK_REGEXP),
      ([_, text]) => parseWikilinkBody(text),
    ),
  );

/** Find wikilinks in content and set them on the `meta.wikilinks` property */
export const upliftWikilinksMeta = (doc: Doc): Doc =>
  createDoc({
    ...doc,
    meta: {
      ...doc.meta,
      wikilinks: findWikilinks(doc.content),
    },
  });

/**
 * Finds wikilinks in the content and assigns them to the `meta.wikilinks` property
 * Returns an async generator of docs with the `meta.wikilinks` property set.
 */
export const upliftWikilinksMetaDocs = (
  docs: AwaitableIterable<Doc>,
): AsyncGenerator<Doc> => mapAsync(docs, upliftWikilinksMeta);

/**
 * Generate a wikilink slug for a path.
 * Sluggifies the basename of the path (without the extension).
 */
export const pathToWikilinkSlug = (path: string): string => toSlug(stem(path));

/** A link from head to to tail */
export type Edge = {
  head: Stub.Stub;
  tail: Stub.Stub;
};

/** Generate edges from a document's wikilinks to that document */
function* _expandEdges(
  index: Map<string, Stub.Stub>,
): Generator<Edge> {
  for (const tail of index.values()) {
    const metaWikilinks = (tail.meta.wikilinks as Wikilink[] | undefined) ?? [];
    for (const wikilink of metaWikilinks) {
      const head = index.get(wikilink.slug);
      if (head) {
        yield { head: head, tail };
      }
    }
  }
}

export type WikilinkIndexes = {
  slug: Map<string, Stub.Stub>;
  links: Map<string, Stub.Stub[]>;
  backlinks: Map<string, Stub.Stub[]>;
};

/**
 * Generate wikilink indexes from a collection of documents
 * Consumes docs iterable, returning an object containing the slug index, link
 * index, and backlink index.
 * - `slug`: A map of wikilink slug to stubs
 * - `links`: A map of stub id to array of stubs that link to it
 * - `backlinks`: A map of stub id to array of stubs that link from it
 * Stubs also have an additional meta field `meta.wikilinks` containing an array
 * of wikilinks that the stub links to.
 */
export const generateWikilinkIndexes = async (
  docs: AwaitableIterable<Doc>,
): Promise<WikilinkIndexes> => {
  const docsWithUpliftedWikilinks = upliftWikilinksMetaDocs(docs);
  const stubs = mapAsync(docsWithUpliftedWikilinks, Stub.fromDoc);
  const slug = await indexByAsync(
    mapAsync(stubs, (stub) => [pathToWikilinkSlug(stub.id), stub]),
  );
  const edges = Array.from(_expandEdges(slug));
  const links = await groupsAsync(
    mapAsync(edges, (edge) => [edge.tail.id, edge.head]),
  );
  const backlinks = await groupsAsync(
    mapAsync(edges, (edge) => [edge.head.id, edge.tail]),
  );
  return { slug, links, backlinks };
};
