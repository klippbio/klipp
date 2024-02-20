import React from "react";
import { sale } from "../..";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import AxiosApi from "@/app/services/axios";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
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
import { ErrorResponse } from "@/types/apiResponse";
import { formatDateSuccessPage } from "@/utils/formatDate";

export default function CalendarSaleContent({ data }: { data: sale }) {
  const id = usePathname().split("/")[2];
  const router = useRouter();

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await AxiosApi("POST", `/api/sale/cancel?id=${id}`);
      return response.data;
    },
    onSuccess: async () => {
      //redirect to the stripe checkout page if it is a paid product otherwise redirect to the success page
      toast({
        title: "Cancel successful",
        duration: 2000,
      });
      router.refresh();
    },
    onError: async (data: AxiosError<ErrorResponse>) => {
      console.log(data, "error");
      toast({
        title: "Error",
        variant: "destructive",
        duration: 2000,
        description: data.response?.data?.error,
      });
    },
  });

  return (
    <div>
      <div
        className={
          data.booking?.bookingStatus === "CANCELLED"
            ? "hidden"
            : "text-center text-lg"
        }
      >
        Your session was booked!
      </div>
      <div className="grid gap-4 mt-4">
        <div className="grid grid-cols-2">
          <span>What</span>
          <span>{data.booking?.title}</span>
        </div>
        <div className="grid grid-cols-2">
          <span>When</span>
          <span
            className={
              data.booking?.bookingStatus === "CANCELLED" ? "line-through" : ""
            }
          >
            {data.booking?.startTime &&
              formatDateSuccessPage(data.booking.startTime)}{" "}
            -
            {data.booking?.endTime &&
              formatDateSuccessPage(data.booking.endTime)}
          </span>
        </div>
        <div className="grid grid-cols-2">
          <span>Who</span>
          <span>
            {data.store?.storeTitle}(Host)
            <br />
            {data.store?.user?.email}
            <br />
            {data.buyerName}
            <br />
            {data.buyerEmail}
          </span>
        </div>
        <div className="grid grid-cols-2">
          <span>Where</span>
          <span>
            <a
              href={data.booking?.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Meet: {data.booking?.meetingUrl}
            </a>
          </span>
        </div>
        <div className="grid grid-cols-2">
          <span>Additional notes</span>
          <span>{data.additionalInfo || "None"}</span>
        </div>
        <Separator orientation="horizontal" />
        <div
          className={
            data.booking?.bookingStatus === "CANCELLED"
              ? "hidden"
              : "text-center"
          }
        >
          Need to make a change?
          <Link
            href={`/${data.store?.storeUrl}/${data.storeItemId}?reschedule=true&date=${data.booking?.startTime}&saleId=${data.id}`}
            className="underline ml-2"
          >
            Reschedule
          </Link>
          <span className="ml-2">|</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <span className="underline ml-2 cursor-pointer">Cancel</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Your booking for{" "}
                  {data.booking?.startTime &&
                    formatDateSuccessPage(data.booking?.startTime)}{" "}
                  will be cancelled.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => cancelMutation.mutate()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
