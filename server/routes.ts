import express from "express";
import { userController } from "./controllers/userController";
import { calendarController } from "./controllers/calendarController";
import { ddController } from "./controllers/ddController";
import { publicController } from "./controllers/publicController";
import { calendarProductController } from "./controllers/calendarProductController";
import { slotController } from "./controllers/slotController";

export const routes = express.Router();

routes.use("/user", userController);

routes.use("/calendar", calendarController);
routes.use("/", publicController);
routes.use("/digital-products", ddController);
routes.use("/calendar-products", calendarProductController);
routes.use("/slots", slotController);
