import * as v from "@valibot/valibot";

/** Creates a type guard function from a valibot schema */
export const guard = <
  TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(
  schema: TSchema,
) => {
  return (value: unknown): value is v.InferOutput<TSchema> => {
    try {
      v.parse(schema, value);
      return true;
    } catch {
      return false;
    }
  };
};

export const StringSchema = v.string();

/** Is value a string? */
export const isString = guard(StringSchema);

export const DateSchema = v.date();

/** Is value a date type? */
export const isDate = guard(DateSchema);

export const NumberSchema = v.number();

/** Is value a number? */
export const isNumber = guard(NumberSchema);

export const RecordSchema = v.nonNullable(v.record(v.string(), v.unknown()));

/** Is value a record? */
export const isRecord = guard(RecordSchema);
