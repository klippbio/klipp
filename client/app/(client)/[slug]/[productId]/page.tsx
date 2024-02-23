//TODO: Dynamic Colors
//Auth
//Skeletons
//img invisible on smaller screens
"use client";
import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { ArrowLeft, CalendarClock, FileDown } from "lucide-react";
import CalendarContent from "../components/calendarComponents/calendarContent";
import AxiosApi from "@/app/services/axios";
import ProductNotFound from "../components/ProductNotFound";
import { CalendarDetails, DigitalProductDetails, storeItem } from "../..";
import { useToast } from "@/components/ui/use-toast";
import dayjs from "../../../../utils/dayjs.index";
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
import DigitalDownloadContent from "../components/digitalDownloadContent";
import { ErrorResponse } from "@/types/apiResponse";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthDetails } from "@/app/components/AuthContext";

interface CalendarSaleFormData {
  name: string;
  email: string;
  slot: string;
  timezone: string;
}

interface DigitalProductSaleFormData {
  name: string;
  email: string;
  // flexPrice: string;
}

export type SaleFormData = CalendarSaleFormData | DigitalProductSaleFormData;

function ProductPage() {
  const usernameSegments = usePathname().split("/");
  const username = usernameSegments[1];
  const { toast } = useToast();
  const id = usePathname().split("/").pop();
  const searchParams = useSearchParams();
  const reschedule = searchParams.get("reschedule");
  const date = searchParams.get("date");
  const saleId = searchParams.get("saleId");
  const router = useRouter();
  const [saleFormData, setSaleFormData] = useState<SaleFormData>();
  const authDetails = useAuthDetails();
  const storeId = authDetails?.storeId;

  const handleSaleFormDataChange = (saleFormData: SaleFormData) => {
    setSaleFormData(saleFormData);
  };

  const { data, isLoading, error } = useQuery<storeItem, AxiosError>(
    ["productId", id],
    async () => {
      const response = await AxiosApi(
        "GET",
        `/api/product/?id=${id}&username=${username}`
      );
      return response.data;
    }
  );

  const createNewSaleMutation = useMutation({
    mutationFn: async () => {
      const combinedData = {
        saleFormData: saleFormData,
        storeUrl: username,
        itemType: data?.itemType,
        itemId: data?.id,
        saleId: saleId,
        reschedule: reschedule,
        storeId: storeId,
        currency: data?.itemDetails.currency[0],
        price: data?.itemDetails.price,
        productName: data?.itemDetails.name,
        thumbnailUrl: data?.itemDetails.thumbnailUrl,
      };
      let response;
      if (reschedule === "true" && saleId) {
        response = await AxiosApi("POST", `/api/sale/reschedule`, combinedData);
      } else {
        response = await AxiosApi("POST", "/api/sale/create", combinedData);
      }
      return response.data;
    },
    onSuccess: async (data) => {
      //redirect to the stripe checkout page if it is a paid product otherwise redirect to the success page
      toast({
        title: "Booking successful",
        duration: 2000,
        description:
          "Booked session for " + dayjs(data.startTime).format("MMMM D HH:mm"),
      });
      router.push("/" + username);
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

  const handleBuyNowClick = () => {
    // Validation for Calendar type
    if (
      data?.itemType === "CALENDAR" &&
      saleFormData &&
      "slot" in saleFormData
    ) {
      if (!saleFormData?.name || !saleFormData?.email || !saleFormData?.slot) {
        toast({
          title: "Missing Information",
          description: "Please provide name, email, and select a slot.",
          variant: "destructive",
          duration: 2000,
        });
        return;
      }
    }

    // Validation for Digital Product type
    if (data?.itemType === "DIGITALPRODUCT") {
      if (!saleFormData?.name || !saleFormData?.email) {
        toast({
          title: "Missing Information",
          description: "Please provide name and email.",
          variant: "destructive",
          duration: 2000,
        });
        return;
      }
    }

    // If all validations pass, proceed with the mutation
    createNewSaleMutation.mutate();
  };

  if (error?.response?.status === 404) {
    return <ProductNotFound />;
  }
  if (error?.response?.status === 500) {
    throw Error("Internal Server Error");
  }

  return (
    <div className="md:flex md:justify-center md:mt-8 md:mx-8 ">
      {isLoading ? (
        <div>
          <Card className="flex flex-col gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </Card>
        </div>
      ) : null}
      {data && (
        <Card className="border-hidden md:border-solid md:w-9/12">
          <div className="bg-secondary p-3 rounded-t-xl">
            <Button variant={"ghost"} onClick={() => router.back()}>
              <ArrowLeft />
              Back
            </Button>
          </div>
          <CardHeader className="bg-secondary">
            <div className="w-full rounded-md flex flex-row justify-between">
              <div className="flex flex-col w-2/3 pr-4">
                <div className="font-bold text-2xl text-foreground">
                  {data.itemDetails.name}
                </div>
                <div className="text-l">
                  {data.itemDetails.shortDescription}
                </div>
              </div>
              <div className="">
                <div>
                  {data.itemDetails.thumbnailUrl ? (
                    <Image
                      alt="a"
                      className="rounded-xl"
                      src={data.itemDetails.thumbnailUrl}
                      width="150"
                      height="150"
                    />
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <div className="w-full flex gap-4 pl-6 p-3 pb-6 bg-secondary border-b">
            <div>
              {data.itemType === "DIGITALPRODUCT" ? (
                <div className="flex gap-4">
                  <FileDown />
                  <div>Digital Product</div>
                </div>
              ) : data.itemType === "CALENDAR" ? (
                <div className="flex gap-4">
                  <CalendarClock />
                  <div>
                    Book a {(data.itemDetails as CalendarDetails).length} minute
                    meeting
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <CardContent className="pt-3 pb-36 md:pb-12 p-3">
            {data && data.itemType === "DIGITALPRODUCT" ? (
              <DigitalDownloadContent
                itemDetails={data.itemDetails as DigitalProductDetails}
                handleSaleFormDataChange={handleSaleFormDataChange}
              />
            ) : data && data.itemType === "CALENDAR" ? (
              <CalendarContent
                itemDetails={data.itemDetails as CalendarDetails}
                handleSaleFormDataChange={handleSaleFormDataChange}
              />
            ) : (
              ""
            )}
          </CardContent>
          <CardFooter className="fixed bg-secondary rounded-b-xl z-10 p-0 px-6 h-20 md:sticky bottom-0 w-full justify-between items-center">
            <div className="flex flex-row w-full justify-between">
              <div className="font-semibold text-xl flex gap-4">
                <div> {data.itemDetails.currency} </div>
                <div>{data.itemDetails.price}</div>
              </div>
              {data && data.itemType === "CALENDAR" ? (
                <div>
                  {saleFormData &&
                  reschedule === "true" &&
                  (saleFormData as CalendarSaleFormData).slot ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button>
                          {saleFormData &&
                          data.itemType === "CALENDAR" &&
                          (saleFormData as CalendarSaleFormData).slot
                            ? `Reschedule to ${dayjs(
                                (saleFormData as CalendarSaleFormData).slot
                              )
                                .tz(
                                  (saleFormData as CalendarSaleFormData)
                                    .timezone
                                )
                                .format("MMMM DD HH:mm")}`
                            : "Buy Now"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Your booking will be
                            rescheduled from{" "}
                            {dayjs(date)
                              .tz(
                                (saleFormData as CalendarSaleFormData).timezone
                              )
                              .format("MMMM DD HH:mm")}{" "}
                            to{" "}
                            {dayjs((saleFormData as CalendarSaleFormData).slot)
                              .tz(
                                (saleFormData as CalendarSaleFormData).timezone
                              )
                              .format("MMMM DD HH:mm")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleBuyNowClick()}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Button
                      className="bg-primary  text-primary-foreground"
                      onClick={() => handleBuyNowClick()}
                    >
                      {saleFormData &&
                      data.itemType === "CALENDAR" &&
                      (saleFormData as CalendarSaleFormData).slot
                        ? `Book ${dayjs(
                            (saleFormData as CalendarSaleFormData).slot
                          )
                            .tz((saleFormData as CalendarSaleFormData).timezone)
                            .format("MMMM DD HH:mm")}`
                        : "Buy Now"}
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  <Button
                    className="bg-primary  text-primary-foreground"
                    onClick={() => handleBuyNowClick()}
                  >
                    Buy Now
                  </Button>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default ProductPage;
