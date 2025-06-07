import { basename, dirname, extname, join, relative } from "@std/path";
import { expandGlob } from "@std/fs";
import { toSlug } from "./slug.ts";

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

/**
 * Generate a nice path
 * @example
 * nicePath("foo/bar.md"); // "foo/bar/index.html"
 * nicePath("foo/bar/index.md"); // "foo/bar/index.html"
 */
export const nicePath = (path: Path): Path => {
  // If path is an index file, return the directory with "index.html"
  if (isIndexPath(path)) {
    const dir = dirname(path);
    return join(dir, "index.html");
  }
  // Otherwise, make filename directory name, and add index to end.
  const dir = dirname(path);
  const slug = toSlug(stem(path));
  return join(dir, slug, "index.html");
};

/** Make path relative to working directory */
export const relativize = (path: Path): Path => relative("./", path);

/**
 * Get all paths matching glob.
 * Paths are relative to current working directory.
 * @returns an async iterable for path
 */
export async function* globPaths(glob: string): AsyncGenerator<Path> {
  for await (const { path } of expandGlob(glob)) {
    yield relativize(path);
  }
}
