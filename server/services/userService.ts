import { z } from "zod";
import { db } from "../utils/db.server";
import type { User } from "@prisma/client";

export const ZOnboardingInputSchema = z.object({
  thumbnailUrl: z.string().optional(),
  username: z.string(),
  displayName: z.string(),
  description: z.string(),
  userId: z.string(),
  email: z.string().email(),
  timeZone: z.string().optional(),
});

export const ZOnboardingSocials = z.object({
  userId: z.string(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
});

export const allUsers = async (): Promise<User[]> => {
  return db.user.findMany({});
};

export const onboarding = async (
  input: z.infer<typeof ZOnboardingInputSchema>
) => {
  return db.user.create({
    data: {
      id: input.userId,
      email: input.email,
      stores: {
        create: {
          thumbnailUrl: input.thumbnailUrl,
          storeUrl: input.username,
          storeTitle: input.displayName,
          storeDescription: input.description,
          calendarSetting: {
            create: {
              timeZone: input.timeZone,
            },
          },
        },
      },
    },
    include: {
      stores: true,
    },
  });
};

export const onboardingSocials = async (
  input: z.infer<typeof ZOnboardingSocials>
) => {
  // Use findFirst to find the user's store based on userId
  const userStore = await db.store.findFirst({
    where: {
      userId: input.userId,
    },
  });

  // If no store is found, throw an error.
  if (!userStore) {
    throw new Error("No store found for the given user");
  }

  // Update the store with the social media links
  try {
    const updatedStore = await db.store.update({
      where: {
        id: userStore.id, // Use the store's ID for the update operation
      },
      data: {
        instagram: input.instagram,
        twitter: input.twitter,
        tiktok: input.tiktok,
        youtube: input.youtube,
      },
    });

    return updatedStore; // Return the updated store.
  } catch (error) {
    // Handle or throw the error as necessary.
    console.error("Failed to update social media links for the store:", error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  return db.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      email: true,
      stores: true,
    },
  });
};
