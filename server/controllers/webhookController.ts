import express from "express";
import { Request, Response } from "express";
import { handleUpdateAccount } from "../services/payment/paymentService";
import CustomError from "../utils/CustomError";
import { updateSaleStatus } from "../services/sale/saleService";
import { emailTrigger } from "./saleController";
export const webhookController = express.Router();

webhookController.post("/", async (req: Request, res: Response) => {
  console.log("webhook triggered");
  try {
    if (req.body.type === "account.updated") {
      handleUpdateAccount(req.body.data.object);
    }

    if (req.body.type === "checkout.session.completed") {
      const session = req.body;

      const saleId = session.data.object.metadata.saleId;

      const saleEmail = {
        from_name: session.data.object.metadata.from_name,
        to_email: session.data.object.metadata.to_email,
        to_name: session.data.object.metadata.to_name,
        subject: session.data.object.metadata.subject,
        link: session.data.object.metadata.link,
        itemType: session.data.object.metadata.itemType,
      };
      await emailTrigger(saleEmail);

      await updateSaleStatus(saleId, "COMPLETED");
    }
    res.status(200).json("ok");
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});
