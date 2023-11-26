import { z } from "zod";
import { PeriodType } from "@prisma/client";
import { db } from "../../utils/db.server";
import CustomError from "../../utils/CustomError";

// Schema for creating a CalendarProduct
export const ZCreateCalendarProductSchema = z.object({
  storeId: z.string(),
  id: z.number().optional(),
  title: z.string(),
  thumbnailUrl: z.string().optional(),
  slug: z.string(),
  shortDescription: z.string().optional(),
  description: z.any().optional(),
  length: z.number(),
  hidden: z.boolean().optional(),
  timeZone: z.string().optional(),
  price: z.string().optional(),
  recPrice: z.string().optional(),
  minPrice: z.string().optional(),
  flexPrice: z.boolean().optional(),
  currency: z.array(z.string()).optional(),
  periodType: z.nativeEnum(PeriodType).optional(),
  periodStartDate: z.date().optional(),
  periodEndDate: z.date().optional(),
  minimumBookingNotice: z.number().optional(),
  beforeEventBuffer: z.number().optional(),
  afterEventBuffer: z.number().optional(),
});

// Schema for updating a CalendarProduct
export const ZUpdateCalendarProductSchema =
  ZCreateCalendarProductSchema.partial();

// Function to create a CalendarProduct
export const createCalendarProduct = async (
  input: z.infer<typeof ZCreateCalendarProductSchema>
) => {
  const { storeId, id, ...restOfInput } = input; // Destructure to separate storeId and the rest
  if (id) {
    throw new CustomError("Cannot create a calendar product with an id", 400);
  }

  const store = await db.store.findUnique({
    where: {
      id: storeId,
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

  if (!store?.calendarSetting?.id) {
    throw new CustomError(
      "Configure and connect with Google Calendar First",
      404
    );
  }

  if (!store?.calendarSetting?.defaultScheduleId) {
    throw new CustomError("Create a schedule first", 404);
  }

  const availabilities = await db.availability.findMany({
    where: {
      scheduleId: store.calendarSetting.defaultScheduleId,
    },
    select: {
      id: true,
    },
  });

  const calendarProduct = await db.storeItem.create({
    data: {
      itemType: "CALENDER",
      store: {
        connect: {
          id: storeId,
        },
      },
      calendarProduct: {
        create: {
          ...restOfInput,
          description: restOfInput.description
            ? JSON.parse(restOfInput.description)
            : null,
          calendarSetting: {
            connect: {
              id: store?.calendarSetting?.id,
            },
          },
          schedule: {
            connect: {
              id: store?.calendarSetting.defaultScheduleId,
            },
          },
          availability: {
            connect: availabilities.map((availability) => ({
              id: availability.id,
            })),
          },
        },
      },
    },
    include: {
      calendarProduct: true,
    },
  });

  return calendarProduct;
};

// Function to update a CalendarProduct
export const updateCalendarProduct = async (
  input: z.infer<typeof ZUpdateCalendarProductSchema>
) => {
  if (!input.id) {
    throw new CustomError("Missing id", 400);
  }
  const { storeId, id, ...restOfInput } = input; // Destructure to separate id and the rest
  if (!storeId) {
    throw new CustomError("Missing storeId", 400);
  }
  const updatedCalendarProduct = await db.calendarProduct.update({
    where: { id },
    data: {
      ...restOfInput,
      description: JSON.stringify(restOfInput.description),
    },
    include: {
      bookings: true,
      availability: true,
      schedule: true,
      calendarSetting: true,
      storeItem: true,
    },
  });

  return updatedCalendarProduct;
};

export const updateCalendarProductSchedule = async (
  calendarProductId: number,
  scheduleId: number
) => {
  const availabilities = await db.availability.findMany({
    where: {
      scheduleId,
    },
    select: {
      id: true,
    },
  });

  const calendarProduct = await db.calendarProduct.update({
    where: { id: calendarProductId },
    data: {
      schedule: {
        connect: {
          id: scheduleId,
        },
      },
      availability: {
        connect: availabilities.map((availability) => ({
          id: availability.id,
        })),
      },
    },
    include: {
      bookings: true,
      availability: true,
      schedule: true,
      calendarSetting: true,
      storeItem: true,
    },
  });

  return calendarProduct;
};

// Function to get a CalendarProduct by ID
export const getCalendarProduct = async (id: number) => {
  const calendarProduct = await db.calendarProduct.findUnique({
    where: { id },
    include: {
      bookings: true,
      availability: true,
      schedule: true,
      calendarSetting: true,
      storeItem: true,
    },
  });

  if (!calendarProduct) {
    throw new CustomError("CalendarProduct not found", 404);
  }

  return calendarProduct;
};

// Function to list all CalendarProducts
export const getAllCalendarProducts = async (
  input: z.infer<typeof ZUpdateCalendarProductSchema>
) => {
  return db.calendarProduct.findMany({
    where: {
      storeItem: {
        storeId: input.storeId,
      },
    },
    include: {
      bookings: true,
      availability: true,
      schedule: true,
      calendarSetting: true,
      storeItem: true,
    },
  });
};

// Function to delete a CalendarProduct
export const deleteCalendarProduct = async (id: number) => {
  const calendarProduct = await db.calendarProduct.delete({
    where: { id },
  });

  return calendarProduct;
};

// Add more functions as needed for specific operations related to CalendarProduct
