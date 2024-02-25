import express from "express";
import { Request, Response } from "express";

import * as publicService from "../services/public/publicService";
import CustomError from "../utils/CustomError";
import cityTimezones from "../services/calendar/cityTimezones";
import { isUsersStore } from "../middlewares/isUsersStore";

export const publicController = express.Router();

publicController.get("/publicUser", async (req: Request, res: Response) => {
  try {
    const userName = req.query.username;
    const publicUser = await publicService.getPublicUser(
      await publicService.ZUserName.parseAsync({ userName: userName })
    );
    if (!publicUser) throw new CustomError("User not found", 404);
    res.status(200).json(publicUser);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

publicController.post(
  "/publicUser",
  isUsersStore,
  async (req: Request, res: Response) => {
    try {
      const parsedData = await publicService.ZUpdatePublicUser.parseAsync(
        req.body
      );
      const publicUser = await publicService.updatePublicUser(parsedData);
      if (!publicUser) throw new CustomError("User not found", 404);
      res.status(200).json(publicUser);
    } catch (error) {
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

publicController.post("/changeOrder", async (req: Request, res: Response) => {
  try {
    const parsedData = await publicService.ZChangeOrder.parseAsync(req.body);
    const updatedOrder = await publicService.changeOrder(parsedData);
    if (!updatedOrder)
      throw new CustomError("Failed to update item order", 500);
    res.status(200).json(updatedOrder);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

publicController.get("/product", async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const username = req.query.username;
    const product = await publicService.getPublicProduct(
      await publicService.ZProduct.parseAsync({ id: id, userName: username })
    );
    if (!product) throw new CustomError("Product not found", 404);
    res.status(200).json(product);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

publicController.get("/cityTimezones", async (req: Request, res: Response) => {
  try {
    const cities = await cityTimezones();
    res.status(200).json(cities);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});
