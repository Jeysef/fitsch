import { storeSchema as storeSchemaV1 } from "~/store/storeSchema-v1";
import { StoreJson as StoreJsonV2, storeSchema as storeSchemaV2 } from "~/store/storeSchema-v2";

const mergedStoreSchema = storeSchemaV2.or(storeSchemaV1);

export type StoreJson = StoreJsonV2;
/**
 * Parses a JSON object against the store schema.
 * @param json The raw JSON object to parse.
 * @returns A Zod SafeParseReturnType indicating success or failure.
 */
export function parseStoreJson(json: unknown) {
  return mergedStoreSchema.safeParseAsync(json);
}

export function parseStoreJsonSync(json: unknown) {
  return mergedStoreSchema.safeParse(json);
}

export function parseStoreJsoUnsafeSync(json: unknown) {
  return mergedStoreSchema.parse(json);
}
