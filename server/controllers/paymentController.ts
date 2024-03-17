import express from "express";
import { Request, Response } from "express";
import {
  ZStoreIdSchema,
  createAccount,
  getAccountDetails,
  handleDeleteAccountFromDB,
} from "../services/payment/paymentService";
import CustomError from "../utils/CustomError";
import { env } from "process";
import { z } from "zod";
import { isUsersStore } from "../middlewares/isUsersStore";

export const paymentController = express.Router();

const STRIPE_TEST_KEY = env.STRIPE_TEST_KEY;
//eslint-disable-next-line
const stripe = require("stripe")(STRIPE_TEST_KEY);

async function getStripeAccountId(storeId: string) {
  const accountDetails = await getAccountDetails(
    await ZStoreIdSchema.parseAsync({ storeId: storeId })
  );
  return accountDetails?.accountId;
}

export const ZCreateNewSaleSchema = z.object({
  storeId: z.string(),
  productName: z.string(),
  price: z.number(),
  currency: z.string(),
  thumbnailUrl: z.string(),
  saleId: z.number().optional(),
  cancelUrl: z.string().optional(),
  from_name: z.string().optional(),
  from_email: z.string().optional(),
  to_email: z.string().optional(),
  to_name: z.string().optional(),
  subject: z.string().optional(),
  itemType: z.string().optional(),
  itemName: z.string().optional(),
});

export default async function createCheckoutSession(
  data: z.infer<typeof ZCreateNewSaleSchema>
) {
  const accountId = await getStripeAccountId(data.storeId);
  const successUrl = process.env.FRONTEND_URL + "/sale/" + data.saleId;
  const price = data.price * 100;
  const platformFee = Math.round(price * 0.05);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: data.currency,
          product_data: {
            name: data.productName,
          },
          unit_amount: price,
        },
      },
    ],
    payment_intent_data: {
      transfer_data: {
        destination: accountId,
      },
      application_fee_amount: platformFee,
      on_behalf_of: accountId,
    },
    success_url: successUrl,
    cancel_url: data.cancelUrl,
    metadata: {
      saleId: data.saleId,
      from_name: data.from_name,
      to_email: data.to_email,
      to_name: data.to_name,
      subject: data.subject,
      link: successUrl,
      from_email: data.from_email,
      itemType: data.itemType,
      itemName: data.itemName,
    },
  });

  return session.url;
}

export async function retriveChargeId(paymentIntent_id: string) {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntent_id);
  return paymentIntent.latest_charge;
}

export async function refundCharge(chargeId: string) {
  const refund = await stripe.refunds.create({
    charge: chargeId,
  });
  return refund;
}

paymentController.post(
  "/connect",
  isUsersStore,
  async (req: Request, res: Response) => {
    //TODO
    //Config params properly
    //Config Merchant codes
    //Config service aggreement based on locations. IF Us full else receipeint
    //Check CSRF token issue
    //Use publishable key and secret key intead of test keyt
    //handle unfinished onboarding
    try {
      //creating stripe account

      const account = await stripe.accounts.create({
        country: req.body.country,
        type: "express",
        capabilities: {
          card_payments: {
            requested: true,
          },
          transfers: {
            requested: true,
          },
        },
        business_profile: {
          url: "https://klipp.io",
        },
      });

      //saving details in db
      await createAccount({ accountId: account.id, storeId: req.body.storeId });
      //generating account link
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: "https://klipp.io/reauth",
        return_url: process.env.FRONTEND_URL + "/dashboard/payments",
        type: "account_onboarding",
      });

      res.status(200).json(accountLink);
    } catch (error) {
      console.log("Error Occured at", req.url, "Error Details: ", error);
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

paymentController.post(
  "/pendingAccount",
  isUsersStore,
  async (req: Request, res: Response) => {
    try {
      //creating stripe account
      const accountId = req.body.accountId;
      //generating account link
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: "https://klipp.io/reauth",
        return_url: process.env.FRONTEND_URL + "/dashboard/payments",
        type: "account_onboarding",
      });
      res.status(200).json(accountLink);
    } catch (error) {
      console.log("Error Occured at", req.url, "Error Details: ", error);
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

// paymentController.post(
//   "/webhooks/stripe",
//   async (req: Request, res: Response) => {
//     try {
//       if (req.body.type === "account.updated") {
//         handleUpdateAccount(req.body.data.object);
//       }
//       res.status(200).json("ok");
//     } catch (error) {
//       if (error instanceof CustomError)
//         res.status(error.statusCode).json({ error: error.message });
//       else res.status(500).json({ error: error });
//     }
//   }
// );

paymentController.post(
  "/disconnect",
  isUsersStore,
  async (req: Request, res: Response) => {
    try {
      // Deleting the Stripe account
      // const deleted = await stripe.accounts.del(req.body.accountId);

      // if (deleted.deleted) {
      await handleDeleteAccountFromDB(req.body);

      res.status(200).json({ message: "Account successfully disconnected" });
      // } else {
      //   res.status(500).json({ error: "Failed to disconnect the account" });
      // }
    } catch (error) {
      console.log("Error Occured at", req.url, "Error Details: ", error);
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

paymentController.get(
  "/stripeAccountDetails",
  isUsersStore,
  async (req: Request, res: Response) => {
    try {
      const storeId = req.query.storeId;
      const accountDetails = await getAccountDetails(
        await ZStoreIdSchema.parseAsync({ storeId: storeId })
      );
      res.status(201).json(accountDetails);
    } catch (error) {
      console.log("Error Occured at", req.url, "Error Details: ", error);
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

paymentController.get(
  "/stripeaccountbalance",
  isUsersStore,
  async (req: Request, res: Response) => {
    const accountId = req.query.stripeAccountId;
    try {
      const balance = await stripe.balance.retrieve({
        stripeAccount: accountId,
      });
      res.status(200).json(balance);
    } catch (error) {
      console.log("Error Occured at", req.url, "Error Details: ", error);
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

paymentController.post(
  "/payout",
  isUsersStore,
  async (req: Request, res: Response) => {
    try {
      const balance = await stripe.balance.retrieve({
        stripeAccount: req.body.accountId,
      });
      const { amount, currency } = balance.available[0];
      // Create a payout
      await stripe.payouts.create(
        {
          amount: amount,
          currency: currency,
          statement_descriptor: "aasas",
        },
        { stripeAccount: req.body.accountId }
      );
      res.status(200).json("success");
    } catch (error) {
      console.log("Error Occured at", req.url, "Error Details: ", error);
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

paymentController.post(
  "/dashboard",
  isUsersStore,
  async (req: Request, res: Response) => {
    try {
      const loginLink = await stripe.accounts.createLoginLink(
        req.body.accountId
      );
      res.status(200).json(loginLink);
    } catch (error) {
      console.log("Error Occured at", req.url, "Error Details: ", error);
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

paymentController.get(
  "/account_session",
  isUsersStore,
  async (req: Request, res: Response) => {
    try {
      const accId = req.query.stripeAccountId;
      const accountSession = await stripe.accountSessions.create({
        account: accId,
        components: {
          payments: {
            enabled: true,
            features: {
              refund_management: true,
              dispute_management: true,
              capture_payments: true,
            },
          },
        },
      });

      res.json({
        client_secret: accountSession.client_secret,
      });
    } catch (error) {
      console.log("Error Occured at", req.url, "Error Details: ", error);
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);
