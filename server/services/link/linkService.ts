import { z } from "zod";
import { db } from "../../utils/db.server";

// Define the schema for the input
export const ZCreateLinkProductSchema = z.object({
  storeId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  url: z.string(),
});

export const ZGetOrDeleteFile = z.object({
  id: z.string(),
});

// Function to create a CalendarProduct
export const createLinkProduct = async (
  input: z.infer<typeof ZCreateLinkProductSchema>
) => {
  const storeItemLink = await db.storeItem.create({
    data: {
      itemType: "LINK",
      store: {
        connect: {
          id: input.storeId,
        },
      },
      Link: {
        create: {
          title: input.title,
          description: input.description,
          thumbnailUrl: input.thumbnailUrl,
          url: input.url,
        },
      },
    },
    include: {
      Link: true,
    },
  });

  return storeItemLink;
};

export const getAllLinks = async (input: z.infer<typeof ZGetOrDeleteFile>) => {
  const links = await db.link.findMany({
    where: {
      storeItem: {
        storeId: input.id,
      },
    },
    select: {
      title: true,
      description: true,
      thumbnailUrl: true,
      url: true,
      id: true,
    },
  });
  return links;
};

export const deleteLink = async (input: z.infer<typeof ZGetOrDeleteFile>) => {
  const linkProductId = input.id;
  const linkProduct = await db.link.findUnique({
    where: {
      id: linkProductId,
    },
  });

  if (!linkProduct) {
    throw new Error("Link not found");
  }

  // Step 2: Get the associated StoreItem ID
  const storeItemId = linkProduct.storeItemId;

  // Step 3: Delete the link
  await db.link.delete({
    where: {
      id: linkProductId,
    },
  });

  // Step 4: Delete the associated StoreItem
  await db.storeItem.delete({
    where: {
      id: storeItemId,
    },
  });
  return linkProduct;
};
