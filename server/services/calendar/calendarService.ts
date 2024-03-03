import {
  DEFAULT_SCHEDULE,
  convertScheduleToAvailability,
  getAvailabilityFromSchedule,
  getWorkingHours,
} from "./availablity";
import { z } from "zod";
import { db } from "../../utils/db.server";
import { TimeRange } from "../../types/schedule";
import dayjs from "../../utils/dayjs.index";
import { yyyymmdd } from "../date-fns";
import CustomError from "../../utils/CustomError";

export const ZCreateScheduleSchema = z.object({
  name: z.string(),
  storeId: z.string(),
  availability: z
    .array(
      z.array(
        z.object({
          start: z.date(),
          end: z.date(),
        })
      )
    )
    .optional(),
});

export const ZUpdateInputSchema = z.object({
  scheduleId: z.number(),
  storeId: z.string(),
  timeZone: z.string().optional(),
  name: z.string().optional(),
  isDefault: z.boolean().optional(),
  availability: z
    .array(
      z.array(
        z.object({
          start: z.date(),
          end: z.date(),
        })
      )
    )
    .optional(),
  dateOverrides: z
    .array(
      z.object({
        start: z.date(),
        end: z.date(),
      })
    )
    .optional(),
});

export const ZGetOrDeleteScheduleSchema = z.object({
  scheduleId: z.number(),
});

export const createSchedule = async (
  input: z.infer<typeof ZCreateScheduleSchema>
) => {
  const availability = getAvailabilityFromSchedule(
    input.availability || DEFAULT_SCHEDULE
  );

  const store = await db.store.findUnique({
    where: {
      id: input.storeId,
    },
    select: {
      id: true,
      calendarSetting: {
        select: {
          id: true,
          defaultScheduleId: true,
          timeZone: true,
        },
      },
    },
  });

  if (!store?.calendarSetting) {
    throw new CustomError(
      "Configure and connect with Google Calendar First",
      405
    );
  }

  const schedule = await db.schedule.create({
    data: {
      name: input.name,
      timeZone: store.calendarSetting.timeZone,
      store: {
        connect: {
          id: input.storeId,
        },
      },
      calendarSetting: {
        connect: {
          id: store.calendarSetting.id,
        },
      },
      availability: {
        createMany: {
          data: availability.map((schedule) => ({
            days: schedule.days,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          })),
        },
      },
    },
    select: {
      availability: true,
      id: true,
      name: true,
      timeZone: true,
    },
  });

  if (!store?.calendarSetting?.defaultScheduleId) {
    const calendarSetting = await db.calendarSetting.update({
      where: {
        id: store?.calendarSetting?.id,
      },
      data: {
        defaultScheduleId: schedule.id,
      },
    });
    if (store) {
      store.calendarSetting = calendarSetting;
    }
  }
  return schedule;
};

export const updateSchedule = async (
  input: z.infer<typeof ZUpdateInputSchema>
) => {
  const availability = input.availability
    ? getAvailabilityFromSchedule(input.availability)
    : (input.dateOverrides || []).map((dateOverride) => ({
        startTime: dateOverride.start,
        endTime: dateOverride.end,
        date: dateOverride.start,
        days: [],
      }));

  const schedule = await db.schedule.update({
    where: {
      id: input.scheduleId,
    },
    data: {
      timeZone: input.timeZone,
      name: input.name,
      availability: {
        deleteMany: {
          scheduleId: {
            equals: input.scheduleId,
          },
        },
        createMany: {
          data: [
            ...availability,
            ...(input.dateOverrides || []).map((override) => ({
              date: override.start,
              startTime: override.start,
              endTime: override.end,
            })),
          ],
        },
      },
    },
    select: {
      id: true,
      storeId: true,
      name: true,
      availability: true,
      calendarSetting: true,
      timeZone: true,
      calendarProduct: {
        select: {
          _count: true,
          id: true,
          title: true,
        },
      },
    },
  });

  if (input.isDefault) {
    await db.calendarSetting.update({
      where: {
        id: schedule.calendarSetting.id,
      },
      data: {
        defaultScheduleId: schedule.id,
      },
    });
  }

  const userAvailability = convertScheduleToAvailability(schedule);

  return {
    schedule,
    availability: userAvailability,
    timeZone: schedule.timeZone,
  };
};

