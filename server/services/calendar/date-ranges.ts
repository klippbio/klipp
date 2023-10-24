import type { Availability } from "@prisma/client";
import { Dayjs } from "../../utils/dayjs.index";
import dayjs from "../../utils/dayjs.index";

export type DateRange = {
  start: Dayjs;
  end: Dayjs;
};

export type DateOverride = Pick<Availability, "date" | "startTime" | "endTime">;
export type WorkingHours = Pick<Availability, "days" | "startTime" | "endTime">;

export function processWorkingHours({
  item,
  timeZone,
  dateFrom,
  dateTo,
}: {
  item: WorkingHours;
  timeZone: string;
  dateFrom: Dayjs;
  dateTo: Dayjs;
}) {
  const results = [];
  for (
    let date = dateFrom.tz(timeZone).startOf("day");
    dateTo.isAfter(date);
    date = date.add(1, "day")
  ) {
    const dateInTz = date.tz(timeZone);

    if (!item.days.includes(dateInTz.day())) {
      continue;
    }

    let start = dateInTz
      .hour(item.startTime.getUTCHours())
      .minute(item.startTime.getUTCMinutes())
      .second(0);

    let end = dateInTz
      .hour(item.endTime.getUTCHours())
      .minute(item.endTime.getUTCMinutes())
      .second(0);

    const offsetBeginningOfDay = dayjs(start.format("YYYY-MM-DD hh:mm"))
      .tz(timeZone)
      .utcOffset();
    const offsetDiff = start.utcOffset() - offsetBeginningOfDay; // there will be 60 min offset on the day day of DST change

    start = start.add(offsetDiff, "minute");
    end = end.add(offsetDiff, "minute");

    const startResult = dayjs.max(start, dateFrom.tz(timeZone));
    const endResult = dayjs.min(end, dateTo.tz(timeZone));

    if (startResult.isAfter(endResult)) {
      // if an event ends before start, it's not a result.
      continue;
    }

    results.push({
      start: startResult,
      end: endResult,
    });
  }
  return results;
}

export function processDateOverride({
  item,
  timeZone,
}: {
  item: DateOverride;
  timeZone: string;
}) {
  const startDate = dayjs
    .utc(item.date)
    .startOf("day")
    .add(item.startTime.getUTCHours(), "hours")
    .add(item.startTime.getUTCMinutes(), "minutes")
    .second(0)
    .tz(timeZone, true);
  const endDate = dayjs
    .utc(item.date)
    .startOf("day")
    .add(item.endTime.getUTCHours(), "hours")
    .add(item.endTime.getUTCMinutes(), "minutes")
    .second(0)
    .tz(timeZone, true);
  return {
    start: startDate,
    end: endDate,
  };
}

export function buildDateRanges({
  availability,
  timeZone /* Organizer timeZone */,
  dateFrom /* Attendee dateFrom */,
  dateTo /* `` dateTo */,
}: {
  timeZone: string;
  availability: (DateOverride | WorkingHours)[];
  dateFrom: Dayjs;
  dateTo: Dayjs;
}): DateRange[] {
  const groupedWorkingHours = groupByDate(
    availability.reduce((processed: DateRange[], item) => {
      if ("days" in item) {
        processed = processed.concat(
          processWorkingHours({ item, timeZone, dateFrom, dateTo })
        );
      }
      return processed;
    }, [])
  );
  const groupedDateOverrides = groupByDate(
    availability.reduce((processed: DateRange[], item) => {
      if ("date" in item && !!item.date) {
        processed.push(processDateOverride({ item, timeZone }));
      }
      return processed;
    }, [])
  );

  const dateRanges = Object.values({
    ...groupedWorkingHours,
    ...groupedDateOverrides,
  }).map(
    // remove 0-length overrides that were kept to cancel out working dates until now.
    (ranges) =>
      ranges.filter((range) => range.start.valueOf() !== range.end.valueOf())
  );

  return dateRanges.flat();
}

export function groupByDate(ranges: DateRange[]): { [x: string]: DateRange[] } {
  const results = ranges.reduce(
    (
      previousValue: {
        [date: string]: DateRange[];
      },
      currentValue
    ) => {
      const dateString = dayjs(currentValue.start).format("YYYY-MM-DD");

      previousValue[dateString] =
        typeof previousValue[dateString] === "undefined"
          ? [currentValue]
          : [...previousValue[dateString], currentValue];
      return previousValue;
    },
    {}
  );

  return results;
}

export function subtract(
  sourceRanges: (DateRange & { [x: string]: unknown })[],
  excludedRanges: DateRange[]
) {
  const result: DateRange[] = [];

  for (const {
    start: sourceStart,
    end: sourceEnd,
    ...passThrough
  } of sourceRanges) {
    let currentStart = sourceStart;

    const overlappingRanges = excludedRanges.filter(
      ({ start, end }) => start.isBefore(sourceEnd) && end.isAfter(sourceStart)
    );

    overlappingRanges.sort((a, b) => (a.start.isAfter(b.start) ? 1 : -1));

    for (const {
      start: excludedStart,
      end: excludedEnd,
    } of overlappingRanges) {
      if (excludedStart.isAfter(currentStart)) {
        result.push({ start: currentStart, end: excludedStart });
      }
      currentStart = excludedEnd.isAfter(currentStart)
        ? excludedEnd
        : currentStart;
    }

    if (sourceEnd.isAfter(currentStart)) {
      result.push({ start: currentStart, end: sourceEnd, ...passThrough });
    }
  }

  return result;
}
