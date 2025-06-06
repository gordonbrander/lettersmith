import { toSlug } from "./utils/slug.ts";
import { type AwaitableIterable, map, mapAsync } from "@gordonb/generator";
import { create as createDoc, type Doc } from "./doc.ts";

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

/** Find all wikilinks in a string, returning them as an array of `Wikilink` */
export const findWikilinks = (content: string): Wikilink[] =>
  Array.from(
    map(
      content.matchAll(WIKILINK_REGEXP),
      ([_, text]) => parseWikilinkBody(text),
    ),
  );

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
