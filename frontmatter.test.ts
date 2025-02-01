import { assert, assertEquals } from "@std/assert";
import { parseFrontmatter } from "./frontmatter.ts";
import { isOk } from "./result.ts";

Deno.test("parseFrontmatter returns empty object for empty frontmatter", () => {
  const content = "---\n---\nHello world";
  const result = parseFrontmatter(content);

  assert(isOk(result));
  assertEquals(result.ok.frontmatter, null);
  assertEquals(result.ok.content, "Hello world");
});

Deno.test("parseFrontmatter returns empty object for no frontmatter", () => {
  const content = "Hello world";
  const result = parseFrontmatter(content);

  assert(isOk(result));
  assertEquals(result.ok.frontmatter, {});
  assertEquals(result.ok.content, "Hello world");
});

Deno.test("parseFrontmatter parses yaml frontmatter", () => {
  const content = `---
title: Hello
date: 2020-01-01
---
Content here`;

  const result = parseFrontmatter(content);

  assert(isOk(result));

  assertEquals(result.ok.frontmatter, {
    title: "Hello",
    date: new Date("2020-01-01T00:00:00.000Z"),
  });
  assertEquals(result.ok.content, "Content here");
});

Deno.test("parseFrontmatter handles frontmatter in documents that end immediately after the block close", () => {
  const content = `---
---`;

  const result = parseFrontmatter(content);
  assert(isOk(result));
  assertEquals(result.ok.content, "");
});

Deno.test("parseFrontmatter handles invalid yaml", () => {
  const content = `---
invalid: }
---
Content`;

  const result = parseFrontmatter(content);
  assert(!isOk(result));
});
