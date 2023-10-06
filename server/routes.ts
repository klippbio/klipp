import express from "express";
import { userController } from "./controllers/userController";
import { calendarController } from "./controllers/calendarController";

export const routes = express.Router();

routes.use("/user", userController);

routes.use("/calendar", calendarController);
