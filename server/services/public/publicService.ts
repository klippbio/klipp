import { z } from "zod";
import { db } from "../../utils/db.server";
import type { DigitalProduct } from "@prisma/client";
import { parse } from "path";

export const ZUserName = z.object({
  userName: z.string(),
});

export const ZProductId = z.object({
  id: z.string(),
});

export const getPublicUser = async (input: z.infer<typeof ZUserName>) => {
  const publicUser = await db.store.findUnique({
    where: {
      storeUrl: input.userName,
    },
    include: {
      storeItems: {
        include: {
          DigitalProduct: true,
        },
      },
    },
  });
  return publicUser;
};

export const getPublicProduct = async (input: z.infer<typeof ZProductId>) => {
  const product = await db.storeItem.findUnique({
    where: {
      id: parseInt(input.id),
    },
    include: {
      DigitalProduct: {
        select: {
          id: true,
          name: true,
          price: true,
          recPrice: true,
          minPrice: true,
          flexPrice: true,
          currency: true,
          shortDescription: true,
          thumbnailUrl: true,
          description: true,
          visibility: true,
        },
      },
    },
  });
  return product;
};
