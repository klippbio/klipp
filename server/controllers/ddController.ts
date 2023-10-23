import express from "express";
import { Request, Response } from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import CustomError from "../utils/CustomError";

import * as ddService from "../services/dd/ddService";
import {
  ZCreateDigitalProductSchema,
  ZUpdateDigitalProductSchema,
  deleteFile,
  getProduct,
} from "../services/dd/ddService";
import {
  createProduct,
  updateProduct,
  updateFile,
} from "../services/dd/ddService";
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

//TODO: add auth
ddController.post("/file", async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const product = await updateFile(id, req.body);
    res.status(201).json(product);
  } catch (error) {
    res.send(error);
  }
});

//TODO: add auth
ddController.delete("/file", async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    await deleteFile(id);
    res.status(201).json("deleted");
  } catch (error) {
    res.send(error);
  }
});

ddController.get("/getProduct", async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const product = await getProduct(id);
    res.status(201).json(product);
  } catch (error) {
    res.send(error);
  }
});
