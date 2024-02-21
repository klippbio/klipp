import { db } from "../../utils/db.server";
import type { DigitalProduct } from "@prisma/client";
import { z } from "zod";
import CustomError from "../../utils/CustomError";

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

export const ZGetOrDeleteFile = z.object({
  id: z.string(),
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
    include: {
      DigitalProduct: true,
    },
  });

  return storeItemDigitalDownload;
};

//eslint-disable-next-line
export const updateProduct = async (id: string, input: any) => {
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

  const updatedProduct = await db.digitalProduct.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name: parsedRefinedData.name,
      shortDescription: parsedRefinedData.shortDescription,
      thumbnailUrl: parsedRefinedData.thumbnailUrl,
      externalFile: parsedRefinedData.externalFile,
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
  inputId: z.infer<typeof ZGetOrDeleteFile>,
  input: z.infer<typeof ZAddDDFile>
) => {
  const allFiles = await db.dDFile.create({
    data: {
      name: input.name,
      url: input.url,
      digitalProduct: {
        connect: {
          id: parseInt(inputId.id),
        },
      },
    },
  });

  return allFiles;
};

export const deleteFile = async (input: z.infer<typeof ZGetOrDeleteFile>) => {
  const allFiles = await db.dDFile.delete({
    where: {
      id: input.id,
    },
  });
  return allFiles;
};

export const getProduct = async (input: z.infer<typeof ZGetOrDeleteFile>) => {
  const product = await db.digitalProduct.findUnique({
    where: {
      id: parseInt(input.id),
    },
    include: {
      ddFiles: true,
    },
  });
  if (!product) {
    throw new CustomError("Product not found", 404);
  }
  return product;
};

export const getAllDigitalProducts = async (storeId: string) => {
  const digitalProducts = await db.digitalProduct.findMany({
    where: {
      storeItem: {
        storeId: storeId,
      },
    },
    select: {
      name: true,
      id: true,
      price: true,
      currency: true,
      visibility: true,
    },
  });
  return digitalProducts;
};

export const deleteDigitalProduct = async (
  input: z.infer<typeof ZGetOrDeleteFile>
) => {
  const digitalProductId = parseInt(input.id);
  const digitalProduct = await db.digitalProduct.findUnique({
    where: {
      id: digitalProductId,
    },
  });

  if (!digitalProduct) {
    throw new Error("DigitalProduct not found");
  }

  // Step 2: Get the associated StoreItem ID
  const storeItemId = digitalProduct.storeItemId;

  // Step 3: Delete the DigitalProduct
  await db.digitalProduct.delete({
    where: {
      id: digitalProductId,
    },
  });

  // Step 4: Delete the associated StoreItem
  await db.storeItem.delete({
    where: {
      id: storeItemId,
    },
  });
  return digitalProduct;
};
