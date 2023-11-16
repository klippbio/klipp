"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuthDetails } from "@/app/components/AuthContext";
import AxiosApi from "@/app/services/axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import ScheduleForm from "./ScheduleForm";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddScheduleModal from "./AddScheduleModal";
import { useEffect } from "react";
export type MockSchedule = {
  id: number;
  name: string;
  workingHours: {
    days: number[];
    startTime: number;
    endTime: number;
  }[];
  schedule: {
    id: number;
    calendarProductId: null | number;
    days: number[];
    startTime: string;
    endTime: string;
    date: null | string;
    scheduleId: number;
  }[];
  availability: {
    start: string | undefined;
    end: string | undefined;
  }[][];
  timeZone: string;
  isDefault: boolean;
  dateOverrides: Array<{
    ranges: Array<{
      start: string;
      end: string;
    }>;
  }>;
};

export default function Schedule() {
  // const mockSchedules: MockSchedule[] = [
  //   {
  //     id: 5,
  //     name: "test2",
  //     workingHours: [
  //       {
  //         days: [1, 2, 3, 4, 5],
  //         startTime: 540,
  //         endTime: 1020,
  //       },
  //     ],
  //     schedule: [
  //       {
  //         id: 23,
  //         calendarProductId: null,
  //         days: [1, 2, 3, 4, 5],
  //         startTime: "1970-01-01T09:00:00.000Z",
  //         endTime: "1970-01-01T17:00:00.000Z",
  //         date: null,
  //         scheduleId: 5,
  //       },
  //     ],
  //     availability: [
  //       [],
  //       [
  //         // {
  //         //   start: "2023-11-11T09:00:00.000Z",
  //         //   end: "2023-11-11T17:00:00.000Z",
  //         // },
  //       ],
  //       [
  //         {
  //           start: "2023-11-11T09:00:00.000Z",
  //           end: "2023-11-11T17:00:00.000Z",
  //         },
  //         {
  //           start: "2023-11-11T17:15:00.000Z",
  //           end: "2023-11-11T18:00:00.000Z",
  //         },
  //         // {
  //         //   start: "2023-11-11T18:15:00.000Z",
  //         //   end: "2023-11-11T19:00:00.000Z",
  //         // },
  //       ],
  //       [
  //         // {
  //         //   start: "2023-11-11T09:00:00.000Z",
  //         //   end: "2023-11-11T17:00:00.000Z",
  //         // },
  //       ],
  //       [
  //         // {
  //         //   start: "2023-11-11T09:00:00.000Z",
  //         //   end: "2023-11-11T17:00:00.000Z",
  //         // },
  //       ],
  //       [
  //         // {
  //         //   start: "2023-11-11T17:00:00.000Z",
  //         //   end: "2023-11-11T18:15:00.000Z",
  //         // },
  //         // {
  //         //   start: "2023-11-11T18:45:00.000Z",
  //         //   end: "2023-11-11T22:15:00.000Z",
  //         // },
  //       ],
  //       [],
  //     ],
  //     timeZone: "America/Toronto",
  //     isDefault: false,
  //   },
  // ];

  const authDetails = useAuthDetails();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentScheduleId = searchParams.get("scheduleId");
  const updateUrlSchedule = (id: number) => {
    console.log("this is the id", id);
    router.push("?scheduleId=" + id);
  };
  const { data: response, isLoading } = useQuery(
    ["allScehdules", authDetails?.storeId],
    async () =>
      await AxiosApi(
        "GET",
        `/api/calendar/getAll/?storeId=${authDetails?.storeId}`
      ).then((res) => res.data),
    {
      enabled: !!authDetails?.storeId,
    }
  );
  const allScehdules = response?.schedules;
  const defaultSchedule = response?.defaultSchedule;
  useEffect(() => {
    if (defaultSchedule) {
      updateUrlSchedule(defaultSchedule.id);
    }
  }, [defaultSchedule]);

  return (
    <div className="flex flex-col w-full md:w-5/6">
      {isLoading || !allScehdules || !currentScheduleId ? (
        <div className="flex justify-center items-center h-full w-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="flex w-full flex-col space-y-4">
          <div className="flex">
            <div className="hidden lg:flex">
              <div className="flex space-x-2">
                {allScehdules &&
                  allScehdules.map((schedule) => {
                    return (
                      <Button
                        value={schedule.name}
                        key={schedule.id}
                        variant="ghost"
                        className={
                          schedule.id === Number(currentScheduleId)
                            ? "text-overlay-foreground bg-overlay"
                            : ""
                        }
                        onClick={() => updateUrlSchedule(schedule.id)}
                      >
                        {schedule.name}
                      </Button>
                    );
                  })}
              </div>
            </div>
            <div className="lg:hidden">
              <Select
                defaultValue={`${defaultSchedule.id}-${defaultSchedule.name}`}
                onValueChange={(value) => {
                  const [id] = value.split("-"); // Extract the ID
                  updateUrlSchedule(Number(id)); // Update the URL with the extracted ID
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {allScehdules &&
                      allScehdules.map((schedule) => (
                        // Use the combination of ID and name as the value, but only display the name
                        <SelectItem
                          value={`${schedule.id}-${schedule.name}`}
                          key={schedule.id}
                        >
                          {schedule.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="ml-auto">
              <AddScheduleModal authDetails={authDetails} />
            </div>
          </div>
          <div>
            <ScheduleForm authDetails={authDetails} />
          </div>
        </div>
      )}
    </div>
  );
}
