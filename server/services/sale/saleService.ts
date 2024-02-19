import { cancelGoogleCalendarEvent } from "./../googleCalendar/googleCalendarService";
import { z } from "zod";
import dayjs from "../../utils/dayjs.index";
import { db } from "../../utils/db.server";
import { createGoogleCalendarBooking } from "../googleCalendar/googleCalendarService";

function getEndTimes(startTime: string, meetingLength: number): string {
  return dayjs(startTime)
    .utc() // Parse the time in UTC
    .add(meetingLength, "minute") // Add the meeting length in minutes
    .toISOString(); // Convert back to ISO string
}

export const ZCalendarSaleFormDataSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  slot: z.string(),
  timezone: z.string(),
});

export const ZDigitalProductSaleFormDataSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export const ZCreateNewSaleSchema = z.object({
  storeUrl: z.string(),
  itemId: z.number(),
  itemType: z.string(),
  saleId: z.string().optional().nullable(),
  reschedule: z.string().optional().nullable(),
  // Use z.union to accept either ZCalendarSaleFormDataSchema or ZDigitalProductSaleFormDataSchema
  saleFormData: z.union([
    ZCalendarSaleFormDataSchema,
    ZDigitalProductSaleFormDataSchema,
  ]),
});

export const ZRescheduleSaleSchema = z.object({
  storeUrl: z.string(),
  itemId: z.number(),
  itemType: z.string(),
  saleId: z.string().optional(),
  reschedule: z.string().optional(),
  saleFormData: ZCalendarSaleFormDataSchema,
});

export const createNewSale = async (
  input: z.infer<typeof ZCreateNewSaleSchema>
) => {
  const { saleFormData, itemId, itemType } = input;
  const storeItem = await db.storeItem.findFirst({
    where: {
      id: itemId,
    },
    select: {
      calendarProduct: itemType === "CALENDAR" ? true : false,
      DigitalProduct: itemType === "DIGITALPRODUCT" ? true : false,
      store: true,
      id: true,
    },
  });

  let customerTimezone, slot;

  if ("timezone" in saleFormData && "slot" in saleFormData) {
    customerTimezone = saleFormData.timezone;
    slot = saleFormData.slot;
  }

  const { name: customerName, email: customerEmail } = saleFormData;

  const saleInfo = await db.sale.create({
    data: {
      salePrice:
        storeItem?.calendarProduct?.price ||
        storeItem?.DigitalProduct?.price ||
        "0",
      buyerEmail: customerEmail,
      buyerName: customerName,
      status: "PENDING", //change this while waiting for payment!
      store: {
        connect: {
          id: storeItem?.store.id,
        },
      },
      storeItem: {
        connect: {
          id: storeItem?.id,
        },
      },
    },
  });

  if (itemType === "CALENDAR" && slot && customerTimezone) {
    const calendarProduct = storeItem?.calendarProduct;
    const meetingLength = calendarProduct?.length as number;

    const endTime = getEndTimes(slot, meetingLength);

    const meetingName =
      "Meeting " + calendarProduct?.title + " with " + customerName;

    const googleCalendarResponse = await createGoogleCalendarBooking(
      storeItem?.store.id as string,
      meetingName,
      slot,
      endTime
    );

    if (!googleCalendarResponse) {
      throw new Error("Failed to create google calendar event");
    }

    const booking = await db.booking.create({
      data: {
        title: meetingName,
        startTime: slot,
        bookingStatus: "SCHEDULED",
        endTime: endTime,
        attendees: {
          connectOrCreate: {
            where: {
              email: customerEmail,
            },
            create: {
              name: customerName,
              email: customerEmail,
              timeZone: customerTimezone,
            },
          },
        },
        calendarProduct: {
          connect: {
            id: storeItem?.calendarProduct?.id,
          },
        },
        store: {
          connect: {
            id: storeItem?.store.id,
          },
        },
        sale: {
          connect: {
            id: saleInfo.id,
          },
        },
      },
    });
    await db.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        meetingUrl: googleCalendarResponse.meetingUrl,
        meetingId: googleCalendarResponse.meetingId,
        googleCalendar: {
          connect: {
            id: googleCalendarResponse.googleCalendarID,
          },
        },
      },
    });
  }

  if (itemType === "DIGITALPRODUCT") {
    //do if something special is needed for digital product
  }

  //call stripe to create a payment intent

  // Update the sale status to "COMPLETED" after the booking is created
  const updatedSale = await db.sale.update({
    where: {
      id: saleInfo.id,
    },
    data: {
      status: "COMPLETED",
    },
  });

  return updatedSale;
};

