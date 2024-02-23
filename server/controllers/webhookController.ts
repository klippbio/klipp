import express from "express";
import { Request, Response } from "express";
import { handleUpdateAccount } from "../services/payment/paymentService";
import CustomError from "../utils/CustomError";

export const webhookController = express.Router();

webhookController.post("/", async (req: Request, res: Response) => {
  try {
    if (req.body.type === "account.updated") {
      handleUpdateAccount(req.body.data.object);
    }
    res.status(200).json("ok");
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});
