import { db } from "../../utils/db.server";

export const getUpcomingBookings = async (storeId: string) => {
  const bookings = await db.booking.findMany({
    where: {
      storeId: storeId,
      bookingStatus: "SCHEDULED",
    },
    include: {
      sale: {
        include: {
          storeItem: true,
        },
      },
      store: true,
    },
  });

  //filter bookings as upcoming if the date is greater than today and not cancelled
  const upcomingBookings = bookings.filter(
    (booking) => new Date(booking.startTime) >= new Date()
  );

  return upcomingBookings;
};

export const getPastBookings = async (storeId: string) => {
  const bookings = await db.booking.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      sale: {
        include: {
          storeItem: true,
        },
      },
      store: true,
    },
  });

  //filter bookings as past if the date is less than today or cancelled
  const pastBookings = bookings.filter(
    (booking) =>
      new Date(booking.startTime) < new Date() ||
      booking.bookingStatus === "CANCELLED"
  );

  //sort past bookings by date
  pastBookings.sort((a, b) => {
    return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
  });

  return pastBookings;
};

export const getCancelledBookings = async (storeId: string) => {
  const bookings = await db.booking.findMany({
    where: {
      storeId: storeId,
      bookingStatus: "CANCELLED",
    },
    include: {
      sale: {
        include: {
          storeItem: true,
        },
      },
      store: true,
    },
  });

  return bookings;
};
