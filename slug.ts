const NON_SLUG_CHARS = new RegExp(`[\\[\\](){}\\<>:,;?!^&%$#@'\"|*~]`, "g");

const removeNonSlugChars = (s: string): string => s.replace(NON_SLUG_CHARS, "");

export const toSlug = (s: string): string =>
  removeNonSlugChars(s.trim().toLowerCase().replace(/\s+/g, "-"));
