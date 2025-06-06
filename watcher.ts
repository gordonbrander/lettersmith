import { debounce } from "@std/async";
import { globToRegExp } from "@std/path";

/** Exclude paths that match the given regular expression */
export const excludePaths = (paths: string[], exclude: RegExp): string[] =>
  paths.filter((p) => !exclude.test(p));

/** Watch paths for changes, calling a callback on change.
 * @param path - The file or directory path to watch for changes
 * @param exclude - A glob pattern string to exclude matching paths from triggering the callback
 * @param callback - Function to call when changes are detected to non-excluded paths
 * @returns A function to close the watcher
 */
export const watch = (
  path: string,
  exclude: string,
  callback: () => unknown,
): () => void => {
  const watcher = Deno.watchFs(path);
  const debouncedCallback = debounce(callback, 100);
  const excludeRegex = globToRegExp(exclude);

  const watch = async () => {
    for await (const event of watcher) {
      const changed = excludePaths(event.paths, excludeRegex);
      if (changed.length > 0) {
        debouncedCallback();
      }
    }
  };
  watch();

  return () => watcher.close();
};
