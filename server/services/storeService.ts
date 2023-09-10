import { db } from "../utils/db.server";
import type { Store } from "@prisma/client";

export const checkStoreUrlExists = async (
  storeUrl: string
): Promise<Store | null> => {
  return db.store.findUnique({
    where: {
      storeUrl: storeUrl,
    },
  });
};
