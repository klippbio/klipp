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
  ZGetOrDeleteCalendarSettingSchema,
  ZUpdateCalendarSettingSchema,
  checkIfCalendarIsConnected,
  getCalendarSettings,
  saveGoogleCalendarTokens,
  unlinkGoogleCalendar,
  updateCalendarSettings,
} from "../services/calendar/calendarSettingService";
import cityTimezones from "../services/calendar/cityTimezones";
import clerkClient, {
  ClerkExpressRequireAuth,
  RequireAuthProp,
} from "@clerk/clerk-sdk-node";

export const calendarController = express.Router();

calendarController.post("/create", async (req: Request, res: Response) => {
  try {
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
    const result = await getSchedule(params);
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
    res.redirect("http://localhost:3000/calendar?message=auth_success");
  } catch (error) {
    res.redirect("http://localhost:3000/calendar?message=auth_failed");
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
  "/cityTimezones",
  async (req: Request, res: Response) => {
    try {
      const cities = await cityTimezones();
      res.status(200).json(cities);
    } catch (error) {
      if (error instanceof CustomError)
        res.status(error.statusCode).json({ error: error.message });
      else res.status(500).json({ error: error });
    }
  }
);

calendarController.get("/settings", async (req: Request, res: Response) => {
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
});

calendarController.post(
  "/settings",
  ClerkExpressRequireAuth(),
  async (req: RequireAuthProp<Request>, res: Response) => {
    try {
      const user = await clerkClient.users.getUser(req.auth.userId);
      console.log(user);
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

// calendarController.post("/createEvent", async (req: Request, res: Response) => {
//   try {
//     const { name } = req.body;
//     const oauth2Client = new google.auth.OAuth2({
//       clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
//       redirectUri: "http://localhost:4000/calendar/linkCalendar",
//     });

//     oauth2Client.setCredentials({
//       refresh_token:
//         "1//01DkyARi5-Et5CgYIARAAGAESNwF-L9Ir1obR_99ImT0bcuFXD3T12idcMLhesEmvgfqkhjcNQHNyyy5mnxQYFujygNQPC0EaWnA",
//     });
//     const calendar = google.calendar({
//       version: "v3",
//       auth: oauth2Client,
//     });
//     const response = await calendar.events.insert({
//       auth: oauth2Client,
//       calendarId: "primary",
//       requestBody: {
//         start: {
//           dateTime: "2023-10-22T09:00:00-07:00",
//           timeZone: "America/Los_Angeles",
//         },
//         end: {
//           dateTime: "2023-10-22T17:00:00-07:00",
//           timeZone: "America/Los_Angeles",
//         },
//         conferenceData: {
//           createRequest: {
//             requestId: "sample123",
//             conferenceSolutionKey: {
//               type: "hangoutsMeet",
//             },
//           },
//         },
//         summary: name,
//         description: "A chance to hear more about Google's developer products.",
//       },
//       conferenceDataVersion: 1,
//     });
//     res.json(response.data);
//   } catch (error) {
//     if (error instanceof CustomError)
//       res.status(error.statusCode).json({ error: error.message });
//     else res.status(500).json({ error: error });
//   }
// });
