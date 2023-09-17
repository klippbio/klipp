import express, { NextFunction } from "express";
import { Request, Response } from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

import * as ddService from "../services/ddService";

export const ddController = express.Router();

ddController.post("/create", async (req: Request, res: Response) => {
  try {
    const productId = await ddService.create(req.body);
    return res.status(201).json(productId);
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});
