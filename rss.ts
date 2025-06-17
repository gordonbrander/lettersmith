import type { AwaitableIterable } from "@gordonb/generator";
import { create as createDoc, type Doc } from "./doc.ts";
import { renderLiquid } from "./liquid.ts";
import { recent } from "./docs.ts";

const GENERATOR = "https://github.com/gordonbrander/lettersmith";

const RSS_TEMPLATE = `
<rss version="2.0">
<channel>
  <title>{{ site.title | xml_escape }}</title>
  <link>{{ site.url }}</link>
  <description>{{ site.description | xml_escape }}</description>
  <generator>{{ site.generator }}</generator>
  <lastBuildDate>
    {{ site.modified | date_to_rfc822 }}
  </lastBuildDate>
  {% for doc in recent %}
  <item>
    <title>{{ doc.title }}</title>
    <link>{{ doc.outputPath | permalink: site.url }}</link>
    <guid isPermaLink="true">{{ doc.outputPath | permalink: site.url }}</guid>
    <description>{{ doc.content | xml_escape }}</description>
    <content:encoded><![CDATA[
      {{ doc.content }}
    ]]></content:encoded>
    <pubDate>{{ doc.created | date_to_rfc822 }}</pubDate>
    {% if doc.meta.author %}
      <author>{{ doc.meta.author | escape }}</author>
    {% elsif site.author %}
      <author>{{ site.author | escape }}</author>
    {% endif %}
    {% for tag in doc.tags %}
      <category>{{ tag | xml_escape }}</category>
    {% endfor %}
  </item>
  {% endfor %}
</channel>
</rss>
`;

/**
 * Generate an RSS doc from docs
 * Consumes `docs` and generates an RSS doc from them.
 * Note: this function collects all docs into memory.
 * @returns a promise for the RSS doc
 */
export const createRssDoc = async (docs: AwaitableIterable<Doc>, {
  outputPath,
  url,
  title,
  description = "",
  author = "",
  modified = new Date(),
}: {
  outputPath: string;
  url: string;
  title: string;
  description?: string;
  author?: string;
  modified?: Date;
}): Promise<Doc> => {
  const recentDocs = await Array.fromAsync(recent(docs, 24));

  const content = await renderLiquid(RSS_TEMPLATE, {
    context: {
      site: {
        url,
        title,
        description,
        author,
        modified,
        generator: GENERATOR,
      },
      recent: recentDocs,
    },
  });

  return createDoc({
    id: outputPath,
    outputPath,
    created: modified,
    modified,
    title,
    summary: description,
    content,
  });
};

/**
 * Generate an async iterable containing an RSS doc.
 * Combinator returns a generator function that consumes a docs generator
 * and yields a single doc representing the RSS feed.
 * Note: this function collects all docs into memory.
 * @returns a promise for the RSS doc
 */
export const rss = ({
  outputPath,
  url,
  title,
  description = "",
  author = "",
  modified = new Date(),
}: {
  outputPath: string;
  url: string;
  title: string;
  description?: string;
  author?: string;
  modified?: Date;
}) =>
  async function* (docs: AwaitableIterable<Doc>): AsyncGenerator<Doc> {
    yield await createRssDoc(docs, {
      outputPath,
      url,
      title,
      description,
      author,
      modified,
    });
  };
