import { Liquid } from "liquidjs";
import { create as createDoc, type Doc } from "./doc.ts";
import { mapAsync } from "./utils/generator.ts";
import { isNone } from "./utils/option.ts";
import type { AwaitableIterable } from "./utils/generator.ts";
import type { Path } from "./utils/path.ts";
import { join as joinPath } from "@std/path";
import { exists } from "@std/fs";
import { isString } from "./utils/check.ts";

/** Implement filter for joining root URL to path */
const filterPermalink = (path: unknown, root: unknown) => {
  // Don't permalink non-string values
  if (!isString(path) || !isString(root)) {
    return path;
  }
  return new URL(path, root).toString();
};

export type Context = Record<string, unknown>;

export type LiquidOptions = {
  context: Context;
  root: Path;
};

/** Render a Liquid template */
export const renderLiquid = async (template: string, {
  context = {},
  root = "./templates",
}: Partial<LiquidOptions> = {}): Promise<string> => {
  const engine = new Liquid({
    root,
  });
  engine.registerFilter("permalink", filterPermalink);
  return await engine.parseAndRender(template, context);
};

/** Render Liquid template on a doc */
export const renderLiquidDoc = async (
  doc: Doc,
  {
    context = {},
    root = "./templates",
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
  const content = await renderLiquid(templateString, {
    root,
    context: {
      ...context,
      self: doc,
    },
  });

  return createDoc({
    ...doc,
    content,
  });
};

/** Render Liquid template on docs */
export const renderLiquidDocs = ({
  context = {},
  root = "./templates",
}: Partial<LiquidOptions> = {}) =>
(
  docs: AwaitableIterable<Doc>,
): AsyncGenerator<Doc> =>
  mapAsync(docs, (doc) => renderLiquidDoc(doc, { context, root }));
