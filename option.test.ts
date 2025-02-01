import {
  isNone,
  isSome,
  map,
  mapOr,
  mapOrElse,
  Option,
  unwrap,
  unwrapOr,
  unwrapOrElse,
} from "./option.ts";
import { assertEquals, assertThrows } from "@std/assert";

Deno.test("isSome returns true for non-null/undefined values", () => {
  const value: Option<number> = 42;
  const value2: Option<string> = "hello";
  const value3: Option<boolean> = false;

  assertEquals(isSome(value), true);
  assertEquals(isSome(value2), true);
  assertEquals(isSome(value3), true);
});

Deno.test("isSome returns false for null/undefined values", () => {
  const value1: Option<number> = null;
  const value2: Option<string> = undefined;

  assertEquals(isSome(value1), false);
  assertEquals(isSome(value2), false);
});

Deno.test("isNone returns true for null/undefined values", () => {
  const value1: Option<number> = null;
  const value2: Option<string> = undefined;

  assertEquals(isNone(value1), true);
  assertEquals(isNone(value2), true);
});

Deno.test("isNone returns false for non-null/undefined values", () => {
  const value1: Option<number> = 42;
  const value2: Option<string> = "";
  const value3: Option<boolean> = false;

  assertEquals(isNone(value1), false);
  assertEquals(isNone(value2), false);
  assertEquals(isNone(value3), false);
});

Deno.test("map transforms value when Some", () => {
  const value: Option<number> = 42;
  const mapped = map(value, (x) => x * 2);
  assertEquals(mapped, 84);
});

Deno.test("map returns null for None values", () => {
  const value1: Option<number> = null;
  const value2: Option<number> = undefined;

  assertEquals(map<number, number>(value1, (x) => x * 2), null);
  assertEquals(map<number, number>(value2, (x) => x * 2), null);
});

Deno.test("mapOr transforms value when Some", () => {
  const value: Option<number> = 42;
  const mapped = mapOr<number, number>(value, 0, (x) => x * 2);
  assertEquals(mapped, 84);
});

Deno.test("mapOr returns default for None values", () => {
  const value1: Option<number> = null;
  const value2: Option<number> = undefined;

  assertEquals(mapOr<number, number>(value1, 0, (x) => x * 2), 0);
  assertEquals(mapOr<number, number>(value2, 0, (x) => x * 2), 0);
});

Deno.test("mapOrElse transforms value when Some", () => {
  const value: Option<number> = 42;
  const mapped = mapOrElse<number, number>(value, () => 0, 84);
  assertEquals(mapped, 0);
});

Deno.test("mapOrElse returns default for None values", () => {
  const value1: Option<number> = null;
  const value2: Option<number> = undefined;

  assertEquals(mapOrElse<number, number>(value1, () => 0, 84), 84);
  assertEquals(mapOrElse<number, number>(value2, () => 0, 84), 84);
});

Deno.test("unwrap returns value when Some", () => {
  const value: Option<number> = 42;
  assertEquals(unwrap(value), 42);
});

Deno.test("unwrap throws for None values", () => {
  const value1: Option<number> = null;
  const value2: Option<number> = undefined;

  assertThrows(() => unwrap(value1), TypeError, "Value is null or undefined");
  assertThrows(() => unwrap(value2), TypeError, "Value is null or undefined");
});

Deno.test("unwrapOr returns value when Some", () => {
  const value: Option<number> = 42;
  assertEquals(unwrapOr(value, 0), 42);
});

Deno.test("unwrapOr returns default for None values", () => {
  const value1: Option<number> = null;
  const value2: Option<number> = undefined;

  assertEquals(unwrapOr(value1, 0), 0);
  assertEquals(unwrapOr(value2, 0), 0);
});

Deno.test("unwrapOrElse returns value when Some", () => {
  const value: Option<number> = 42;
  assertEquals(unwrapOrElse(value, () => 0), 42);
});

Deno.test("unwrapOrElse returns default for None values", () => {
  const value1: Option<number> = null;
  const value2: Option<number> = undefined;

  assertEquals(unwrapOrElse(value1, () => 0), 0);
  assertEquals(unwrapOrElse(value2, () => 0), 0);
});
