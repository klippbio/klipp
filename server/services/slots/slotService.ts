import { z } from "zod";
import { db } from "../../utils/db.server";
import getSlots from "./slots";
import dayjs, { Dayjs } from "../../utils/dayjs.index";
import CustomError from "../../utils/CustomError";

interface TimeRange {
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
}

export const ZGetAvailableSlotSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  // Event type slug
  storeItemId: z.number(),
  // invitee timezone
  timeZone: z.string(),
});

export const getAvailableSlotsService = async (
  input: z.infer<typeof ZGetAvailableSlotSchema>
) => {
  const { startTime, endTime, storeItemId, timeZone: inputTimezone } = input;

  const storeItem = await db.storeItem.findUnique({
    where: {
      id: storeItemId,
    },
    include: {
      calendarProduct: true,
    },
  });

  // Retrieve the Calendar Product
  const calendarProduct = await db.calendarProduct.findUnique({
    where: {
      id: storeItem?.calendarProduct?.id,
    },
    include: {
      bookings: true,
      schedule: true,
      calendarSetting: true,
    },
  });

  if (!calendarProduct?.scheduleId) {
    throw new CustomError(
      "Internal Server Error, User has not connected !",
      404
    );
  }

  const scheduleForProduct = await db.availability.findMany({
    where: {
      scheduleId: calendarProduct?.scheduleId,
    },
  });

  const organizerTimeZone = calendarProduct.calendarSetting.timeZone;

  if (!calendarProduct) {
    throw new CustomError("Calendar product not found", 404);
  }

  if (organizerTimeZone === null) {
    throw new CustomError(
      "Calendar Product Owner has no default timezone !",
      404
    );
  }

  // Step 1: Transform Weekly Availability to Date Ranges
  const startDate = dayjs.utc(startTime);
  const endDate = dayjs(endTime);
  const endDateAdjusted = dayjs(endTime).add(1, "day");
  const dateRanges = [];
  let currentDate = startDate.clone().tz(organizerTimeZone, true);
  const dateOverrides = scheduleForProduct.filter((a) => a.days.length === 0);
  const weeklyAvailabilities = scheduleForProduct.filter(
    (a) => a.days.length > 0
  );

  function incrementDateByOneDay(dayjsDate: Dayjs) {
    // Convert to JavaScript Date, increment by one day, and convert back to Day.js
    const date = dayjsDate.toDate();
    date.setDate(date.getDate() + 1);
    return dayjs(date);
  }

  while (currentDate.isBefore(endDateAdjusted)) {
    const dayOfWeek = currentDate.day();

    const isUnavailable = dateOverrides.some((override) => {
      if (!override.date) {
        return false;
      }

      // Format both dates to 'YYYY-MM-DD' for comparison
      const formattedOverrideDate = override.date.toISOString().split("T")[0];
      const formattedCurrentDate = currentDate.format("YYYY-MM-DD");

      // Directly compare the formatted date strings
      return formattedCurrentDate === formattedOverrideDate;
    });

    if (isUnavailable) {
      currentDate = incrementDateByOneDay(currentDate);
      continue;
    }

    // Find availability for the current day of the week
    const availableToday = weeklyAvailabilities.find((a) =>
      a.days.includes(dayOfWeek)
    );

    if (availableToday) {
      // Parse availability times in UTC
      const startTimeParsed = dayjs.utc(availableToday.startTime);
      const endTimeParsed = dayjs.utc(availableToday.endTime);

      // Create start and end times in the organizer's timezone with the correct date
      const startDateTime = currentDate
        .clone()
        .hour(startTimeParsed.hour())
        .minute(startTimeParsed.minute())
        .tz(organizerTimeZone, true)
        .utc();

      const endDateTime = currentDate
        .clone()
        .hour(endTimeParsed.hour())
        .minute(endTimeParsed.minute())
        .tz(organizerTimeZone, true)
        .utc();
      dateRanges.push({ start: startDateTime, end: endDateTime });
    }

    currentDate = incrementDateByOneDay(currentDate);
  }

  // Step 2: Exclude Booked Times
  const busyTimes: TimeRange[] = calendarProduct.bookings
    .filter(
      (booking) => booking.bookingStatus !== "CANCELLED" && booking.meetingId
    )
    .map((booking) => {
      // Parse booking times in UTC
      const bookingStartTimeParsed = dayjs.utc(booking.startTime);
      const bookingEndTimeParsed = dayjs.utc(booking.endTime);

      return {
        start: bookingStartTimeParsed,
        end: bookingEndTimeParsed,
      };
    });

  // This function checks if two time ranges overlap
  const doTimesOverlap = (range1: TimeRange, range2: TimeRange) => {
    return (
      range1.start.isBefore(range2.end) && range1.end.isAfter(range2.start)
    );
  };

  // Here we filter out only the times that are busy, but keep the date ranges
  const availableDateRanges: TimeRange[] = dateRanges.reduce<TimeRange[]>(
    (acc, range) => {
      // Start with the entire range and cut out busy times
      let currentRange: TimeRange[] = [range];

      busyTimes.forEach((busyTime) => {
        currentRange = currentRange.flatMap<TimeRange>((r) => {
          if (doTimesOverlap(r, busyTime)) {
            // If there's an overlap, we cut the range into two, before and after the busy time
            const beforeBusy = { start: r.start, end: busyTime.start };
            const afterBusy = { start: busyTime.end, end: r.end };

            // We return only the parts of the range that are outside the busy time
            return [beforeBusy, afterBusy].filter((newRange) =>
              newRange.start.isBefore(newRange.end)
            );
          } else {
            // If there's no overlap, we keep the range as it is
            return [r];
          }
        });
      });

      // Accumulate the ranges that are free
      return acc.concat(currentRange);
    },
    []
  );

  const slots = getSlots({
    inviteeDate: startDate,
    frequency: calendarProduct.length,
    dateRanges: availableDateRanges,
    minimumBookingNotice: calendarProduct.minimumBookingNotice,
    eventLength: calendarProduct.length,
    organizerTimeZone: organizerTimeZone,
    // Additional parameters as required by getSlots
  });

  const formatter = new Intl.DateTimeFormat("fr-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: inputTimezone,
  });

  const computedAvailableSlots = slots.reduce(
    (
      r: Record<
        string,
        {
          time: string;
        }[]
      >,
      { time, ...passThroughProps }
    ) => {
      // Extracting $d and $x from the Day.js object
      const isoString = time.toISOString();

      const dateString = formatter.format(time.toDate());

      if (time.isBefore(endDate) && time.isAfter(startDate) && isoString) {
        r[dateString] = r[dateString] || [];
        r[dateString].push({
          ...passThroughProps,
          time: isoString,
        });
      }

      return r;
    },
    Object.create(null)
  );

  return { slots: computedAvailableSlots };
};
