import { writeFileDeep } from "./utils/io.ts";
import { isNone, type Option } from "./utils/option.ts";
import { join as joinPath } from "@std/path";
import { truncate280 } from "./utils/text.ts";
import {
  getAutoTemplateForPath,
  type Path,
  setExtension as setPathExtension,
} from "./utils/path.ts";
import { readTimestamp, type Timestamp } from "./utils/date.ts";
import { parseFrontmatter as parseFrontmatterInText } from "./utils/frontmatter.ts";
import { isSome } from "./utils/option.ts";
import { isDate, isString } from "./utils/check.ts";
import { stripTags } from "./utils/html.ts";
import { pipe } from "@gordonb/pipe";
import { isTags, type Tags } from "./utils/tags.ts";

export type Meta = Record<string, unknown>;

export type Doc = {
  id: Path;
  outputPath: Path;
  templatePath: Option<Path>;
  created: Timestamp;
  modified: Timestamp;
  title: string;
  summary: string;
  content: string;
  tags: Tags;
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
    tags = [],
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
    tags?: Tags;
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
  tags,
  meta,
});

/**
 * Read basic doc from path.
 * Assigns doc contents to `content` field and path to `id` and `outputPath`.
 */
export const read = async (path: Path): Promise<Doc> => {
  const content = await Deno.readTextFile(path);
  return create({
    id: path,
    outputPath: path,
    content,
  });
};

export type WriteReceipt = {
  id: Path;
  output: Path;
};

/**
 * Write a doc to its output path under a directory
 * @returns a WriteReceipt.
 */
export const write = async (
  doc: Doc,
  dir: Path,
): Promise<WriteReceipt> => {
  const writePath = joinPath(dir, doc.outputPath);
  await writeFileDeep(writePath, doc.content);
  return {
    id: doc.id,
    output: doc.outputPath,
  };
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
    outputPath: setPathExtension(doc.outputPath, ext),
  });

/**
 * Parse doc frontmatter, merging it into doc meta, with frontmatter fields winning.
 * @returns a doc, if parse was successful, throws an error, if not.
 */
export const parseFrontmatter = (doc: Doc): Doc => {
  const { frontmatter, content } = parseFrontmatterInText(doc.content);
  return create({
    ...doc,
    content,
    meta: { ...doc.meta, ...frontmatter },
  });
};

/**
 * Uplift metadata, looking for blessed fields and assigning their values to doc:
 * - title
 * - summary
 * - tags
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

  if (isString(doc.meta.created) || isDate(doc.meta.created)) {
    const date = readTimestamp(doc.meta.created);
    if (isSome(date)) {
      draft.created = date;
    }
  }

  if (isString(doc.meta.modified) || isDate(doc.meta.modified)) {
    const date = readTimestamp(doc.meta.modified);
    if (isSome(date)) {
      draft.modified = date;
    }
  }

  if (isTags(doc.meta.tags)) {
    draft.tags = doc.meta.tags;
  }

  if (isString(doc.meta.permalink)) {
    draft.outputPath = doc.meta.permalink;
  }

  if (isString(doc.meta.template)) {
    draft.templatePath = doc.meta.template;
  }

  return draft;
};
