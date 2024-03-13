import express, { Request, Response } from "express";
import CustomError from "../utils/CustomError";
import { getAvailableSlotsService } from "../services/slots/slotService";

export const slotController = express.Router();

slotController.get("/get", async (req: Request, res: Response) => {
  try {
    // Destructure required parameters from req.query
    const { storeItemId, startTime, endTime, timeZone } = req.query;

    // Construct the input object for the service function
    const serviceInput = {
      storeItemId: Number(storeItemId), // Convert to number if it's expected to be a number
      startTime: startTime as string, // Typecast to string
      endTime: endTime as string, // Typecast to string
      timeZone: timeZone as string, // Typecast to string
    };

    // Call the service function with the extracted parameters
    const slots = await getAvailableSlotsService(serviceInput);

    res.status(201).json(slots);
  } catch (error) {
    console.log("Error Occured at", req.url, "Error Details: ", error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});
