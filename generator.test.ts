import { assertEquals } from "@std/assert";
import {
  dedupe,
  filter,
  filterMap,
  flatMap,
  flatten,
  map,
  reduce,
  scan,
  take,
  takeWhile,
} from "./generator.ts";

Deno.test("map transforms values", () => {
  const numbers = [1, 2, 3];
  const doubled = [...map(numbers, (n) => n * 2)];
  assertEquals(doubled, [2, 4, 6]);
});

Deno.test("filter keeps matching values", () => {
  const numbers = [1, 2, 3, 4, 5];
  const evens = [...filter(numbers, (n) => n % 2 === 0)];
  assertEquals(evens, [2, 4]);
});

Deno.test("reduce accumulates values", () => {
  const numbers = [1, 2, 3, 4];
  const sum = reduce(numbers, (acc, n) => acc + n, 0);
  assertEquals(sum, 10);
});

Deno.test("scan yields intermediate results", () => {
  const numbers = [1, 2, 3];
  const sums = [...scan(numbers, (acc, n) => acc + n, 0)];
  assertEquals(sums, [0, 1, 3, 6]);
});

Deno.test("flatten combines nested iterables", () => {
  const nested = [[1, 2], [3, 4], [5]];
  const flat = [...flatten(nested)];
  assertEquals(flat, [1, 2, 3, 4, 5]);
});

Deno.test("flatMap transforms and flattens", () => {
  const numbers = [1, 2, 3];
  const duplicated = [...flatMap(numbers, (n) => [n, n])];
  assertEquals(duplicated, [1, 1, 2, 2, 3, 3]);
});

Deno.test("filterMap transforms and filters nulls", () => {
  const numbers = [1, 2, 3, 4];
  const evenDoubles = [
    ...filterMap(numbers, (n) => n % 2 === 0 ? n * 2 : null),
  ];
  assertEquals(evenDoubles, [4, 8]);
});

Deno.test("take limits output length", () => {
  const numbers = [1, 2, 3, 4, 5];
  const taken = [...take(numbers, 3)];
  assertEquals(taken, [1, 2, 3]);
});

Deno.test("takeWhile takes until predicate fails", () => {
  const numbers = [1, 2, 3, 4, 5];
  const lessThanFour = [...takeWhile(numbers, (n) => n < 4)];
  assertEquals(lessThanFour, [1, 2, 3]);
});

Deno.test("dedupe removes duplicate values based on key", async () => {
  const input = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
    { id: "1", name: "Alice (duplicate)" },
    { id: "3", name: "Charlie" },
    { id: "2", name: "Bob (duplicate)" },
  ];

  const result = [];
  for await (const item of dedupe(input, (value) => value.id)) {
    result.push(item);
  }

  assertEquals(result, [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
    { id: "3", name: "Charlie" },
  ]);
});
