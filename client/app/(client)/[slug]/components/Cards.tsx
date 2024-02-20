"use client";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
import UsernameNotfound from "./UsernameNotfound";
import { store, storeItem } from "../..";
import getSymbolFromCurrency from "currency-symbol-map";
import {
  CalendarClock,
  FileDown,
  ChevronRightIcon,
  Link,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Cards() {
  const router = useRouter();

  const username = usePathname().substring(1);

  const { data, error } = useQuery<store, AxiosError>(
    ["allProducts", username],
    async () => {
      const response = await axios.get(`/api/publicuser/?username=${username}`);
      return response.data;
    },
    {
      enabled: true,
    }
  );

  if (error?.response?.status === 404) {
    return <UsernameNotfound username={username} />;
  }

  if (error?.response?.status === 500) {
    throw Error("Internal Server Error");
  }

  const currency =
    Array.isArray(data?.storeItems) &&
    (data?.storeItems?.length ?? 0) > 0 &&
    Array.isArray(data?.storeItems[0].currency) &&
    (data?.storeItems[0].currency.length ?? 0) > 0
      ? data?.storeItems[0].currency[0].toUpperCase()
      : "";

  const currencySymbol = getSymbolFromCurrency(currency as string);

  return (
    <div className="flex w-full flex-wrap p-6">
      {data &&
        data.storeItems.map((item: storeItem) =>
          item.itemType === "LINK" ? (
            // Custom UI for LINK itemType
            <div className="md:w-1/2 w-full p-4" key={item.id}>
              <Card
                className="w-full h-44 cursor-pointer rounded-lg hover:bg-primary-background overflow-hidden hover:shadow-md"
                key={item.name}
                onClick={() => {
                  router.push(item.linkUrl);
                }}
              >
                <div className="">
                  <div className="text-xl font-bold text-bold text-secondary-foreground">
                    <div className="flex flex-row justify-between">
                      <div className="p-4 bg-secondary rounded-md">
                        {item.thumbnailUrl ? (
                          <div>
                            {" "}
                            <img
                              src={item.thumbnailUrl}
                              alt="Thumbnail"
                              className="h-36 rounded-md w-36  object-cover" // Adjust the size as needed
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="h-40 w-40 rounded-lg bg-secondary flex items-center justify-center">
                              <Link className="h-16 w-16 text-secondary-foreground" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">{item.name}</div>
                      <div className="flex items-center mr-6">
                        <ExternalLink size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="md:w-1/2 w-full p-4" key={item.id}>
              <Card
                onClick={() => {
                  router.push(`/${username}/${item.id}`);
                }}
                className="w-full h-44 cursor-pointer rounded-lg hover:bg-primary-background hover:shadow-md"
                key={item.id}
              >
                <div className=" p-4">
                  <div className="flex flex-row text-secondary-foreground p-4 bg-secondary rounded-lg h-20">
                    <div className="p-4 text-xl font-semibold">
                      {item?.name}
                    </div>
                  </div>
                  <div className="flex h-20 p-0 items-end justify-between">
                    <div className="mb-6 ml-2">
                      {item.itemType === "DIGITALPRODUCT" ? (
                        <div className="flex gap-2">
                          <FileDown />
                          <div>Digital Product</div>
                        </div>
                      ) : item.itemType === "CALENDAR" ? (
                        <div className="flex gap-2">
                          <CalendarClock />
                          <div>Book a Session</div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="mb-5 font-bold text-secondary-foreground">
                      <Button
                        className="flex w-24 justify-between rounded-full hover:bg-secondary-foreground px-1 p-2 hover:text-primary-foreground border-secondary-foreground text-xl"
                        variant={"outline"}
                      >
                        <div className="flex ml-2">
                          <div className="">{currencySymbol}</div>
                          <div className="">{item?.price}</div>
                        </div>
                        <div className="">
                          <ChevronRightIcon />
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )
        )}
    </div>
  );
}
