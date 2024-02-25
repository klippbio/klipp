import express from "express";
import { Request, Response } from "express";
import { handleUpdateAccount } from "../services/payment/paymentService";
import CustomError from "../utils/CustomError";
import { updateSaleStatus } from "../services/sale/saleService";

export const webhookController = express.Router();

webhookController.post("/", async (req: Request, res: Response) => {
  try {
    if (req.body.type === "account.updated") {
      handleUpdateAccount(req.body.data.object);
    }

    if (req.body.type === "checkout.session.completed") {
      const session = req.body;

      const saleId = session.data.object.metadata.saleId;
      await updateSaleStatus(saleId, "COMPLETED");
    }
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});
