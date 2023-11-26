import express from "express";
import { Request, Response } from "express";

export const paymentController = express.Router();
import {
  createAccount,
  getAccountDetails,
} from "../services/payment/paymentService";
import CustomError from "../utils/CustomError";

paymentController.get("/test", async (req: Request, res: Response) => {
  return res.status(200).json("test");
});

paymentController.post("/create", async (req: Request, res: Response) => {
  const stripe = require("stripe")(
    "sk_test_51ODeaHKiQFEEPGdjBvEPJUUSO6mstnNQFzy03aRDJxTVfgXriuthpcZ6j2ppMJjR1vVXtQqOUBxekyCKUl4cYOAR003xGDEGAI"
  );

  //TODO: Config params properly
  //Config Merchant codes
  //Config service aggreement based on locations. IF Us full else receipeint
  //Check CSRF token issue
  //Use publishable key and secret key intead of test keyt

  const account = await stripe.accounts.create({
    country: "US",
    type: "express",
    capabilities: {
      card_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      },
    },
    business_type: "individual",
    business_profile: {
      url: "https://klipp.io",
    },
  });

  await createAccount({ accountId: account.id });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: "https://klipp.io/reauth",
    return_url: "https://klipp.io/return",
    type: "account_onboarding",
  });

  //stoire account id in db

  res.status(200).json(accountLink);
});

paymentController.get(
  "/accountDetails",
  async (req: Request, res: Response) => {
    try {
      const accountDetails = await getAccountDetails();
      res.status(201).json(accountDetails);
    } catch (error) {
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);
