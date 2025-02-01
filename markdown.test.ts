import { renderMarkdown, renderMarkdownDoc } from "./markdown.ts";
import { create as createDoc } from "./doc.ts";
import { assertEquals } from "@std/assert";

Deno.test("renderMarkdown converts basic markdown", () => {
  const input = "Hello **Markdown**!";
  const expected = "<p>Hello <strong>Markdown</strong>!</p>\n";
  const result = renderMarkdown(input);
  assertEquals(result, expected);
});

Deno.test("renderMarkdownDoc converts markdown content and sets extension", () => {
  const unrendered = createDoc({
    content: "Hello **Markdown**!",
    id: "test.txt",
  });

  const rendered = renderMarkdownDoc(unrendered);
  assertEquals(rendered.content, "<p>Hello <strong>Markdown</strong>!</p>\n");
  assertEquals(rendered.id, "test.txt");
  assertEquals(rendered.outputPath, "test.html");
});
