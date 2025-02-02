export type Timestamp = number;

/** Parse date string to Date or null */
export const parseTimestamp = (dateString: string): number | null => {
  const timestamp = Date.parse(dateString);
  if (isNaN(timestamp)) {
    return null;
  }
  return timestamp;
};
