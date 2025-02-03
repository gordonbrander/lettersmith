import {
  array,
  type ArraySchema,
  type InferOutput,
  is,
  string,
  type StringSchema,
} from "@valibot/valibot";

const TagsSchema: ArraySchema<StringSchema<string>, string> = array(
  string("Tag must be string"),
  "Tags must be array of strings",
);

export type Tags = InferOutput<typeof TagsSchema>;

/** Check if value is valid list of tags (array of strings) */
export const isTags = (value: unknown): value is Tags => is(TagsSchema, value);
