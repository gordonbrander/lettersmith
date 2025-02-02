import * as lettersmith from "../../main.ts";
import { pipe } from "../../main.ts";

const x = lettersmith.docs.readMatching("pages/*.md");
console.log(await Array.fromAsync(x));

const finished = pipe(
  "./pages/*.md",
  lettersmith.docs.readMatching,
  lettersmith.docs.dumpErr,
  lettersmith.docs.build("public"),
);

await finished;
console.log("Done!");
