import { toSlug } from "./utils/slug.ts";
import { type AwaitableIterable, mapAsync } from "@gordonb/generator";
import { create as createDoc, type Doc } from "./doc.ts";

const WIKILINK_REGEXP = /\[\[([^\]]+)\]\]/g;

export type Wikilink = {
  slug: string;
  text: string;
};

/** Render wikilinks in a markup string */
export const renderWikilinks = (
  markup: string,
  replace: (wikilink: Wikilink) => string,
): string =>
  markup.replace(WIKILINK_REGEXP, (_, text) => {
    const parts = text.split("|");
    // No pipe
    if (parts.length === 1) {
      const slug = toSlug(text);
      return replace({ slug, text });
    }
    return replace({ slug: toSlug(parts[0]), text: parts[1] });
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
