import { isString } from "./check.ts";
import { format } from "@std/datetime";

export type Timestamp = number;

/**
 * Parse date string to Date
 * @returns Option of number representing milliseconds since epoch
 */
export const parseTimestamp = (dateString: string): number | null => {
  const timestamp = Date.parse(dateString);
  if (isNaN(timestamp)) {
    return null;
  }
  return timestamp;
};

export const getTimestamp = (date: Date): number => date.getTime();

/**
 * Read timestamp from date-like thing.
 * @arg `datelike` can be a Date or parseable date string
 * @returns Option of number representing milliseconds since epoch
 */
export const readTimestamp = (datelike: Date | string): number | null => {
  if (isString(datelike)) {
    return parseTimestamp(datelike);
  } else {
    return getTimestamp(datelike);
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
