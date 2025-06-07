import { ensureFile } from "@std/fs";
import type { Path } from "./path.ts";

/** Write a file to path, creating intermediate directories as needed */
export const writeFileDeep = async (
  path: Path,
  data: Uint8Array | string,
): Promise<void> => {
  // Ensure file exists, creating intermediate directories if needed.
  await ensureFile(path);
  await Deno.writeFile(
    path,
    data instanceof Uint8Array ? data : new TextEncoder().encode(data),
  );
};

/**
 * Check if a path exists
 * @see https://docs.deno.com/examples/checking_file_existence/
 */
export const exists = async (path: Path): Promise<boolean> => {
  try {
    await Deno.lstat(path);
    return true;
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
    return false;
  }
};

/**
 * Remove a file or directory recursively.
 * If resource does not exist, do nothing.
 */
export const clean = async (
  path: Path,
): Promise<void> => {
  if (await exists(path)) {
    await Deno.remove(path, { recursive: true });
  }
};
