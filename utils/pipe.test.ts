import { flow, flowAsync, pipe, pipeAsync } from "./pipe.ts";
import { assertEquals } from "@std/assert";

Deno.test("pipe()", async (t) => {
  await t.step("pipes with no functions returns input value", () => {
    const result = pipe(5);
    assertEquals(result, 5);
  });

  await t.step("pipes with single function", () => {
    const double = (n: number) => n * 2;
    const result = pipe(5, double);
    assertEquals(result, 10);
  });

  await t.step("pipes with multiple functions", () => {
    const double = (n: number) => n * 2;
    const addOne = (n: number) => n + 1;
    const toString = (n: number) => n.toString();

    const result = pipe(5, double, addOne, toString);
    assertEquals(result, "11");
  });

  await t.step("preserves types through the chain", () => {
    const numToString = (n: number) => n.toString();
    const stringToArray = (s: string) => s.split("");
    const arrayToLength = (arr: string[]) => arr.length;

    const result = pipe(123, numToString, stringToArray, arrayToLength);
    assertEquals(result, 3);
  });
});

Deno.test("pipeAsync()", async (t) => {
  await t.step("pipes with no functions returns input value", async () => {
    const result = await pipeAsync(5);
    assertEquals(result, 5);
  });

  await t.step("pipes with single function", async () => {
    const double = (n: number) => n * 2;
    const result = await pipeAsync(5, double);
    assertEquals(result, 10);
  });

  await t.step("pipes multiple functions", async () => {
    const double = (n: number) => n * 2;
    const addOne = (n: number) => n + 1;
    const toString = (n: number) => n.toString();

    const result = await pipeAsync(5, double, addOne, toString);
    assertEquals(result, "11");
  });

  await t.step("preserves types through the chain", async () => {
    const numToString = (n: number) => n.toString();
    const stringToArray = (s: string) => s.split("");
    const arrayToLength = (arr: string[]) => arr.length;

    const result = await pipeAsync(
      123,
      numToString,
      stringToArray,
      arrayToLength,
    );
    assertEquals(result, 3);
  });
});

Deno.test("flow()", async (t) => {
  await t.step("composes a single function", () => {
    const double = (n: number) => n * 2;
    const result = flow(double);
    assertEquals(result(5), 10);
  });

  await t.step("composes multiple functions", () => {
    const double = (n: number) => n * 2;
    const addOne = (n: number) => n + 1;
    const toString = (n: number) => n.toString();

    const result = flow(double, addOne, toString);
    assertEquals(result(5), "11");
  });
});

Deno.test("flowAsync()", async (t) => {
  await t.step("composes a single function", async () => {
    const double = (n: number) => n * 2;
    const result = flowAsync(double);
    assertEquals(await result(5), 10);
  });

  await t.step("composes multiple functions", async () => {
    const double = (n: number) => n * 2;
    const addOne = (n: number) => n + 1;
    const toString = (n: number) => n.toString();

    const result = flowAsync(double, addOne, toString);
    assertEquals(await result(5), "11");
  });
});
