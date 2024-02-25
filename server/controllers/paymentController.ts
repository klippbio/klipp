import express from "express";
import { Request, Response } from "express";
import {
  ZStoreIdSchema,
  createAccount,
  getAccountDetails,
  handleDeleteAccountFromDB,
  handleUpdateAccount,
} from "../services/payment/paymentService";
import CustomError from "../utils/CustomError";
import { env } from "process";
import { z } from "zod";
import { updateSaleStatus } from "../services/sale/saleService";

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
});

export default async function createCheckoutSession(
  data: z.infer<typeof ZCreateNewSaleSchema>
) {
  const accountId = await getStripeAccountId(data.storeId);
  const successUrl = "https://localhost:3000/sale/" + data.saleId;
  const price = data.price * 100;
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
      on_behalf_of: accountId,
    },
    success_url: successUrl,
    cancel_url: data.cancelUrl,
    metadata: {
      saleId: data.saleId,
    },
  });

  return session.url;
}

paymentController.post("/connect", async (req: Request, res: Response) => {
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
      return_url: "http://localhost:3000/payments",
      type: "account_onboarding",
    });

    res.status(200).json(accountLink);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

paymentController.post(
  "/pendingAccount",
  async (req: Request, res: Response) => {
    try {
      //creating stripe account
      const accountId = req.body.accountId;
      //generating account link
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: "https://klipp.io/reauth",
        return_url: "http://localhost:3000/payments",
        type: "account_onboarding",
      });
      res.status(200).json(accountLink);
    } catch (error) {
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

paymentController.post("/disconnect", async (req: Request, res: Response) => {
  try {
    // Deleting the Stripe account
    const deleted = await stripe.accounts.del(req.body.accountId);

    if (deleted.deleted) {
      await handleDeleteAccountFromDB(req.body);

      res.status(200).json({ message: "Account successfully disconnected" });
    } else {
      res.status(500).json({ error: "Failed to disconnect the account" });
    }
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

// paymentController.post(
//   "/create-checkout-session",
//   async (req: Request, res: Response) => {
//     //eslint-disable-next-line
//     const stripe = require("stripe")(
//       "sk_test_51ODeaHKiQFEEPGdjBvEPJUUSO6mstnNQFzy03aRDJxTVfgXriuthpcZ6j2ppMJjR1vVXtQqOUBxekyCKUl4cYOAR003xGDEGAI"
//     );

//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       line_items: [
//         {
//           quantity: 1,
//           price_data: {
//             currency: "cad",
//             product_data: {
//               name: "Stubborn Attachments",
//               images: ["https://i.imgur.com/EHyR2nP.png"],
//             },
//             unit_amount: 2000,
//           },
//         },
//       ],
//       payment_intent_data: {
//         transfer_data: {
//           destination: "acct_1OczqoQOwKYUBAc5",
//         },
//         on_behalf_of: "acct_1OczqoQOwKYUBAc5",
//       },
//       success_url: "https://example.com/success",
//       cancel_url: "https://example.com/cancel",
//     });

//     res.status(200).json(session.url);
//   }
// );

//TODO: Change this whole controller.
paymentController.get(
  "/stripeAccountDetails",
  async (req: Request, res: Response) => {
    try {
      const storeId = req.query.storeId;
      const accountDetails = await getAccountDetails(
        await ZStoreIdSchema.parseAsync({ storeId: storeId })
      );
      res.status(201).json(accountDetails);
    } catch (error) {
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

paymentController.get(
  "/stripeaccountbalance",
  async (req: Request, res: Response) => {
    const accountId = req.query.stripeAccountId;
    try {
      const balance = await stripe.balance.retrieve({
        stripeAccount: accountId,
      });
      res.status(200).json(balance);
    } catch (error) {
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

paymentController.post("/payout", async (req: Request, res: Response) => {
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
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

paymentController.post("/dashboard", async (req: Request, res: Response) => {
  try {
    const loginLink = await stripe.accounts.createLoginLink(req.body.accountId);
    res.status(200).json(loginLink);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

paymentController.get(
  "/account_session",
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
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);
