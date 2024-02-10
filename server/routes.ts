import express from "express";
import { userController } from "./controllers/userController";
import { calendarController } from "./controllers/calendarController";
import { ddController } from "./controllers/ddController";
import { paymentController } from "./controllers/paymentController";
import { publicController } from "./controllers/publicController";
import { calendarProductController } from "./controllers/calendarProductController";
import { linkController } from "./controllers/linkController";

export const routes = express.Router();

routes.use("/user", userController);

routes.use("/calendar", calendarController);
routes.use("/", publicController);
routes.use("/digital-products", ddController);
routes.use("/stripe", paymentController);
routes.use("/calendar-products", calendarProductController);
routes.use("/link", linkController);
