import { createSitemapDoc } from "./sitemap.ts";
import { assertEquals } from "@std/assert";
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

  const expected = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.com/test1.html</loc><lastmod>1969-12-31T19:00</lastmod></url><url><loc>https://example.com/test2.html</loc><lastmod>1969-12-31T19:00</lastmod></url>
</urlset>`;

  assertEquals(sitemap.content, expected);
  assertEquals(sitemap.outputPath, "sitemap.xml");
  assertEquals(sitemap.id, "sitemap.xml");
});
