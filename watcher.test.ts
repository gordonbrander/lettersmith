import { assertEquals } from "@std/assert";
import { excludePaths } from "./watcher.ts";

Deno.test("excludePaths - filters paths matching exact string", () => {
  const paths = [
    "src/index.ts",
    "public/style.css",
    "public/script.js",
    "README.md",
  ];
  const result = excludePaths(paths, "public");
  assertEquals(result, ["src/index.ts", "README.md"]);
});

Deno.test("excludePaths - filters paths matching glob pattern", () => {
  const paths = [
    "src/index.ts",
    "dist/bundle.js",
    "dist/style.css",
    "README.md",
  ];
  const result = excludePaths(paths, "dist/*");
  assertEquals(result, ["src/index.ts", "README.md"]);
});

Deno.test("excludePaths - handles nested paths with exact match", () => {
  const paths = [
    "src/components/Button.tsx",
    "src/utils/helper.ts",
    "build/output.js",
  ];
  const result = excludePaths(paths, "build");
  assertEquals(result, ["src/components/Button.tsx", "src/utils/helper.ts"]);
});

Deno.test("excludePaths - handles glob patterns with wildcards", () => {
  const paths = ["test1.spec.ts", "test2.spec.ts", "main.ts", "helper.ts"];
  const result = excludePaths(paths, "*.spec.ts");
  assertEquals(result, ["main.ts", "helper.ts"]);
});

Deno.test("excludePaths - returns empty array when all paths match", () => {
  const paths = ["public/index.html", "public/style.css"];
  const result = excludePaths(paths, "public");
  assertEquals(result, []);
});

Deno.test("excludePaths - returns all paths when none match", () => {
  const paths = ["src/index.ts", "lib/utils.ts"];
  const result = excludePaths(paths, "dist");
  assertEquals(result, ["src/index.ts", "lib/utils.ts"]);
});

Deno.test("excludePaths - handles empty paths array", () => {
  const paths: string[] = [];
  const result = excludePaths(paths, "public");
  assertEquals(result, []);
});
