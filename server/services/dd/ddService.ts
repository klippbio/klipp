import { db } from "../../utils/db.server";
import type { DigitalProduct } from "@prisma/client";
import { z } from "zod";

export const ZCreateDigitalProductSchema = z.object({
  name: z.string(),
  storeId: z.string(),
  price: z.string(),
});

export const ZUpdateDigitalProductSchema = z.object({
  name: z.string().optional(),
  shortDescription: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  externalFile: z.boolean().optional().default(false),
  file: z.string().optional(),
  currency: z.string().array().default(["USD"]),
  price: z.string().default("0"),
  recPrice: z.string().optional(),
  minPrice: z.string().optional(),
  flexPrice: z.boolean().optional().default(false),
  visibility: z.boolean().optional().default(false),
});

export const ZAddDDFile = z.object({
  name: z.string(),
  url: z.string(),
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

export const updateProduct = async (id: any, input: any) => {
  const refinedData = {
    name: input.name,
    shortDescription: input.shortDescription,
    thumbnailUrl: input.thumbnailUrl,
    externalFile: input.externalFile,
    currency: input.currency,
    price: input.price,
    recPrice: input.recPrice,
    minPrice: input.minPrice,
    flexPrice: input.flexPrice,
    visibility: input.visibility,
  };

  const parsedRefinedData = await ZUpdateDigitalProductSchema.parseAsync(
    refinedData
  );

  const descriptionJSON = JSON.stringify(input.description);
  const urlsJSON = JSON.stringify(input.urls);
  console.log(descriptionJSON, urlsJSON);

  const updatedProduct = await db.digitalProduct.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name: parsedRefinedData.name,
      shortDescription: parsedRefinedData.shortDescription,
      thumbnailUrl: parsedRefinedData.thumbnailUrl,
      externalFile: parsedRefinedData.externalFile,
      //   file: parsedRefinedData.file,
      currency: parsedRefinedData.currency,
      price: parsedRefinedData.price,
      recPrice: parsedRefinedData.recPrice,
      minPrice: parsedRefinedData.minPrice,
      flexPrice: parsedRefinedData.flexPrice,
      visibility: parsedRefinedData.visibility,
      description: descriptionJSON,
      urls: urlsJSON,
    },
  });

  return updatedProduct;
};

export const updateFile = async (
  id: any,
  input: z.infer<typeof ZAddDDFile>
) => {
  const allFiles = await db.dDFile.create({
    data: {
      name: input.name,
      url: input.url,
      digitalProduct: {
        connect: {
          id: parseInt(id),
        },
      },
    },
  });

  return allFiles;
};

export const deleteFile = async (id: any) => {
  const allFiles = await db.dDFile.delete({
    where: {
      id: id,
    },
  });
  return allFiles;
};

export const getProduct = async (id: any) => {
  const product = await db.digitalProduct.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      ddFiles: true,
    },
  });

  return product;
};
