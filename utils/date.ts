import { isDate, isNumber, isString } from "./check.ts";
import { format } from "@std/datetime";
import type { Option } from "@gordonb/result/option";

/**
 * Read timestamp from date-like thing.
 * @arg `datelike` can be a Date or parseable date string
 * @returns Option of number representing milliseconds since epoch
 */
export const parseDatelike = (datelike: unknown): Option<Date> => {
  if (isString(datelike) || isNumber(datelike) || isDate(datelike)) {
    return new Date(datelike);
  }
};

/** Get the four-digit year */
export const yyyy = (timestamp: number): string => {
  const date = new Date(timestamp);
  return format(date, "yyyy");
};

/** Get the two-digit month */
export const mm = (timestamp: number): string => {
  const date = new Date(timestamp);
  return format(date, "MM");
};

/** Get the two-digit day */
export const dd = (timestamp: number): string => {
  const date = new Date(timestamp);
  return format(date, "dd");
};
