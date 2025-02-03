import { array, type InferOutput, is, string } from "@valibot/valibot";

const TagsSchema = array(string());

export type Tags = InferOutput<typeof TagsSchema>;

/** Check if value is valid list of tags (array of strings) */
export const isTags = (value: unknown): value is Tags => is(TagsSchema, value);
