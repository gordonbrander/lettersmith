import { type FilterImplOptions, Liquid } from "liquidjs";
import { create as createDoc, type Doc } from "./doc.ts";
import { type AwaitableIterable, mapAsync } from "@gordonb/generator";
import { isNone } from "@gordonb/result/option";
import type { Path } from "./utils/path.ts";
import { join as joinPath } from "@std/path";
import { exists } from "@std/fs";
import { isString } from "./utils/check.ts";

export type Filter = FilterImplOptions;

/** Implement filter for joining root URL to path */
const filterPermalink = (path: unknown, root: unknown): string => {
  // Don't permalink non-string values
  if (!isString(path) || !isString(root)) {
    return path as string;
  }
  return new URL(path, root).toString();
};

export type Context = Record<string, unknown>;

export type LiquidOptions = {
  context: Context;
  root: Path;
  filters: Record<string, Filter>;
};

/** Render a Liquid template */
export const renderLiquid = async (template: string, {
  context = {},
  root = "./templates",
  filters = {},
}: Partial<LiquidOptions> = {}): Promise<string> => {
  const engine = new Liquid({
    root,
  });
  engine.registerFilter("permalink", filterPermalink);
  for (const [name, filter] of Object.entries(filters)) {
    engine.registerFilter(name, filter);
  }
  return await engine.parseAndRender(template, context);
};

/** Render Liquid template on a doc */
export const renderLiquidDoc = async (
  doc: Doc,
  {
    context = {},
    root = "./templates",
    filters = {},
  }: Partial<LiquidOptions> = {},
): Promise<Doc> => {
  // Don't render if the doc doesn't have a template.
  if (isNone(doc.templatePath)) {
    return doc;
  }

  const fullTemplatePath = joinPath(root, doc.templatePath);
  const fullDefaultTemplatePath = joinPath(root, "default.html");

  // If template exists, use it, otherwise fall back to default.
  const chosenTemplate = await exists(fullTemplatePath)
    ? fullTemplatePath
    : fullDefaultTemplatePath;

  const templateString = await Deno.readTextFile(chosenTemplate);

  // First render any liquid in the doc's content field
  const renderedDocContent = await renderLiquid(doc.content, {
    root,
    filters,
    context: {
      ...context,
      ...doc,
      // Overwrite doc content to prevent recursion
      content: undefined,
    },
  });

  // Then render the template with the doc as context
  const renderedTemplateContent = await renderLiquid(templateString, {
    root,
    filters,
    context: {
      ...context,
      ...doc,
      // Overwrite doc content with rendered doc content
      content: renderedDocContent,
    },
  });

  return createDoc({
    ...doc,
    content: renderedTemplateContent,
  });
};

/** Render Liquid template on docs */
export const renderLiquidDocs = ({
  context = {},
  root = "./templates",
  filters = {},
}: Partial<LiquidOptions> = {}) =>
(
  docs: AwaitableIterable<Doc>,
): AsyncGenerator<Doc> =>
  mapAsync(docs, (doc) => renderLiquidDoc(doc, { context, root, filters }));
