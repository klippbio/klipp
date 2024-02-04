import { db } from "../utils/db.server";
import type { Store } from "@prisma/client";

export const checkStoreUrlExists = async (
  storeUrl: string
): Promise<Store | null> => {
  if (!storeUrl) {
    throw new Error("storeUrl must be a non-empty string");
  }
  return db.store.findUnique({
    where: {
      storeUrl: storeUrl,
    },
  });
};
