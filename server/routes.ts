import express from "express";
import { userController } from "./controllers/userController";
import { calendarController } from "./controllers/calendarController";
import { ddController } from "./controllers/ddController";
import { paymentController } from "./controllers/paymentController";

export const routes = express.Router();

routes.use("/user", userController);

routes.use("/calendar", calendarController);
routes.use("/digital-products", ddController);
routes.use("/stripe", paymentController);
