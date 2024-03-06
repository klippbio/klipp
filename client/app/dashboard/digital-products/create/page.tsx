"use client";
import React, { useEffect } from "react";
import ProfileForm, { DigitalProductDataType } from "./profileForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import AxiosApi from "@/app/services/axios";
import { useAuthDetails } from "@/app/components/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/lib/utils";

function Page() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const authDetails = useAuthDetails();

  const id = searchParams.get("id");

  if (!id) {
    router.push("/");
  }
  const productId = id ? parseInt(id as string) : null;

  const { data, isLoading, status, error } = useQuery<
    DigitalProductDataType,
    AxiosError<ErrorResponse>
  >(
    ["product", productId],
    async () => {
      const response = await AxiosApi(
        "GET",
        `/api/digital-products/getproduct/?id=${productId}&storeId=${authDetails?.storeId}`,
        authDetails
      );
      return response.data;
    },
    {
      cacheTime: 0,
      enabled: !!productId && !!authDetails?.storeId,
    }
  );

  useEffect(() => {
    if (status === "error") {
      toast({
        title: "Error",
        description: error.response?.data.error,
        duration: 3000,
      });
      router.push("/dashboard/digital-products");
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
        <ProfileForm data={data} productId={productId || 0}></ProfileForm>
      )}
    </div>
  );
}

export default Page;
