import type { AwaitableIterable } from "@gordonb/generator";

/** Create a map of items grouped by key from an async or sync iterable of entries */
export const groupsAsync = async <T>(
  entries: AwaitableIterable<[string, T]>,
): Promise<Record<string, T[]>> => {
  const index: Record<string, T[]> = {};
  for await (const [key, item] of entries) {
    if (!Object.hasOwn(index, key)) index[key] = [];
    index[key]!.push(item);
  }
  return index;
};

/** Create a map of items indexed by key from an async or sync iterable of entries */
export const indexByAsync = async <T>(
  items: AwaitableIterable<[string, T]>,
): Promise<Record<string, T>> => {
  const index: Record<string, T> = {};
  for await (const [key, item] of items) {
    index[key] = item;
  }
  return index;
};
