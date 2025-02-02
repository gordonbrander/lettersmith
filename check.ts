export const isString = (value: unknown): value is string =>
  typeof value === "string";

/** Is unknown a record? */
export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};
