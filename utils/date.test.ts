import { assert, assertEquals } from "@std/assert";
import { dd, mm, parseDatelike, yyyy } from "./date.ts";

Deno.test("parseDatelike", async (t) => {
  await t.step("it reads date from string date", () => {
    const result = parseDatelike("2020-01-01T15:17:19");
    assert(result !== undefined);
    const date = new Date(result);
    assertEquals(date?.getFullYear(), 2020);
    assertEquals(date?.getMonth(), 0);
    assertEquals(date?.getDate(), 1);
  });

  await t.step("it reads date from Date object", () => {
    const testDate = new Date(2020, 0, 1, 15, 17, 19);
    const result = parseDatelike(testDate);
    assert(result !== undefined);
    const date = new Date(result);
    assertEquals(date?.getFullYear(), 2020);
    assertEquals(date?.getMonth(), 0);
    assertEquals(date?.getDate(), 1);
  });

  await t.step(
    "it returns undefined for non-string, non-number, non-date values",
    () => {
      const result = parseDatelike({});
      assertEquals(result, undefined);
    },
  );
});

Deno.test("yyyy", async (t) => {
  await t.step("it formats four-digit year from timestamp", () => {
    const date = new Date(2020, 0, 1);
    assertEquals(yyyy(date), "2020");
  });
});

Deno.test("mm", async (t) => {
  await t.step("it formats two-digit month from timestamp", () => {
    const date = new Date(2020, 0, 1);
    assertEquals(mm(date), "01");
  });

  await t.step("it zero-pads single digit months", () => {
    const date = new Date(2020, 8, 1);
    assertEquals(mm(date), "09");
  });
});

Deno.test("dd", async (t) => {
  await t.step("it formats two-digit day from timestamp", () => {
    const date = new Date(2020, 0, 1);
    assertEquals(dd(date), "01");
  });

  await t.step("it zero-pads single digit days", () => {
    const date = new Date(2020, 0, 5);
    assertEquals(dd(date), "05");
  });
});
