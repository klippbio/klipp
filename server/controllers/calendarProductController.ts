import express from "express";
import { Request, Response } from "express";
import {
  createCalendarProduct,
  deleteCalendarProduct,
  getAllCalendarProducts,
  getCalendarProduct,
  updateCalendarProduct,
  updateCalendarProductSchedule,
} from "../services/calendarProducts/calendarProductService";
import CustomError from "../utils/CustomError";

export const calendarProductController = express.Router();

//calendar product apis
calendarProductController.post(
  "/create",
  async (req: Request, res: Response) => {
    try {
      const result = await createCalendarProduct(req.body);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

calendarProductController.get(
  "/getAllCalendarProducts",
  async (req: Request, res: Response) => {
    try {
      const storeId = req.query.storeId;
      if (!storeId && typeof storeId === "string")
        throw new CustomError("Missing storeId", 400);
      const product = await getAllCalendarProducts(storeId as string);
      res.status(200).json(product);
    } catch (error) {
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

calendarProductController.get(
  "/getCalendarProduct",
  async (req: Request, res: Response) => {
    try {
      const id = req.query.id;
      if (!id) throw new CustomError("Missing id", 400);
      if (Number.isNaN(Number(id))) throw new CustomError("Invalid id", 400);
      const product = await getCalendarProduct(Number(id));
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);
//TODO: add auth
//TODO: add validation to make sure that id belongs to sender
// ddController.post("/update", async (req: Request, res: Response) => {
//   try {
//     const id = req.query.id;
//     //parsing is done in services
//     const product = await updateProduct(id as string, req.body);
//     res.status(201).json(product);
//   } catch (error) {
//     if (error instanceof CustomError)
//       res.status(error.statusCode).json({ error: error.message });
//     else res.status(500).json({ error: error });
//   }
// });

calendarProductController.post(
  "/update",
  async (req: Request, res: Response) => {
    try {
      const product = await updateCalendarProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

calendarProductController.delete(
  "/delete",
  async (req: Request, res: Response) => {
    try {
      const id = req.body.calendarProductId;
      if (!id) throw new CustomError("Missing id", 400);
      if (Number.isNaN(Number(id))) throw new CustomError("Invalid id", 400);
      const product = await deleteCalendarProduct(Number(id));
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

calendarProductController.post(
  "/schedule",
  async (req: Request, res: Response) => {
    try {
      const { calendarProductId, scheduleId } = req.body;
      if (!calendarProductId)
        throw new CustomError("Missing calendarProductId", 400);
      if (Number.isNaN(Number(calendarProductId)))
        throw new CustomError("Invalid calendarProductId", 400);
      if (!scheduleId) throw new CustomError("Missing scheduleId", 400);
      if (Number.isNaN(Number(scheduleId)))
        throw new CustomError("Invalid scheduleId", 400);
      const product = await updateCalendarProductSchedule(
        Number(calendarProductId),
        Number(scheduleId)
      );
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);
