import { assertEquals } from "@std/assert";
import { groupsAsync, indexByAsync } from "./generator-extra.ts";

Deno.test("groupsAsync - groups items by key", async () => {
  const entries: [string, number][] = [
    ["a", 1],
    ["b", 2],
    ["a", 3],
    ["c", 4],
    ["b", 5],
  ];

  const result = await groupsAsync(entries);

  assertEquals(result.get("a"), [1, 3]);
  assertEquals(result.get("b"), [2, 5]);
  assertEquals(result.get("c"), [4]);
  assertEquals(result.size, 3);
});

Deno.test("groupsAsync - handles empty iterable", async () => {
  const entries: [string, number][] = [];

  const result = await groupsAsync(entries);

  assertEquals(result.size, 0);
});

Deno.test("groupsAsync - handles single item", async () => {
  const entries: [string, string][] = [["key", "value"]];

  const result = await groupsAsync(entries);

  assertEquals(result.get("key"), ["value"]);
  assertEquals(result.size, 1);
});

Deno.test("indexByAsync - creates index from entries", async () => {
  const entries: [string, number][] = [
    ["a", 1],
    ["b", 2],
    ["c", 3],
  ];

  const result = await indexByAsync(entries);

  assertEquals(result.get("a"), 1);
  assertEquals(result.get("b"), 2);
  assertEquals(result.get("c"), 3);
  assertEquals(result.size, 3);
});

Deno.test("indexByAsync - overwrites duplicate keys", async () => {
  const entries: [string, number][] = [
    ["a", 1],
    ["b", 2],
    ["a", 3],
  ];

  const result = await indexByAsync(entries);

  assertEquals(result.get("a"), 3);
  assertEquals(result.get("b"), 2);
  assertEquals(result.size, 2);
});

Deno.test("indexByAsync - handles empty iterable", async () => {
  const entries: [string, number][] = [];

  const result = await indexByAsync(entries);

  assertEquals(result.size, 0);
});
