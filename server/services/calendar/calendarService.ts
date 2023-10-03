import {
  DEFAULT_SCHEDULE,
  convertScheduleToAvailability,
  getAvailabilityFromSchedule,
} from "./availablity";
import { z } from "zod";
import { db } from "../../utils/db.server";
import type { Prisma } from "@prisma/client";
import { scheduler } from "timers/promises";

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

export const createSchedule = async (
  input: z.infer<typeof ZCreateScheduleSchema>
) => {
  const availability = getAvailabilityFromSchedule(
    input.availability || DEFAULT_SCHEDULE
  );

  const schedule = await db.schedule.create({
    data: {
      name: input.name,
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
    await db.store.update({
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
