import { type AwaitableIterable } from "./utils/generator.ts";
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
    <link>{{ doc.outputPath | prepend: site.url }}</link>
    <guid isPermaLink="true">{{ doc.outputPath | prepend: site.url }}</guid>
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

/** Generate an RSS doc from docs */
export const createRssDoc = async (docs: AwaitableIterable<Doc>, {
  outputPath,
  url,
  title,
  description = "",
  author = "",
  modified = Date.now(),
}: {
  outputPath: string;
  url: string;
  title: string;
  description?: string;
  author?: string;
  modified?: number;
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
 * Generate RSS doc from docs.
 * Combinator returns a generator function that consumes a docs generator
 * and yields a single doc representing the RSS feed.
 */
export const rss = ({
  outputPath,
  url,
  title,
  description = "",
  author = "",
  modified = Date.now(),
}: {
  outputPath: string;
  url: string;
  title: string;
  description?: string;
  author?: string;
  modified?: number;
}) =>
  async function* (docs: AwaitableIterable<Doc>) {
    yield await createRssDoc(docs, {
      outputPath,
      url,
      title,
      description,
      author,
      modified,
    });
  };
