/** Is value a string */
export const isString = (value: unknown): value is string =>
  typeof value === "string";

/** Is value a record? */
export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

/** Is value a date type? */
export const isDate = (value: unknown): value is Date => value instanceof Date;
