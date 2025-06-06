import { assertEquals } from "@std/assert";
import { excludePaths } from "./watcher.ts";
import { globToRegExp } from "@std/path";

Deno.test("excludePaths excludes paths matching glob pattern", () => {
  const paths = [
    "src/index.ts",
    "src/utils.ts",
    "node_modules/package/index.js",
    "dist/build.js",
    "README.md",
  ];
  const exclude = globToRegExp("node_modules/**");
  const result = excludePaths(paths, exclude);

  assertEquals(result, [
    "src/index.ts",
    "src/utils.ts",
    "dist/build.js",
    "README.md",
  ]);
});

Deno.test("excludePaths excludes multiple patterns", () => {
  const paths = [
    "src/index.ts",
    "src/test.ts",
    "build/output.js",
    "dist/bundle.js",
    "temp/cache.tmp",
  ];
  const exclude = globToRegExp("{build,dist,temp}/**");
  const result = excludePaths(paths, exclude);

  assertEquals(result, [
    "src/index.ts",
    "src/test.ts",
  ]);
});

Deno.test("excludePaths returns all paths when no matches", () => {
  const paths = [
    "src/index.ts",
    "src/utils.ts",
    "README.md",
  ];
  const exclude = globToRegExp("node_modules/**");
  const result = excludePaths(paths, exclude);

  assertEquals(result, paths);
});

Deno.test("excludePaths returns empty array when all paths match", () => {
  const paths = [
    "node_modules/react/index.js",
    "node_modules/lodash/lib.js",
  ];
  const exclude = globToRegExp("node_modules/**");
  const result = excludePaths(paths, exclude);

  assertEquals(result, []);
});

Deno.test("excludePaths handles empty paths array", () => {
  const paths: string[] = [];
  const exclude = globToRegExp("**/*.tmp");
  const result = excludePaths(paths, exclude);

  assertEquals(result, []);
});
