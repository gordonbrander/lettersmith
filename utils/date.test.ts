import { assert, assertEquals } from "@std/assert";
import { parseTimestamp, readTimestamp } from "./date.ts";

Deno.test("parseTimestamp", async (t) => {
  await t.step("it returns Date for valid date string", () => {
    const result = parseTimestamp("2020-01-01T15:17:19");
    assert(result !== null);
    const date = new Date(result);
    assertEquals(date?.getFullYear(), 2020, "year");
    assertEquals(date?.getMonth(), 0, "month");
    assertEquals(date?.getDate(), 1, "day");
  });

  await t.step("it returns null for invalid date string", () => {
    const result = parseTimestamp("not a date");
    assertEquals(result, null);
  });

  await t.step("it returns null for empty string", () => {
    const result = parseTimestamp("");
    assertEquals(result, null);
  });
});

Deno.test("readTimestamp", async (t) => {
  await t.step("it reads timestamp from string date", () => {
    const result = readTimestamp("2020-01-01T15:17:19");
    assert(result !== null);
    const date = new Date(result);
    assertEquals(date?.getFullYear(), 2020);
    assertEquals(date?.getMonth(), 0);
    assertEquals(date?.getDate(), 1);
  });

  await t.step("it reads timestamp from Date object", () => {
    const testDate = new Date(2020, 0, 1, 15, 17, 19);
    const result = readTimestamp(testDate);
    assert(result !== null);
    const date = new Date(result);
    assertEquals(date?.getFullYear(), 2020);
    assertEquals(date?.getMonth(), 0);
    assertEquals(date?.getDate(), 1);
  });

  await t.step("it returns null for invalid date string", () => {
    const result = readTimestamp("not a date");
    assertEquals(result, null);
  });

  await t.step("it returns null for empty string", () => {
    const result = readTimestamp("");
    assertEquals(result, null);
  });
});
