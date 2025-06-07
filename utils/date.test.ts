import { assert, assertEquals } from "@std/assert";
import { dd, mm, parseTimestamp, readTimestamp, yyyy } from "./date.ts";

Deno.test("parseTimestamp", async (t) => {
  await t.step("it returns Date for valid date string", () => {
    const result = parseTimestamp("2020-01-01T15:17:19");
    assert(result !== undefined);
    const date = new Date(result);
    assertEquals(date?.getFullYear(), 2020, "year");
    assertEquals(date?.getMonth(), 0, "month");
    assertEquals(date?.getDate(), 1, "day");
  });

  await t.step("it returns null for invalid date string", () => {
    const result = parseTimestamp("not a date");
    assertEquals(result, undefined);
  });

  await t.step("it returns null for empty string", () => {
    const result = parseTimestamp("");
    assertEquals(result, undefined);
  });
});

Deno.test("readTimestamp", async (t) => {
  await t.step("it reads timestamp from string date", () => {
    const result = readTimestamp("2020-01-01T15:17:19");
    assert(result !== undefined);
    const date = new Date(result);
    assertEquals(date?.getFullYear(), 2020);
    assertEquals(date?.getMonth(), 0);
    assertEquals(date?.getDate(), 1);
  });

  await t.step("it reads timestamp from Date object", () => {
    const testDate = new Date(2020, 0, 1, 15, 17, 19);
    const result = readTimestamp(testDate);
    assert(result !== undefined);
    const date = new Date(result);
    assertEquals(date?.getFullYear(), 2020);
    assertEquals(date?.getMonth(), 0);
    assertEquals(date?.getDate(), 1);
  });

  await t.step("it returns null for invalid date string", () => {
    const result = readTimestamp("not a date");
    assertEquals(result, undefined);
  });

  await t.step("it returns null for empty string", () => {
    const result = readTimestamp("");
    assertEquals(result, undefined);
  });
});

Deno.test("yyyy", async (t) => {
  await t.step("it formats four-digit year from timestamp", () => {
    const timestamp = new Date(2020, 0, 1).getTime();
    assertEquals(yyyy(timestamp), "2020");
  });
});

Deno.test("mm", async (t) => {
  await t.step("it formats two-digit month from timestamp", () => {
    const timestamp = new Date(2020, 0, 1).getTime();
    assertEquals(mm(timestamp), "01");
  });

  await t.step("it zero-pads single digit months", () => {
    const timestamp = new Date(2020, 8, 1).getTime();
    assertEquals(mm(timestamp), "09");
  });
});

Deno.test("dd", async (t) => {
  await t.step("it formats two-digit day from timestamp", () => {
    const timestamp = new Date(2020, 0, 1).getTime();
    assertEquals(dd(timestamp), "01");
  });

  await t.step("it zero-pads single digit days", () => {
    const timestamp = new Date(2020, 0, 5).getTime();
    assertEquals(dd(timestamp), "05");
  });
});
