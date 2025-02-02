import { assertEquals } from "@std/assert";
import { stripTags } from "./html.ts";

Deno.test("stripTags removes HTML tags", () => {
  const input = "<p>Hello <strong>world</strong></p>";
  const expected = "Hello world";
  assertEquals(stripTags(input), expected);
});

Deno.test("stripTags handles nested tags", () => {
  const input = "<div><p><span>Test</span></p></div>";
  const expected = "Test";
  assertEquals(stripTags(input), expected);
});

Deno.test("stripTags handles self-closing tags", () => {
  const input = "Line 1<br/>Line 2<img src='test.jpg'/>";
  const expected = "Line 1Line 2";
  assertEquals(stripTags(input), expected);
});

Deno.test("stripTags returns empty string for tags-only input", () => {
  const input = "<div></div><span></span>";
  const expected = "";
  assertEquals(stripTags(input), expected);
});

Deno.test("stripTags returns original string if no tags", () => {
  const input = "Plain text without tags";
  const expected = "Plain text without tags";
  assertEquals(stripTags(input), expected);
});
