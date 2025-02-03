import { isString } from "./check.ts";

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
