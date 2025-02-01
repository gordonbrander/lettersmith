export type Option<T> = T | null | undefined;

export const isSome = <T>(value: Option<T>): value is T =>
  value !== null && value !== undefined;

export const isNone = <T>(value: Option<T>): value is null | undefined =>
  value === null || value === undefined;

export const unwrap = <T>(value: Option<T>): T => {
  if (isNone(value)) {
    throw new TypeError("Value is null or undefined");
  }
  return value;
};

export const unwrapOr = <T, U>(value: Option<T>, defaultValue: U): T | U =>
  isSome(value) ? value : defaultValue;

export const unwrapOrElse = <T, U>(value: Option<T>, fn: () => U): T | U =>
  isSome(value) ? value : fn();

export const map = <T, U>(value: Option<T>, fn: (value: T) => U): Option<U> =>
  isSome(value) ? fn(value) : null;

export const mapOr = <T, U>(
  value: Option<T>,
  defaultValue: U,
  fn: (value: T) => U,
): Option<U> => isSome(value) ? fn(value) : defaultValue;

export const mapOrElse = <T, U>(
  value: Option<T>,
  fn: () => U,
  defaultValue: U,
): Option<U> => isSome(value) ? fn() : defaultValue;
