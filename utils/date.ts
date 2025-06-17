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
export const yyyy = (date: Date): string => format(date, "yyyy");

/** Get the two-digit month */
export const mm = (date: Date): string => format(date, "MM");

/** Get the two-digit day */
export const dd = (date: Date): string => format(date, "dd");
