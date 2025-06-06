import {
  findWikilinks,
  indexBacklinks,
  indexByWikilinkSlug,
  renderWikilinks,
  toWikilinkSlug,
  type Wikilink,
} from "./wikilinks.ts";
import { assertEquals } from "@std/assert";
import * as Doc from "./doc.ts";

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

  const result = toWikilinkSlug(input);

  assertEquals(result, expected);
});

Deno.test("indexByWikilinkSlug creates index mapping slugs to stubs", async () => {
  const docs = [
    Doc.create({ id: "path/to/My Page.md", content: "Content 1" }),
    Doc.create({ id: "another/Cool Article.txt", content: "Content 2" }),
    Doc.create({ id: "simple.md", content: "Content 3" }),
  ];

  const result = await indexByWikilinkSlug(docs);

  assertEquals(result.size, 3);
  assertEquals(result.get("my-page")?.id, "path/to/My Page.md");
  assertEquals(result.get("cool-article")?.id, "another/Cool Article.txt");
  assertEquals(result.get("simple")?.id, "simple.md");
});

Deno.test("indexByWikilinkSlug handles empty docs iterator", async () => {
  const docs: Doc.Doc[] = [];
  const result = await indexByWikilinkSlug(docs);

  assertEquals(result.size, 0);
});

Deno.test("indexBacklinks creates index mapping slugs to backlinks", async () => {
  const docs = [
    Doc.create({
      id: "page-one.md",
      content: "This links to [[page two]] and [[Page Three]]",
    }),
    Doc.create({ id: "page-two.md", content: "This links to [[page three]]" }),
    Doc.create({ id: "page-three.md", content: "No wikilinks here" }),
  ];

  const result = await indexBacklinks(docs);

  assertEquals(result.size, 2);
  assertEquals(result.get("page-two")?.length, 1);
  assertEquals(result.get("page-two")?.[0].id, "page-one.md");
  assertEquals(result.get("page-three")?.length, 2);
  assertEquals(result.get("page-three")?.[0].id, "page-one.md");
  assertEquals(result.get("page-three")?.[1].id, "page-two.md");
});

Deno.test("indexBacklinks handles docs with no wikilinks", async () => {
  const docs = [
    Doc.create({ id: "page1.md", content: "No wikilinks here" }),
    Doc.create({ id: "page2.md", content: "Also no wikilinks" }),
  ];

  const result = await indexBacklinks(docs);

  assertEquals(result.size, 0);
});

Deno.test("indexBacklinks handles empty docs iterator", async () => {
  const docs: Doc.Doc[] = [];
  const result = await indexBacklinks(docs);

  assertEquals(result.size, 0);
});

Deno.test("indexBacklinks handles wikilinks with pipe separators", async () => {
  const docs = [
    Doc.create({
      id: "page1.md",
      content: "Links to [[target-slug|Display Text]]",
    }),
    Doc.create({ id: "page2.md", content: "Also links to [[target-slug]]" }),
  ];

  const result = await indexBacklinks(docs);

  assertEquals(result.size, 1);
  assertEquals(result.get("target-slug")?.length, 2);
  assertEquals(result.get("target-slug")?.[0].id, "page1.md");
  assertEquals(result.get("target-slug")?.[1].id, "page2.md");
});
