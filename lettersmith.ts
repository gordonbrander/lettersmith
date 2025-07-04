import { clean } from "./utils/io.ts";
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

/** An object containing configuration options passed into the build function */
export type BuildConfig = {
  output: string;
};

/**
 * Entrypoint for your lettersmith application.
 * Handles serving, and watching for file changes.
 */
export const lettersmith = ({
  build,
  output = "public",
  watch: shouldWatch = false,
  serve: shouldServe = false,
  clean: shouldClean = true,
}: {
  build: (config: BuildConfig) => Promise<void>;
  output?: string;
  watch?: boolean;
  serve?: boolean;
  clean?: boolean;
}): AsyncCancel => {
  const config: BuildConfig = {
    output,
  };

  // Wrap up build step
  const rebuild = async () => {
    const start = performance.now();
    if (shouldClean) {
      await clean(output);
    }
    await build(config);
    const end = performance.now();
    console.log(`🔥 Built! ${end - start}ms 🔥`);
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
