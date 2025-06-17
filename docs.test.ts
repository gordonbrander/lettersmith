import { recent, removeDrafts, removeIndex } from "./docs.ts";
import { assertEquals } from "@std/assert";
import * as doc from "./doc.ts";

Deno.test("recent", async (t) => {
  await t.step("yields sorted docs, stoping at limit", async function () {
    const docs = [
      doc.create({
        id: "1",
        created: new Date(1000),
      }),
      doc.create({
        id: "2",
        created: new Date(2000),
      }),
      doc.create({
        id: "3",
        created: new Date(3000),
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
        created: new Date(1000),
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
          created: new Date(1000),
        }),
      ];

      const result = recent(docs, 5);
      const collected = await Array.fromAsync(result);
      assertEquals(collected.length, 1);
    },
  );
});

Deno.test("removeDrafts", async (t) => {
  await t.step("removes docs marked as drafts", async function () {
    const docs = [
      doc.create({
        id: "1",
        meta: { draft: true },
      }),
      doc.create({
        id: "2",
        meta: { draft: false },
      }),
      doc.create({
        id: "3",
        meta: {},
      }),
    ];

    const result = removeDrafts(docs);
    const collected = await Array.fromAsync(result);

    assertEquals(collected.length, 2);
    assertEquals(collected[0].id, "2");
    assertEquals(collected[1].id, "3");
  });
});

Deno.test("removeIndex", async (t) => {
  await t.step("removes index.md from docs", async function () {
    const docs = [
      doc.create({
        id: "index.md",
      }),
      doc.create({
        id: "other.md",
      }),
      doc.create({
        id: "another.md",
      }),
    ];

    const result = removeIndex(docs);
    const collected = await Array.fromAsync(result);

    assertEquals(collected.length, 2);
    assertEquals(collected[0].id, "other.md");
    assertEquals(collected[1].id, "another.md");
  });
});
