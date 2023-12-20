import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import AxiosApi from "@/app/services/axios";
import { SlotCalendar } from "@/components/ui/slotCalendar";

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
  firstAvailableDate: Date | null; // Array of available dates
};

function getDisabledAndAvailableDates(
  slotsData: MonthlySlots,
  currentDate: Date | null
) {
  if (!currentDate) {
    return { disabledDates: [], firstAvailableDate: null };
  }
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0); // Last day of the month

  const disabledDates = [];
  let firstAvailableDate: Date | null = null;

  for (
    let day = startOfMonth;
    day <= endOfMonth;
    day.setDate(day.getDate() + 1)
  ) {
    const dayStr = day.toISOString().split("T")[0];
    if (!slotsData[dayStr]) {
      disabledDates.push(new Date(day)); // Add a copy of the date to the array
    } else if (!firstAvailableDate) {
      firstAvailableDate = new Date(day); // Set the first available date
    }
  }

  return { disabledDates, firstAvailableDate };
}

function SelectSlot({
  timezone,
  storeItemId,
}: {
  timezone: string;
  storeItemId: number;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const handleMonthChange = (monthDate: Date) => {
    console.log(monthDate, "monthDate");
    setSelectedDate(monthDate);
  };
  const { data: slotQueryData, isLoading } = useQuery<SlotQueryResult>(
    [
      "calendarProduct",
      storeItemId,
      dayjs(selectedDate).format("YYYY-MM"),
      timezone,
    ],
    async () => {
      const startDate = dayjs(selectedDate)
        .tz(timezone)
        .startOf("month")
        .toISOString();
      const endDate = dayjs(selectedDate)
        .tz(timezone)
        .endOf("month")
        .toISOString();

      const response = await AxiosApi(
        "GET",
        `/api/slots/get/?storeItemId=${storeItemId}&startTime=${startDate}&endTime=${endDate}&timeZone=${timezone}`
      );
      const slotsData = response.data.slots;

      const monthAvailability = getDisabledAndAvailableDates(
        slotsData,
        selectedDate
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
        console.log("selectedDate is disabled");
        // Update selectedDate to the first available date
        const availableDates = Object.keys(slotsData).filter(
          (date) => !disabledDates.includes(new Date(date))
        );
        if (availableDates.length > 0) {
          setSelectedDate(new Date(availableDates[0]));
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
      setSelectedDate(null);
    }
  }

  const formattedDate = dayjs(selectedDate).tz(timezone).format("YYYY-MM-DD");
  const slotsForSelectedDate =
    monthlySlots && (monthlySlots as MonthlySlots)[formattedDate]
      ? (monthlySlots as MonthlySlots)[formattedDate]
      : [];

  const slots = slotsForSelectedDate.map((slot) => ({
    ...slot,
    time: dayjs(slot.time).tz(timezone).format("HH:mm"),
  }));

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  console.log("sele2", selectedDate);

  return (
    <div className="flex flex-col justify-between md:flex-row gap-4  w-full h-full ">
      <div className="flex flex-col rounded-md border p-2">
        <h1 className="text-l font-medium">Pick a date</h1>
        <div className="flex items-center justify-center">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          ) : !selectedDate ? (
            <div className="flex items-center justify-center">
              <div className="text-l font-medium">No slots available</div>
            </div>
          ) : (
            <SlotCalendar
              month={selectedDate}
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="h-full"
              onMonthChange={handleMonthChange}
              disabled={disabledDates}
              showOutsideDays={false}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full md:w-1/2 rounded-md border p-2">
        <h1 className="text-l font-medium">Available Slots</h1>
        <ScrollArea className="h-[450px]">
          <div className="flex flex-col gap-2 w-full">
            {!isLoading &&
              slots &&
              slots.map((slot: { time: string }, index) => (
                <Button key={index} className="text-left" variant="outline">
                  {slot.time}
                </Button>
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default SelectSlot;
