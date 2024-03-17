import { cancelGoogleCalendarEvent } from "./../googleCalendar/googleCalendarService";
import { z } from "zod";
import dayjs from "../../utils/dayjs.index";
import { db } from "../../utils/db.server";
import { createGoogleCalendarBooking } from "../googleCalendar/googleCalendarService";
import { refundCharge } from "../../controllers/paymentController";
import {
  meetingCancelledEmail,
  meetingCreatedEmail,
  meetingRescheduledEmail,
} from "../../controllers/saleController";
type StatusType = "PENDING" | "COMPLETED" | "REFUNDED";

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

    await db.booking.create({
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

    // if (saleInfo.salePrice === "0") {
    //   const googleCalendarResponse = await createGoogleCalendarBooking(
    //     storeItem?.store.id as string,
    //     meetingName,
    //     slot,
    //     endTime
    //   );
    //   if (!googleCalendarResponse) {
    //     //TODO: "Handle this error and mail to klippbio@gmail.com"
    //     throw new Error("Failed to create google calendar event");
    //   }
    //   await db.booking.update({
    //     where: {
    //       id: booking.id,
    //     },
    //     data: {
    //       meetingUrl: googleCalendarResponse.meetingUrl,
    //       meetingId: googleCalendarResponse.meetingId,
    //       googleCalendar: {
    //         connect: {
    //           id: googleCalendarResponse.googleCalendarID,
    //         },
    //       },
    //     },
    //   });
    // }
  }
  return saleInfo;
};

export const updateSaleStatus = async (saleId: string, status: StatusType) => {
  const sale = await db.sale.findUnique({
    where: {
      id: String(saleId),
    },
    include: {
      booking: true,
      store: true,
      storeItem: {
        include: {
          DigitalProduct: true,
          calendarProduct: true,
        },
      },
    },
  });

  if (sale && sale.storeItem.itemType === "CALENDAR" && sale.booking) {
    const googleCalendarResponse = await createGoogleCalendarBooking(
      sale.storeId,
      sale.booking.title,
      sale.booking.startTime.toISOString(),
      sale.booking.endTime.toISOString()
    );

    if (!googleCalendarResponse) {
      throw new Error(
        "Sorry we were not able to create the google calendar event."
      );
    }

    await db.booking.update({
      where: {
        id: sale.booking.id,
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

  const updatedSale = await db.sale.update({
    where: {
      id: String(saleId),
    },
    data: {
      status: status,
    },
    include: {
      booking: true,
      store: true,
      storeItem: {
        include: {
          DigitalProduct: true,
          calendarProduct: true,
        },
      },
    },
  });

  const storeId = updatedSale.storeId;
  const storeDetails = await db.store.findUnique({
    where: { id: storeId },
    include: { user: true },
  });

  const toEmail = storeDetails?.user.email;

  if (
    toEmail &&
    updatedSale?.store?.storeTitle &&
    updatedSale?.booking?.startTime
  ) {
    const data = {
      toEmail: toEmail,
      toName: updatedSale?.store?.storeTitle,
      meetingDetails: updatedSale?.booking?.startTime,
      itemName: updatedSale?.booking?.title,
    };
    await meetingCreatedEmail(data);
  }
  return updatedSale;
};

export const getAllSales = async (storeId: string) => {
  const sales = await db.sale.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      storeItem: {
        include: {
          DigitalProduct: {
            include: {
              ddFiles: true,
            },
          },
          calendarProduct: true,
          Link: true,
        },
      },
      booking: true,
      store: {
        include: {
          user: true,
        },
      },
    },
  });

  // First, sort the sales
  const sortedSales = sales.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Then, filter the sorted sales for those that have a status of "COMPLETED"
  const completedSales = sortedSales.filter(
    (sale) => sale.status === "COMPLETED" || sale.status === "REFUNDED"
  );

  return completedSales;
};

export const getSale = async (id: string) => {
  const sale = await db.sale.findFirst({
    where: {
      id: id,
    },
    include: {
      storeItem: {
        include: {
          DigitalProduct: {
            include: {
              ddFiles: true,
            },
          },
          calendarProduct: true,
        },
      },
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

  if (itemType === "CALENDAR" && slot && customerTimezone && String(saleId)) {
    const calendarProduct = storeItem?.calendarProduct;
    const meetingLength = calendarProduct?.length as number;

    const endTime = getEndTimes(slot, meetingLength);

    const meetingName =
      "Meeting " + calendarProduct?.title + " with " + customerName;

    const deleteBookingId = await db.sale.findFirst({
      where: {
        id: String(saleId),
      },
      select: {
        booking: {
          select: {
            id: true,
          },
        },
      },
    });

    await cancelGoogleCalendarSale(String(saleId));

    const cancelledBooking = await db.booking.update({
      where: {
        id: deleteBookingId?.booking?.id as number,
      },
      data: {
        bookingStatus: "CANCELLED",
        saleId: null,
        cancelledSaleId: String(saleId),
      },
    });

    const newBooking = await db.booking.create({
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
        id: String(saleId),
      },
      data: {
        buyerEmail: customerEmail,
        buyerName: customerName,
        booking: {
          connect: {
            id: newBooking.id,
          },
        },
      },
      include: {
        booking: true,
        store: true,
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
        id: newBooking.id,
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

    const storeId = updatedSale.storeId;
    const storeDetails = await db.store.findUnique({
      where: { id: storeId },
      include: { user: true },
    });

    const toEmail = storeDetails?.user.email;

    if (
      toEmail &&
      updatedSale?.store?.storeTitle &&
      updatedSale?.booking?.startTime
    ) {
      const data = {
        toEmail: toEmail,
        fromEmail: updatedSale?.buyerEmail,
        toName: updatedSale?.store?.storeTitle,
        meetingDetails: cancelledBooking.startTime,
        newMeetingDetails: updatedSale?.booking?.startTime,
        itemName: updatedSale?.booking?.title,
      };
      await meetingRescheduledEmail(data);
    }

    return updatedSale;
  }
};

export const cancelGoogleCalendarSale = async (saleId: string | undefined) => {
  if (!saleId) return false;
  const sale = await db.sale.findFirst({
    where: {
      id: saleId,
    },
    include: {
      booking: true,
      transaction: true,
      store: true,
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
      await refundCharge(sale.transaction?.charge_id as string);
      await db.sale.update({
        where: {
          id: sale.id,
        },
        data: {
          status: "REFUNDED",
        },
      });
    }
    const storeId = sale.storeId;
    const storeDetails = await db.store.findUnique({
      where: { id: storeId },
      include: { user: true },
    });

    const toEmail = storeDetails?.user.email;

    if (toEmail && sale?.store?.storeTitle && sale?.booking?.startTime) {
      const data = {
        toEmail: toEmail,
        fromEmail: sale?.buyerEmail,
        toName: sale?.store?.storeTitle,
        meetingDetails: sale?.booking?.startTime,
        itemName: sale?.booking?.title,
      };

      await meetingCancelledEmail(data);
    }

    return googleCalendarResponse;
  }
  return false;
};
