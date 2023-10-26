import { db } from "../utils/db.server";
import type { User } from "@prisma/client";

type OnboardingInput = {
  storeUrl: string;
  storeTitle: string;
  storeDescription: string;
  userId: string;
  email: string;
};

export const allUsers = async (): Promise<User[]> => {
  return db.user.findMany({});
};

export const onboarding = async (body: OnboardingInput): Promise<User> => {
  return db.user.create({
    data: {
      id: body.userId,
      email: body.email,
      stores: {
        create: {
          storeUrl: body.storeUrl,
          storeTitle: body.storeTitle,
          storeDescription: body.storeDescription,
        },
      },
    },
    include: {
      stores: true,
    },
  });
};

//TODO:: make a mapping table between clerkUser and ourUser
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
