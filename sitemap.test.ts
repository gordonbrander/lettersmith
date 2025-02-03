import { createSitemapDoc } from "./sitemap.ts";
import { assert, assertEquals } from "@std/assert";
import { create as createDoc } from "./doc.ts";

Deno.test("createSitemapDoc creates sitemap", async () => {
  const docs = [
    createDoc({
      id: "test1",
      outputPath: "test1.html",
      content: "",
      created: 0,
      modified: 0,
    }),
    createDoc({
      id: "test2",
      outputPath: "test2.html",
      content: "",
      created: 0,
      modified: 0,
    }),
  ];

  const sitemap = await createSitemapDoc(docs, "https://example.com");

  assert(
    sitemap.content.startsWith(`<?xml version="1.0" encoding="UTF-8"?>`),
    "Template was compiled",
  );
  assertEquals(sitemap.outputPath, "sitemap.xml");
  assertEquals(sitemap.id, "sitemap.xml");
});
