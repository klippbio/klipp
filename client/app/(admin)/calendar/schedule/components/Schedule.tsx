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
import { useCallback, useEffect } from "react";
export type ScheduleAvailabilityType = {
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

export type allSchedulesResponse = {
  schedules: {
    name: string;
    id: number;
  }[];
  defaultSchedule: {
    name: string;
    id: number;
  };
};

export default function Schedule() {
  const authDetails = useAuthDetails();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentScheduleId = searchParams.get("scheduleId");
  const updateUrlSchedule = useCallback(
    (id: number) => {
      router.push("?scheduleId=" + id);
    },
    [router]
  );
  const { data: response, isLoading } = useQuery<allSchedulesResponse>(
    ["allSchedules", authDetails?.storeId],
    async () =>
      await AxiosApi(
        "GET",
        `/api/calendar/getAll/?storeId=${authDetails?.storeId}`
      ).then((res) => res.data),
    {
      enabled: !!authDetails?.storeId,
    }
  );
  const allSchedules = response?.schedules;
  const defaultSchedule = response?.defaultSchedule;
  useEffect(() => {
    if (defaultSchedule && !currentScheduleId) {
      updateUrlSchedule(defaultSchedule.id);
    }
  }, [defaultSchedule, currentScheduleId, updateUrlSchedule]);

  return (
    <div className="flex flex-col w-full md:w-5/6">
      {isLoading ? (
        <div className="flex justify-center items-center h-full w-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div>
          {!defaultSchedule ? (
            <div className="flex flex-row justify-between items-center">
              <div>
                <AddScheduleModal authDetails={authDetails} />
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col space-y-4">
              <div className="flex">
                <div className="hidden lg:flex">
                  <div className="flex space-x-2">
                    {allSchedules &&
                      allSchedules.map((schedule) => {
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
                    key={currentScheduleId}
                    defaultValue={
                      currentScheduleId
                        ? `${currentScheduleId}-${
                            allSchedules &&
                            allSchedules.find(
                              (schedule) =>
                                schedule.id === Number(currentScheduleId)
                            )?.name
                          }`
                        : ""
                    }
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
                        {allSchedules &&
                          allSchedules.map((schedule) => (
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
      )}
    </div>
  );
}
