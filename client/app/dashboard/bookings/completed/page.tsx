"use client";
import { useAuthDetails } from "@/app/components/AuthContext";
import AxiosApi from "@/app/services/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React from "react";
import dayjs from "../../../../utils/dayjs.index";
import { Card } from "@/components/ui/card";
import BookingSkeleton from "../BookingSkeleton";
import { Badge } from "@/components/ui/badge";
import { BookingApiResponse } from "@/types/apiResponse";

function Page() {
  const authDetails = useAuthDetails();
  const timezone = dayjs.tz.guess();
  const {
    data: upcomingBookings,
    isLoading: upcomingBookingsLoading,
    error,
  } = useQuery<Array<BookingApiResponse>, AxiosError>(
    ["bookings", "past", authDetails.storeId],
    async () => {
      const response = await AxiosApi(
        "GET",
        `/api/bookings/past?storeId=${authDetails.storeId}`,
        {},
        authDetails
      );
      return response.data;
    },
    {
      enabled: !!authDetails.storeId,
    }
  );

  if (error?.response?.status === 500) {
    throw Error("Internal Server Error");
  }

  return (
    <div>
      {upcomingBookingsLoading ? (
        <BookingSkeleton />
      ) : upcomingBookings && upcomingBookings.length > 0 ? (
        <div className="flex flex-col space-y-2">
          {upcomingBookings.map((booking) => {
            return (
              <Card
                key={booking.id}
                className="p-4 flex  md:justify-between space-y-4 md:space-y-0"
              >
                <div className="flex flex-col space-y-2  justify-start text-sm md:text-base space-x-0 w-full">
                  <div className="flex space-x-2 justify-between">
                    <p className="text-foreground">
                      <span className="font-semibold">
                        {dayjs(booking.startTime)
                          .tz(timezone)
                          .format(" ddd, DD MMM")}{" "}
                      </span>
                      {dayjs(booking.startTime).tz(timezone).format("HH:mm")} -{" "}
                      {dayjs(booking.endTime).tz(timezone).format("HH:mm")}
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    {booking.title} -{" "}
                    <span className="text-sm font-medium">
                      {booking.sale?.buyerEmail}
                    </span>
                  </span>
                </div>
                <Badge
                  className="h-6 w-20 ml-auto"
                  variant={
                    booking.bookingStatus === "CANCELLED"
                      ? "destructive"
                      : "default"
                  }
                >
                  {booking.bookingStatus === "CANCELLED"
                    ? "Cancelled"
                    : "Completed"}
                </Badge>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center">
          <Card className="flex m-4 md:w-1/3 w-full h-36 justify-center bg-secondary">
            <div className="flex flex-col justify-center items-center">
              <div className="text-l font-semibold text-foreground  ">
                No Completed Bookings
              </div>
              <div className="mt-2 text-sm">
                Completed bookings will show here
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Page;
