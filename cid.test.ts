import { cid } from "./cid.ts";
import { assertEquals } from "@std/assert";

Deno.test("cid", async (t) => {
  await t.step(
    "Generates the same hash for the same value",
    () => {
      assertEquals(cid(true), cid(true));
    },
  );

  await t.step(
    "generates the same cid for the same JSON value with different key orders",
    () => {
      const a = {
        a: "a",
        b: "b",
        c: {
          x: "x",
          y: "y",
          z: "z",
        },
      };
      const cidA = cid(a);

      const b = {
        a: "a",
        c: {
          y: "y",
          x: "x",
          z: "z",
        },
        b: "b",
      };
      const cidB = cid(b);

      assertEquals(cidA, cidB);
    },
  );
});
