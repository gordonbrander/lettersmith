import type { Path } from "./utils/path.ts";
import type { Option } from "@gordonb/result/option";
import type { Tags } from "./utils/tags.ts";
import type { Doc, Meta } from "./doc.ts";

/** A document stub. Contains basic information about a document, without the content. */
export type Stub = {
  id: Path;
  outputPath: Path;
  templatePath: Option<Path>;
  created: Date;
  modified: Date;
  title: string;
  summary: string;
  tags: Tags;
  meta: Meta;
};

export const fromDoc = (doc: Doc) => ({
  id: doc.id,
  outputPath: doc.outputPath,
  templatePath: doc.templatePath,
  created: doc.created,
  modified: doc.modified,
  title: doc.title,
  summary: doc.summary,
  tags: structuredClone(doc.tags),
  meta: structuredClone(doc.meta),
});
