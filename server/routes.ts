import express from "express";
import { Request, Response } from "express";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { userController } from "./controllers/userController";
import { ddController } from "./controllers/ddController";
import { calendarController } from "./controllers/calendarController";

export const routes = express.Router();

routes.use("/user", userController);
routes.use("/digital-downloads", ddController);

routes.use("/calendar", calendarController);
