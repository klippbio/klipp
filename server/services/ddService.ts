import { StoreItemType } from "@prisma/client";
import { db } from "../utils/db.server";

type Request = {
  id: string;
  name: string;
  shortDescription: string;
  thumbnail: string;
  userId: string;
  createdAt: Date;
};

type Response = {
  id: string;
};

export const create = async (body: Request): Promise<Response> => {
  const { name, shortDescription, thumbnail, userId } = body;

  try {
    //for now we will just have one store per user
    const storeId = await db.store.findFirstOrThrow({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    const createdStoreItem = await db.storeItem.create({
      data: {
        itemType: StoreItemType.DIGITALPRODUCT,
        storeId: storeId?.id,
      },
      select: {
        id: true,
      },
    });

    const createdDigitalProduct = await db.digitalProduct.create({
      data: {
        name: name,
        shortDescription: shortDescription,
        createdBy: userId,
        createdAt: new Date(),
        thumbnailUrl: thumbnail,
        description: "",
        storeItemId: createdStoreItem?.id,
      },
      select: {
        id: true,
      },
    });
    return createdDigitalProduct;
  } catch (error) {
    throw new Error(`Error creating product: ${error}`);
  }
};
