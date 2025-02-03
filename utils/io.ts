import { ensureFile } from "@std/fs";
import { performAsync, type Result } from "./result.ts";
import type { Path } from "./path.ts";

/** Write a file to path, creating intermediate directories as needed */
export const writeFileDeep = async (
  path: Path,
  data: Uint8Array | string,
): Promise<Result<null, Error>> =>
  await performAsync<null, Error>(async () => {
    // Ensure file exists, creating intermediate directories if needed.
    await ensureFile(path);
    await Deno.writeFile(
      path,
      data instanceof Uint8Array ? data : new TextEncoder().encode(data),
    );
    return null;
  });

export const removeRecursive = (
  path: Path,
): Promise<Result<void, Error>> =>
  performAsync(async () => {
    await Deno.remove(path, { recursive: true });
    return;
  });
