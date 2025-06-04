import { renderWikilinks } from "./wikilinks.ts";
import { assertEquals } from "@std/assert";

Deno.test("renderWikilinks does wikilink replacement", () => {
  const input = "Check out this [[Page]]";
  const expected = 'Check out this <a href="page">Page</a>';

  const result = renderWikilinks(input, (wikilink) => {
    return `<a href="${wikilink.slug}">${wikilink.text}</a>`;
  });

  assertEquals(result, expected);
});

Deno.test("renderWikilinks correctly renders wikilink with pipe separator", () => {
  const input = "Check out this [[actual-page|Display Text]]";
  const expected = 'Check out this <a href="actual-page">Display Text</a>';

  const result = renderWikilinks(input, (wikilink) => {
    return `<a href="${wikilink.slug}">${wikilink.text}</a>`;
  });

  assertEquals(result, expected);
});

Deno.test("renderWikilinks renders multiple wikilinks", () => {
  const input = "Check [[Page One]] and also [[Page Two]]";
  const expected =
    'Check <a href="page-one">Page One</a> and also <a href="page-two">Page Two</a>';

  const result = renderWikilinks(input, (wikilink) => {
    return `<a href="${wikilink.slug}">${wikilink.text}</a>`;
  });

  assertEquals(result, expected);
});

Deno.test("renderWikilinks - with surrounding text", () => {
  const input = "This is some text before [[Page]] and some text after.";
  const expected =
    'This is some text before <a href="page">Page</a> and some text after.';

  const result = renderWikilinks(input, (wikilink) => {
    return `<a href="${wikilink.slug}">${wikilink.text}</a>`;
  });

  assertEquals(result, expected);
});

Deno.test("renderWikilinks is ok handling no wikilinks", () => {
  const input = "This text has no wikilinks.";
  const expected = "This text has no wikilinks.";

  const result = renderWikilinks(input, (wikilink) => {
    return `<a href="${wikilink.slug}">${wikilink.text}</a>`;
  });

  assertEquals(result, expected);
});
