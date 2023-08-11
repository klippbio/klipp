import express from "express";
import { Request, Response } from "express";

import * as userService from "../service/userService";

export const userRoute = express.Router();

userRoute.get("/all", async (req: Request, res: Response) => {
  try {
    const users = await userService.listUsers();
    if (users) {
      return res.status(200).json(users);
    }
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});
