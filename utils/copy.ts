import { copy as copyFile } from "@std/fs";
import type { Path } from "./path.ts";

/**
 * Copy a static file or directory, overwriting anything currently there,
 * and preserving timestamps
 */
export const copy = async (
  src: Path,
  dest: Path,
): Promise<void> => {
  await copyFile(src, dest, {
    overwrite: true,
    preserveTimestamps: true,
  });
};
