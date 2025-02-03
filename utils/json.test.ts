import { type Json, normalize } from "./json.ts";
import { assertEquals } from "@std/assert";

Deno.test("normalize JSON", async (t) => {
  // Tests basic fields and functions
  await t.step("normalize basic JSON", () => {
    const input = {
      hello: "world",
      num: 123,
      bool: true,
      null: null,
    };

    const output = normalize(input);
    assertEquals(output, input);
  });

  // Tests nested objects
  await t.step("normalize nested objects", () => {
    const input = {
      nested: {
        obj: {
          value: "test",
        },
      },
    };

    const output = normalize(input);
    assertEquals(output, input);
  });

  // Tests arrays
  await t.step("normalize arrays", () => {
    const input: Json = {
      array: [1, 2, 3],
      nested: [{ a: 1 }, { b: 2 }],
    };

    const output = normalize(input);
    assertEquals(output, input);
  });

  // Tests mixed content
  await t.step("normalize mixed content", () => {
    const input = {
      string: "test",
      number: 123,
      object: { key: "value" },
      array: [1, { nested: "obj" }],
    };

    const output = normalize(input);
    assertEquals(output, input);
  });

  // Tests empty objects/arrays
  await t.step("normalize empty structures", () => {
    const input = {
      emptyObj: {},
      emptyArr: [],
      nullVal: null,
    };

    const output = normalize(input);
    assertEquals(output, input);
  });
});