export const getAllSales = async () => {
  const sales = await db.sale.findMany({
    include: {
      storeItem: true,
      booking: true,
      store: {
        include: {
          user: true,
        },
      },
    },
  });
  return sales;
};

export const getSale = async (id: number) => {
  const sale = await db.sale.findFirst({
    where: {
      id: id,
    },
    include: {
      storeItem: true,
      booking: true,
      store: {
        include: {
          user: true,
        },
      },
    },
  });
  return sale;
};

export const rescheduleSale = async (
  input: z.infer<typeof ZRescheduleSaleSchema>
) => {
  const { saleFormData, itemId, itemType, saleId } = input;
  const storeItem = await db.storeItem.findFirst({
    where: {
      id: itemId,
    },
    select: {
      calendarProduct: true,
      store: true,
      id: true,
    },
  });

  const {
    name: customerName,
    email: customerEmail,
    timezone: customerTimezone,
    slot,
  } = saleFormData;

  if (itemType === "CALENDAR" && slot && customerTimezone && Number(saleId)) {
    const calendarProduct = storeItem?.calendarProduct;
    const meetingLength = calendarProduct?.length as number;

    const endTime = getEndTimes(slot, meetingLength);

    const meetingName =
      "Meeting " + calendarProduct?.title + " with " + customerName;

    const deleteBookingId = await db.sale.findFirst({
      where: {
        id: Number(saleId),
      },
      select: {
        booking: {
          select: {
            id: true,
          },
        },
      },
    });

    await cancelGoogleCalendarSale(Number(saleId));

    await db.booking.update({
      where: {
        id: deleteBookingId?.booking?.id as number,
      },
      data: {
        bookingStatus: "CANCELLED",
        saleId: null,
        cancelledSaleId: Number(saleId),
      },
    });

    const booking = await db.booking.create({
      data: {
        title: meetingName,
        startTime: slot,
        endTime: endTime,
        bookingStatus: "SCHEDULED",
        attendees: {
          connectOrCreate: {
            where: {
              email: customerEmail,
            },
            create: {
              name: customerName,
              email: customerEmail,
              timeZone: customerTimezone,
            },
          },
        },
        calendarProduct: {
          connect: {
            id: storeItem?.calendarProduct?.id,
          },
        },
        store: {
          connect: {
            id: storeItem?.store.id,
          },
        },
      },
    });

    //update saleinfo connection to booking
    const updatedSale = await db.sale.update({
      where: {
        id: Number(saleId),
      },
      data: {
        buyerEmail: customerEmail,
        buyerName: customerName,
        booking: {
          connect: {
            id: booking.id,
          },
        },
      },
      include: {
        booking: true,
      },
    });

    const googleCalendarResponse = await createGoogleCalendarBooking(
      storeItem?.store.id as string,
      meetingName,
      slot,
      endTime
    );

    await db.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        meetingUrl: googleCalendarResponse.meetingUrl,
        meetingId: googleCalendarResponse.meetingId,
        googleCalendar: {
          connect: {
            id: googleCalendarResponse.googleCalendarID,
          },
        },
      },
    });
    return updatedSale;
  }
};

export const cancelGoogleCalendarSale = async (saleId: number | undefined) => {
  if (!saleId) return false;
  const sale = await db.sale.findFirst({
    where: {
      id: saleId,
    },
    include: {
      booking: true,
    },
  });

  if (sale?.booking?.meetingId) {
    const googleCalendarID = sale.booking.meetingId;
    const googleCalendarResponse = await cancelGoogleCalendarEvent(
      sale.storeId,
      googleCalendarID
    );
    await db.booking.update({
      where: {
        id: sale.booking.id,
      },
      data: {
        bookingStatus: "CANCELLED",
        cancelledSaleId: sale.id,
      },
    });
    //TODO: call stripe to refund the payment if price is more than 0
    if (sale.salePrice !== "0") {
      //call stripe to refund the payment
      await db.sale.update({
        where: {
          id: sale.id,
        },
        data: {
          status: "REFUNDED",
        },
      });
    }

    return googleCalendarResponse;
  }
  return false;
};
