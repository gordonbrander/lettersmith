import { writeFileDeep } from "./io.ts";
import type { Json } from "./json.ts";
import { isNone, type Option } from "./option.ts";
import { performAsync, Result } from "./result.ts";
import { join as joinPath } from "@std/path";
import { truncate280 } from "./text.ts";
import { getAutoTemplateForPath, Path, replaceExtension } from "./path.ts";
import { parseTimestamp, type Timestamp } from "./date.ts";
import { isSome } from "./option.ts";
import { isString } from "./check.ts";
import { stripTags } from "./html.ts";
import { pipe } from "./pipe.ts";

export type Meta = Record<string, Json>;

export type Doc = {
  id: Path;
  outputPath: Path;
  templatePath: Option<Path>;
  created: Timestamp;
  modified: Timestamp;
  title: string;
  summary: string;
  content: string;
  meta: Meta;
};

/** Create a new Doc */
export const create = (
  {
    id,
    outputPath = id,
    templatePath = null,
    created = Date.now(),
    modified = Date.now(),
    title = "",
    summary = "",
    content = "",
    meta = {},
  }: {
    id: Path;
    outputPath?: Path;
    templatePath?: Option<Path>;
    created?: Timestamp;
    modified?: Timestamp;
    title?: string;
    summary?: string;
    content?: string;
    meta?: Meta;
  },
): Doc => ({
  id,
  outputPath,
  templatePath,
  created,
  modified,
  title,
  summary,
  content,
  meta,
});

/**
 * Read basic doc from path.
 * Assigns doc contents to `content` field and path to `id` and `outputPath`.
 */
export const read = async (path: Path) => {
  return await performAsync<Doc, Error>(async () => {
    const content = await Deno.readTextFile(path);
    return create({
      id: path,
      outputPath: path,
      content,
    });
  });
};

/** Write a doc to its output path under a directory */
export const write = async (
  dir: Path,
  doc: Doc,
): Promise<Result<null, Error>> => {
  const writePath = joinPath(dir, doc.outputPath);
  return await writeFileDeep(writePath, doc.content);
};

/** Create a deep copy of doc */
export const copy = (doc: Doc): Doc => structuredClone(doc);

/** Set doc summary, but only if it hasn't been set already */
export const setTitleIfEmpty = (doc: Doc, title: string): Doc => {
  if (doc.title !== "") return doc;
  return create({
    ...doc,
    title,
  });
};

/** Set doc summary if doc doesn't already have a summary. */
export const setSummaryIfEmpty = (doc: Doc, summary: string): Doc => {
  if (doc.summary !== "") return doc;
  return create({
    ...doc,
    summary,
  });
};

/** Generate a summary by truncating the content, doc if it doesn't already have a summary. */
export const autoSummary = (doc: Doc): Doc =>
  setSummaryIfEmpty(doc, pipe(doc.content, stripTags, truncate280));

/** Set the template for doc, based on id */
export const autoTemplate = (
  doc: Doc,
): Doc => {
  if (!isNone(doc.templatePath)) return doc;
  return create({
    ...doc,
    templatePath: getAutoTemplateForPath(doc.id),
  });
};

/** Set the extension of the output path */
export const setExtension = (
  doc: Doc,
  ext: string,
): Doc =>
  create({
    ...doc,
    outputPath: replaceExtension(doc.outputPath, ext),
  });

/** Uplift metadata, looking for blessed fields and assigning values to doc:
 * - title
 * - summary
 * - created
 * - modified
 * - permalink
 * - template
 */
export const upliftMeta = (doc: Doc): Doc => {
  const draft = copy(doc);

  if (isString(doc.meta.title)) {
    draft.title = doc.meta.title;
  }

  if (isString(doc.meta.summary)) {
    draft.summary = doc.meta.summary;
  }

  if (isString(doc.meta.created)) {
    const date = parseTimestamp(doc.meta.created);
    if (isSome(date)) {
      draft.created = date;
    }
  }

  if (isString(doc.meta.modified)) {
    const date = parseTimestamp(doc.meta.modified);
    if (isSome(date)) {
      draft.modified = date;
    }
  }

  if (isString(doc.meta.permalink)) {
    draft.outputPath = doc.meta.permalink;
  }

  if (isString(doc.meta.template)) {
    draft.templatePath = doc.meta.template;
  }

  return draft;
};
