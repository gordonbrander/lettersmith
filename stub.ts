import type { Path } from "./utils/path.ts";
import type { Option } from "@gordonb/result/option";
import type { Timestamp } from "./utils/date.ts";
import type { Tags } from "./utils/tags.ts";
import type { Doc, Meta } from "./doc.ts";

/** A document stub. Contains basic information about a document. */
export type Stub = {
  id: Path;
  outputPath: Path;
  templatePath: Option<Path>;
  created: Timestamp;
  modified: Timestamp;
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
  tags: doc.tags,
  meta: doc.meta,
});
