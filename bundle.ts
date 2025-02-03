import { build } from "esbuild";
import type { Path } from "./utils/path.ts";

/**
 * Bundle and write Javascript and Typescript
 * Given a list of files and an output directory, will bundle and write the
 * minified bundle file and sourcemap to that directory.
 * @arg option.files - the files to bundle
 * @arg options.dir - the output directory
 * @returns promise for void upon completion of write.
 */
export const buildBundle = async (
  {
    files,
    dir,
  }: {
    files: Path[];
    dir: Path;
  },
): Promise<void> => {
  await build({
    entryPoints: files,
    outdir: dir,
    bundle: true,
    write: true,
    format: "esm",
    target: "esnext",
    platform: "browser",
    minify: true,
    sourcemap: "external",
  });
  return;
};
