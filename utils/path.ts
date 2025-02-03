import { basename, dirname, extname, relative } from "@std/path";
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

/** Get the path stem -the filename without the extension */
export const stem = (path: Path): string => basename(path, extname(path));

/** Is path an index file? */
export const isIndexPath = (path: Path): boolean => stem(path) === "index";

/** Make path relative to working directory */
export const relativize = (path: Path): Path => relative("./", path);

/**
 * Get all paths matching glob.
 * Paths are relative to current working directory.
 * @returns an async iterable for path
 */
export async function* globPaths(glob: string): AsyncIterable<Path> {
  for await (const { path } of expandGlob(glob)) {
    yield relativize(path);
  }
}
