"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventSettingsForm } from "./EventSettingsForm";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import GoogleCalendarSettings from "./GoogleCalendarSettings";
import { useAuthDetails } from "@/app/components/AuthContext";
import AxiosApi from "@/app/services/axios";

function Page() {
  let calendarSettings;
  const authDetails = useAuthDetails();
  const storeId = authDetails?.storeId;
  const { data, isLoading } = useQuery(
    ["calendarSettings", storeId],
    async () =>
      await AxiosApi("GET", `/api/calendar/settings/?storeId=${storeId}`).then(
        (res) => res.data
      ),
    {
      enabled: !!storeId,
    }
  );

  if (data) {
    calendarSettings = data.calendarSetting;
  }

  return (
    <div>
      <Tabs defaultValue="settings" className="w-full p-4">
        <TabsList className="justify-between">
          <TabsTrigger value="products" className="text-sm">
            Products
          </TabsTrigger>
          <TabsTrigger value="schedule" className="text-sm">
            Schedule
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-sm">
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="products"></TabsContent>
        <TabsContent value="schedule"></TabsContent>
        <TabsContent value="settings" className="mt-4">
          {isLoading && !data ? (
            <div>
              <Card className="lg:w-1/2">
                <Skeleton className="h-6 w-40 m-4" />
                <Skeleton className="h-4 w-80 m-4" />
                <Skeleton className="h-4 w-80 m-4" />
                <Skeleton className="h-4 w-80 m-4" />
              </Card>
              <Card className="mt-6 lg:w-1/2">
                <Skeleton className="h-6 w-40 m-4" />
                <Skeleton className="h-4 w-80 m-4" />
                <Skeleton className="h-4 w-80 m-4" />
                <Skeleton className="h-4 w-80 m-4" />
              </Card>
            </div>
          ) : (
            <div>
              <Card className="w-full lg:w-2/3">
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
                    minimumBookingNotice={
                      calendarSettings?.minimumBookingNotice
                    }
                  />
                </CardContent>
              </Card>
              <Card className="w-full mt-6 lg:w-2/3">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Page;
