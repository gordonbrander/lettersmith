const HASHTAG = /#(\w+)/g;

/** Get all hashtags in a piece of text */
export function* findHashtags(text: string): Generator<string> {
  for (const match of text.matchAll(HASHTAG)) {
    yield match[1];
  }
}

/** Normalize text to hashtag body */
export const toTag = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/\-+/g, "_")
    .replace(/[^\w_]/g, "");
};

/** Create a set of unique tags */
export const uniqueTags = (texts: string[]): Set<string> =>
  new Set(texts.map(toTag));

export const toHashtag = (text: string) => `#${toTag(text)}`;
