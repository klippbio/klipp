import express from "express";
import { Request, Response } from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import CustomError from "../utils/CustomError";

import * as ddService from "../services/dd/ddService";
import {
  ZCreateDigitalProductSchema,
  ZUpdateDigitalProductSchema,
} from "../services/dd/ddService";
import { createProduct, updateProduct } from "../services/dd/ddService";
import { any } from "zod";

export const ddController = express.Router();

ddController.get("/", async (req: Request, res: Response) => {
  try {
    const users = await ddService.allProducts();

    return res.status(200).json("products");
  } catch (error) {
    return res.status(500).json(error);
  }
});
//TODO: add auth
ddController.post("/create", async (req: Request, res: Response) => {
  try {
    ZCreateDigitalProductSchema.parseAsync(req.body);
    const productId = await createProduct(req.body);
    res.status(201).json(productId);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

//TODO: add auth
ddController.post("/update", async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    //TODO: add validation to make sure that id belongs to sender

    const product = await updateProduct(id, req.body);
    res.status(201).json(product);
  } catch (error) {
    res.send(error);
  }
});
