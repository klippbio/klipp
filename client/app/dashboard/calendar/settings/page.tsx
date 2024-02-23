"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventSettingsForm } from "./components/EventSettingsForm";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import GoogleCalendarSettings from "./components/GoogleCalendarSettings";
import { useAuthDetails } from "@/app/components/AuthContext";
import AxiosApi from "@/app/services/axios";
import { AxiosError, AxiosResponse } from "axios";

function Page() {
  let calendarSettings;
  const authDetails = useAuthDetails();
  const storeId = authDetails?.storeId;
  const { data, isLoading, error } = useQuery<AxiosResponse, AxiosError>(
    ["calendarSettings", storeId],
    async () =>
      await AxiosApi("GET", `/api/calendar/settings/?storeId=${storeId}`).then(
        (res) => res
      ),
    {
      enabled: !!storeId,
    }
  );

  if (data) {
    calendarSettings = data.data.calendarSetting;
  }

  if (error?.response?.status === 500) {
    throw Error("Internal Server Error");
  }

  return (
    <div>
      {isLoading && !data ? (
        <div>
          <Card className="md:w-1/2 mb-4">
            <Skeleton className="h-6 w-1/2 m-4" />
            <Skeleton className="h-4 w-10/12 m-4" />
            <Skeleton className="h-4 w-10/12 m-4" />
            <Skeleton className="h-4 w-10/12 m-4" />
          </Card>
          <Card className="md:w-1/2">
            <Skeleton className="h-6 w-1/2 m-4" />
            <Skeleton className="h-4 w-10/12 m-4" />
            <Skeleton className="h-4 w-10/12 m-4" />
            <Skeleton className="h-4 w-10/12 m-4" />
          </Card>
        </div>
      ) : (
        <div>
          <Card className="w-full md:w-2/3">
            <CardHeader>
              <CardTitle className="text-foreground text-lg">
                Event Settings
              </CardTitle>
              <CardDescription>
                Changes here will affect all the Calendar Products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventSettingsForm
                timeZone={calendarSettings?.timeZone}
                minimumBookingNotice={calendarSettings?.minimumBookingNotice}
              />
            </CardContent>
          </Card>
          <Card className="w-full mt-6 md:w-2/3">
            <CardHeader>
              <CardTitle className="text-foreground text-lg">
                Calendar Settings
              </CardTitle>
              <CardDescription>
                This account will be used for google meet links and calendar
                events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GoogleCalendarSettings
                googleCalendar={
                  calendarSettings && calendarSettings.googleCalendar
                }
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Page;
