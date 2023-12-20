//TODO: Dynamic Colors
//Auth
//Skeletons
//img invisible on smaller screens
"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { ArrowLeft, CalendarClock, FileDown } from "lucide-react";
import DigitalDownloadContent from "../components/digitalDownloadContent";
import CalendarContent from "../components/calendarComponents/calendarContent";
import { useAuthDetails } from "@/app/components/AuthContext";
import AxiosApi from "@/app/services/axios";
import ProductNotFound from "../components/ProductNotFound";
import { CalendarDetails, DigitalProductDetails, storeItem } from "../..";

function PublicDigitalProduct() {
  const username = usePathname().split("/")[1];
  const id = usePathname().split("/").pop();
  const router = useRouter();
  const authDetails = useAuthDetails();

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

  if (error?.response?.status === 404) {
    return <ProductNotFound />;
  }
  if (error?.response?.status === 500) {
    throw Error("Internal Server Error");
  }

  return (
    <div className="md:flex md:justify-center md:mt-8 md:mx-8 ">
      {isLoading ? <div>Loading...</div> : null}
      {data && (
        <Card className="border-hidden md:border-solid md:w-9/12">
          <div className="bg-secondary pt-3 rounded-t-xl">
            <Button
              variant={"ghost"}
              onClick={() => router.push("/" + authDetails?.storeUrl)}
            >
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
          <div className="w-full flex gap-4 pl-6 p-3 bg-secondary border-b">
            <div>
              {data.itemType === "DIGITALPRODUCT" ? (
                <div className="flex gap-4">
                  <FileDown />
                  <div>Digital Product</div>
                </div>
              ) : data.itemType === "CALENDAR" ? (
                <div className="flex gap-4">
                  <CalendarClock />
                  <div>Book a Session</div>
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
              />
            ) : data && data.itemType === "CALENDAR" ? (
              <CalendarContent
                itemDetails={data.itemDetails as CalendarDetails}
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
              <div>
                <Button className="bg-primary w-28 text-primary-foreground">
                  Buy Now
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}
      {/* </Card> */}
    </div>
  );
}

export default PublicDigitalProduct;
