import { parse } from "@std/yaml";
import { ok, perform, type Result } from "./utils/result.ts";
import { isRecord } from "./utils/check.ts";

const FRONTMATTER_REGEX = /^---\n(.*)---\n?/s;

export type ParsedFrontMatter = {
  frontmatter: Record<string, unknown>;
  content: string;
};

export const parseFrontmatter = (
  content: string,
): Result<ParsedFrontMatter, Error> => {
  const match = content.match(FRONTMATTER_REGEX);

  if (!match) {
    return ok({ frontmatter: {}, content });
  }

  const frontmatterBody = match?.at(1) ?? "";

  return perform<ParsedFrontMatter, Error>(() => {
    const frontmatter = parse(frontmatterBody);
    if (!isRecord(frontmatter)) {
      throw new TypeError(
        "Top level of frontmatter must be an object (key-value record)",
      );
    }
    const rest = content.replace(FRONTMATTER_REGEX, "");
    return { frontmatter, content: rest };
  });
};
