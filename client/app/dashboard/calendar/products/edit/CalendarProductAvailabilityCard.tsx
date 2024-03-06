import React from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import AxiosApi from "@/app/services/axios";
import { ScheduleAvailabilityType } from "../../schedule/components/Schedule";
import { ExternalLink, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CalendarSkeleton from "../components/CalendarSkeleton";
import { useAuthDetails } from "@/app/components/AuthContext";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function CalendarProductAvailabilityCard({
  scheduleId,
}: {
  scheduleId: string;
}) {
  const router = useRouter();
  const authDetails = useAuthDetails();
  const { data: schedule, isLoading: scheduleCardLoading } =
    useQuery<ScheduleAvailabilityType>(
      ["schedule", scheduleId],
      async () =>
        await AxiosApi(
          "GET",
          `/api/calendar/get?scheduleId=${scheduleId}&storeId=${authDetails?.storeId}`
        ).then((res) => res.data),
      { enabled: !!scheduleId && !!authDetails?.storeId }
    );

  const extractTime = (dateString: string | undefined) => {
    // Extracts the time in HH:MM format from the UTC date string
    if (!dateString) {
      return "";
    }
    return dateString.substring(11, 16);
  };

  return (
    <div>
      {scheduleCardLoading ? (
        <CalendarSkeleton />
      ) : (
        <div>
          <CardContent>
            <div className="overflow-hidden rounded-md">
              {daysOfWeek.map((day, dayIndex) => {
                const availability = schedule?.availability[dayIndex] || [];
                return (
                  <div
                    key={day}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4"
                  >
                    <div className="font-medium ">{day}</div>
                    <div className="flex flex-col space-y-1">
                      {availability.length > 0 ? (
                        availability.map((slot, index) => (
                          <span key={index} className="text-sm text-gray-700">
                            {`${extractTime(slot.start)} - ${extractTime(
                              slot.end
                            )}`}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              {schedule?.timeZone}
            </div>
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  "/dashboard/calendar/schedule?scheduleId=" + scheduleId
                )
              }
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Edit This Schedule
            </Button>
          </CardFooter>
        </div>
      )}
    </div>
  );
}
