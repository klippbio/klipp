import { db } from "../../utils/db.server";
import type { DigitalProduct } from "@prisma/client";
import { z } from "zod";

export const ZCreateDigitalProductSchema = z.object({
  name: z.string(),
  storeId: z.string(),
  price: z.string(),
});

export const allProducts = async (): Promise<DigitalProduct[]> => {
  return db.digitalProduct.findMany({});
};

export const createProduct = async (
  input: z.infer<typeof ZCreateDigitalProductSchema>
) => {
  const storeItemDigitalDownload = await db.storeItem.create({
    data: {
      itemType: "DIGITALPRODUCT",
      store: {
        connect: {
          id: input.storeId,
        },
      },
      DigitalProduct: {
        create: {
          name: input.name,
          price: input.price,
        },
      },
    },
  });

  return storeItemDigitalDownload;
};
