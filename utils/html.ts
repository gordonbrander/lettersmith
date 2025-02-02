const TAGS_REGEX = /<[^<]+?>/gm;

/**
 * Fast and simple HTML/XML tag stripping.
 * Note: this is not a true parsing and sanitization function. It just
 * does a naive regex replace.
 * Do not use it for potentially unsafe/untrusted markup.
 */
export const stripTags = (markup: string): string =>
  markup.replace(TAGS_REGEX, "");
