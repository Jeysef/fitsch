import * as v from "valibot";
import { menuPersistedData } from "~/components/menu/schema";
import { mergedStoreSchema } from "~/store/storeSchema";

const importJsonSchema = v.object({
  store: mergedStoreSchema,
  submittedData: menuPersistedData,
});

const oldImportJsonSchema = v.pipe(
  mergedStoreSchema,
  v.transform((data) => ({ store: data, submittedData: undefined }))
);

const mergedImportJsonSchema = v.union([importJsonSchema, oldImportJsonSchema]);

export const parseImportJsonSchema = (data: unknown) => {
  return v.safeParse(mergedImportJsonSchema, data);
};
