import { serveDir } from "@std/http/file-server";
import type { Path } from "./utils/path.ts";

/** Serve static directory at path */
export const serve = (
  {
    dir,
    port = 8000,
    hostname = "0.0.0.0",
  }: {
    dir: Path;
    port?: number;
    hostname?: string;
  },
): Deno.HttpServer<Deno.NetAddr> =>
  Deno.serve({ port, hostname }, (req) =>
    serveDir(req, {
      fsRoot: dir,
      showDirListing: true,
    }));
