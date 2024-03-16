"use client";
import { useAuthDetails } from "@/app/components/AuthContext";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import AxiosApi from "@/app/services/axios";
import AddCalendarProduct from "./AddCalendarProduct";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CalendarProductDropdown from "./CalendarProductDropdown";
import { CalendarProductApiResponse } from "@/types/apiResponse";
import CalendarSkeleton from "./CalendarSkeleton";
import { AxiosError } from "axios";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function CalendarHome() {
  const authDetails = useAuthDetails();
  const storeId = authDetails?.storeId;

  const {
    data: calendarProducts,
    isLoading: calendarProductsLoading,
    error,
  } = useQuery<Array<CalendarProductApiResponse>, AxiosError>(
    ["calendarProducts", storeId],
    async () => {
      const response = await AxiosApi(
        "GET",
        `/api/calendar-products/getAllCalendarProducts?storeId=${storeId}`,
        {},
        authDetails
      );
      return response.data;
    },
    {
      enabled: !!storeId,
    }
  );

  const doesGoogleCalendarExist = calendarProducts?.at(0)?.calendarSetting
    .googleCalendar?.refreshToken
    ? true
    : false;

  const doesScheduleExist = calendarProducts?.at(0)?.scheduleId ? true : false;

  if (error?.response?.status === 500) {
    throw Error("Internal Server Error");
  }

  return (
    <div className="w-full">
      {calendarProductsLoading && !calendarProducts ? (
        <CalendarSkeleton />
      ) : (
        <div className="w-full">
          {!doesGoogleCalendarExist || !doesScheduleExist ? (
            <div className="my-2 mb-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle></AlertTitle>
                <AlertDescription>
                  {!doesGoogleCalendarExist &&
                    "Please connect to Google Calendar in Settings to enable creating products."}
                  <br />
                  <br />
                  {!doesScheduleExist &&
                    "Please connect to Schedule to enable creating products."}
                </AlertDescription>
              </Alert>
            </div>
          ) : null}
          <AddCalendarProduct authDetails={authDetails} />
          {calendarProducts && calendarProducts.length > 0 ? (
            <div className="md:flex md:flex-row gap-x-4 mt-4 flex-wrap">
              {calendarProducts.map((item) => (
                <Card
                  className="md:w-1/3 w-full h-36 mb-4 flex flex-col p-6"
                  key={item.title}
                >
                  <div className="text-xl justify-center font-bold text-bold text-secondary-foreground">
                    <div className="flex flex-row justify-between">
                      <div className="flex space-x-4">
                        <div>{item.title}</div>
                        <Badge variant={"outline"} className="h-6 mt-1">
                          {item.visibility ? "Public" : "Private"}
                        </Badge>
                      </div>
                      <div className="">
                        <CalendarProductDropdown item={item} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto flex flex-row space-x-2 text-sm">
                    <div className="font-semiBold flex items-center">
                      <Clock size={16} className="mr-2" />
                      <div> {item.length} minutes |</div>
                    </div>
                    <div className="font-semiBold">{`USD ${item.price}`}</div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex justify-center">
              <Card className="flex m-4 md:w-1/3 w-full h-36 justify-center bg-secondary">
                <div className="flex flex-col justify-center items-center">
                  <div className="text-l font-semibold text-foreground  ">
                    No Products to Show
                  </div>
                  <div className="mt-2 text-sm">
                    Digital products will appear here.
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CalendarHome;
