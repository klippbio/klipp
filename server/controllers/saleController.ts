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

export const saleController = express.Router();

saleController.post("/create", async (req: Request, res: Response) => {
  try {
    const { itemType }: { itemType: StoreItemType } = req.body;
    if (itemType === "CALENDAR") {
      await ZCreateNewSaleSchema.parseAsync(req.body);
      const booking = await createNewSale(req.body);
      console.log(booking);
      res.status(200).json(booking);
    }
    if (itemType === "DIGITALPRODUCT") {
      //TODO
      //parse data
      //Get stripe link
      console.log("Digital Product Data", req.body);
      //update sale table
    }
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

saleController.get("/all", async (req: Request, res: Response) => {
  try {
    const sales = await getAllSales();
    res.status(200).json(sales);
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

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
