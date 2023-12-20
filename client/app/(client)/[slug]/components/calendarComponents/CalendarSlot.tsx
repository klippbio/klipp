import { TimezoneSelect } from "@/components/ui/timezoneSelect";
import dayjs from "@/utils/dayjs.index";
import React, { useState } from "react";
import { MapPinIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import SelectSlot from "./SelectSlot";

function CalendarSlot({ storeItemId }: { storeItemId: number }) {
  // const [selectedDate, setSelectedDate] = useState(new Date());
  // const [slots, setSlots] = useState<Slot[]>([]);
  // const [monthlySlots, setMonthlySlots] = useState<MonthlySlots>({});
  // const [timezone, setTimezone] = useState<string>(dayjs.tz.guess());

  // const { data, isLoading } = useQuery(
  //   [
  //     "calendarProduct",
  //     storeItemId,
  //     selectedDate.getMonth(),
  //     selectedDate.getFullYear(),
  //     timezone,
  //   ],
  //   async () => {
  //     const startDate = dayjs(selectedDate)
  //       .tz(timezone)
  //       .startOf("month")
  //       .toISOString();
  //     const endDate = dayjs(selectedDate)
  //       .tz(timezone)
  //       .endOf("month")
  //       .toISOString();
  //     console.log(startDate, endDate, "startDate, endDate");
  //     const response = await AxiosApi(
  //       "GET",
  //       `/api/slots/get/?storeItemId=${storeItemId}&startTime=${startDate}&endTime=${endDate}&timeZone=${timezone}`
  //     );
  //     console.log(response.data.slots, timezone, "response.data.slots");
  //     setMonthlySlots(response.data.slots);
  //     return response.data.slots;
  //   },
  //   { enabled: !!storeItemId && !!timezone }
  // );

  // // useEffect(() => {
  // //   // Updated to handle object structure of monthlySlots
  // //   const selectedDateString = selectedDate.toISOString().split("T")[0];
  // //   const slotsForSelectedDate = monthlySlots[selectedDateString] || [];
  // //   setSlots(slotsForSelectedDate);
  // // }, [selectedDate, monthlySlots]);

  // useEffect(() => {
  //   if (monthlySlots) {
  //     const currentSlots =
  //       monthlySlots[dayjs(selectedDate).tz(timezone).format("YYYY-MM-DD")];

  //     const formattedSlots =
  //       currentSlots &&
  //       currentSlots.map((slot) => {
  //         // Parse the time with dayjs, convert it to the target timezone, and then format it to HH:mm
  //         const localTime = dayjs(slot.time).tz(timezone).format("HH:mm");
  //         return { ...slot, time: localTime };
  //       });
  //     setSlots(formattedSlots);
  //   }
  // }, [selectedDate, monthlySlots, timezone]);

  // console.log(disabledDates, "disabledDates");
  // console.log(monthlySlots, "monthlySlots");
  // console.log(selectedDate, "selected");

  // useEffect(() => {
  //   if (monthlySlots && Object.keys(monthlySlots).length > 0) {
  //     const firstAvailableDateKey = Object.keys(monthlySlots)[0];
  //     const firstAvailableDate = dayjs(firstAvailableDateKey)
  //       .tz(timezone)
  //       .toDate();
  //     if (!isNaN(firstAvailableDate.getTime())) {
  //       // Check if it's a valid date
  //       setSelectedDate(firstAvailableDate);
  //     }
  //   }
  // }, [monthlySlots, timezone]);

  // const handleTimezoneChange = (selectedTimezone: string) => {
  //   // Handle the timezone change in this function
  //   console.log(selectedTimezone, "selectedTimezone");
  //   setTimezone(selectedTimezone);
  // };
  const [timezone, setTimezone] = useState<string>(dayjs.tz.guess());

  const handleTimezoneChange = (selectedTimezone: string) => {
    setTimezone(selectedTimezone);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col w-full items-center md:flex-row">
        <div className="flex items-center w-full pb-2 md:pb-0 md:w-1/3">
          <MapPinIcon size={20} className="mr-2" />
          <Label className="mr-2">Timezone</Label>
        </div>
        <div className="w-full md:w-2/3">
          <TimezoneSelect
            onTimeZoneChange={handleTimezoneChange}
            selectedTimezone={timezone}
          />
        </div>
      </div>
      <SelectSlot timezone={timezone} storeItemId={storeItemId} />
    </div>
  );
}

export default CalendarSlot;
