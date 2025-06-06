import { debounce } from "@std/async";
import * as Path from "@std/path";

export const pathMatchesPattern = (
  path: string,
  pathOrGlob: string,
): boolean => {
  // If it's a glob, match path against it
  if (Path.isGlob(pathOrGlob)) {
    const regex = Path.globToRegExp(pathOrGlob);
    return regex.test(path);
  }
  // If it's not a glob, check if path starts with it
  return path.startsWith(pathOrGlob);
};

/** Exclude paths that match the given regular expression */
export const excludePaths = (paths: string[], exclude: string): string[] =>
  paths.filter((p) => !pathMatchesPattern(p, exclude));

/**
 * Watch paths for changes, calling a callback on change.
 * *
 * @param options - Configuration object for the watcher
 * @param options.watch - Path to watch for changes (defaults to ".")
 * @param options.exclude - Path  or glob to exclude from watching (defaults to "public")
 * @param options.build - Callback function to execute when changes are detected
 * @returns A function that can be called to stop watching and close the watcher
 *
 * @example
 * ```ts
 * const cancel = watch({
 *   watch: ".",
 *   exclude: "public",
 *   build: () => console.log("Building...")
 * });
 *
 * // Later, to stop watching:
 * cancel();
 * ```
 */
export const watch = ({
  watch = ".",
  exclude = "public",
  build,
}: {
  watch?: string;
  exclude?: string;
  build: () => void;
}): () => void => {
  const watcher = Deno.watchFs(watch);

  const rebuild = debounce(build, 200);

  const task = async () => {
    const cwd = Deno.cwd();
    for await (const event of watcher) {
      const changed = event.paths.map((p) => Path.relative(cwd, p));
      const watched = excludePaths(changed, exclude);
      if (watched.length > 0) {
        rebuild();
      }
    }
  };
  task();
  rebuild();

  return () => watcher.close();
};