export const getSchedule = async (
  input: z.infer<typeof ZGetOrDeleteScheduleSchema>
) => {
  const schedule = await db.schedule.findUnique({
    where: {
      id: input.scheduleId,
    },
    select: {
      id: true,
      storeId: true,
      name: true,
      calendarSetting: {
        select: {
          id: true,
          timeZone: true,
          defaultScheduleId: true,
        },
      },
      availability: true,
      timeZone: true,
    },
  });

  if (!schedule) {
    throw new CustomError("Schedule not found", 404);
  }

  const timeZone = schedule.timeZone || schedule.calendarSetting.timeZone;

  return {
    id: schedule.id,
    name: schedule.name,
    workingHours: getWorkingHours(
      { timeZone: schedule.timeZone || undefined, utcOffset: 0 },
      schedule.availability || []
    ),
    schedule: schedule.availability,
    availability: convertScheduleToAvailability(schedule).map((a) =>
      a.map((startAndEnd) => ({
        ...startAndEnd,
        // Turn our limited granularity into proper end of day.
        end: new Date(
          startAndEnd.end
            .toISOString()
            .replace("23:59:00.000Z", "23:59:59.999Z")
        ),
      }))
    ),
    timeZone,
    dateOverrides: schedule.availability.reduce((acc, override) => {
      // only iff future date override
      if (
        !override.date ||
        (timeZone != null &&
          dayjs.tz(override.date, timeZone).isBefore(dayjs(), "day"))
      ) {
        return acc;
      }
      const newValue = {
        start: dayjs
          .utc(override.date)
          .hour(override.startTime.getUTCHours())
          .minute(override.startTime.getUTCMinutes())
          .toDate(),
        end: dayjs
          .utc(override.date)
          .hour(override.endTime.getUTCHours())
          .minute(override.endTime.getUTCMinutes())
          .toDate(),
      };
      const dayRangeIndex = acc.findIndex(
        // early return prevents override.date from ever being empty.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (item) => yyyymmdd(item.ranges[0].start) === yyyymmdd(override.date!)
      );
      if (dayRangeIndex === -1) {
        acc.push({ ranges: [newValue] });
        return acc;
      }
      acc[dayRangeIndex].ranges.push(newValue);
      return acc;
    }, [] as { ranges: TimeRange[] }[]),
    isDefault:
      !input.scheduleId ||
      schedule.calendarSetting.defaultScheduleId === schedule.id,
  };
};

export const getAllSchedules = async (storeId: string) => {
  const schedules = await db.schedule.findMany({
    where: {
      storeId,
    },
    select: {
      id: true,
      name: true,
    },
  });
  schedules.sort((a, b) => a.name.localeCompare(b.name));
  const calendarSetting = await db.calendarSetting.findUnique({
    where: {
      storeId,
    },
    select: {
      defaultScheduleId: true,
    },
  });
  const defaultSchedule = schedules.find(
    (schedule) => schedule.id === calendarSetting?.defaultScheduleId
  );
  if (!defaultSchedule) {
    throw new CustomError("Default schedule not found", 404);
  }
  //just return a list of all schedules with their id and name and entire default schedule
  return {
    schedules,
    defaultSchedule,
  };
};

export const deleteSchedule = async (
  input: z.infer<typeof ZGetOrDeleteScheduleSchema>
) => {
  const schedule = await db.schedule.findUnique({
    where: {
      id: input.scheduleId,
    },
    select: {
      id: true,
      storeId: true,
      calendarSetting: true,
    },
  });

  if (schedule && schedule.calendarSetting.defaultScheduleId === schedule.id) {
    const scheduleToSetAsDefault = await db.schedule.findFirst({
      where: {
        storeId: schedule.storeId,
        NOT: {
          id: schedule.id,
        },
      },
      select: {
        id: true,
      },
    });
    await db.calendarSetting.update({
      where: {
        id: schedule.calendarSetting.id,
      },
      data: {
        defaultScheduleId: scheduleToSetAsDefault?.id,
      },
    });
  }

  if (!schedule) {
    throw new CustomError("Schedule not found", 404);
  }

  // cannot remove this schedule if this is the last schedule remaining
  // if this is the last remaining schedule of the user then this would be the default schedule and so cannot remove it
  if (schedule.calendarSetting.defaultScheduleId === schedule.id) {
    const scheduleToSetAsDefault = await db.schedule.findFirst({
      where: {
        storeId: schedule.storeId,
        NOT: {
          id: schedule.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (!scheduleToSetAsDefault) {
      throw new CustomError("Cannot remove the last schedule of a store", 400);
    }

    await db.calendarSetting.update({
      where: {
        id: schedule.calendarSetting.id,
      },
      data: {
        defaultScheduleId: scheduleToSetAsDefault.id,
      },
    });
  }

  return db.schedule.delete({
    where: {
      id: input.scheduleId,
    },
  });
};
