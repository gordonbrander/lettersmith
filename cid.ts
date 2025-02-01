import { Json, normalize } from "./json.ts";
import { pipe } from "./pipe.ts";
import { sha256 } from "@noble/hashes/sha256";

export const sha256hex = (string: string): string => {
  const hashBytes = sha256(string);
  return Array.from(hashBytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export type Cid = string;

/** Generate a CID for a JSON value */
export const cid = (value: Json): Cid =>
  pipe(value, normalize, JSON.stringify, sha256hex);

export default cid;
