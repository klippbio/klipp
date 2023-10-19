import express from "express";
import { Request, Response } from "express";

import {
  ZCreateScheduleSchema,
  ZGetOrDeleteScheduleSchema,
  ZUpdateInputSchema,
  createSchedule,
  deleteSchedule,
  getSchedule,
  updateSchedule,
} from "../services/calendar/calendarService";
import CustomError from "../utils/CustomError";
import {
  checkIfCalendarIsConnected,
  saveGoogleCalendarTokens,
  unlinkGoogleCalendar,
} from "../services/calendar/calendarSettingService";
import cityTimezones from "../services/calendar/cityTimezones";

export const calendarController = express.Router();

//schedule apis

calendarController.post("/create", async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    ZCreateScheduleSchema.parseAsync(req.body);
    const schedule = await createSchedule(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

calendarController.post("/update", async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    // prettier-ignore
    const parsedBody = {
      ...req.body,
      availability: req.body.availability.map((slot: any) =>    //eslint-disable-line
        slot.map((item: any) => ({//eslint-disable-line
          start: new Date(item.start),
          end: new Date(item.end),
        }))
      ),
      dateOverrides: req.body.dateOverrides.map((item: any) => ({//eslint-disable-line
        start: new Date(item.start),
        end: new Date(item.end),
      })),
    };

    await ZUpdateInputSchema.parseAsync(parsedBody);
    const result = await updateSchedule(parsedBody);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

calendarController.get("/get", async (req: Request, res: Response) => {
  try {
    const params = await ZGetOrDeleteScheduleSchema.parseAsync({
      scheduleId: parseInt(req.query.scheduleId as string),
    });
    console.log(params);
    const result = await getSchedule(params);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

calendarController.delete("/delete", async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    await ZGetOrDeleteScheduleSchema.parseAsync(req.body);
    const result = await deleteSchedule(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

//calendar setting apis

calendarController.get("/linkCalendar", async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;
    await saveGoogleCalendarTokens(state as string, code as string);
    res.redirect("http://localhost:3000/calendar?message=auth_success");
  } catch (error) {
    console.error(error);
    res.send("http://localhost:3000/calendar?message=auth_failed");
  }
});

calendarController.get("/linkStatus", async (req: Request, res: Response) => {
  try {
    console.log("checking status");
    console.log("who the fuck is calling this?");
    const { storeId } = req.query;
    console.log(storeId);
    const store = await checkIfCalendarIsConnected(storeId as string);
    console.log(store);
    res.status(200).json(store);
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

calendarController.post(
  "/unlinkCalendar",
  async (req: Request, res: Response) => {
    try {
      console.log("unlinking calendar");
      const { storeId } = req.body;
      const calendar = await unlinkGoogleCalendar(storeId);
      res.status(200).json({ calendar: calendar });
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

calendarController.get(
  "/cityTimezones",
  async (req: Request, res: Response) => {
    try {
      console.log("getting cities");
      const cities = await cityTimezones();
      res.status(200).json(cities);
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);
