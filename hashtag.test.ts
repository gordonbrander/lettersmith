import { findHashtags, toHashtag, toTag, uniqueTags } from "./hashtag.ts";
import { assert, assertEquals } from "@std/assert";

Deno.test("findHashtags extracts hashtags from text", () => {
  const text = "Hello #world this is a #test";
  const tags = Array.from(findHashtags(text));
  assertEquals(tags, ["world", "test"]);
});

Deno.test("findHashtags handles no hashtags", () => {
  const text = "Text with no hashtags";
  const tags = Array.from(findHashtags(text));
  assertEquals(tags, []);
});

Deno.test("toTag normalizes text to hashtag-compatable string", () => {
  assertEquals(toTag("Hello World!"), "hello_world");
  assertEquals(toTag("Test-Case"), "test_case");
  assertEquals(toTag("multiple   spaces"), "multiple_spaces");
});

Deno.test("toHashtag adds # prefix", () => {
  assertEquals(toHashtag("hello world"), "#hello_world");
  assertEquals(toHashtag("Test-Case"), "#test_case");
});

Deno.test("tags processes array of strings into a set of tags", () => {
  const t = uniqueTags([
    "Hello World",
    "Test Case",
    "Another-One",
    "another one",
  ]);
  assertEquals(t.size, 3);
  assert(t.has("hello_world"));
  assert(t.has("test_case"));
  assert(t.has("another_one"));
});
