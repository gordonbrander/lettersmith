import { bundleTypescriptForBrowser } from "./js.ts";
import { assertEquals } from "@std/assert";

Deno.test("bundleForBrowser should bundle JavaScript for browser", async () => {
  const code = `
    const x: number = 1;
    const y: number = 2;
    export const sum = x + y;
  `;

  const bundled = await bundleTypescriptForBrowser(code, "test.ts");

  // Should be minified
  const expected = "const s=3;export{s as sum};";
  assertEquals(bundled.trim(), expected);
});
