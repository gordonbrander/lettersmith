import { HtmlRenderer, Parser } from "commonmark";
import { type AwaitableIterable, mapAsync } from "./utils/generator.ts";
import { create as createDoc, type Doc } from "./doc.ts";
import { setExtension } from "./utils/path.ts";

export const renderMarkdown = (markdown: string): string => {
  const parser = new Parser();
  const renderer = new HtmlRenderer();
  const parsed = parser.parse(markdown) as Parser;
  const rendered = renderer.render(parsed) as string;
  return rendered;
};

export const renderMarkdownDoc = (
  doc: Doc,
): Doc =>
  createDoc({
    ...doc,
    content: renderMarkdown(doc.content),
    outputPath: setExtension(doc.outputPath, ".html"),
  });

export const renderMarkdownDocs = (
  docs: AwaitableIterable<Doc>,
): AsyncGenerator<Doc> => mapAsync(docs, renderMarkdownDoc);
