export type JsonObject = { [key: string]: Json };
export type JsonArray = Json[];

export type Json =
  | string
  | number
  | boolean
  | null
  | JsonArray
  | JsonObject;

/**
 * Normalizes a JSON object by recursively sorting its keys in alphabetical order.
 * - For primitive values (string, number, boolean, null), returns the value unchanged
 * - For arrays, recursively normalizes each element
 * - For objects, sorts keys and recursively normalizes values
 *
 * @param obj - The JSON object to normalize
 * @returns The same JSON object with sorted keys
 */
export const normalize = (obj: Json): Json => {
  // Primitive
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // Array
  if (Array.isArray(obj)) {
    return obj.map(normalize) as unknown as Json;
  }

  // Object
  const sortedObj: Record<string, Json> = {};
  const sortedKeys = Object.keys(obj).sort();

  for (const key of sortedKeys) {
    sortedObj[key] = normalize(obj[key]);
  }

  return sortedObj as Json;
};
