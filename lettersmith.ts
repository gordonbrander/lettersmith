import type { Doc } from "./doc.ts";
import * as Docs from "./docs.ts";
import { removeRecursive } from "./utils/io.ts";
import { type AsyncCancel, createCancelGroup } from "./utils/cancel.ts";
import { serve } from "./server.ts";
import { watch } from "./watcher.ts";
import { parseArgs } from "@std/cli/parse-args";

export type LettersmithArgs = {
  output: string;
  watch: boolean;
  serve: boolean;
};

/**
 * Default argument parser for `lettersmith` options.
 * @returns `LettersmithArgs`
 */
export const args = (): LettersmithArgs =>
  parseArgs(Deno.args, {
    boolean: ["watch", "serve"],
    string: ["output"],
    default: {
      output: "public",
      watch: false,
      serve: false,
    },
  });

/**
 * Entrypoint for your lettersmith application.
 * Handles building, serving, and watching for file changes.
 */
export const lettersmith = ({
  docs,
  output = "public",
  watch: shouldWatch = false,
  serve: shouldServe = false,
}: {
  docs: () => AsyncIterable<Doc>;
  output?: string;
  watch?: boolean;
  serve?: boolean;
}): AsyncCancel => {
  // Wrap up build step
  const rebuild = async () => {
    const start = performance.now();
    // Clean
    await removeRecursive(output);
    // Build
    await Docs.build(output, docs());
    const end = performance.now();
    console.log(`Built! ${end - start}ms`);
  };

  const cancels = createCancelGroup();

  if (shouldServe) {
    const server = serve({ dir: output });
    cancels.add(async () => {
      await server.shutdown();
    });
  }

  if (shouldWatch) {
    const cancelWatch = watch({
      watch: ".",
      exclude: output,
      build: rebuild,
    });
    cancels.add(cancelWatch);
  } else {
    rebuild();
  }

  return cancels.cancel;
};

export default lettersmith;
