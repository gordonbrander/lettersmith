import { assertEquals } from "@std/assert";
import {
  getAutoTemplateForPath,
  isIndexPath,
  nicePath,
  relativize,
  setExtension,
  stem,
} from "./path.ts";

// Test getting automatic template for root-level file
Deno.test("getAutoTemplateForPath - Root file", () => {
  const path = "test.md";
  const result = getAutoTemplateForPath(path);
  assertEquals(result, "default.html");
});

// Test getting automatic template for nested file
Deno.test("getAutoTemplateForPath - Nested file", () => {
  const path = "blog/post.md";
  const result = getAutoTemplateForPath(path);
  assertEquals(result, "blog.html");
});

// Test getting automatic template for deeply nested file
Deno.test("getAutoTemplateForPath - Deep nested", () => {
  const path = "sections/foo/post.md";
  const result = getAutoTemplateForPath(path);
  assertEquals(result, "sections/foo.html");
});

// Test replacing extension
Deno.test("setExtension - Basic replace", () => {
  const path = "test.md";
  const result = setExtension(path, ".html");
  assertEquals(result, "test.html");
});

// Test replacing when no extension exists
Deno.test("setExtension - No extension", () => {
  const path = "test";
  const result = setExtension(path, ".html");
  assertEquals(result, "test.html");
});

// Test replacing extension in nested path
Deno.test("setExtension - Nested path", () => {
  const path = "blog/post.md";
  const result = setExtension(path, ".html");
  assertEquals(result, "blog/post.html");
});

// Test isIndexPath with index file
Deno.test("isIndexPath returns true for index file", () => {
  const path = "index.html";
  const result = isIndexPath(path);
  assertEquals(result, true);
});

// Test isIndexPath with non-index file
Deno.test("isIndexPath returns false for non-index file", () => {
  const path = "post.md";
  const result = isIndexPath(path);
  assertEquals(result, false);
});

// Test isIndexPath with nested index file
Deno.test("isIndexPath - With nested index file", () => {
  const path = "blog/index.html";
  const result = isIndexPath(path);
  assertEquals(result, true);
});

// Test stem function
Deno.test("stem - Basic file", () => {
  const path = "test.md";
  const result = stem(path);
  assertEquals(result, "test");
});

// Test stem with no extension
Deno.test("stem - No extension", () => {
  const path = "test";
  const result = stem(path);
  assertEquals(result, "test");
});

// Test stem with nested path
Deno.test("stem - Nested path", () => {
  const path = "blog/post.md";
  const result = stem(path);
  assertEquals(result, "post");
});

// Test relativize function
Deno.test("relativize - Basic path", () => {
  const path = "test.md";
  const result = relativize(path);
  assertEquals(result, "test.md");
});

// Test relativize with nested path
Deno.test("relativize - Nested path", () => {
  const path = "blog/post.md";
  const result = relativize(path);
  assertEquals(result, "blog/post.md");
});

// Test relativize with absolute path
Deno.test("relativize - Absolute path", () => {
  const cwd = Deno.cwd();
  const path = `${cwd}/test.md`;
  const result = relativize(path);
  assertEquals(result, "test.md");
});

// Test nicePath with regular file
Deno.test("nicePath - Regular file", () => {
  const path = "blog/post.md";
  const result = nicePath(path);
  assertEquals(result, "blog/post/index.html");
});

// Test nicePath with index file
Deno.test("nicePath - Index file", () => {
  const path = "blog/index.md";
  const result = nicePath(path);
  assertEquals(result, "blog/index.html");
});

// Test nicePath with root-level file
Deno.test("nicePath - Root level file", () => {
  const path = "about.md";
  const result = nicePath(path);
  assertEquals(result, "about/index.html");
});

// Test nicePath with root-level index file
Deno.test("nicePath - Root level index file", () => {
  const path = "index.md";
  const result = nicePath(path);
  assertEquals(result, "index.html");
});
