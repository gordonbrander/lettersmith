import { basename, dirname, extname } from "@std/path";
import { expandGlob } from "@std/fs";

export type Path = string;

/** Get the auto template (default assigned template) for a given path */
export const getAutoTemplateForPath = (
  path: Path,
): Path => {
  const parent = dirname(path);
  if (parent === "" || parent === ".") {
    return "default.html";
  }
  return `${parent}.html`;
};

/** Replace file extension. Assumes 'extname' function from deps. */
export const setExtension = (
  path: Path,
  extension: string,
): Path => {
  const ext = extname(path);
  if (!ext) return `${path}${extension}`;
  return path.slice(0, -ext.length) + extension;
};

/** Is path an index file? */
export const isIndexPath = (path: Path): boolean =>
  basename(path, extname(path)) === "index";

export async function* globPaths(glob: string): AsyncIterable<Path> {
  for (const entry in expandGlob(glob)) {
    yield entry;
  }
}
