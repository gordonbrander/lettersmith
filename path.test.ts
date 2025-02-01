import { assertEquals } from "@std/assert";
import {
  getAutoTemplateForPath,
  isIndexPath,
  replaceExtension,
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
Deno.test("replaceExtension - Basic replace", () => {
  const path = "test.md";
  const result = replaceExtension(path, ".html");
  assertEquals(result, "test.html");
});

// Test replacing when no extension exists
Deno.test("replaceExtension - No extension", () => {
  const path = "test";
  const result = replaceExtension(path, ".html");
  assertEquals(result, "test.html");
});

// Test replacing extension in nested path
Deno.test("replaceExtension - Nested path", () => {
  const path = "blog/post.md";
  const result = replaceExtension(path, ".html");
  assertEquals(result, "blog/post.html");
});

// Test isIndexPath with index file
Deno.test("isIndexPath - With index file", () => {
  const path = "index.html";
  const result = isIndexPath(path);
  assertEquals(result, true);
});

// Test isIndexPath with non-index file
Deno.test("isIndexPath - With non-index file", () => {
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
