import { assertEquals } from "@std/assert";
import * as v from "@valibot/valibot";
import { guard, isRecord } from "./check.ts";

Deno.test("guard - creates type guard from valibot schema", () => {
  const stringGuard = guard(v.string());

  assertEquals(stringGuard("hello"), true);
  assertEquals(stringGuard(123), false);
  assertEquals(stringGuard(null), false);
  assertEquals(stringGuard(undefined), false);
  assertEquals(stringGuard({}), false);
});

Deno.test("isRecord - checks if value is a record", () => {
  assertEquals(isRecord({ key: "value" }), true);
  assertEquals(isRecord({}), true);
  assertEquals(isRecord([1, 2, 3]), true); // Arrays are records for valibot
  assertEquals(isRecord(null), false);
  assertEquals(isRecord(undefined), false);
  assertEquals(isRecord("string"), false);
  assertEquals(isRecord(123), false);
});
