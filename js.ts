import { build } from "esbuild";
import type { Path } from "./path.ts";
import { create as createDoc, type Doc } from "./doc.ts";

export const bundleTypescriptForBrowser = async (
  code: string,
  filePath: Path,
): Promise<string> => {
  const result = await build({
    stdin: {
      contents: code,
      sourcefile: filePath,
      loader: "ts",
    },
    bundle: true,
    write: false,
    format: "esm",
    target: "es2020",
    platform: "browser",
    minify: true,
    sourcemap: true,
  });
  return result.outputFiles[0].text;
};

export const bundleTypescriptDocForBrowser = async (doc: Doc): Promise<Doc> =>
  createDoc({
    ...doc,
    content: await bundleTypescriptForBrowser(doc.content, doc.outputPath),
  });
