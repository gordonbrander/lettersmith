import { Liquid } from "liquidjs";
import { create as createDoc, type Doc } from "./doc.ts";
import { mapAsync } from "./generator.ts";
import { isNone } from "./option.ts";
import type { AwaitableIterable } from "./generator.ts";

export type Context = Record<string, unknown>;

/** Render a Liquid template */
export const renderLiquid = async (
  template: string,
  context: Context,
): Promise<string> => {
  const engine = new Liquid();
  const parsed = engine.parse(template);
  const rendered = await engine.render(parsed, context);
  return rendered;
};

/** Render Liquid template on a doc */
export const renderLiquidDoc = async (
  doc: Doc,
  context: Context,
): Promise<Doc> => {
  // Don't render if the doc doesn't have a template.
  if (isNone(doc.templatePath)) {
    return doc;
  }
  const templateString = await Deno.readTextFile(doc.templatePath);
  const content = await renderLiquid(templateString, context);
  return createDoc({
    ...doc,
    content,
  });
};

/** Render Liquid template on docs */
export const renderLiquidDocs = (context: Context) =>
(
  docs: AwaitableIterable<Doc>,
): AsyncGenerator<Doc> =>
  mapAsync(docs, (doc) => renderLiquidDoc(doc, context));
