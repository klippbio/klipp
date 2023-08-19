import express from "express";
import { Request, Response } from "express";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { userController } from "./controllers/userController";

export const routes = express.Router();

routes.use("/user", userController);
