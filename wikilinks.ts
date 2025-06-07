import { toSlug } from "./utils/slug.ts";
import { type AwaitableIterable, map, mapAsync } from "@gordonb/generator";
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

/**
 * Generate a wikilink slug for a path.
 * Sluggifies the basename of the path (without the extension).
 */
export const toWikilinkSlug = (path: string): string => toSlug(stem(path));

/**
 * Compile an index of docs by wikilink slug.
 * This can be useful for generating links when expanding wikilinks with `renderWikilinks`.
 */
export const indexByWikilinkSlug = async (
  docs: AwaitableIterable<Doc>,
): Promise<Map<string, Stub.Stub>> => {
  const index = new Map<string, Stub.Stub>();
  for await (const doc of docs) {
    const slug = toWikilinkSlug(doc.id);
    index.set(slug, Stub.fromDoc(doc));
  }
  return index;
};

/**
 * Compile an index that maps wikilink slugs to backlinks.
 */
export const indexBacklinks = async (
  docs: AwaitableIterable<Doc>,
): Promise<Map<string, Stub.Stub[]>> => {
  const index = new Map<string, Stub.Stub[]>();
  for await (const doc of docs) {
    const wikilinks = findWikilinks(doc.content);
    for (const wikilink of wikilinks) {
      const backlinks = index.get(wikilink.slug);
      if (backlinks) {
        backlinks.push(Stub.fromDoc(doc));
      } else {
        index.set(wikilink.slug, [Stub.fromDoc(doc)]);
      }
    }
  }
  return index;
};
