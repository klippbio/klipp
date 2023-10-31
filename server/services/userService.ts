import { z } from "zod";
import { db } from "../utils/db.server";
import type { User } from "@prisma/client";

export const ZOnboardingInputSchema = z.object({
  storeUrl: z.string(),
  storeTitle: z.string(),
  storeDescription: z.string(),
  userId: z.string(),
  email: z.string().email(),
  timeZone: z.string(),
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
          storeUrl: input.storeUrl,
          storeTitle: input.storeTitle,
          storeDescription: input.storeDescription,
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
