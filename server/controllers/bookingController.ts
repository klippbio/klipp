import express from "express";
import {
  getCancelledBookings,
  getPastBookings,
  getUpcomingBookings,
} from "../services/booking/bookingService";
import CustomError from "../utils/CustomError";

export const bookingController = express.Router();

//booking apis
bookingController.get("/upcoming", async (req, res) => {
  try {
    const storeId = req.query.storeId as string;
    const upcomingBookings = await getUpcomingBookings(storeId);
    res.status(200).json(upcomingBookings);
  } catch (error) {
    console.log("Error Occured at", req.url, "Error Details: ", error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

bookingController.get("/past", async (req, res) => {
  try {
    const storeId = req.query.storeId as string;
    const pastBookings = await getPastBookings(storeId);
    res.status(200).json(pastBookings);
  } catch (error) {
    console.log("Error Occured at", req.url, "Error Details: ", error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

bookingController.get("/cancelled", async (req, res) => {
  try {
    const storeId = req.query.storeId as string;
    const cancelledBookings = await getCancelledBookings(storeId);
    res.status(200).json(cancelledBookings);
  } catch (error) {
    console.log("Error Occured at", req.url, "Error Details: ", error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});
