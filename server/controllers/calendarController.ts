import express from "express";
import { Request, Response } from "express";
import { google } from "googleapis";

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

export const calendarController = express.Router();

const oauth2Client = new google.auth.OAuth2({
  clientId:
    "59264655502-4278olgkk28undr7ochka2npqodq27el.apps.googleusercontent.com",
  clientSecret: "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",
  redirectUri: "http://localhost:3000/calendar",
});

calendarController.get("/", (req: Request, res: Response) => {
  console.log("Calendar");
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
  });
  console.log(authUrl);
  res.json({ redirectUrl: authUrl });
});

const refreshToken =
  "1//01-DvlyjLnYCKCgYIARAAGAESNwF-L9IrMIr4IjxZV1Gs0VVV7zfuJa7psuW9T7Pmf5YAKTn1y3HJL-eGDlRflW0_UDNHK4aJQO8";
// const accessToken =
//   "a29.a0AfB_byAfEs472i86F9OJ_jS8_J8QHHBF51cEOae1YTCf5wTuvhxRtypJalmdQcqbFcR2--aqoItRYX84TlaZ-9ADbRYftSB_TIECCMVRP0ytKmOZ7NNI7OuDOMd-9QRL5znpbxUZPEyOOIRpFYLC1U0g6NGkiD-1v0lsaCgYKAV0SARISFQGOcNnC75nEgK2nemVA5fRbZY2QJg0171";

calendarController.post("/2", async (req: Request, res: Response) => {
  console.log("Authenticate");
  const { code } = req.body;

  try {
    // Exchange the code for access and refresh tokens
    const { tokens } = await oauth2Client.getToken(code);

    // Store the tokens or use them as needed
    // You can also associate the tokens with the user who authorized the app
    console.log(tokens);
    console.log("It was successful");
    res.json(tokens);
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).send("Error exchanging code for tokens");
  }
});

calendarController.post("/createEvent", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: "primary",
      requestBody: {
        start: {
          dateTime: "2023-09-22T09:00:00-07:00",
          timeZone: "America/Los_Angeles",
        },
        end: {
          dateTime: "2023-09-22T17:00:00-07:00",
          timeZone: "America/Los_Angeles",
        },
        conferenceData: {
          createRequest: {
            requestId: "sample123",
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
        summary: name,
        description: "A chance to hear more about Google's developer products.",
      },
      conferenceDataVersion: 1,
    });
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    if (error instanceof CustomError)
      res.status(error.statusCode).json({ error: error.message });
    else res.status(500).json({ error: error });
  }
});

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
    console.log(req.body);
    await ZGetOrDeleteScheduleSchema.parseAsync(req.body);
    const result = await getSchedule(req.body);
    res.status(200).json(result);
  } catch (error) {
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
