import express, { Request, Response } from "express";
import CustomError from "../utils/CustomError";
import {
  ZCreateNewSaleSchema,
  cancelGoogleCalendarSale,
  createNewSale,
  getAllSales,
  getSale,
  rescheduleSale,
} from "../services/sale/saleService";
import { StoreItemType } from "@prisma/client";
import { isUsersStore } from "../middlewares/isUsersStore";

export const saleController = express.Router();

saleController.post(
  "/create",
  isUsersStore,
  async (req: Request, res: Response) => {
    try {
      const { itemType }: { itemType: StoreItemType } = req.body;
      if (itemType === "CALENDAR") {
        await ZCreateNewSaleSchema.parseAsync(req.body);
        const booking = await createNewSale(req.body);
        console.log(booking);
        res.status(200).json(booking);
      }
      if (itemType === "DIGITALPRODUCT") {
        console.log("digital download"); // add the payment and a new service to save the digital product!
      }
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

saleController.get(
  "/getAllSales",
  isUsersStore,
  async (req: Request, res: Response) => {
    try {
      const storeId = req.query.storeId;
      if (!storeId) throw new CustomError("Store id not Found!", 400);
      const sales = await getAllSales(storeId as string);
      res.status(200).json(sales);
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

saleController.get("/", async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    //convert id to number and check if it is a number
    if (isNaN(Number(id))) throw new CustomError("Invalid id", 400);
    const sale = await getSale(Number(id));
    res.status(200).json(sale);
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

saleController.post("/cancel", async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    //convert id to number and check if it is a number
    if (isNaN(Number(id))) throw new CustomError("Invalid id", 400);
    const sale = await cancelGoogleCalendarSale(Number(id));
    res.status(200).json(sale);
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

saleController.post("/reschedule", async (req: Request, res: Response) => {
  try {
    const sale = await rescheduleSale(req.body);
    res.status(200).json(sale);
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});
