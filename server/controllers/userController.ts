import express from "express";
import { Request, Response } from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

import * as userService from "../services/userService";
import * as storeService from "../services/storeService";

export const userController = express.Router();

userController.get("/all", async (req: Request, res: Response) => {
  try {
    const users = await userService.allUsers();
    if (users) {
      return res.status(200).json(users);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

userController.post(
  "/onboarding",
  ClerkExpressRequireAuth(),
  async (req: Request, res: Response) => {
    try {
      const usernameExists = await storeService.checkStoreUrlExists(
        req.body.storeUrl
      );
      if (usernameExists) {
        return res.status(409).json({ error: "Username already exists" });
      }
      const newUser = await userService.onboarding(req.body);
      console.log(newUser);
      return res.status(201).json(newUser);
    } catch (error) {
      console.error("An error occurred:", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
);

userController.get(
  "/",
  ClerkExpressRequireAuth(),
  async (req: Request, res: Response) => {
    try {
      const userId = req.query.id;
      if (userId) {
        const user = await userService.getUserById(userId as string);
        if (user) {
          console.log(user);
          return res.status(200).json(user);
        }
      }
      return res.status(404).json("User Id not found");
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);
