"use client";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
import UsernameNotfound from "./UsernameNotfound";
import { store, storeItem } from "../..";
import getSymbolFromCurrency from "currency-symbol-map";
import { CalendarClock, FileDown, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Cards() {
  const router = useRouter();

  const username = usePathname().substring(1);

  const { data, isLoading, error } = useQuery<store, AxiosError>(
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
    data.storeItems.length > 0 &&
    Array.isArray(data.storeItems[0].currency) &&
    data.storeItems[0].currency.length > 0
      ? data.storeItems[0].currency[0].toUpperCase()
      : "";

  const currencySymbol = getSymbolFromCurrency(currency as string);

  console.log(data);
  return (
    <div className="md:flex m-10 gap-6">
      {data &&
        data.storeItems.map((item: storeItem) => (
          <Card
            onClick={() => {
              router.push(`/${username}/${item.id}`);
            }}
            className="w-full md:w-1/2 h-44 cursor-pointer rounded-lg hover:bg-primary-background hover:shadow-md"
            key={item.id}
          >
            <div className=" p-4">
              <div className="flex flex-row text-secondary-foreground p-4 bg-secondary rounded-lg h-20">
                <div className="p-4 text-xl font-semibold">{item?.name}</div>
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
        ))}
    </div>
  );
}
