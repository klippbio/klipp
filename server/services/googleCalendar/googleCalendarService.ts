import { google } from "googleapis";
import { db } from "../../utils/db.server";
import CustomError from "../../utils/CustomError";

export const createGoogleCalendarBooking = async (
  storeId: string,
  name: string,
  startTime: string,
  endTime: string,
  saleId: string,
  salePrice: string
) => {
  try {
    const oauth2Client = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      redirectUri: process.env.BACKEND_URL + "/calendar/linkCalendar", //TODO: CHANGE THIS WHEN DEPLOYING
    });

    const calendarSetting = await db.calendarSetting.findUnique({
      where: {
        storeId: storeId,
      },
      select: {
        id: true,
        googleCalendar: true,
        timeZone: true,
      },
    });

    if (!calendarSetting || !calendarSetting.googleCalendar) {
      throw new CustomError("Calendar settings not found", 404);
    }

    oauth2Client.setCredentials({
      refresh_token: calendarSetting.googleCalendar.refreshToken,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: "primary",
      requestBody: {
        start: {
          dateTime: startTime,
          timeZone: calendarSetting.timeZone,
        },
        end: {
          dateTime: endTime,
          timeZone: calendarSetting.timeZone,
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
      },
      conferenceDataVersion: 1,
    });

    return {
      googleCalendarID: calendarSetting.googleCalendar.id,
      meetingUrl: response.data.hangoutLink,
      meetingId: response.data.id,
    };
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    if (error instanceof CustomError) {
      throw error;
    } else {
      throw new CustomError("Failed to create Google Calendar event", 500);
    }
  }
};

export const cancelGoogleCalendarEvent = async (
  storeId: string,
  eventId: string
) => {
  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    redirectUri: process.env.BACKEND_URL + "/calendar/linkCalendar", //TODO: CHANGE THIS WHEN DEPLOYING
  });

  const calendarSetting = await db.calendarSetting.findUnique({
    where: {
      storeId: storeId,
    },
    select: {
      googleCalendar: true,
    },
  });

  if (!calendarSetting || !calendarSetting.googleCalendar) {
    throw new CustomError("Calendar settings not found", 404);
  }

  oauth2Client.setCredentials({
    refresh_token: calendarSetting.googleCalendar.refreshToken,
  });

  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });

  try {
    await calendar.events.delete({
      auth: oauth2Client,
      calendarId: "primary",
      eventId: eventId,
    });

    return true;
  } catch (error) {
    console.error("Error canceling event:", error);
    throw new CustomError("Failed to cancel event", 500);
  }
};
