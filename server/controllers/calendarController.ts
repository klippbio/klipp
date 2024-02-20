import express from "express";
import { Request, Response } from "express";

import {
  ZCreateScheduleSchema,
  ZGetOrDeleteScheduleSchema,
  ZUpdateInputSchema,
  createSchedule,
  deleteSchedule,
  getAllSchedules,
  getSchedule,
  updateSchedule,
} from "../services/calendar/calendarService";
import CustomError from "../utils/CustomError";
import {
  ZGetOrDeleteCalendarSettingSchema,
  ZUpdateCalendarSettingSchema,
  checkIfCalendarIsConnected,
  getCalendarSettings,
  saveGoogleCalendarTokens,
  unlinkGoogleCalendar,
  updateCalendarSettings,
} from "../services/calendar/calendarSettingService";
import { isUsersStore } from "../middlewares/isUsersStore";

export const calendarController = express.Router();

//schedule apis

calendarController.post("/create", async (req: Request, res: Response) => {
  try {
    ZCreateScheduleSchema.parseAsync(req.body);
    const schedule = await createSchedule(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    console.log(error);
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

calendarController.post("/update", async (req: Request, res: Response) => {
  try {
    let parsedBody = req.body;
    if (req.body.availability) {
      parsedBody = {
        ...parsedBody,
        availability: req.body.availability.map(
          (
            slot: any //eslint-disable-line
          ) =>
            //eslint-disable-next-line
            slot.map((item: any) => ({
              start: new Date(item.start),
              end: new Date(item.end),
            }))
        ),
      };
    }
    if (req.body.dateOverrides) {
      parsedBody = {
        ...parsedBody,
        //eslint-disable-next-line
        dateOverrides: req.body.dateOverrides.map((item: any) => ({
          //eslint-disable-line
          start: new Date(item.start),
          end: new Date(item.end),
        })),
      };
    }
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
    const result = await getSchedule(params);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

calendarController.get("/getAll", async (req: Request, res: Response) => {
  try {
    const { storeId } = req.query;
    const result = await getAllSchedules(
      await ZCreateScheduleSchema.shape.storeId.parseAsync(storeId)
    );
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

calendarController.delete("/delete", async (req: Request, res: Response) => {
  try {
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
    const { code, state, scope } = req.query;
    await saveGoogleCalendarTokens(
      state as string,
      code as string,
      scope as string
    );
    res.redirect(
      "http://localhost:3000/calendar/settings?message=auth_success"
    );
  } catch (error) {
    res.redirect("http://localhost:3000/calendar/settings?message=auth_failed");
  }
});

calendarController.get("/linkStatus", async (req: Request, res: Response) => {
  try {
    const { storeId } = req.query;
    const store = await checkIfCalendarIsConnected(storeId as string);
    res.status(200).json(store);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

calendarController.post(
  "/unlinkCalendar",
  async (req: Request, res: Response) => {
    try {
      const { storeId } = req.body;
      const calendar = await unlinkGoogleCalendar(storeId);
      res.status(200).json({ calendar: calendar });
    } catch (error) {
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500);
    }
  }
);

calendarController.get(
  "/settings",
  isUsersStore,
  async (req: Request, res: Response) => {
    try {
      const params = await ZGetOrDeleteCalendarSettingSchema.parseAsync({
        storeId: req.query.storeId as string,
      });
      const calendarSettings = await getCalendarSettings(params);
      res.status(200).json(calendarSettings);
    } catch (error) {
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

calendarController.post(
  "/settings",
  isUsersStore,
  async (req: Request, res: Response) => {
    try {
      const calendarSettings = await updateCalendarSettings(
        await ZUpdateCalendarSettingSchema.parseAsync(req.body)
      );
      res.status(200).json(calendarSettings);
    } catch (error) {
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);
