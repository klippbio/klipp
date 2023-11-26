import { z } from "zod";
import { db } from "../../utils/db.server";
import type { User } from "@prisma/client";

export const ZAccountSchema = z.object({
  accountId: z.string(),
});

export const test = async (): Promise<User[]> => {
  return db.user.findMany({});
};

export const createAccount = async (input: z.infer<typeof ZAccountSchema>) => {
  const storeId = "e2444f66-3887-41de-b03f-aa807828879d";
  const account = await db.payment.create({
    data: {
      accountId: input.accountId,
      store: {
        connect: {
          id: storeId,
        },
      },
    },
  });
  return account;
};

export const getAccountDetails = async () => {
  const storeId = "e2444f66-3887-41de-b03f-aa807828879d";

  //this should be unique change it once testing is done
  const accountDetails = await db.payment.findMany({
    where: {
      storeId: storeId,
    },
  });

  return accountDetails;
};
