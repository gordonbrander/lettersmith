import {
  findWikilinks,
  generateWikilinkIndexes,
  pathToWikilinkSlug,
  renderWikilinks,
  type Wikilink,
} from "./wikilinks.ts";
import { assertEquals } from "@std/assert";
import { create as createDoc } from "./doc.ts";

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

Deno.test("findWikilinks finds single wikilink", () => {
  const input = "Check out this [[Page]]";
  const expected = [{ slug: "page", text: "Page" }];

  const result = findWikilinks(input);

  assertEquals(result, expected);
});

Deno.test("findWikilinks finds wikilink with pipe separator", () => {
  const input = "Check out this [[actual-page|Display Text]]";
  const expected = [{ slug: "actual-page", text: "Display Text" }];

  const result = findWikilinks(input);

  assertEquals(result, expected);
});

Deno.test("findWikilinks finds multiple wikilinks", () => {
  const input = "Check [[Page One]] and also [[Page Two]]";
  const expected = [
    { slug: "page-one", text: "Page One" },
    { slug: "page-two", text: "Page Two" },
  ];

  const result = findWikilinks(input);

  assertEquals(result, expected);
});

Deno.test("findWikilinks finds wikilinks with surrounding text", () => {
  const input = "This is some text before [[Page]] and some text after.";
  const expected = [{ slug: "page", text: "Page" }];

  const result = findWikilinks(input);

  assertEquals(result, expected);
});

Deno.test("findWikilinks returns empty array when no wikilinks", () => {
  const input = "This text has no wikilinks.";
  const expected: Wikilink[] = [];

  const result = findWikilinks(input);

  assertEquals(result, expected);
});

Deno.test("findWikilinks handles mixed wikilinks with and without pipes", () => {
  const input = "See [[Page One]] and [[page-two|Page Two Display]]";
  const expected = [
    { slug: "page-one", text: "Page One" },
    { slug: "page-two", text: "Page Two Display" },
  ];

  const result = findWikilinks(input);

  assertEquals(result, expected);
});

Deno.test("toWikilinkSlug generates slug from file path", () => {
  const input = "path/to/My Page.md";
  const expected = "my-page";

  const result = pathToWikilinkSlug(input);

  assertEquals(result, expected);
});

Deno.test("generateWikilinkIndexes generates correct indexes", async () => {
  const docs = [
    createDoc({
      id: "page-one.md",
      content: "This links to [[Page Two]] and [[Page Three]]",
    }),
    createDoc({
      id: "page-two.md",
      content: "This links back to [[Page One]]",
    }),
    createDoc({
      id: "page-three.md",
      content: "No wikilinks here",
    }),
  ];

  const { slug, links, backlinks } = await generateWikilinkIndexes(docs);

  // Test slug index
  assertEquals(slug.has("page-one"), true);
  assertEquals(slug.has("page-two"), true);
  assertEquals(slug.has("page-three"), true);
  assertEquals(slug.get("page-one")?.id, "page-one.md");

  // Test links index (documents that are linked TO)
  assertEquals(links.has("page-two.md"), true);
  assertEquals(links.has("page-three.md"), false);
  assertEquals(links.has("page-one.md"), true);
  assertEquals(links.get("page-two.md")?.length, 1);

  // Test backlinks index (documents that link FROM)
  assertEquals(backlinks.has("page-one.md"), true);
  assertEquals(backlinks.has("page-two.md"), true);
  assertEquals(backlinks.get("page-one.md")?.length, 1);
  assertEquals(backlinks.get("page-two.md")?.length, 1);
});
