import { db } from "../utils/db.server";

type Product = {
  id: string;
  name: string;
  shortDescription: string;
  thumbnailUrl: string;
  createdBy: string;
  createdAt: Date;

  //make type for links
};

export const create = async (body: any): Promise<Product | null> => {
  const { name, shortDescription, createdBy, thumbnailUrl } = body;
  return db.DigitalProduct.create({
    data: {
      name: name,
      shortDescription: shortDescription,
      createdBy: createdBy,
      createdAt: new Date(),
      thumbnailUrl: thumbnailUrl,
    },
  });
};
