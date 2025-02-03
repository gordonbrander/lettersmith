import type { Option } from "./option.ts";

export type Ok<T> = { ok: T };
export type Error<E> = { error: E };

export type Result<T, E> = Ok<T> | Error<E>;

/**
 * Creates a Result type with a value
 * @returns A Result containing the value as ok
 */
export const ok = <T>(value: T): Result<T, never> => ({ ok: value });

/**
 * Creates a Result type with an error value
 * @returns A Result containing the value as error
 */
export const err = <E>(value: E): Result<never, E> => ({ error: value });

export const isOk = <T, E>(result: Result<T, E>): result is Ok<T> =>
  "ok" in result;

export const isErr = <T, E>(result: Result<T, E>): result is Error<E> =>
  "error" in result;

export class ResultError<E> extends TypeError {
  error: E;

  constructor(message: string, error: E) {
    super(message);
    this.name = "ResultError";
    this.error = error;
  }
}

export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (isOk(result)) {
    return result.ok;
  }
  throw new ResultError(`Result is an error`, result.error);
};

export const unwrapOr = <T, U, E>(
  result: Result<T, E>,
  defaultValue: U,
): T | U => isOk(result) ? result.ok : defaultValue;

export const unwrapOrElse = <T, U, E>(
  result: Result<T, E>,
  defaultValue: (error: E) => U,
): T | U => isOk(result) ? result.ok : defaultValue(result.error);

export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> => isOk(result) ? ok(fn(result.ok)) : err(result.error);

export const mapOr = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
  defaultValue: U,
): U => isOk(result) ? fn(result.ok) : defaultValue;

export const mapOrElse = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
  defaultValue: (error: E) => U,
): U => isOk(result) ? fn(result.ok) : defaultValue(result.error);

export const mapErr = <T, E, U>(
  result: Result<T, E>,
  fn: (error: E) => U,
): Result<T, U> => isErr(result) ? err(fn(result.error)) : ok(result.ok);

export const toOption = <T, E>(value: Result<T, E>): Option<T> =>
  isOk(value) ? value.ok : null;

/**
 * Perform a throwing function and return a Result
 * @param fn - The function to perform
 * @returns A Result containing either the value or the error that was thrown
 */
export const perform = <T, E>(fn: () => T): Result<T, E> => {
  try {
    return ok(fn());
  } catch (error) {
    return err(error as E);
  }
};

/**
 * Perform an async throwing function and return a promise for a Result
 * @param fn - The function to perform
 * @returns A Result containing either the value or the error that was thrown
 */
export const performAsync = async <T, E>(
  fn: () => Promise<T>,
): Promise<Result<T, E>> => {
  try {
    return ok(await fn());
  } catch (error) {
    return err(error as E);
  }
};
