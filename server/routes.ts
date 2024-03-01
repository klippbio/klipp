import express from "express";
import { userController } from "./controllers/userController";
import { calendarController } from "./controllers/calendarController";
import { ddController } from "./controllers/ddController";
import { paymentController } from "./controllers/paymentController";
import { publicController } from "./controllers/publicController";
import { calendarProductController } from "./controllers/calendarProductController";
import { slotController } from "./controllers/slotController";
import { saleController } from "./controllers/saleController";
import { bookingController } from "./controllers/bookingController";
import { linkController } from "./controllers/linkController";
import { isUsersStore } from "./middlewares/isUsersStore";

export const routes = express.Router();

routes.use("/user", userController);

routes.use("/calendar", calendarController);
routes.use("/", publicController);
routes.use("/digital-products", isUsersStore, ddController);
routes.use("/stripe", isUsersStore, paymentController);
routes.use("/calendar-products", isUsersStore, calendarProductController);
routes.use("/slots", slotController);
routes.use("/sale", saleController);
routes.use("/bookings", isUsersStore, bookingController);
routes.use("/link", isUsersStore, linkController);
