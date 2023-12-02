import { z } from "zod";
import { db } from "../../utils/db.server";

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
  });

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
