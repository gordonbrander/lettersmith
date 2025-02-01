import { HtmlRenderer, Parser } from "commonmark";

const parser = new Parser();
const renderer = new HtmlRenderer();

export const renderMarkdown = (markdown: string): string => {
  const parsed = parser.parse(markdown) as Parser;
  const rendered = renderer.render(parsed) as string;
  return rendered;
};
