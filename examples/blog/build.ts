import * as docs from "../../docs.ts";
import * as markdown from "../../markdown.ts";
import * as io from "../../io.ts";
import * as liquid from "../../liquid.ts";
import { pipe } from "../../pipe.ts";

await io.removeRecursive("public");

await pipe(
  "./pages/*.md",
  docs.readMatching,
  docs.dumpErr,
  docs.parseFrontmatter,
  docs.dumpErr,
  docs.upliftMeta,
  markdown.renderMarkdownDocs,
  docs.autoSummary,
  docs.autoTemplate,
  liquid.renderLiquidDocs({
    root: "templates",
    context: {
      site: {
        title: "My Site",
      },
    },
  }),
  docs.build("public"),
);

console.log("Done!");
