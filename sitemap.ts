import { create as createDoc, type Doc } from "./doc.ts";
import { type AwaitableIterable, takeAsync } from "@gordonb/generator";
import { renderLiquid } from "./liquid.ts";

const SITEMAP_TEMPLATE = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  {% for doc in sitemap %}<url><loc>{{ doc.outputPath | permalink: site.url }}</loc><lastmod>{{ doc.modified | date: "%Y-%m-%dT%H:%M" }}</lastmod></url>{% endfor %}
</urlset>`;

/**
 * Generate a sitemap doc from docs
 * Consumes `docs` and generates a sitemap doc from them.
 * Note: this function collects all docs into memory.
 * @returns a promise for the sitemap doc
 */
export const createSitemapDoc = async (
  docs: AwaitableIterable<Doc>,
  url: string,
): Promise<Doc> => {
  const outputPath = "sitemap.xml";
  const created = Date.now();
  const docs50k = await Array.fromAsync(takeAsync(docs, 50000));

  const content = await renderLiquid(SITEMAP_TEMPLATE, {
    context: {
      sitemap: docs50k,
      site: {
        url,
      },
    },
  });

  return createDoc({
    id: outputPath,
    outputPath,
    created,
    modified: created,
    content,
  });
};

/**
 * Generate an async iterable containing a sitemap doc.
 * Combinator returns a generator function that consumes a docs generator
 * and yields a single doc representing the sitemap.
 * Note: this function collects all docs into memory.
 * @returns a promise for the RSS doc
 */
export const sitemap = (url: string) =>
  async function* (docs: AwaitableIterable<Doc>): AsyncGenerator<Doc> {
    yield await createSitemapDoc(docs, url);
  };
