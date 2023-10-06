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
  timeZone: z.string(),
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

  const schedule = await db.schedule.create({
    data: {
      name: input.name,
      timeZone: input.timeZone,
      store: {
        connect: {
          id: input.storeId,
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
      store: true,
      availability: true,
      id: true,
      name: true,
      timeZone: true,
    },
  });
  if (!schedule.store.defaultScheduleId) {
    schedule.store = await db.store.update({
      where: {
        id: input.storeId,
      },
      data: {
        defaultScheduleId: schedule.id,
      },
    });
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

  if (input.isDefault) {
    db.store.update({
      where: {
        id: input.storeId,
      },
      data: {
        defaultScheduleId: input.scheduleId,
      },
    });
  }

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
      availability: true,
      timeZone: true,
    },
  });

  if (!schedule) {
    throw new CustomError("Schedule not found", 404);
  }

  const store = await db.store.findUnique({
    where: {
      id: schedule.storeId,
    },
    select: {
      id: true,
      storeTitle: true,
      defaultScheduleId: true,
      timeZone: true,
    },
  });

  const timeZone = schedule?.timeZone || store?.timeZone;

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
    isDefault: !input.scheduleId || store?.defaultScheduleId === schedule.id,
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
    },
  });

  if (!schedule) {
    throw new CustomError("Schedule not found", 404);
  }

  const store = await db.store.findUnique({
    where: {
      id: schedule.storeId,
    },
    select: {
      id: true,
      defaultScheduleId: true,
    },
  });
  // cannot remove this schedule if this is the last schedule remaining
  // if this is the last remaining schedule of the user then this would be the default schedule and so cannot remove it
  if (store?.defaultScheduleId === schedule.id) {
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

    await db.store.update({
      where: {
        id: schedule.storeId,
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
