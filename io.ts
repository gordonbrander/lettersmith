import { dirname } from "@std/path";
import { performAsync, Result } from "./result.ts";

const mkdir = async (
  path: string | URL,
  options: Deno.MkdirOptions,
): Promise<Result<null, Error>> => {
  return await performAsync<null, Error>(async () => {
    await Deno.mkdir(path, options);
    return null;
  });
};

/** Write a file to path, creating intermediate directories as needed */
export const writeFileDeep = async (
  path: string,
  data: Uint8Array | string,
): Promise<Result<null, Error>> => {
  const dir = dirname(path);
  // Create intermediate directories if needed.
  // Errors if directories exist.
  await mkdir(dir, { recursive: true });
  return await performAsync<null, Error>(async () => {
    await Deno.writeFile(
      path,
      data instanceof Uint8Array ? data : new TextEncoder().encode(data),
    );
    return null;
  });
};
