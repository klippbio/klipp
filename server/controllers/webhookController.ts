import express from "express";
import { Request, Response } from "express";
import { handleUpdateAccount } from "../services/payment/paymentService";
import CustomError from "../utils/CustomError";
import { updateSaleStatus } from "../services/sale/saleService";

export const webhookController = express.Router();

webhookController.post("/", async (req: Request, res: Response) => {
  try {
    console.log("entry to webhook1", req.body);
    if (req.body.type === "account.updated") {
      handleUpdateAccount(req.body.data.object);
    }

    if (req.body.type === "checkout.session.completed") {
      console.log("entry to webhook2", req.body);
      const session = req.body;

      const saleId = session.data.object.metadata.saleId;
      console.log("sale id in webhook", saleId);
      await updateSaleStatus(saleId, "COMPLETED");
      console.log("Edit webhook");
    }
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});
