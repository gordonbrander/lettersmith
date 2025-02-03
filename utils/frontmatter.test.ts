import { assertEquals, assertThrows } from "@std/assert";
import { parseFrontmatter } from "./frontmatter.ts";

Deno.test("parseFrontmatter throws error for empty frontmatter", () => {
  const content = "---\n---\nHello world";
  assertThrows(() => parseFrontmatter(content));
});

Deno.test("parseFrontmatter throws error for frontmatter that does not have an record at the top level", () => {
  const content = "---\nnull---\nHello world";
  assertThrows(() => parseFrontmatter(content));
});

Deno.test("parseFrontmatter throws error for frontmatter that does not have an record at the top level (2)", () => {
  const content = "---\n[1, 2, 3]---\nHello world";
  assertThrows(() => parseFrontmatter(content));
});

Deno.test("parseFrontmatter returns empty object for no frontmatter", () => {
  const content = "Hello world";
  const result = parseFrontmatter(content);

  assertEquals(result.frontmatter, {});
  assertEquals(result.content, "Hello world");
});

Deno.test("parseFrontmatter parses yaml frontmatter", () => {
  const content = `---
title: Hello
date: 2020-01-01
---
Content here`;

  const result = parseFrontmatter(content);

  assertEquals(result.frontmatter, {
    title: "Hello",
    date: new Date("2020-01-01T00:00:00.000Z"),
  });
  assertEquals(result.content, "Content here");
});

Deno.test("parseFrontmatter handles frontmatter in documents that end immediately after the block close", () => {
  const content = `---
title: "Hello"
---`;

  const result = parseFrontmatter(content);
  assertEquals(result.content, "");
});

Deno.test("parseFrontmatter throws for invalid yaml", () => {
  const content = `---
invalid: }
---
Content`;

  assertThrows(() => parseFrontmatter(content));
});
