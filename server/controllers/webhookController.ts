import express from "express";
import { Request, Response } from "express";
import { handleUpdateAccount } from "../services/payment/paymentService";
import CustomError from "../utils/CustomError";
import { updateSaleStatus } from "../services/sale/saleService";
import { emailTrigger } from "./saleController";
export const webhookController = express.Router();

webhookController.post("/", async (req: Request, res: Response) => {
  try {
    if (req.body.type === "account.updated") {
      handleUpdateAccount(req.body.data.object);
    }

    if (req.body.type === "checkout.session.completed") {
      const session = req.body;

      const saleId = session.data.object.metadata.saleId;

      const saleEmail = {
        from_name: session.data.object.metadata.from_name,
        from_email: session.data.object.metadata.from_email,
        to_email: session.data.object.metadata.to_email,
        to_name: session.data.object.metadata.to_name,
        subject: session.data.object.metadata.subject,
        link: session.data.object.metadata.link,
        itemName: session.data.object.metadata.itemName,
        itemType: session.data.object.metadata.itemType,
      };

      console.log(saleEmail);
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
