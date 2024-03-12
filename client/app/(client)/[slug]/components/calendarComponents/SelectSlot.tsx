import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import AxiosApi from "@/app/services/axios";
import { SlotCalendar } from "@/components/ui/slotCalendar";
import { Skeleton } from "@/components/ui/skeleton";

// Define the type for the slot object
type Slot = {
  time: string;
};

// Define the type for monthlySlots
type MonthlySlots = {
  [key: string]: Slot[];
};

type SlotQueryResult = {
  slots: MonthlySlots; // As defined earlier
  disabledDates: Date[]; // Array of disabled dates
  firstAvailableDate: string | null; // Array of available dates
};

function getDisabledAndAvailableDates(
  slotsData: MonthlySlots,
  currentDate: string | null,
  timezone: string
) {
  if (!currentDate) {
    return { disabledDates: [], firstAvailableDate: null };
  }

  const startOfMonth = dayjs(currentDate).tz(timezone).startOf("month");
  const endOfMonth = dayjs(currentDate).tz(timezone).endOf("month");

  const disabledDates = [];
  let firstAvailableDate: string | null = null;

  for (
    let day = startOfMonth;
    day.isBefore(endOfMonth) || day.isSame(endOfMonth, "day");
    day = day.add(1, "day")
  ) {
    const dayStr = day.format("YYYY-MM-DD");
    if (!slotsData[dayStr]) {
      disabledDates.push(day.toDate()); // Add a copy of the date to the array
    } else if (!firstAvailableDate) {
      firstAvailableDate = day.toISOString(); // Set the first available date
    }
  }

  return { disabledDates, firstAvailableDate };
}

function SelectSlot({
  timezone,
  storeItemId,
  onSlotSelect,
  selectedSlot,
}: {
  timezone: string;
  storeItemId: number;
  onSlotSelect: (utcSlot: string) => void;
  selectedSlot: string | undefined;
}) {
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().tz(timezone).toISOString()
  );
  useEffect(() => {
    setSelectedDate(dayjs(selectedDate).tz(timezone).toISOString());
  }, [timezone, selectedDate]);

  const handleMonthChange = (monthDate: Date) => {
    setSelectedDate(dayjs(monthDate).tz(timezone).toISOString());
  };
  const { data: slotQueryData, isLoading } = useQuery<SlotQueryResult>(
    [
      "calendarProduct",
      storeItemId,
      dayjs(selectedDate).format("YYYY-MM"),
      timezone,
    ],
    async () => {
      const startDate = dayjs(selectedDate).startOf("month").toISOString();
      const endDate = dayjs(selectedDate).endOf("month").toISOString();
      const response = await AxiosApi(
        "GET",
        `/api/slots/get/?storeItemId=${storeItemId}&startTime=${startDate}&endTime=${endDate}&timeZone=${timezone}`
      );
      const slotsData = response.data.slots;

      if (Object.keys(slotsData).length === 0) {
        return { slots: {}, disabledDates: [], firstAvailableDate: null };
      }

      const monthAvailability = getDisabledAndAvailableDates(
        slotsData,
        selectedDate,
        timezone
      );
      const disabledDates = monthAvailability.disabledDates;
      const firstAvailableDate = monthAvailability.firstAvailableDate;
      const selectedDateString = dayjs(selectedDate).format("YYYY-MM-DD");
      if (
        disabledDates.some(
          (disabledDate) =>
            dayjs(disabledDate).format("YYYY-MM-DD") === selectedDateString
        )
      ) {
        // Update selectedDate to the first available date
        const availableDates = Object.keys(slotsData).filter(
          (date) => !disabledDates.includes(new Date(date))
        );
        if (availableDates.length > 0) {
          setSelectedDate(dayjs(availableDates[0]).tz(timezone).toISOString());
        }
      }

      return { slots: slotsData, disabledDates, firstAvailableDate };
    },
    { enabled: !!storeItemId && !!selectedDate }
  );
  // Extract slots and disabled dates from the query data
  const monthlySlots = slotQueryData?.slots || [];
  const disabledDates = slotQueryData?.disabledDates || [];
  const firstAvailableDate = slotQueryData?.firstAvailableDate || null;

  if (
    disabledDates.some(
      (disabledDate) =>
        dayjs(disabledDate).format("YYYY-MM-DD") ===
        dayjs(selectedDate).format("YYYY-MM-DD")
    )
  ) {
    if (firstAvailableDate) {
      setSelectedDate(firstAvailableDate);
    } else {
      setSelectedDate("");
    }
  }

  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

  const slotsForSelectedDate =
    monthlySlots && (monthlySlots as MonthlySlots)[formattedDate]
      ? (monthlySlots as MonthlySlots)[formattedDate]
      : [];

  const slots = slotsForSelectedDate.map((slot) => ({
    ...slot,
    displayTime: dayjs(slot.time).tz(timezone).format("HH:mm"), // This is the formatted time
  }));

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(dayjs(date).tz(timezone).toISOString());
    }
  };

  return (
    <div className="flex flex-col justify-between md:flex-row gap-4 w-full h-full ">
      <div className="flex flex-col rounded-md border p-2 md:w-2/3">
        <h1 className="font-medium text-secondary-foreground text-sm">
          Pick a date
        </h1>
        <div className="flex items-center justify-center h-[360px] md:h-[400px]">
          {isLoading ? (
            <div className="w-full flex flex-col gap-4">
              {/* <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div> */}
              <Skeleton className="h-6 w-full " />
              <Skeleton className="h-6 w-full " />
              <Skeleton className="h-6 w-full " />
              <Skeleton className="h-6 w-full " />
              <Skeleton className="h-6 w-full " />
              <Skeleton className="h-6 w-full " />
              <Skeleton className="h-6 w-full " />
              <Skeleton className="h-6 w-full " />
              <Skeleton className="h-6 w-full " />
            </div>
          ) : (
            <SlotCalendar
              month={dayjs(selectedDate).toDate()}
              mode="single"
              selected={dayjs(selectedDate).toDate()}
              onSelect={handleDateSelect}
              fromDate={dayjs().toDate()}
              className="h-full"
              onMonthChange={handleMonthChange}
              disabled={disabledDates}
              showOutsideDays={false}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full md:w-1/3 rounded-md border p-2">
        <h1 className="font-medium text-secondary-foreground text-sm">
          Available Slots
        </h1>
        <ScrollArea className="h-[400px]">
          <div className="flex flex-col gap-2 w-full h-full">
            {isLoading ? (
              <div className="w-full flex flex-col gap-4">
                {/* <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div> */}
                <Skeleton className="h-6 w-full " />
                <Skeleton className="h-6 w-full " />
                <Skeleton className="h-6 w-full " />
                <Skeleton className="h-6 w-full " />
                <Skeleton className="h-6 w-full " />
                <Skeleton className="h-6 w-full " />
                <Skeleton className="h-6 w-full " />
                <Skeleton className="h-6 w-full " />
                <Skeleton className="h-6 w-full " />
              </div>
            ) : !slots || slots.length === 0 ? (
              <div className="flex items-center justify-center">
                <div className="text-l font-medium">No slots available</div>
              </div>
            ) : (
              slots.map(
                (slot: { time: string; displayTime: string }, index) => (
                  <Button
                    key={index}
                    className="text-left"
                    variant={selectedSlot === slot.time ? "default" : "outline"}
                    onClick={() => onSlotSelect(slot.time)}
                    type="button"
                  >
                    {slot.displayTime}
                  </Button>
                )
              )
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default SelectSlot;
