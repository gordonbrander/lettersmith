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

export const removeRecursive = async (
  path: Path,
): Promise<void> => {
  await Deno.remove(path, { recursive: true });
};
