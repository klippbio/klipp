"use client";
import { useAuthDetails } from "@/app/components/AuthContext";
import AxiosApi from "@/app/services/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React from "react";
import dayjs from "../../../../utils/dayjs.index";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import BookingSkeleton from "../BookingSkeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash } from "lucide-react";
import { formatDateSuccessPage } from "@/app/(client)/sale/[id]/page";
import { BookingApiResponse, ErrorResponse } from "@/types/apiResponse";

function Page() {
  const authDetails = useAuthDetails();
  const router = useRouter();
  const timezone = dayjs.tz.guess();
  const {
    data: upcomingBookings,
    isLoading: upcomingBookingsLoading,
    error,
  } = useQuery<Array<BookingApiResponse>, AxiosError>(
    ["bookings", "upcoming", authDetails.storeId],
    async () => {
      const response = await AxiosApi(
        "GET",
        `/api/bookings/upcoming?storeId=${authDetails.storeId}`,
        {},
        authDetails
      );
      return response.data;
    },
    {
      enabled: !!authDetails.storeId,
    }
  );

  const cancelMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await AxiosApi("POST", `/api/sale/cancel?id=${id}`);
      return response.data;
    },
    onSuccess: async () => {
      toast({
        title: "Cancel successful",
        duration: 2000,
      });
      router.refresh();
    },
    onError: async (data: AxiosError<ErrorResponse>) => {
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: data.response?.data?.error,
      });
    },
  });

  if (error?.response?.status === 500) {
    throw Error("Internal Server Error");
  }

  return (
    <div>
      {upcomingBookingsLoading ? (
        <BookingSkeleton />
      ) : upcomingBookings && upcomingBookings.length > 0 ? (
        <div className="flex flex-col space-y-2">
          {upcomingBookings &&
            upcomingBookings.map((booking) => {
              return (
                <Card
                  key={booking.id}
                  className="p-4 flex md:flex-row flex-col justify-between space-y-4 md:space-y-0"
                >
                  <div className="flex space-x-2 md:flex-col md:space-y-2 justify-between md:justify-start text-sm md:text-base md:space-x-0">
                    <div>
                      <p className="text-foreground">
                        <span className="font-semibold">
                          {dayjs(booking.startTime)
                            .tz(timezone)
                            .format(" ddd, DD MMM")}{" "}
                        </span>
                        {dayjs(booking.startTime).tz(timezone).format("HH:mm")}{" "}
                        - {dayjs(booking.endTime).tz(timezone).format("HH:mm")}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {booking.title} -{" "}
                      <span className="text-sm font-medium">
                        {booking.sale.buyerEmail}
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-col  space-y-2">
                    <Button
                      onClick={() => {
                        router.push(booking.meetingUrl);
                      }}
                      variant="outline"
                      className="text-foreground"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="20"
                        height="20"
                        viewBox="0 0 48 48"
                        className="mr-2"
                      >
                        <rect
                          width="16"
                          height="16"
                          x="12"
                          y="16"
                          fill="#fff"
                          transform="rotate(-90 20 24)"
                        ></rect>
                        <polygon
                          fill="#1e88e5"
                          points="3,17 3,31 8,32 13,31 13,17 8,16"
                        ></polygon>
                        <path
                          fill="#4caf50"
                          d="M37,24v14c0,1.657-1.343,3-3,3H13l-1-5l1-5h14v-7l5-1L37,24z"
                        ></path>
                        <path
                          fill="#fbc02d"
                          d="M37,10v14H27v-7H13l-1-5l1-5h21C35.657,7,37,8.343,37,10z"
                        ></path>
                        <path
                          fill="#1565c0"
                          d="M13,31v10H6c-1.657,0-3-1.343-3-3v-7H13z"
                        ></path>
                        <polygon
                          fill="#e53935"
                          points="13,7 13,17 3,17"
                        ></polygon>
                        <polygon
                          fill="#2e7d32"
                          points="38,24 37,32.45 27,24 37,15.55"
                        ></polygon>
                        <path
                          fill="#4caf50"
                          d="M46,10.11v27.78c0,0.84-0.98,1.31-1.63,0.78L37,32.45v-16.9l7.37-6.22C45.02,8.8,46,9.27,46,10.11z"
                        ></path>
                      </svg>{" "}
                      Join Google Meet
                      <ExternalLink size={16} className="ml-2" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash size={16} className="mr-2" /> Cancel
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Your booking for{" "}
                            {booking?.startTime &&
                              formatDateSuccessPage(booking?.startTime)}{" "}
                            will be cancelled.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              cancelMutation.mutate(booking.sale.id)
                            }
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Card>
              );
            })}
        </div>
      ) : (
        <div className="flex justify-center">
          <Card className="flex m-4 md:w-1/3 w-full h-36 justify-center bg-secondary">
            <div className="flex flex-col justify-center items-center">
              <div className="text-l font-semibold text-foreground  ">
                No Upcoming Bookings
              </div>
              <div className="mt-2 text-sm">
                Upcoming bookings will show here
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Page;
