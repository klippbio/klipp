import { z } from "zod";
import { db } from "../../utils/db.server";
import { retriveChargeId } from "../../controllers/paymentController";

export const ZAccountSchema = z.object({
  accountId: z.string(),
});

export const ZStoreIdSchema = z.object({
  storeId: z.string(),
});

export const ZAccountDetailsSchema = z.object({
  accountId: z.string(),
  storeId: z.string(),
});

export const createAccount = async (
  input: z.infer<typeof ZAccountDetailsSchema>
) => {
  //auth
  const storeId = input.storeId;
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

//eslint-disable-next-line
export const handleUpdateAccount = async (input: any) => {
  const existingAccount = await db.payment.findUnique({
    where: {
      accountId: input.id,
    },
  });

  if (!existingAccount) {
    console.log("Account does not exist in the database", input);
    return;
  }

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

//eslint-disable-next-line
export const handleDeleteAccountFromDB = async (
  input: z.infer<typeof ZAccountDetailsSchema>
) => {
  //get account from db based on id from event
  //update charges enabled, transfers enabled, payouts enabled and onboarding complete details
  const account = await db.payment.delete({
    where: {
      accountId: input.accountId,
    },
  });
  return account;
};

export const getAccountDetails = async (
  input: z.infer<typeof ZStoreIdSchema>
) => {
  const storeId = input.storeId;
  const accountDetails = await db.payment.findFirst({
    where: {
      storeId: storeId,
    },
  });

  return accountDetails;
};

//eslint-disable-next-line
export const getAccountById = async (id: any) => {
  //this should be unique change it once testing is done
  const account = await db.payment.findMany({
    where: {
      accountId: id,
    },
  });

  return account;
};

//eslint-disable-next-line
export const saveTransactionDetails = async (session: any) => {
  const paymentIntent_id = session.data.object.payment_intent;
  const chargeId = await retriveChargeId(paymentIntent_id);
  const transactionData = db.transaction.create({
    data: {
      saleId: session.data.object.metadata.saleId,
      paymentIntent_id: paymentIntent_id,
      eventId: session.id,
      charge_id: chargeId,
    },
  });
  return transactionData;
};
