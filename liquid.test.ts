import { assertEquals } from "@std/assert";
import { renderLiquidDoc } from "./liquid.ts";
import { create as createDoc } from "./doc.ts";

Deno.test("renderLiquidDoc - should return doc unchanged when templatePath is undefined", async () => {
  const doc = createDoc({
    id: "hello.md",
    content: "Hello world",
    templatePath: undefined,
  });

  const result = await renderLiquidDoc(doc);
  assertEquals(result, doc);
});

Deno.test("renderLiquidDoc - should render doc with template", async () => {
  // Create a temporary template file
  const templateDir = await Deno.makeTempDir();
  const templateContent = "<html><body>{{ content }}</body></html>";
  await Deno.writeTextFile(`${templateDir}/test.html`, templateContent);

  const doc = createDoc({
    id: "hello.md",
    content: "Hello world",
    templatePath: "test.html",
  });

  const result = await renderLiquidDoc(doc, {
    root: templateDir,
  });

  assertEquals(result.content, "<html><body>Hello world</body></html>");

  // Cleanup
  await Deno.remove(templateDir, { recursive: true });
});

Deno.test("renderLiquidDoc - should render liquid in doc content first", async () => {
  // Create a temporary template file
  const templateDir = await Deno.makeTempDir();
  const templateContent = "<html><body>{{ content }}</body></html>";
  await Deno.writeTextFile(`${templateDir}/test.html`, templateContent);

  const doc = createDoc({
    id: "hello.md",
    content: "Hello {{ meta.name }}",
    templatePath: "test.html",
    meta: {
      name: "Alice",
    },
  });

  const result = await renderLiquidDoc(doc, {
    root: templateDir,
  });

  assertEquals(result.content, "<html><body>Hello Alice</body></html>");

  // Cleanup
  await Deno.remove(templateDir, { recursive: true });
});
