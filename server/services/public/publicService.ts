import { z } from "zod";
import { db } from "../../utils/db.server";
import CustomError from "../../utils/CustomError";

export const ZUserName = z.object({
  userName: z.string(),
});

export const ZProduct = z.object({
  id: z.string(),
  userName: z.string(),
});

export const getPublicUser = async (input: z.infer<typeof ZUserName>) => {
  const publicUser = await db.store.findUnique({
    where: {
      storeUrl: input.userName,
    },
    include: {
      storeItems: true,
    },
  });
  return publicUser;
};

export const getPublicProduct = async (input: z.infer<typeof ZProduct>) => {
  const product = await db.storeItem.findUnique({
    where: {
      id: parseInt(input.id),
    },
  });

  const store = await db.store.findUnique({
    where: {
      storeUrl: input.userName,
    },
  });

  if (store?.id !== product?.storeId)
    throw new CustomError("Product not found", 404);

  if (product?.itemType === "DIGITALPRODUCT") {
    const digitalProduct = await db.digitalProduct.findUnique({
      where: {
        storeItemId: parseInt(input.id),
      },
    });
    return { ...product, itemDetails: digitalProduct };
  }
  if (product?.itemType === "CALENDAR") {
    const calendar = await db.calendarProduct.findUnique({
      where: {
        storeItemId: parseInt(input.id),
      },
    });
    if (!calendar) return product;
    const itemDetails = { ...calendar, name: calendar.title };
    return { ...product, itemDetails };
  }

  return product;
};
