import { assertEquals } from "@std/assert";
import { createCancelGroup } from "./cancel.ts";

Deno.test("createCancelGroup - should execute all added cancel functions", async () => {
  const group = createCancelGroup();
  let count = 0;

  const cancel1 = () => {
    count += 1;
  };
  const cancel2 = () => {
    count += 2;
  };

  // deno-lint-ignore require-await
  const cancel3 = async () => {
    count += 4;
  };

  group.add(cancel1);
  group.add(cancel2);
  group.add(cancel3);

  await group.cancel();

  assertEquals(count, 7);
});

Deno.test("createCancelGroup - should clear cancels after execution", async () => {
  const group = createCancelGroup();
  let count = 0;

  const cancel1 = () => {
    count += 1;
  };

  group.add(cancel1);
  await group.cancel();

  assertEquals(count, 1);

  // Cancel again - count should not increase
  await group.cancel();
  assertEquals(count, 1);
});
