import { google } from "googleapis";
import { db } from "../../utils/db.server";
import CustomError from "../../utils/CustomError";
import { z } from "zod";

const oauth2Client = new google.auth.OAuth2({
  clientId:
    "59264655502-qodhgr9q58u4724rvrr0i2ums83olras.apps.googleusercontent.com",
  clientSecret: "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",
  redirectUri: "http://localhost:4000/calendar/linkCalendar",
});

async function revokeAccessWithRefreshToken(refreshToken: string) {
  // Set the refresh token
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    // Obtain a new access token using the refresh token
    const { token } = await oauth2Client.getAccessToken();

    // Revoke the new access token
    await oauth2Client.revokeToken(token as string);

    console.log("Access token revoked successfully");
  } catch (error) {
    console.error("Error revoking access token:", error);
    throw new CustomError("Error revoking access token", 500);
  }
}

async function getUserEmail(accessToken: string) {
  oauth2Client.setCredentials({ access_token: accessToken });
  const oauth2 = google.oauth2({
    version: "v2",
    auth: oauth2Client,
  });

  const email = (await oauth2.userinfo.get()).data.email;
  oauth2Client.setCredentials({ access_token: null });

  if (email == null || email == undefined) {
    throw new CustomError("Error getting user email", 500);
  }

  return email;
}

export const saveGoogleCalendarTokens = async (
  state: string,
  code: string,
  scope: string
) => {
  const requestedScopes = scope.split(" ");

  if (!requestedScopes.includes("https://www.googleapis.com/auth/calendar")) {
    throw new CustomError("Calendar Permission is required", 400);
  }

  const { tokens } = await oauth2Client.getToken(code);
  console.log(tokens);
  const { storeId } = JSON.parse(state);
  if (
    tokens.access_token == null ||
    tokens.refresh_token == null ||
    tokens.access_token == undefined ||
    tokens.refresh_token == undefined
  ) {
    return;
  }

  const store = await db.store.findUnique({
    where: {
      id: storeId,
    },
    select: {
      calendarSetting: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!store) {
    throw new CustomError("Store not found", 404);
  }

  if (store.calendarSetting) {
    const calendarSetting = await db.calendarSetting.findUnique({
      where: {
        id: store.calendarSetting?.id,
      },
      select: {
        id: true,
        googleCalendar: true,
      },
    });
    if (calendarSetting?.googleCalendar) {
      throw new CustomError("Google Calendar already connected!", 400);
    }
  }

  let calendarSetting;
  const email = await getUserEmail(tokens.access_token);

  if (!store.calendarSetting?.id) {
    calendarSetting = await db.calendarSetting.create({
      data: {
        googleCalendar: {
          create: {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            email: email,
          },
        },
        store: {
          connect: {
            id: storeId,
          },
        },
      },
    });
  } else {
    calendarSetting = await db.calendarSetting.update({
      where: {
        id: store.calendarSetting?.id,
      },
      data: {
        googleCalendar: {
          create: {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            email: email,
          },
        },
      },
    });
  }

  if (!calendarSetting) {
    throw new CustomError("Error creating calendar setting", 40);
  }
  return calendarSetting;
};

export const checkIfCalendarIsConnected = async (storeId: string) => {
  const store = await db.store.findUnique({
    where: {
      id: storeId,
    },
    select: {
      calendarSetting: {
        select: {
          googleCalendar: true,
        },
      },
    },
  });

  console.log(store);

  if (!store?.calendarSetting?.googleCalendar) {
    throw new CustomError(
      "Google Calendar Not Connected. Please try again",
      404
    );
  }
  console.log("wow should not be here");
  return store;
};

export const unlinkGoogleCalendar = async (storeId: string) => {
  const store = await db.store.findUnique({
    where: {
      id: storeId,
    },
    select: {
      calendarSetting: {
        select: {
          id: true, // Include the calendarSetting id for deletion
          googleCalendar: true,
        },
      },
    },
  });

  if (!store?.calendarSetting?.googleCalendar) {
    throw new CustomError(
      "Google Calendar is not connected. Cannot unlink.",
      400
    );
  }

  // Revoke the access token
  await revokeAccessWithRefreshToken(
    store.calendarSetting.googleCalendar.refreshToken
  );

  // Unlink the calendar by deleting the associated calendarSetting
  const googleCalendar = await db.googleCalendar.delete({
    where: {
      id: store.calendarSetting.googleCalendar.id,
    },
  });
  console.log(googleCalendar);

  return "Calendar unlinked successfully";
};

export const getCalendarSettings = async (
  input: z.infer<typeof ZGetOrDeleteCalendarSettingSchema>
) => {
  const store = await db.store.findUnique({
    where: {
      id: input.storeId,
    },
    select: {
      calendarSetting: {
        select: {
          id: true,
          googleCalendar: {
            select: {
              email: true,
            },
          },
          defaultScheduleId: true,
          minimumBookingNotice: true,
          timeZone: true,
        },
      },
    },
  });

  return store;
};

export const updateCalendarSettings = async (
  input: z.infer<typeof ZUpdateCalendarSettingSchema>
) => {
  const store = await db.store.findUnique({
    where: {
      id: input.storeId,
    },
    select: {
      calendarSetting: {
        select: {
          id: true,
        },
      },
    },
  });

  const calendarSetting = await db.calendarSetting.update({
    where: {
      id: store?.calendarSetting?.id,
    },
    data: {
      minimumBookingNotice: input.minimumBookingNotice,
      timeZone: input.timeZone,
    },
  });
  return calendarSetting;
};

export const ZGetOrDeleteCalendarSettingSchema = z.object({
  storeId: z.string().uuid(),
});

export const ZUpdateCalendarSettingSchema = z.object({
  storeId: z.string().uuid(),
  minimumBookingNotice: z.number().int(),
  timeZone: z.string(),
});
