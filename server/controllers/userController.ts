import express, { NextFunction } from "express";
import { Request, Response } from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

import * as userService from "../services/userService";

export const userController = express.Router();

userController.get("/all", async (req: Request, res: Response) => {
  try {
    const users = await userService.allUsers();
    if (users) {
      return res.status(200).json(users);
    }
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

userController.post(
  "/onboarding",
  ClerkExpressRequireAuth(),
  async (req: Request, res: Response) => {
    try {
      res.status(201).json(await userService.onboarding(req.body));
    } catch (error) {
      res.status(500).json("Something went wrong");
    }
  }
);
