import { assert, assertEquals } from "@std/assert";
import { parseTimestamp } from "./date.ts";

Deno.test("parseDate with valid date string returns Date", () => {
  const result = parseTimestamp("2020-01-01T15:17:19");
  assert(result !== null);
  const date = new Date(result);
  assertEquals(date?.getFullYear(), 2020, "year");
  assertEquals(date?.getMonth(), 0, "month");
  assertEquals(date?.getDate(), 1, "day");
});

Deno.test("parseDate with invalid date string returns null", () => {
  const result = parseTimestamp("not a date");
  assertEquals(result, null);
});

Deno.test("parseDate with empty string returns null", () => {
  const result = parseTimestamp("");
  assertEquals(result, null);
});
