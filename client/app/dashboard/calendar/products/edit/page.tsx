"use client";
import React, { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import AxiosApi from "@/app/services/axios";
import { useAuthDetails } from "@/app/components/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import CalendarProductEdit from "./CalendarProductEdit";
import { CalendarProductApiResponse } from "@/types/apiResponse";
import { Button } from "@/components/ui/button";
import CalendarProductSelect from "./CalendarProductSelect";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/lib/utils";

function Page() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const authDetails = useAuthDetails();
  const id = searchParams.get("id");
  const tab = searchParams.get("tab");

  const updateUrl = useCallback(
    (tab: string) => {
      const url = "/dashboard/calendar/products/edit?id=" + id + "&tab=" + tab;
      router.push(url);
    },
    [router, id]
  );

  useEffect(() => {
    if (!tab) {
      updateUrl("setup");
    }
  }, [tab, updateUrl]);

  if (!id) {
    router.push("/");
  }

  const productId = id ? parseInt(id as string) : null;

  const { data, isLoading, status, error } = useQuery<
    CalendarProductApiResponse,
    AxiosError<ErrorResponse>
  >(
    ["product", productId],
    async () => {
      const response = await AxiosApi(
        "GET",
        `/api/calendar-products/getCalendarProduct/?id=${productId}&storeId=${authDetails?.storeId}`,
        authDetails
      );
      return response.data;
    },
    {
      cacheTime: 0,
      enabled: !!authDetails?.storeId,
    }
  );

  useEffect(() => {
    if (status === "error") {
      toast({
        title: "Error",
        description: error.response?.data.error,
        duration: 3000,
      });
      router.push("/dashboard/calendar/products");
    }
  }, [status, error, toast, router]);
  return (
    <div>
      {isLoading || status === "error" ? (
        <Card className="md:w-1/2">
          <Skeleton className="h-6 w-1/2 m-4" />
          <Skeleton className="h-4 w-10/12 m-4" />
          <Skeleton className="h-4 w-10/12 m-4" />
          <Skeleton className="h-4 w-10/12 m-4" />
        </Card>
      ) : (
        <div>
          <div className="flex space-x-2">
            <Button
              value="Setup"
              key="setup"
              variant="ghost"
              className={
                tab === "setup" ? "text-overlay-foreground bg-overlay" : ""
              }
              onClick={() => updateUrl("setup")}
            >
              Setup
            </Button>
            <Button
              value="availability"
              key="availability"
              variant="ghost"
              className={
                tab === "availability"
                  ? "text-overlay-foreground bg-overlay"
                  : ""
              }
              onClick={() => updateUrl("availability")}
            >
              Availability
            </Button>
          </div>
          {tab === "availability" && data.scheduleId ? (
            <CalendarProductSelect
              currentScheduleId={String(data.scheduleId)}
              productId={productId || -1}
            />
          ) : (
            <CalendarProductEdit
              data={data}
              productId={productId || -1}
            ></CalendarProductEdit>
          )}
        </div>
      )}
    </div>
  );
}

export default Page;
