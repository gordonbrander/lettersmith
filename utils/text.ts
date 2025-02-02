export const splitLines = (text: string): string[] => text.split(/\r?\n/);

export const joinLines = (lines: string[]): string => lines.join("\n");

export const ELLIPSIS = "…";

/** Truncate text under length */
export const truncate = (
  text: string,
  maxChars: number,
  suffix: string = ELLIPSIS,
): string => {
  const stripped = text.trim();
  if (stripped.length <= maxChars) {
    return stripped;
  }
  const substring = text.slice(0, maxChars - suffix.length);
  const words = substring.split(/\s+/);
  const truncated = words.slice(0, -1).join(" ");
  return truncated + suffix;
};

export const truncate280 = (text: string): string => truncate(text, 280);
