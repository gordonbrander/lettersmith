import { recent } from "./docs.ts";
import { assertEquals } from "@std/assert";
import * as doc from "./doc.ts";

Deno.test("recent", async (t) => {
  await t.step("yields sorted docs, stoping at limit", async function () {
    const docs = [
      doc.create({
        id: "1",
        created: 1000,
      }),
      doc.create({
        id: "2",
        created: 2000,
      }),
      doc.create({
        id: "3",
        created: 3000,
      }),
    ];

    const result = recent(docs, 2);
    const collected = await Array.fromAsync(result);

    assertEquals(collected.length, 2);
    assertEquals(collected[0].id, "3"); // Most recent first
    assertEquals(collected[1].id, "2");
  });

  await t.step("yields no docs for zero limit", async function () {
    const docs = [
      doc.create({
        id: "1",
        created: 1000,
      }),
    ];

    const result = recent(docs, 0);
    const collected = await Array.fromAsync(result);
    assertEquals(collected.length, 0);
  });

  await t.step(
    "yields as many docs as there are, for limits larger than input",
    async function () {
      const docs = [
        doc.create({
          id: "1",
          created: 1000,
        }),
      ];

      const result = recent(docs, 5);
      const collected = await Array.fromAsync(result);
      assertEquals(collected.length, 1);
    },
  );
});
