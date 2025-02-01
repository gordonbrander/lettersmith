import { parse } from "@std/yaml";
import { ok, perform, Result } from "./result.ts";

const FRONTMATTER_REGEX = /^---\n(.*)---\n?/s;

export type ParsedFrontMatter = {
  frontmatter: unknown;
  content: string;
};

export const parseFrontmatter = (
  content: string,
): Result<ParsedFrontMatter, Error> => {
  const match = content.match(FRONTMATTER_REGEX);

  if (!match) {
    return ok({ frontmatter: {} as unknown, content });
  }

  const frontmatterBody = match?.at(1) ?? "";

  return perform<ParsedFrontMatter, Error>(() => {
    const frontmatter = parse(frontmatterBody);
    const rest = content.replace(FRONTMATTER_REGEX, "");
    return { frontmatter, content: rest };
  });
};
