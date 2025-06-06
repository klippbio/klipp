import { db } from "../utils/db.server";
import type { Store } from "@prisma/client";

export const checkStoreUrlExists = async (
  storeUrl: string
): Promise<Store | null> => {
  if (!storeUrl) {
    throw new Error("storeUrl must be a non-empty string");
  }
  if (storeUrl === "/dashboard") {
    throw new Error("storeUrl cannot be /dashboard");
  }
  return db.store.findUnique({
    where: {
      storeUrl: storeUrl.toLowerCase(),
    },
  });
};

export const getStoreFromStoreUrl = async (storeUrl: string) => {
  return await db.store.findUnique({
    where: {
      storeUrl: storeUrl.toLowerCase(),
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });
};

// export const getStoreFromStoreId = async (
//   storeId: string
// ): Promise<Store | null> => {
//   if (!storeUrl) {
//     throw new Error("storeUrl must be a non-empty string");
//   }
//   if (storeUrl === "/dashboard") {
//     throw new Error("storeUrl cannot be /dashboard");
//   }
//   return db.store.findUnique({
//     where: {
//       storeUrl: storeUrl.toLowerCase(),
//     },
//   });
// };
