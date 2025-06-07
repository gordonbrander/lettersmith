# Lettersmith

A library of static site generation tools for Deno.

Lettersmith is based on a simple idea: load files as objects, and transform them
lazily using async generators.

Lettersmith is a library, not a framework. It provides functions to transform
doc objects and async generators. You piece them together into a build pipeline.

## Installation

```cli
deno add jsr:@gordonb/lettersmith
```

## Quick start

Here's an example of a simple Markdown blog:

```ts
import {
  args,
  copy,
  docs,
  lettersmith,
  liquid,
  markdown,
  permalink,
  pipe,
} from "@gordonb/lettersmith";

// Our main build function
const build = async (output) => {
  const site = {
    title: "My website",
    description: "My website description",
  };

  const posts = pipe(
    // Load doc objects
    docs.readMatching("posts/*.md"),
    // Parse frontmatter
    docs.meta,
    // Set permalink
    permalink.permalinkDocs(({ slug }) => `posts/${slug}/index.html`),
    // Render markdown
    markdown.renderMarkdownDocs,
    // Render liquid template (looks for `template` in frontmatter)
    liquid.renderLiquidDocs({
      context: {
        site,
      },
    }),
  );

  // Build posts
  await docs.build(output, posts);
  // Copy some static files
  await copy("theme", `${output}/theme`);
};

// Pass build function to lettersmith
// This will handle serving, watching, and cleaning output directory
lettersmith({
  build,
  // Output directory - lettersmith will serve and clean this
  output: "public",
  // Pass in watch and serve options from CLI
  ...args(),
});
```

## Core concepts

### Docs

A `Doc` is a simple JavaScript object representing a document:

```ts
type Doc = {
  id: string; // Source file path
  outputPath: string; // Where to write the file
  templatePath: string; // Template to use for rendering
  created: number; // Creation timestamp
  modified: number; // Modification timestamp
  title: string; // Document title
  summary: string; // Document summary/excerpt
  content: string; // Document content
  tags: string[]; // Document tags
  meta: Record<string, unknown>; // Frontmatter metadata
};
```

### Generators

Lettersmith uses async generators to process documents lazily. This means you
can work with thousands of files without loading them all into memory at once.

```ts
// Read and transform documents
const posts = pipe(
  docs.readMatching("posts/*.md"),
  docs.meta,
  markdown.renderMarkdownDocs,
);

// Process them one by one
for await (const post of posts) {
  console.log(post.title);
}
```

### Pipeline composition

Use `pipe()` to compose transformations:

```ts
import { pipe } from "@gordonb/lettersmith";

const processedDocs = pipe(
  docs.readMatching("**/*.md"),
  docs.meta, // Parse frontmatter
  docs.removeDrafts, // Remove draft posts
  markdown.renderMarkdownDocs, // Convert markdown to HTML
  docs.setExtension(".html"), // Change file extension
);
```

## Command line usage

Pass command line arguments to control behavior:

```bash
# Build once
deno run -A build.ts

# Watch for changes and rebuild
deno run -A build.ts --watch

# Serve files during development
deno run -A build.ts --watch --serve

# Custom output directory
deno run -A build.ts --output dist
```

In your build script:

```ts
lettersmith({
  build,
  ...args(), // Parse CLI arguments
});
```

## License

MIT License
