import { assertEquals } from "@std/assert";
import { toSlug } from "./slug.ts";

Deno.test("toSlug", async (t) => {
  // Basic conversion
  await t.step("converts spaces to hyphens", () => {
    assertEquals(toSlug("hello world"), "hello-world");
  });

  await t.step("converts to lowercase", () => {
    assertEquals(toSlug("Hello World"), "hello-world");
  });

  await t.step("trims whitespace", () => {
    assertEquals(toSlug("  hello world  "), "hello-world");
  });

  // Special characters
  await t.step("removes brackets", () => {
    assertEquals(toSlug("[hello] (world)"), "hello-world");
    assertEquals(toSlug("{hello} <world>"), "hello-world");
  });

  await t.step("removes punctuation", () => {
    assertEquals(toSlug("hello, world!"), "hello-world");
    assertEquals(toSlug("hello: world; test"), "hello-world-test");
  });

  await t.step("removes special characters", () => {
    assertEquals(toSlug("hello@world#test$"), "helloworldtest");
    assertEquals(toSlug("hello&world*test^"), "helloworldtest");
  });

  await t.step("removes quotes", () => {
    assertEquals(toSlug(`hello "world" 'test'`), "hello-world-test");
  });

  // Complex examples
  await t.step("handles multiple spaces", () => {
    assertEquals(toSlug("hello   world"), "hello-world");
  });

  await t.step("handles complex combinations", () => {
    assertEquals(
      toSlug("Hello, [World]! What's #happening?"),
      "hello-world-whats-happening",
    );
  });

  // Edge cases
  await t.step("handles empty string", () => {
    assertEquals(toSlug(""), "");
  });

  await t.step("handles string with only special characters", () => {
    assertEquals(toSlug("@#$%^&*"), "");
  });

  await t.step("preserves hyphens", () => {
    assertEquals(toSlug("hello-world"), "hello-world");
  });
});
