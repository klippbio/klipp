import express from "express";
import {
  getCancelledBookings,
  getPastBookings,
  getUpcomingBookings,
} from "../services/booking/bookingService";

export const bookingController = express.Router();

//booking apis
bookingController.get("/upcoming", async (req, res) => {
  const storeId = req.query.storeId as string;
  const upcomingBookings = await getUpcomingBookings(storeId);
  res.json(upcomingBookings);
});

bookingController.get("/past", async (req, res) => {
  const storeId = req.query.storeId as string;
  const pastBookings = await getPastBookings(storeId);
  res.json(pastBookings);
});

bookingController.get("/cancelled", async (req, res) => {
  const storeId = req.query.storeId as string;
  const cancelledBookings = await getCancelledBookings(storeId);
  res.json(cancelledBookings);
});
