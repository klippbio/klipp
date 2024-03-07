"use client";
import React from "react";
import TopBar from "../components/topBar";
import { Separator } from "@/components/ui/separator";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthDetails } from "../components/AuthContext";
import { useQuery } from "@tanstack/react-query";
import AxiosApi from "../services/axios";
import { AxiosError } from "axios";
import PageView from "./components/PageView";
import CustomeSkeleton from "./components/CustomeSkeleton";
import DashboardCards from "./components/DashboardCards";

type PageViewData = {
  date: string;
  pageView: number;
};

//eslint-disable-next-line
function convertDateToDay(data: any) {
  //eslint-disable-next-line
  return data.map((item: any) => {
    const day = new Date(item.date).toLocaleDateString("en-US", {
      weekday: "short",
    });
    return { ...item, date: day };
  });
}

function Page() {
  const authDetails = useAuthDetails();
  const storeUrl = authDetails?.storeUrl?.toLowerCase();
  const storeId = authDetails?.storeId;

  const { data, isLoading } = useQuery<Array<PageViewData>, AxiosError>(
    ["allLinks", storeId],
    async () => {
      const response = await AxiosApi(
        "GET",
        `/api/storeanalytics/?storeId=${storeId}&storeurl=${storeUrl}`,
        {},
        authDetails
      );
      return convertDateToDay(response.data);
    },
    {
      enabled: !!storeId && !!storeUrl,
    }
  );

  return (
    <div className="h-screen relative">
      <div className="sticky top-0 z-50 bg-background ">
        <TopBar pageTitle="Dashboard" className="mx-4 md:mx-8" />
        <Separator className="mt-4" orientation="horizontal" />
      </div>
      <div className="mx-4 md:mx-8 mt-8 overflow-auto pb-20 md:pb-0">
        {isLoading && !data ? (
          <div>
            <CustomeSkeleton />
          </div>
        ) : (
          <div className="flex items-center flex-col justify-center">
            <div className="text-2xl mb-6 font-bold">Hey {storeUrl} 👋</div>
            <Card className="md:w-2/3 w-full shadow-xl">
              <CardHeader title="page visits">
                <CardTitle className="text-foreground">Store Visits</CardTitle>
              </CardHeader>
              <CardContent>
                <PageView data={data} />
              </CardContent>
            </Card>
            <div className="md:w-2/3 w-full mt-10">
              <DashboardCards />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
