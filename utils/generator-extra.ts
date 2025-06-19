import type { AwaitableIterable } from "@gordonb/generator";

/** Create a map of items grouped by key from an async or sync iterable of entries */
export const groupsAsync = async <T>(
  entries: AwaitableIterable<[string, T]>,
): Promise<Map<string, T[]>> => {
  const index = new Map<string, T[]>();
  for await (const [key, item] of entries) {
    if (!index.has(key)) index.set(key, []);
    index.get(key)!.push(item);
  }
  return index;
};

/** Create a map of items indexed by key from an async or sync iterable of entries */
export const indexByAsync = async <T>(
  items: AwaitableIterable<[string, T]>,
): Promise<Map<string, T>> => {
  const index = new Map<string, T>();
  for await (const [key, item] of items) {
    index.set(key, item);
  }
  return index;
};
