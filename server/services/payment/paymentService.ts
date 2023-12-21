import { z } from "zod";
import { db } from "../../utils/db.server";

export const ZAccountSchema = z.object({
  accountId: z.string(),
});

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

export const handleUpdateAccount = async (input: any) => {
  //get account from db based on id from event
  //update charges enabled, transfers enabled, payouts enabled and onboarding complete details

  const account = await db.payment.update({
    where: {
      accountId: input.id,
    },
    data: {
      onboardingComplete: input.details_submitted,
    },
  });
  return account;
};

export const handleDeleteAccountFromDB = async (input: any) => {
  //get account from db based on id from event
  //update charges enabled, transfers enabled, payouts enabled and onboarding complete details
  const account = await db.payment.delete({
    where: {
      accountId: input.accountId,
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

  if (accountDetails.length === 0) {
    return null;
  }
  return accountDetails;
};

export const getAccountById = async (id: any) => {
  //this should be unique change it once testing is done
  const account = await db.payment.findMany({
    where: {
      accountId: id,
    },
  });

  return account;
};
