"use client";
import React from "react";
import TopBar from "../components/topBar";
import { Separator } from "@/components/ui/separator";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthDetails } from "../components/AuthContext";
import { useQuery } from "@tanstack/react-query";
import AxiosApi from "../services/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { AxiosError } from "axios";

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
  const storeUrl = authDetails?.storeUrl;
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
        {isLoading ? (
          <div>
            <Card className="w-full flex flex-col gap-4 p-5">
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
            </Card>
          </div>
        ) : (
          <Card className="md:w-2/3 w-full">
            <CardHeader title="page visits">
              <CardTitle className="text-foreground">Store Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="#f0f0f0"
                    strokeDasharray="3 3"
                  />
                  <XAxis dataKey="date" />
                  <YAxis axisLine={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="pageView"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Page;
