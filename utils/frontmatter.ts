import { parse } from "@std/yaml";
import { isRecord } from "./check.ts";

const FRONTMATTER_REGEX = /^---\n(.*)---\n?/s;

export type ParsedFrontMatter = {
  frontmatter: Record<string, unknown>;
  content: string;
};

export const parseFrontmatter = (
  content: string,
): ParsedFrontMatter => {
  const match = content.match(FRONTMATTER_REGEX);

  if (!match) {
    return { frontmatter: {}, content };
  }

  const frontmatterBody = match?.at(1) ?? "";

  const frontmatter = parse(frontmatterBody);
  if (!isRecord(frontmatter)) {
    throw new TypeError(
      "Top level of frontmatter must be an object (key-value record)",
    );
  }
  const rest = content.replace(FRONTMATTER_REGEX, "");

  return { frontmatter, content: rest };
};
