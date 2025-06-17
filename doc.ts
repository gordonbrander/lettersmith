import { writeFileDeep } from "./utils/io.ts";
import { isNone, isSome, type Option } from "@gordonb/result/option";
import { join as joinPath } from "@std/path";
import { truncate280 } from "./utils/text.ts";
import {
  getAutoTemplateForPath,
  type Path,
  setExtension as setPathExtension,
  stem,
} from "./utils/path.ts";
import { parseFrontmatter as parseFrontmatterInText } from "./utils/frontmatter.ts";
import { isString } from "./utils/check.ts";
import { stripTags } from "./utils/html.ts";
import { pipe } from "@gordonb/pipe";
import { isTags, type Tags } from "./utils/tags.ts";
import { parseDatelike } from "./utils/date.ts";

export type Meta = Record<string, unknown>;

export type Doc = {
  id: Path;
  outputPath: Path;
  templatePath: Option<Path>;
  created: Date;
  modified: Date;
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
    templatePath = undefined,
    created = new Date(),
    modified = new Date(),
    title = "",
    summary = "",
    content = "",
    tags = [],
    meta = {},
  }: {
    id: Path;
    outputPath?: Path;
    templatePath?: Option<Path>;
    created?: Date;
    modified?: Date;
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
  const stats = await Deno.stat(path);
  const created = stats.birthtime ?? stats.mtime ?? new Date();
  const modified = stats.mtime ?? new Date();
  return create({
    id: path,
    outputPath: path,
    content,
    created,
    modified,
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

/**
 * Automatically assign a title to the doc if it doesn't already have one.
 * Title is taken from the original file stem (the basename without extension)
 */
export const autoTitle = (doc: Doc): Doc => setTitleIfEmpty(doc, stem(doc.id));

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

  const created = parseDatelike(doc.meta.created);
  if (isSome(created)) {
    draft.created = created;
  }

  const modified = parseDatelike(doc.meta.modified);
  if (isSome(modified)) {
    draft.modified = modified;
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
