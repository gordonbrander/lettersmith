import { renderMarkdown } from "./markdown.ts";
import { assertEquals } from "@std/assert";

Deno.test("renderMarkdown converts basic markdown", () => {
  const input = "Hello **Markdown**!";
  const expected = "<p>Hello <strong>Markdown</strong>!</p>\n";
  const result = renderMarkdown(input);
  assertEquals(result, expected);
});
