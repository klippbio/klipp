"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
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

function Page() {
  const storeId =
    useSearchParams().get("storeId") || "7a61221a-1578-4cd4-a890-d594c92cc33c";

  const { data, isLoading } = useQuery({
    queryKey: ["calendarSettings", storeId],
    queryFn: async () =>
      await axios
        .get(`/api/calendar/settings?storeId=${storeId}`)
        .then((res) => res.data.calendarSetting),
  });

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
                    timeZone={data?.timeZone}
                    minimumBookingNotice={data?.minimumBookingNotice}
                    storeId={storeId}
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
                    googleCalendar={data.googleCalendar}
                    storeId={storeId}
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
