import { assertEquals } from "@std/assert";
import { joinLines, splitLines } from "./text.ts";

Deno.test("splitLines splits text on newlines", () => {
  assertEquals(splitLines("a\nb\nc"), ["a", "b", "c"]);
  assertEquals(splitLines("a\r\nb\r\nc"), ["a", "b", "c"]);
  assertEquals(splitLines("single"), ["single"]);
  assertEquals(splitLines(""), [""]);
});

Deno.test("joinLines joins array with newlines", () => {
  assertEquals(joinLines(["a", "b", "c"]), "a\nb\nc");
  assertEquals(joinLines(["single"]), "single");
  assertEquals(joinLines([]), "");
});
