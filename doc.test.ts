import { assert, assertEquals } from "@std/assert";
import {
  autoSummary,
  autoTemplate,
  autoTitle,
  copy,
  create,
  setExtension,
  setSummaryIfEmpty,
  setTitleIfEmpty,
  upliftMeta,
} from "./doc.ts";

Deno.test("Doc create() with minimal args", () => {
  const doc = create({ id: "test.md" });
  assertEquals(doc.id, "test.md");
  assertEquals(doc.outputPath, "test.md");
  assertEquals(doc.templatePath, undefined);
  assertEquals(doc.title, "");
  assertEquals(doc.summary, "");
  assertEquals(doc.content, "");
  assertEquals(doc.meta, {});
});

Deno.test("Doc create() with all args", () => {
  const created = Date.now();
  const modified = Date.now();
  const doc = create({
    id: "test.md",
    outputPath: "test.html",
    templatePath: "template.html",
    created,
    modified,
    title: "Test",
    summary: "A test doc",
    content: "Test content",
    meta: { foo: "bar" },
  });

  assertEquals(doc.id, "test.md");
  assertEquals(doc.outputPath, "test.html");
  assertEquals(doc.templatePath, "template.html");
  assertEquals(doc.created, created);
  assertEquals(doc.modified, modified);
  assertEquals(doc.title, "Test");
  assertEquals(doc.summary, "A test doc");
  assertEquals(doc.content, "Test content");
  assertEquals(doc.meta, { foo: "bar" });
});

Deno.test("copy() copies the doc", () => {
  const doc = create({
    id: "test.md",
    title: "Test",
  });

  const copied = copy(doc);
  assertEquals(copied.id, doc.id);
  assertEquals(copied.title, doc.title);
  assert(copied !== doc);
});

Deno.test("setTitleIfEmpty() sets the title only if empty", () => {
  const emptyDoc = create({ id: "test.md" });
  const withTitle = create({
    id: "test.md",
    title: "Existing",
  });

  const updated1 = setTitleIfEmpty(emptyDoc, "New Title");
  const updated2 = setTitleIfEmpty(withTitle, "New Title");

  assertEquals(updated1.title, "New Title");
  assertEquals(updated2.title, "Existing");
});

Deno.test("Doc autoTitle()", () => {
  const doc = create({ id: "test.md" });
  const titled = autoTitle(doc);
  assertEquals(titled.title, "test");
});

Deno.test("setSummaryIfEmpty() sets the summary only if empty", () => {
  const emptyDoc = create({ id: "test.md" });
  const withSummary = create({
    id: "test.md",
    summary: "Existing",
  });

  const updated1 = setSummaryIfEmpty(emptyDoc, "New Summary");
  const updated2 = setSummaryIfEmpty(withSummary, "New Summary");

  assertEquals(updated1.summary, "New Summary");
  assertEquals(updated2.summary, "Existing");
});

Deno.test("Doc autoSummary()", () => {
  const doc = create({
    id: "test.md",
    content: "Lorem ipsum dolor sit amet",
  });

  const withSummary = autoSummary(doc);
  assertEquals(withSummary.summary, doc.content);
});

Deno.test("Doc autoTemplate()", () => {
  const doc = create({ id: "section/music/test.md" });
  const templated = autoTemplate(doc);
  assertEquals(templated.templatePath, "section/music.html");
});

Deno.test("Doc setExtension()", () => {
  const doc = create({ id: "test.md" });
  const updated = setExtension(doc, ".html");
  assertEquals(updated.outputPath, "test.html");
});

Deno.test("Doc upliftMeta()", () => {
  const doc = create({
    id: "test.md",
    meta: {
      title: "Meta Title",
      summary: "Meta Summary",
      created: "2023-01-01",
      modified: "2023-01-02",
      permalink: "custom/path.html",
      template: "custom.html",
    },
  });

  const uplifted = upliftMeta(doc);

  assertEquals(uplifted.title, "Meta Title");
  assertEquals(uplifted.summary, "Meta Summary");
  assertEquals(
    new Date(uplifted.created).toISOString().slice(0, 10),
    "2023-01-01",
  );
  assertEquals(
    new Date(uplifted.modified).toISOString().slice(0, 10),
    "2023-01-02",
  );
  assertEquals(uplifted.outputPath, "custom/path.html");
  assertEquals(uplifted.templatePath, "custom.html");
});
